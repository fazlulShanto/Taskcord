import { SingleProject } from '@/types/project';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type DashboardProjectStore = {
  selectedProject: SingleProject | undefined;
  projectList: SingleProject[];
  updatedSelectedProject: (newProject: SingleProject | undefined) => void;
  updateProjectList: (projects: SingleProject[]) => void;
};

export const useDashboardProjectStore = create<DashboardProjectStore>()(
  devtools(
    (set) => ({
      selectedProject: undefined,
      projectList: [],
      updatedSelectedProject: (project: SingleProject | undefined) => {
        set((oldState) => ({
          ...oldState,
          selectedProject: project,
        }));
      },
      updateProjectList: (projects: SingleProject[]) => {
        set((oldState) => ({
          ...oldState,
          projectList: projects,
        }));
      },
    }),
    {
      name: 'dashboard-project-store',
    }
  )
);
