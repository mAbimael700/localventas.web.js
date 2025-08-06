import { useEffect, useState } from "react";
import { DataTable } from "../../../components/dashboard/data-table/data-table";
import { ventasColumns } from "../../../components/dashboard/ventas/ventas-columns";
import { useNavigate, useParams } from "react-router-dom";
import { getVentasByTienda } from "../../../services/ventas";
import { useAuth } from "../../../auth/auth-provider";
import { Separator } from "@/components/ui/separator";
import { PlusCircledIcon } from "@radix-ui/react-icons";

export const VentasHistorial = () => {
  const [ventaData, setVentaData] = useState(null);
  const { tienda } = useParams();
  const auth = useAuth();
  const goTo = useNavigate();

  const facetedOptions = {
    estado: [
      { label: "Pagado", value: true },
      { label: "No pagado", value: false },
    ],
  };

  async function getVentas() {
    const response = await getVentasByTienda({
      tiendaId: tienda,
      accessToken: auth.getAccessToken(),
    });

    if (response.ok) {
      const json = await response.json();

      setVentaData(json.body.data);
    }
  }

  useEffect(() => {
    getVentas();
  }, [tienda]);
  return (
    <div className="rounded shadow p-5 border space-y-4 min-h-full">
      <div>
        <h1 className="font-semibold text-lg">Historial de ventas</h1>
        <p className="text-sm text-muted-foreground">
          Tus ventas a partir de las mas recientes
        </p>
      </div>

      <DataTable
        columns={ventasColumns}
        data={ventaData}
        columnsOptions={facetedOptions}
        className="min-h-[65vh]"
      >
        <DataTable.Navigation>
          <DataTable.NavigationItem
            variant="outline"
            onClick={() => goTo("./registrar-venta")}
          >
            <PlusCircledIcon className="mr-2" /> Registrar venta
          </DataTable.NavigationItem>
        </DataTable.Navigation>
      </DataTable>
    </div>
  );
};
