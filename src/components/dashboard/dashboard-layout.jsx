import { Link, Outlet, useNavigate } from "react-router-dom";

const menuBar = [
  { nombre: "Ventas", key: "ventas", component: "./ventas" },
  { nombre: "Productos", key: "productos", component: "./productos" },
  { nombre: "Pagos", key: "pagos", component: "./pagos" },
  { nombre: "Empleados", key: "empleados", component: "./empleados" },
  { nombre: "Clientes", key: "clientes", component: "./clientes" },
  { nombre: "Pedidos", key: "pedidos", component: "./pedidos" },
  {
    nombre: "Configuración",
    key: "configuracion",
    component: "./configuracion",
  },
];
import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import {buttonVariants} from "@/components/ui/button"
import { MainNav } from "./main-nav";
import { UserNav } from "./user-nav";
import { TiendaSwitcher } from "./commerce-switch";
import { CommandSearch } from "./dashboard-command-search";
import { useAuth } from "../../auth/auth-provider";
import {
  getUserNavFallback,
  getUserNavName,
} from "../../utils/get-user-nav-name";
import { SidebarSheet } from "./dashboard-sidebar-sheet";
import { useEffect } from "react";
import { API_URL } from "../../auth/constants";
import { getTiendasByUser } from "../../services/tiendas";

export const Dashboard = () => {
  const auth = useAuth();

  const goTo = useNavigate();
  const { tienda } = useParams();
  const navName = getUserNavName(auth.getUser()?.nombre);
  const navFallBack = getUserNavFallback(auth.getUser()?.nombre);
  const userid = auth.getUser()?.id;

  async function validateTienda() {
    try {
      const tiendas = await getTiendasByUser({ userid });

      if (tiendas) {
        const currentTienda = Object(tiendas).body.filter(
          (t) => t.id === parseInt(tienda)
        );

        if (currentTienda.length === 0) {
          goTo("/dashboard");
        }
      }
    } catch (error) {
      console.error("Error al obtener las tiendas:", error);
      return <Navigate to={"/dashboard"} />;

      // Manejar el error de alguna manera, por ejemplo, mostrando un mensaje al usuario.
    }
  }

  useEffect(() => {
    if (userid) {
      validateTienda();
    }
  }, [userid]);
  return (
    <>
      <div className="flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <div className=" flex items-center gap-5">
                <SidebarSheet menuData={menuBar} />
                <div className="hidden md:block">
                  <TiendaSwitcher />
                </div>
                <MainNav menuData={menuBar} />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Link to={`/commerce/${tienda}/productos`} className={buttonVariants({variant:"ghost"})}>Visitar tienda</Link>

              <CommandSearch />
              <UserNav
                userPic={auth.getUser()?.fotografia || ""}
                user={navName || "Not found"}
                userId={auth.getUser()?.id}
                userEmail={auth.getUser()?.correo_electronico || "Not found"}
                userFallback={navFallBack}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-screen px-6 space-y-3 pt-4 ">
        <Outlet />
      </div>
    </>
  );
};
