import { APIs } from '@/lib/api';
import { HttpClient } from '@/lib/httpClient';
import { UserServerData } from '@/pages/onboarding/interfaces';
import { useDashboardProjectStore } from '@/stores/usedashboardStore';
import { SingleProject } from '@/types/project';
import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';

export interface NewlyCreatedProject {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  managerId: string;
  status: string;
  createdAt: string;
  logo: string | null;
  startingTimestamp: string | null;
  estimatedCompletionTimestamp: string | null;
  completedAt: Date | null;
}

export type CreateProjectPayload = {
  title: string;
  description: string;
  discordServerId: string;
};

export const useCreateProjectMutation = () => {
  const mutation = useMutation({
    mutationFn: async (projectData: CreateProjectPayload) => {
      const res = await HttpClient.post(APIs.auth.createProject(), projectData);
      return res.data as { project: NewlyCreatedProject };
    },
  });
  return mutation;
};

export const useDiscordServerListQuery = () => {
  const query = useQuery<UserServerData[]>({
    refetchOnWindowFocus: import.meta.env.PROD,
    queryKey: ['discord-server-list'],
    queryFn: async () => {
      const res = await HttpClient.get(APIs.user.userGuilds());
      return res.data;
    },
  });
  return query;
};

export const useBotInvitationVerificationQuery = () => {
  const mutation = useMutation({
    mutationFn: async (serverId: string) => {
      const res = await HttpClient.get(APIs.bot.botServerVerification(serverId));
      return res.data;
    },
  });
  return mutation;
};

export const porjectQueryOptions = queryOptions({
  queryKey: ['all-project-list'],
  staleTime: 1000 * 60 * 3, //3min
  queryFn: async () => {
    const res = await HttpClient.get<{ projects: SingleProject[] }>(APIs.project.getAllProjects());
    const { updatedSelectedProject, selectedProject, updateProjectList } =
      useDashboardProjectStore.getState();
    if (!selectedProject) {
      updatedSelectedProject(res.data.projects[0]);
    }
    updateProjectList(res.data.projects);

    return res.data;
  },
});

export const useProjectListQuery = () => {
  return useQuery(porjectQueryOptions);
};
