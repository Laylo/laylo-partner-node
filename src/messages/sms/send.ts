import { getIsValidConfiguration } from "lib";
import { sendMessageToApi } from "./lib/sendMessageToApi";

type SendParams = {
  customerApiKey: string;
  phoneNumbers: string[];
  message: string;
  name: string;
};

export const send = async ({
  customerApiKey,
  phoneNumbers,
  message,
  name,
}: SendParams) => {
  const isValidConfiguration = getIsValidConfiguration();

  if (isValidConfiguration.status === "failure") {
    throw new Error(isValidConfiguration.message);
  }

  return await sendMessageToApi({
    customerApiKey,
    phoneNumbers,
    message,
    name,
  });
};
