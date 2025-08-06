import * as z from "zod";

export const tiendasSchema = z.object({
  nombre: z
    .string({ required_error: "Por favor ingrese el nombre de la tienda." })
    .min(2, {
      message: "El nombre de la tienda debe tener mínimo dos caracteres.",
    })
    .max(50),
  descripcion: z.string({
    required_error: "Por favor ingrese la descripción de la tienda.",
  }).min(2),
  direccion: z.string().max(200).optional(),
});
