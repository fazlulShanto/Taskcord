import { FC } from 'react';
import { EmptyKanbanBoard } from './EmptyKanbanBoard';

interface KanbanBoardProps {}

export const KanbanBoard: FC<KanbanBoardProps> = () => {
  return (
    <div className="flex h-full w-full flex-col gap-y-4">
      <div className="flex h-full w-full flex-1 flex-col gap-y-4">
        <EmptyKanbanBoard />
      </div>
    </div>
  );
};
