import { Cross2Icon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { DataTableViewOptions } from "./data-table-columns-toggle";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import React, { useEffect, useState } from "react";
import { Search } from "../../search-input";

export const DebouncedSearch = ({ value: keyWord, onChange, ...props }) => {
  const [value, setValue] = useState(keyWord);

  useEffect(() => {
    const timeOut = setTimeout(() => onChange(value), 350);

    return () => clearTimeout(timeOut);
  }, [value]);

  return (
    <Search
      className="h-8"
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

const FilterableTable = ({ columns, table, columnOptions }) => {
  return (
    <div className="space-x-2">
      {columnOptions ? (
        columns.map((column, i) => (
          <React.Fragment key={`column-${i}`}>
            {column.showFilter && (
              <DataTableFacetedFilter
                key={column.accessorKey}
                column={table.getColumn(column.accessorKey)}
                title={column.accessorKey}
                options={columnOptions[column.accessorKey] || []}
                table={table}
              />
            )}
          </React.Fragment>
        ))
      ) : (
        <>Loading...</>
      )}
    </div>
  );
};

export function DataTableToolbar({
  table,
  columns,
  columnOptions,
  setGlobalFilter,
}) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between space-x-2 ">
      <div className="flex items-center space-x-2">
        <DebouncedSearch
          size="sm"
          value={table.globalFilter ?? ""}
          placeholder={"Buscar..."}
          onChange={(value) => setGlobalFilter(String(value))}
        />

        {columnOptions && (
          <FilterableTable
            table={table}
            columns={columns}
            columnOptions={columnOptions}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
        
      </div>

      
    </div>
  );
}
