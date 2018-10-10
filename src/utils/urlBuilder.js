export default class UrlBuilder {
  constructor(clientUrl) {
    this.clientUrl = clientUrl;
  }

  createUrl(route) {
    try {
      const url = new URL(route, this.clientUrl);
      return url;
    } catch (e) {
      const base = new URL(this.clientUrl, window.location.href);
      return new URL(route, base.href);
    }
  }

  createWsUrl(route) {
    const url = this.createUrl(route);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    return url;
  }
}
