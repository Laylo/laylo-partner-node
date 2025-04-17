import { Configuration } from "./types";

export let configuration: Configuration = {} as Configuration;

/** Set your Laylo credentials. These are available at laylo.com. */
export const config = (config: Configuration) => {
  console.log("test");
  configuration = {
    id: config.id,
    accessKey: config.accessKey,
    secretKey: config.secretKey,
    companyName: config.companyName,
  };
};
