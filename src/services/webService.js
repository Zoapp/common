/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import "whatwg-fetch";

import UrlBuilder from "../utils/urlBuilder";

export default class WebService {
  constructor(client, authService) {
    if (client && client.provider) {
      throw new Error("Provider authentification not implemented");
    } else if (!client || !client.url) {
      throw new Error("WebClient not configured");
    }
    this.urlBuilder = new UrlBuilder(client.url);
    this.client = { ...client };
    this.authService = authService;
  }

  buildHttpUrl(route) {
    const url = this.urlBuilder.createUrl(route);
    return this.authService.buildAuthUrl(url.href);
  }

  buildWsUrl(route) {
    const url = this.urlBuilder.createWsUrl(route);
    return this.authService.buildAuthUrl(url.href);
  }

  async send(route, data, method, auth) {
    const isAuth = this.authService.isAuthenticated();
    const clientId = this.authService.getClientId();
    const url = this.buildHttpUrl(route);

    if (!isAuth && auth) {
      throw new Error("not authenticated");
    }

    const headers = {
      client_id: clientId,
      Accept: "application/json",
    };

    const config = {
      method,
    };

    if (data !== null) {
      headers["Content-Type"] = "application/json";
      config.body = JSON.stringify(data);
    }

    config.headers = headers;

    try {
      const response = await fetch(url, config);
      if (response.status < 200 || response.status > 300) {
        const res = (await response.json()).error;
        const error = {
          message: res ? res.message : response.statusText,
          type: res ? res.type : "error",
          status: response.status,
        };
        throw error;
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }

  get(route, auth = true) {
    return this.send(route, null, "get", auth);
  }

  post(route, inputData, auth = true) {
    return this.send(route, inputData, "post", auth);
  }

  put(route, inputData, auth = true) {
    return this.send(route, inputData, "put", auth);
  }

  delete(route, auth = true) {
    return this.send(route, null, "delete", auth);
  }
}
