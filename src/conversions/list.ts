import { configuration } from "config";
import { getIsValidConfiguration, makeRequest } from "lib";

export type CreateConversionParams = {
  customerApiKey: string;
  action?: ["PURCHASE", "ADD_TO_CART", "LINK_CLICK"];
  name: string;
  relatedProductId?: string;
};

export type LayloConversion = {
  id: string;
  action: string;
  name: string;
};

export const listConversions = async ({
  customerApiKey,
  action,
  relatedProductId,
}: CreateConversionParams) => {
  const isValidConfiguration = getIsValidConfiguration();

  if (isValidConfiguration.status === "failure") {
    throw new Error(isValidConfiguration.message);
  }

  const response = await makeRequest("https://events.laylo.com/api/partner", {
    type: "createConversion",
    payload: {
      apiKey: customerApiKey,
      name,
      action,
      relatedProductId,
      source: configuration.companyName,
      integratorId: configuration.id,
    },
  });

  const responseBody = JSON.parse(response.body) as LayloConversion;

  return responseBody;
};
