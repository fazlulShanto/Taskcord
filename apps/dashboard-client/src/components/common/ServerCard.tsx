import { FC } from 'react';

interface ServerCardProps {
  name: string;
  logoUrl: string;
  createdAt: Date;
}

export const ServerCard: FC<ServerCardProps> = ({
  name = 'The Ultimate Community Hub for Gaming, Chatting, Memes, and More - Join the Fun and Make New Friends Today!',
  logoUrl = 'https://i.pravatar.cc/240',
  createdAt = new Date(),
}) => {
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="group h-fit w-80">
      {/* Card container with gradient border */}
      <div className="relative animate-gradient-border rounded-xl bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 bg-[length:200%_200%] p-[1px]">
        <div className="relative h-44 overflow-hidden rounded-xl bg-gray-900 p-6">
          {/* Initial state */}
          <div className="absolute inset-0 flex transform flex-col items-center justify-between p-6 transition-all duration-300 group-hover:-translate-x-full">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-white/70">
              <img src={logoUrl} alt={`${name} logo`} className="h-full w-full object-cover" />
            </div>
            <div className="max-w-full text-center">
              <h3 className="mb-2 line-clamp-1 overflow-hidden text-lg font-bold text-white">
                {name}
              </h3>
              <p className="text-sm text-gray-400">Created on {formattedDate}</p>
            </div>
          </div>

          {/* Hover state */}
          <div className="absolute inset-0 flex translate-y-full transform flex-col justify-between p-6 transition-all duration-300 group-hover:translate-y-0">
            {/* Top row: Logo, Title, Date */}
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-white/10">
                <img src={logoUrl} alt={`${name} logo`} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-lg font-bold text-white">{name}</h3>
                <p className="text-sm text-gray-400">{formattedDate}</p>
              </div>
            </div>

            {/* Bottom row: Invite button */}
            <button className="w-full rounded-md bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-medium text-white transition duration-300 hover:from-purple-700 hover:to-pink-700">
              Invite {import.meta.env.VITE_DISCORD_BOT_NAME}
            </button>
          </div>

          {/* Glossy overlay */}
          <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.03] to-transparent" />
        </div>
      </div>
    </div>
  );
};
