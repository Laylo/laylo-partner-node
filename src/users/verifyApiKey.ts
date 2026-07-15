import { makeRequest } from "../lib";

export type VerifyApiKeyResult = "valid" | "invalid";

export type VerifyApiKeyResponse = {
  isKeyValid: VerifyApiKeyResult;
};

export const verifyApiKey = async ({
  apiKey,
}: {
  apiKey: string;
}): Promise<VerifyApiKeyResponse> => {
  try {
    const response = await makeRequest({
      url: "https://events.laylo.com/api/v1",
      method: "POST",
      data: {
        type: "users.verifyApiKey",
        payload: {
          apiKey,
        },
      },
    });

    const body = JSON.parse(response.body);

    // The API returns `apiKeyStatus` at the top level for a valid key (200) and
    // nested under `error` for an invalid key (401), so check both locations.
    const apiKeyStatus = body?.apiKeyStatus ?? body?.error?.apiKeyStatus;

    return {
      isKeyValid: apiKeyStatus === "valid" ? "valid" : "invalid",
    };
  } catch (error) {
    console.error("src:users:verifyApiKey", {
      err: error,
      message: "Error verifying API key",
    });

    return {
      isKeyValid: "invalid",
    };
  }
};
