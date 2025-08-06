import { DataTable } from "../../../components/dashboard/data-table/data-table";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ventasDetallesColumns } from "../../../components/dashboard/ventas/ventas-detalles-columns";
import { useEffect, useState } from "react";
import { LazyDataTableLoader } from "../../../components/loaders/lazy-datatable-loader";
import { getVentaById } from "../../../services/ventas";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../auth/auth-provider";
import { NavigatePreviousButton } from "../../../components/form/navigate-previous-button";
import { LazyCargandoLoader } from "../../../components/loaders/lazy-text-loader";
import { UserInfo } from "../../../components/user/user-info";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { es } from "date-fns/locale";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  DotsHorizontalIcon,
  PlusCircledIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import { currencyFormat } from "../../../components/commerce/productos/producto-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pagosColumns } from "../../../components/dashboard/pagos/pagos-columns";
import { getAbonosByTienda, getAbonosByVenta } from "../../../services/pagos";
import { formatDireccion } from "../../../utils/direccionFormatter";

export const VentasListadoDetalles = () => {
  const [ventaData, setVentaData] = useState(null);
  const [pagosData, setPagosData] = useState(null);
  const [detalleVentaData, setDetalleVentaData] = useState(null);
  const [columns, setColumns] = useState([]);

  const { tienda, venta } = useParams();
  const { getAccessToken } = useAuth();
  const goTo = useNavigate();

  const token = getAccessToken();

  async function getVentaData() {
    const response = await getVentaById({
      accessToken: token,
      ventaId: venta,
      tiendaId: tienda,
    });

    try {
      if (response.ok) {
        const json = await response.json();
        const { venta, productos } = json.body.data;

        setDetalleVentaData(productos);
        setVentaData(venta);

        setColumns(ventasDetallesColumns(venta.subtotal));
      } else {
        setVentaData({});
        setDetalleVentaData([]);
      }
    } catch (error) {
      throw Error("Hubo un error al consultar el servidor.");
    }
  }

  async function getAbonosByVentaData() {
    const response = await getAbonosByVenta({
      tiendaId: tienda,
      ventaId: venta,
      accessToken: getAccessToken(),
    });

    if (response.ok) {
      const json = await response.json();

      setPagosData(json.body.data);
    } else {
      setPagosData([]);
    }
  }

  useEffect(() => {
    getVentaData();
    getAbonosByVentaData();
  }, [tienda, venta]);

  return (
    <div className="space-y-2 pb-4">
      <NavigatePreviousButton />
      <main className="grid grid-cols-6 gap-6 ">
        <section className="col-span-6 lg:col-span-2 space-y-4 border rounded-md p-7 h-full shadow-md">
          {ventaData && Object.keys(ventaData).length > 0 ? (
            <div className="flex flex-col justify-between h-full">
              <div className="space-y-4 pb-4">
                <div className=" pb-2">
                  <Label className="text-xl font-semibold">
                    Folio de venta: {ventaData.folio}
                  </Label>

                  <div className="text-sm">
                    {ventaData.fecha_venta
                      ? "Fecha " +
                        format(new Date(ventaData.fecha_venta), "PPPpp", {
                          locale: es,
                        })
                      : ""}
                  </div>
                </div>

                <Separator />
                <div className="space-y-2.5 ">
                  <h2 className="font-semibold text-sm">Realizado por:</h2>

                  <div className="relative">
                    <UserInfo
                      username={ventaData.vendedor?.nombre}
                      email={ventaData.vendedor?.correo_electronico}
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
                  <span className="font-semibold text-sm">
                    Información del cliente
                  </span>

                  {ventaData.cliente ? (
                    <UserInfo
                      username={ventaData.cliente?.nombre}
                      email={ventaData.cliente?.correo_electronico}
                    />
                  ) : (
                    <span className="text-muted-foreground flex items-center gap-2 text-sm">
                      <QuestionMarkCircledIcon /> No registrado
                    </span>
                  )}
                </div>

                {ventaData.descripcion && (
                  <div>
                    <h2 className="font-semibold text-sm">Concepto</h2>
                    <p className="text-sm">{ventaData.descripcion}</p>
                  </div>
                )}

                <div>
                  <span className="font-semibold text-sm">Estado de pago</span>
                  {ventaData.estado === false || !ventaData.estado ? (
                    <span className="text-md text-muted-foreground items-center text-sm gap-2 flex">
                      <CrossCircledIcon className="text-destructive" /> No
                      pagado
                    </span>
                  ) : (
                    <span className="text-md text-muted-foreground items-center text-sm gap-2 flex">
                      <CheckCircledIcon className="text-green-400" /> Pagado
                    </span>
                  )}
                </div>

                {ventaData.direccion && (
                  <div>
                    <h3 className="font-semibold text-sm">
                      Dirección de entrega
                    </h3>
                    <div className="whitespace-pre-wrap text-sm">
                      {formatDireccion(ventaData.direccion)}
                    </div>
                  </div>
                )}
                {ventaData.estado === false && (
                  <Button
                    onClick={() =>
                      goTo(`../../pagos/registrar-pago/${ventaData.folio}`)
                    }
                  >
                    <PlusCircledIcon className="mr-2" /> Agregar abono
                  </Button>
                )}
              </div>

              <div>
                <Separator /> <br />
                <div className="flex gap-2 justify-between font-semibold">
                  <span>Subtotal: </span>
                  {currencyFormat(ventaData.subtotal)}
                </div>
                <div className="flex gap-2 justify-between font-semibold">
                  <span>Total: </span>
                  {currencyFormat(ventaData.total)}
                </div>
              </div>
            </div>
          ) : (
            <LazyCargandoLoader />
          )}
        </section>

        <Tabs defaultValue="detalles" className=" lg:col-span-4 col-span-6">
          <TabsList className="">
            <TabsTrigger value="detalles">Detalles</TabsTrigger>
            <TabsTrigger value="pagos">Pagos</TabsTrigger>
          </TabsList>
          <TabsContent
            value="detalles"
            className="rounded border shadow p-5 space-y-3"
          >
            <p className="font-semibold">Detalles de la venta</p>
            {detalleVentaData && ventaData ? (
              <DataTable
                columns={columns}
                data={detalleVentaData}
                hasFooter={true}
              ></DataTable>
            ) : (
              <LazyDataTableLoader
                className="min-h-[65vh]"
                label="Cargando detalles..."
              />
            )}
          </TabsContent>
          <TabsContent
            value="pagos"
            className="rounded border shadow p-5 space-y-3"
          >
            <p className="font-semibold">Pagos realizados</p>
            {pagosData ? (
              <DataTable
                columns={pagosColumns({ isIndividual: true })}
                data={pagosData}
              />
            ) : (
              <LazyDataTableLoader className="h-[400px]" />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
