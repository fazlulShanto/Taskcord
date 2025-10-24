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
