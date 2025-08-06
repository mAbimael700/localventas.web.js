import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/auth-provider";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertDialogItem } from "@/components/dropdown-dialog-item";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { activateMarca, deactivateMarca } from "@/services/marcas";
import { useProductosMenu } from "@/hooks/dashboard/productos/useProductosMenu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

export const MarcaActions = ({ row }) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [hasOpenDialog, setHasOpenDialog] = React.useState(false);
  const { tienda } = useParams();
  const { openChangeMarcaForm, setMarcaSelected } = useProductosMenu();
  const { getAccessToken } = useAuth();
  const dropdownTriggerRef = React.useRef(null);
  const focusRef = React.useRef(null);
  const goTo = useNavigate();

  const estado = row.getValue("estado");
  const marca = row.original;

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
    const response = await deactivateMarca({
      accessToken: getAccessToken(),
      tiendaId: tienda,
      marcaId: marca.id,
    });

    if (response.ok) {
      goTo(0);
    }
  }

  async function handleActivateMarca() {
    const response = await activateMarca({
      accessToken: getAccessToken(),
      tiendaId: tienda,
      marcaId: marca.id,
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
            goTo(`/commerce/${tienda}/marcas/${marca.id}`);
          }}
        >
          Ver catálogo
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => {
            const marca = {
              ...row.original,
              nombre: row.original?.marca,
            };
            openChangeMarcaForm();
            setMarcaSelected(marca);
          }}
        >
          Editar marca
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
                Esta acción desactivará el producto. Al confirmar desactivarás
                el producto de la tienda y su toda su información pública.
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
                Esta acción reactivará el producto. Al confirmar el producto
                volverá a aparecer en tu tienda y toda su información pública.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="ghost">Cancelar</AlertDialogCancel>
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
};
