import { getIsValidConfiguration } from "lib";
import { sendMessageToApi } from "./lib/sendMessageToApi";

type ScheduleParams = {
  customerApiKey: string;
  phoneNumbers: string[];
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
}: ScheduleParams) => {
  const isValidConfiguration = getIsValidConfiguration();

  if (isValidConfiguration.status === "failure") {
    throw new Error(isValidConfiguration.message);
  }

  return await sendMessageToApi({
    customerApiKey,
    phoneNumbers,
    message,
    name,
    sendAt,
  });
};
