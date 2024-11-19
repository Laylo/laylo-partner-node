import * as http from "http";
import { conversions, config } from "../index";

config({
  id: "",
  accessKey: "",
  secretKey: "",
  companyName: "",
});

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello, world!\n");
  }

  if (req.url === "/track") {
    const value = async () => {
      const value = await conversions.track({
        customerApiKey: "",
        name: "TOUR",
        lineItems: [
          {
            name: "Foo",
            price: 100,
            quantity: 1,
          },
          {
            name: "Foo2",
            price: 100,
            quantity: 1,
          },
        ],
        action: "PURCHASE",
        metadata: { title: "EVENT_ID", value: 100, currency: "USD" },
        user: { phone: "+1111111111", smsMarketingConsent: true },
      });

      console.log(value);
    };

    value();

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Tracking...!\n");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${String(PORT)}/`);
});
