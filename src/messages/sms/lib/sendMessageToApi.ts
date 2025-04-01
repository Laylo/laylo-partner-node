import { configuration } from "config";
import { makeRequest } from "lib";
import { SendSMSResponse } from "messages/types";

export const sendMessageToApi = async ({
  customerApiKey,
  phoneNumbers,
  message,
  name,
  sendAt,
}: {
  customerApiKey: string;
  name: string;
  phoneNumbers: string[];
  message: string;
  layloProductId?: string;
  sendAt?: string;
}): Promise<SendSMSResponse> => {
  const response = await makeRequest("https://events.laylo.com/messages/sms", {
    Data: {
      type: "sendSms",
      payload: {
        apiKey: customerApiKey,
        name,
        source: configuration.companyName,
        message,
        phoneNumbers,
        sendAt,
        integratorId: configuration.id,
      },
    },
    PartitionKey: configuration.id,
  });

  const responseBody = JSON.parse(response.body) as
    | { message: string }
    | { SequenceNumber: string };

  if ((responseBody as { SequenceNumber: string }).SequenceNumber) {
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
        numberOfPhoneNumbers: phoneNumbers.length,
        sendAt: sendAt || "now",
      },
    };
  }

  return {
    status: "failure",
    ...(responseBody as {
      message: string;
    }),
  };
};
