import TaskSettings from '@/pages/settings/task-settings';
import { createFileRoute } from '@tanstack/react-router';
import * as z from 'zod/v4';

export const taskSettingsSchema = z.object({
  tab: z.enum(['task-status', 'task-labels', 'task-types']).catch('task-status'),
});

export const Route = createFileRoute('/_authGuard/project/$projectId/settings/task-settings')({
  component: TaskSettings,
  validateSearch: taskSettingsSchema,
});
