import { z } from "zod";

export const EmpleadoInviteSchema = z.object(
    {
        usuario_correo_electronico: z.string().email(),
    }
)