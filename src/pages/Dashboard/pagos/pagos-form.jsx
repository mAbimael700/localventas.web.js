import React, { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

import { Toaster } from "@/components/ui/toaster";
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
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";

import { z } from "zod";

import { format } from "date-fns";

import es from "date-fns/locale/es";
import { CalendarIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { Check, ChevronsUpDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../auth/auth-provider";
import { getVentaById, getVentasByTienda } from "../../../services/ventas";
import { getMetodosPago } from "../../../services/metodo-pago";
import { VentaDetallesCard } from "../../../components/dashboard/ventas/venta-detalles-card";
import { API_URL } from "../../../auth/constants";
import { LazyDataTableLoader } from "../../../components/loaders/lazy-datatable-loader";
import { DataTable } from "../../../components/dashboard/data-table/data-table";
import { ventasDetallesColumns } from "../../../components/dashboard/ventas/ventas-detalles-columns";

export const PagosForm = () => {
  const [ventasData, setVentasData] = useState(null);
  const [detallesData, setDetallesData] = useState({});
  const [posted, setPosted] = useState(false);
  const [columns, setColumns] = useState(null);
  const [error, setError] = useState("");
  const [ventaIdData, setVentaIdData] = useState(null);
  const [ventaSelected, setVentaSeleted] = useState(null);
  const [metodosPagoData, setMetodosPagoData] = useState(null);
  const { tienda, venta } = useParams();
  const { getAccessToken, getUser } = useAuth();

  const { toast } = useToast();
  const goTo = useNavigate();

  async function getVentas() {
    const response = await getVentasByTienda({
      tiendaId: tienda,
      accessToken: getAccessToken(),
    });

    if (response.ok) {
      const json = await response.json();
      setVentasData((json.body.data).filter(venta => !venta.estado));

      if (ventaSelected) {
        setVentaSeleted(
          json.body.data.find(
            (e) => Object(e).folio === form.watch("cve_venta")
          )
        );
      }
    } else {
      setVentasData(null);
    }
  }

  async function setMetodosPago() {
    const response = await getMetodosPago({
      accessToken: getAccessToken(),
    });

    if (response.ok) {
      const json = await response.json();

      console.log(json);
      setMetodosPagoData(json.body.data);
    } else {
      setMetodosPagoData(null);
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

  // 1. Define your form.
  const formSchema = z.object({
    cve_venta: z.number().min(1).int().positive(),
    es_fecha_actual: z.boolean(),
    cve_metodo_pago: z
      .number({ invalid_type_error: "Ingrese un método de pago válido" })
      .min(1)
      .int()
      .positive(),
    fecha: z.date(),
    monto: z
      .string()
      .min(1, { message: "Ingrese el monto del pago." })
      .refine((precio) => !isNaN(parseFloat(precio)), {
        message: "El monto debe ser un número",
      })
      .transform((str) => {
        const parsedValue = parseFloat(str);
        return isNaN(parsedValue) ? undefined : parsedValue;
      }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cve_venta: "",
      fecha: null,
      es_fecha_actual: true,
      cve_metodo_pago: null,
      monto: "",
    },
  });

  useEffect(() => {
    setMetodosPago();
  }, []);

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
        ventasData.find(
          (e) => Object(e).folio === form.watch("cve_venta")
        )
      );

      setColumns(
        ventasDetallesColumns(
          ventasData.find(
            (e) => Object(e).folio === form.watch("cve_venta")
          )?.subtotal
        )
      );

      setDetallesData(
        ventasData.find(
          (e) => Object(e).folio === form.watch("cve_venta")
        )?.productos
      );
    }
  }, [form.watch("cve_venta"), posted, tienda]);

  useEffect(() => {
    form.reset();
  }, [tienda]);
  useEffect(() => {
    // Función que actualiza el valor de "fecha" en el formulario
    const updateFecha = () => {
      form.setValue("fecha", new Date(Date.now()));
    };

    // Si es_fecha_actual es true, establece un intervalo para actualizar "fecha" cada segundo
    if (form.watch("es_fecha_actual") === true) {
      const intervalId = setInterval(updateFecha, 1000);

      // Limpia el intervalo cuando el efecto se desmonta o cuando es_fecha_actual deja de ser true
      return () => clearInterval(intervalId);
    } else {
      // Si es_fecha_actual ya no es true, actualiza "fecha" una vez
      updateFecha();
    }
  }, [form.watch("es_fecha_actual")]);

  // 2. Define a submit handler.
  async function onSubmit(data) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const response = await fetch(`${API_URL}/abonos`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
      },

      body: JSON.stringify({
        ...data,
        cve_tienda: tienda,
        cve_vendedor: getUser()?.id,
      }),

      method: "POST",
    });

    if (response.ok) {
      form.resetField("cve_metodo_pago");
      form.resetField("monto");
      toast({
        title: "Pago exitoso",
        description: "Se ha realizado el pago satisfactoriamente",
      });
      setPosted((prev) => !prev);
    } else {
      const json = await response.json();

      const { error_message } = json.body;

      if (error_message.length > 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error_message,
        });
      }
    }
  }

  return (
    <div className="space-y-2 absolute top-14 left-0 py-2 px-6 bg-background w-screen">
      <NavigatePreviousButton />

      <div>
        <h1 className="text-xl font-bold">Registrar abono</h1>
        <p className="text-sm text-muted-foreground">
          Aquí puedes registrar pagos o abonos de tus ventas
        </p>
      </div>

      <Separator />

      <div className="grid grid-cols-6 gap-x-5 pb-5">
        {(ventaIdData || ventaSelected) &&
        (ventaIdData?.estado === true || ventaSelected?.estado === true) ? (
          <div className="col-span-2 text-sm flex h-7 items-center gap-2">
            <CheckCircledIcon className="text-green-400" /> Esta venta ya ha
            sido pagada.
          </div>
        ) : (
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
                                      form.setValue(
                                        "cve_venta",
                                        e.folio
                                      );
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
                name="monto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto</FormLabel>
                    <FormControl>
                      <Input placeholder="$ 1000.00" {...field} />
                    </FormControl>
                    <FormDescription>
                      Ingresa el monto del pago a realizar.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cve_metodo_pago"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Metodo de pago</FormLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type="button"
                            role="combobox"
                            variant={"outline"}
                            className={cn(
                              " pl-3 text-left font-normal justify-start",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value && metodosPagoData ? (
                              metodosPagoData.find((e) => e.id === field.value)
                                ?.nombre
                            ) : (
                              <span>Selecciona un método de pago</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>

                      {metodosPagoData ? (
                        <PopoverContent className=" p-0">
                          <Command>
                            <CommandInput placeholder="Buscar método de pago..." />
                            <CommandEmpty>
                              Método de pago no encontrado
                            </CommandEmpty>

                            {metodosPagoData && (
                              <CommandGroup>
                                {metodosPagoData.map((e) => (
                                  <CommandItem
                                    value={e.id}
                                    key={`item-${e.id}`}
                                    onSelect={() => {
                                      form.setValue("cve_metodo_pago", e.id);
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
                                    {e.nombre}
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
                      Esta es la fecha en la cual registrarás el pago.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fecha"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de pago</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type="button"
                            role="combobox"
                            variant={"outline"}
                            className={cn(
                              " pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPpp", { locale: es })
                            ) : (
                              <span>Selecciona una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          fixedWeeks
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Esta es la fecha en la cual registrarás el pago.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="es_fecha_actual"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Fecha y hora actual</FormLabel>
                      <FormDescription>
                        Selecciona si quieres registrar la venta con la fecha y
                        hora actual del registro.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        )}

        <section className="h-full  col-span-4">
          <Tabs defaultValue="info">
            <TabsList>
              <TabsTrigger value="info">Información</TabsTrigger>
              <TabsTrigger value="details">Detalles</TabsTrigger>
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

        <Toaster />
      </div>
    </div>
  );
};
