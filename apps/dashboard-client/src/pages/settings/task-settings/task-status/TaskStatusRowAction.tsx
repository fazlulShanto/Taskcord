import { GenericAlertModal } from '@/components/extended-ui/GenericAlertModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteTaskStatusMutation } from '@/queries/useTaskStatusQuery';
import { TaskStatus } from '@/types/tasks';
import { EllipsisVertical, PenSquare, Trash } from 'lucide-react';
import { FC, useState } from 'react';
import { toast } from 'sonner';
import { TaskStatusModal } from './TaskStatusModal';

interface TaskStatusRowActionProps {
  data: TaskStatus;
}

export const TaskStatusRowAction: FC<TaskStatusRowActionProps> = ({ data }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const projectId = data.projectId;

  const { mutateAsync: deleteTaskStatus } = useDeleteTaskStatusMutation(projectId);

  const handleDelete = async () => {
    await deleteTaskStatus([data.id]);
    toast.success('Status deleted successfully');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setIsEditModalOpen(true)} className="cursor-pointer">
            <PenSquare className="h-4 w-4" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDeleteModalOpen(true)}
            className="bg-destructive hover:!bg-destructive/90"
          >
            <Trash className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <GenericAlertModal
        title="Delete Status"
        description="Are you sure you want to delete this status?"
        onConfirm={handleDelete}
        onCancel={() => {}}
        confirmText="Delete"
        cancelText="Cancel"
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
      />
      <TaskStatusModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        operation="edit"
        taskStatusData={{
          ...data,
          backgroundColor: data.color.split(',')[0],
          foregroundColor: data.color.split(',')[1],
        }}
      />
    </>
  );
};
