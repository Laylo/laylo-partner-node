import https from "https";
import { IncomingMessage } from "http";

export const makeRequest = async (
  url: string,
  options: https.RequestOptions,
  data: string
): Promise<{
  status: IncomingMessage["statusCode"];
  headers: IncomingMessage["headers"];
  body: string;
}> => {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: responseData,
        });
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (data) {
      req.write(data);
    }

    req.end();
  });
};
