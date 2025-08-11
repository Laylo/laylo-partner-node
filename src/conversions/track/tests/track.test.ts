import { describe, it, expect, vi, beforeEach } from "vitest";
import { config } from "../../../";
import { track } from "../track";
import { hasTrackError } from "../hasTrackError";

vi.mock("../../../lib", () => ({
  makeRequest: vi.fn(() => ({ body: '{"SequenceNumber":"test"}' })),
}));

vi.mock("../hasTrackError");

describe("track", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ignore the console.error messages
  vi.spyOn(console, "error").mockImplementation(() => {});

  it("should send the event to the Laylo API", async () => {
    // Mock hasTrackError to return null (no error)
    vi.mocked(hasTrackError).mockReturnValue(false);

    config({
      id: "AN_ID",
      accessKey: "AN_ACCESS_KEY",
      secretKey: "A_SECRET_KEY",
      companyName: "A_COMPANY_NAME",
    });
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

    const result = await track({
      action,
      name,
      user,
      metadata,
      customerApiKey,
      layloProductId: "PROD_123ABC",
    });

    expect(result).toMatchObject({
      status: "success",
      payload: {
        action: "PURCHASE",
        customerApiKey: "A_CU****_KEY",
        source: "A_COMPANY_NAME",
        metadata: {
          title: "EVENT_ID",
          value: 100,
          productId: "PROD_123ABC",
        },
        name: "MSG Square - 05/21/22",
        user: {
          email: "foo@foo.com",
          id: "123",
          smsMarketingConsent: true,
          phone: "+1111111111",
        },
      },
    });
  });

  it("should fail to send the event to the Laylo API", async () => {
    // Mock hasTrackError to return an error message
    vi.mocked(hasTrackError).mockReturnValue(
      "You must configure the Laylo SDK with an id, access key, and secret key using the config method."
    );

    config({
      id: "",
      accessKey: "",
      secretKey: "",
      companyName: "",
    });
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

    const result = await track({
      action,
      name,
      user,
      metadata,
      customerApiKey,
    });

    expect(result).toMatchObject({ status: "failure" });
  });
});
