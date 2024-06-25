import { isValidActionName, isValidEventName } from "../";

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

describe("isValidEventName", () => {
  it("should return true for valid event name", () => {
    const eventName = "MSG Square - 05/21/22";
    expect(isValidEventName(eventName)).toBe(true);
  });

  it("should return false for invalid event name", () => {
    const eventName = "KNICKS@LAKERS";
    expect(isValidEventName(eventName)).toBe(false);
  });
});
