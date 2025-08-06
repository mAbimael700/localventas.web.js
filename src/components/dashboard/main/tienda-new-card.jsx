import React from "react";

import {
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../../lib/utils";
export const TiendaNewCard = ({className}) => {
  return (
    <Link className={cn("md:min-w-[250px] lg:min-w-[250px] lg:min-h-[180px]", className)} to={"/dashboard/crear-tienda"}>
      <Card className=" hover:bg-zinc-100 flex shadow-sm min-w-[250px] md:min-w-[250px]  lg:min-w-[250px] h-[60px] lg:min-h-[180px] md:min-h-[180px]">
        <div className=" flex w-full text-red-700 justify-center  md:flex-col lg:flex-col items-center gap-3">
          <PlusIcon/>
          <Label className="text-base">Agregar tienda</Label>
        </div>
      </Card>
    </Link>
  );
};
