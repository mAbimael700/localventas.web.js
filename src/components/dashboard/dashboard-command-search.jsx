import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const dashboardModules = [
  {
    group: "Ventas",
    modules: [{ label: "Ver ventas", path: "./ventas" },{ label: "Registrar venta", path: "./ventas/registrar-venta" }],
  },
  {
    group: "Productos",
    modules: [
      { label: "Productos", path: "./productos" },
      { label: "Registrar producto", path: "./productos/producto-nuevo" },
      { label: "Marcas", path: "./productos/marcas" },

      { label: "Categorias", path: "./productos/categorias" },
    ],
  },

  {
    group: "Pagos",
    modules: [{ label: "Ver pagos", path: "./pagos" }],
  },
];

export function CommandSearch() {
  const goTo = useNavigate();

  return (
    <Dialog>
      <DialogTrigger
        className={buttonVariants({
          variant: "outline",
          className: "text-muted-foreground shadow-sm font-normal h-9 md:w-[250px]",
        })}
      >
           <MagnifyingGlassIcon />
        <span className="hidden md:block w-full items-center gap-2">

          Buscar módulo...
        </span>
       
      </DialogTrigger>

      <DialogContent className="p-0">
        <Command>
          <CommandInput placeholder="Busca un módulo..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            {dashboardModules.map((group) => (
              <React.Fragment key={`${group.group}-module-group`}>
                <CommandGroup heading={group.group}>
                  {group.modules.map((mod) => (
                    <CommandItem
                      key={`item-${mod.label}`}
                      onSelect={() => {
                        goTo(mod.path);
                      }}
                    >
                      {mod.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </React.Fragment>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
