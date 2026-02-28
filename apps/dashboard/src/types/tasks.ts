export type TaskTabsType = 'kanban' | 'list' | 'table' | 'calendar' | 'timeline';
export type Task = {
  title: string;
  description: string;
  label: string;
  issueType: string;
  assignee: string;
  milestone: string;
  status: string;
  priority: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

export type TaskStatus = {
  id: string; // UUID
  name: string;
  color: string; // Can be a hex code or color name
  description: string;
  projectId: string; // UUID
  creatorId: string; // UUID
  order: number;
};

export type TaskType = {
  id: string;
  name: string;
  description: string;
  projectId: string;
  creatorId: string;
  order: number;
};

export type Milestone = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};
