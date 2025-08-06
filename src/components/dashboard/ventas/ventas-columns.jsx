import { DataTableColumnHeader } from "../data-table-columns-header";
import { Link, useParams } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { UserInfo } from "../../user/user-info";
import { buttonVariants } from "@/components/ui/button";
import format from "date-fns/format";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { es } from "date-fns/locale";
import { VentasOptions } from "./ventas-options";
import { rowCurrencyFormat } from "../data-table/data-table-currency-format";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  EnterIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";

export const VentaLinkButton = ({ folio }) => {
  const { tienda } = useParams();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            className={buttonVariants({ variant: "ghost", size: "sm" })}
            to={`/dashboard/${tienda}/ventas/${folio}`}
          >
            <EnterIcon className="mr-2" />
            {folio}
          </Link>
        </TooltipTrigger>

        <TooltipContent>
          <p>Detalles de venta</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const ventasColumns = [
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
    cell: ({ row }) => {
      const folio = row.getValue("folio");

      return <VentaLinkButton folio={folio} />;
    },
  },
  { accessorKey: "descripcion", header: "Concepto" },
  {
    accessorKey: "cliente",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Cliente" />;
    },
    cell: ({ row }) => {
      const cliente = row.getValue("cliente");

      return cliente ? (
        <UserInfo
          username={cliente.nombre}
          email={cliente.correo_electronico}
        />
      ) : (
        <div className="gap-2 items-center flex text-muted-foreground">
          <QuestionMarkCircledIcon />
          Sin registrar
        </div>
      );
    },
  },

  {
    accessorKey: "vendedor",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Vendedor" />;
    },
    cell: ({ row }) => {
      const vendedor = row.getValue("vendedor");

      return (
        <UserInfo
          username={vendedor.nombre}
          email={vendedor.correo_electronico}
        />
      );
    },
  },

  {
    accessorKey: "fecha_venta",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Fecha" />;
    },
    cell: ({ row }) => {
      const fecha = new Date(row.getValue("fecha_venta"));
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
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.getValue("estado");

      return (
        <span className="flex items-center gap-2">
          {estado ? (
            <>
              <CheckCircledIcon className="text-green-300" /> Pagado{" "}
            </>
          ) : (
            <>
              <CrossCircledIcon className="text-destructive" /> No pagado
            </>
          )}
        </span>
      );
    },
    showFilter: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "subtotal",
    header: "Subtotal",
    cell: ({ row }) => {
      return rowCurrencyFormat(row, "subtotal");
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      return rowCurrencyFormat(row, "total");
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return <VentasOptions row={payment} />;
    },
  },
];
