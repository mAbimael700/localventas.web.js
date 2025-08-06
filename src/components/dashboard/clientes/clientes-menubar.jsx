import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useNavigate, useParams } from "react-router-dom";

export const ClientesMenubar = () => {
  const { tienda } = useParams();
  const goTo = useNavigate();
  return (
    <Menubar className="h-9">
      <MenubarMenu>
        <MenubarTrigger>Clientes</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onSelect={() =>
              goTo(`/dashboard/${tienda}/clientes`)
            }>
            Ver listado de clientes <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem
            onSelect={() =>
              goTo(`/dashboard/${tienda}/clientes/registrar-cliente`)
            }
          >
            Registrar nuevo cliente
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
