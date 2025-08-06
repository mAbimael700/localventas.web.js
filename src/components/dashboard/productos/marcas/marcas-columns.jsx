import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "../../data-table-columns-header";

import { UserInfo } from "../../../user/user-info";

import React from "react";
import { MarcaActions } from "./marca-actions";

export const marcasColumns = ({}) => {
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
    { accessorKey: "id", isNull: true },
    {
      accessorKey: "marca",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title="Marca"
          ></DataTableColumnHeader>
        );
      },
    },
    { accessorKey: "codigo", header: "Código" },
    {
      accessorKey: "distribuidor",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title="Distribuidor"
          ></DataTableColumnHeader>
        );
      },
      cell: ({ row }) => {
        const distribuidor = row.getValue("distribuidor");

        return distribuidor ? (
          <UserInfo
            username={distribuidor.nombre}
            email={distribuidor.correo_electronico}
          />
        ) : (
          <span className="text-muted-foreground flex items-center gap-2">
            <QuestionMarkCircledIcon /> No asignado
          </span>
        );
      },
    },
    {
      accessorKey: "estado",
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
      cell: ({ row }) => {
        return <MarcaActions row={row} />;
      },
    },
  ];
  return columns;
};
