import { createFileRoute } from '@tanstack/react-router';
import { ProjectDashboard } from '@/pages/projectDashboard';

export const Route = createFileRoute('/_authGuard/project/$projectId/dashboard')({
  component: ProjectDashboard,
});
