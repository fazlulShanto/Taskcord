import { APIs } from '@/lib/api';
import { HttpClient } from '@/lib/httpClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type ProjectTask = {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  creatorId: string;
  status: string;
  priority: string;
  milestoneId: string | null;
  assignees: string[];
  dueDate: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type CreateTaskPayload = {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  milestoneId?: string;
  assignees?: string[];
  dueDate?: string;
};

export const useCreateTaskMutation = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) =>
      HttpClient.post(APIs.task.createTask(projectId), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
  });
};

export const useTasksQuery = (projectId: string) => {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      const response = await HttpClient.get<{ tasks: ProjectTask[] }>(
        APIs.task.getAllTasks(projectId)
      );
      return { data: { tasks: response.data.tasks ?? [] } };
    },
    enabled: !!projectId,
  });
};
