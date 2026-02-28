import { APIs } from '@/lib/api';
import { HttpClient } from '@/lib/httpClient';
import { queryOptions, useQuery } from '@tanstack/react-query';

export interface ProjectUserRole {
  id: string;
  name: string;
}

export interface ProjectUserWithRoles {
  id: string;
  discordId: string;
  fullName: string | null;
  nickName: string | null;
  avatar: string | null;
  email: string | null;
  roles: ProjectUserRole[];
}

export interface ProjectUserRolesResponse {
  users: ProjectUserWithRoles[];
}

export const projectUserRolesQueryOptions = (projectId: string) =>
  queryOptions({
    queryKey: ['project-user-roles', projectId],
    queryFn: async () => {
      const res = await HttpClient.get<ProjectUserRolesResponse>(
        APIs.user.projectUserRoles(projectId)
      );
      return res.data;
    },
    enabled: !!projectId,
  });

export const useProjectUserRolesQuery = (projectId: string) => {
  return useQuery(projectUserRolesQueryOptions(projectId));
};
