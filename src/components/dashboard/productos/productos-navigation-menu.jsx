import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
export const ProductosNavigationMenu = () => {
    const goTo = useNavigate()

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className={buttonVariants({ variant: "ghost" })}>
          Productos
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={()=> goTo('.')}>Ver productos</DropdownMenuItem>
          <DropdownMenuItem onSelect={()=> goTo('./producto-nuevo')}>Crear producto</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className={buttonVariants({ variant: "ghost" })}>
          Marcas
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={()=> goTo('./marcas')}>Ver marcas</DropdownMenuItem>
          <DropdownMenuItem onSelect={()=> goTo('./producto-nuevo')}>Crear producto</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className={buttonVariants({ variant: "ghost" })}>
          Categorias
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={()=> goTo('./categorias')}>Ver productos</DropdownMenuItem>
          <DropdownMenuItem onSelect={()=> goTo('./producto-nuevo')}>Crear producto</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
