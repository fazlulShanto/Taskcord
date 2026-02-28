import Onboarding from '@/pages/onboarding';
import { porjectQueryOptions } from '@/queries/useProjectQuery';
import { createFileRoute, Navigate } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import * as z from 'zod/v4';
import { toast } from '@/components/extended-ui/sonner';

const onboardingSearchSchema = z.object({
  invite_status: z
    .enum(['none', 'joined', 'already_member', 'invalid', 'expired', 'revoked', 'restricted', 'error'])
    .optional(),
  invite_project_id: z.string().optional(),
});

export const Route = createFileRoute('/_authGuard/onboarding')({
  component: RouteComponent,
  validateSearch: onboardingSearchSchema,
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(porjectQueryOptions),
});

function RouteComponent() {
  const { projects } = Route.useLoaderData();
  const search = Route.useSearch();
  const hasShownInviteToastRef = useRef(false);

  useEffect(() => {
    if (hasShownInviteToastRef.current || !search.invite_status || search.invite_status === 'none') {
      return;
    }

    hasShownInviteToastRef.current = true;

    if (search.invite_status === 'joined') {
      toast({
        title: 'Invitation accepted',
        description: 'You have joined the project successfully.',
        toastType: 'success',
      });
      return;
    }

    if (search.invite_status === 'already_member') {
      toast({
        title: 'Already a member',
        description: 'Your account is already part of this project.',
      });
      return;
    }

    const statusMessage =
      search.invite_status === 'expired'
        ? 'This invitation has expired.'
        : search.invite_status === 'revoked'
          ? 'This invitation has been revoked.'
          : search.invite_status === 'restricted'
            ? 'This invitation is restricted to another account.'
            : search.invite_status === 'invalid'
              ? 'This invitation link is invalid or already exhausted.'
              : 'We could not complete invitation acceptance.';

    toast({
      title: 'Invitation failed',
      description: statusMessage,
      toastType: 'destructive',
    });
  }, [search.invite_status]);

  if (projects.length > 0) {
    // select first project and navigate to it
    return <Navigate to="/overview" />;
  }
  return <Onboarding />;
}
