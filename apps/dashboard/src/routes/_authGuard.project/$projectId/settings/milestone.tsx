import MilestoneSettingsPage from '@/pages/settings/milestone';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authGuard/project/$projectId/settings/milestone')({
  component: MilestoneSettingsPage,
});
