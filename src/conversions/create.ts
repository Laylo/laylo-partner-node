import { configuration } from "config";
import { getIsValidConfiguration, makeRequest } from "lib";

export type CreateConversionParams = {
  customerApiKey: string;
  action: string;
  name: string;
  relatedProductId?: string;
};

export type LayloConversion = {
  id: string;
  action: string;
  name: string;
};

export const createConversion = async ({
  customerApiKey,
  action,
  name,
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
