import { Outlet } from "react-router-dom";
import { TabsMenu } from "./tabs-menu";
import { VentasMenubar } from "../../components/dashboard/ventas/ventas-menubar";

export const VentasMenu = () => {
  const ventasTabsContent = [
    { path: ".", value: "ventas", label: "Ventas" },
    { path: "./resumen", value: "resumen", label: "Resumen" },
  ];

  return (
    <div className="h-[80vh] space-y-3">
    

      <VentasMenubar />

      <div className="pb-5"><Outlet /></div>
      
    </div>
  );
};
