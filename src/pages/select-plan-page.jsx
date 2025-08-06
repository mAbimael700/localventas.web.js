import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingBag, Store } from "lucide-react";
import { AuthUserFormLayout } from "./auth-user-form-layout";
import { useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useAuth } from "../auth/auth-provider";
import { AlertDestructiveError } from "../components/alert-error";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useState } from "react";
import { API_URL } from "../auth/constants";
import { useNavigate } from "react-router-dom";

const FormSchema = z.object({
  type: z.enum(["emprendedor", "cliente"], {
    required_error: "You need to select a notification type.",
  }),
});

export const SelectPlanPage = () => {
  const [clienteCheck, setClienteCheck] = useState(false);
  const [emprendedorCheck, setEmprendedorCheck] = useState(false);
  const [errorResponse, setErrorResponse] = useState("");
  const auth = useAuth();
  const goTo = useNavigate();
  const form = useForm({
    resolver: zodResolver(FormSchema),
  });

  const location = useLocation();
  const userData = location.state.userData;

  async function onSubmit(data) {
    const { type } = data;

    try {
      const { correo_electronico, contrasena } = userData;
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo_electronico,
          contrasena,
        }),
      });

      if (response.ok) {
        console.log("Sesión iniciada correctamente.");
        setErrorResponse("");

        const json = await response.json();

        if (json.body.accessToken && json.body.refreshToken) {
          auth.saveUser(json);
          if (type === "emprendedor") {
            goTo("/dashboard");
          } else {
            goTo("/");
          }
        }
      } else {
        console.log("Algo salío mal.");
        const json = await response.json();

        setErrorResponse(json.body.error_message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthUserFormLayout>
      {!!errorResponse && <AlertDestructiveError message={errorResponse} />}

      <header>
        <Label className="text-3xl font-bold text-center">
          Selecciona un plan
        </Label>
        <p className="text-muted-foreground mb-2">
          ¿Cómo deseas usar la plataforma? Siendo un nuevo...
        </p>
        <Separator></Separator>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormItem>
                      <FormControl>
                        <RadioGroupItem
                          onClick={() => {
                            setEmprendedorCheck(true);
                            setClienteCheck(false);
                          }}
                          value="emprendedor"
                          className="hidden"
                        />
                      </FormControl>

                      <FormLabel
                        className={cn(
                          emprendedorCheck
                            ? buttonVariants({ variant: "default" })
                            : buttonVariants({ variant: "outline" }),
                          "text-xl flex-col gap-2 h-32 w-full"
                        )}
                      >
                        <Store />
                        Emprendedor
                      </FormLabel>
                    </FormItem>

                    <FormItem>
                      <FormControl>
                        <RadioGroupItem
                          onClick={() => {
                            setClienteCheck(true);
                            setEmprendedorCheck(false);
                          }}
                          value="cliente"
                          className="hidden"
                        />
                      </FormControl>

                      <FormLabel
                        className={cn(
                          clienteCheck
                            ? buttonVariants({ variant: "default" })
                            : buttonVariants({ variant: "outline" }),
                          "text-xl flex-col gap-2 h-32 w-full"
                        )}
                      >
                        <ShoppingBag />
                        Comprador
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Confirmar</Button>
        </form>
      </Form>

      <Toaster />
    </AuthUserFormLayout>
  );
};
