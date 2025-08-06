import React from "react";
import { TransactionMenu } from "../transaction-layout";
import { Button } from "@/components/ui/button";
import { useCommerce } from "../../../../hooks/commerce/useCommerce";
import { DireccionCardTransaction } from "./components/direccion-card";
useFormContext;
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/multi-form";
import { RadioGroup } from "@/components/ui/radio-group";
import { useFormContext } from "react-hook-form";

export const TransactionDireccion = () => {
  const { direcciones } = useCommerce();
  const form = useFormContext();

  return (
    <TransactionMenu>
      <TransactionMenu.Header>
        <TransactionMenu.Title>
          Selecciona la dirección donde quieres recibir tu pedido
        </TransactionMenu.Title>

        <TransactionMenu.Description>
          Puedes decidir dónde recoger tu pedido en las direcciones disponibles
          de entrega
        </TransactionMenu.Description>
      </TransactionMenu.Header>

      <TransactionMenu.Content className="">
        <FormField
          control={form.control}
          name="cve_direccion_entrega"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className=""
                >
                  {direcciones &&
                    Array.from(direcciones).map((direccion) => (
                      <DireccionCardTransaction
                        key={`direccion-${direccion.id}`}
                        direccion={direccion}
                      />
                    ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button>Continuar</Button>
      </TransactionMenu.Content>
    </TransactionMenu>
  );
};
