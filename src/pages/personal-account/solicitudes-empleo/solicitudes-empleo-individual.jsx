import React, { useEffect, useState } from "react";

import {
  getSolicitudesEmpleoById,
  responseSolicitudEmpleo,
} from "@/services/solicitudes-empleo.js";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/auth/auth-provider.jsx";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { NavigatePreviousButton } from "@/components/form/navigate-previous-button.jsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { LazyCargandoLoader } from "@/components/loaders/lazy-text-loader.jsx";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";

import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

export const SolicitudesEmpleoIndividual = () => {
  const [solicitudEmpleo, setSolicitudEmpleo] = useState(null);
  const goTo = useNavigate();
  const { solicitudId } = useParams();
  const { getAccessToken } = useAuth();
  async function getSolicitudEmpleo() {
    const solicitud = await getSolicitudesEmpleoById({
      accessToken: getAccessToken(),
      solicitudEmpleoId: solicitudId,
    });

    if (solicitud) {
      setSolicitudEmpleo(solicitud);
    } else {
      goTo("/my-account/solicitudes-empleo");
    }
  }

  const FormSchema = z.object({
    estado: z.enum(["aceptada", "rechazada"], {
      required_error: "Necesitas contestar la solicitud.",
    }),
  });
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data) {
    const response = await responseSolicitudEmpleo({
      accessToken: getAccessToken(),
      input: data,
      solicitudEmpleoId: solicitudId,
    });

    if (response.ok) {
      goTo("/my-account/solicitudes-empleo");
    } else {
      const json = await response.json();
      toast({
        variant: json.body.error_message && "destructive",
        title: (
          <span className="flex gap-2 items-center">
            {json.body.error_message && (
              <>
                <ExclamationTriangleIcon /> Error
              </>
            )}
          </span>
        ),
        description: <>{json.body.error_message || json.body.message}</>,
        action: <ToastAction altText="Okay">Entendido</ToastAction>,
      });
    }
  }

  useEffect(() => {
    getSolicitudEmpleo();
  }, [solicitudId]);

  return (
    <div className="space-y-5">
      <Toaster />
      <NavigatePreviousButton />
      <header>
        <h1 className="text-xl font-semibold">
          {solicitudEmpleo?.estado !== "pendiente"
            ? "Información de la solicitud"
            : "Responder solicitud"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Te ha llegado una solicitud para trabajar como empleado en la tienda{" "}
          <strong>{solicitudEmpleo?.tienda.nombre}</strong>
        </p>
      </header>

      <Separator />

      <section className="space-y-2">
        {solicitudEmpleo ? (
          <>
            <h2 className="font-semibold">Detalles de la solicitud </h2>

            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between w-full">
                <span>Solicitud ID:</span> {solicitudEmpleo.id}
              </li>
              <li className="flex items-center justify-between w-full">
                <span>Tienda:</span> {solicitudEmpleo.tienda.nombre}
              </li>
              <li className="flex items-center justify-between w-full">
                <span>Fecha de expiración:</span>{" "}
                {format(new Date(solicitudEmpleo.fecha_expiracion), "PPPp", {
                  locale: es,
                })}
              </li>
              <li className="flex items-center justify-between w-full">
                <span>Empleador</span> {solicitudEmpleo.empleador.nombre}
              </li>

              <li className="flex items-center justify-between w-full ">
                <span>Estado</span>{" "}
                <Badge className="capitalize">{solicitudEmpleo.estado}</Badge>
              </li>
            </ul>
          </>
        ) : (
          <LazyCargandoLoader label="Cargando los datos de la solicitud..." />
        )}
      </section>

      {solicitudEmpleo && solicitudEmpleo.estado === "pendiente" && (
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-2/3 space-y-6"
            >
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Respuesta de la solicitud</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="aceptada" />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center gap-1">
                            <CheckCircledIcon className="text-green-500" />{" "}
                            Aceptar
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="rechazada" />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center gap-1">
                            <CrossCircledIcon className="text-destructive" />
                            Rechazar
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <section className="flex gap-5">
                <Button type="submit">Confirmar</Button>
                <Button
                  type="button"
                  variant="destrutive"
                  onClick={() => {
                    goTo("/my-account/solicitudes-empleo");
                  }}
                >
                  Cancelar
                </Button>
              </section>
            </form>
          </Form>
          <Card className="rounded-sm mt-5 bg-accent border-muted-foreground">
            <CardHeader className="pb-1">
              <CardTitle className="text-lg">
                Información al aceptar la solicitud
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                Al confirmar, no podrás modificar esta acción. Para cualquier
                cambio, comunícate con un administrador de la tienda.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
