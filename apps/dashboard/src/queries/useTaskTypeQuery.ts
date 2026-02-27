import { APIs } from '@/lib/api';
import { HttpClient } from '@/lib/httpClient';
import { TaskType } from '@/types/tasks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface CreateTaskTypePayload {
  name: string;
  description: string;
  order: number;
}

type TaskTypeResponse = {
  id: string;
  projectId: string;
  creatorId: string;
  name: string;
  description: string | null;
  order: number;
};

const mapTaskType = (taskType: TaskTypeResponse): TaskType => ({
  id: taskType.id,
  name: taskType.name,
  description: taskType.description ?? '',
  projectId: taskType.projectId,
  creatorId: taskType.creatorId,
  order: taskType.order,
});

export const useCreateTaskTypeMutation = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskType: CreateTaskTypePayload) =>
      HttpClient.post(APIs.taskType.createTaskType(projectId), taskType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskTypes', projectId] });
    },
  });
};

export const useUpdateTaskTypeMutation = (projectId: string, taskTypeId: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskType: CreateTaskTypePayload) =>
      HttpClient.put(APIs.taskType.updateTaskType(projectId, taskTypeId ?? ''), taskType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskTypes', projectId] });
    },
  });
};

export const useDeleteTaskTypeMutation = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskTypeIds: string[]) =>
      HttpClient.delete(APIs.taskType.deleteTaskTypesBulk(projectId), {
        data: {
          ids: taskTypeIds,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskTypes', projectId] });
    },
  });
};

export const useTaskTypesQuery = (projectId: string) => {
  return useQuery({
    queryKey: ['taskTypes', projectId],
    queryFn: async () => {
      const response = await HttpClient.get<{ taskTypes: TaskTypeResponse[] }>(
        APIs.taskType.getAllTaskTypes(projectId)
      );
      const taskTypes = (response.data.taskTypes ?? []).map(mapTaskType);

      return { data: { taskTypes } };
    },
    enabled: !!projectId,
  });
};
