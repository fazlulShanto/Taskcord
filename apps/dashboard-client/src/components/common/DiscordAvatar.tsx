import { FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getDiscordIconUrlById } from '@/utilities/utils';
import { startCase } from 'lodash';

interface DiscordAvatarProps {
  serverId: string;
  assetId: string;
  size?: number;
  alt: string;
  className?: string;
}

export const DiscordAvatar: FC<DiscordAvatarProps> = ({
  serverId,
  assetId,
  size,
  alt,
  className = '',
}) => {
  let firstTwoChar = startCase(alt)
    .split(' ')
    .filter((word) => word.length)
    .map((word) => word[0])
    .slice(0, 2)
    .join('');

  if (firstTwoChar.length < 2) {
    firstTwoChar = alt.slice(0, 2).split('').join(' ').toUpperCase();
  }

  return (
    <Avatar className={className}>
      <AvatarImage
        src={getDiscordIconUrlById({
          serverId,
          assetId,
          size,
        })}
        alt={alt}
      />
      <AvatarFallback>{firstTwoChar}</AvatarFallback>
    </Avatar>
  );
};
