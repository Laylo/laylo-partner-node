export type LayloAction = "PURCHASE" | "CHECK_IN" | "ADD_TO_CART";

export type Metadata = {
  /** The Laylo product ID associated with the event. Optional, but recommended for better tracking. */
  productId?: string;
  /** The currency code (ISO 4217) if the conversion is a transaction with a price. Ex: USD, EUR, GBP, etc. */
  currency?: string;
  /** The total price of the transaction. It must be a decimal number with no more than two decimal places (ex: 12.02, 5.00)  */
  totalPrice?: number;
  /** The URL that the conversion occurred on */
  href?: string;
  /** The title of the page that the conversion occurred on */
  title?: string;
  /** Add additional metadata about the event that you want to see on the event. */
  [key: string]: string | boolean | number | undefined;
};

export type User = {
  /** Include the user's email or phone number. We recommend validating emails using the library `email-validator` before sending them. */
  email?: string;
  /** Include the user's phone number or email. Must be a valid phone number with a country code. `+13101234567`. We recommend validating phone numbers using the library `libphonenumber-js` before sending them. */
  phone?: string;
  /** If this is true then the user will be subscribed to your customer when they send Laylo texts. If you pass a phone number then the user will be sent a confirmation text. Phone must be in E.164 format (e.g., '+13101234567'). Pro tip: Use libphonenumber-js for validation before sending. Ensure that you have provided the user with the proper terms, conditions, and policies. */
  smsMarketingConsent?: boolean;
  /** If this is true then the user will be subscribed to your customer when they send Laylo emails. Ensure that you have provided the user with the proper terms, conditions, and policies. */
  emailMarketingConsent?: boolean;
  /**
   * @deprecated Use `smsMarketingConsent` or `emailMarketingConsent` instead.
   **/
  marketingConsent?: boolean;
  /** Add additional metadata about the user that you want to see on the event. */
  [key: string]: string | boolean | number | undefined;
};

export type TrackResponse =
  | {
      status: "failure";
      message: string;
    }
  | {
      status: "success";
      payload: {
        customerApiKey: string;
        action: LayloAction;
        name: string;
        source: string;
        timestamp: string;
        metadata: Metadata;
        user: User;
      };
    };
