import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useProjectUserRolesQuery } from '@/queries/useProjectUserRolesQuery';
import { useParams } from '@tanstack/react-router';
import { ChevronDown, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

const getInitials = (name: string) => {
  const chunks = name.trim().split(/\s+/).slice(0, 2);
  return chunks.map((chunk) => chunk[0]?.toUpperCase() ?? '').join('');
};

const toUserLabel = (index: number) => `USR-${String(index + 1).padStart(3, '0')}`;

const MemberManagement = () => {
  const { projectId = '' } = useParams({ strict: false });
  const { data, isLoading, isError } = useProjectUserRolesQuery(projectId);
  const [search, setSearch] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedAccess, setSelectedAccess] = useState<string[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  const members = useMemo(() => data?.users ?? [], [data?.users]);

  const roleOptions = useMemo(() => {
    const values = new Set<string>();
    members.forEach((member) => {
      member.roles.forEach((role) => values.add(role.name));
    });
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [members]);

  const filteredMembers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return members.filter((member) => {
      const displayName = member.fullName ?? member.nickName ?? member.email ?? member.discordId;
      const access = member.roles.length > 0 ? 'Assigned Role' : 'No Role';

      const matchesSearch =
        normalizedSearch.length === 0
          ? true
          : [displayName, member.email ?? '', member.discordId]
              .join(' ')
              .toLowerCase()
              .includes(normalizedSearch);

      const matchesRole =
        selectedRoles.length === 0
          ? true
          : member.roles.some((role) => selectedRoles.includes(role.name));

      const matchesAccess = selectedAccess.length === 0 ? true : selectedAccess.includes(access);

      return matchesSearch && matchesRole && matchesAccess;
    });
  }, [members, search, selectedRoles, selectedAccess]);

  const isAllFilteredSelected =
    filteredMembers.length > 0 &&
    filteredMembers.every((member) => selectedMemberIds.includes(member.id));

  const toggleSelectAllFiltered = () => {
    if (isAllFilteredSelected) {
      setSelectedMemberIds((prev) =>
        prev.filter((id) => !filteredMembers.some((m) => m.id === id))
      );
      return;
    }

    setSelectedMemberIds((prev) => {
      const next = new Set(prev);
      filteredMembers.forEach((member) => next.add(member.id));
      return Array.from(next);
    });
  };

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  const toggleRoleFilter = (roleName: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleName) ? prev.filter((role) => role !== roleName) : [...prev, roleName]
    );
  };

  const toggleAccessFilter = (value: string) => {
    setSelectedAccess((prev) =>
      prev.includes(value) ? prev.filter((access) => access !== value) : [...prev, value]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedRoles([]);
    setSelectedAccess([]);
  };

  return (
    <div className="bg-background flex h-full w-full flex-col">
      <header className="border-border border-b px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Member Management</h1>
            <p className="text-muted-foreground text-xs">
              Manage project members, permissions, and visibility.
            </p>
          </div>
          <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-xs">
            {members.length} members
          </Badge>
        </div>
      </header>

      <main className="flex h-full w-full flex-col p-4">
        {isLoading ? (
          <div className="text-muted-foreground text-sm">Loading members...</div>
        ) : isError ? (
          <div className="text-destructive text-sm">Failed to load members.</div>
        ) : members.length === 0 ? (
          <div className="text-muted-foreground text-sm">No members found for this project.</div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="bg-card flex flex-wrap items-center gap-2 rounded-lg border p-2.5">
              <div className="relative min-w-[240px] flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search member..."
                  className="h-9 pl-9"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 justify-between">
                    Roles
                    <ChevronDown className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52">
                  <DropdownMenuLabel>Filter by role</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {roleOptions.length === 0 ? (
                    <div className="text-muted-foreground px-2 py-1.5 text-sm">No roles found</div>
                  ) : (
                    roleOptions.map((roleName) => (
                      <DropdownMenuCheckboxItem
                        key={roleName}
                        checked={selectedRoles.includes(roleName)}
                        onCheckedChange={() => toggleRoleFilter(roleName)}
                      >
                        {roleName}
                      </DropdownMenuCheckboxItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 justify-between">
                    Access
                    <ChevronDown className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52">
                  <DropdownMenuLabel>Filter by access</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {['Assigned Role', 'No Role'].map((accessType) => (
                    <DropdownMenuCheckboxItem
                      key={accessType}
                      checked={selectedAccess.includes(accessType)}
                      onCheckedChange={() => toggleAccessFilter(accessType)}
                    >
                      {accessType}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                className="h-9"
                onClick={clearFilters}
                disabled={!search && selectedRoles.length === 0 && selectedAccess.length === 0}
              >
                Reset
              </Button>
            </div>

            <div className="bg-card overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[44px] px-3">
                      <Checkbox
                        checked={isAllFilteredSelected}
                        onCheckedChange={toggleSelectAllFiltered}
                        aria-label="Select all members"
                      />
                    </TableHead>
                    <TableHead className="px-3 text-xs font-semibold tracking-wide uppercase">
                      User ID
                    </TableHead>
                    <TableHead className="px-3 text-xs font-semibold tracking-wide uppercase">
                      Name
                    </TableHead>
                    <TableHead className="px-3 text-xs font-semibold tracking-wide uppercase">
                      Email Address
                    </TableHead>
                    <TableHead className="px-3 text-xs font-semibold tracking-wide uppercase">
                      Roles
                    </TableHead>
                    <TableHead className="px-3 text-xs font-semibold tracking-wide uppercase">
                      Access
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-muted-foreground px-3 py-8 text-center"
                      >
                        No members match your current filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMembers.map((member, index) => {
                      const displayName =
                        member.fullName ?? member.nickName ?? member.email ?? member.discordId;
                      const access = member.roles.length > 0 ? 'Assigned Role' : 'No Role';

                      return (
                        <TableRow key={member.id}>
                          <TableCell className="px-3">
                            <Checkbox
                              checked={selectedMemberIds.includes(member.id)}
                              onCheckedChange={() => toggleMemberSelection(member.id)}
                              aria-label={`Select ${displayName}`}
                            />
                          </TableCell>
                          <TableCell className="px-3 font-medium">{toUserLabel(index)}</TableCell>
                          <TableCell className="px-3">
                            <div className="flex items-center gap-2.5">
                              <Avatar className="ring-border size-8 ring-1">
                                <AvatarImage src={member.avatar ?? undefined} alt={displayName} />
                                <AvatarFallback className="text-xs font-medium">
                                  {getInitials(displayName || 'NA')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{displayName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="px-3">{member.email ?? '—'}</TableCell>
                          <TableCell className="px-3">
                            <div className="flex flex-wrap gap-1.5">
                              {member.roles.length > 0 ? (
                                member.roles.map((role) => (
                                  <Badge
                                    key={role.id}
                                    variant="outline"
                                    className="rounded-sm px-2 py-0.5"
                                  >
                                    {role.name}
                                  </Badge>
                                ))
                              ) : (
                                <Badge variant="outline" className="rounded-sm px-2 py-0.5">
                                  No role
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="px-3">
                            <Badge
                              variant={access === 'Assigned Role' ? 'secondary' : 'outline'}
                              className="rounded-full px-2.5 py-0.5"
                            >
                              {access}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MemberManagement;
