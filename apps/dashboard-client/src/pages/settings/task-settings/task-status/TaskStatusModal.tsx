import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import {
  useCreateTaskStatusMutation,
  useUpdateTaskStatusMutation,
} from '@/queries/useTaskStatusQuery';
import { useParams } from '@tanstack/react-router';
import { toast } from 'sonner';
import { TaskStatusForm, TaskStatusFormData } from './TaskStatusForm';
interface TaskStatusModalProps {
  operation?: 'create' | 'edit';
  taskStatusData?: TaskStatusFormData & { id: string };
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TaskStatusModal = ({
  operation = 'create',
  taskStatusData,
  isOpen,
  setIsOpen,
}: TaskStatusModalProps) => {
  const { projectId = '' } = useParams({ strict: false });
  const { mutate: createTaskStatus } = useCreateTaskStatusMutation(projectId);
  const { mutate: updateTaskStatus } = useUpdateTaskStatusMutation(projectId, taskStatusData?.id);
  const onSubmit = (data: TaskStatusFormData) => {
    createTaskStatus({
      name: data.name,
      color: `${data.backgroundColor},${data.foregroundColor}`,
      description: data.description ?? '',
      order: data.order ?? Math.floor(Math.random() * 100),
    });
    toast.success('Status created successfully');
    setIsOpen(false);
  };

  const onEdit = (data: TaskStatusFormData) => {
    updateTaskStatus({
      name: data.name,
      color: `${data.backgroundColor},${data.foregroundColor}`,
      description: data.description ?? '',
      order: data.order,
    });
    toast.success('Status updated successfully');
    setIsOpen(false);
  };

  const onCancel = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="gap-1 p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader className="border-b border-border p-4">
          <DialogTitle className="text-center text-xl font-semibold">
            {operation === 'create' ? 'Create new status' : 'Edit status'}
          </DialogTitle>
        </DialogHeader>

        <div className="p-4">
          {operation === 'create' ? (
            <TaskStatusForm onSubmit={onSubmit} onCancel={onCancel} />
          ) : (
            <TaskStatusForm statusFormData={taskStatusData} onSubmit={onEdit} onCancel={onCancel} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
