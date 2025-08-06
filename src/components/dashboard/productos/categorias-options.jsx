import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  DotsHorizontalIcon,
  ExclamationTriangleIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "@radix-ui/react-icons";
import { AlertDialogItem, DialogItem } from "../../dropdown-dialog-item";
import { generatePublicProductURL } from "../../../utils/generateProductPublicURL";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../auth/auth-provider";

export const CategoriasOptions = ({ row }) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [hasOpenDialog, setHasOpenDialog] = React.useState(false);
  const dropdownTriggerRef = React.useRef(null);
  const focusRef = React.useRef(null);

  const { tienda } = useParams();
  const { getAccessToken } = useAuth();

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

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="/*absolute*/ p-2  right-0top-0  focus:border-none active:border-none"
          ref={dropdownTriggerRef}
        >
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        sideOffset={5}
        hidden={hasOpenDialog}
        onCloseAutoFocus={(event) => {
          if (focusRef.current) {
            focusRef.current.focus();
            focusRef.current = null;
            event.preventDefault();
          }
        }}
        className="w-44 mr-2"
      >
        <DropdownMenuLabel>Opciones</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() =>
              window.open(
                `/commerce/${tienda}/categorias/${row.cve_categoria}`,
                "_blank",
                "rel=noopener noreferrer"
              )
            }
          >
            Ver productos
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => {
              setOpen(true);
              setIsUpdateForm(true);
              setMarcaId(marca.id);
            }}
          >
            Modificar
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem>Ayuda</DropdownMenuItem>
        <DropdownMenuSeparator />

        {row.estado === true ? (
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
                /* onClick={handleDeactivateProduct} */

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
                /* onClick={handleActivateProduct} */
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
