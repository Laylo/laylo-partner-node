export type SendSMSResponse =
  | {
      status: "failure";
      message: string;
    }
  | {
      status: "success";
      payload: {
        customerApiKey: string;
        name: string;
        source: string;
        message: string;
        sendAt: string;
      };
    };
