import { get as httpsGet } from "node:https";

export function getJson(url, options = {}, get = httpsGet) {
  return new Promise((resolve, reject) => {
    const request = get(url, options, (response) => {
      if (!response.statusCode || response.statusCode < 200 || response.statusCode >= 300) {
        response.resume();
        reject(new Error(`HTTP ${response.statusCode || "unknown"}`));
        return;
      }
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        body += chunk;
        if (body.length > 5_000_000) response.destroy(new Error("Response exceeds 5 MB"));
      });
      response.on("error", reject);
      response.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    });
    request.setTimeout(30_000, () => request.destroy(new Error("Request timed out after 30 seconds")));
    request.on("error", reject);
  });
}
