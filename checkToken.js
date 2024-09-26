const https = require("https");
const fs = require("fs");
const path = require("path");

// Load the .npmrc file and extract the token
const npmrcPath = path.resolve(".npmrc");
const npmrcContent = fs.readFileSync(npmrcPath, "utf-8");

// Extract the token (assuming it's stored as //registry.npmjs.org/:_authToken=<token>)
const tokenMatch = npmrcContent.match(/@laylo:token=(.*)/);
const token = tokenMatch ? tokenMatch[1] : null;

if (!token) {
  console.error("Token not found in .npmrc");
  process.exit(1);
}

// Send the token to the API endpoint for verification
const apiUrl = `https://dev.laylo.com/api/check-integrator-key/${token}`; // Replace with your actual API endpoint
const url = new URL(apiUrl);

const data = JSON.stringify({ token });

const options = {
  hostname: url.hostname,
  port: 443, // HTTPS default port
  path: url.pathname,
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

const req = https.request(options, (res) => {
  let responseData = "";

  res.on("data", (chunk) => {
    responseData += chunk;
  });

  res.on("end", () => {
    try {
      const parsedData = JSON.parse(responseData);

      if (res.statusCode === 200 && parsedData.success) {
        console.log("Dropping Laylo into your code. Let's crush it!");
        process.exit(0); // Exit with success
      } else {
        console.error(
          "Laylo token verification failed. Please check your token in .npmrc. Reach out to your Laylo contact for additional help."
        );
        process.exit(1); // Exit with failure
      }
    } catch (error) {
      console.error(
        "Laylo token verification failed. Please check your token in .npmrc. Reach out to your Laylo contact for additional help."
      );
      process.exit(1); // Exit with failure
    }
  });
});

req.on("error", (error) => {
  console.error(
    "Laylo token verification failed. Please check your token in .npmrc. Reach out to your Laylo contact for additional help."
  );
  process.exit(1); // Exit with failure
});

// Write the data (the token) to the request body
req.write(data);
req.end();
