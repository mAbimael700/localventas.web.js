import { Link, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { useToast } from "@/components/ui/use-toast";
import { getTiendaById, updateTienda } from "../../../services/tiendas";
import { useAuth } from "../../../auth/auth-provider";
import { useEffect, useState } from "react";

const FormSchema = z.object({
  nombre: z
    .string()
    .min(2, {
      message: "El nombre debe tener al menos dos carácteres.",
    })
    .max(30, {
      message: "El nombre no debe sobre pasar los 30 caracteres.",
    }),
  descripcion: z.string().max(500).min(4),
});

// This can come from your database or API.

export function DashboardConfiguracionTienda() {
  const [tiendaData, setTiendaData] = useState({ nombre: "", descripcion: "" });

  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: tiendaData,
    mode: "onChange",
  });

  const { tienda: tiendaId } = useParams();
  const { getAccessToken } = useAuth();

  async function getTiendaData() {
    const response = await getTiendaById({
      tiendaId,
      accessToken: getAccessToken(),
    });

    if (response) {
      setTiendaData({
        nombre: response.nombre,
        descripcion: response.descripcion,
      });
    }
  }

  async function onSubmit(data) {
    if (form.formState.isDirty) {
      const fields = form.formState.dirtyFields;

      let fieldsModified = {};

      Object.keys(fields).forEach(
        (field) => (fieldsModified[field] = form.getValues(field))
      );

      try {
        const response = await updateTienda({
          tiendaId,
          accessToken: getAccessToken(),
          input: fieldsModified,
        });

        if (response.ok) {
          toast({
            description: "La tienda ha sido actualizada.",
          });
        } else {
          const json = await response.json();
        
          throw new Error(json.body?.error_message);
        }
      } catch (error) {
        console.log(error);
        toast({
          variant: "destructive",
          description: error.message,
        });
      }
    }
  }

  useEffect(() => {
    getTiendaData();
  }, [form.formState.isSubmitted, tiendaId]);

  useEffect(() => {
    form.reset(tiendaData); // Actualiza los valores del formulario cuando cambia tiendaData
  }, [tiendaData]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Datos de la tienda</h3>
        <p className="text-sm text-muted-foreground">
          Estos son los datos públicos que verán los usuarios en el sitio.
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} />
                </FormControl>
                <FormDescription>
                  Este es el nombre público de tu tienda. Solo puedes cambiar el
                  nombre cada 30 días.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Cuentános un poco sobre de qué trata la tienda..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Da una breve descripción sobre lo que ofrece tu tienda.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.isDirty && (
            <Button className="transition-all" type="submit">
              Actualizar
            </Button>
          )}
        </form>
      </Form>

    </div>
  );
}
