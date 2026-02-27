import { ClientDataTable } from '@/components/common/client-data-table';
import { GenericAlertModal } from '@/components/extended-ui/GenericAlertModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDeleteTaskTypeMutation, useTaskTypesQuery } from '@/queries/useTaskTypeQuery';
import { TaskType } from '@/types/tasks';
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
import { type FC, useState } from 'react';
import { toast } from 'sonner';
import { TaskTypeModal } from './TaskTypeModal';
import { taskTypeTableColumns } from './taskTypeTableColumns';

interface TaskTypeSettingsProps {}

export const TaskTypeSettings: FC<TaskTypeSettingsProps> = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { projectId = '' } = useParams({ strict: false });
  const { mutateAsync: deleteTaskType } = useDeleteTaskTypeMutation(projectId);
  const { data, isLoading, isError } = useTaskTypesQuery(projectId);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);

  const table = useReactTable<TaskType>({
    state: {
      pagination,
      rowSelection,
      columnFilters,
    },
    getRowId: (row) => row.id,
    data: data?.data.taskTypes ?? [],
    columns: taskTypeTableColumns,
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
    await deleteTaskType(Object.keys(rowSelection));
    toast.success('Task type deleted successfully');
    setRowSelection({});
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <div id="task-type-settings" className="flex h-full w-full flex-col overflow-hidden p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-bold">Task Types</h1>
        <p className="text-muted-foreground text-sm">Manage the task types of your project.</p>
      </div>

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
            <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
              <PlusCircle className="size-4" />
              Create New Type
            </Button>
          </div>
        </div>
        <div className="rounded-md border">
          <ClientDataTable<TaskType> table={table} />
        </div>

        <GenericAlertModal
          title="Delete Task Type"
          description="Are you sure you want to delete this task type?"
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          isOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
        />

        <TaskTypeModal
          operation="create"
          isOpen={isCreateModalOpen}
          setIsOpen={setIsCreateModalOpen}
        />
      </div>
    </div>
  );
};
