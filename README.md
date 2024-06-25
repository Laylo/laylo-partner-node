# Laylo Partner SDK Documentation

<aside>
💧 In order to get your API keys please reach out to contact@laylo.com
</aside>

# Overview

## Introduction

The Laylo Partner Node SDK allows you to pass your customers’ conversion events to Laylo. This is similar to using platforms such as Google Analytics to track events and conversions. With this conversion data, customers are able to better segment their fans for targeted messaging. For example, they can send a message to all fans that have signed up for a drop but not yet purchased a ticket - driving engaged and interested fans to the ticketing platform.

## Usage

### Installation

In your terminal run

```jsx
npm install @laylo.com/partner
```

or

```jsx
yarn add @laylo.com/partner
```

### **Configuration**

Before you make a track call you need to configure your SDK instance. We recommend doing this where you set up other third party services and clients, soon after your server or lambda starts.

The `id`, `accessKey`, and `secretKey` arguments in the example below **belong to you and not your customers.** You can create as many API keys as you want and revoke them at your own discretion.

_If you’d like to integrate a laylo pixel, please reach out to [contact@laylo.com](mailto:contact@laylo.com) to inquire about creating Partner API keys._

```tsx
import laylo from "@laylo.com/partner";

laylo.config({
  id: "YOUR_LAYLO_USER_ID",
  accessKey: "YOUR_API_ACCESS_KEY",
  secretKey: "YOUR_API_SECRET_KEY",
});
```

### Customer API Keys

Your customers need to be able to provide you with their Laylo API keys. They can create multiple API keys and revoke them as well. Within your platform they should be able to save their Laylo API key.

They can generate Laylo API keys in their API Keyring at [https://laylo.com/settings?tab=Integrations](https://laylo.com/settings?tab=Integrations).

[You can also send them this link which contains documentation on how to generate a Laylo API key.](https://www.notion.so/laylo/APIs-and-Integrations-75bdd31f50e649aaa9a2f68f568dcd28?pvs=4#ee8d94c63ba74dd8b5286be773753a71)

### Creating a Conversion

Once you have a customer’s API key and an event that you wish to turn into a tracked conversion you will call the `track` method.

```tsx
import laylo from "@laylo.com/partner";

await laylo.conversions.track({
  customerApiKey: "CUSTOMER_API_KEY", // *required* THIS IS NOT YOUR API KEY. THIS IS EACH OF OUR MUTUAL CUSTOMER'S LAYLO API KEY.
  action: "PURCHASE", // *required* one of ['PURCHASE', 'CHECK_IN', 'ADD_TO_CART']
  name: "MSG - 04/05/2025", // *required* an identifier that indicates what the fan has purchased (ideally human-readable)
  metadata: {
    // freeform json object
    currency: "USD",
    totalPrice: 100.0,
    location: "New York",
  },
  user: {
    phone: "+1234567890", // a phone number or email is required
    email: "fan@laylo.com",
    marketingConsent: true, // if a phone number or email is not already opted into the customer this indicates that you
    // have received permission from them to subscribe to updates from the customer
  },
});
```

## Preferred Practices

### Naming and Filtering Conversions

Customers are able to filter and segment their fans based on actions they have taken. There are two levels to filtering.

**First Filter (`action`)**

The `action` sent with the `laylo.conversions.track` call can be filtered on. For example, `action: "PURCHASE"`. This allows customers to send messages to all fans that have purchased a ticket. It also allows customers to send messages to all fans that have not purchased a ticket.

**Second Filter (`name`)**

The `name` sent with the `laylo.conversions.track` provides an additional filter for the customer. For example, they can message all fans that have purchased a ticket to the show at Madison Square Garden on April 5, 2025 by using `name: "MSG - 04/05/2025"`.

The `name` should be specific to the event, merch, product, etc. that is purchased by the fan. It does not need to be unique for each fan or each customer. Multiple of your customers can have the conversion name `MSG - 04/05/2025`.

A human readable `name` is preferred over an ID. This is because the customer will see the `name` within the Laylo platform and should be able to easily identify them. The name can only contain letters, numbers, underscores, hyphens, forward slashes, and spaces.

### User contact information

An email or phone number must be sent with the `user` object. This is how Laylo can tie a conversion to a specific fan. If both properties are sent with the track call then only the phone number will be used.

When using the [`user.phone`](http://user.phone) property you must include the country code.

### Marketing Consent

Fans that have reached your platform through a Laylo RSVP are typically already opted in to the customer’s marketing consent. However, if you have a marketing consent checkbox on your platform it is highly recommended to send that information to Laylo. If they have agreed to marketing then add `user.marketingConsent: true` to the track call.

We always adhere to the latest regulations so if you send a phone number we will send a confirmation text to the user before sending them any marketing messages.

### Additional Metadata

You can send additional information about the conversion event or the user through the track call. This gives customers additional insight into their own fans and provides the opportunity to create better relationships with their fanbase.

### Special Metadata

Some metadata properties are special and handled differently by Laylo. Current properties are:

- `metadata.currency` - The currency code (ISO 4217) if the conversion is a transaction with a price. Ex: USD, EUR, GBP, etc.
- `metadata.totalPrice` - The total price of the transaction. It must be a decimal number with no more than two decimal places (ex: 12.02, 5.00)

## TypeScript Types

### `laylo.track` arguments

```tsx
type TrackParams = {
	 /** Categorize the action taken by the user. It can be one of the following: 'PURCHASE', 'CHECK_IN', 'ADD_TO_CART' */
	action: 'PURCHASE' | 'CHECK_IN' | 'ADD_TO_CART'] ;

  /** Give your event a recognizable name. It can only contain letters, numbers, underscores, hyphens, forward slashes, and spaces. The name does not need to be unique for each user action. For example 'Lakers vs Celtics - 10/05/2024` is a name that will allow customers to filter by that event. */
	name: string;

  /** Properties of the event. This is a freeform JSON object with a set of special properties. */
	metadata: [Metadata](https://www.notion.so/Laylo-SDK-Documentation-0ec0ec2c7b8547aabbbfa1c648003818?pvs=21);

	/** Properties of the user. Must include an email or a phone number. If both are
	included then phone number will take precedence. */
	user: [User](https://www.notion.so/Laylo-SDK-Documentation-0ec0ec2c7b8547aabbbfa1c648003818?pvs=21);

	/** This is your customer's Laylo API key that they create at https://laylo.com/settings?tab=Integrations. It should be securely stored in your backend and never exposed on the frontend. */
	customerApiKey: string;
}
```

### Metadata

```tsx
type Metadata = {
  /** The currency code (ISO 4217) if the conversion is a transaction with a price. Ex: USD, EUR, GBP, etc. */
  currency?: string;

  /** The total price of the transaction. It must be a decimal number with no more than two decimal places (ex: 12.02, 5.00)  */
  totalPrice?: string;

  /** Add additional metadata about the event that you want to see on the event. */
  [key: string]: string | boolean | number;
};
```

### User

```tsx
type User = {
  /** Include the user's email or phone number. We recommend validating emails using the library 
	`email-validator` before sending them. */
  email?: string;

  /** Include the user's phone number or email. Must be a valid phone number with a country code. 
	`+13101234567`. We recommend validating phone numbers using the library `libphonenumber-js` before sending them. */
  phone?: string;

  /** If this is true then the user will be subscribed to your customer when they send Laylo emails and texts. 
	If you pass a phone number then the user will be sent a confirmation text. 
	Ensure that you have provided the user with the proper terms, conditions, and policies. */
  marketingConsent?: boolean;

  /** Add additional metadata about the user that you want to see on the event. */
  [key: string]: string | boolean | number;
};
```

## Conversion Examples

### Purchasing a ticket

Performers and teams have identified this information as crucial to their success. They want a way to engage with fans that have attended events both pre-show and post-show. As well, being able to directly reach out to fans that have not yet purchased a ticket but have shown interest through a Laylo drop is a great way to close out the sales period.

```tsx
import laylo from "@laylo.com/partner";

await laylo.conversions.track({
  customerApiKey: "123",
  action: "PURCHASE",
  name: "MSG_04_05_2025",
  metadata: {
    currency: "USD",
    totalPrice: 100.0,
    location: "New York",
  },
  user: {
    phone: "+1234567890",
    marketingConsent: true,
  },
});
```

### Checking into a show

Passing a scanned ticket or check in conversion allows customers to interact with fans at a show. They can push special promotions to them, such as discounts off merch or third party promotions (free Bud Light for the next 20 minutes).

```tsx
import laylo from "@laylo.com/partner";

await laylo.conversions.track({
  customerApiKey: "123",
  action: "CHECK_IN",
  name: "MSG_04_05_2025",
  metadata: {
    location: "New York",
  },
  user: {
    phone: "+1234567890",
    marketingConsent: true,
  },
});
```
