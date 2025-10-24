// ServerCard.tsx
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import React from 'react';

// Interface matching your provided server data structure
interface ServerData {
  id: string;
  name: string;
  icon: string;
  banner: string;
  owner: boolean;
  permissions: string;
}

interface ServerCardProps {
  server: ServerData;
  onInviteBot: (serverId: string) => void;
}

const InviteServerCard: React.FC<ServerCardProps> = ({ server, onInviteBot }) => {
  // Discord CDN URL for server icons
  const getServerIconUrl = (serverId: string, iconHash: string) => {
    if (!iconHash) return '';
    return `https://cdn.discordapp.com/icons/${serverId}/${iconHash}.png`;
  };

  const iconUrl = getServerIconUrl(server.id, server.icon);

  return (
    <Card className="relative overflow-hidden border-zinc-700 bg-zinc-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Accent line at the top */}
      <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-400" />

      <CardHeader className="pb-3 pt-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-shrink-0">
            <div className="h-14 w-14 overflow-hidden rounded-xl shadow-md">
              {iconUrl ? (
                <img
                  src={iconUrl}
                  alt={`${server.name} server icon`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-zinc-700 text-lg font-bold text-zinc-300">
                  {server.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-bold text-white">{server.name}</h3>
            <div className="flex w-fit items-center rounded-full bg-violet-950 px-2 py-1 text-sm text-violet-400">
              {server.owner ? (
                <span className="text-xs font-medium text-amber-400">Owner</span>
              ) : (
                <span className="text-xs">Administrator</span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardFooter className="flex items-center justify-between border-t border-zinc-700/50 pb-4 pt-2">
        <div className="text-sm text-zinc-400">ID: {server.id.slice(0, 8)}...</div>
        <Button
          onClick={() => onInviteBot(server.id)}
          className="group bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Upload className="mr-2 h-4 w-4 group-hover:animate-bounce" />
          Invite Bot
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InviteServerCard;
