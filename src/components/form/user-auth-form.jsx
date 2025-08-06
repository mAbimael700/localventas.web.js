/* eslint-disable react/prop-types */
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import * as React from "react";

import { cn } from "@/lib/utils";
import { API_URL } from "../../auth/constants";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/auth-provider";

export function UserAuthForm({ className, ...props }) {
  const [errorResponse, setErrorResponse] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const goTo = useNavigate();
  const auth = useAuth();

  const formSchema = z.object({
    correo_electronico: z
      .string({ required_error: "El correo electrónico es requerido." })
      .email({ message: "El correo electrónico no es válido." }),
    contrasena: z
      .string()
      .min(6, { message: "La contraseña debe tener mínimo 6 carácteres." }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      correo_electronico: "",
      contrasena: "",
    },
  });

  async function onSubmit(data) {
    try {
      const { correo_electronico, contrasena } = data;
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

        const json = await response.json()

        if (json.body.accessToken && json.body.refreshToken){
          auth.saveUser(json)
          goTo(-1);
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

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }


  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {!!errorResponse && (
        <Alert variant="destructive" className="rounded-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorResponse}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Iniciar sesión
        </h1>
        <p className="text-sm text-muted-foreground">
          Ingresa tu correo electrónico para iniciar sesión
        </p>
      </div>
      

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="correo_electronico"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contrasena"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Contraseña"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <br />
            </div>
            <Button disabled={isLoading} type="submit">
              Iniciar sesión con Email
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
