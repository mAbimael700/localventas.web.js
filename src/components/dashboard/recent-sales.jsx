import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getVentasByTienda } from "../../services/ventas";
import { useAuth } from "../../auth/auth-provider";
import { PersonIcon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import {
  currencyFormat,
  formatNumberWithCommas,
} from "../../utils/numberFormatting";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function VentaCard({ cliente, fecha_venta, total, ventaId }) {
  const { tienda } = useParams();

  return (
    <Link
      to={`/dashboard/${tienda}/ventas/${ventaId}`}
      className="flex items-center hover:shadow rounded p-2 transition-all"
    >
      <Avatar className="h-9 w-9">
        <AvatarImage src="/avatars/01.png" alt="Avatar" />
        <AvatarFallback>
          <PersonIcon />
        </AvatarFallback>
      </Avatar>

      <div className="ml-4 space-y-1">
        {cliente ? (
          <>
            <p className="text-sm font-medium leading-none">Olivia Martin</p>
            <p className="text-sm text-muted-foreground">
              olivia.martin@email.com
            </p>

            <p className="text-sm text-muted-foreground">
              {fecha_venta ?? format(new Date(fecha_venta))}
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium leading-none flex gap-2">
              Cliente no registrado
            </p>
            <p className="text-sm text-muted-foreground">
              {fecha_venta &&
                format(new Date(fecha_venta), "PPpp", { locale: es })}
            </p>
          </>
        )}
      </div>
      <div className="ml-auto font-medium">
        {total && currencyFormat(total)}
      </div>
    </Link>
  );
}

export function RecentSales() {
  const [ventasData, setVentasData] = useState(null);
  const { tienda } = useParams();
  const { getAccessToken } = useAuth();

  async function getVentas() {
    const response = await getVentasByTienda({
      tiendaId: tienda,
      accessToken: getAccessToken(),
    });

    if (response.ok) {
      const json = await response.json();

      
      setVentasData(json.body.data);
    } else {
      setVentasData([]);
    }
  }

  useEffect(() => {
    getVentas();
  }, [tienda]);

  return (
    <div className="space-y-5">
      {ventasData &&
        ventasData.map(
          (venta, i) =>
            i < 5 && (
              <VentaCard
                fecha_venta={venta.fecha_venta}
                total={venta.total}
                key={"card-" + venta.folio}
                ventaId={venta.folio}
              />
            )
        )}
      {/* <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/avatars/02.png" alt="Avatar" />
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Jackson Lee</p>
          <p className="text-sm text-muted-foreground">jackson.lee@email.com</p>
        </div>
        <div className="ml-auto font-medium">+$39.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/03.png" alt="Avatar" />
          <AvatarFallback>IN</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
          <p className="text-sm text-muted-foreground">
            isabella.nguyen@email.com
          </p>
        </div>
        <div className="ml-auto font-medium">+$299.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/04.png" alt="Avatar" />
          <AvatarFallback>WK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">William Kim</p>
          <p className="text-sm text-muted-foreground">will@email.com</p>
        </div>
        <div className="ml-auto font-medium">+$99.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/05.png" alt="Avatar" />
          <AvatarFallback>SD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Sofia Davis</p>
          <p className="text-sm text-muted-foreground">sofia.davis@email.com</p>
        </div>
        <div className="ml-auto font-medium">+$39.00</div>
      </div> */}
    </div>
  );
}
