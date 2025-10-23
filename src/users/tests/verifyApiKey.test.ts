import { describe, it, expect, vi, beforeEach } from "vitest";
import { verifyApiKey } from "../verifyApiKey";
import * as lib from "../../lib";

vi.mock("../../lib", () => ({
  makeRequest: vi.fn(),
}));

describe("verifyApiKey", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ignore the console.error messages
  vi.spyOn(console, "error").mockImplementation(() => {});

  it("should return valid when API key is valid", async () => {
    // Mock makeRequest to return a valid response
    vi.mocked(lib.makeRequest).mockResolvedValue({
      body: JSON.stringify({ isKeyValid: "valid" }),
      status: 200,
      headers: {},
    });

    const result = await verifyApiKey({
      apiKey: "valid-api-key",
    });

    expect(result).toEqual({
      isKeyValid: "valid",
    });

    expect(lib.makeRequest).toHaveBeenCalledWith({
      url: "https://events.laylo.com/api/v1",
      method: "POST",
      data: {
        type: "users.verifyApiKey",
        payload: {
          apiKey: "valid-api-key",
        },
      },
    });
  });

  it("should return invalid when API key is invalid", async () => {
    // Mock makeRequest to return an invalid response
    vi.mocked(lib.makeRequest).mockResolvedValue({
      body: JSON.stringify({ isKeyValid: "invalid" }),
      status: 200,
      headers: {},
    });

    const result = await verifyApiKey({
      apiKey: "invalid-api-key",
    });

    expect(result).toEqual({
      isKeyValid: "invalid",
    });

    expect(lib.makeRequest).toHaveBeenCalledWith({
      url: "https://events.laylo.com/api/v1",
      method: "POST",
      data: {
        type: "users.verifyApiKey",
        payload: {
          apiKey: "invalid-api-key",
        },
      },
    });
  });

  it("should return invalid when request throws an error", async () => {
    // Mock makeRequest to throw an error
    vi.mocked(lib.makeRequest).mockRejectedValue(new Error("Network error"));

    const result = await verifyApiKey({
      apiKey: "any-api-key",
    });

    expect(result).toEqual({
      isKeyValid: "invalid",
    });

    expect(console.error).toHaveBeenCalledWith(
      "src:users:verifyApiKey",
      expect.objectContaining({
        err: expect.any(Error),
        message: "Error verifying API key",
      })
    );
  });

  it("should handle malformed JSON response", async () => {
    // Mock makeRequest to return invalid JSON
    vi.mocked(lib.makeRequest).mockResolvedValue({
      body: "not valid json",
      status: 200,
      headers: {},
    });

    const result = await verifyApiKey({
      apiKey: "any-api-key",
    });

    expect(result).toEqual({
      isKeyValid: "invalid",
    });

    expect(console.error).toHaveBeenCalled();
  });
});
