import TeamInformations from '@/pages/settings/team-informations';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authGuard/project/$projectId/settings/team-info')({
  component: TeamInformations,
});
