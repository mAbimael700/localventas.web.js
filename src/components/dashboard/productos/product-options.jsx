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
import {
  activateProducto,
  deactivateProducto,
} from "../../../services/productos";

export const ProductOptions = ({ row }) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [hasOpenDialog, setHasOpenDialog] = React.useState(false);
  const dropdownTriggerRef = React.useRef(null);
  const focusRef = React.useRef(null);

  const { tienda } = useParams();
  const { getAccessToken } = useAuth();

  const goTo = useNavigate();

  async function handleDeactivateProduct() {
    const response = await deactivateProducto({
      accessToken: getAccessToken(),
      tiendaId: tienda,
      productoId: row.folio,
    });

    if (response.ok) {
      goTo(0);
    }
  }

  async function handleActivateProduct() {
    const response = await activateProducto({
      accessToken: getAccessToken(),
      tiendaId: tienda,
      productoId: row.folio,
    });

    if (response.ok) {
      goTo(0);
    }
  }

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
                generatePublicProductURL({ folio: row.folio, tienda }),
                "_blank",
                "rel=noopener noreferrer"
              )
            }
          >
            Ver publicación
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.folio)}
          >
            Copiar folio
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => goTo(`./actualizar-producto/${row.folio}`)}
          >
            Modificar
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DialogItem
          triggerChildren="Compartir"
          onSelect={handleDialogItemSelect}
          onOpenChange={handleDialogItemOpenChange}
        >
          <DialogHeader>
            <DialogTitle>Compartir producto</DialogTitle>
            <DialogDescription>
              Con este enlace puedes compartir a cualquiera el producto.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                defaultValue={generatePublicProductURL({
                  folio: row.folio,
                  tienda,
                })}
                readOnly
              />
            </div>
            <Button
              type="button"
              size="sm"
              className="px-3"
              onClick={() =>
                navigator.clipboard.writeText(
                  generatePublicProductURL({ folio: row.folio, tienda })
                )
              }
            >
              <span className="sr-only">Copy</span>
              <CopyIcon className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cerrar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogItem>

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
                onClick={handleDeactivateProduct}
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
                onClick={handleActivateProduct}
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
