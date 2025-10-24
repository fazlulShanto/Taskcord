export interface Label {
  id: string;
  description: string | null;
  updatedAt: Date | null;
  createdAt: Date | null;
  creatorId: string;
  projectId: string;
  label: string;
  color: string;
}

export type LabelCreate = Pick<Label, 'label' | 'color' | 'description'>;
