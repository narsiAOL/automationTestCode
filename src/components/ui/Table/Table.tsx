import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type Row,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

// Generic table data interface
export interface TableRowData {
  id: string | number;
  [key: string]: any;
}

// Table props interface with TanStack Table integration
export interface TableProps<T extends TableRowData = TableRowData> {
  data: T[];
  columns: ColumnDef<T>[];
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
  showRowNumbers?: boolean;
  onRowClick?: (record: T, index: number) => void;
  // TanStack Table options
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enableColumnResizing?: boolean;
  // Height control
  maxHeight?: number;
  // External sort state (API-driven sorting)
  onColumnSort?: (field: string, order: "asc" | "desc") => void;
  currentSortField?: string;
  currentSortOrder?: "asc" | "desc";
  sortableFields?: string[];
}

const SortIcon = ({
  field,
  currentSortField,
  currentSortOrder,
}: {
  field: string;
  currentSortField?: string;
  currentSortOrder?: "asc" | "desc";
}) => {
  const isActive = field === currentSortField;
  const isAsc = isActive && currentSortOrder === "asc";
  const isDesc = isActive && currentSortOrder === "desc";
  return (
    <svg
      width="10"
      height="14"
      viewBox="0 0 10 14"
      fill="none"
      className="ml-1.5 shrink-0"
    >
      <path
        d="M5 1L9 6H1L5 1Z"
        fill={isAsc ? "#F5DEB3" : "rgba(255,255,255,0.35)"}
      />
      <path
        d="M5 13L1 8H9L5 13Z"
        fill={isDesc ? "#F5DEB3" : "rgba(255,255,255,0.35)"}
      />
    </svg>
  );
};

export default function Table<T extends TableRowData = TableRowData>({
  data,
  columns,
  className = "",
  headerClassName = "",
  rowClassName = "",
  showRowNumbers = false,
  onRowClick,
  enableSorting = true,
  enableFiltering = false,
  enableColumnResizing = false,
  maxHeight = 600,
  onColumnSort,
  currentSortField,
  currentSortOrder,
  sortableFields = [],
}: TableProps<T>) {
  const { t } = useTranslation();

  // Add row number column if enabled
  const tableColumns = React.useMemo(() => {
    const cols: ColumnDef<T>[] = [...columns];

    if (showRowNumbers) {
      cols.unshift({
        id: "rowNumber",
        header: t("ui.table.SNo"),
        cell: ({ row }) => row.index + 1,
        size: 66,
        enableSorting: false,
        enableColumnFilter: false,
        enableResizing: false,
      });
    }

    return cols;
  }, [columns, showRowNumbers]);

  // Initialize TanStack Table
  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting,
    enableColumnFilters: enableFiltering,
    enableColumnResizing,
    columnResizeMode: "onChange",
  });

  // Calculate total table width based on column sizes
  const totalWidth = React.useMemo(() => {
    return tableColumns.reduce((total, col) => {
      if (col.id === "rowNumber") return total + 66;
      return total + (col.size || 280);
    }, 0);
  }, [tableColumns]);

  // Handle row click
  const handleRowClick = (row: Row<T>) => {
    if (onRowClick) {
      onRowClick(row.original, row.index);
    }
  };

  // Handle column header sort click
  const handleColumnSort = (accessorKey: string) => {
    if (!onColumnSort) return;
    if (accessorKey === currentSortField) {
      onColumnSort(accessorKey, currentSortOrder === "asc" ? "desc" : "asc");
    } else {
      onColumnSort(accessorKey, "asc");
    }
  };

  // Render cell content
  const renderCellContent = (cell: any) => {
    // Always use flexRender for custom cell renderers
    if (typeof cell.column.columnDef.cell === "function") {
      return flexRender(cell.column.columnDef.cell, cell.getContext());
    }
    const value = cell.getValue();
    if (value === null || value === undefined || value === "") {
      return "-";
    }
    return value;
  };

  return (
    <div
      className={`relative w-fit ${className} pl-1`}
      style={{
        maxHeight: `${maxHeight + 48}px`, // Add header height (48px) to maxHeight
      }}
    >
      {/* <div className="absolute -left-10 top-0 z-20 h-12">
        <TableHeaderLeftDesign />
      </div>
      <div className="absolute -right-9 top-0 z-20 h-12">
        <TableHeaderRightDesign />
      </div> */}
      {/* Table Container with calculated width based on columns */}
      {/* <div className="absolute inset-0 z-0 pointer-events-none">
        <TableBg />
      </div> */}

      {/* Horizontal and Vertical Scroll Container */}
      <div
        className="overflow-auto custom-scrollbar relative z-1 "
        style={{
          maxHeight: `${maxHeight + 48}px`, // Include header height in scroll container
          borderRadius: "8px",
        }}
      >
        <div className="relative w-full" style={{ width: `${totalWidth}px` }}>
          {/* Table Content Container */}
          <div className="relative z-10" style={{ width: `${totalWidth}px` }}>
            {/* Table Header with Sticky Positioning */}
            <div className="sticky top-0 z-20 h-12">
              {/* Header Background Extension */}
              <div
                className="absolute inset-0 w-full bg-[#3D2B1F]"
                style={{ minWidth: `calc(${totalWidth}px + 2px )` }}
              />
              {/* Table Header */}
              <div
                className={`relative z-10 h-full flex items-center w-full ${headerClassName}`}
                style={{
                  minWidth: `${totalWidth}px`,
                  backgroundColor: "#2C1810", // dark brown from screenshot
                }}
              >
                {table.getHeaderGroups().map((headerGroup) =>
                  headerGroup.headers.map((header, index) => {
                    const accessorKey = (header.column.columnDef as any)
                      .accessorKey as string | undefined;
                    const isSortable =
                      !!accessorKey && sortableFields.includes(accessorKey);
                    return (
                      <React.Fragment key={header.id}>
                        {index > 0 && (
                          <div className="bg-border-table h-full w-px shrink-0" />
                        )}
                        <div
                          className={`flex items-center h-full text-table-header shrink-0 justify-start ${
                            index === 0 ? "px-6 pl-6" : "px-6"
                          } ${isSortable ? "cursor-pointer select-none" : ""}`}
                          style={{ width: `${header.getSize()}px` }}
                          onClick={
                            isSortable && accessorKey
                              ? () => handleColumnSort(accessorKey)
                              : undefined
                          }
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                          {isSortable && accessorKey && (
                            <SortIcon
                              field={accessorKey}
                              currentSortField={currentSortField}
                              currentSortOrder={currentSortOrder}
                            />
                          )}
                        </div>
                      </React.Fragment>
                    );
                  }),
                )}
              </div>
            </div>

            {/* Table Body */}
            <div className="relative" style={{ backgroundColor: "#FBF7F3" }}>
              {table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  {/* Table Row */}
                  <div
                    className={`flex items-stretch cursor-pointer transition-colors hover:bg-primary-100/10 ${rowClassName}`}
                    onClick={() => handleRowClick(row)}
                    style={{ minHeight: "72px" }}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => (
                      <React.Fragment key={cell.id}>
                        {cellIndex > 0 && (
                          <div
                            className="bg-border-table self-stretch shrink-0"
                            style={{ width: "1.2px" }}
                          />
                        )}
                        <div
                          className={`flex items-center shrink-0 justify-start ${
                            cellIndex === 0 ? "px-3 pl-6" : "px-3"
                          }`}
                          style={{
                            width: `${cell.column.getSize()}px`,
                            minHeight: "72px",
                          }}
                        >
                          {cell.column.id === "rowNumber" ? (
                            <div className="flex items-center justify-center w-full h-full">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </div>
                          ) : (
                            renderCellContent(cell)
                          )}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Row Bottom Border */}
                  <div
                    className="bg-border-table w-full"
                    style={{ height: "1.6px" }}
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Re-export TanStack Table types for convenience
export type { ColumnDef, Row } from "@tanstack/react-table";
