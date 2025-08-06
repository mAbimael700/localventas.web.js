import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const ShoppingCart = ({ children }) => {
  return (
    <Popover>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent>{children}</PopoverContent>
    </Popover>
  );
};

ShoppingCart.ProductCard = function () {
  return <></>;
};
