import { configuration } from "config";
import { PARTNER_API_URL } from "config/consts";
import { makeRequest } from "lib";
import { LayloDrop } from "./types";

export type ListDropParams = {
  customerApiKey: string;
};

export const listDrops = async ({ customerApiKey }: ListDropParams) => {
  const response = await makeRequest({
    url: PARTNER_API_URL,
    method: "POST",
    data: {
      type: "drops.list",
      payload: {
        apiKey: customerApiKey,
        source: configuration.companyName,
        integratorId: configuration.id,
      },
    },
  });

  const responseBody = response.body as LayloDrop[];

  return responseBody;
};
