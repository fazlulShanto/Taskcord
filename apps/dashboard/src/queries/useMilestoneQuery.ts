import { APIs } from '@/lib/api';
import { HttpClient } from '@/lib/httpClient';
import { Milestone } from '@/types/tasks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface MilestonePayload {
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

type MilestoneResponse = {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

const mapMilestone = (milestone: MilestoneResponse): Milestone => ({
  id: milestone.id,
  projectId: milestone.projectId,
  title: milestone.title,
  description: milestone.description ?? '',
  startDate: milestone.startDate,
  endDate: milestone.endDate,
  status: milestone.status ?? 'pending',
  createdAt: milestone.createdAt,
  updatedAt: milestone.updatedAt,
});

export const useMilestonesQuery = (projectId: string) => {
  return useQuery({
    queryKey: ['milestones', projectId],
    queryFn: async () => {
      const response = await HttpClient.get<{ milestones: MilestoneResponse[] }>(
        APIs.milestone.getAllMilestones(projectId)
      );

      return {
        data: {
          milestones: (response.data.milestones ?? []).map(mapMilestone),
        },
      };
    },
    enabled: !!projectId,
  });
};

export const useCreateMilestoneMutation = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MilestonePayload) =>
      HttpClient.post(APIs.milestone.createMilestone(projectId), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones', projectId] });
    },
  });
};

export const useUpdateMilestoneMutation = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      milestoneId,
      payload,
    }: {
      milestoneId: string;
      payload: Partial<MilestonePayload>;
    }) => HttpClient.put(APIs.milestone.updateMilestone(projectId, milestoneId), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones', projectId] });
    },
  });
};

export const useDeleteMilestoneMutation = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (milestoneId: string) =>
      HttpClient.delete(APIs.milestone.deleteMilestone(projectId, milestoneId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones', projectId] });
    },
  });
};
