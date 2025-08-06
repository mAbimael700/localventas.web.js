import { PedidosMenubar } from "../../components/dashboard/pedidos/pedidos-menubar";
import { Outlet } from "react-router-dom";

export const PedidosMenu = () => {
  return (
    <div className="space-y-2">
      <PedidosMenubar />

      <div>
        <Outlet />
      </div>
    </div>
  );
};


