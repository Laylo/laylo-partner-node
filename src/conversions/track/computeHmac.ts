import crypto from "crypto";

export const computeHmac = (message: string, key: string) => {
  const hmac = crypto.createHmac("sha256", key);
  hmac.update(message);

  return hmac.digest("hex");
};
