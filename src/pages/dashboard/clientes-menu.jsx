import React from "react";
import { ClientesMenubar } from "../../components/dashboard/clientes/clientes-menubar";
import { Outlet } from "react-router-dom";

export const ClientesMenu = () => {
  return (
    <div className="space-y-3 pb-2">
      

      <ClientesMenubar />

      <main>
        <Outlet />
      </main>
    </div>
  );
};
