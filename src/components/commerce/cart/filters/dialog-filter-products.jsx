import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";

export const DialogFilterProducts = () => {
  return (
    <Dialog className=" ">
      <DialogTrigger asChild>
        <Button className="h-8 rounded-sm ">
          <MixerHorizontalIcon className="h-5 w-5 mr-2" /> Filtrar
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Filtrar y ordenar</DialogTitle>
          <DialogDescription>
            Selecciona los filtros para ver los productos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <section>
            <Label> Marcas</Label>
          </section>

          <Separator />
          <section>
            <Label>Categoría</Label>
          </section>

          <Separator />
          <section>
            <Label>Precio</Label>

            <div className="flex gap-4">
              <Input placeholder="Mínimo" className="h-8"/>
              <Input placeholder="Máximo" className="h-8" />
            </div>
          </section>
        </div>

        <DialogFooter className="sm:justify-start border-t pt-4">
          <Button type="button" className="h-8">
            Aplicar{" "}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="h-8">
              Limpiar filtros
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
