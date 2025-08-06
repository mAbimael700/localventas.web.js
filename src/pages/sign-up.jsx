import { Input } from "@/components/ui/input";
import { FormLayout } from "../components/form/form-layout";
import { usuariosSchema } from "../schemas/usuarios-schema";
import { AuthUserFormLayout } from "./auth-user-form-layout";
import { API_URL } from "../auth/constants";
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../auth/auth-provider";
import { AlertDestructiveError } from "../components/alert-error";
export const Signup = () => {
  return (
    <AuthUserFormLayout>
      <SignupForm />
    </AuthUserFormLayout>
  );
};

export const signupFields = [
  {
    title: "Hola, ¿Con quién tengo el gusto?",
    desc: "Bienvenido, ¡sé parte de Localventas!",
    fields: [
      {
        name: "nombre",
        label: "Nombre",
        input: <Input type="text" placeholder="Nombre" className="h-9" />,
      },

      {
        name: "paterno",
        label: "Apellido paterno",
        input: <Input type="text" placeholder="Paterno" className="h-9" />,
      },
      {
        name: "materno",
        label: "Apellido materno",
        input: <Input type="text" placeholder="Materno" className="h-9" />,
      },
      {
        isDatePicker: true,
        name: "fecha_nacimiento",
        label: "Fecha de nacimiento",
      },
      {
        name: "telefono",
        label: "Número de teléfono",
        input: (
          <Input type="text" placeholder="Teléfono" className="h-9 w-[240px]" />
        ),
      },
      {
        className: "w-[240px] h-9",
        isSelect: true,
        name: "sexo",
        label: "Sexo",
        values: [
          { label: "Hombre", value: "H" },
          { label: "Mujer", value: "M" },
          { label: "Otro", value: "O" },
        ],
      },
    ],
  },
  {
    title: "Datos de la cuenta",
    desc: "Estos serán los datos para iniciar sesión en tu cuenta.",
    fields: [
      {
        name: "correo_electronico",
        label: "Correo electrónico",
        input: <Input type="email" placeholder="another@example.com" />,
      },
      {
        name: "contrasena",
        label: "Contraseña",
        input: <Input type="password" placeholder="Contraseña" />,
      },
      {
        name: "confirmar_contrasena",
        label: "Confirmar la contraseña",
        input: <Input type="password" placeholder="Confirma la contraseña" />,
      },
      {
        isCheckbox: true,
        name: "terminos_condiciones",
        label: "Aceptar los términos y condiciones.",
        desc: " Al marcar esta casilla, confirmo que he leído y acepto los términos y condiciones de uso.",
      },
    ],
  },
];

const signupDefaultValues = {
  nombre: "",
  paterno: "",
  materno: "",
  fecha_nacimiento: "",
  telefono: "",
  sexo: "",
  correo_electronico: "",
  confirmar: "",
  confirmar_contrasena: "",
  terminos_condiciones: false,
};

export const SignupForm = () => {
  const auth = useAuth();
  const [errorResponse, setErrorResponse] = useState("");
  const goTo = useNavigate();
  async function handleSubmit(data) {
    try {
      const {
        nombre,
        paterno,
        materno,
        fecha_nacimiento,
        contrasena,
        telefono,
        correo_electronico,
        sexo,
      } = data;

      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          paterno,
          materno,
          fecha_nacimiento,
          contrasena,
          correo_electronico,
          telefono,
          sexo,
        }),
      });

      if (response.ok) {
        console.log("Usuario creado correctamente");
        setErrorResponse("");
        goTo("./select-plan", { state: { userData: data } }); // Redirige a la página SelectPlanPage
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
    <>
      {!auth.isAuthenticated ? (
        <div className="space-y-3">
          {!!errorResponse && <AlertDestructiveError message={errorResponse} />}
          <FormLayout
            onSubmitFn={handleSubmit}
            hasMultiSteps
            fieldsList={signupFields}
            schema={usuariosSchema}
            defaultValues={signupDefaultValues}

          />
        </div>
      ) : (
        <Navigate to={"/"} />
      )}
    </>
  );
};
