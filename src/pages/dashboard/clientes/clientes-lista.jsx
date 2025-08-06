import React from "react";

import { DataTable } from "../../../components/dashboard/data-table/data-table";
import { clientesColumns } from "../../../components/dashboard/clientes/clientes-columns";

export const ClientesLista = () => {
  return (
    <section className="p-5 rounded shadow border space-y-4">
      <div>
        <h1 className="font-semibold text-lg">Lista de clientes</h1>
        <p className="text-sm text-muted-foreground">
          Administra la información de los clientes de la tienda
        </p>
      </div>
      <DataTable columns={clientesColumns} data={[]} />
    </section>
  );
};
