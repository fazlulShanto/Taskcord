import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ClientDataTable } from '@/components/ui/ClientDataTable';
import { SingleProject } from '@/types/project';
import { ColumnDef } from '@tanstack/react-table';
import { FC } from 'react';

interface ProjectListProps {
  projectList: SingleProject[];
}

const defaultFallbackValue = '--';

const ProjectListTableColumns: ColumnDef<SingleProject>[] = [
  {
    header: 'Project Name',
    accessorKey: 'title',
    cell: ({ getValue }) => (
      <span className="font-semibold">{`${getValue() || defaultFallbackValue}`}</span>
    ),
  },
  {
    header: 'Project description',
    accessorKey: 'description',
    cell: ({ getValue }) => getValue() || defaultFallbackValue,
  },
  {
    header: 'Project Status',
    accessorKey: 'status',
    cell: ({ getValue }) => getValue() || 'No Status',
  },
  {
    header: 'Started At',
    accessorKey: 'startingTimestamp',
    cell: ({ getValue }) => getValue() || defaultFallbackValue,
  },
  {
    header: 'Project Owner',
    accessorKey: 'creatorId',
    cell: ({ getValue }) => getValue() || defaultFallbackValue,
  },
];

export const DashboardProjectList: FC<ProjectListProps> = ({ projectList }) => {
  return (
    <div>
      <div className="flex-between mb-2">
        <p className="mb-3 text-lg font-medium">Project List</p>
        <Button disabled size={'sm'}>
          + Create new project
        </Button>
      </div>
      <Card>
        <div className="w-full rounded-lg border-0">
          <ClientDataTable data={projectList} columns={ProjectListTableColumns} />
        </div>
      </Card>
    </div>
  );
};
