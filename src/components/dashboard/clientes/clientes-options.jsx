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
  import { DotsHorizontalIcon } from "@radix-ui/react-icons";

  import React from "react";
  
  export const ClientesOptions = () => {
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const [hasOpenDialog, setHasOpenDialog] = React.useState(false);
    const dropdownTriggerRef = React.useRef(null);
    const focusRef = React.useRef(null);
  
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
      <>
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
            className="w-54 mr-2"
          >
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
  
            <DropdownMenuGroup>
              <DropdownMenuItem>Ver compras</DropdownMenuItem>
              <DropdownMenuItem>Ver pagos</DropdownMenuItem>
              <DropdownMenuItem>Pausar</DropdownMenuItem>
            </DropdownMenuGroup>
  
            <DropdownMenuSeparator />
  
  
            
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  };
  