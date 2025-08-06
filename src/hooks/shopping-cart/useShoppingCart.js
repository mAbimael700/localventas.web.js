import { useContext } from "react";
import { ShoppingCartContext } from "../../contexts/shopping-cart-context";

export const useShoppingCart = () => {
  const cart = useContext(ShoppingCartContext);

  if (cart === undefined) {
    throw new Error(
      "useShoppingCart must be used within a ShoppingCartProvider"
    );
  }

  return cart;
};
