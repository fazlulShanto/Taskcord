import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authGuard/project/$projectId/')({
  beforeLoad(ctx) {
    const { projectId } = ctx.params;
    throw redirect({
      to: '/project/$projectId/dashboard',
      params: {
        projectId,
      },
    });
  },
});
