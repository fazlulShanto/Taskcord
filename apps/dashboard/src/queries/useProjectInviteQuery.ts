import { APIs } from '@/lib/api';
import { HttpClient } from '@/lib/httpClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type InviteType = 'single_use' | 'multi_use';
export type RestrictionType = 'none' | 'email' | 'discord_id';

export interface ProjectInvite {
  id: string;
  projectId: string;
  inviterId: string;
  roleId: string | null;
  inviteType: InviteType;
  restrictionType: RestrictionType;
  restrictedEmail: string | null;
  restrictedDiscordId: string | null;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  revokedAt: string | null;
  lastAcceptedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CreateProjectInvitePayload {
  inviteType: InviteType;
  maxUses?: number;
  expiresInHours?: number;
  restrictionType: RestrictionType;
  restrictedEmail?: string;
  restrictedDiscordId?: string;
  roleId?: string;
}

export interface CreateProjectInviteResponse {
  invite: ProjectInvite;
  inviteToken: string;
  authInitUrl: string;
}

export interface ProjectInvitesResponse {
  invites: ProjectInvite[];
}

export interface ProjectDefinedRole {
  id: string;
  projectId: string;
  roleName: string;
  description: string | null;
  permissionCode: string;
  createdAt: string | null;
  updatedAt: string | null;
  creatorId: string;
}

export interface ProjectDefinedRolesResponse {
  roles: ProjectDefinedRole[];
}

export const useProjectInvitesQuery = (projectId: string) => {
  return useQuery({
    queryKey: ['project-invites', projectId],
    queryFn: async () => {
      const response = await HttpClient.get<ProjectInvitesResponse>(
        APIs.project.listInvites(projectId)
      );
      return response.data;
    },
    enabled: !!projectId,
  });
};

export const useProjectDefinedRolesQuery = (projectId: string) => {
  return useQuery({
    queryKey: ['project-defined-roles', projectId],
    queryFn: async () => {
      const response = await HttpClient.get<ProjectDefinedRolesResponse>(
        APIs.project.listRoles(projectId)
      );
      return response.data;
    },
    enabled: !!projectId,
  });
};

export const useCreateProjectInviteMutation = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProjectInvitePayload) => {
      const response = await HttpClient.post<CreateProjectInviteResponse>(
        APIs.project.createInvite(projectId),
        payload
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-invites', projectId] });
    },
  });
};

export const useRevokeProjectInviteMutation = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteId: string) => {
      const response = await HttpClient.delete<{ invite: ProjectInvite }>(
        APIs.project.revokeInvite(projectId, inviteId)
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-invites', projectId] });
    },
  });
};
