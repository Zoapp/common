import UrlBuilder from "../../src/utils/urlBuilder";

/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe("api url tests", () => {
  beforeAll(() => {
    const windowLocation = JSON.stringify(window.location);
    delete window.location;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: JSON.parse(windowLocation)
    });
  })

  function setWindowLocation(url) {
    Object.defineProperty(window.location, 'href', {
      writable: true,
      value: url
    });
  }

  it("setting full path", async () => {
    const conf = { url: "http://localhost/api/v1/" };
    const urlBuilder = new UrlBuilder(conf.url);
    expect(urlBuilder.createUrl("admin/languages").href).toEqual("http://localhost/api/v1/admin/languages");
  });

  it("setting full path with port", async () => {
    const conf = { url: "http://localhost:8080/api/v1/" };
    const urlBuilder = new UrlBuilder(conf.url);
    expect(urlBuilder.createUrl("admin/languages").href).toEqual("http://localhost:8080/api/v1/admin/languages");
  });

  it("https", async () => {
    const conf = { url: "http://localhost:8080/api/v1/" };
    const urlBuilder = new UrlBuilder(conf.url);
    expect(urlBuilder.createUrl("admin/languages").href).toEqual("http://localhost:8080/api/v1/admin/languages");
  });

  it("http relative", async () => {
    setWindowLocation('http://n7d7s8zez7.ngrok.io')
    const conf = { url: "/api/v1/" };
    const urlBuilder = new UrlBuilder(conf.url);
    expect(urlBuilder.createUrl("admin").href).toEqual("http://n7d7s8zez7.ngrok.io/api/v1/admin");
    expect(urlBuilder.createUrl("/root").href).toEqual("http://n7d7s8zez7.ngrok.io/root");
    expect(urlBuilder.createUrl("/").href).toEqual("http://n7d7s8zez7.ngrok.io/");
  });

  it("http relative", async () => {
    setWindowLocation('http://n7d7s8zez7.ngrok.io/')
    const conf = { url: "/api/v1/" };
    const urlBuilder = new UrlBuilder(conf.url);
    expect(urlBuilder.createUrl("admin").href).toEqual("http://n7d7s8zez7.ngrok.io/api/v1/admin");
    expect(urlBuilder.createUrl("/root").href).toEqual("http://n7d7s8zez7.ngrok.io/root");
    expect(urlBuilder.createUrl("/").href).toEqual("http://n7d7s8zez7.ngrok.io/");
  });

  it("https relative", async () => {
    setWindowLocation('https://n7d7s8zez7.ngrok.io/')
    const conf = { url: "/api/v1/" };
    const urlBuilder = new UrlBuilder(conf.url);
    expect(urlBuilder.createUrl("admin").href).toEqual("https://n7d7s8zez7.ngrok.io/api/v1/admin");
    expect(urlBuilder.createUrl("/root").href).toEqual("https://n7d7s8zez7.ngrok.io/root");
    expect(urlBuilder.createUrl("/").href).toEqual("https://n7d7s8zez7.ngrok.io/");
  });

  it("https relative", async () => {
    setWindowLocation('https://n7d7s8zez7.ngrok.io/')
    const conf = { url: "/api/v1/" };
    const urlBuilder = new UrlBuilder(conf.url);
    expect(urlBuilder.createUrl("admin").href).toEqual("https://n7d7s8zez7.ngrok.io/api/v1/admin");
    expect(urlBuilder.createUrl("/root").href).toEqual("https://n7d7s8zez7.ngrok.io/root");
    expect(urlBuilder.createUrl("/").href).toEqual("https://n7d7s8zez7.ngrok.io/");
  });

  it("https absolute", async () => {
    setWindowLocation('http://n7d7s8zez7.ngrok.io/')
    const conf = { url: "https://n7d7s8zez7.ngrok.io/api/v1/" };
    const urlBuilder = new UrlBuilder(conf.url);
    expect(urlBuilder.createUrl("admin").href).toEqual("https://n7d7s8zez7.ngrok.io/api/v1/admin");
    expect(urlBuilder.createUrl("/root").href).toEqual("https://n7d7s8zez7.ngrok.io/root");
    expect(urlBuilder.createUrl("/").href).toEqual("https://n7d7s8zez7.ngrok.io/");
  });

  it("http relative with nested window location", async () => {
    setWindowLocation('http://n7d7s8zez7.ngrok.io/a/b/c')
    const conf = { url: "/api/v1/" };
    const urlBuilder = new UrlBuilder(conf.url);
    expect(urlBuilder.createUrl("admin").href).toEqual("http://n7d7s8zez7.ngrok.io/api/v1/admin");
    expect(urlBuilder.createUrl("/root").href).toEqual("http://n7d7s8zez7.ngrok.io/root");
    expect(urlBuilder.createUrl("/").href).toEqual("http://n7d7s8zez7.ngrok.io/");
  });

  it("https absolute localhost", async () => {
    setWindowLocation('http://localhost/')
    const conf = { url: "https://n7d7s8zez7.ngrok.io/api/v1/" };
    const urlBuilder = new UrlBuilder(conf.url);
    expect(urlBuilder.createUrl("admin").href).toEqual("https://n7d7s8zez7.ngrok.io/api/v1/admin");
    expect(urlBuilder.createUrl("/root").href).toEqual("https://n7d7s8zez7.ngrok.io/root");
    expect(urlBuilder.createUrl("/").href).toEqual("https://n7d7s8zez7.ngrok.io/");
  });

  it("defaults to http when no protocol given", async () => {
    setWindowLocation('http://localhost/')
    const conf = { url: "//n7d7s8zez7.ngrok.io/api/v1/" };
    const urlBuilder = new UrlBuilder(conf.url);
    expect(urlBuilder.createUrl("admin").href).toEqual("http://n7d7s8zez7.ngrok.io/api/v1/admin");
    expect(urlBuilder.createUrl("/root").href).toEqual("http://n7d7s8zez7.ngrok.io/root");
    expect(urlBuilder.createUrl("/").href).toEqual("http://n7d7s8zez7.ngrok.io/");
    expect(urlBuilder.createWsUrl("admin").href).toEqual("ws://n7d7s8zez7.ngrok.io/api/v1/admin");
    expect(urlBuilder.createWsUrl("/root").href).toEqual("ws://n7d7s8zez7.ngrok.io/root");
    expect(urlBuilder.createWsUrl("/").href).toEqual("ws://n7d7s8zez7.ngrok.io/");
  });

  it("ws relative", async () => {
    setWindowLocation('http://n7d7s8zez7.ngrok.io/')
    const conf = { url: "/api/v1/" };
    const urlBuilder = new UrlBuilder(conf.url);
    expect(urlBuilder.createWsUrl("admin").href).toEqual("ws://n7d7s8zez7.ngrok.io/api/v1/admin");
    expect(urlBuilder.createWsUrl("/root").href).toEqual("ws://n7d7s8zez7.ngrok.io/root");
    expect(urlBuilder.createWsUrl("/").href).toEqual("ws://n7d7s8zez7.ngrok.io/");
  });

  it("wss absolute", async () => {
    setWindowLocation('http://localhost/')
    const conf = { url: "https://n7d7s8zez7.ngrok.io/api/v1/" };
    const urlBuilder = new UrlBuilder(conf.url);
    expect(urlBuilder.createWsUrl("admin").href).toEqual("wss://n7d7s8zez7.ngrok.io/api/v1/admin");
    expect(urlBuilder.createWsUrl("/root").href).toEqual("wss://n7d7s8zez7.ngrok.io/root");
    expect(urlBuilder.createWsUrl("/").href).toEqual("wss://n7d7s8zez7.ngrok.io/");
  });
});
