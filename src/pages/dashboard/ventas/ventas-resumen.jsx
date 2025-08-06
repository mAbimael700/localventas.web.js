import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { RecentSales } from "@/components/dashboard/recent-sales";
import { Overview } from "@/components/dashboard/sales-overview";
import { useEffect, useState } from "react";
import {
  getGananciasByTienda,
  getVentasCountByTienda,
} from "../../../services/ventas";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../auth/auth-provider";
import {
  formatNumberWithCommas,
  currencyFormat,
} from "../../../utils/numberFormatting";

export const VentasResumen = () => {
  const [ganancias, setGanancias] = useState(null);
  const [ventasCount, setVentasCount] = useState(null);
  const { tienda } = useParams();

  const { getAccessToken } = useAuth();

  async function getCountVentas() {
    const response = await getVentasCountByTienda({
      accessToken: getAccessToken(),
      tiendaId: tienda,
    });

    if (response.ok) {
      const json = await response.json();
      setVentasCount(json.body.data.cantidad);
    } else {
      setVentasCount(null);
    }
  }

  async function getGananciasTotales() {
    const response = await getGananciasByTienda({
      accessToken: getAccessToken(),
      tiendaId: tienda,
    });

    if (response.ok) {
      const json = await response.json();
      setGanancias(json.body.data.ganancia);
    } else {
      setGanancias({});
    }
  }

  useEffect(() => {
    getGananciasTotales();
    getCountVentas();
  }, [tienda]);

  return (
    <div className="pb-4 space-y-3">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ganancias totales
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currencyFormat(ganancias)}
            </div>
            <p className="text-xs text-muted-foreground">Desde el último mes</p>
          </CardContent>
        </Card>
        <Card className="shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nuevos clientes
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+0</div>
            <p className="text-xs text-muted-foreground">Desde el último mes</p>
          </CardContent>
        </Card>
        <Card className="shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ventasCount && formatNumberWithCommas(ventasCount)}
            </div>
            <p className="text-xs text-muted-foreground">Desde el último mes</p>
          </CardContent>
        </Card>
        <Card className="shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios activos
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Trabajando en ello...
            </p>
            {/* <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p> */}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 ">
        <Card className="col-span-4 shadow">
          <CardHeader>
            <CardTitle className="space-y-3">
              Visión general{" "}
              <div className="text-sm text-muted-foreground font-normal">
                (ganancias por mes)
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {ganancias && <Overview data={ganancias} />}
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3 shadow">
          <CardHeader>
            <CardTitle>Ventas recientes</CardTitle>
            <CardDescription>
              Se han realizado {ventasCount && ventasCount} ventas este mes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
