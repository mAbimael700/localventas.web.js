import React from "react";
import { HorariosForm } from "./components/forms/horarios-form";
import { Separator } from "@/components/ui/separator";

export const ConfiguracionHorariosEntrega = () => {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-medium text-lg">Horarios de entrega</h1>
        <p className="text-sm text-muted-foreground">
          Maneja los horarios de entrega de tu tienda
        </p>
      </header>

      <Separator />
      <HorariosForm />
    </div>
  );
};
