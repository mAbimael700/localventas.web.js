import {
  ChevronDownIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuSub,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import ScrollAreaDemo from "../../scroll-area-min-h";
import React, { useEffect, useState } from "react";
import { getCategoriasByTienda } from "../../../services/categorias";
import { useNavigate } from "react-router-dom";

export const CategoriasDropdown = ({ tienda }) => {
  const [categorias, setCategorias] = useState(null);
  const goTo = useNavigate();
  async function getCategorias() {
    const response = await getCategoriasByTienda({ tiendaId: tienda });

    if (response.ok) {
      const json = await response.json();
      setCategorias(json.body);
    } else {
      setCategorias([]);
    }
  }

  useEffect(() => {
    getCategorias();
  }, [tienda]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-sm font-medium transition-colors hover:text-primary-foreground flex gap-1 items-center">
        Categorías
        <ChevronDownIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {categorias ? (
          <ScrollAreaDemo viewportClassName="max-h-[260px]">
            {categorias.map((e) => {

              
              if (e.children) {

                
                return (
                  <DropdownMenuSub key={`category-${e.cve_categoria}`}>
                    <DropdownMenuSubTrigger
                      onClick={() => goTo(`./categorias/${e.cve_categoria}`)}
                    >
                      <span>{e.nombre}</span>
                    </DropdownMenuSubTrigger>

                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {e.children.map((child) => {
                          if (child.children) {
                            return (
                              <DropdownMenuSub
                                key={`child-${child.cve_categoria}`}
                              >
                                <DropdownMenuSubTrigger
                                  onClick={() =>
                                    goTo(`./categorias/${child.cve_categoria}`)
                                  }
                                >
                                  <span>{child.nombre}</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                  <DropdownMenuSubContent>
                                    {child.children.map((e) => (
                                      <DropdownMenuItem
                                        key={e.cve_categoria}
                                        onClick={() =>
                                          goTo(
                                            `./categorias/${e.cve_categoria}`
                                          )
                                        }
                                      >
                                        <span>{e.nombre}</span>
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                              </DropdownMenuSub>
                            );
                          } else {
                            return (
                              <DropdownMenuItem
                                onClick={() =>
                                  goTo(`./categorias/${child.cve_categoria}`)
                                }
                              >
                                <span>{child.nombre}</span>
                              </DropdownMenuItem>
                            );
                          }
                        })}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                );
              } else {
                return (
                  <DropdownMenuItem
                    key={e.cve_categoria}
                    onClick={() => goTo(`./categorias/${e.cve_categoria}`)}
                  >
                    {e.nombre}
                  </DropdownMenuItem>
                );
              }
            })}
          </ScrollAreaDemo>
        ) : (
          <div className="space-y-2 ">
            {Array.from({ length: 5 }).map((c, i) => (
              <Skeleton key={`skeleton-${i}`} className="h-8" />
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
