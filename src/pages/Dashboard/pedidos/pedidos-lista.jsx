import React, { useEffect, useState } from "react";
import { DataTable } from "../../../components/dashboard/data-table/data-table";
import { PedidosColumns } from "../../../components/dashboard/pedidos/pedidos-columns";
import { LazyDataTableLoader } from "../../../components/loaders/lazy-datatable-loader";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../auth/auth-provider";
import { getPedidosByTienda } from "../../../services/pedidos";
export const PedidosLista = () => {
  const [pedidos, setPedidos] = useState(null);
  const { tienda } = useParams();
  const { getAccessToken } = useAuth();

  async function getPedidos() {
    try {
      const pedidos = await getPedidosByTienda({
        tiendaId: tienda,
        accessToken: getAccessToken(),
      });

      if (pedidos) {

        
        return setPedidos(pedidos);
      }

      setPedidos([]);
    } catch (error) {
      setPedidos([]);

      throw error;
    }
  }

  useEffect(() => {
    getPedidos();
  }, [tienda]);

  return (
    <div>
      <section className="rounded shadow border p-5 space-y-3">
        <div>
          <h1 className="font-semibold text-lg">Pedidos</h1>
          <p className="text-muted-foreground text-sm">
            Los pedidos para entregar registrados en la tienda{" "}
          </p>
        </div>

        {pedidos ? (
          <DataTable columns={PedidosColumns} data={pedidos} />
        ) : (
          <LazyDataTableLoader
            className="h-[450px]"
            label="Cargando pedidos..."
          />
        )}
      </section>
    </div>
  );
};
