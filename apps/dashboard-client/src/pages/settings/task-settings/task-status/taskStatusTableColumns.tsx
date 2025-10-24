import { ColumnDef, SortingFn } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';
import { TaskStatus } from '@/types/tasks';
import { TaskStatusFormPreview } from './TaskStatusForm';
import { TaskStatusRowAction } from './TaskStatusRowAction';
const defaultValue = '---';

const sortStatusFn: SortingFn<TaskStatus> = (rowA, rowB, _columnId) => {
  const statusA = rowA.original.order;
  const statusB = rowB.original.order;
  return statusA - statusB;
};

export const taskStatusTableColumns: ColumnDef<TaskStatus>[] = [
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
    cell: ({ row }) => {
      const [backgroundColor = '#000000', foregroundColor = '#ffffff'] =
        `${row.original.color}`.split(',');

      return (
        <div className="flex items-center gap-2">
          <TaskStatusFormPreview
            name={row.original.name}
            backgroundColor={backgroundColor}
            foregroundColor={foregroundColor}
          />
        </div>
      );
    },
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
    sortingFn: sortStatusFn,
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
      return <TaskStatusRowAction data={row.original} />;
    },
    enableSorting: false,
  },
];
