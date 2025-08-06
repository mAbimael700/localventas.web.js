import { DataTable } from "../data-table/data-table";
import { ventasColumns } from "./ventas-columns";

export const VentasDataTable = () => {
  return (
    <div>
      <DataTable columns={ventasColumns} />
    </div>
  );
};
