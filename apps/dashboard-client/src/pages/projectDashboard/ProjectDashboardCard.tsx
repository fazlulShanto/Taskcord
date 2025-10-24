import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FC } from 'react';

interface LandingDashboardCardProps {
  title: string;
  statData: number | string;
  icon?: JSX.Element;
  gradient?: string;
}

export const ProjectDashboardCard: FC<LandingDashboardCardProps> = ({
  title,
  statData,
  icon,
  gradient = 'bg-[radial-gradient(ellipse_at_top_left,_#334155_1%,_#000022_100%)]',
}) => {
  return (
    <Card className="relative flex flex-1 justify-around gap-2 overflow-hidden border-[#475569]/70 p-4 shadow-lg">
      <div className={cn('absolute inset-0', gradient)}></div>
      <div className="z-10 flex h-full w-full flex-col">
        <CardHeader className="p-0">
          <CardTitle className="text-md font-medium text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-between p-0 pt-2">
          <p className="text-4xl font-semibold">{statData}</p>
        </CardContent>
      </div>
      <div className="z-10 flex w-fit items-center justify-center">{icon}</div>
    </Card>
  );
};
