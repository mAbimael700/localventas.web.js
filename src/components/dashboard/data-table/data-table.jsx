import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { Search } from "../../search-input";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTableViewOptions } from "./data-table-columns-toggle";
import { cn } from "../../../lib/utils";

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

export const DataTable = ({
  data,
  columns,
  columnsOptions,
  hasFooter,
  children,
  className,
}) => {
  if (!data) {
    data = [];
  }

  const [sorting, setSorting] = useState([]);

  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({ itemRank });
    return itemRank.passed;
  };

  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    state: {
      globalFilter,
      sorting,
      columnFilters,
      columnVisibility,
    },
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  table.getAllFlatColumns();

  const DataTableElement = (
    <div className={cn("flex flex-col justify-between gap-4", className)}>

      <div className="">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <DataTableToolbar
              table={table}
              columns={columns}
              columnOptions={columnsOptions}
              setGlobalFilter={setGlobalFilter}
            />
            <Separator orientation="vertical" className="h-6" />

            {children}
          </div>

          <DataTableViewOptions table={table} />
        </div>

        <ScrollArea>
          <div className="w-full ">
            <Table className="">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="hidden md:table-row lg:table-row"
                  >
                    {headerGroup.headers.map(
                      (header) =>
                        !header.column.columnDef.isNull && (
                          <TableHead key={"header-" + header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        )
                    )}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      className="block md:table-row  lg:table-row"
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map(
                        (cell) =>
                          !cell.column.columnDef.isNull && (
                            <TableCell
                              key={cell.id}
                              data-title={
                                cell.column.columnDef.label ||
                                cell.column.columnDef.accessorKey
                              }
                              className="text-right p-3 lg:text-left block  md:table-cell lg:table-cell before:p-1 before:mr-3  before:float-left before:content-[attr(data-title)''] before:capitalize before:font-semibold lg:before:content-none md:before:content-none"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          )
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-[48vh] text-center text-muted-foreground"
                    >
                      No hay resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>

              {hasFooter && (
                <TableFooter>
                  {table.getFooterGroups().map((footerGroup) => {
                    let colSpanCount = 0;
                    return (
                      <TableRow
                        key={footerGroup.id}
                        className="block md:table-row lg:table-row"
                      >
                        {footerGroup.headers.map((header) => {
                          if (!header.column.columnDef.isNull) {
                            colSpanCount++;
                            return (
                              <TableHead key={header.id}>
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.footer,
                                      header.getContext()
                                    )}
                              </TableHead>
                            );
                          } else {
                            return null;
                          }
                        })}
                      </TableRow>
                    );
                  })}
                </TableFooter>
              )}
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <DataTablePagination className="w-full" table={table} />
    </div>
  );

  return (
    <div className="space-y-5">
      {data ? (
        DataTableElement
      ) : (
        <>
          <h1>No has realizado registros en este catálogo...</h1>
        </>
      )}
    </div>
  );
};

DataTable.Navigation = function DataTableNavigation({ children }) {
  return <div className="flex gap-2 items-center">{children}</div>;
};

DataTable.NavigationItem = function DataTableNavigationItem({
  children,
  ...props
}) {
  return (
    <Button className="h-8 shadow-sm" {...props}>
      {children}
    </Button>
  );
};
