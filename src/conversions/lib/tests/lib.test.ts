import { describe, it, expect } from "vitest";
import { isValidActionName } from "../";

describe("isValidActionName", () => {
  it("should return true for valid action names", () => {
    expect(isValidActionName("PURCHASE")).toBe(true);
    expect(isValidActionName("CHECK_IN")).toBe(true);
    expect(isValidActionName("ADD_TO_CART")).toBe(true);
  });

  it("should return false for invalid action name", () => {
    expect(isValidActionName("BUY")).toBe(false);
  });
});
