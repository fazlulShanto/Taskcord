import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon, InboxIcon } from '@heroicons/react/24/outline';
import { flexRender, Table } from '@tanstack/react-table';
import { ArrowUpDownIcon } from 'lucide-react';
import { DataTablePagination } from './pagination';

interface ClientDataTableProps<TData> {
  table: Table<TData>;
}

const NoDataTableView = () => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
        <InboxIcon className="h-8 w-8 text-muted-foreground/60" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">No data available</h3>
      <p className="max-w-sm text-center text-sm text-muted-foreground">
        There are no items to display at the moment. <br /> Create a new item to get started or
        adjust your filters.
      </p>
    </div>
  );
};

export const ClientDataTable = <TData,>({ table }: ClientDataTableProps<TData>) => {
  return (
    <>
      <TableComponent>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="px-3"
                    onClick={() => {
                      if (header.column.getCanSort()) {
                        header.column.toggleSorting();
                      }
                    }}
                  >
                    <div className="flex items-center gap-0.5">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() &&
                        ({
                          asc: <ArrowUpIcon className="size-4" />,
                          desc: <ArrowDownIcon className="size-4" />,
                        }[header.column.getIsSorted() as string] || (
                          <ArrowUpDownIcon className="size-4" />
                        ))}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="p-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={table.getTotalSize()} className="h-24 text-center">
                <NoDataTableView />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableComponent>
      <div
        className={cn(
          table.getRowModel().rows?.length ? 'flex w-full items-center border-t p-2' : ''
        )}
      >
        <DataTablePagination table={table} />
      </div>
    </>
  );
};

export default ClientDataTable;
