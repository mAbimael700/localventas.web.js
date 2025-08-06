import { Outlet } from "react-router-dom";
import { PagoMenubar } from "../../components/dashboard/pagos/pago-menubar";
export const PagosMenu = () => {
  return (
    <>
      {/* <h1 className="text-3xl font-bold">Pagos</h1>
 */}
      <PagoMenubar />

      <Outlet />
    </>
  );
};
