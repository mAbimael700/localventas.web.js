import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const SolicitudEmpleoCard = ({ solicitud }) => {
  const { id, estado, tienda, empleador, usuario, fecha_expiracion } =
    solicitud;
  return (
    <Link to={`/my-account/solicitudes-empleo/${id}`}>
      <Card className="rounded-sm">
        <CardHeader className="flex-row justify-between">
          <div>
            <CardTitle>Solicitud de empleo de {tienda?.nombre}</CardTitle>
            <CardDescription>Solicitud: {id}</CardDescription>
          </div>

          <Badge className="h-6">{estado.toUpperCase()}</Badge>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="font-medium">
            Expira el {format(new Date(fecha_expiracion), "PPPp", { locale: es })}
          </p>
          <p>Empleador: {empleador.nombre}</p>
        </CardContent>
      </Card>
    </Link>
  );
};
