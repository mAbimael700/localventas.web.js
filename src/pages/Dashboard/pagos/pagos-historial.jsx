import React, { useEffect, useState } from "react";

import { pagosColumns } from "../../../components/dashboard/pagos/pagos-columns";
import { DataTable } from "../../../components/dashboard/data-table/data-table";
import { useParams } from "react-router-dom";
import { getAbonosByTienda } from "../../../services/pagos";
import { useAuth } from "../../../auth/auth-provider";
import { LazyDataTableLoader } from "../../../components/loaders/lazy-datatable-loader";

export const PagosHistorial = () => {
  const [pagosData, setPagosData] = useState(null);
  const { tienda } = useParams();

  const auth = useAuth();
  const token = auth.getAccessToken();

  async function getAbonos() {
    const response = await getAbonosByTienda({
      tiendaId: tienda,
      accessToken: token,
    });

    if (response.ok) {
      const json = await response.json();
      console.log(json);
      setPagosData(json.body.data);
    } else {
      setPagosData([]);
    }
  }

  useEffect(() => {
    getAbonos();
  }, [tienda]);

  return (
    <div>
      {pagosData ? (
        <div className="p-5 shadow border rounded space-y-4">
          <div>
            <h1 className="font-semibold text-lg">Historial de pagos</h1>
            <p className="text-sm text-muted-foreground">
              Los pagos recibidos a partir de las mas recientes
            </p>
          </div>  

          <DataTable
            columns={pagosColumns({ isIndividual: false })}
            data={pagosData}
          />
        </div>
      ) : (
        <LazyDataTableLoader className="min-h-[68vh]" />
      )}
    </div>
  );
};
