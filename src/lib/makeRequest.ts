import https from "https";
import { IncomingMessage } from "http";
import { getAuthorizationHeader } from "./getAuthorizationHeader";
import { configuration } from "config";
import { getIsValidConfiguration } from "lib";

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
  body: Record<string, unknown> | any[];
}> => {
  const isValidConfiguration = getIsValidConfiguration();

  if (isValidConfiguration.status === "failure") {
    throw new Error(isValidConfiguration.message);
  }

  const timestamp = Date.now().toString();
  const authorization = getAuthorizationHeader({ timestamp });

  const options: https.RequestOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authorization}`,
      creatorId: "sdk",
      layloFid: "sdk",
    },
  };

  // add timestamp to data. have to see if payload is formatted for kinesis or lambda
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

    if (data) {
      req.write(JSON.stringify(updatedData));
    }

    req.end();
  });
};
