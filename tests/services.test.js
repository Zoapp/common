/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import WebService from "../src/services/webService";

describe("WebService", () => {
  it("init", () => {
    const conf = { url: "localhost" };
    const webservice = new WebService(conf);
    expect(typeof webservice).toBe("object");
  });
});
