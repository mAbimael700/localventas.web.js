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

export const PedidosMenubar = () => {
  const goTo = useNavigate();

  return (
    <Menubar className="w-full shadow-sm h-9">
      <MenubarMenu>
        <MenubarTrigger>Pedidos</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onSelect={() => goTo(".")}>
            Pedidos <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onSelect={() => goTo("./registrar-pedido")}>
            Registrar pedido
          </MenubarItem>
          {/* <MenubarSeparator />
           <MenubarItem onSelect={() => goTo("./resumen")}>Resumen</MenubarItem>
          <MenubarItem>Estadísticas</MenubarItem> */}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
