import React, { useEffect, useState } from "react";

import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { CaretSortIcon, PlusCircledIcon } from "@radix-ui/react-icons";

import { Link, useParams } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserNavName } from "../../utils/get-user-nav-name";
import { useAuth } from "../../auth/auth-provider";
import { getTiendasByUser } from "../../services/tiendas";

export function TiendaSwitcher({ className }) {
  const [open, setOpen] = useState(false);
  const [tiendas, setTiendas] = useState([{ nombre: "Loading...", id: 0 }]);
  const groups = [
    {
      label: "Tiendas",
      tiendas: tiendas,
    },
  ];
  const [selectedShop, setSelectedShop] = useState(groups[0].tiendas[0]);
  const location = useLocation();
  const auth = useAuth();
  const goTo = useNavigate();
  let { tienda } = useParams();

  const userid = auth.getUser()?.id;

  async function getTiendas() {
    try {
      const data = await getTiendasByUser({ userid });
      setTiendas(data.body);

      setSelectedShop(Array.from(data.body).find((e) => e.id === parseInt(tienda)));
    } catch (error) {
      console.error("Error al obtener las tiendas:", error);
      // Manejar el error de alguna manera, por ejemplo, mostrando un mensaje al usuario.
    }
  }
  useEffect(() => {
    if (userid) {
      getTiendas();
    }
  }, [userid]);

  const currentLocation = location.pathname;

  const relativeCurrentLocation = currentLocation.slice(
    12 + tienda.length,
    currentLocation.length
  );

  const currentTienda = getUserNavName(selectedShop.nombre) || "Loading...";
  return tiendas ? (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Seleciona una tienda"
            className={cn("md:w-[230px] h-9 justify-between shadow-sm", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/${selectedShop.id}.png`}
                alt={selectedShop.nombre}
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            {tiendas
              ? selectedShop.nombre.length > 21
                ? currentTienda
                : selectedShop.nombre
              : "Loading..."}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command >
            <CommandList className="max-h-[200px]">
              <CommandInput placeholder="Buscar tienda..." />
              <CommandEmpty>No se encontró la tienda...</CommandEmpty>
              {groups.map((group) => (
                <CommandGroup
                  key={`group-${group.label}`}
                  heading={group.label}
                >
                  {group.tiendas.map((tienda) => (
                    <CommandItem
                      key={`item-${tienda.id}`}
                      onSelect={() => {
                        goTo(
                          `/dashboard/${tienda.id}/${relativeCurrentLocation}`
                        );
                        setSelectedShop(tienda);
                        setOpen(false);
                      }}
                      className="text-sm w-full"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${tienda.fotografia}.png`}
                          alt={tienda.nombre}
                          className="grayscale"
                        />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      {tienda.nombre}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem onSelect={() => goTo("/dashboard/crear-tienda")}>
                  <PlusCircledIcon className="mr-2 h-5 w-5" />
                  Crea una tienda
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  ) : (
    <>Loading...</>
  );
}
