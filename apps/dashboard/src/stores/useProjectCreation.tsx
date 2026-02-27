import { type UserServerData } from '@/pages/onboarding/interfaces';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type ProjectCreationStore = {
  projectName: string;
  projectDescription: string;
  projectType: 'general' | 'software' | 'marketing' | 'design';
  updateProjectDetails: (values: {
    projectName: string;
    projectDescription: string;
    projectType: 'general' | 'software' | 'marketing' | 'design';
  }) => void;
  serverList: UserServerData[];
  selectedServer: UserServerData | null;
  updateSelectedServer: (server: UserServerData | null) => void;
  updateServerList: (serverList: UserServerData[]) => void;
};

export const useProjectCreation = create<ProjectCreationStore>()(
  devtools(
    (set) => ({
      projectName: '',
      projectDescription: '',
      projectType: 'general',
      serverList: [],
      selectedServer: null,
      updateServerList: (serverList: UserServerData[]) => {
        set((oldState) => ({
          ...oldState,
          serverList,
        }));
      },
      updateSelectedServer: (server: UserServerData | null) => {
        set((oldState) => ({
          ...oldState,
          selectedServer: server,
        }));
      },
      updateProjectDetails: (values) => {
        set((oldState) => ({
          ...oldState,
          ...values,
        }));
      },
    }),
    {
      name: 'project-creation-store',
    }
  )
);
