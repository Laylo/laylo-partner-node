export type Configuration = {
  /** Your Laylo account id */
  id: string;
  /** This can be retrieved when creating a Laylo API Key */
  accessKey: string;
  /** This can be retrieved when creating a Laylo API Key */
  secretKey: string;
  /** The name of your company. Used as the 'source' string for conversion events. */
  companyName: string;
};
