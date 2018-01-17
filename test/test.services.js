/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { assert } from "chai";
import WebService from "../src/services/webService";

describe("WebService", () => {
  it("key=value", () => {
    const conf = { url: "localhost" };
    const webservice = new WebService(conf);
    assert.isObject(webservice, "webservice is null");
  });
});
