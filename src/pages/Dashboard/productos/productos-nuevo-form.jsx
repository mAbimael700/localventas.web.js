import React from "react";
import { FormLayout } from "@/components/form/form-layout";
import {
  FormSeparator,
  FormSeparatorTitle,
  FormSeparatorDesc,
} from "@/components/form-multi-step";
import { productosSchema } from "@/schemas/productos-schema";
import { Button } from "@/components/ui/button";
import { productosFormFields } from "@/components/dashboard/productos/productos-nuevo-fields";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { NavigatePreviousButton } from "../../../components/form/navigate-previous-button";

export const ProductosNuevoForm = () => {
  const goTo = useNavigate();
  const sidebarItems = [
    { name: "producto", title: "Producto" },
    { name: "descripcion", title: "Descripción" },
    { name: "fotos", title: "Fotos" },
    { name: "resumen", title: "Resumen" },
  ];

  return (
    <div className="absolute top-16 left-0  px-7 space-y-2 w-[98vw] bg-white">
      <div className="space-y-4">
        
        <FormSeparator><NavigatePreviousButton />
          <div className="flex gap-5">
            <div className="flex-col pb-1.5">
              <FormSeparatorTitle>Producto</FormSeparatorTitle>
              <FormSeparatorDesc>
                Formulario para crear productos
              </FormSeparatorDesc>
            </div>
          </div>
        </FormSeparator>

        <FormLayout
          schema={productosSchema}
          fieldsList={productosFormFields}
          hasMultiSteps
          hasSidebar
          sidebarItems={sidebarItems}
        />
      </div>
    </div>
  );
};
