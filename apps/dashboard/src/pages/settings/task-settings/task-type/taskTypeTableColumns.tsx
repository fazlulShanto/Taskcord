import { Checkbox } from '@/components/ui/checkbox';
import { TaskType } from '@/types/tasks';
import { ColumnDef, SortingFn } from '@tanstack/react-table';
import { TaskTypeRowAction } from './TaskTypeRowAction';

const defaultValue = '---';

const sortTaskTypeFn: SortingFn<TaskType> = (rowA, rowB) => {
  const orderA = rowA.original.order;
  const orderB = rowB.original.order;
  return orderA - orderB;
};

export const taskTypeTableColumns: ColumnDef<TaskType>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        disabled={table.getRowCount() === 0}
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="h-4 w-4"
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
  },
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: false,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    enableSorting: false,
    cell: ({ row }) => {
      return <div>{row.original.description || defaultValue}</div>;
    },
  },
  {
    accessorKey: 'order',
    header: 'Order',
    enableSorting: true,
    sortingFn: sortTaskTypeFn,
  },
  {
    accessorKey: 'creatorId',
    header: 'Created By',
    enableSorting: false,
    cell: ({ row }) => {
      return <div>{row.original.creatorId.slice(0, 8)}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <TaskTypeRowAction data={row.original} />;
    },
    enableSorting: false,
  },
];
