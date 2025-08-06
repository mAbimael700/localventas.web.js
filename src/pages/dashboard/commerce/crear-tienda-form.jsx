import React, { useState } from "react";
import { FormLayout } from "../../../components/form/form-layout";
import { tiendasSchema } from "../../../schemas/tiendas-schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { API_URL } from "../../../auth/constants";
import { AlertDestructiveError } from "../../../components/alert-error";
import { useAuth } from "../../../auth/auth-provider";
import { UserNavbar } from "../../../components/user/user-navbar";

const tiendaInputs = [
  {
    fields: [
      {
        name: "nombre",
        label: <span className="after:content-['*'] after:text-destructive after:pl-1">Nombre</span>,
        input: <Input type="text" className="h-9 " placeholder="Acme Inc." />,
        desc: "Este será el nombre de la tienda que se les mostrará a los clientes.",
      },
    ],
  },
  {
    fields: [
      {
        name: "descripcion",
        label: <span className="after:content-['*'] after:text-destructive">Descripción</span>,
        input: <Textarea type="text" placeholder="Cuentanos un poco sobre tu nueva tienda." />,
        desc: "Este será la descripción de la tienda que se les mostrará a los clientes.",
      },
      {
        name: "direccion",
        label: "Dirección",
        input: <Textarea type="text" placeholder="Introduce una dirección" />,
        desc: "Con esta dirección tus clientes podrán ubicar tu tienda. (En caso de tener un establecimiento físico)",
      },
    ],
  },
];

const tiendaDefaultValues = {
  nombre: "",
  descripcion: "",
  direccion: "",
};

export const CrearTiendaForm = () => {
  const goTo = useNavigate();
  const [error, setError] = useState("");
  const auth = useAuth();

  const handleSubmit = async (data) => {
    const { nombre, descripcion, direccion } = data;

    try {
      const response = await fetch(`${API_URL}/tiendas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          direccion,
          cve_usuario: auth.getUser()?.id,
        }),
      });

      if (response.ok) {
        goTo("/dashboard");
      } else {
        const data = await response.json();
        setError(data.body.error_message);
      }
    } catch (error) {}
  };
  return (
    <div>
      <div className="bg-gradient-to-b from-red-700 from-75% to-red-900 h-[26vh]">
        <UserNavbar className='text-background' />
      </div>

      <main className="m-[0_auto] w-[50%] py-10 px-6 space-y-2">
        <Link
          onClick={() => goTo(-1)}
          className="text-muted-foreground text-sm flex items-center gap-2"
        >
          <ChevronLeftIcon /> Regresar
        </Link>

        {error && <AlertDestructiveError message={error} />}

        <FormLayout
          hasMultiSteps
          title={"Crea una nueva tienda"}
          desc={"Administra tu negocio en nuestra plataforma Localventas."}
          schema={tiendasSchema}
          fieldsList={tiendaInputs}
          onSubmitFn={handleSubmit}
          defaultValues={tiendaDefaultValues}
        />
      </main>
    </div>
  );
};
