export type SingleProject = {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  managerId: string;
  projectType: 'general' | 'software' | 'marketing' | 'design';
  status: string;
  createdAt: string;
  logo: string;
  startingTimestamp: string | null;
  estimatedCompletionTimestamp: string | null;
  completedAt: string | null;
};
