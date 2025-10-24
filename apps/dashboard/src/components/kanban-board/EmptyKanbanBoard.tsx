import { CreateTask } from '@/pages/tasks/CreateTask';
import { ClipboardCheck } from 'lucide-react';

export const EmptyKanbanBoard = () => {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="from-background to-secondary relative w-full max-w-md transform rounded-xl border bg-gradient-to-br p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="from-primary/20 to-primary/5 absolute -top-1 -right-1 -bottom-1 -left-1 rounded-xl bg-gradient-to-br opacity-50 blur-xl"></div>
        <div className="relative flex flex-col items-center gap-y-6 text-center">
          <div className="group from-primary/10 to-primary/5 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br shadow-inner transition-all duration-300 hover:scale-105">
            <div className="bg-background flex h-20 w-20 items-center justify-center rounded-full shadow-sm backdrop-blur-sm">
              <ClipboardCheck className="text-primary h-12 w-12 transition-all duration-300 group-hover:scale-110" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-y-3">
            <h2 className="from-primary to-secondary text-primary bg-gradient-to-r bg-clip-text text-2xl font-bold">
              There are no tasks yet
            </h2>
            <p className="text-md text-muted-foreground">
              Get started by creating your first task!
            </p>
          </div>
          <CreateTask />
        </div>
      </div>
    </div>
  );
};
