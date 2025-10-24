import { TaskTabsType } from '@/types/tasks';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type TaskStore = {
  selectedTab: TaskTabsType;
  updateSelectedTab: (tab: TaskTabsType) => void;
};

export const useTaskStore = create<TaskStore>()(
  devtools(
    (set) => ({
      selectedTab: 'kanban',
      updateSelectedTab: (selectedTab: TaskTabsType) => {
        set((oldState) => ({
          ...oldState,
          selectedTab: selectedTab,
        }));
      },
    }),
    {
      name: 'task-store',
    }
  )
);
