import { LayloAction, LineItem, Metadata, User } from "../types";
import { isValidActionName } from "../lib";
import { Configuration } from "../../config";

export const hasTrackError = ({
  configuration,
  action,
  name,
  user,
  lineItems,
  metadata,
  customerApiKey,
}: {
  configuration: Configuration;
  action: LayloAction;
  name?: string;
  user: User;
  lineItems?: LineItem[];
  metadata: Metadata;
  customerApiKey: string;
}) => {
  if (
    !configuration.id ||
    !configuration.accessKey ||
    !configuration.secretKey
  ) {
    const message =
      "You must configure the Laylo SDK with an id, access key, and secret key using the config method.";

    console.error(message);

    return message;
  }

  if (!isValidActionName(action)) {
    const message =
      "The action must be one of the following: 'PURCHASE', 'CHECK_IN', 'ADD_TO_CART'.";

    console.error(message);

    return message;
  }

  if (!customerApiKey) {
    const message =
      "You must provide your customer's API key in order to track the event.";

    console.error(message);

    return message;
  }

  if (!action) {
    const message = "You must provide an action for the conversion.";

    console.error(message);

    return message;
  }

  const isNormalConversionWithNoName =
    (!name || name === "") && (!lineItems || lineItems.length === 0);

  // we use every because its better to create some conversions then none
  const isLineItemConversionWithNoName = lineItems?.every(
    (lineItem) => !lineItem.name
  );

  if (isNormalConversionWithNoName || isLineItemConversionWithNoName) {
    const message =
      "You must provide a name for the event. This should be human readable such as 'MSG_SHOW_04_05_2025'. If you are including line items then you can leave the name key blank but you must provide a name for each line item instead";

    console.error(message);

    return message;
  }

  if (!user.email && !user.phone) {
    const message =
      "You must provide either an email or a phone number for the user.";

    console.error(message);

    return message;
  }

  if (metadata.totalPrice) {
    const amountRegex = /^-?\d{1,16}(\.\d{1,2})?$/;
    const message =
      "The total price must be a decimal number with no more than two decimal places and no more than 16 digits before the decimal place.";

    if (!amountRegex.test(String(metadata.totalPrice))) {
      console.error(message);

      return message;
    }
  }

  if (metadata.currency && metadata.currency.length !== 3) {
    const message =
      "The currency code must be a three-letter ISO 4217 currency code.";

    console.error(message);

    return message;
  }

  if (
    metadata.currency &&
    !metadata.totalPrice &&
    lineItems?.every(
      (lineItem) => lineItem.price === undefined || lineItem.price === null
    )
  ) {
    const message =
      "You must provide a total price or line item prices if you are providing a currency.";

    console.error(message);

    return message;
  }

  if (
    (metadata.totalPrice ||
      lineItems?.some(
        (lineItem) => lineItem.price !== undefined && lineItem.price !== null
      )) &&
    !metadata.currency
  ) {
    const message =
      "You must provide a currency if you are providing a total price or line item prices.";

    console.error(message);

    return message;
  }

  return false;
};
