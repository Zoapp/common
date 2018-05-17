/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import "whatwg-fetch";

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

  authenticateUser({ username, password }) {
    // Authorization request
    // TODO password salt
    // console.log("WIP", `AuthService.requestAccessToken
    // ${username}${password} ${this.client.url}`);
    const url = this.buildUrl(`${this.client.url}access_token`);
    const that = this;

    const body = {
      username,
      password,
      client_id: this.client.clientId,
      redirect_uri: "localhost",
      grant_type: "password",
    };

    return fetch(url, {
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        }
        const error = new Error(response.statusText);
        error.response = response;
        that.resetAccess();
        return Promise.reject(error);
      })
      .then((session) => {
        if (session.error) {
          that.resetAccess();
          return Promise.reject(session.error);
        }
        /* global window */
        that.accessToken = session.access_token;
        window.localStorage.setItem("access_token", that.accessToken);
        that.expiresIn = session.expires_in;
        window.localStorage.setItem("expires_in", that.expiresIn);
        that.scope = session.scope;
        window.localStorage.setItem("scope", that.scope);
        that.authorized = true;
        window.localStorage.setItem("authorized", "true");
        return Promise.resolve(that.getAttributes());
      })
      .catch((error) => {
        that.resetAccess();
        return Promise.reject(error);
      });
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

  buildUrl(url, protocol) {
    const p = this.getProtocol(protocol);
    return `${p}://${url}`;
  }

  getProtocol(protocol = "http") {
    let p = protocol;
    if (this.client.secure) {
      p += "s";
    }
    return p;
  }

  buildAuthUrl(url, protocol) {
    if (this.isAuthenticated()) {
      let n = "?access_token=";
      if (url.indexOf("?") > -1) {
        n = "&access_token=";
      }

      return this.buildUrl(url, protocol) + n + this.accessToken;
    }
    // TODO check if auth is ok
    return this.buildUrl(url, protocol);
  }
}
