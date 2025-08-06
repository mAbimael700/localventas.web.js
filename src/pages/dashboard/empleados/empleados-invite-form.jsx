import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EmpleadoInviteSchema } from "../../../schemas/empleados-schema";

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
import { Link, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Ilustration from "@/assets/employee-illustration.jpg";
import { NavigatePreviousButton } from "../../../components/form/navigate-previous-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {  SendIcon } from "lucide-react";
import {
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { createSolicitudEmpleo } from "../../../services/empleados";
import { useAuth } from "../../../auth/auth-provider";

export const EmpleadosInviteForm = () => {
  const form = useForm({
    resolver: zodResolver(EmpleadoInviteSchema),
    defaultValues: {
      usuario_correo_electronico: "",
    },
  });

  const { toast } = useToast();
  const { tienda } = useParams();
  const { getUser, getAccessToken } = useAuth();

  // 2. Define a submit handler.
  async function onSubmit(values) {
 
    const input = {
      cve_tienda: tienda,
      cve_empleador: getUser()?.id.toString(),
      correo_electronico_usuario: values.usuario_correo_electronico,
    };

    const response = await createSolicitudEmpleo({
      input,
      tiendaId: tienda,
      accessToken: getAccessToken(),
    });

    if (response.ok) {
      toast({
        description: "La solicitud ha sido enviada.",
      });
      form.reset();
    } else {
      const json = await response.json();
      toast({
        variant: json.body.error_message && "destructive",
        title: (
          <span className="flex gap-2 items-center">
            {json.body.error_message && <><ExclamationTriangleIcon /> Error</>}
          </span>
        ),
        description: <>{json.body.error_message || json.body.message}</>,
        action: <ToastAction altText="Okay">Entendido</ToastAction>,
      });
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex justify-center m-[0_auto] gap-12 h-[82vh] items-center "
        >
          <section className="col-span-2 space-y-3  self-start">
            <header>
              <NavigatePreviousButton className="mb-2" />
              <h1 className="font-semibold text-2xl">
                Registra un empleado a tu tienda
              </h1>
              <p className="text-sm text-muted-foreground">
                Puedes agregar empleados a tu tienda para su administración y
                gestión.
              </p>
            </header>
            <Separator />

            <section className="space-y-8">
              <FormField
                control={form.control}
                name="usuario_correo_electronico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico del usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="empleado@correo.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Ingresa el correo electrónico asociado a la cuenta del
                      empleado que quieras agregar.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Card className="rounded-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <InfoCircledIcon className="mr-2 h-4 w-4" />
                    Información sobre la solicitud de empleo
                  </CardTitle>
                </CardHeader>
                <CardContent className="w-[500px] text-sm text-accent-foreground space-y-4">
                  <p>
                    Al enviar la solicitud, le llegará un correo electrónico al
                    usuario correspondiente para confirmar su ingreso como
                    empleado a la tienda.
                  </p>
                </CardContent>
              </Card>

              <Button type="submit">
                Enviar solicitud
                <SendIcon className="ml-2 h-4 w-4" />
              </Button>
            </section>
          </section>

          <picture className=" col-span-4">
            <img src={Ilustration} alt="" className="max-h-[520px] w-auto" />
            <Link
              className="text-xs text-muted-foreground"
              to="https://www.freepik.com/free-vector/feedback-loop-concept-illustration_38604994.htm#fromView=search&page=1&position=6&uuid=d783f5ed-762b-4874-8146-e0146ed29ed9"
            >
              Image by storyset on Freepik
            </Link>
          </picture>
        </form>
      </Form>
    </div>
  );
};
