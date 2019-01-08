/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import WebService from "../../src/services/webService";
import AuthService from "../../src/services/authService";

jest.mock("../../src/services/authService");

describe("webService", () => {
  beforeEach(() => {
    AuthService.mockClear();
  });

  describe("get", () => {
    it("should return valid data", async () => {
      AuthService.mockImplementation(() => ({
        isAuthenticated: () => true,
        buildAuthUrl: (url) => url,
        getClientId: () => 42,
      }));

      const conf = { url: "https://jsonplaceholder.typicode.com" };
      const webService = new WebService(conf, new AuthService());
      const result = await webService.get("/posts/1");
      expect(result.id).toEqual(1);
    });

    it("should throw an error if status is different than 200", async () => {
      AuthService.mockImplementation(() => ({
        isAuthenticated: () => true,
        buildAuthUrl: (url) => url,
        getClientId: () => 42,
      }));

      const conf = { url: "https://jsonplaceholder.typicode.com" };
      const webService = new WebService(conf, new AuthService());

      try {
        await webService.get("/404");
      } catch (error) {
        expect(error.response.status).toEqual(404);
      }
    });
  });

  describe("post", () => {
    it("should create a valid post request", async () => {
      AuthService.mockImplementation(() => ({
        isAuthenticated: () => true,
        buildAuthUrl: (url) => url,
        getClientId: () => 42,
      }));

      const conf = { url: "https://jsonplaceholder.typicode.com" };
      const webService = new WebService(conf, new AuthService());
      const result = await webService.post("/posts", {
        title: "foo",
        body: "bar",
        userId: 1,
      });
      expect(result.id).toEqual(101);
      expect(result.title).toEqual("foo");
      expect(result.body).toEqual("bar");
      expect(result.userId).toEqual(1);
    });
  });

  describe("put", () => {
    it("should create a valid put request", async () => {
      AuthService.mockImplementation(() => ({
        isAuthenticated: () => true,
        buildAuthUrl: (url) => url,
        getClientId: () => 42,
      }));

      const conf = { url: "https://jsonplaceholder.typicode.com" };
      const webService = new WebService(conf, new AuthService());
      const result = await webService.put("/posts/1", {
        id: 1,
        title: "foo",
        body: "bar",
        userId: 1,
      });
      expect(result.id).toEqual(1);
      expect(result.title).toEqual("foo");
      expect(result.body).toEqual("bar");
      expect(result.userId).toEqual(1);
    });
  });

  describe("delete", () => {
    it("should create a valid delete request", async () => {
      AuthService.mockImplementation(() => ({
        isAuthenticated: () => true,
        buildAuthUrl: (url) => url,
        getClientId: () => 42,
      }));

      const conf = { url: "https://jsonplaceholder.typicode.com" };
      const webService = new WebService(conf, new AuthService());
      await webService.delete("/posts/1");
    });
  });
});
