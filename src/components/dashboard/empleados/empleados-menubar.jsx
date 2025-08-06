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

export const EmpleadosMenubar = () => {
  const goTo = useNavigate();

  return (
    <Menubar className="w-full shadow-sm h-9">
      <MenubarMenu>
        <MenubarTrigger>Empleados</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onSelect={() => goTo(".")}>
            Ver empleados <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onSelect={() => goTo("./registrar-empleado")}>
            Registrar empleado
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onSelect={() => goTo("./resumen")}>Resumen</MenubarItem>
          <MenubarItem>Estadísticas</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
