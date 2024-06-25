jest.mock("node-fetch", () =>
  jest.fn(() => ({ json: () => ({ status: "success" }) }))
);

import { config } from "../../../";
import { track } from "../track";

describe("track", () => {
  // ignore the console.error messages
  jest.spyOn(console, "error").mockImplementation();

  it("should send the event to the Laylo API", async () => {
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

    expect(result).toEqual({ status: "success" });
  });

  it("should fail to send the event to the Laylo API", async () => {
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
