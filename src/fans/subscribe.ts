import { configuration } from "config";
import { PARTNER_API_URL } from "config/consts";
import { makeRequest } from "lib";

export type SubscribeParams = {
  customerApiKey: string;
  email?: string;
  phoneNumber?: string;
};

export const subscribe = async ({
  customerApiKey,
  email,
  phoneNumber,
}: SubscribeParams) => {
  const response = await makeRequest({
    url: PARTNER_API_URL,
    method: "POST",
    data: {
      type: "fans.subscribe",
      payload: {
        apiKey: customerApiKey,
        email,
        phoneNumber,
        source: configuration.companyName,
        integratorId: configuration.id,
      },
    },
  });

  const result = response.body as { success: boolean };

  return result;
};
