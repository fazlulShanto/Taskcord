import MemberManagement from '@/pages/settings/member-management';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authGuard/project/$projectId/settings/member-management')({
  component: MemberManagement,
});
