import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CameraIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
export const PhotoFileInput = ({ className, ...props }) => {
  return (
    <>
      <Button
        variant="outline"
        className={cn("border-dashed border-gray-300 flex-col h-20", className)}
        asChild
      >
        <Label>
          <CameraIcon className="w-8" />
          <span className="text-sm">Agregar</span>
        </Label>
      </Button>

      <Input
        type="file"
        className="hidden"
        {...props}
        accept="image/png, image/gif, image/jpeg"
      />
    </>
  );
};

export const ProductPhotoPreview = () => {
  return (
    <picture className=" lg:w-20 md:w-20 flex items-center  aspect-square  rounded-sm border bg-gray-100">
      <img className="" src="" alt="" />
    </picture>
  );
};
