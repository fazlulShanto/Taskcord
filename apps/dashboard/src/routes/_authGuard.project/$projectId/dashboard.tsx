import { ProjectDashboard } from '@/pages/projectDashboard';
import { projectUserRolesQueryOptions } from '@/queries/useProjectUserRolesQuery';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authGuard/project/$projectId/dashboard')({
  loader: ({ context: { queryClient }, params: { projectId } }) =>
    queryClient.ensureQueryData(projectUserRolesQueryOptions(projectId)),
  component: ProjectDashboard,
});
