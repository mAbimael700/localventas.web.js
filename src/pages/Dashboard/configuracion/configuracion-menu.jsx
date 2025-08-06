import React from "react";
import { Outlet, useParams } from "react-router-dom";
import { SidebarNav } from "@/components/form/form-sidebar";
import { Separator } from "@/components/ui/separator";

export const DashboardConfiguracionMenu = () => {
    const {tienda} = useParams()
  const sidebarNavItems = [
    {
      title: "Tienda",
      href: `/dashboard/${tienda}/configuracion`
    },
    {
      title: "Direcciones",
      href: `/dashboard/${tienda}/configuracion/direcciones`,
    },
    {
      title: "Horarios de entrega",
      href: `/dashboard/${tienda}/configuracion/horarios-entrega`,
    }
    
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h2 className="text-xl font-semibold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground text-sm">
          Maneja el menú de administración de la tienda.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col lg:flex-row lg:space-x-12 lg:space-y-0 gap-5 md:gap-0">
        <aside className="lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
