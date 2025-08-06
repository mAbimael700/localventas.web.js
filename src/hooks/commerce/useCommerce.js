import { useContext } from "react";
import { CommerceContext } from "../../contexts/commerce/commerce-context";

export const useCommerce = () => {
  const commerce = useContext(CommerceContext);

  if (commerce === undefined) {
    throw new Error(
      "useShoppingCart must be used within a ShoppingCartProvider"
    );
  }

  return commerce;
};
