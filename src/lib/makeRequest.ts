import https from "https";
import { IncomingMessage } from "http";
import { getAuthorizationHeader } from "./getAuthorizationHeader";
import { getIsValidConfiguration } from "./getIsValidConfiguration";
import { configuration } from "../config";

export const makeRequest = async ({
  url,
  method,
  data,
}: {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}): Promise<{
  status: IncomingMessage["statusCode"];
  headers: IncomingMessage["headers"];
  body: string;
}> => {
  const isValidConfiguration = getIsValidConfiguration();

  if (isValidConfiguration.status === "failure") {
    throw new Error(isValidConfiguration.message);
  }

  const timestamp = Date.now().toString();
  const authorization = getAuthorizationHeader({ timestamp });

  const options: https.RequestOptions = {
    method,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authorization}`,
      creatorId: "sdk",
      layloFid: "sdk",
    },
  };

  const updatedData = data.Data
    ? {
        ...data,
        Data: {
          ...data.Data,
          payload: {
            ...data.Data.payload,
            timestamp,
          },
        },
      }
    : {
        ...data,
        payload: {
          ...data.payload,
          integratorId: configuration.id,
          source: configuration.companyName,
          timestamp,
        },
      };

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
          body: JSON.parse(responseData ?? "{}"),
        });
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });

    if (data) {
      req.write(JSON.stringify(updatedData));
    }

    req.end();
  });
};
