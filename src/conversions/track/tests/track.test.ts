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
    });
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

    const result = await track({
      action,
      name,
      user,
      metadata,
      customerApiKey,
    });

    expect(result).toMatchObject({
      status: "success",
      payload: {
        action: "PURCHASE",
        customerApiKey: "A_CU****_KEY",
        metadata: {
          title: "EVENT_ID",
          value: 100,
        },
        name: "MSG Square - 05/21/22",
        user: {
          email: "foo@foo.com",
          id: "123",
          marketingConsent: true,
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
    });
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
