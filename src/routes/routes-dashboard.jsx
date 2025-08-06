import { Dashboard } from "../components/dashboard/dashboard-layout";
import { PagosMenu } from "../pages/Dashboard/pagos-menu";
import { VentasMenu } from "../pages/Dashboard/ventas-menu";
import { VentasResumen } from "../pages/Dashboard/ventas/ventas-resumen";
import { VentasHistorial } from "../pages/Dashboard/ventas/ventas-historial";
import { ProductosMenu } from "../pages/Dashboard/productos-menu";
import { ProductosList } from "../pages/dashboard/productos/productos-lista";
import { ProductosMarcas } from "../pages/dashboard/productos/productos-marcas";
import { ProductosNuevoForm } from "../pages/dashboard/productos/productos-nuevo-form";
import { ProductosCategorias } from "../pages/dashboard/productos/productos-categorias";
import ProtectedRoute from "../components/protected-route/protected-route";
import { MainDashboardMenu } from "../pages/dashboard/main-dashboard-menu";
import { CrearTiendaForm } from "../pages/dashboard/commerce/crear-tienda-form";
import { ProductoForm } from "../pages/dashboard/productos/producto-form";
import { VentasForm } from "@/pages/dashboard/ventas/ventas-form";
import { VentasListadoDetalles } from "../pages/dashboard/ventas/ventas-listado-detalles";
import { ProductoUpdateForm } from "../pages/dashboard/productos/producto-update-form";
import { PagosHistorial } from "../pages/dashboard/pagos/pagos-historial";
import { PagosForm } from "../pages/dashboard/pagos/pagos-form";
import { ClientesLista } from "../pages/dashboard/clientes/clientes-lista";
import { ClientesMenu } from "../pages/dashboard/clientes-menu";
import { ClientesForm } from "../pages/dashboard/clientes/clientes-form";
import { EmpleadosInviteForm } from "../pages/dashboard/empleados/empleados-invite-form";
import { EmpleadosMenu } from "../pages/dashboard/empleados-menu";
import { EmpleadosMain } from "../pages/dashboard/empleados/empleados-main";
import { PedidosMenu } from "../pages/dashboard/pedidos-menu";
import { DashboardConfiguracionMenu } from "../pages/dashboard/configuracion/configuracion-menu";
import { DashboardConfiguracionTienda } from "../pages/dashboard/configuracion/configuracion-tienda";
import { DashboardConfiguracionDirecciones } from "../pages/dashboard/configuracion/configuracion-direcciones";
import { PedidosLista } from "../pages/dashboard/pedidos/pedidos-lista";
import { PedidosForm } from "../pages/dashboard/pedidos/pedidos-form";
import { PedidosRegistrar } from "../pages/dashboard/pedidos/pedidos-registrar";
import { PedidosActualizar } from "../pages/dashboard/pedidos/pedidos-actualizar";
import { ConfiguracionHorariosEntrega } from "../pages/dashboard/configuracion/configuracion-horarios-entrega";
export const routesDashboard = {
  path: "/",
  element: <ProtectedRoute />,
  children: [
    {
      path: "dashboard",

      children: [
        {
          index: true,
          element: (
            <>
              <MainDashboardMenu />
            </>
          ),
        },
        {
          path: "crear-tienda",
          element: <CrearTiendaForm />,
        },
        {
          path: ":tienda",
          element: <Dashboard />,
          children: [
            {
              path: "empleados",
              element: <EmpleadosMenu />,
              children: [
                {
                  index: true,
                  element: <EmpleadosMain />,
                },
                {
                  path: "registrar-empleado",
                  element: <EmpleadosInviteForm />,
                },
                { path: "actualizar/:pedido", element: <PedidosActualizar /> },
              ],
            },
            {
              path: "pedidos",
              element: <PedidosMenu />,
              children: [
                { index: true, element: <PedidosLista /> },
                {
                  path: "registrar-pedido",
                  element: <PedidosRegistrar />,
                },
              ],
            },
            {
              path: "clientes",
              element: <ClientesMenu />,
              children: [
                { index: true, element: <ClientesLista /> },
                { path: "registrar-cliente", element: <ClientesForm /> },
              ],
            },
            {
              path: "ventas",
              element: (
                <>
                  <VentasMenu />
                </>
              ),
              children: [
                {
                  index: true,
                  element: <VentasHistorial />,
                },
                {
                  path: ":venta",
                  element: <VentasListadoDetalles />,
                },
                {
                  path: "resumen",
                  element: <VentasResumen />,
                },

                {
                  path: "registrar-venta",
                  element: <VentasForm />,
                },
                {
                  path: "historial",
                  element: <VentasHistorial />,
                },
              ],
            },
            {
              path: "productos",
              element: <ProductosMenu />,
              children: [
                { index: true, element: <ProductosList /> },
                { path: "marcas", element: <ProductosMarcas /> },
                { path: "categorias", element: <ProductosCategorias /> },
                { path: "producto-nuevo", element: <ProductoForm /> },
                {
                  path: "actualizar-producto/:producto",
                  element: <ProductoUpdateForm />,
                },
              ],
            },
            {
              path: "pagos",
              element: <PagosMenu />,
              children: [
                { index: true, element: <PagosHistorial /> },
                {
                  path: "registrar-pago",
                  element: <PagosForm />,
                  children: [{ path: ":venta", element: <PagosForm /> }],
                },
              ],
            },
            {
              path: "configuracion",
              element: <DashboardConfiguracionMenu />,
              children: [
                { index: true, element: <DashboardConfiguracionTienda /> },
                {
                  path: "direcciones",
                  element: <DashboardConfiguracionDirecciones />,
                },
                {
                  path: "horarios-entrega",
                  element: <ConfiguracionHorariosEntrega />,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
