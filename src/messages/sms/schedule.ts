import { LayloSegmentConfiguration } from "fans/segments/getSegment";
import { sendMessageToApi } from "./lib/sendMessageToApi";
import { configuration } from "config";

type ScheduleParams = {
  customerApiKey: string;
  phoneNumbers?: string[];
  segmentConfiguration?: LayloSegmentConfiguration;
  message: string;
  name: string;
  sendAt: string;
};

export const schedule = async ({
  customerApiKey,
  phoneNumbers,
  message,
  name,
  sendAt,
  segmentConfiguration,
}: ScheduleParams) => {
  try {
    const response = await sendMessageToApi({
      customerApiKey,
      phoneNumbers,
      segmentConfiguration,
      message,
      name,
      sendAt,
    });

    return response;
  } catch (error) {
    throw new Error(
      `Laylo SDK - Failed to schedule message: ${JSON.stringify(
        error,
        null,
        2
      )}`
    );
  }
};
