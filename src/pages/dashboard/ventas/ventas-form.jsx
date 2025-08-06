import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import Decimal from "decimal.js";
import { useNavigate, useParams } from "react-router-dom";
import { getProductosByTienda } from "../../../services/productos";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  CheckCircledIcon,
  PlusCircledIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import { NavigatePreviousButton } from "../../../components/form/navigate-previous-button";
import { DataTable } from "../../../components/dashboard/data-table/data-table";
import { productosColumns } from "../../../components/dashboard/productos/productos-columns";
import { Loader } from "../../../components/loaders/loader";
import { currencyFormat } from "../../../components/commerce/productos/producto-card";
import { UserInfo } from "../../../components/user/user-info";
import { getUserNavName } from "../../../utils/get-user-nav-name";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import "react-lazy-load-image-component/src/effects/opacity.css";
import { API_URL } from "../../../auth/constants";
import { useAuth } from "../../../auth/auth-provider";

export const agregarProducto = (form, producto) => {
  const existProduct = form
    .watch("productos")
    .some((item) => item.folio === producto.folio);

  if (existProduct) {
    actualizarCantidad(form, producto.folio);
  } else {
    producto.cantidad = 1;
    form.setValue("productos", [...form.watch("productos"), producto]);
  }
};

export const actualizarCantidad = (form, productoId) => {
  let array = form.watch("productos");
  const currIndex = array.findIndex((item) => item.folio === productoId);
  let curr = array.find((item) => item.folio === productoId);

  if (curr.cantidad >= array[currIndex].existencias) {
    return form.setValue("productos", array);
  } else {
    curr.cantidad += 1;
    array[currIndex] = curr;
    form.setValue("productos", array);
  }
};

export const obtenerCantidadProducto = (form, productoId) => {
  const array = form.watch("productos");
  const producto = array.find((item) => item.producto === productoId);
  return producto ? producto.cantidad : 0;
};

export const eliminarProducto = (form, productoId) => {
  const array = form.watch("productos");
  const newArray = array.filter((item) => item.folio !== productoId);
  form.setValue("productos", newArray);
};

export const establecerCantidadProducto = (form, productoId, nuevaCantidad) => {
  let array = form.watch("productos");
  const productoIndex = array.findIndex((item) => item.folio === productoId);

  if (productoIndex !== -1) {
    if (nuevaCantidad > 0) {
      if (nuevaCantidad <= array[productoIndex].existencias) {
        array[productoIndex].cantidad = nuevaCantidad;
        form.setValue("productos", array);
      }

      return form.setValue("productos", array);
    } else {
      array[productoIndex].cantidad = 1;
      form.setValue("productos", array);
    }
  }
};

export const decrementarCantidad = (form, productoId) => {
  let array = form.watch("productos");
  const currIndex = array.findIndex((item) => item.folio === productoId);
  let curr = array.find((item) => item.folio === productoId);
  curr.cantidad -= 1;
  if (curr.cantidad === 0) {
    array.splice(currIndex, 1); // Eliminar el producto si la cantidad es cero
  } else {
    array[currIndex] = curr;
  }
  form.setValue("productos", array);
};

export const VentasForm = () => {
  const [istotalEditable, setIsTotalEditable] = useState(true);
  const [impuestoAplicado, setImpuestoAplicado] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [productosData, setProductosData] = useState(null);
  const [totalVenta, setTotalVenta] = useState(0);
  const [clientesData, setClientesData] = useState(null);
  const [openClienteDialog, setOpenClienteDialog] = useState(false);
  const [openProductoDialog, setOpenProductoDialog] = useState(false);
  const { tienda } = useParams();
  const { toast } = useToast();
  const auth = useAuth();

  const goTo = useNavigate();
  const token = auth.getAccessToken();

  useEffect(() => {
    getProductos();
  }, [tienda]);

  async function getProductos() {
    try {
      const response = await getProductosByTienda({
        tiendaId: tienda,
        accessToken: token,
      });
      if (response.ok) {
        const json = await response.json();
        return setProductosData(json.body.data);
      }
      setProductosData([]);
    } catch (error) {
      setProductosData([]);
    }
  }

  const formSchema = z.object({
    cve_cliente: z.string().optional(),
    descripcion: z.string().max(100).optional(),
    fecha_venta: z.date(),
    productos: z
      .array(
        z
          .object({
            folio: z.number(),
            cantidad: z.number().positive(),
            total: z.number().positive(),
          })
          .refine((data) => (data.cve_producto = data.folio))
      )
      .optional(),
    registrar_cliente: z.boolean(),
    total: z.number().positive(),
    subtotal: z.number().positive(),
    aplicar_impuesto: z.boolean(),
    es_fecha_actual: z.boolean(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cve_cliente: undefined,
      descripcion: "",
      es_fecha_actual: true,
      registrar_cliente: false,
      fecha_venta: null,
      productos: [],
      subtotal: "",
      total: "",
      aplicar_impuesto: false,
    },
  });

  const columns = productosColumns({
    isVentaView: true,
    form,
    totalProductos: totalVenta,
  });

  // 2. Define a submit handler.
  async function onSubmit(data) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    setIsUploading(true);

    const response = await fetch(`${API_URL}/tiendas/${tienda}/ventas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...data,
        cve_vendedor: auth.getUser()?.id,
        cve_tienda: parseInt(tienda),
      }),
    });

    if (response.ok) {
      form.reset();
      setIsUploading(false);

      setTimeout(() => {
        toast({
          title: (
            <div className="text-base flex items-center gap-2 font-semibold">
              <CheckCircledIcon className="text-emerald-300 h-8 w-8" /> Venta
              realizada!
            </div>
          ),
          description: "El venta ha sido registrada exitosamente.",
        });

        setTimeout(() => {
          goTo(`/dashboard/${tienda}/ventas`);
        }, 1400); // Puedes ajustar el tiempo de espera según sea necesario
      }, 0); // Puedes ajustar el tiempo de espera según sea necesario
    } else {
      setIsUploading(false);
      const json = await response.json();
      errorRef.current = json.error_message;

      toast({
        variant: "destructive",
        title: (
          <span>
            <ExclamationTriangleIcon /> Error
          </span>
        ),
        description: <>{errorRef.current}</>,
        action: <ToastAction altText="Okay">Entendido</ToastAction>,
      });
    }
  }

  useEffect(() => {
    // Función que actualiza el valor de "fecha" en el formulario
    const updateFecha = () => {
      form.setValue("fecha_venta", new Date(Date.now()));
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

  useEffect(() => {
    const subtotal = new Decimal(parseFloat(form.watch("subtotal")));

    if (form.watch("aplicar_impuesto")) {
      setImpuestoAplicado(true);
      const calculatedTotal = subtotal.times(new Decimal(0.16));

      if (
        form.watch("subtotal") === "" ||
        form.watch("subtotal") === 0 ||
        isNaN(subtotal)
      ) {
        return form.setValue("total", "");
      }

      form.setValue("total", subtotal.add(calculatedTotal).toNumber());
    } else {
      form.setValue("total", form.watch("subtotal"));
    }
  }, [
    form.watch("productos"),
    form.watch("subtotal"),
    form.watch("aplicar_impuesto"),
  ]);

  useEffect(() => {
    // Lógica para ajustar el valor de fecha_venta
    if (form.watch("es_fecha_actual")) {
      form.setValue("fecha_venta", new Date(Date.now()));
    } else {
      form.setValue("fecha_venta", null);
    }
  }, [form.watch("es_fecha_actual")]);

  useEffect(() => {
    const productosArray = form.watch("productos");

    let totalPrecio = new Decimal(0);

    productosArray.forEach((e) => {
      let curr = new Decimal(e.precio_venta);
      let cantidad = new Decimal(e.cantidad);
      let tolCurr = curr.times(cantidad);

      e.total = tolCurr.toNumber();
      totalPrecio = totalPrecio.add(tolCurr);
    });

    setTotalVenta(totalPrecio.toNumber());

    if (productosArray.length > 0) {
      form.setValue("subtotal", totalPrecio.toNumber());
      form.setValue("total", totalPrecio.toNumber());
      setIsTotalEditable(false);
    } else {
      form.setValue("subtotal", "");
      form.setValue("total", "");
      setIsTotalEditable(true);
    }
  }, [form.watch("productos")]);

  return (
    <div className="space-y-2 absolute top-16 left-0 px-5 w-full bg-background pb-5 ">
      <NavigatePreviousButton />

      <header>
        <Label className="text-xl font-bold">Registrar venta</Label>
        <p className="text-muted-foreground text-sm">
          Formulario para registrar una nueva tienda
        </p>
        <Separator />
      </header>

      <main>
        <section>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <section className="grid grid-cols-7 gap-x-10 gap-y-4">
                <div className="space-y-5 col-span-7 lg:col-span-2 ">
                  <div className="space-y-4 pt-2 ">
                    <FormField
                      control={form.control}
                      name="fecha_venta"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Fecha de la venta</FormLabel>
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Esta es la fecha en la cual registrarás la venta.
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
                              Selecciona si quieres registrar la venta con la
                              fecha y hora actual del registro.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    {form.watch("registrar_cliente") && (
                      <FormField
                        control={form.control}
                        name="cve_cliente"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Cliente</FormLabel>

                            <FormControl>
                              <Button
                                onClick={() =>
                                  setOpenClienteDialog((prev) => !prev)
                                }
                                type="button"
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  " justify-between text-muted-foreground"
                                )}
                              >
                                <span className="flex items-center gap-2">
                                  <PlusCircledIcon />
                                  Agregar cliente
                                </span>

                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>

                            <CommandDialog
                              open={openClienteDialog}
                              onOpenChange={setOpenClienteDialog}
                            >
                              <CommandInput placeholder="Buscar cliente..." />
                              <CommandEmpty>
                                Cliente no encontrado...
                              </CommandEmpty>

                              {clientesData ? (
                                <CommandGroup className="max-h-[500px] overflow-y-auto">
                                  {clientesData.map((e) => (
                                    <CommandItem
                                      className="min-h-[100px]"
                                      value={e.nombre}
                                      key={e.nombre + "-" + e.folio + "-item"}
                                      onSelect={() => {
                                        form.setValue("cve_cliente", e.id);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          e.nombre === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />

                                      <UserInfo
                                        username={getUserNavName(e.nombre)}
                                        email={e.telefono}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              ) : (
                                <></>
                              )}
                            </CommandDialog>

                            <FormDescription>
                              La venta se registrará a nombre del cliente
                              seleccionado.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    <FormField
                      control={form.control}
                      name="registrar_cliente"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Agregar cliente</FormLabel>
                            <FormDescription>
                              Selecciona si quieres registrar en la venta la
                              referencia a un cliente guardado en tu tienda.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="descripcion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Concepto</FormLabel>
                        <FormControl>
                          <Textarea
                            className="resize-none"
                            placeholder="Escribe el concepto de la nueva venta"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Con la descripción se identifica la venta a registrar.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="subtotal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subtotal de venta</FormLabel>
                          <FormControl>
                            <Input
                              readOnly={!istotalEditable}
                              placeholder="$ 1000.00"
                              onChange={(e) => {
                                form.setValue(
                                  "subtotal",
                                  parseFloat(e.target.value)
                                );
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Esta es la suma de todos los montos.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="total"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total de venta</FormLabel>
                          <FormControl>
                            <Input
                              readOnly={!istotalEditable && !impuestoAplicado}
                              placeholder="$ 1100.00"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Esta es la suma de todos los montos aplicado
                            impuestos o descuentos.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="aplicar_impuesto"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Aplicar IVA</FormLabel>
                            <FormDescription>
                              Selecciona si quieres aplicar al total de la venta
                              un impuesto de 16%
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="col-span-7 lg:col-span-5 space-y-6 ">
                  <FormField
                    control={form.control}
                    name="productos"
                    render={({ field }) => (
                      <FormItem>
                        <div>
                          <FormLabel>Registrar productos</FormLabel>
                        </div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                type="button"
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  " justify-between text-muted-foreground w-full"
                                )}
                              >
                                <span className="flex items-center gap-2">
                                  <PlusCircledIcon />
                                  Agregar producto(s)
                                </span>

                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className=" md:w-[600px] lg:w-[900px] w-[500px] bg-slate-50 p-0">
                            <Command className="w-full">
                              <CommandInput placeholder="Buscar producto..." />
                              <CommandEmpty>
                                Producto no encontrado...
                              </CommandEmpty>

                              {productosData ? (
                                <CommandGroup className="max-h-[500px] overflow-y-auto">
                                  {productosData.map((e) => (
                                    <CommandItem
                                      className="min-h-[100px] p-0"
                                      value={`${e.producto} ${e.marca} ${e.categoria} #${e.folio}`}
                                      key={e.nombre + "-" + e.folio + "-item"}
                                      onSelect={() => {
                                        agregarProducto(form, e);
                                      }}
                                      keywords={[e.marca, e.categoria]}
                                    >
                                      <div className=" active:bg-primary active:text-primary-foreground active:shadow active:after:animate-ping active:after:content-['+1'] after:ml-[auto] after:mr-6 after:text-primary-foreground after:font-semibold after:text-2xl   transition-all flex items-center w-full p-2 rounded">
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            form
                                              .watch("productos")
                                              .some(
                                                (item) => item.folio === e.folio
                                              )
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />

                                        <div className="grid grid-cols-[100px,2fr] items-center gap-5">
                                          <picture className="aspect-square max-h-[100px] flex items-center justify-center text-muted-foreground bg-accent border rounded">
                                            {Object(e.principal_photo).path ? (
                                              <LazyLoadImage
                                                effect="opacity"
                                                src={
                                                  Object(e.principal_photo).path
                                                }
                                                alt={e.producto}
                                              />
                                            ) : (
                                              <QuestionMarkCircledIcon className="h-3/4 w-3/4" />
                                            )}
                                          </picture>

                                          <div className="space-y-2">
                                            <div className="space-x-2">
                                              <Badge className="rounded-md">
                                                {e.marca}
                                              </Badge>
                                              <Badge variant="secondary">
                                                {e.categoria}
                                              </Badge>
                                            </div>

                                            <div>
                                              <div className="text-xs text-muted-foreground">
                                                #{e.folio}
                                              </div>
                                              <Label className="text-md font-medium">
                                                {e.producto}
                                              </Label>

                                              <div className="">
                                                {currencyFormat(e.precio_venta)}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              ) : (
                                <span className="flex items-centergap-2 text-muted-foreground text-sm">
                                  <Loader className=" h-5 " /> Cargando...
                                </span>
                              )}
                            </Command>
                          </PopoverContent>
                        </Popover>

                        <FormDescription>
                          Selecciona uno o más productos.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {productosData ? (
                    <div className="rounded border p-5 shadow">
                      <DataTable
                        columns={columns}
                        data={form.watch("productos")}
                        hasFooter={true}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-1/3 rounded-md" />
                      <div
                        className={cn(
                          "border shadow-sm rounded-sm",
                          "min-h-[128px] flex items-center justify-center"
                        )}
                      >
                        <div className="">
                          <span className="text-muted-foreground text-sm flex gap-2 items-center">
                            <Loader className="h-5 w-5" /> Cargando productos...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="col-span-7 lg:col-span-2 w-full"
                  disabled={isUploading}
                >
                  Registrar
                </Button>
              </section>
            </form>
          </Form>
        </section>

        <Toaster />
      </main>
    </div>
  );
};
