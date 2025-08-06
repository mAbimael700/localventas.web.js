import React from "react";
import { API_URL } from "../../../auth/constants";
import { PedidosForm } from "./pedidos-form";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../../../auth/auth-provider";

export const PedidosRegistrar = () => {
  const { tienda } = useParams();

  const { getAccessToken } = useAuth();

  async function onSubmit(data) {
    const response = await fetch(`${API_URL}/tiendas/${tienda}/pedidos`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
      },

      body: JSON.stringify({
        ...data,
        cve_tienda: tienda,
      }),

      method: "POST",
    });

    if (response.ok) {
      form.reset();
      toast({
        title: "Pago exitoso",
        description: "Se ha realizado el pago satisfactoriamente",
      });
      setPosted((prev) => !prev);
    } else {
      const json = await response.json();

      const { error } = json.body;

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error,
        });
      }
    }
  }
  return (
    <div>
      <PedidosForm  />
    </div>
  );
};
