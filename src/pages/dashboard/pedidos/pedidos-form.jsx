import React, { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button, buttonVariants } from "@/components/ui/button";


import { useToast } from "@/components/ui/use-toast";

import { NavigatePreviousButton } from "../../../components/form/navigate-previous-button";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";

import { z } from "zod";

import { format } from "date-fns";

import es from "date-fns/locale/es";
import { CalendarIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { Check, ChevronsUpDown } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../auth/auth-provider";
import { getVentaById, getVentasByTienda } from "../../../services/ventas";
import { getMetodosPago } from "../../../services/metodo-pago";
import { VentaDetallesCard } from "../../../components/dashboard/ventas/venta-detalles-card";
import { API_URL } from "../../../auth/constants";
import { LazyDataTableLoader } from "../../../components/loaders/lazy-datatable-loader";
import { DataTable } from "../../../components/dashboard/data-table/data-table";
import { ventasDetallesColumns } from "../../../components/dashboard/ventas/ventas-detalles-columns";
import { pedidoSchema } from "../../../schemas/pedidos-schema";
import { formatDireccion } from "../../../utils/direccionFormatter";
import { getDireccionesByTienda } from "../../../services/tiendas";

export const PedidosForm = ({
  title = "Registrar pedido",
  descripcion = "Aquí puedes registrar como pedidos a tus ventas",
  onSubmitFunction,
}) => {
  const [ventasData, setVentasData] = useState(null);
  const [detallesData, setDetallesData] = useState({});
  const [posted, setPosted] = useState(false);
  const [columns, setColumns] = useState(null);
  const [error, setError] = useState("");
  const [direcciones, setDirecciones] = useState(null);
  const [ventaIdData, setVentaIdData] = useState(null);
  const [ventaSelected, setVentaSeleted] = useState(null);
  const { tienda, venta } = useParams();
  const { getAccessToken, getUser } = useAuth();

  const { toast } = useToast();
  const goTo = useNavigate();

  const estadosEntrega = [
    { value: "Entregado" },
    { value: "No entregado" },
    { value: "Pendiente" },
  ];
  async function getVentas() {
    const response = await getVentasByTienda({
      tiendaId: tienda,
      accessToken: getAccessToken(),
    });

    if (response.ok) {
      const json = await response.json();

      const ventasFiltered = json.body.data.filter((venta) => !venta.direccion);
      setVentasData(ventasFiltered);

      /*  if (ventaSelected) {
        setVentaSeleted(
          json.body.data.find(
            (e) => Object(e.venta).folio === form.watch("cve_venta")
          )?.venta
        );
      } */
    } else {
      setVentasData(null);
    }
  }

  async function getVenta() {
    if (venta) {
      const response = await getVentaById({
        tiendaId: tienda,
        ventaId: venta,
        accessToken: getAccessToken(),
      });

      if (response.ok) {
        const json = await response.json();

        const { venta, productos } = json.body.data;
        form.setValue("cve_venta", venta.folio);
        setVentaIdData(venta);
        setDetallesData(productos);
        setColumns(ventasDetallesColumns(venta.subtotal));
      } else {
        goTo(`/dashboard/${tienda}/pagos/registrar-pago`);
      }
    }
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
  // 1. Define your form.

  const form = useForm({
    resolver: zodResolver(pedidoSchema),
    defaultValues: {
      cve_venta: null,
      cve_direccion_entrega: null,
      estado_entrega: "Pendiente",
    },
  });

  useEffect(() => {
    if (venta) {
      getVenta();
    } else {
      getVentas();
    }
  }, [tienda, venta, posted]);

  useEffect(() => {
    if (ventasData && ventasData.length > 0) {
      setVentaSeleted(
        ventasData.find((e) => Object(e).folio === form.watch("cve_venta"))
      );

      setColumns(
        ventasDetallesColumns(
          ventasData.find((e) => Object(e).folio === form.watch("cve_venta"))
            ?.subtotal
        )
      );

      setDetallesData(
        ventasData.find((e) => Object(e).folio === form.watch("cve_venta"))
          ?.productos
      );
    }
  }, [form.watch("cve_venta"), posted, tienda]);

  useEffect(() => {
    form.reset();
    getDirecciones();
  }, [tienda]);

  // 2. Define a submit handler.
  async function onSubmit(data) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const response = await fetch(`${API_URL}/tiendas/${tienda}/pedidos`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
      },

      body: JSON.stringify({
        ...data,
        cve_tienda: tienda,
      }),

      method: "POST",
    });

    if (response.ok) {
      form.reset();
      toast({
        title: "Pago exitoso",
        description: "Se ha realizado el pago satisfactoriamente",
      });
      setPosted((prev) => !prev);
    } else {
      const json = await response.json();

      const { error } = json.body;

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error,
        });
      }
    }
  }

  return (
    <div className="space-y-2 absolute top-14 left-0 py-2 px-6 bg-background w-screen">
      <NavigatePreviousButton />

      <div>
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">{descripcion}</p>
      </div>

      <Separator />

      <div className="grid grid-cols-6 gap-x-5 pb-5">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 col-span-2"
          >
            <FormField
              control={form.control}
              name="cve_venta"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Venta</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            " justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value && ventasData ? (
                            <div className="flex items-center gap-2">
                              Folio de venta:
                              <span className="font-normal">
                                #
                                {
                                  ventasData.find(
                                    (e) => e.folio === field.value
                                  )?.folio
                                }
                              </span>
                            </div>
                          ) : !ventasData && ventaIdData ? (
                            <div className="flex items-center gap-2">
                              Folio de venta:
                              <span className="font-normal">
                                #{ventaIdData.folio}
                              </span>
                            </div>
                          ) : (
                            "Selecciona la venta"
                          )}
                          <ChevronsUpDown
                            className={cn(
                              "ml-2 h-4 w-4 shrink-0 opacity-50",
                              venta && "opacity-0"
                            )}
                          />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    {ventasData ? (
                      <PopoverContent className=" p-0">
                        <Command>
                          <CommandInput placeholder="Buscar venta..." />
                          <CommandEmpty>Venta no encontrada</CommandEmpty>

                          {ventasData && (
                            <CommandGroup>
                              {ventasData.map((e) => {
                                return (
                                  <CommandItem
                                    value={`${e.folio} ${format(
                                      new Date(e.fecha_venta),
                                      "PPPpp",
                                      { locale: es }
                                    )}`}
                                    key={`item-${e.folio} `}
                                    onSelect={() => {
                                      form.setValue("cve_venta", e.folio);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        e.folio === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    <span className="font-semibold">
                                      #{e.folio}
                                    </span>

                                    <Separator
                                      orientation="vertical"
                                      className="h-5 mx-2"
                                    />

                                    <div className="flex flex-col">
                                      {format(
                                        new Date(e.fecha_venta),
                                        "PPPp ",
                                        { locale: es }
                                      )}

                                      {e.descripcion && (
                                        <p className="text-muted-foreground text-xs">
                                          {e.descripcion}
                                        </p>
                                      )}
                                    </div>
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          )}
                        </Command>
                      </PopoverContent>
                    ) : (
                      <></>
                    )}
                  </Popover>
                  <FormDescription>
                    Esta será la venta a la cual registrarás el pago.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cve_direccion_entrega"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Dirección de entrega</FormLabel>

                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          role="combobox"
                          variant={"outline"}
                          className={cn(
                            " pl-3 h-16 text-left font-normal justify-start",
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
                      <PopoverContent className=" p-0">
                        <Command>
                          <CommandInput placeholder="Buscar método de pago..." />
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
                                    form.setValue(
                                      "cve_direccion_entrega",
                                      e.id
                                    );
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
                    Selecciona una de las direcciones de entrega configuradas en
                    tu tienda.{" "}
                    <Link to={`/dashboard/${tienda}/configuracion/direcciones`}>
                      Configuración de direcciones
                    </Link>
                    .
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estado_entrega"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado de entrega</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el estado de entrega del pedido." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {estadosEntrega.map((estado) => (
                        <SelectItem
                          key={`estado-${estado.value}`}
                          value={estado.value}
                        >
                          {estado.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    You can manage email addresses in your{" "}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>

        <section className="h-full  col-span-4">
          <Tabs defaultValue="info">
            <TabsList>
              <TabsTrigger value="info">Información</TabsTrigger>

              {detallesData && detallesData.length > 0 && (
                <TabsTrigger value="details">Detalles</TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="info" className="border p-6 rounded shadow">
              {form.watch("cve_venta") > 0 ? (
                ventasData ? (
                  ventaSelected && <VentaDetallesCard venta={ventaSelected} />
                ) : (
                  ventaIdData && <VentaDetallesCard venta={ventaIdData} />
                )
              ) : (
                <span className="text-muted-foreground text-sm">
                  No se ha seleccionado ninguna venta...
                </span>
              )}
            </TabsContent>

            <TabsContent
              value="details"
              className="rounded border shadow p-5 space-y-3"
            >
              <p className="font-semibold">Detalles de la venta</p>
              {(ventaIdData || ventaSelected) && detallesData ? (
                <DataTable
                  columns={columns}
                  data={detallesData}
                  hasFooter={true}
                ></DataTable>
              ) : (
                <LazyDataTableLoader
                  className="min-h-[55vh]"
                  label="Cargando detalles..."
                />
              )}
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
};
