import React from "react";
import { DataTableColumnHeader } from "../data-table-columns-header";
import { UserInfo } from "../../user/user-info";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { AlertDialogItem } from "../../dropdown-dialog-item";
import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from "../../../auth/auth-provider";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import {
  DotsHorizontalIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { activateMarca, deactivateMarca } from "../../../services/marcas";
import {
  activateEmpleado,
  deactivatedEmpleado,
} from "../../../services/empleados";

export const empleadosColumns = () => {
  let columns = [
    {
      accessorKey: "id",
      isNull: true,
    },
    {
      accessorKey: "nombre",
      cell: ({ row }) => {
        const nombre = row.getValue("nombre");
        const correoElectronico = row.getValue("correo_electronico");
        return (
          <UserInfo email={correoElectronico} username={nombre}></UserInfo>
        );
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Nombre" />;
      },
    },
    {
      accessorKey: "correo_electronico",
      label: "Correo electrónico",
      isNull: true,
    },
    {
      accessorKey: "rol",
      header: "Rol",
      cell: ({ row }) => {
        const rol = row.getValue("rol");
        return (
          <Badge variant="secondary" className="capitalize">
            {rol}
          </Badge>
        );
      },
    },
    {
      accessorKey: "fecha_contrato",
      label: "Fecha de contrato",
      header: "Fecha de contrato",
      cell: ({ row }) => {
        const fecha = row.getValue("fecha_contrato");
        return <span>{format(new Date(fecha), "PPPp", { locale: es })}</span>;
      },
    },
    {
      accessorKey: "activo",
      header: "Estado",
      cell: ({ row }) => {
        const estado = row.getValue("activo");

        return (
          <>
            {estado ? (
              <Badge>Activo</Badge>
            ) : (
              <Badge variant="destructive">Inactivo</Badge>
            )}
          </>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const [dropdownOpen, setDropdownOpen] = React.useState(false);
        const [hasOpenDialog, setHasOpenDialog] = React.useState(false);
        const activo = row.getValue("activo");
        const empleado = row.original;
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

        async function handleDeactivateEmpleado() {
          const response = await deactivatedEmpleado({
            accessToken: getAccessToken(),
            tiendaId: tienda,
            empleadoId: empleado.id,
          });

          if (response.ok) {
            goTo(0);
          }
        }

        async function handleActivateEmpleado() {
          const response = await activateEmpleado({
            accessToken: getAccessToken(),
            tiendaId: tienda,
            empleadoId: empleado.id,
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

              {activo ? (
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
                        desactivar al empleado?
                      </div>
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-background">
                      Esta acción desactivará el empleado y no podrá realizar
                      más acciones en la tienda
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
                      onClick={handleDeactivateEmpleado}
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
                        ¿Deseas reactivar el empleado?
                      </div>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción activará el empleado y podrá realizar acciones
                      en la tienda.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel variant="ghost">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="flex items-center gap-1"
                      onClick={handleActivateEmpleado}
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
  return columns;
};
