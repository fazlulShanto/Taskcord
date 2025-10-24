import { KanbanBoard } from '@/components/kanban-board';
import { useTaskStore } from '@/stores/useTaskStore';
import { TaskTabsType } from '@/types/tasks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs';
import { FC, useMemo } from 'react';
import { CreateTask } from './CreateTask';

const taskBoardTabs: { label: string; value: TaskTabsType }[] = [
  { label: 'Kanban', value: 'kanban' },
  { label: 'List', value: 'list' },
  { label: 'Table', value: 'table' },
  { label: 'Calendar', value: 'calendar' },
  { label: 'Timeline', value: 'timeline' },
];

interface TaskBoardContainerProps {}
export const TaskBoardContainer: FC<TaskBoardContainerProps> = () => {
  const { selectedTab, updateSelectedTab } = useTaskStore();

  const currentTab = useMemo<TaskTabsType>(() => {
    return selectedTab || 'kanban';
  }, [selectedTab]);

  const renderTabContent = () => {
    switch (currentTab) {
      case 'kanban':
        return <KanbanBoard />;
      default:
        return <div className="p-8">No board view for {selectedTab}</div>;
    }
  };

  return (
    <Tabs
      className="flex h-full flex-col"
      value={currentTab}
      onValueChange={(value) => updateSelectedTab(value as TaskTabsType)}
    >
      <div className="flex items-center justify-between">
        <TabsList>
          {taskBoardTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              className="data-[state=active]:bg-gray-700"
              value={tab.value}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <CreateTask />
      </div>
      <TabsContent value={currentTab} className="flex flex-1">
        {renderTabContent()}
      </TabsContent>
    </Tabs>
  );
};
