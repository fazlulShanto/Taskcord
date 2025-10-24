import Onboarding from '@/pages/onboarding';
import { porjectQueryOptions } from '@/queries/useProjectQuery';
import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_authGuard/onboarding')({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(porjectQueryOptions),
});

function RouteComponent() {
  const { projects } = Route.useLoaderData();
  if (projects.length > 0) {
    // select first project and navigate to it
    return <Navigate to="/overview" />;
  }
  return <Onboarding />;
}
