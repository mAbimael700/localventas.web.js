import { DataTableColumnHeader } from "../data-table-columns-header";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { UserInfo } from "../../user/user-info";
import { ClientesOptions } from "./clientes-options";

export const clientesColumns = [
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
    accessorKey: "nombre",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Cliente" />;
    },
    cell: ({ row }) => {
      const cliente = row.getValue("cliente");
      const email = row.getValue("correo_electronico") || "another@example.com";

      return <UserInfo username={cliente} email={email} />;
    },
  },

  {
    accessorKey: "correo_electronico",
    isNull: true,
  },

  { accessorKey: "genero", header: "Género" },
  { accessorKey: "telefono", header: "Teléfono" },
  {
    accessorKey: "activo",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.getValue("activo");

      let badgeLabel = "Activo";
      let badgeVariant = "default";

      if (!estado) {
        badgeLabel = "No activo";
        badgeVariant = "destructive";
      }

      return (
        <div className="min-w-[100px]">
          <Badge variant={badgeVariant}>{badgeLabel}</Badge>
        </div>
      );
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return <ClientesOptions row={payment} />;
    },
  },
];
