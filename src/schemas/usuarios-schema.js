import * as z from "zod";

export const usuariosSchema = z
  .object({
    nombre: z
      .string({ required_error: "Por favor, introduzca su nombre." })
      .min(2, { message: "Su nombre debe tener mínimo dos caracteres." })
      .max(50, { message: "Su nombre no debe de superar los 50 caracteres." }),
    fecha_nacimiento: z
      .date({
        required_error: "Su fecha de nacimiento es requerida.",
      })
      .transform((date) => new Date(date)),
    paterno: z
      .string({ required_error: "Por favor, introduzca su apellido paterno." })
      .min(2, { message: "Su apellido mínimo debe tener 2 caracteres." })
      .max(50, {
        message: "Su apellido no debe de superar los 50 caracteres.",
      }),
    materno: z
      .string({ required_error: "Por favor, introduzca su apellido materno." })
      .min(2, { message: "Su apellido mínimo debe tener 2 caracteres." })
      .max(50, {
        message: "Su apellido no debe de superar los 50 caracteres.",
      }),
    sexo: z
      .string({ required_error: "Por favor, seleccione una opción." })
      .max(2),
    correo_electronico: z
      .string({ required_error: "Introduzca un correo electrónico." })
      .email({ message: "El correo electrónico no es válido." }),
    contrasena: z
      .string({ required_error: "Introduzca su contraseña." })
      .min(6, { message: "La contraseña debe tener mínimo 6 caracteres." })
      .max(50, {
        message: "La contraseña no debe sobrepasar los 50 caracteres.",
      }),
    confirmar_contrasena: z
      .string({ required_error: "Por favor, confirme la contraseña." })
      .min(6, { message: "La contraseña debe tener mínimo 6 caracteres" })
      .max(50, {
        message: "La contraseña no debe sobrepasar los 50 caracteres.",
      }),
    terminos_condiciones: z
      .boolean({
        required_error: "Por favor marque la casilla para continuar.",
      })
      .refine((val) => val === !false, {
        message: "No puede continuar si no acepta los términos y condiciones.",
      }),
    telefono: z
      .string({ required_error: "Su número de teléfono es requerido." })
      .length(10, { message: "El número de teléfono debe tener 10 dígitos." })
      .refine((numero) => /^[0-9]+$/.test(numero), {
        message: "El número telefónico debe contener solo dígitos.",
      })
  })
  .refine((data) => data.contrasena === data.confirmar_contrasena, {
    message: "Las contraseñas deben coincidir.",
    path: ["confirmar_contrasena"],
  });
