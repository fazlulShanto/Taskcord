export type SingleProject = {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  managerId: string;
  status: string;
  createdAt: string;
  logo: string;
  startingTimestamp: string | null;
  estimatedCompletionTimestamp: string | null;
  completedAt: string | null;
};
