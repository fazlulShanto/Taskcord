import { taskSettingsSchema } from '@/routes/_authGuard.project/$projectId/settings/task-settings';
import * as z from 'zod/v4';

type TaskSettingsSidebarItem = {
  label: string;
  icon: React.ReactElement;
  slug: TaskSettingsTabs;
  href: string;
};
const taskSettingsSidebarData: TaskSettingsSidebarItem[] = [
  {
    label: 'Task Status',
    icon: <RadioReceiver />,
    slug: 'task-status',
    href: '/settings/task-settings/task-status',
  },
  {
    label: 'Task Labels',
    icon: <CheckCircleIcon />,
    slug: 'task-labels',
    href: '/settings/task-settings/task-labels',
  },
  {
    label: 'Task Types',
    icon: <CheckCircleIcon />,
    slug: 'task-types',
    href: '/settings/task-settings/task-types',
  },
] as const;

export type TaskSettingsTabs = z.infer<typeof taskSettingsSchema>['tab'];

type TaskSettingsSidebarProps = {
  selectedTab: string;
};

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useNavigate } from '@tanstack/react-router';
import { CheckCircleIcon, RadioReceiver } from 'lucide-react';

const TaskSettingsSidebar = ({ selectedTab }: TaskSettingsSidebarProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative h-full w-[25%] max-w-[200px] px-2 py-4">
      <Tabs value={selectedTab} orientation="vertical" className="mt-8 h-fit">
        <TabsList className="flex flex-col gap-2 bg-transparent">
          {taskSettingsSidebarData.map((item) => (
            <TabsTrigger
              key={item.slug}
              value={item.slug}
              className={cn('w-full justify-start gap-2 font-semibold', {
                'data-[state=active]:bg-sidebar-accent': selectedTab === item.slug,
              })}
              onClick={() => {
                navigate({
                  // @ts-expect-error - TODO: fix this
                  search: { tab: item.slug },
                });
              }}
            >
              {item.icon}
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TaskSettingsSidebar;
