import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useNavigate } from "react-router-dom";

export const VentasMenubar = () => {
  const goTo = useNavigate();

  return (
    <Menubar className="w-full shadow-sm h-9">
      <MenubarMenu>
        <MenubarTrigger>Ventas</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onSelect={() => goTo(".")}>
            Ver ventas <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onSelect={() => goTo("./registrar-venta")}>
            Registrar venta
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onSelect={() => goTo("./resumen")}>Resumen</MenubarItem>
          <MenubarItem>Estadísticas</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
