import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster } from "@/components/ui/Toaster";
import { useToast } from "@/components/ui/use-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { API_URL } from "@/auth/constants";
import { useAuth } from "@/auth/auth-provider";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AlertDestructiveError } from "@/components/alert-error";
import { getMarcaById } from "@/services/marcas";
import { useProductosMenu } from "@/hooks/dashboard/productos/useProductosMenu";

export const MarcasSheetForm = ({}) => {
  const {
    openMarcaForm: open,
    openChangeMarcaForm: openChange,
    marcaSelected,
  } = useProductosMenu();
  const {toast} = useToast()

  const isUpdate = Object.keys(marcaSelected).length > 0;
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      form.reset({
        nombre: "",
        codigo: "",
      });
    }
  }, [open]);

  const marcaSchema = z.object({
    nombre: z.string().min(2),
    codigo: z
      .string()
      .min(2)
      .refine((str) => str.toUpperCase()),
  });

  const auth = useAuth();
  const form = useForm({
    resolver: zodResolver(marcaSchema),
    defaultValues: { nombre: "", codigo: "" },
  });
  const { tienda } = useParams();

  async function onSubmit(data) {
    const { nombre, codigo } = data;

    try {
      const response = await fetch(`${API_URL}/marcas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
        body: JSON.stringify({
          nombre,
          codigo,
          cve_usuario: auth.getUser()?.id,
          cve_tienda: tienda,
        }),
      });

      if (response.ok) {
        form.clearErrors();
        form.reset({ nombre: "", codigo: "" });
        setError("");
        setPosted(true);
      } else {
        setPosted(false);
        const data = await response.json();
        setError(data.body.error_message);
      }
    } catch (error) {
      throw new Error("Hubo un error en la base de datos");
    }
  }

  async function updateSubmit(data) {
    const { nombre, codigo } = data;

    try {
      const response = await fetch(`${API_URL}/marcas/${marcaSelected.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
        body: JSON.stringify({
          nombre,
          codigo,
        }),
      });

      if (response.ok) {
        form.clearErrors();
        toast({
          description: `La categoría ${form.watch('nombre').toLocaleLowerCase()} ha sido actualizada`
        })
        setError("");
      } else {
        const data = await response.json();
        setError(data.body.error_message);
      }
    } catch (error) {
      throw new Error("Hubo un error en la base de datos");
    }
  }

  function handleSubmit(data) {
    if (isUpdate) {
      updateSubmit(data);
    } else {
      onSubmit(data);
    }
  }

  async function getCategoria() {
    if (isUpdate) {
      const response = await getMarcaById({
        tiendaId: tienda,
        marcaId: marcaSelected.id,
        accessToken: auth.getAccessToken(),
      });

      if (response.ok) {
        const json = await response.json();

        form.setValue("nombre", json.body.marca);
        form.setValue("codigo", json.body.codigo);
      } else {
        form.reset();
      }
    }
  }

  useEffect(() => {
    getCategoria();
  }, [marcaSelected]);

  return (
    <Sheet open={open} onOpenChange={openChange}>
      <SheetContent>
        {error && (
          <div className="pt-5 pb-4">
            <AlertDestructiveError message={error} />
          </div>
        )}

        <SheetHeader>
          <SheetTitle>
            {isUpdate ? "Actualizar marca" : "Crear marca"}
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? "Formulario para actualizar la marca seleccionada"
              : "Crea una marca para filtrar o categorizar tus productos en nuestra plataforma."}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Natura"
                          className="col-span-3"
                          {...field}
                        />
                      </FormControl>
                    </div>

                    <FormDescription className="col-span-3">
                      Este es el nombre de la marca.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="codigo"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Código</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="NT"
                          className="col-span-3"
                          {...field}
                        />
                      </FormControl>
                    </div>

                    <FormDescription className="col-span-3">
                      Este es el código de la marca.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SheetFooter>
                <Button type="submit">Guardar</Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
        <Toaster />
      </SheetContent>
    </Sheet>
  );
};
