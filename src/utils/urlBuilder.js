import Url from 'url-parse';

export default class UrlBuilder {
    
    constructor(clientUrl){
        this.clientUrl = clientUrl;
    }

    createUrl(route) {
        const url = new Url(route, this.clientUrl);
        if (url.origin != "null") {
            return url;
        } else {
            const base = new Url(this.clientUrl, window.location.href);
            return new Url(route, base.href);
        }
    }
    
    createWsUrl(route) {
        const url = this.createUrl(route);
        url.set('protocol', url.protocol === "https:" ? "wss:" : "ws:")
        return url;
    }
}
