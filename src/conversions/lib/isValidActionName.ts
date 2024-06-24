export const isValidActionName = (action: string) => {
  return ["PURCHASE", "CHECK_IN", "ADD_TO_CART"].includes(action);
};
