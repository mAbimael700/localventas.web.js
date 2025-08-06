import { z } from "zod";

export const clienteSchema = z.object({
  nombre: z.string().min(2),
  paterno: z.string().min(2),
  materno: z.string().min(2),
  telefono: z
    .string({ required_error: "Su número de teléfono es requerido." })
    .length(10, { message: "El número de teléfono debe tener 10 dígitos." })
    .refine((numero) => /^[0-9]+$/.test(numero), {
      message: "El número telefónico debe contener solo dígitos.",
    }),
  correo_electronico: z.string().email(),
  genero: z.enum(["H", "M", "O"]),
});
