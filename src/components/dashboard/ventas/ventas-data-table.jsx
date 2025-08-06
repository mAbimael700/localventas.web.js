import { DataTable } from "../data-table/data-table";
import { ventasColumns } from "./ventas-columns";
import { VentasData } from "../../../utils/ventasData";

export const VentasDataTable = () => {
  return (
    <div>
      <DataTable columns={ventasColumns} />
    </div>
  );
};
