import React from "react";
import { clienteSchema } from "../../../schemas/clientes-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_URL } from "../../../auth/constants";
import { useAuth } from "../../../auth/auth-provider";
import { Link, useParams } from "react-router-dom";
import { NavigatePreviousButton } from "../../../components/form/navigate-previous-button";

import Ilustration from "@/assets/customer-illustration.jpg";

export const ClientesForm = () => {
  const form = useForm({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nombre: "",
      paterno: "",
      materno: "",
      correo_electronico: "",
      telefono: "",
      genero: null,
    },
  });

  const { tienda } = useParams();

  const { getAccessToken } = useAuth();
  async function onSubmit(values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    const response = await fetch(`${API_URL}/clientes`, {
      body: JSON.stringify({ ...values, cve_tienda: tienda }),
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      form.reset();
      alert("Cliente registrado!");
    } else {
      alert("error");
    }
  }

  return (
    <section className="pb-5 w-full flex flex-col md:flex-row gap-10 justify-center">
      <section className="md:w-[40%] space-y-3">
      <NavigatePreviousButton />
        <header>
          <h1 className="font-medium text-xl">Registrar cliente</h1>
          <p className="text-sm text-muted-foreground">
            Maneja los datos del cliente
          </p>
        </header>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6  ">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre(s)" className="h-9" {...field} />
                  </FormControl>
                  <FormDescription>
                    El nombre con el que identificarás al cliente.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Apellidos</FormLabel>
              <div className="flex w-full gap-7 ">
                <FormField
                  control={form.control}
                  name="paterno"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormControl>
                        <Input
                          placeholder="Paterno"
                          className="h-9"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-sm text-muted-foreground">
                        Ingresa los apellidos del cliente.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="materno"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormControl>
                        <Input
                          placeholder="Materno"
                          className="h-9"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="correo_electronico"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@domain.com"
                      className="h-9"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Este es el correo electrónico de contacto de tu cliente.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-6  ">
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="XXX - XXX - XXXX"
                        className="h-9"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Este es el teléfono de contacto de tu cliente.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="genero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Género</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9">
                          <SelectValue>
                            {field.value ? field.value : <span className="text-muted-foreground "> Selecciona un género</span> }
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="H">Hombre</SelectItem>
                        <SelectItem value="M">Mujer</SelectItem>
                        <SelectItem value="O">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Este dato sirve a la aplicación para los servicios de
                      estadísticas para emprendedores.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </section>

      <picture className="self-center">
        <img src={Ilustration} alt="" className="max-h-[520px] w-auto" />
        <Link
          className="text-xs text-muted-foreground"
          to="https://www.freepik.com/free-vector/customer-service-concept-illustration_82466248.htm#fromView=search&page=1&position=8&uuid=022282c5-42ca-4e1b-83d0-198daeec7a54"
        >
          Image by storyset on Freepik
        </Link>
      </picture>
    </section>
  );
};
