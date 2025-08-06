import { DataTableColumnHeader } from "../data-table-columns-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  DotsHorizontalIcon,
  ExclamationTriangleIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import React from "react";
import {
  activateCategoria,
  deactivateCategoria,
} from "../../../services/categorias";

import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/auth-provider";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertDialogItem } from "../../dropdown-dialog-item";

export const CategoriasColumns = ({
  open,
  setOpen,
  isUpdateForm,
  setIsUpdateForm,
  categoriaId,
  setCategoriaId,
}) => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    { accessorKey: "cve_categoria", isNull: true },
    {
      accessorKey: "nombre",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title="Categoría"
          ></DataTableColumnHeader>
        );
      },
    },

    {
      accessorKey: "categoria_padre",
      label: "Categoría padre",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader column={column} title="Categoría padre" />
        );
      },
      cell: ({ row }) => {
        const padre = row.getValue("categoria_padre");

        return padre.nombre ? (
          <span>{padre.nombre}</span>
        ) : (
          <Badge className="text-xs">Es categoría raíz</Badge>
        );
      },
    },
    {
      accessorKey: "activo",
      header: "Estado",
      cell: ({ row }) => {
        const estado = row.getValue("activo");

        if (estado) {
          return <Badge variant="secondary">Activo</Badge>;
        }

        return <Badge variant="destructive">No activo</Badge>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const categoria = row.original;

        const [dropdownOpen, setDropdownOpen] = React.useState(false);
        const [hasOpenDialog, setHasOpenDialog] = React.useState(false);
        const estado = row.getValue("activo");
        const { tienda } = useParams();
        const { getAccessToken } = useAuth();
        const dropdownTriggerRef = React.useRef(null);
        const focusRef = React.useRef(null);

        const goTo = useNavigate();
        function handleDialogItemSelect() {
          focusRef.current = dropdownTriggerRef.current;
        }

        function handleDialogItemOpenChange(open) {
          if (open === false) {
            setDropdownOpen(false);
          }
          setHasOpenDialog(open);
        }
        
        async function handleDeactivateMarca() {
        const response = await deactivateCategoria({
            accessToken: getAccessToken(),
            tiendaId: tienda,
            categoriaId: categoria.cve_categoria,
          });

          if (response.ok) {
            goTo(0);
          }
        }

        async function handleActivateMarca() {
          const response = await activateCategoria({
            accessToken: getAccessToken(),
            tiendaId: tienda,
            categoriaId: categoria.cve_categoria,
          });

          if (response.ok) {
            goTo(0);
          }
        }
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Opciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  goTo(`/commerce/${tienda}/categorias/${categoria.cve_categoria}`);
                }}
              >
                Ver catálogo
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setOpen(true);
                  setIsUpdateForm(true);
                  setCategoriaId(categoria.cve_categoria);
                }}
              >
                Editar
              </DropdownMenuItem>
              {estado ? (
                <AlertDialogItem
                  triggerChildren="Desactivar"
                  onSelect={handleDialogItemSelect}
                  onOpenChange={handleDialogItemOpenChange}
                  className="active:text-destructive  focus:text-destructive "
                  contentClassName="bg-destructive  border-none"
                >
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-background">
                      <div className="flex items-center gap-3">
                        <ExclamationTriangleIcon className="h-5 w-5" /> ¿Deseas
                        desactivar el producto?
                      </div>
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-background">
                      Esta acción desactivará el producto. Al confirmar
                      desactivarás el producto de la tienda y su toda su
                      información pública.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      variant="ghost"
                      className="text-background hover:bg-transparent hover:text-background"
                    >
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeactivateMarca}
                      className="flex items-center gap-1"
                    >
                      Desactivar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogItem>
              ) : (
                <AlertDialogItem
                  triggerChildren="Activar"
                  onSelect={handleDialogItemSelect}
                  onOpenChange={handleDialogItemOpenChange}
                >
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      <div className="flex items-center gap-3">
                        ¿Deseas reactivar el producto?
                      </div>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción reactivará el producto. Al confirmar el
                      producto volverá a aparecer en tu tienda y toda su
                      información pública.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel variant="ghost">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="flex items-center gap-1"
                      onClick={handleActivateMarca}
                    >
                      Activar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
