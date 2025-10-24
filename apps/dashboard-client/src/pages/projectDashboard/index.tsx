import { useProjectListQuery } from '@/queries/useProjectQuery';
import { SingleProject } from '@/types/project';
import { useParams } from '@tanstack/react-router';
import { FC } from 'react';
import { ActivityChart } from './ActivityChart';
import { ProjectDashboardCard } from './ProjectDashboardCard';
import { TaskPieChart } from './TaskPieChart';

interface ProjectDashboardProps {}

export const ProjectDashboard: FC<ProjectDashboardProps> = () => {
  const { projectId } = useParams({ strict: false });
  const { data } = useProjectListQuery();
  const project = data?.projects?.find((project: SingleProject) => project.id === projectId);
  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="h-full w-full space-y-3 p-4">
      <div>
        <h1 className="text-lg font-semibold">{project.title} Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        <ProjectDashboardCard title="Total Task" statData={parseInt(454 * Math.random() + '')} />
        <ProjectDashboardCard title="In Progress" statData={parseInt(454 * Math.random() + '')} />
        <ProjectDashboardCard title="Assigned" statData={parseInt(454 * Math.random() + '')} />
      </div>
      <div className="flex justify-between gap-2">
        <TaskPieChart
          data={{
            todo: 1,
            completed: 8,
            progress: 4,
          }}
        />
        <div className="flex-grow">
          <ActivityChart />
        </div>
      </div>
    </div>
  );
};
