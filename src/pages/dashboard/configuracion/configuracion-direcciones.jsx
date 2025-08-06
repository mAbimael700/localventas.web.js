import React, { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

import { Check, ChevronsUpDown, MapPinIcon } from "lucide-react";
import { PlusCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import { getEstadosByPais, getPaises } from "../../../services/direcciones";
import { direccionSchema } from "../../../schemas/direcciones-schema";
import {
  createDireccionTienda,
  deleteDireccionTienda,
  getDireccionesByTienda,
  updateDireccionTienda,
} from "../../../services/tiendas";
import { useAuth } from "../../../auth/auth-provider";
import { formatDireccion } from "../../../utils/direccionFormatter";

function ErrorMessage({ form, fieldPath, index, property }) {
  const fieldsError = form.formState?.errors[fieldPath];
  const fieldErrorValue = fieldsError && fieldsError[index];
  const error = fieldErrorValue && fieldErrorValue[property];

  return (
    error && (
      <div>
        <span className="font-medium text-destructive text-sm">
          {error.message}
        </span>
      </div>
    )
  );
}

const Field = ({ form, index }) => {
  const [paises, setPaises] = useState(null);
  const [estados, setEstados] = useState(null);
  async function getPaisesData() {
    try {
      const response = await getPaises();

      if (response) {
        setPaises(response);
      }
    } catch (error) {
      throw error;
    }
  }

  async function getEstadosData(id) {
    try {
      const response = await getEstadosByPais({ paisId: id });

      if (response) {
        setEstados(response);
      }
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    getPaisesData();
  }, []);

  async function handleSelectPais(id) {
    form.setValue(`direcciones.${index}.cve_pais`, id);
    return await getEstadosData(id);
  }
  return (
    <FormField
      control={form.control}
      name={`direcciones.${index}.value`}
      render={({ f }) => (
        <FormItem>
          <h2 className="font-medium text-sm">Calle</h2>
          <FormControl>
            <Input
              value={form.watch(`direcciones.${index}.calle`)}
              onChange={(e) => {
                form.setValue(`direcciones.${index}.calle`, e.target.value);
              }}
            />
          </FormControl>
          <ErrorMessage
            form={form}
            fieldPath={`direcciones`}
            index={index}
            property={"calle"}
          />

          <section className="grid grid-cols-2  gap-4 w-full">
            <div>
              <h2 className="font-medium text-sm">País</h2>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !form.watch(`direcciones.${index}.cve_pais`) &&
                          "text-muted-foreground"
                      )}
                    >
                      {form.watch(`direcciones.${index}.cve_pais`) && paises
                        ? paises.find(
                            (pais) =>
                              pais.id ===
                              form.watch(`direcciones.${index}.cve_pais`)
                          )?.nombre
                        : "Selecciona un pais"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className=" p-0">
                  <Command>
                    <CommandInput placeholder="Buscar país..." />
                    <CommandEmpty>País no encontrado.</CommandEmpty>
                    <CommandGroup>
                      {paises &&
                        paises.map((pais) => (
                          <CommandItem
                            value={pais.nombre}
                            key={pais.id}
                            onSelect={() => {
                              handleSelectPais(pais.id);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                pais.id ===
                                  form.watch(`direcciones.${index}.cve_pais`)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {pais.nombre}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <ErrorMessage
                form={form}
                fieldPath={`direcciones`}
                index={index}
                property={"cve_pais"}
              />
            </div>

            <div>
              <h2 className="font-medium text-sm">Estado</h2>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      disabled={!form.watch(`direcciones.${index}.cve_pais`)}
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !form.watch(`direcciones.${index}.cve_estado`) &&
                          "text-muted-foreground"
                      )}
                    >
                      {form.watch(`direcciones.${index}.cve_estado`) && estados
                        ? estados.find(
                            (pais) =>
                              pais.id ===
                              form.watch(`direcciones.${index}.cve_estado`)
                          )?.nombre
                        : "Selecciona el estado"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] shadow-none p-0">
                  <ScrollArea className="h-[200px] rounded-md border">
                    <Command>
                      <CommandInput placeholder="Buscar estado..." />
                      <CommandEmpty>Estado no encontrado.</CommandEmpty>
                      <CommandGroup>
                        {estados &&
                          estados.map((estado) => (
                            <CommandItem
                              value={estado.nombre}
                              key={estado.id}
                              onSelect={() => {
                                form.setValue(
                                  `direcciones.${index}.cve_estado`,
                                  estado.id
                                );
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  estado.id ===
                                    form.watch(
                                      `direcciones.${index}.cve_estado`
                                    )
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {estado.nombre}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </Command>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
              <ErrorMessage
                form={form}
                fieldPath={`direcciones`}
                index={index}
                property={"cve_estado"}
              />
            </div>
          </section>

          <h2 className="font-medium text-sm">Código postal</h2>
          <FormControl>
            <Input
              value={form.watch(`direcciones.${index}.codigo_postal`)}
              onChange={(e) => {
                form.setValue(
                  `direcciones.${index}.codigo_postal`,
                  e.target.value
                );
              }}
            />
          </FormControl>

          <ErrorMessage
            form={form}
            fieldPath={`direcciones`}
            index={index}
            property={"codigo_postal"}
          />
          <h2 className="font-medium text-sm">Ciudad</h2>
          <FormControl>
            <Input
              value={form.watch(`direcciones.${index}.ciudad`)}
              onChange={(e) => {
                form.setValue(`direcciones.${index}.ciudad`, e.target.value);
              }}
            />
          </FormControl>

          <ErrorMessage
            form={form}
            fieldPath={`direcciones`}
            index={index}
            property={"ciudad"}
          />

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="font-medium text-sm">Núm. Exterior</h2>
              <FormControl>
                <Input
                  value={form.watch(`direcciones.${index}.numExt`)}
                  onChange={(e) => {
                    form.setValue(
                      `direcciones.${index}.numExt`,
                      e.target.value
                    );
                  }}
                />
              </FormControl>

              <ErrorMessage
                form={form}
                fieldPath={`direcciones`}
                index={index}
                property={"numExt"}
              />
            </div>
            <div>
              <h2 className="font-medium text-sm">Núm. Interior</h2>

              <FormControl>
                <Input
                  value={form.watch(`direcciones.${index}.numInt`)}
                  onChange={(e) => {
                    form.setValue(
                      `direcciones.${index}.numInt`,
                      e.target.value
                    );
                  }}
                />
              </FormControl>

              <ErrorMessage
                form={form}
                fieldPath={`direcciones`}
                index={index}
                property={"numInt"}
              />
            </div>
          </section>

          <h2 className="font-medium text-sm">Datos de referencia</h2>
          <FormControl>
            <Textarea
              value={form.watch(`direcciones.${index}.referencia`)}
              onChange={(e) => {
                form.setValue(
                  `direcciones.${index}.referencia`,
                  e.target.value
                );
              }}
            />
          </FormControl>

          <ErrorMessage
            form={form}
            fieldPath={`direcciones`}
            index={index}
            property={"referencia"}
          />
        </FormItem>
      )}
    />
  );
};

const defaultValues = {
  direcciones: [
    {
      cve_pais: null,
      cve_estado: null,
      calle: "",
      codigo_postal: "",
      ciudad: "",
      referencia: "",
      principal: true,
      numInt: "",
      numExt: "",
      activo: true,
    },
  ],
};

const newDefaultDireccionValues = {
  ...defaultValues.direcciones[0],
  principal: false,
};

export const DashboardConfiguracionDirecciones = () => {
  const [direcciones, setDirecciones] = useState(null);

  const { tienda } = useParams();
  const { getAccessToken } = useAuth();
  const form = useForm({
    resolver: zodResolver(direccionSchema),
    defaultValues: direcciones || defaultValues,
    mode: "onChange",
  });

  const { fields, append, update, remove, swap } = useFieldArray({
    name: "direcciones",
    control: form.control,
  });

  async function handleDeleteDireccion(index) {
    const curr = form.watch(`direcciones.${index}`);

    if (curr.id) {
      //update(index, { ...curr, activo: false });

      try {
        const deletedDireccion = await deleteDireccionTienda({
          tiendaId: tienda,
          accessToken: getAccessToken(),
          direccionId: curr.id,
        });

        console.log(deletedDireccion);
      } catch (error) {
        toast({
          variant: "destructive",
          description: error.message,
        });
      }
    }

    remove(index);
  }

  async function getDirecciones() {
    try {
      const direcciones = await getDireccionesByTienda({ tiendaId: tienda });
      if (direcciones) {
        setDirecciones({ direcciones });
      }
    } catch (error) {
      toast({ description: error.message });
    }
  }

  async function createDirecciones(direcciones) {
    try {
      await createDireccionTienda({
        tiendaId: tienda,
        accessToken: getAccessToken(),
        input: { direcciones },
      });
    } catch (error) {
      toast({
        description: error.message,
      });
    }
  }

  async function updateDirecciones(direcciones) {
    try {
      const updatedDirecciones = await Promise.all(
        direcciones.map(async (direccion) => {
          return await updateDireccionTienda({
            tiendaId: tienda,
            direccionId: direccion.id,
            accessToken: getAccessToken(),
            input: { direcciones: [direccion] },
          });
        })
      );

      return toast({
        description: `Las direcciones han sido actualizadas correctamente.`,
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: error.message,
      });
    }
  }

  async function onSubmit(data) {
    const { direcciones } = data;
    const newDirecciones = direcciones.filter((direccion) => !direccion.id);
    const updatedDirecciones = direcciones.filter((direccion) => direccion.id);

    if (!direcciones) {
      // Handle case where direcciones is undefined
      throw new Error("Direcciones is undefined");
    }

    if (newDirecciones.length > 0) {
      await createDirecciones(newDirecciones);
    } else if (updatedDirecciones.length > 0) {
      updateDirecciones(updatedDirecciones);
    } else {
      form.setError();
    }
  }

  useEffect(() => {
    if (form.watch("direcciones").length > 0) {
      const index = form
        .watch("direcciones")
        .findIndex((e) => e.principal === true);

      swap(index, 0);
    }
    getDirecciones();
  }, [form.formState.isSubmitSuccessful, tienda]);

  useEffect(() => {
    form.reset(direcciones); // Actualiza los valores del formulario cuando cambia tiendaData
  }, [direcciones]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Direcciones de entrega</h3>
        <p className="text-sm text-muted-foreground">
          Estas son las direcciones de entrega que aparecerán como disponibles
          para recoger los pedidos cuando un cliente haga una compra en el
          sitio.
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Accordion type="single" collapsible className="space-y-4">
            {fields.map((field, index) => {
              if (field.principal) {
                return (
                  <div key={field.id}>
                    <h1 className="font-semibold">Dirección principal</h1>
                    <p className="text-muted-foreground text-sm">
                      Esta es la dirección que aparecerá por defecto cuando
                      consulten la información de tu tienda.
                    </p>
                    <br />
                    <Field form={form} index={index} />

                    <br />
                    <FormLabel>Otras direcciones</FormLabel>
                    <FormDescription>
                      Agrega direcciones de entrega en las cuales te sean
                      convenientes para entregar.
                    </FormDescription>
                  </div>
                );
              }

              if (form.getValues().direcciones.at(index).activo)
                return (
                  <div key={field.id}>
                    <AccordionItem value={`item-direccion-${field.id}`}>
                      <div className="grid grid-cols-7 gap-1 border rounded  shadow-sm">
                        <div className="col-span-6 ">
                          <AccordionTrigger className="  text-sm hover:no-underline hover:bg-accent p-3 rounded rounded-e-none  data-[state=open]:bg-primary data-[state=open]:rounded-b-none data-[state=open]:text-primary-foreground">
                            <span className=" flex gap-3 items-center">
                              <MapPinIcon className="h-4" />
                              <span className="text-start">
                                {JSON.stringify(
                                  form.watch(`direcciones.${index}`)
                                ) !== JSON.stringify(newDefaultDireccionValues)
                                  ? formatDireccion(
                                      form.watch(`direcciones.${index}`)
                                    )
                                  : `Dirección ${index + 1} sin definir`}
                              </span>
                            </span>
                          </AccordionTrigger>
                        </div>

                        <div className="flex gap-2 items-center  rounded-e-sm">
                          <AlertDialog>
                            <AlertDialogTrigger>
                              <Button
                                size="icon"
                                type="button"
                                variant="destructive"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-destructive text-destructive-foreground border-destructive">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  ¿Estás seguro de eliminar la dirección?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-destructive-foreground">
                                  Una vez confirmado, esta acción no se puede
                                  deshacer y no podrás accesar la informaciónde
                                  los servidores.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-destructive">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteDireccion(index)}
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <Button size="icon"></Button>
                        </div>
                      </div>
                      <AccordionContent className="bg-accent p-3">
                        <Field form={form} index={index} />
                      </AccordionContent>
                    </AccordionItem>

                    {/* form.formState.errors?.direcciones?.at(index) && (
                      <span className="font-medium text-destructive text-sm">
                        Falta completar datos en la dirección {index + 1}
                      </span>
                    ) */}
                  </div>
                );
            })}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append(newDefaultDireccionValues)}
            >
              <PlusCircledIcon className="h-4 w-4 mr-2" /> Agregar dirección
            </Button>
          </Accordion>

          {form.formState.dirtyFields && (
            <Button type="submit">Actualizar</Button>
          )}
        </form>
      </Form>
      <pre className="mt-2 hidden  rounded-md bg-slate-950 p-4">
        <code className="text-white">
          {JSON.stringify(form.watch("direcciones"), null, 2)}
        </code>
      </pre>
    </div>
  );
};
