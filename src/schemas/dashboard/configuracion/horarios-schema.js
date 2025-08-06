import { z } from "zod";
import { diasSemana } from "../../../constants/diasSemana";

export const horarioSchema = z.object({
  cve_direccion: z.number().int().positive(),
  hora: z.date(),
  dia: z.enum(diasSemana),
});
