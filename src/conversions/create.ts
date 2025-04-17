import { configuration } from "config";
import { PARTNER_API_URL } from "config/consts";
import { makeRequest } from "lib";

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
  try {
    const response = await makeRequest({
      url: PARTNER_API_URL,
      method: "POST",
      data: {
        type: "conversions.create",
        payload: {
          apiKey: customerApiKey,
          name,
          action,
          relatedProductId,
          source: configuration.companyName,
          integratorId: configuration.id,
        },
      },
    });

    const conversion = response.body as LayloConversion;

    return conversion;
  } catch (error) {
    throw new Error(
      `Laylo SDK - Failed to create conversion: ${JSON.stringify(
        error,
        null,
        2
      )}`
    );
  }
};
