import { APIs } from '@/lib/api';
import { HttpClient } from '@/lib/httpClient';
import { TaskStatus } from '@/types/tasks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface CreateTaskStatusPayload {
  name: string;
  color: string;
  description: string;
  order: number;
}

export const useCreateTaskStatusMutation = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskStatus: CreateTaskStatusPayload) =>
      HttpClient.post(APIs.taskStatus.createTaskStatus(projectId), taskStatus),
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
      HttpClient.put(APIs.taskStatus.updateTaskStatus(projectId, taskStatusId ?? ''), taskStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskStatuses', projectId] });
    },
  });
};

export const useDeleteTaskStatusMutation = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskStatusIds: string[]) =>
      HttpClient.delete(APIs.taskStatus.deleteTaskStatus(projectId), {
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
    queryFn: () =>
      HttpClient.get<{ statuses: TaskStatus[] }>(APIs.taskStatus.getAllTaskStatuses(projectId)),
    enabled: !!projectId,
  });
};
