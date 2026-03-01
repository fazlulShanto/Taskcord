import { APIs } from '@/lib/api';
import { HttpClient } from '@/lib/httpClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type TaskComment = {
  id: string;
  taskId: string;
  userId: string;
  parentCommentId: string | null;
  content: string;
  attachments: unknown;
  createdAt: string | null;
  updatedAt: string | null;
};

export type CreateTaskCommentPayload = {
  content: string;
  parentCommentId?: string;
  attachments?: unknown;
};

export type UpdateTaskCommentPayload = {
  content?: string;
  attachments?: unknown;
};

const taskCommentsQueryKey = (projectId: string, taskId: string) => [
  'task-comments',
  projectId,
  taskId,
];

export const useTaskCommentsQuery = (projectId: string, taskId: string) => {
  return useQuery({
    queryKey: taskCommentsQueryKey(projectId, taskId),
    queryFn: async () => {
      const response = await HttpClient.get<{ comments: TaskComment[] }>(
        APIs.taskComment.getTaskComments(projectId, taskId)
      );
      return { data: { comments: response.data.comments ?? [] } };
    },
    enabled: !!projectId && !!taskId,
  });
};

export const useCreateTaskCommentMutation = (projectId: string, taskId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskCommentPayload) =>
      HttpClient.post(APIs.taskComment.createTaskComment(projectId, taskId), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskCommentsQueryKey(projectId, taskId) });
    },
  });
};

export const useUpdateTaskCommentMutation = (projectId: string, taskId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      payload,
    }: {
      commentId: string;
      payload: UpdateTaskCommentPayload;
    }) => HttpClient.put(APIs.taskComment.updateTaskComment(projectId, taskId, commentId), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskCommentsQueryKey(projectId, taskId) });
    },
  });
};

export const useDeleteTaskCommentMutation = (projectId: string, taskId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) =>
      HttpClient.delete(APIs.taskComment.deleteTaskComment(projectId, taskId, commentId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskCommentsQueryKey(projectId, taskId) });
    },
  });
};
