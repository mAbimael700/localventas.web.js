import { z } from "zod";

export const direccionSchema = z.object({
    direcciones: z
      .array(
        z.object({
          id: z.number().int().positive().optional(),
          cve_pais: z.number().int().positive(),
          cve_estado: z.number().int().positive(),
          calle: z.string().min(2).max(300),
          codigo_postal: z.string().length(5),
          ciudad: z.string().min(2).max(50),
          referencia: z.string().min(2).max(200).optional(),
          principal: z.boolean(),
          numInt: z.string().max(30).optional(),
          numExt: z.string().min(1).max(10),
          activo: z.boolean(),
        })
      )
      .max(5),
  });