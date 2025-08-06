import React from "react";
import { UserInfo } from "../../user/user-info";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  DotsHorizontalIcon,
  PlusCircledIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { currencyFormat } from "../../commerce/productos/producto-card";
import { formatDireccion } from "@/utils/direccionFormatter.js";

export const VentaDetallesCard = ({ venta }) => {
  const {
    folio,
    vendedor,
    fecha_venta,
    cliente,
    descripcion,
    estado,
    deuda,
    subtotal,
    total,
    direccion,
  } = venta;
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-4 pb-4">
        <div className=" pb-2">
          <h1 className="font-semibold text-xl">
            Folio de venta: {folio && folio}
          </h1>
          <div className="text-sm">
            {format(new Date(fecha_venta), "PPPpp", {
              locale: es,
            })}
          </div>
        </div>

        <Separator />

        <div className="space-y-2.5 ">
          <h2 className="font-semibold text-sm">Realizado por:</h2>

          <div className="relative">
            <UserInfo
              username={vendedor.nombre}
              email={vendedor.correo_electronico}
            />

            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 "
            >
              <DotsHorizontalIcon className="h-8" />
            </Button>
          </div>
        </div>

        <div>
          <span className="font-semibold text-sm">Cliente</span>

          {cliente ? (
            <UserInfo
              username={cliente.nombre}
              email={cliente.correo_electronico}
            />
          ) : (
            <span className="text-muted-foreground flex items-center gap-2 text-sm">
              <QuestionMarkCircledIcon /> No registrado
            </span>
          )}
        </div>

        {descripcion && (
          <div>
            <h2 className="text-sm font-semibold">Concepto</h2>
            <p className="text-sm">{descripcion}</p>
          </div>
        )}

        <div>
          <span className="font-semibold text-sm">Estado</span>
          {estado === false || estado === null || estado === undefined ? (
            <span className="text-md text-muted-foreground items-center text-sm gap-2 flex">
              <CrossCircledIcon className="text-destructive" /> No pagado
            </span>
          ) : (
            <span className="text-md text-muted-foreground items-center text-sm gap-2 flex">
              <CheckCircledIcon className="text-green-400" /> Pagado
            </span>
          )}
        </div>

        {direccion && (
          <div>
            <h3 className="font-semibold text-sm">Dirección de entrega</h3>
            <div className="whitespace-pre-wrap w-1/2 text-sm">{formatDireccion(direccion)}</div>
          </div>
        )}

        {estado === false ||
          (estado === null && (
            <Button onClick={() => goTo(`../../pagos/registrar-pago/${folio}`)}>
              <PlusCircledIcon className="mr-2" /> Agregar abono
            </Button>
          ))}
      </div>

      <div>
        <Separator /> <br />
        {deuda > 0 && (
          <div className="flex gap-2 justify-between font-semibold">
            <span className="font-semibold">Deuda por pagar: </span>
            {currencyFormat(deuda)}
          </div>
        )}
        <br />
        <div className="flex gap-2 justify-between font-semibold">
          <span className="font-semibold">Subtotal: </span>
          {subtotal && currencyFormat(subtotal)}
        </div>
        <div className="flex gap-2 justify-between font-semibold">
          <span className="font-semibold">Total: </span>
          {total && currencyFormat(total)}
        </div>
      </div>
    </div>
  );
};
