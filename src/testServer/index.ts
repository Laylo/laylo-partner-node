import * as http from "http";
import { conversions, config } from "../index";

config({
  id: "LAYLO_ACCOUNT_ID",
  accessKey: "LAYLO_ACCESS_KEY",
  secretKey: "LAYLO_SECRET_KEY",
  companyName: "LAYLO_COMPANY_NAME",
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
        customerApiKey: "A_CUSTOMERS_API_KEY",
        name: "TOUR",
        action: "PURCHASE",
        metadata: { title: "EVENT_ID", value: 100 },
        user: { phone: "+1111111111", marketingConsent: true },
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
