import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import test from "node:test";
import { getJson } from "../lib/https-json.mjs";

function transport(statusCode, body) {
  return (_url, _options, callback) => {
    const request = new EventEmitter();
    request.setTimeout = () => {};
    request.destroy = (error) => request.emit("error", error);
    process.nextTick(() => {
      const response = new EventEmitter();
      response.statusCode = statusCode;
      response.setEncoding = () => {};
      response.resume = () => {};
      response.destroy = (error) => response.emit("error", error);
      callback(response);
      if (statusCode >= 200 && statusCode < 300) {
        response.emit("data", body);
        response.emit("end");
      }
    });
    return request;
  };
}

test("reads JSON through the injected HTTPS transport", async () => {
  assert.deepEqual(await getJson("https://example.test", {}, transport(200, '{"ok":true}')), { ok: true });
});

test("rejects non-success provider responses", async () => {
  await assert.rejects(getJson("https://example.test", {}, transport(503, "unavailable")), /HTTP 503/);
});
