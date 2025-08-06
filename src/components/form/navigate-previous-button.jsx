import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { cn } from "../../lib/utils";

export const NavigatePreviousButton = ({ to, className }) => {
  const goTo = useNavigate();
  return (
    <Link
      onClick={() => goTo(to || -1)}
      className={cn("text-muted-foreground text-sm flex items-center gap-2 w-max", className)}
    >
      <ChevronLeftIcon /> Regresar
    </Link>
  );
};
