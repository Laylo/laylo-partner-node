import { LayloAction, Metadata, User } from "../types";
import { isValidActionName } from "../lib";
import { Configuration } from "../../config";

export const hasTrackError = ({
  configuration,
  action,
  name,
  user,
  metadata,
  customerApiKey,
}: {
  configuration: Configuration;
  action: LayloAction;
  name: string;
  user: User;
  metadata: Metadata;
  customerApiKey: string;
}) => {
  if (
    !configuration.id ||
    !configuration.accessKey ||
    !configuration.secretKey
  ) {
    console.error(
      "You must configure the Laylo SDK with an id, access key, and secret key using the config method."
    );
    return "You must configure the Laylo SDK with an id, access key, and secret key using the config method.";
  }

  if (!isValidActionName(action)) {
    console.error(
      "The action must be one of the following: 'PURCHASE', 'CHECK_IN', 'ADD_TO_CART'."
    );

    return "The action must be one of the following: 'PURCHASE', 'CHECK_IN', 'ADD_TO_CART'.";
  }

  if (!customerApiKey) {
    console.error(
      "You must provide your customer's API key in order to track the event."
    );
    return "You must provide your customer's API key in order to track the event.";
  }

  if (!action) {
    console.error(
      "You must provide an action for the conversion. This allows for filtering and grouping events."
    );
    return "You must provide an action for the conversion. This allows for filtering and grouping events.";
  }

  if (!name) {
    console.error(
      "You must provide a name for the event. This should be human readable such as 'MSG_SHOW_04_05_2025'."
    );
    return "You must provide a name for the event. This should be human readable such as 'MSG_SHOW_04_05_2025'.";
  }

  if (!user.email && !user.phone) {
    console.error(
      "You must provide either an email or a phone number for the user."
    );
    return "You must provide either an email or a phone number for the user.";
  }

  if (metadata.totalPrice) {
    const amountRegex = /^-?\d{1,16}(\.\d{1,2})?$/;

    if (!amountRegex.test(String(metadata.totalPrice))) {
      console.error(
        "The total price must be a decimal number with no more than two decimal places and no more than 16 digits before the decimal place."
      );

      return "The total price must be a decimal number with no more than two decimal places and no more than 16 digits before the decimal place.";
    }
  }

  if (metadata.currency && metadata.currency.length !== 3) {
    console.error(
      "The currency code must be a three-letter ISO 4217 currency code."
    );

    return "The currency code must be a three-letter ISO 4217 currency code.";
  }

  if (metadata.currency && !metadata.totalPrice) {
    console.error(
      "You must provide a total price if you are providing a currency."
    );

    return "You must provide a total price if you are providing a currency.";
  }

  if (metadata.totalPrice && !metadata.currency) {
    console.error(
      "You must provide a currency if you are providing a total price."
    );

    return "You must provide a currency if you are providing a total price.";
  }

  return false;
};
