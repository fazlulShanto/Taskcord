import { create } from 'zustand';

type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};
type LandingDashboardStore = {
  projectList: Project[];
};

export const useLandingDashboard = create<LandingDashboardStore>(() => ({
  projectList: [],
}));
