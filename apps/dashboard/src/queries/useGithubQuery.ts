import { APIs } from '@/lib/api';
import { HttpClient } from '@/lib/httpClient';
import { useMutation, useQuery } from '@tanstack/react-query';

export type GithubInitResponse = {
  url: string;
};

export type GithubProjectRepository = {
  id: string;
  projectId: string;
  installationId: string | null;
  repositoryId: string;
  owner: string;
  name: string;
  fullName: string;
  defaultBranch: string;
  isPrivate: boolean;
  isActive: boolean;
  lastSyncedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type GithubRepositoryInput = {
  installationId?: string;
  repositoryId: string;
  owner: string;
  name: string;
  fullName: string;
  defaultBranch?: string;
  isPrivate?: boolean;
};

export const useGithubInitMutation = () => {
  return useMutation({
    mutationFn: async (payload: { projectId: string; redirectUrl?: string }) => {
      const res = await HttpClient.get<GithubInitResponse>(
        APIs.github.init(payload.projectId, payload.redirectUrl)
      );
      return res.data;
    },
  });
};

export const useGithubProjectReposQuery = (projectId?: string) => {
  return useQuery({
    queryKey: ['github-project-repos', projectId],
    enabled: Boolean(projectId),
    queryFn: async () => {
      const res = await HttpClient.get<{ repositories: GithubProjectRepository[] }>(
        APIs.github.listProjectRepos(projectId!)
      );
      return res.data.repositories;
    },
  });
};

export const useGithubProjectRepoUpsertMutation = () => {
  return useMutation({
    mutationFn: async (payload: { projectId: string; repo: GithubRepositoryInput }) => {
      const res = await HttpClient.post<{ repository: GithubProjectRepository }>(
        APIs.github.upsertProjectRepo(payload.projectId),
        payload.repo
      );
      return res.data.repository;
    },
  });
};
