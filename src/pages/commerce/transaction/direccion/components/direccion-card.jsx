import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroupItem } from "@/components/ui/radio-group";

import { Circle } from "lucide-react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/multi-form";

export const DireccionCardTransaction = ({ direccion, ...props }) => {
  const { id, calle, numExt, numInt, ciudad, estado, pais, referencia } =
    direccion;

  return (
    <FormItem className="relative">
      <FormControl className="absolute top-5 left-5">
        <RadioGroupItem value={id} />
      </FormControl>

      <FormLabel className="">
        <Card className="rounded-md border-0 hover:shadow hover:cursor-pointer px-7">
          <CardHeader className="py-4">
            <CardTitle className="text-lg">
              Calle {calle} {numExt} {numInt && `- ${numInt}`}
            </CardTitle>
            <CardDescription className="font-normal">
              {ciudad}, {estado.nombre} - {pais.nombre}
            </CardDescription>
          </CardHeader>

          <CardFooter className="font-normal">
            <p className="text-xs text-muted-foreground">
              Referencia: {referencia}
            </p>
          </CardFooter>
        </Card>
      </FormLabel>
    </FormItem>
  );
};
