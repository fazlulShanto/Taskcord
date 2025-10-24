import { APIs } from '@/lib/api';
import { cn } from '@/lib/utils';
import { type FC } from 'react';

interface DiscordSigninProps {
  className?: string;
}

export const DiscordSignIn: FC<DiscordSigninProps> = ({ className }) => {
  const currentHost = `${window.location.protocol}//${window.location.host}`;
  return (
    <a className={cn('mt-4', className)} href={APIs.auth.initDiscordAuth(currentHost)}>
      Login with Discord
    </a>
  );
};
