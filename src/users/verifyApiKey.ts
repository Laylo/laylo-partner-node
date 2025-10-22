import { makeRequest } from "lib";

export type VerifiyApiKeyResult = "valid" | "invalid";

export type VerifyApiKeyResponse = {
  isKeyValid: VerifiyApiKeyResult;
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

    return response.body as VerifyApiKeyResponse;
  } catch (error) {
    console.error("Error verifying API key", error);

    return {
      isKeyValid: "invalid",
    } as VerifyApiKeyResponse;
  }
};
