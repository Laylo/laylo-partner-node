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
        numberOfPhoneNumbers: number;
        message: string;
        sendAt: string;
      };
    };
