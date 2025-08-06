import {
  EyeOpenIcon,
  MinusIcon,
  PlusIcon,
  QuestionMarkCircledIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { DataTableColumnHeader } from "../data-table-columns-header";
import { ProductOptions } from "./product-options";
import { obtenerValores, facetedOption } from "@/utils/facetedOptions";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { rowCurrencyFormat } from "../data-table/data-table-currency-format";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es, ro } from "date-fns/locale";
import {
  actualizarCantidad,
  decrementarCantidad,
  eliminarProducto,
  establecerCantidadProducto,
  obtenerCantidadProducto,
} from "@/pages/dashboard/ventas/ventas-form";
import { currencyFormat } from "../../commerce/productos/producto-card";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Input } from "../../ui/input";
import { useEffect, useState } from "react";
import Decimal from "decimal.js";

export const CellProducts = ({ row, value }) => {
  return (
    <div
      className={` font-semibold flex items-center justify-end lg:justify-center text-center m-[auto_auto]`}
    >
      {row.getValue(value)}
    </div>
  );
};

export function productosColumns({
  isVentaView = false,
  form,
  totalProductos,
}) {
  let columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "folio",
      isNull: true,
      enableHiding: false,
    },
    {
      accessorKey: "principal_photo",
      header: "",
      enableHiding: false,
      cell: ({ row }) => {
        const goTo = useNavigate();
        const { tienda } = useParams();
        const img = row.getValue("principal_photo");
        const id = row.getValue("folio");
        const nombre = row.getValue("producto");

        return (
          <picture
            onClick={() => {
              !isVentaView &&
                goTo(
                  `/dashboard/${tienda}/productos/actualizar-producto/${id}`,
                  { state: { formStep: 3 } }
                );
            }}
            className="m-[0] min-w-[100px] w-[100px] flex items-center justify-center  aspect-square  rounded-sm bg-muted border"
          >
            {img ? (
              <LazyLoadImage
                effect="opacity"
                className="max-h-[90px] w-auto"
                src={img.path}
                alt={nombre}
              />
            ) : (
              <QuestionMarkCircledIcon className="h-14 w-24 text-muted-foreground" />
            )}
          </picture>
        );
      },
      isNull: true,
    },
    {
      accessorKey: "fecha_creacion",
      isNull: true,
      enableHiding: false,
      enableGlobalFilter: false,
      enableColumnFilter: false,
    },
    {
      accessorKey: "producto",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title="Producto"
          ></DataTableColumnHeader>
        );
      },
      cell: ({ row }) => {
        const producto = row.getValue("producto");
        const folio = row.getValue("folio");
        const fecha = new Date(row.getValue("fecha_creacion"));

        const goTo = useNavigate();
        const { tienda } = useParams();
        const img = row.getValue("principal_photo");
        const id = row.getValue("folio");
        const nombre = row.getValue("producto");

        return (
          <div className="flex justify-end lg:justify-start md:justify-start items-center gap-7 min-w-[150px]">
            <picture
              onClick={() => {
                !isVentaView &&
                  goTo(
                    `/dashboard/${tienda}/productos/actualizar-producto/${id}`,
                    { state: { formStep: 3 } }
                  );
              }}
              className="m-[0] min-w-[100px] order-2 lg:order-1 md:order-1 w-[100px] flex items-center justify-center  aspect-square  rounded-sm bg-muted border"
            >
              {img ? (
                <LazyLoadImage
                  effect="opacity"
                  className="max-h-[90px] w-auto"
                  src={img.path}
                  alt={nombre}
                />
              ) : (
                <QuestionMarkCircledIcon className="h-14 w-24 text-muted-foreground" />
              )}
            </picture>

            <div className="order-1 lg:order-2 md:order-2">
              
              <div className="font-normal text-xs text-muted-foreground w-44">
                #{folio}
              </div>
              <CardTitle className="text-base md:text-lg max-w-[220px]">
                {producto}
              </CardTitle>
              <span className="font-normal text-sm text-muted-foreground">
                {fecha !== undefined
                  ? format(fecha, "PPP", { locale: es })
                  : "Fecha no definida"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "categoria",
      header: "Categoría",
      cell: ({ row }) => {
        return <CellProducts row={row} value={"categoria"} />;
      },
      showFilter: true,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "marca",
      header: "Marca",
      showFilter: true,
      cell: ({ row }) => {
        return <CellProducts row={row} value={"marca"} />;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "descripcion",
      label: "Descripción",
      header: "Descripción",
      isNull: isVentaView,
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-end lg:justify-center md:justify-center text-center m-[auto_auto]">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="p-2 h-8 shadow-sm" variant="outline">
                  Mostrar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Descripción del producto</DialogTitle>
                  <DialogDescription className="pt-2 space-y-3">
                    <div>
                      <h1 className="text-lg font-semibold">
                        {row.getValue("producto")}
                      </h1>
                      <div className="whitespace-pre-wrap font-sans max-h-[200px] overflow-y-auto">
                        {row.getValue("descripcion")}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <span className="text-base font-semibold">
                        Características principales
                      </span>
                      <div className="rounded border shadow-sm">
                        <div className="odd:bg-background even:bg-accent p-3 rounded-t flex items-center justify-between w-full">
                          <span className="font-semibold">Marca:</span>{" "}
                          {row.getValue("marca")}
                        </div>

                        <div className="odd:bg-background even:bg-accent p-3 rounded-b flex items-center justify-between w-full">
                          <span className="font-semibold">Categoría:</span>{" "}
                          {row.getValue("categoria")}
                        </div>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
      enableGlobalFilter: false,
      enableColumnFilter: false,
    },
    {
      accessorKey: "precio_compra",
      label: "Costo",
      isNull: isVentaView,
      header: "Costo",
      cell: ({ row }) => {
        return rowCurrencyFormat(row, "precio_compra");
      },

      enableGlobalFilter: false,
      enableColumnFilter: false,
    },
    {
      id: "precio_venta",
      accessorKey: "precio_venta",
      label: "Precio",
      enableGlobalFilter: false,
      enableColumnFilter: false,
      header: "Precio",

      cell: ({ row }) => {
        return rowCurrencyFormat(row, "precio_venta");
      },
    },
    {
      accessorKey: "ganancia",
      isNull: isVentaView,
      enableGlobalFilter: false,
      enableColumnFilter: false,
      header: "Ganancia",
      cell: ({ row }) => {
        return rowCurrencyFormat(row, "ganancia");
      },
    },
    {
      accessorKey: "ganancia_total",
      label: "Ganancias totales",
      isNull: isVentaView,
      header: "Ganancias totales",
      cell: ({ row }) => {
        const ganancias = row.getValue("ganancia_total");
        if (ganancias) return rowCurrencyFormat(row, "ganancia_total");

        return (
          <span className="text-muted-foreground flex items-center justify-end lg:justify-center md:justify-center gap-2">
            <QuestionMarkCircledIcon /> No hay ganancias
          </span>
        );
      },
      enableGlobalFilter: false,
      enableColumnFilter: false,
    },
    {
      accessorKey: "existencias",
      isNull: isVentaView,
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Stock" />;
      },
    },
    {
      accessorKey: "estado",
      isNull: isVentaView,
      header: "Estado",
      cell: ({ row }) => {
        const estado = row.getValue("estado");

        return (
          <>
            {estado ? (
              <Badge>Activo</Badge>
            ) : (
              <Badge variant="destructive">Inactivo</Badge>
            )}
          </>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      isNull: isVentaView,
      cell: ({ row }) => {
        const producto = row.original;

        return <ProductOptions row={producto} />;
      },
    },
  ];

  if (isVentaView) {
    const ventaColumns = [
      {
        id: "cantidad",
        header: "Cantidad",
        accessorKey: "cantidad",
        cell: ({ row }) => {
          const [value, setValue] = useState(row.original.cantidad);
          const [currentValue, setCurrentValue] = useState(
            row.original.cantidad
          );
          const producto = row.original;

          useEffect(() => {
            const timerId = setTimeout(() => {
              if (value !== currentValue) {
                establecerCantidadProducto(form, producto.folio, value);
                setCurrentValue(value);
              }
            }, 500);

            return () => clearTimeout(timerId);
          }, [
            value,
            currentValue,
            producto.folio,
            establecerCantidadProducto,
            form,
          ]);

          const handleChange = (event) => {
            const newValue = parseInt(event.target.value);
            setValue(newValue);
          };

          return (
            <div className="flex justify-end w-full">
              <Input
              className="max-w-[90px] "
              type="number"
              value={value}
              onChange={handleChange}
            />
            </div>
            
          );
        },
      },
      {
        id: "total",
        label: "Total",
        header: "Total",
        cell: ({ row }) => {
          const precio = new Decimal(row.original.precio_venta);
          const cantidad = new Decimal(row.original.cantidad) || 1;
          return (
            <span className="font-semibold">
              {currencyFormat(precio.times(cantidad).toNumber())}
            </span>
          );
        },
        footer: ({ info }) =>
          isVentaView ? (
            <div>
              Subtotal: <span>{currencyFormat(totalProductos)}</span>
            </div>
          ) : null,
      },
      {
        id: "cantidad-actions",
        cell: ({ row }) => {
          const producto = row.original;
          return (
            <div className="flex gap-2 w-full justify-end ">
              <Button
                onClick={() => decrementarCantidad(form, producto.folio)}
                type="button"
                size="icon"
              >
                <MinusIcon />
              </Button>
              <Button
                onClick={() => actualizarCantidad(form, producto.folio)}
                type="button"
                size="icon"
              >
                <PlusIcon />
              </Button>
              <Button
                variant="destructive"
                onClick={() => eliminarProducto(form, producto.folio)}
                type="button"
                size="icon"
              >
                <TrashIcon />
              </Button>
            </div>
          );
        },
      },
    ];

    columns.push(...ventaColumns);
  }

  return columns;
}

export const columnProductOptions = ({ categoriasData, marcasData }) => {
  const categoriasValues = obtenerValores(categoriasData, "nombre");
  const marcasValues = obtenerValores(marcasData, "marca");

  const categorias = facetedOption(categoriasValues);
  const marcas = facetedOption(marcasValues);

  const options = { categoria: categorias, marca: marcas };
  return options;
};
