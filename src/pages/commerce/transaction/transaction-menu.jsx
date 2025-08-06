import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { transactionBuyingCartSchema } from "../../../schemas/commerce/transaction/cart/buying-cart-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { MultiStepForm } from "@/components/ui/multi-form";
import ProtectedRoute from "../../../components/protected-route/protected-route";
import { useShoppingCart } from "../../../hooks/shopping-cart/useShoppingCart";
import { useParams } from "react-router-dom";

export const TransactionMenu = () => {
  const { tienda: tiendaId } = useParams();
  const form = useForm({
    resolver: zodResolver(transactionBuyingCartSchema),
    defaultValues: {
      cve_carrito: null,
      cve_direccion_entrega: null,
      cve_direccion_horario_entrega: null,
    },
  });

  const { cart } = useShoppingCart();

  useEffect(() => {
    form.setValue("cve_carrito", cart.id);
  }, [cart.id, tiendaId]);

  return (
    <MultiStepForm form={form}>
      <ProtectedRoute />
    </MultiStepForm>
  );
};
