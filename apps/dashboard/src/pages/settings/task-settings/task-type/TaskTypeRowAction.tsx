import { GenericAlertModal } from '@/components/extended-ui/GenericAlertModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteTaskTypeMutation } from '@/queries/useTaskTypeQuery';
import { TaskType } from '@/types/tasks';
import { EllipsisVertical, PenSquare, Trash } from 'lucide-react';
import { type FC, useState } from 'react';
import { toast } from 'sonner';
import { TaskTypeModal } from './TaskTypeModal';

interface TaskTypeRowActionProps {
  data: TaskType;
}

export const TaskTypeRowAction: FC<TaskTypeRowActionProps> = ({ data }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const projectId = data.projectId;

  const { mutateAsync: deleteTaskType } = useDeleteTaskTypeMutation(projectId);

  const handleDelete = async () => {
    await deleteTaskType([data.id]);
    toast.success('Task type deleted successfully');
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
            className="bg-destructive hover:bg-destructive/90!"
          >
            <Trash className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <GenericAlertModal
        title="Delete Task Type"
        description="Are you sure you want to delete this task type?"
        onConfirm={handleDelete}
        onCancel={() => {}}
        confirmText="Delete"
        cancelText="Cancel"
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
      />
      <TaskTypeModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        operation="edit"
        taskTypeData={{
          ...data,
        }}
      />
    </>
  );
};
