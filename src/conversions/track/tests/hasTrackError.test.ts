/* eslint-disable @typescript-eslint/no-explicit-any */
import { hasTrackError } from "../hasTrackError";

describe("hasTrackError", () => {
  // ignore the console.error messages
  jest.spyOn(console, "error").mockImplementation();

  const configuration = {
    id: "AN_ID",
    accessKey: "AN_ACCESS_KEY",
    secretKey: "A_SECRET_KEY",
  };
  const action = "PURCHASE";
  const name = "MSG Square - 05/21/22";
  const user = {
    id: "123",
    email: "foo@foo.com",
    phone: "+1111111111",
    marketingConsent: true,
  };
  const metadata = { title: "EVENT_ID", value: 100 };
  const customerApiKey = "A_CUSTOMER_API_KEY";

  it("should return an error message if configuration is invalid", () => {
    const configuration = {
      id: "",
      accessKey: "",
      secretKey: "",
    };

    const result = hasTrackError({
      configuration,
      action,
      name,
      user,
      metadata,
      customerApiKey,
    });

    expect(result).toBe(
      "You must configure the Laylo SDK with an id, access key, and secret key using the config method."
    );
  });

  it("should return an error message if action is invalid", () => {
    const action = "BUY";

    const result = hasTrackError({
      configuration,
      action,
      name,
      user,
      metadata,
      customerApiKey,
    } as any);

    expect(result).toBe(
      "The action must be one of the following: 'PURCHASE', 'CHECK_IN', 'ADD_TO_CART'."
    );
  });

  it("should return an error message if name is invalid", () => {
    const name = "KNICKS@LAKERS";

    const result = hasTrackError({
      configuration,
      action,
      name,
      user,
      metadata,
      customerApiKey,
    });

    expect(result).toBe(
      "The event name can only contain letters, numbers, underscores, hyphens, forward slashes, and spaces."
    );
  });

  it("should return an error message if customerApiKey is invalid", () => {
    const customerApiKey = "";

    const result = hasTrackError({
      configuration,
      action,
      name,
      user,
      metadata,
      customerApiKey,
    });

    expect(result).toBe(
      "You must provide your customer's API key in order to track the event."
    );
  });

  it("should return an error message if no user email or phone is provided", () => {
    const user = {
      id: "123",
      email: "",
      phone: "",
      marketingConsent: true,
    };

    const result = hasTrackError({
      configuration,
      action,
      name,
      user,
      metadata,
      customerApiKey,
    });

    expect(result).toBe(
      "You must provide either an email or a phone number for the user."
    );
  });

  it("should return an error message if there is a totalprice but it is not valid", () => {
    const metadata = { title: "EVENT_ID", totalPrice: 100.123 };

    const result = hasTrackError({
      configuration,
      action,
      name,
      user,
      metadata,
      customerApiKey,
    });

    expect(result).toBe(
      "The total price must be a decimal number with no more than two decimal places and no more than 16 digits before the decimal place."
    );
  });

  it("should return an error message if there is a currency but it is not valid", () => {
    const metadata = { title: "EVENT_ID", currency: "USD" };

    const result = hasTrackError({
      configuration,
      action,
      name,
      user,
      metadata,
      customerApiKey,
    });

    expect(result).toBe(
      "You must provide a total price if you are providing a currency."
    );
  });

  it("should return an error message if there is a totalprice but no currency", () => {
    const metadata = { title: "EVENT_ID", totalPrice: 100 };

    const result = hasTrackError({
      configuration,
      action,
      name,
      user,
      metadata,
      customerApiKey,
    });

    expect(result).toBe(
      "You must provide a currency if you are providing a total price."
    );
  });

  it("should return an error message if there is a currency but no totalprice", () => {
    const metadata = { title: "EVENT_ID", currency: "USD" };

    const result = hasTrackError({
      configuration,
      action,
      name,
      user,
      metadata,
      customerApiKey,
    });

    expect(result).toBe(
      "You must provide a total price if you are providing a currency."
    );
  });
});
