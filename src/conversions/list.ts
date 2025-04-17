import { configuration } from "config";
import { PARTNER_API_URL } from "config/consts";
import { makeRequest } from "lib";
import { LayloConversion } from "./types";

type ActionType = "PURCHASE" | "ADD_TO_CART" | "LINK_CLICK";

export type ListConversionParams = {
  customerApiKey: string;
  action?: ActionType[];
  relatedProductId?: string;
};

export const listConversions = async ({
  customerApiKey,
  action,
  relatedProductId,
}: ListConversionParams) => {
  const response = await makeRequest({
    url: PARTNER_API_URL,
    method: "POST",
    data: {
      type: "conversions.list",
      payload: {
        apiKey: customerApiKey,
        action,
        relatedProductId,
        source: configuration.companyName,
        integratorId: configuration.id,
      },
    },
  });

  const conversions = response.body as LayloConversion[];

  return conversions;
};
