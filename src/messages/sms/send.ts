import { LayloSegmentConfiguration } from "fans/segments/getSegment";
import { sendMessageToApi } from "./lib/sendMessageToApi";

type SendParams = {
  customerApiKey: string;
  phoneNumbers?: string[];
  message: string;
  name: string;
  segmentConfiguration?: LayloSegmentConfiguration;
};

export const send = async ({
  customerApiKey,
  phoneNumbers,
  segmentConfiguration,
  message,
  name,
}: SendParams) => {
  try {
    const response = await sendMessageToApi({
      customerApiKey,
      phoneNumbers,
      segmentConfiguration,
      message,
      name,
    });

    return response;
  } catch (error) {
    throw new Error(
      `Laylo SDK - Failed to send message: ${JSON.stringify(error, null, 2)}`
    );
  }
};
