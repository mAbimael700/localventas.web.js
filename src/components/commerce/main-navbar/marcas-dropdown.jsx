import React, { useEffect, useState } from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { getMarcasByTienda } from "../../../services/marcas";
import ScrollAreaDemo from "../../scroll-area-min-h";
import { useNavigate } from "react-router-dom";

export const MarcasDropdown = ({ tienda }) => {
  const [marcas, setMarcas] = useState(null);

  const goTo = useNavigate();
  async function getMarcas() {
    const response = await getMarcasByTienda({ tiendaId: tienda });

    if (response.ok) {
      const json = await response.json();
      setMarcas(json.body);
    } else {
      setMarcas([])
    }
  }

  useEffect(() => {
    getMarcas();
  }, [tienda]);


  return (
    <DropdownMenu >
      <DropdownMenuTrigger className="text-sm font-medium transition-colors hover:text-primary-foreground flex gap-1 items-center">
        Marcas
        <ChevronDownIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-sm">
        {marcas ? (
          
            <ScrollAreaDemo viewportClassName="max-h-[260px]">
              {marcas.map((e) => (
                <DropdownMenuItem onSelect={()=> goTo(`/commerce/${tienda}/marcas/${e.id}`)} key={e.id}>{e.marca}</DropdownMenuItem>
              ))}{" "}
            </ScrollAreaDemo>
          
        ) : (
          <div>
            <div className="space-y-2 ">
            {Array.from({ length: 5 }).map((c, i) => (
              <Skeleton key={`skeleton-${i}`} className="h-8" />
            ))}
          </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
