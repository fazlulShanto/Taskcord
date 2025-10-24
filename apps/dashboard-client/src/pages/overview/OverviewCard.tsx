import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FC } from 'react';

interface LandingDashboardCardProps {
  title: string;
  statData: number | string;
  icon?: JSX.Element;
}

export const OverviewCard: FC<LandingDashboardCardProps> = ({ title, statData, icon }) => {
  return (
    <Card className="relative flex flex-1 justify-around gap-2 overflow-hidden p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#000000_0%,#1F1F1F_100%)]"></div>
      <div className="z-10 flex h-full w-full flex-col">
        <CardHeader className="p-0">
          <CardTitle className="text-md font-medium text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-between p-0 pt-2">
          <p className="text-4xl font-semibold">{statData}</p>
        </CardContent>
      </div>
      <div className="z-10 flex w-fit items-center justify-center">{icon}</div>
    </Card>
  );
};
