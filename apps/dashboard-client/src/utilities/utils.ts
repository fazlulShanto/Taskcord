export const getDiscordIconUrlById = ({
  serverId,
  assetId,
  size = 96,
}: {
  serverId: string;
  assetId: string;
  size?: number;
}) => {
  return `https://cdn.discordapp.com/icons/${serverId}/${assetId}.webp?size=${size}`;
};
