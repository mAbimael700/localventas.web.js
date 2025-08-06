import { DataTableColumnHeader } from "../data-table-columns-header";
import { UserInfo } from "../../user/user-info";
import { Checkbox } from "@/components/ui/checkbox";
import format from "date-fns/format";
import es from "date-fns/locale/es";
import { CellProducts } from "../productos/productos-columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { rowCurrencyFormat } from "../data-table/data-table-currency-format";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { VentaLinkButton } from "../ventas/ventas-columns";
import { ArrowLeftRightIcon, CreditCardIcon, Wallet2 } from "lucide-react";

export function pagosColumns({ isIndividual = false }) {
  const columns = [
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
      accessorKey: "folio_venta",
      cell: ({ row }) => (
        <VentaLinkButton folio={row.getValue("folio_venta")} />
      ),
      header: "Venta",
      isNull: isIndividual,
    },

    {
      accessorKey: "folio_pago",
      header: "Folio",
    },
    {
      accessorKey: "metodo_pago",
      header: "Método de pago",
      cell: ({ row }) => {
        const metodo_pago = row.getValue("metodo_pago");
        return (
          <span className="items-center flex gap-2">
            {metodo_pago === "Efectivo" ? (
              <Wallet2 className="h-5 w-5 text-muted-foreground" />
            ) : metodo_pago === "Transferencia" ? (
              <ArrowLeftRightIcon className="h-5 w-5 text-muted-foreground" />
            ) : (
              <CreditCardIcon className="h-5 w-5 text-muted-foreground" />
            )}

            {metodo_pago}
          </span>
        );
      },
    },

    {
      accessorKey: "monto",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title="Monto"
          ></DataTableColumnHeader>
        );
      },
      cell: ({ row }) => {
        return rowCurrencyFormat(row, "monto");
      },
    },
    {
      accessorKey: "fecha",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Fecha" />;
      },
      cell: ({ row }) => {
        const fecha = new Date(row.getValue("fecha"));
        if (fecha !== undefined) {
          return (
            <div className=" min-w-[100px]">
              {format(fecha, "PPpp", { locale: es })}
            </div>
          );
        }
      },
    },

    {
      accessorKey: "vendedor_registro",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Vendedor" />;
      },
      cell: ({ row }) => {
        const vendedor = row.getValue("vendedor_registro");
        return <UserInfo username={vendedor.nombre} email={vendedor.correo_electronico} />;
      },
    },


    {
      accessorKey: "cliente",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Cliente" />;
      },
      cell: ({ row }) => {
        const cliente = row.getValue("cliente");
        return <UserInfo username={cliente}  />;
      },
    },

  
    //{ accessorKey: "estado", header: "Estado" },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const marca = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Opciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Editar</DropdownMenuItem>
              <DropdownMenuItem>Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      isNull: isIndividual,
    },
  ];

  return columns;
}
