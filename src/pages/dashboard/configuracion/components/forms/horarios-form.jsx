import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { horarioSchema } from "@/schemas/dashboard/configuracion/horarios-schema";
import { Link, useParams } from "react-router-dom";
import { getDireccionesByTienda } from "../../../../../services/tiendas";
import { formatDireccion } from "../../../../../utils/direccionFormatter";
import { TimePicker } from "@/components/ui/time-picker";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "../../../../../lib/utils";
import { Check } from "lucide-react";
import { diasSemana } from "../../../../../constants/diasSemana";

export const HorariosForm = () => {
  const [direcciones, setDirecciones] = useState(null);
  const { tienda } = useParams();

  const form = useForm({
    resolver: zodResolver(horarioSchema),
    defaultValues: [
      {
        cve_direccion: null,
        hora: "",
        dia: "",
        email: "",
      },
    ],
  });

  // 2. Define a submit handler.
  function onSubmit(data) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(data);
    form.reset();
  }

  async function getDirecciones() {
    try {
      const direcciones = await getDireccionesByTienda({ tiendaId: tienda });

      if (direcciones) {
        setDirecciones(direcciones);
      }
    } catch (error) {
      toast({ description: error.message });
    }
  }
  useEffect(() => {
    form.reset();
    getDirecciones();
  }, [tienda]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="cve_direccion"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Dirección</FormLabel>

              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      type="button"
                      role="combobox"
                      variant="outline"
                      className={cn(
                        " p-5 h-16 text-left font-normal justify-start",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value && direcciones ? (
                        <p className="whitespace-pre-wrap ">
                          {formatDireccion(
                            direcciones.find((e) => e.id === field.value)
                          )}
                        </p>
                      ) : (
                        <span className="text-muted-foreground">
                          Selecciona una dirección de entrega
                        </span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                {direcciones ? (
                  <PopoverContent className="p-0 w-[500px] ">
                    <Command>
                      <CommandInput placeholder="Buscar dirección de entrega..." />
                      <CommandEmpty>
                        Dirección de entrega no encontrado
                      </CommandEmpty>

                      {direcciones && (
                        <CommandGroup>
                          {direcciones.map((e) => (
                            <CommandItem
                              value={e.id}
                              key={`item-${e.id}`}
                              onSelect={() => {
                                form.setValue("cve_direccion", e.id);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  e.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {formatDireccion(e)}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </Command>
                  </PopoverContent>
                ) : (
                  <></>
                )}
              </Popover>
              <FormDescription>
                Selecciona una de las direcciones de entrega configuradas en tu
                tienda.{" "}
                <Link to={`/dashboard/${tienda}/configuracion/direcciones`}>
                  Configuración de direcciones
                </Link>
                .
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <fieldset className="space-y-1">
          <FormLabel>Horario de entrega</FormLabel>
          <div className="flex gap-5">
            <FormField
              control={form.control}
              name="dia"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <span className="text-xs">Día de la semana</span>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="">
                        <SelectValue placeholder="Selecciona un día de la semana" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {diasSemana.map((dia) => (
                        <SelectItem
                          key={`day-${dia}`}
                          className="capitalize"
                          value={dia}
                        >
                          {dia}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Selecciona un día de la semana en la que puedas realizar
                    entregas en esa dirección
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hora"
              render={({ field }) => (
                <FormItem className="py-2">
                  <FormControl>
                    <TimePicker setDate={field.onChange} date={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </fieldset>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
