import React, { useEffect } from "react";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useNavigate, useParams } from "react-router-dom";
import { useProductosMenu } from "../../../hooks/dashboard/productos/useProductosMenu";

export const ProductosMenubar = () => {
  const { openChangeMarcaForm } = useProductosMenu();
  const goTo = useNavigate();
  const { tienda } = useParams();

  return (
    <Menubar className="w-full shadow-sm h-9">
      <MenubarMenu>
        <MenubarTrigger>Productos</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onSelect={() => goTo(`/dashboard/${tienda}/productos`)}>
            Ver productos <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem
            onSelect={() =>
              goTo(`/dashboard/${tienda}/productos/producto-nuevo`)
            }
          >
            Crear producto
          </MenubarItem>
          <MenubarSeparator />

          <MenubarItem>
            Imprimir... <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Marcas</MenubarTrigger>
        <MenubarContent>
          <MenubarItem
            onSelect={() => goTo(`/dashboard/${tienda}/productos/marcas`)}
          >
            Ver marcas
          </MenubarItem>
          <MenubarItem
            onSelect={() => {
              openChangeMarcaForm();
            }}
          >
            Crear marca
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Categorías</MenubarTrigger>
        <MenubarContent>
          <MenubarItem
            onSelect={() => goTo(`/dashboard/${tienda}/productos/categorias`)}
          >
            Ver categorías
          </MenubarItem>

          <MenubarItem
            onSelect={() => {
              setCategoriaFormOpen(true);
              setCategoriaIsUpdate(false);
            }}
          >
            Crear categoría <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
