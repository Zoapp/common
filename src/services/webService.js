/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import "whatwg-fetch";

export default class WebService {
  constructor(client, authService) {
    if (client && client.provider) {
      throw new Error("Provider authentification not implemented");
    } else if (!client || !client.url) {
      throw new Error("WebClient not configured");
    }
    this.client = { ...client };
    this.authService = authService;
  }

  createUrl(route) {
    const url = this.client.url + route;
    return url;
  }

  buildUrl(route, protocol = "http") {
    const url = this.createUrl(route);
    return this.authService.buildAuthUrl(url, protocol);
  }

  send(route, data, method, auth) {
    const isAuth = this.authService.isAuthenticated();
    const clientId = this.authService.getClientId();
    const url = this.buildUrl(route);

    if ((!isAuth) && auth) {
      Promise.reject(new Error("not authenticated"));
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

    return fetch(url, config)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        }
        const error = new Error(response.statusText);
        error.response = response;
        return Promise.reject(error);
      });
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
