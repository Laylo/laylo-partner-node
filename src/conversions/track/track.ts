import { configuration } from "../../config";
import { getIsValidConfiguration, makeRequest } from "../../lib";
import { LayloAction, LineItem, Metadata, TrackResponse, User } from "../types";
import { hasTrackError } from "./hasTrackError";

/** Track an event/conversion in the Laylo platform. Using your editor you can click into the properties and user parameters in order to view their types. */
export const track = async ({
  action,
  name,
  metadata,
  user,
  lineItems,
  customerApiKey,
  layloProductId,
}: {
  /** Categorize the action taken by the user. It can be one of the following: 'PURCHASE', 'CHECK_IN', 'ADD_TO_CART' */
  action: LayloAction;
  /** Give your event a recognizable name. It can only contain letters, numbers, underscores, hyphens, forward slashes, and spaces. The name does not need to be unique for each user action. For example 'Lakers vs Celtics - 10/05/2024` is a name that will allow customers to filter by that event.
   *
   * This can be left undefined if you include line items. If you are tracking ticket purchases we recommend keeping the name as the event name and including the line items as the types of ticket purchased. If you are tracking eCommerce purchases then you should leave this undefined as long as you include line items.
   */
  name?: string;
  /** Properties of the event. This is a freeform JSON object with a set of special properties. */
  metadata: Metadata;
  /** Properties of the user. Must include an email or a phone number. If both are included then phone number will take precedence. */
  user: User;
  /** Line items associated with the purchase. */
  lineItems?: LineItem[];
  /** This is your customer's Laylo API key that they create at https://laylo.com/settings?tab=Integrations. It should be securely stored in your backend and never exposed on the frontend. */
  customerApiKey: string;
  /** The Laylo product ID associated with the event. Optional, but recommended for better tracking. */
  layloProductId?: string;
}): Promise<TrackResponse | TrackResponse[]> => {
  const trackError = hasTrackError({
    configuration,
    action,
    name,
    user,
    lineItems,
    metadata,
    customerApiKey,
  });

  if (trackError) {
    return { status: "failure", message: trackError };
  }

  return await sendEvents({
    action,
    name,
    metadata,
    user,
    lineItems,
    customerApiKey,
    layloProductId,
  });
};

const sendEvents = async ({
  action,
  name,
  metadata,
  user,
  lineItems,
  customerApiKey,
  layloProductId,
}: {
  action: LayloAction;
  name?: string;
  metadata: Metadata;
  user: User;
  lineItems?: LineItem[];
  customerApiKey: string;
  layloProductId?: string;
}): Promise<TrackResponse | TrackResponse[]> => {
  const isValidConfiguration = getIsValidConfiguration();

  if (isValidConfiguration.status === "failure") {
    throw new Error(isValidConfiguration.message);
  }

  if (lineItems) {
    const trackResponses: TrackResponse[] = [];

    for (const lineItem of lineItems) {
      const conversionName = name ? `${name}_${lineItem.name}` : lineItem.name;

      const response = await sendEventToApi({
        customerApiKey,
        action,
        name: conversionName,
        metadata,
        user,
        layloProductId,
      });

      trackResponses.push(response);
    }

    return trackResponses;
  } else {
    return await sendEventToApi({
      customerApiKey,
      action,
      name: name || "",
      metadata,
      user,
      layloProductId,
    });
  }
};

const sendEventToApi = async ({
  customerApiKey,
  action,
  name,
  metadata,
  user,
  layloProductId,
}: {
  customerApiKey: string;
  action: LayloAction;
  name: string;
  metadata: Metadata;
  user: User;
  layloProductId?: string;
}): Promise<TrackResponse> => {
  const response = await makeRequest("https://events.laylo.com/track", {
    Data: {
      type: "createConversion",
      payload: {
        apiKey: customerApiKey,
        action,
        name,
        source: configuration.companyName,
        metadata: {
          ...metadata,
          ...(layloProductId && { productId: layloProductId }),
        },
        user,
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
        action,
        name,
        source: configuration.companyName,
        metadata: {
          ...metadata,
          ...(layloProductId && { productId: layloProductId }),
        },
        user,
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
