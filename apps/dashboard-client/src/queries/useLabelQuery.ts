import { APIs } from '@/lib/api';
import { HttpClient } from '@/lib/httpClient';
import { Label, LabelCreate } from '@/types/label';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useLabelQuery = (projectId: string) => {
  return useQuery({
    queryKey: ['labels', projectId],
    staleTime: 1000 * 15,
    queryFn: () => HttpClient.get<Label[]>(APIs.label.getAllLabels(projectId)),
  });
};

export const useCreateLabelMutation = (projectId: string) => {
  return useMutation({
    mutationFn: (label: LabelCreate) => HttpClient.post(APIs.label.createLabel(projectId), label),
  });
};

export const useUpdateLabelMutation = (projectId: string) => {
  return useMutation({
    mutationFn: (label: Label) =>
      HttpClient.put(APIs.label.updateLabel(projectId, label.id), label),
  });
};

export const useDeleteLabelMutation = (projectId: string) => {
  return useMutation({
    mutationFn: (labelId: string) => HttpClient.delete(APIs.label.deleteLabel(projectId, labelId)),
  });
};
