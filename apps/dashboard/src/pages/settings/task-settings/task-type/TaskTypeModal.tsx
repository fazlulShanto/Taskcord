import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCreateTaskTypeMutation, useUpdateTaskTypeMutation } from '@/queries/useTaskTypeQuery';
import { useParams } from '@tanstack/react-router';
import { toast } from 'sonner';
import { TaskTypeForm, TaskTypeFormData } from './TaskTypeForm';

interface TaskTypeModalProps {
  operation?: 'create' | 'edit';
  taskTypeData?: TaskTypeFormData & { id: string };
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TaskTypeModal = ({
  operation = 'create',
  taskTypeData,
  isOpen,
  setIsOpen,
}: TaskTypeModalProps) => {
  const { projectId = '' } = useParams({ strict: false });
  const { mutate: createTaskType } = useCreateTaskTypeMutation(projectId);
  const { mutate: updateTaskType } = useUpdateTaskTypeMutation(projectId, taskTypeData?.id);

  const onSubmit = (data: TaskTypeFormData) => {
    createTaskType({
      name: data.name,
      description: data.description ?? '',
      order: data.order ?? Math.floor(Math.random() * 100),
    });
    toast.success('Task type created successfully');
    setIsOpen(false);
  };

  const onEdit = (data: TaskTypeFormData) => {
    updateTaskType({
      name: data.name,
      description: data.description ?? '',
      order: data.order,
    });
    toast.success('Task type updated successfully');
    setIsOpen(false);
  };

  const onCancel = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="gap-1 p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader className="border-border border-b p-4">
          <DialogTitle className="text-center text-xl font-semibold">
            {operation === 'create' ? 'Create new task type' : 'Edit task type'}
          </DialogTitle>
        </DialogHeader>

        <div className="p-4">
          {operation === 'create' ? (
            <TaskTypeForm onSubmit={onSubmit} onCancel={onCancel} />
          ) : (
            <TaskTypeForm taskTypeFormData={taskTypeData} onSubmit={onEdit} onCancel={onCancel} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
