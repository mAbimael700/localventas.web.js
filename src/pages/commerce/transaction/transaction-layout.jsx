import React from "react";

import { useShoppingCart } from "../../../hooks/shopping-cart/useShoppingCart";

import { cn } from "../../../lib/utils";
import { ItemDetails } from "./details/item-details";
import { Separator } from "@/components/ui/separator";

export const TransactionMenu = ({
  children,
  title,
  description,
  className,
  ...props
}) => {
  const { cart, getTotalPriceCart } = useShoppingCart();

  // 2. Define a submit handler.
  function onSubmit(data) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(data);
  }

  return (
    <div className={cn("grid grid-cols-6", className)} {...props}>
      <section className="col-span-6 lg:col-span-4 p-3 md:p-10">{children}</section>

      <section className="col-span-6 lg:col-span-2 space-y-4 bg-background m-3 md:m-10 rounded p-5 md:p-10 lg:min-h-[82vh] shadow-sm">
        <h1 className="font-medium text-lg">Resumen de compra</h1>

        <Separator />

        {cart.items.length > 0 && (
          <>
            <ul className="space-y-1.5">
              {cart.items.map((item) => (
                <ItemDetails key={`product-detail-${item.folio}`} item={item} />
              ))}
              
            </ul>

            <Separator />

            <div className="flex justify-between text-lg font-medium">
              <h2 className=" font-normal text-muted-foreground">Total</h2>
              <span>{getTotalPriceCart()}</span>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

TransactionMenu.Header = function TransactionHeader({ children }) {
  return (
    <header className="flex flex-col gap-0.5 w-full px-6">{children}</header>
  );
};

TransactionMenu.Content = function TransactionContent({
  children,
  className,
  ...props
}) {
  return (
    <section className={cn("md:p-6 space-y-5", className)} {...props}>
      {children}
    </section>
  );
};

TransactionMenu.Title = function TransactionTitle({ children }) {
  return <h1 className="font-medium text-xl">{children}</h1>;
};

TransactionMenu.Description = function TransactionDescription({ children }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
};
