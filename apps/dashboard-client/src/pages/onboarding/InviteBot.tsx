import { DiscordAvatar } from '@/components/common/DiscordAvatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import {
  useBotInvitationVerificationQuery,
  useDiscordServerListQuery,
} from '@/queries/useProjectQuery';
import { useProjectCreation } from '@/stores/useProjectCreation';
import {
  AlertCircle,
  CheckCheck,
  ChevronsUpDown,
  Loader2,
  Plus,
  TriangleAlert,
} from 'lucide-react';
import { FC, useState } from 'react';
import { UserServerData } from './interfaces';

interface InviteBotProps {
  onNext: () => void;
}

export const InviteBot: FC<InviteBotProps> = ({ onNext }) => {
  const selectedServer = useProjectCreation((state) => state.selectedServer);
  const { isLoading, isLoadingError, data } = useDiscordServerListQuery();
  const [isServerSelectionOpen, setIsServerSelectionOpen] = useState(false);
  const [isBotInviteVerified, setIsBotInviteVerified] = useState(false);
  const { isPending, mutateAsync } = useBotInvitationVerificationQuery();
  const updateSelectedServer = useProjectCreation((state) => state.updateSelectedServer);

  const hasSelectedServer = selectedServer !== null && selectedServer?.id;

  const inviteBot = (serverId: string) => {
    window.open(import.meta.env.VITE_BOT_INVITATION_URL + `&guild_id=${serverId}`, '_blank');
  };

  const handleInviteBot = async (currentServer: UserServerData) => {
    // update state
    updateSelectedServer(currentServer);
    inviteBot(currentServer.id);
  };

  const verifyBotInvite = async (server: UserServerData) => {
    if (!server) {
      return null;
    }

    // call BE with server id to check if bot is in the server or not
    await mutateAsync(server?.id, {
      onSettled: (data) => {
        if (!data) {
          toast({
            title: 'Error',
            description: "Couldn't find the bot in your server. Please invite the bot first.",
            duration: 5000,
          });
          setIsBotInviteVerified(false);
          return;
        }
      },
    });
    setIsBotInviteVerified(true);
  };

  const renderStepHeader = () => {
    return (
      <div className="sticky -top-0.5 z-10 bg-background p-3">
        <h2 className="text-xl font-bold text-primary">Bring Task Management to Discord</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Invite our bot to your server and manage projects, tasks, and members directly from
          Discord.
        </p>
      </div>
    );
  };

  const renderLoadingView = () => {
    return (
      <div
        className={cn('flex h-1/2 min-h-[200px] w-full items-center justify-center text-white', {
          hidden: !isLoading,
        })}
      >
        <Loader2 strokeWidth={2} className="mr-2 size-8 animate-spin text-white" />
        Loading you discord servers...
      </div>
    );
  };

  const renderServerSelectionView = () => {
    return (
      <Popover open={isServerSelectionOpen} onOpenChange={setIsServerSelectionOpen}>
        <PopoverTrigger asChild className="flex-grow">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isServerSelectionOpen}
            className="w-full justify-between"
          >
            {selectedServer ? selectedServer?.name : 'Select a server...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popper-anchor-width)] p-0">
          <Command>
            <CommandInput placeholder="Search framework..." />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {data?.map((server) => (
                  <CommandItem
                    key={server?.id}
                    className="group flex w-full gap-4 rounded-none border-b border-border py-2 data-[selected='true']:bg-gray-950"
                    data-selected={'false'}
                    onSelect={() => {
                      updateSelectedServer(server);
                      setIsServerSelectionOpen(false);
                      setIsBotInviteVerified(false);
                    }}
                  >
                    <DiscordAvatar
                      assetId={server.icon}
                      serverId={server.id}
                      size={32}
                      alt={server.name}
                    />

                    <div className="flex flex-1 flex-col gap-2 text-left">
                      <h2 className="text-sm font-medium">{server.name}</h2>

                      <div className="w-fit rounded-full bg-green-950 px-1 py-[1px] text-xs text-emerald-400">
                        {server.owner ? 'Owner' : 'Administrator'}
                      </div>
                      <p className="hidden text-xs text-gray-500"> {server.id} </p>
                    </div>
                    <div>
                      <CheckCheck
                        strokeWidth={2}
                        className={cn('hidden size-6', {
                          'block text-emerald-500': selectedServer?.id === server.id,
                        })}
                      />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  const renderBotInviteVerificationView = () => {
    const isVerified = isBotInviteVerified;

    return (
      <Button
        onClick={() => verifyBotInvite(selectedServer!)}
        className="h-12 w-full gap-1 rounded-none rounded-bl-lg text-sm font-medium"
        size="sm"
        variant={'ghost'}
      >
        {isPending ? (
          <span className="flex items-center gap-1">
            <Loader2 strokeWidth={2} className="size-4 animate-spin" />
            Verifying...
          </span>
        ) : null}
        <span
          className={cn('flex items-center gap-1 text-emerald-400', {
            hidden: !isVerified || isPending,
          })}
        >
          <CheckCheck strokeWidth={2} className="size-4" />
          Verified
        </span>
        <span
          className={cn('flex items-center gap-2 font-semibold text-red-500', {
            hidden: isVerified || isPending,
          })}
        >
          <TriangleAlert className="size-4" />
          <span>Check Verification Status</span>
        </span>
      </Button>
    );
  };

  const renderSelectedServerView = () => {
    if (!hasSelectedServer) return null;
    return (
      <Card key={selectedServer?.id} className="mx-auto w-[70%]">
        <CardContent className="flex h-full flex-col justify-between p-0">
          <div className="flex flex-grow gap-3 p-6">
            <DiscordAvatar
              assetId={selectedServer.icon}
              serverId={selectedServer.id}
              size={80}
              alt={selectedServer.name}
              className="size-20 border"
            />
            <div className="text-md flex flex-col gap-1.5 font-normal text-primary">
              <p className="font-bold"> {selectedServer?.name} </p>
              <p className="text-sm text-muted-foreground">ID : {selectedServer?.id}</p>
              <p className="text-muted-foreground">
                Role :{' '}
                <span className="rounded-full bg-blue-950 px-2 py-0.5 text-sm font-semibold text-blue-500">
                  {selectedServer?.owner ? 'Owner' : 'Administrator'}
                </span>
              </p>
            </div>
          </div>
          <div className="flex h-full border-t border-border">
            {renderBotInviteVerificationView()}
            <Button
              onClick={() => handleInviteBot(selectedServer)}
              className="h-12 w-full gap-1 rounded-none rounded-br-lg text-sm font-semibold"
              size="sm"
              variant={'ghost'}
            >
              <Plus strokeWidth={2.5} className="size-4" />
              Invite
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="relative flex flex-col gap-3">
      {renderStepHeader()}
      <Separator />

      {renderLoadingView()}
      <div className="flex gap-3 p-2 px-6">
        {renderServerSelectionView()}

        <Button variant={'secondary'} size={'sm'}>
          Rrefresh Server List
        </Button>
      </div>

      {renderSelectedServerView()}
      <div
        className={cn('mx-auto flex items-center gap-1 text-indigo-400', {
          hidden: isLoadingError || isLoading || !hasSelectedServer,
        })}
      >
        <AlertCircle className="size-4" />
        <p>Already invited the bot? check verification status</p>
      </div>

      <div className="flex w-full justify-end px-6">
        <Button
          onClick={onNext}
          disabled={!isBotInviteVerified}
          className={cn(
            'border text-secondary hover:text-gray-700 disabled:pointer-events-auto disabled:opacity-80',
            {
              hidden: isLoadingError || isLoading,
              'cursor-not-allowed': !isBotInviteVerified,
            }
          )}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
