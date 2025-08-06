import { z } from "zod"
 
export const transactionBuyingCartSchema = z.object({
  cve_carrito: z.number().int().positive(),
  cve_direccion_entrega: z.number().int().positive(),
  cve_direccion_horario_entrega: z.number().int().positive(),

  
})
