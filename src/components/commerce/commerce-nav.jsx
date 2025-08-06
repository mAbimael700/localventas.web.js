/* eslint-disable react/prop-types */
import { Link, useParams } from "react-router-dom";
import { ShoppingBagIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect, useState } from "react";
import { CategoriasDropdown } from "./main-navbar/categorias-dropdown";
import { MarcasDropdown } from "./main-navbar/marcas-dropdown";
import { getTiendaById } from "../../services/tiendas";

export function CommerceNav({ tiendaData, menuData, className }) {
  const { tienda } = useParams();
  const menuList = menuData.map((menu) => (
    <Link
      className="text-sm font-medium transition-colors hover:text-primary-foreground"
      to={menu.component}
      key={menu.key}
    >
      {menu.nombre}
    </Link>
  ));

  return (
    <nav
      className={cn(
        "flex items-center space-x-7 lg:space-x-6 md:space-x-4",
        className
      )}
    >
      <Link to={tiendaData && `/commerce/${tiendaData.id}/productos`} className="font-semibold flex gap-2 items-center">
        <ShoppingBagIcon className="h-5" />
        {tiendaData ? <span className="text-sm hidden md:block text-center">{tiendaData.nombre}</span> : <Skeleton />}
      </Link>

      <Separator orientation="vertical" className="h-6 hidden md:block" />

      {menuData ? (
        <div className="hidden  lg:flex gap-6 items-center">
          {menuList} <CategoriasDropdown tienda={tienda} />
          <MarcasDropdown tienda={tienda} />
        </div>
      ) : (
        <></>
      )}
    </nav>
  );
}
