import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  type CreateProjectInvitePayload,
  type InviteType,
  type ProjectInvite,
  type RestrictionType,
  useCreateProjectInviteMutation,
  useProjectDefinedRolesQuery,
  useProjectInvitesQuery,
  useRevokeProjectInviteMutation,
} from '@/queries/useProjectInviteQuery';
import { useParams } from '@tanstack/react-router';
import { Copy, Link, ShieldMinus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

type InviteFormState = {
  inviteType: InviteType;
  maxUses: string;
  expiresInHours: string;
  restrictionType: RestrictionType;
  restrictedEmail: string;
  restrictedDiscordId: string;
  roleId: string;
};

const INITIAL_FORM: InviteFormState = {
  inviteType: 'single_use',
  maxUses: '25',
  expiresInHours: '168',
  restrictionType: 'none',
  restrictedEmail: '',
  restrictedDiscordId: '',
  roleId: '',
};

const formatDateTime = (value: string | null) => {
  if (!value) {
    return '—';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '—';
  }

  return parsed.toLocaleString();
};

const getInviteState = (invite: ProjectInvite) => {
  if (invite.revokedAt) {
    return 'revoked';
  }

  const expiresAt = new Date(invite.expiresAt);
  if (expiresAt.getTime() <= Date.now()) {
    return 'expired';
  }

  if (invite.usedCount >= invite.maxUses) {
    return 'exhausted';
  }

  return 'active';
};

const TeamInformations = () => {
  const { projectId = '' } = useParams({ strict: false });
  const [formState, setFormState] = useState<InviteFormState>(INITIAL_FORM);
  const [latestInviteUrl, setLatestInviteUrl] = useState<string | null>(null);

  const { data, isLoading, isError } = useProjectInvitesQuery(projectId);
  const {
    data: roleData,
    isLoading: isRoleLoading,
    isError: isRoleError,
  } = useProjectDefinedRolesQuery(projectId);
  const { mutateAsync: createInvite, isPending: isCreating } =
    useCreateProjectInviteMutation(projectId);
  const { mutateAsync: revokeInvite, isPending: isRevoking } =
    useRevokeProjectInviteMutation(projectId);

  const invites = useMemo(() => data?.invites ?? [], [data]);
  const roles = useMemo(() => roleData?.roles ?? [], [roleData]);

  const copyText = async (value: string, successMessage: string) => {
    if (!navigator.clipboard) {
      toast.error('Clipboard is not available in this browser');
      return;
    }

    await navigator.clipboard.writeText(value);
    toast.success(successMessage);
  };

  const handleCreateInvite = async () => {
    const payload: CreateProjectInvitePayload = {
      inviteType: formState.inviteType,
      restrictionType: formState.restrictionType,
    };

    const expiresInHours = Number(formState.expiresInHours);
    if (!Number.isInteger(expiresInHours) || expiresInHours < 1 || expiresInHours > 24 * 30) {
      toast.error('Expiry must be an integer between 1 and 720 hours');
      return;
    }
    payload.expiresInHours = expiresInHours;

    if (formState.inviteType === 'multi_use') {
      const maxUses = Number(formState.maxUses);
      if (!Number.isInteger(maxUses) || maxUses < 1 || maxUses > 1000) {
        toast.error('Max uses must be an integer between 1 and 1000');
        return;
      }
      payload.maxUses = maxUses;
    }

    if (formState.restrictionType === 'email') {
      if (!formState.restrictedEmail.trim()) {
        toast.error('Restricted email is required');
        return;
      }
      payload.restrictedEmail = formState.restrictedEmail.trim();
    }

    if (formState.restrictionType === 'discord_id') {
      if (!formState.restrictedDiscordId.trim()) {
        toast.error('Restricted Discord ID is required');
        return;
      }
      payload.restrictedDiscordId = formState.restrictedDiscordId.trim();
    }

    if (formState.roleId.trim()) {
      payload.roleId = formState.roleId.trim();
    }

    const response = await createInvite(payload);
    setLatestInviteUrl(response.authInitUrl);
    setFormState((prev) => ({
      ...prev,
      restrictedEmail: '',
      restrictedDiscordId: '',
      roleId: '',
    }));

    toast.success('Invite created successfully');
  };

  const handleRevokeInvite = async (inviteId: string) => {
    await revokeInvite(inviteId);
    toast.success('Invite revoked successfully');
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <header className="border-border border-b p-2.5">
        <h1 className="text-lg font-bold">Team Informations</h1>
      </header>

      <main className="flex h-full w-full flex-col gap-4 overflow-auto p-4">
        <section className="border-border grid gap-3 rounded-md border p-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Invite Type</Label>
            <Select
              value={formState.inviteType}
              onValueChange={(value: InviteType) =>
                setFormState((prev) => ({
                  ...prev,
                  inviteType: value,
                  maxUses: value === 'single_use' ? '1' : prev.maxUses || '25',
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select invite type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single_use">Single use</SelectItem>
                <SelectItem value="multi_use">Multi use</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Max Uses</Label>
            <Input
              type="number"
              min={1}
              max={1000}
              disabled={formState.inviteType === 'single_use'}
              value={formState.inviteType === 'single_use' ? '1' : formState.maxUses}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  maxUses: event.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Expires In Hours</Label>
            <Input
              type="number"
              min={1}
              max={24 * 30}
              value={formState.expiresInHours}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  expiresInHours: event.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Restriction Type</Label>
            <Select
              value={formState.restrictionType}
              onValueChange={(value: RestrictionType) =>
                setFormState((prev) => ({
                  ...prev,
                  restrictionType: value,
                  restrictedEmail: '',
                  restrictedDiscordId: '',
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select restriction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="discord_id">Discord ID</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formState.restrictionType === 'email' && (
            <div className="space-y-2 md:col-span-2">
              <Label>Restricted Email</Label>
              <Input
                type="email"
                value={formState.restrictedEmail}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    restrictedEmail: event.target.value,
                  }))
                }
                placeholder="user@example.com"
              />
            </div>
          )}

          {formState.restrictionType === 'discord_id' && (
            <div className="space-y-2 md:col-span-2">
              <Label>Restricted Discord ID</Label>
              <Input
                value={formState.restrictedDiscordId}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    restrictedDiscordId: event.target.value,
                  }))
                }
                placeholder="Discord user ID"
              />
            </div>
          )}

          <div className="space-y-2 md:col-span-2">
            <Label>Role (optional)</Label>
            <Select
              value={formState.roleId || 'none'}
              onValueChange={(value) =>
                setFormState((prev) => ({
                  ...prev,
                  roleId: value === 'none' ? '' : value,
                }))
              }
            >
              <SelectTrigger className="w-full" disabled={isRoleLoading || isRoleError}>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No role (default assignment)</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.roleName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isRoleLoading && <p className="text-muted-foreground text-xs">Loading roles...</p>}
            {isRoleError && (
              <p className="text-destructive text-xs">
                Failed to load roles, invite can still be created without role.
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Button onClick={handleCreateInvite} disabled={isCreating}>
              <Link className="size-4" />
              Create Invite Link
            </Button>
          </div>
        </section>

        {latestInviteUrl && (
          <section className="border-border flex items-center justify-between gap-3 rounded-md border p-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Latest Invite Link</p>
              <p className="text-muted-foreground truncate text-sm">{latestInviteUrl}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyText(latestInviteUrl, 'Invite link copied')}
            >
              <Copy className="size-4" />
              Copy
            </Button>
          </section>
        )}

        <section className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Restriction</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expires At</TableHead>
                <TableHead>Last Accepted</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-muted-foreground text-sm">
                    Loading invites...
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && isError && (
                <TableRow>
                  <TableCell colSpan={7} className="text-destructive text-sm">
                    Failed to load invites.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && invites.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-muted-foreground text-sm">
                    No invite links found for this project.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                !isError &&
                invites.map((invite) => {
                  const state = getInviteState(invite);

                  return (
                    <TableRow key={invite.id}>
                      <TableCell>
                        <Badge variant={state === 'active' ? 'secondary' : 'outline'}>
                          {state}
                        </Badge>
                      </TableCell>
                      <TableCell>{invite.inviteType}</TableCell>
                      <TableCell>
                        {invite.restrictionType === 'email'
                          ? invite.restrictedEmail
                          : invite.restrictionType === 'discord_id'
                            ? invite.restrictedDiscordId
                            : 'none'}
                      </TableCell>
                      <TableCell>
                        {invite.usedCount}/{invite.maxUses}
                      </TableCell>
                      <TableCell>{formatDateTime(invite.expiresAt)}</TableCell>
                      <TableCell>{formatDateTime(invite.lastAcceptedAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isRevoking || state !== 'active'}
                          onClick={() => handleRevokeInvite(invite.id)}
                        >
                          {state === 'active' ? (
                            <Trash2 className="size-4" />
                          ) : (
                            <ShieldMinus className="size-4" />
                          )}
                          Revoke
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </section>
      </main>
    </div>
  );
};

export default TeamInformations;
