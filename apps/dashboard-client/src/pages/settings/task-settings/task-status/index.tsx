import { ClientDataTable } from '@/components/common/client-data-table';
import { GenericAlertModal } from '@/components/extended-ui/GenericAlertModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDeleteTaskStatusMutation, useTaskStatusesQuery } from '@/queries/useTaskStatusQuery';
import { TaskStatus } from '@/types/tasks';
import { useParams } from '@tanstack/react-router';
import {
  ColumnFilter,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { PlusCircle, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';
import { toast } from 'sonner';
import { TaskStatusModal } from './TaskStatusModal';
import { taskStatusTableColumns } from './taskStatusTableColumns';

interface TaskStatusSettingsProps {}

export const TaskStatusSettings: FC<TaskStatusSettingsProps> = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { projectId = '' } = useParams({ strict: false });
  const { mutateAsync: deleteTaskStatus } = useDeleteTaskStatusMutation(projectId);
  const { data, isLoading, isError } = useTaskStatusesQuery(projectId);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);

  const table = useReactTable<TaskStatus>({
    state: {
      pagination,
      rowSelection,
      columnFilters,
    },
    getRowId: (row) => row.id,
    data: data?.data.statuses ?? [],
    columns: taskStatusTableColumns,
    enableMultiRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
  });

  const handleDelete = async () => {
    await deleteTaskStatus(Object.keys(rowSelection));
    toast.success('Status deleted successfully');
    setRowSelection({});
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <div id="task-status-settings" className="flex h-full w-full flex-col overflow-hidden p-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-bold">Task Status</h1>
        <p className="text-sm text-muted-foreground">Manage the statuses of your tasks.</p>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4">
        <div className="mt-4 flex items-center justify-between">
          <Input
            placeholder="Search"
            className="h-7 min-h-7 w-full max-w-xs"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setColumnFilters([{ id: 'name', value: e.target.value }]);
            }}
          />
          <div className="flex items-center gap-2">
            {Object.keys(rowSelection).length > 0 && (
              <Button
                onClick={() => setIsDeleteModalOpen(true)}
                variant="destructive"
                size="sm"
                className="h-7 min-h-7"
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            )}
            <Button size="xs" onClick={() => setIsCreateModalOpen(true)}>
              <PlusCircle className="size-4" />
              Create New Status
            </Button>
          </div>
        </div>
        <div className="rounded-md border">
          <ClientDataTable<TaskStatus> table={table} />
        </div>
        <GenericAlertModal
          title="Delete Status"
          description="Are you sure you want to delete this status?"
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          isOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
        />
        <TaskStatusModal
          operation="create"
          isOpen={isCreateModalOpen}
          setIsOpen={setIsCreateModalOpen}
        />
      </div>
    </div>
  );
};
