/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from "vitest";
import { Configuration } from "config";
import { hasTrackError } from "../hasTrackError";

describe("hasTrackError", () => {
  // ignore the console.error messages
  vi.spyOn(console, "error").mockImplementation(() => {});

  const configuration: Configuration = {
    id: "AN_ID",
    accessKey: "AN_ACCESS_KEY",
    secretKey: "A_SECRET_KEY",
    companyName: "A_COMPANY_NAME",
  };
  const action = "PURCHASE";
  const name = "MSG Square - 05/21/22";
  const user = {
    id: "123",
    email: "foo@foo.com",
    phone: "+1111111111",
    smsMarketingConsent: true,
  };
  const metadata = { title: "EVENT_ID", value: 100 };
  const customerApiKey = "A_CUSTOMER_API_KEY";

  it("should return an error message if configuration is invalid", () => {
    const configuration: Configuration = {
      id: "",
      accessKey: "",
      secretKey: "",
      companyName: "A_COMPANY_NAME",
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
      smsMarketingConsent: true,
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
      "You must provide a total price or line items if you are providing a currency."
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
      "You must provide a currency if you are providing a total price or line item prices."
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
      "You must provide a total price or line items if you are providing a currency."
    );
  });

  it("should not error when a top-level name is provided but line items have no names", () => {
    const result = hasTrackError({
      configuration,
      action,
      name,
      user,
      metadata,
      customerApiKey,
      lineItems: [{ name: "" }, { name: "" }],
    });

    expect(result).toBe(false);
  });

  it("should not error when a top-level name is provided but the line items array is empty", () => {
    const result = hasTrackError({
      configuration,
      action,
      name,
      user,
      metadata,
      customerApiKey,
      lineItems: [],
    });

    expect(result).toBe(false);
  });

  it("should error when there is no top-level name and no line items provide a name", () => {
    const result = hasTrackError({
      configuration,
      action,
      name: undefined,
      user,
      metadata,
      customerApiKey,
      lineItems: [{ name: "" }, { name: "" }],
    });

    expect(result).toBe(
      "You must provide a name for the event. This should be human readable such as 'MSG_SHOW_04_05_2025'. If you are including line items then you can leave the name key blank but you must provide a name for each line item instead"
    );
  });

  it("should not error when there is no top-level name but at least one line item is named", () => {
    const result = hasTrackError({
      configuration,
      action,
      name: undefined,
      user,
      metadata,
      customerApiKey,
      lineItems: [{ name: "" }, { name: "Floor Ticket" }],
    });

    expect(result).toBe(false);
  });
});
