import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

import React from "react";
import { useNavigate } from "react-router-dom";

export const PagoMenubar = () => {
  const goTo = useNavigate();
  return (
    <Menubar className="w-full shadow-sm h-9">
      <MenubarMenu>
        <MenubarTrigger>Abonos</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={()=> goTo('.')}>
            Historial de pagos <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => goTo("./registrar-pago")}>
            Registrar abono
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Share</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
