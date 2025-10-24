import { FC } from 'react';
import { TaskBoardContainer } from './TaskBoardContainer';

interface IndexProps {}

export const Tasks: FC<IndexProps> = () => {
  // const { selectedProject } = useDashboardProjectStore();
  return (
    <div className="flex h-full w-full flex-col">
      <div className="border-b p-2.5 text-lg font-semibold">Tasks</div>
      <div className="flex-1 overflow-y-auto p-2">
        <TaskBoardContainer />
      </div>
    </div>
  );
};
