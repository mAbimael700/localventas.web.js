import { Dashboard } from "../components/dashboard/dashboard-layout.jsx";
import { PagosMenu } from "@/pages/dashboard/pagos-menu.jsx";
import { VentasMenu } from "@/pages/dashboard/ventas-menu.jsx";
import { VentasResumen } from "@/pages/dashboard/ventas/ventas-resumen.jsx";
import { VentasHistorial } from "@/pages/dashboard/ventas/ventas-historial.jsx";
import { ProductosMenu } from "@/pages/dashboard/productos-menu.jsx";
import { ProductosList } from "@/pages/dashboard/productos/productos-lista.jsx";
import { ProductosMarcas } from "@/pages/dashboard/productos/productos-marcas.jsx";
import { ProductosCategorias } from "@/pages/dashboard/productos/productos-categorias.jsx";
import ProtectedRoute from "../components/protected-route/protected-route.jsx";
import { MainDashboardMenu } from "@/pages/dashboard/main-dashboard-menu.jsx";
import { CrearTiendaForm } from "@/pages/dashboard/commerce/crear-tienda-form.jsx";
import { ProductoForm } from "@/pages/dashboard/productos/producto-form.jsx";
import { VentasForm } from "@/pages/dashboard/ventas/ventas-form.jsx";
import { VentasListadoDetalles } from "@/pages/dashboard/ventas/ventas-listado-detalles.jsx";
import { ProductoUpdateForm } from "@/pages/dashboard/productos/producto-update-form.jsx";
import { PagosHistorial } from "@/pages/dashboard/pagos/pagos-historial.jsx";
import { PagosForm } from "@/pages/dashboard/pagos/pagos-form.jsx";
import { ClientesLista } from "@/pages/dashboard/clientes/clientes-lista.jsx";
import { ClientesMenu } from "@/pages/dashboard/clientes-menu.jsx";
import { ClientesForm } from "@/pages/dashboard/clientes/clientes-form.jsx";
import { EmpleadosInviteForm } from "@/pages/dashboard/empleados/empleados-invite-form.jsx";
import { EmpleadosMenu } from "@/pages/dashboard/empleados-menu.jsx";
import { EmpleadosMain } from "@/pages/dashboard/empleados/empleados-main.jsx";
import { PedidosMenu } from "@/pages/dashboard/pedidos-menu.jsx";
import { DashboardConfiguracionMenu } from "@/pages/dashboard/configuracion/configuracion-menu.jsx";
import { DashboardConfiguracionTienda } from "@/pages/dashboard/configuracion/configuracion-tienda.jsx";
import { DashboardConfiguracionDirecciones } from "@/pages/dashboard/configuracion/configuracion-direcciones.jsx";
import { PedidosLista } from "@/pages/dashboard/pedidos/pedidos-lista.jsx";
import { PedidosRegistrar } from "@/pages/dashboard/pedidos/pedidos-registrar.jsx";
import { PedidosActualizar } from "@/pages/dashboard/pedidos/pedidos-actualizar.jsx";
import { ConfiguracionHorariosEntrega } from "@/pages/dashboard/configuracion/configuracion-horarios-entrega.jsx";

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
