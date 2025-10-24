import { Tasks } from '@/pages/tasks';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authGuard/project/$projectId/tasks')({
  component: Tasks,
});
