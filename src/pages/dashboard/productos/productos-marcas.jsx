import { useEffect, useState } from "react";
import { marcasColumns } from "../../../components/dashboard/productos/marcas/marcas-columns";
import { DataTable } from "@/components/dashboard/data-table/data-table";
import { getMarcasByTienda } from "../../../services/marcas";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../auth/auth-provider";
import { ProductosMenubar } from "../../../components/dashboard/productos/productos-menubar";
import { LazyDataTableLoader } from "../../../components/loaders/lazy-datatable-loader";

export const ProductosMarcas = () => {
  const [marcaFormOpen, setMarcaFormOpen] = useState(false);

  const [marcaPosted, setMarcaPosted] = useState(false);

  const [marcas, setMarcas] = useState([]);
  const { tienda } = useParams();
  const { getAccessToken } = useAuth();
  const token = getAccessToken();

  const columns = marcasColumns({});

  function getMarcas() {
    const response = getMarcasByTienda({
      tiendaId: tienda,
      accessToken: token,
    });

    response.then(async (res) => {
      if (res.status === 200) {
        const data = await res.json();

        setMarcas(data.body);
      } else {
        setMarcas([]);
      }
    });
  }

  useEffect(() => getMarcas(), [tienda]);

  return (
    <div className="pb-4 space-y-3">
      <div className=" p-3 space-y-5">
        <section>
          <h1 className="text-lg font-semibold">Marcas de los productos</h1>
          <p className="text-sm text-muted-foreground">
            Maneja las marcas de los productos
          </p>
        </section>
        {marcas ? (
          <DataTable columns={columns} data={marcas} />
        ) : (
          <LazyDataTableLoader className="min-h-[82vh]" />
        )}
      </div>
    </div>
  );
};
