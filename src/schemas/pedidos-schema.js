import { z } from "zod";

export const pedidoSchema = z.object({
    cve_venta: z.number().int().positive(),
    cve_direccion_entrega: z.number().int().positive(),
    estado_entrega: z.enum(["Entregado", "No entregado", "Pendiente"]),
  });