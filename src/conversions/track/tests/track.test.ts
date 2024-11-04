import { config } from "../../../";
import { track } from "../track";

jest.mock("../../../lib", () => ({
  makeRequest: jest.fn(() => ({ body: '{"SequenceNumber":"test"}' })),
}));

describe("track", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ignore the console.error messages
  jest.spyOn(console, "error").mockImplementation();

  it("should send the event to the Laylo API", async () => {
    jest.mock("../hasTrackError", () => ({
      hasTrackError: jest.fn(() => null),
    }));

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
    jest.mock("../hasTrackError", () => ({
      hasTrackError: jest.fn(() => "Error"),
    }));

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
