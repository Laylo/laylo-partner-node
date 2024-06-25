import { config, configuration } from "../config";

describe("config", () => {
  it("should set configuration", () => {
    const configData = {
      id: "LAYLO_ACCOUNT_ID",
      accessKey: "LAYLO_ACCESS_KEY",
      secretKey: "LAYLO_SECRET_KEY",
    };
    config(configData);
    expect(configuration).toEqual(configData);
  });
});
