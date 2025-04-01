import { configuration } from "config";
import crypto from "crypto";

export const getAuthorizationHeader = ({
  timestamp,
}: {
  timestamp: string;
}) => {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64");

  const encodedPayload = Buffer.from(
    JSON.stringify({
      timestamp,
      userId: configuration.id,
      accessKey: configuration.accessKey,
    })
  ).toString("base64");

  const signature = crypto
    .createHmac("sha256", configuration.secretKey)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64");

  const authorization = `${encodedHeader}.${encodedPayload}.${signature}`;

  return authorization;
};
