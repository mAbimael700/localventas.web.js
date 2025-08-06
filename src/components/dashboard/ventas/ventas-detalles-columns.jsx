import { Checkbox } from "@/components/ui/checkbox";
import { rowCurrencyFormat } from "../data-table/data-table-currency-format";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/Badge";
import { currencyFormat } from "../../commerce/productos/producto-card";

export function ventasDetallesColumns(totalProductos = 0) {
  let columns = [
    {
      accessorKey: "cve_venta",
      isNull: true,
    },
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
      header: "Folio",
      isNull: true,
    },
    {
      isNull: true,
      accessorKey: "principal_photo",
      header: "",
      enableHiding: false,
      cell: ({ row }) => {
        const img = row.getValue("principal_photo");
        const id = row.getValue("folio");
        const nombre = row.getValue("producto");

        return (
          <picture className="m-[0] min-w-[100px] w-[100px] flex items-center justify-center  aspect-square  rounded-sm bg-muted border">
            {img ? (
              <LazyLoadImage
                effect="opacity"
                className="max-h-[90px] w-auto"
                src={img}
                alt={nombre}
              />
            ) : (
              <QuestionMarkCircledIcon className="h-14 w-24 text-muted-foreground" />
            )}
          </picture>
        );
      },
    },
    {
      accessorKey: "producto",
      header: "Producto",

      cell: ({ row }) => {
        const producto = row.getValue("producto");
        const folio = row.getValue("folio");
        const marca = row.getValue("marca");
        const categoria = row.getValue("categoria");
        const img = row.getValue("principal_photo");

        return (
          <div className="flex justify-end lg:justify-start md:justify-start items-center gap-7 px-2 min-w-[150px]">
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
                  src={img}
                  alt={producto}
                />
              ) : (
                <QuestionMarkCircledIcon className="h-14 w-24 text-muted-foreground" />
              )}
            </picture>

            <div className="order-1 lg:order-2 md:order-2">
              <div className="font-normal text-xs text-muted-foreground w-44">
                #{folio}
              </div>
              <Label className="text-lg max-w-[220px]">{producto}</Label>

              <div className="space-y-1">
                <Badge className="rounded-sm mr-2">{marca}</Badge>

                <Badge variant="outline" className="rounded-sm">
                  {categoria}
                </Badge>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "marca",

      isNull: true,
    },
    {
      accessorKey: "categoria",

      isNull: true,
    },

    {
      accessorKey: "precio",
      header: "Precio por unidad",
      cell: ({ row }) => {
        return <span>{rowCurrencyFormat(row, "precio")}</span>;
      },
    },
    { accessorKey: "cantidad", header: "Cantidad" },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => {
        return <span>{rowCurrencyFormat(row, "total")}</span>;
      },

      footer: ({ info }) => (
        <div>
          Subtotal: <span>{currencyFormat(totalProductos)}</span>
        </div>
      ),
    },
  ];

  return columns;
}
