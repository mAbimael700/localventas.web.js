import React from "react";
import { currencyFormat } from "../../../../utils/numberFormatting";

export const ItemDetails = ({ item }) => {
  const { producto, nombre, precio_venta, cantidad } = item;
  return (
    <li className="text-sm text-muted-foreground grid grid-cols-4 justify-between gap-5 items-center">
      <div className="flex gap-3 col-span-3 items-center justify-between w-full">
        <p className="">{producto || nombre}</p>
        <span>x{cantidad}</span>
      </div>

      <div className="flex gap-4 font-medium text-primary">
        {currencyFormat(precio_venta)}
      </div>
    </li>
  );
};
