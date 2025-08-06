import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getUserNavFallback } from "../../../utils/get-user-nav-name";
import { Link } from "react-router-dom";

const TiendaOptions = ({}) => {
  return <></>;
};

export const TiendaCard = ({ tienda, to }) => {
  const { id, descripcion, logo, nombre, rol } = tienda;
  const fallback = getUserNavFallback(nombre);

 

  return (
    <Link
      className="md:w-[250px] lg:w-[250px]text-ellipsis "
      to={to ?? `./${id}/ventas/resumen`}
    >
      <Card className="shadow hover:shadow-xl pb-4  hover:bg-accent md:w-[250px] lg:w-[250px] h-[180px]">
        <CardContent className="pt-4 pb-2 flex items-center gap-4">
          <picture>
            <Avatar className="border border-muted-foreground">
              <AvatarImage src={logo} alt={nombre} />
              <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
          </picture>
          <CardTitle className="text-xl">{nombre}</CardTitle>
        </CardContent>
        <CardFooter className="justify-between flex-col">
          <CardDescription className="self-start ">
            <p className="overflow-y-auto h-[68px] pb-2">{descripcion}</p>
          </CardDescription>
          {rol && (
            <Badge className="bg-red-700 capitalize self-end">
              {rol.nombre}
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};
