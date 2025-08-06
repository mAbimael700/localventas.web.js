import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog";
import React from "react";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTrigger,
    AlertDialogOverlay,
  } from "@/components/ui/alert-dialog"
  

export const DialogItem = React.forwardRef((props, forwardedRef) => {
  const { triggerChildren, children, onSelect, onOpenChange, ...itemProps } =
    props;
  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          {...itemProps}
          ref={forwardedRef}
          onSelect={(event) => {
            event.preventDefault();
            onSelect && onSelect();
          }}
        >
          {triggerChildren}
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogOverlay />
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
});

export const AlertDialogItem = React.forwardRef((props, forwardedRef) => {
    const { triggerChildren, children, onSelect, onOpenChange, contentClassName,...itemProps } =
      props;
    return (
      <AlertDialog onOpenChange={onOpenChange}>
        <AlertDialogTrigger asChild>
          <DropdownMenuItem
            {...itemProps}
            ref={forwardedRef}
            onSelect={(event) => {
              event.preventDefault();
              onSelect && onSelect();
            }}
          >
            {triggerChildren}
          </DropdownMenuItem>
        </AlertDialogTrigger>
  
        <AlertDialogOverlay />
        <AlertDialogContent className={contentClassName}>{children}</AlertDialogContent>
      </AlertDialog>
    );
  });
