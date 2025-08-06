import React from "react";
import { Loader } from "../../loaders/loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export const ProductosUploadingAlert = ({className, ...props}) => {
  return (
    <Alert className={cn("space-x-3 flex flex-col z-10", className)} {...props}>
      <Loader/>
      <AlertTitle> Subiendo archivo... </AlertTitle>
      <AlertDescription className="text-sm">Espere un momento por favor.</AlertDescription>
    </Alert>
  );
};
