import crypto from "crypto";
import { LayloAction, Metadata, User } from "../types";
import { hasTrackError } from "./hasTrackError";
import { configuration } from "../../config";
import { makeRequest } from "../../lib";

/** Track an event/conversion in the Laylo platform. Using your editor you can click into the properties and user parameters in order to view their types. */
export const track = async ({
  action,
  name,
  metadata,
  user,
  customerApiKey,
}: {
  /** Categorize the action taken by the user. It can be one of the following: 'PURCHASE', 'CHECK_IN', 'ADD_TO_CART' */
  action: LayloAction;
  /** Give your event a recognizable name. It can only contain letters, numbers, underscores, hyphens, forward slashes, and spaces. The name does not need to be unique for each user action. For example 'Lakers vs Celtics - 10/05/2024` is a name that will allow customers to filter by that event. */
  name: string;
  /** Properties of the event. This is a freeform JSON object with a set of special properties. */
  metadata: Metadata;
  /** Properties of the user. Must include an email or a phone number. If both are included then phone number will take precedence. */
  user: User;
  /** This is your customer's Laylo API key that they create at https://laylo.com/settings?tab=Integrations. It should be securely stored in your backend and never exposed on the frontend. */
  customerApiKey: string;
}) => {
  const trackError = hasTrackError({
    configuration,
    action,
    name,
    user,
    metadata,
    customerApiKey,
  });

  if (trackError) {
    return { status: "failure", reason: trackError };
  }

  return await sendEventToApi({
    action,
    name,
    metadata,
    user,
    customerApiKey,
  });
};

const sendEventToApi = async ({
  action,
  name,
  metadata,
  user,
  customerApiKey,
}: {
  action: LayloAction;
  name: string;
  metadata: Metadata;
  user: User;
  customerApiKey: string;
}) => {
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
      reason:
        "You must configure the Laylo SDK with an id, access key, and secret key using the config method.",
    };
  }

  const timestamp = Date.now().toString();
  const header = {
    alg: "HS256",
    typ: "JWT",
  };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64");

  const encodedPayload = Buffer.from(
    JSON.stringify({
      timestamp,
      userId: configuration.id,
      accessKey: configuration.accessKey,
    })
  ).toString("base64");

  const signature = crypto
    .createHmac("sha256", configuration.secretKey)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64");

  const authorization = `${encodedHeader}.${encodedPayload}.${signature}`;

  const response = await makeRequest(
    "https://events.laylo.com/track",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authorization}`,
        creatorId: "sdk",
        layloFid: "sdk",
      },
    },
    JSON.stringify({
      Data: {
        type: "createConversion",
        payload: {
          apiKey: customerApiKey,
          action,
          name,
          source: configuration.id,
          timestamp,
          metadata,
          user,
        },
      },
      PartitionKey: configuration.id,
    })
  );

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
        timestamp,
        metadata,
        user,
      },
    };
  }

  return {
    status: "failure",
    ...responseBody,
  };
};
