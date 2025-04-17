import { config, configuration } from "config";
import { PARTNER_API_URL } from "config/consts";
import { makeRequest } from "lib";

export type LayloLocation = {
  city: string;
  state?: string;
  country: string;
  radius: number;
};

export type LayloSegmentConfiguration = {
  dropIds?: string[];
  excludedDropIds?: string[];
  conversionIds?: string[];
  excludedConversionIds?: string[];
  locations?: LayloLocation[];
  excludedLocations?: LayloLocation[];
  signUpType: "sms" | "email";
};

export type GetSegmentParams = {
  customerApiKey: string;
} & LayloSegmentConfiguration;

export type LayloSegment = {
  numberOfFans: number;
};

export const getSegment = async ({
  customerApiKey,
  dropIds,
  excludedDropIds,
  conversionIds,
  excludedConversionIds,
  locations,
  excludedLocations,
  signUpType,
}: GetSegmentParams) => {
  try {
    const response = await makeRequest({
      url: PARTNER_API_URL,
      method: "POST",
      data: {
        type: "fans.segments.getSegment",
        payload: {
          apiKey: customerApiKey,
          dropIds,
          excludedDropIds,
          conversionIds,
          excludedConversionIds,
          locations,
          excludedLocations,
          signUpType,
        },
      },
    });

    const data = response.body as LayloSegment;

    return data;
  } catch (error) {
    return {
      status: "failure",
      message: `Laylo SDK - Failed to get segment: ${JSON.stringify(
        error,
        null,
        2
      )}`,
    };
  }
};
