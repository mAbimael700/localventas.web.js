import { Outlet, useLocation } from "react-router-dom";
import { ProductosMenubar } from "../../components/dashboard/productos/productos-menubar";
import { ProductosMenuProvider } from "@/contexts/dashboard/productos/productos-menu-context";
import { MarcasSheetForm } from "@/components/dashboard/productos/marcas/marcas-sheet-form";
export const ProductosMenu = () => {
  return (
    <>
      {/* <h1 className="text-3xl font-bold">Productos</h1> */}

      <ProductosMenuProvider>
        <ProductosMenubar />

        <MarcasSheetForm />
        <Outlet />
      </ProductosMenuProvider>
    </>
  );
};
