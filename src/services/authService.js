/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import "whatwg-fetch";
import UrlBuilder from "../utils/urlBuilder";

export default class AuthService {
  constructor(client) {
    if (client && client.provider) {
      throw new Error("Provider authentification not implemented");
    } else if (
      !client ||
      !client.clientId ||
      !client.clientSecret ||
      !client.url
    ) {
      throw new Error("AuthClient not configured");
    }
    this.client = { ...client };
    this.urlBuilder = new UrlBuilder(client.url);
    this.resetAttributes();
    this.needToLoad = true;
  }

  resetAttributes() {
    this.authorized = false;
    this.accessToken = null;
    this.expiresIn = null;
    this.scope = null;
  }

  loadAttributes() {
    /* global window */
    this.accessToken = window.localStorage.getItem("access_token");
    this.expiresIn = window.localStorage.getItem("expires_in");
    this.scope = window.localStorage.getItem("scope");
    this.needToLoad = false;
  }

  checkAuthentification(shouldReset = false) {
    if (!this.accessToken) {
      this.loadAttributes();
    } else if (shouldReset) {
      this.resetAttributes();
    }
  }

  isAuthenticated() {
    this.checkAuthentification();
    return this.accessToken != null;
  }

  isAccessTokenValid() {
    this.checkAuthentification(true);
    return !!this.accessToken;
  }

  getClientId() {
    return this.client.clientId;
  }

  async authenticateUser({ username, password }) {
    // Authorization request
    // TODO password salt
    // console.log("WIP", `AuthService.requestAccessToken
    // ${username}${password} ${this.client.url}`);
    const url = this.urlBuilder.createUrl("access_token/");

    const body = {
      username,
      password,
      client_id: this.client.clientId,
      redirect_uri: "localhost",
      grant_type: "password",
    };

    try {
      const response = await fetch(url, {
        body: JSON.stringify(body),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      });
      if (response.status < 200 || response.status > 300) {
        const error = new Error(response.statusText);
        error.response = response;
        this.resetAccess();
        throw error;
      }

      const session = await response.json();
      if (session.error) {
        this.resetAccess();
        throw session.error;
      }

      this.accessToken = session.access_token;
      window.localStorage.setItem("access_token", this.accessToken);
      this.expiresIn = session.expires_in;
      window.localStorage.setItem("expires_in", this.expiresIn);
      this.scope = session.scope;
      window.localStorage.setItem("scope", this.scope);
      this.authorized = true;
      window.localStorage.setItem("authorized", "true");
      return this.getAttributes();
    } catch (error) {
      this.resetAccess();
      throw error;
    }
  }

  async authorizeUser({ username, password, scope }) {
    const url = this.urlBuilder.createUrl("authorize/");

    const body = {
      username,
      password,
      scope,
      client_id: this.client.clientId,
    };
    if (this.scope === null) {
      this.resetAccess();
    }

    try {
      const response = await fetch(url, {
        body: JSON.stringify(body),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      });
      if (response.status < 200 || response.status > 300) {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      }

      const session = await response.json();
      if (session.error) {
        throw session.error;
      }

      return session;
    } catch (error) {
      throw error;
    }
  }

  async createUser({ username, email, password, accept }) {
    let url = this.urlBuilder.createUrl("user");
    url = this.buildAuthUrl(url.href);

    const body = {
      username,
      email,
      password,
      accept,
      client_id: this.client.clientId,
    };
    if (this.scope === null) {
      this.resetAccess();
    }

    try {
      const response = await fetch(url, {
        body: JSON.stringify(body),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      });
      if (response.status < 200 || response.status > 300) {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      }

      const session = await response.json();
      if (session.error) {
        throw session.error;
      }

      return session;
    } catch (error) {
      throw error;
    }
  }

  async updateAccountState({ userId, newState }) {
    let url = this.urlBuilder.createUrl("validate");
    url = this.buildAuthUrl(url.href);

    const body = {
      userId,
      newState,
      client_id: this.client.clientId,
    };
    try {
      const response = await fetch(url, {
        body: JSON.stringify(body),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      });
      if (response.status < 200 || response.status > 300) {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      }

      const session = await response.json();
      if (session.error) {
        throw session.error;
      }

      return session;
    } catch (error) {
      throw error;
    }
  }

  getAttributes() {
    return {
      accessToken: this.accessToken,
      expiresIn: this.expiresIn,
      scope: this.scope,
    };
  }

  resetAccess() {
    this.resetAttributes();
    /* global window */
    window.localStorage.removeItem("authorized");
    window.localStorage.removeItem("access_token");
    window.localStorage.removeItem("expires_in");
    window.localStorage.removeItem("scope");
  }

  buildAuthUrl(url) {
    if (this.isAuthenticated()) {
      let n = "?access_token=";
      if (url.indexOf("?") > -1) {
        n = "&access_token=";
      }

      return url + n + this.accessToken;
    }
    // TODO check if auth is ok
    return url;
  }
}
