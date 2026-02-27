import { APIs } from '@/lib/api';
import { HttpClient } from '@/lib/httpClient';
import { Label } from '@/types/label';
import { TaskStatus } from '@/types/tasks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface CreateTaskStatusPayload {
  name: string;
  color: string;
  description: string;
  order: number;
}

const mapLabelToStatus = (label: Label): TaskStatus => ({
  id: label.id,
  name: label.label,
  color: label.color,
  description: label.description ?? '',
  projectId: label.projectId,
  creatorId: label.creatorId,
  order: label.order,
});

export const useCreateTaskStatusMutation = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskStatus: CreateTaskStatusPayload) =>
      HttpClient.post(APIs.label.createLabel(projectId), {
        label: taskStatus.name,
        color: taskStatus.color,
        description: taskStatus.description,
        order: taskStatus.order,
        isStatus: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskStatuses', projectId] });
    },
  });
};

export const useUpdateTaskStatusMutation = (
  projectId: string,
  taskStatusId: string | undefined
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskStatus: CreateTaskStatusPayload) =>
      HttpClient.put(APIs.label.updateLabel(projectId, taskStatusId ?? ''), {
        label: taskStatus.name,
        color: taskStatus.color,
        description: taskStatus.description,
        order: taskStatus.order,
        isStatus: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskStatuses', projectId] });
    },
  });
};

export const useDeleteTaskStatusMutation = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskStatusIds: string[]) =>
      HttpClient.delete(APIs.label.deleteLabelsBulk(projectId), {
        data: {
          ids: taskStatusIds,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskStatuses', projectId] });
    },
  });
};

export const useTaskStatusesQuery = (projectId: string) => {
  return useQuery({
    queryKey: ['taskStatuses', projectId],
    queryFn: async () => {
      const response = await HttpClient.get<{ taskLabels: Label[] }>(
        APIs.label.getAllLabels(projectId)
      );
      const statuses = (response.data.taskLabels ?? [])
        .filter((label) => label.isStatus)
        .map(mapLabelToStatus);

      return { data: { statuses } };
    },
    enabled: !!projectId,
  });
};
