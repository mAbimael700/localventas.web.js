import React, { useEffect, useState } from "react";
import { DataTable } from "../../../components/dashboard/data-table/data-table";
import { empleadosColumns } from "../../../components/dashboard/empleados/empleados-columns";
import { Link, useParams } from "react-router-dom";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChartHorizontalBigIcon, UserPlusIcon } from "lucide-react";
import { LazyDataTableLoader } from "../../../components/loaders/lazy-datatable-loader";
import { getEmpleadosByTienda } from "../../../services/empleados";
import { useAuth } from "../../../auth/auth-provider";

export const EmpleadosMain = () => {
  const columns = empleadosColumns();
  const [empleados, setEmpleados] = useState(null);
  const { getAccessToken } = useAuth();
  const { tienda } = useParams();

  async function getEmpleados() {
    const response = await getEmpleadosByTienda({
      tiendaId: tienda,
      accessToken: getAccessToken(),
    });

    if (response.ok) {
      const json = await response.json();
      return setEmpleados(json.body.data);
    }

    setEmpleados([]);
  }
  useEffect(() => {
    getEmpleados();
  }, [tienda]);

  return (
    <main className="flex gap-6 w-full pb-4">
      <section className="rounded border shadow-sm p-6">
        <h1 className="font-semibold text-xl">Listado de empleados</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Administra los empleados de la tienda
        </p>

        {empleados ? (
          <DataTable columns={columns} data={empleados} className='min-h-[64vh]' />
        ) : (
          <LazyDataTableLoader className={"w-[700px] min-h-[64vh]"} />
        )}
      </section>

      <aside>
        <div className="grid grid-cols-2 gap-5">
          <Link to="./registrar-empleado">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserPlusIcon /> Registrar un empleado
                </CardTitle>
                <CardDescription>
                  Envía solicitud a un nuevo empleado.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="./registrar-empleado">
            <Card className="">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChartHorizontalBigIcon /> Ver movimientos
                </CardTitle>
                <CardDescription>
                  Maneja los movimientos de tus empleados (Trabajando en
                  ello...)
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <div></div>
      </aside>
    </main>
  );
};
