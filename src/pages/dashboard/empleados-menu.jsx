import { Outlet } from "react-router-dom";
import { EmpleadosMenubar } from "../../components/dashboard/empleados/empleados-menubar";
export const EmpleadosMenu = () => {
  return (
    <>
      <EmpleadosMenubar />

      <Outlet />
    </>
  );
};
