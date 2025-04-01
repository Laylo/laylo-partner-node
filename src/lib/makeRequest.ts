import https from "https";
import { IncomingMessage } from "http";
import { getAuthorizationHeader } from "./getAuthorizationHeader";

export const makeRequest = async (
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>
): Promise<{
  status: IncomingMessage["statusCode"];
  headers: IncomingMessage["headers"];
  body: string;
}> => {
  const timestamp = Date.now().toString();
  const authorization = getAuthorizationHeader({ timestamp });

  const options: https.RequestOptions = {
    method: "PUT",
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
          body: responseData,
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
