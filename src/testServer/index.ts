import * as http from "http";
import { conversions, config } from "../index";

config({
  id: "AGxl96OBmWykueJT206Kxjw5X",
  accessKey: "9fd6448302244cfc8644de856832e91d",
  secretKey: "732ebbbed39c4226b8032ba11858edc1",
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
        customerApiKey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoiZjczZjY0MTgtNDhhZS00MWUxLWFjMDEtYTYyNzk0ODhmODk2IiwidXNlcklkIjoibkxZeHc2U2MwS0lkTDlFM3JqUHZUbEJjZiIsInRva2VuVHlwZSI6IlNVQlNDUklCRSIsImhhc0NsaWVudEFjY2VzcyI6dHJ1ZSwiY3JlYXRlZCI6MTcyNDY5NTM1NTE5OCwibGFiZWwiOiJjb252ZXJzaW9ucyIsImlhdCI6MTcyNDY5NTM1NX0.NCNHm0IHuug-dxOp-atiRboz2sXYeYG7s6Sy4jZnaIo",
        name: "TOUR3",
        action: "PURCHASE",
        metadata: { title: "EVENT_ID" },
        user: { phone: "+13104972709", marketingConsent: true },
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
