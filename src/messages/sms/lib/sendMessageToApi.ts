import { configuration } from "config";
import { PARTNER_API_URL } from "config/consts";
import { LayloSegmentConfiguration } from "fans/segments/getSegment";
import { makeRequest } from "lib";
import { SendSMSResponse } from "messages/types";

export const sendMessageToApi = async ({
  customerApiKey,
  phoneNumbers,
  segmentConfiguration,
  message,
  name,
  sendAt,
}: {
  customerApiKey: string;
  name: string;
  phoneNumbers?: string[];
  segmentConfiguration?: LayloSegmentConfiguration;
  message: string;
  layloProductId?: string;
  sendAt?: string;
}): Promise<SendSMSResponse> => {
  try {
    await makeRequest({
      url: PARTNER_API_URL,
      method: "POST",
      data: {
        type: "messages.sms.send",
        payload: {
          apiKey: customerApiKey,
          name,
          message,
          phoneNumbers,
          segmentConfiguration,
          sendAt,
        },
      },
    });

    return {
      status: "success",
      payload: {
        customerApiKey: `${customerApiKey.slice(
          0,
          4
        )}****${customerApiKey.slice(-4)}`,
        name,
        source: configuration.companyName,
        message,
        sendAt: sendAt || "now",
      },
    };
  } catch (error) {
    throw new Error(
      `Laylo SDK - Failed to send message: ${JSON.stringify(error, null, 2)}`
    );
  }
};
