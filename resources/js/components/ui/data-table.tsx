import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Link, router } from '@inertiajs/react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useState, useEffect } from 'react';
import { DataTableViewOptions } from './data-table-view-option';
import { DataTablePagination } from './data-table-pagination';
import { DataTableFilters } from './data-table-filters';
import { DataTableBulkActions } from './data-table-bulk-actions';

import Input from '@/components/elements/input';
import { Button } from '@/components/elements/button';
import { Search, X } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  create: string;
  filters?: Record<string, string | undefined>;
  resourceName?: string;
  highlightRowId?: number;
}

interface DataWithId {
  id: number;
  deleted_at?: string | null;
}

export function DataTable<TData extends DataWithId, TValue>({
  columns,
  data,
  create,
  filters = {},
  resourceName,
  highlightRowId,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState(filters.search || '');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  // Handle URL-based search and filters
  // useEffect(() => {
  //   const params = new URLSearchParams();
    
  //   if (globalFilter) {
  //     params.set('search', globalFilter);
  //   }
    
  //   Object.entries(filters).forEach(([key, value]) => {
  //     if (value && key !== 'search') {
  //       params.set(key, value);
  //     }
  //   });

  //   const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    
  //   // Debounce the URL update
  //   const timeoutId = setTimeout(() => {
  //     if (window.location.href !== window.location.origin + newUrl) {
  //       router.get(newUrl, {
  //        highlight: highlightRowId,
  //       }, { 
  //         preserveState: true, 
  //         preserveScroll: true,
  //         replace: true 
  //       });
  //     }
  //   }, 500);

  //   return () => clearTimeout(timeoutId);
  // }, [globalFilter, filters]);

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const hasSelection = selectedRows.length > 0;

  const clearSearch = () => {
    setGlobalFilter('');
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            {/* Multi-field Search */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${create}s...`}
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="pl-10 pr-10"
              />
              {globalFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={clearSearch}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            {/* Filters Component */}
            <DataTableFilters 
              resourceName={resourceName || create} 
              filters={filters}
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Create Button */}
            <Link href={route(`${create}s.create`)} prefetch>
              <Button variant="outline" className="cursor-pointer">
                <span className="flex items-center gap-2">
                  Create {create}
                  <span className="sr-only">Create {create}</span>
                </span>
              </Button>
            </Link>
            
            {/* View options visibility */}
            <DataTableViewOptions<TData> table={table} />
          </div>
        </div>

        {/* Bulk Actions */}
        {hasSelection && (
          <DataTableBulkActions<TData>
            selectedRows={selectedRows}
            resourceName={resourceName || create}
            onClearSelection={() => setRowSelection({})}
          />
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const isHighlighted = highlightRowId && 
                  row.original.id == highlightRowId;
                console.log(row.original.id, highlightRowId, isHighlighted );
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={isHighlighted ? 'bg-yellow-100 dark:bg-yellow-900/20' : ''}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-[30rem] text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <DataTablePagination<TData> table={table} />
    </div>
  );
}