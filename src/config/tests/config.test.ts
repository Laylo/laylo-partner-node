import { Configuration } from "config/types";
import { config, configuration } from "../config";

describe("config", () => {
  it("should set configuration", () => {
    const configData: Configuration = {
      id: "LAYLO_ACCOUNT_ID",
      accessKey: "LAYLO_ACCESS_KEY",
      secretKey: "LAYLO_SECRET_KEY",
      companyName: "COMPANY_NAME",
    };
    config(configData);
    expect(configuration).toEqual(configData);
  });
});
