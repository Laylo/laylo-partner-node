import { configuration } from "config";

export const getIsValidConfiguration = () => {
  if (
    !configuration.accessKey ||
    !configuration.secretKey ||
    !configuration.id
  ) {
    console.error(
      "You must configure the Laylo SDK with an id, access key, and secret key using the config method."
    );

    return {
      status: "failure",
      message:
        "You must configure the Laylo SDK with an id, access key, and secret key using the config method.",
    };
  }

  return {
    status: "success",
    message: "Configuration is valid",
  };
};
