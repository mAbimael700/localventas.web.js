import { useContext } from "react";
import { ProductosMenuContext } from "../../../contexts/dashboard/productos/productos-menu-context";

export const useProductosMenu = () => {
  const menuData = useContext(ProductosMenuContext);

  if (menuData === undefined) {
    throw new Error(
      "useProductosMenu must be used within a ProductosMenuProvider"
    );
  }

  return menuData;
};
