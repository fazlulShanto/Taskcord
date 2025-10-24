import { Separator } from '@radix-ui/react-separator';
import { useSearch } from '@tanstack/react-router';
import { TaskStatusSettings } from './task-status';
import { TaskLabels } from './TaskLabels';
import TaskSettingsSidebar from './TaskSettingsSidebar';
import { TaskTypes } from './TaskTypes';

const TaskSettings = () => {
  const { tab: selectedTab = 'task-status' } = useSearch({ strict: false });

  // const activeTabe = useSearchParams().get('tab');
  const renderTaskSettingsContent = () => {
    switch (selectedTab) {
      case 'task-status':
        return <TaskStatusSettings />;
      case 'task-labels':
        return <TaskLabels />;
      case 'task-types':
        return <TaskTypes />;
      default:
        throw new Error('Invalid tab');
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <header className="border-b border-border p-2.5">
        <h1 className="text-lg font-bold">Task Settings</h1>
      </header>

      <main className="flex h-full w-full">
        <TaskSettingsSidebar selectedTab={selectedTab} />
        <Separator orientation="vertical" className="h-full w-px bg-border" />
        <div className="flex-1">{renderTaskSettingsContent()}</div>
      </main>
    </div>
  );
};

export default TaskSettings;
