import { useAuthQuery } from '@/queries/useAuthQuery';
import { useProjectListQuery } from '@/queries/useProjectQuery';
import { CircleCheckBig, FolderKanban, GitPullRequestDraft, ListTodo } from 'lucide-react';
import { ActiveProjects } from './ActiveProjects';
import { EmptyDashboard } from './EmptyDashboard';
import { OverviewCard } from './OverviewCard';
import { DashboardProjectList } from './ProjectList';

export const OverviewDashboard = () => {
  const { data } = useProjectListQuery();
  const { data: authData } = useAuthQuery();

  const userName = authData?.fullName || 'Annonymous User';
  const projectList = data?.projects || [];

  if (projectList.length === 0) {
    return <EmptyDashboard />;
  }

  return (
    <div className="bg-background flex h-full w-full flex-col gap-8 p-8">
      <h1 className="text-2xl font-semibold">Welcome Back, {userName}!</h1>
      <div className="grid w-full grid-cols-4 gap-3">
        <OverviewCard
          title="Total Projects"
          statData={projectList?.length || 0}
          icon={<FolderKanban className="text-muted-foreground size-10" />}
        />
        <OverviewCard
          title="Completed"
          statData={15}
          icon={<CircleCheckBig className="text-muted-foreground size-10" />}
        />
        <OverviewCard
          title="In Progress"
          statData={15}
          icon={<GitPullRequestDraft className="text-muted-foreground size-10" />}
        />
        <OverviewCard
          title="In Todo"
          statData={15}
          icon={<ListTodo className="text-muted-foreground size-10" />}
        />
      </div>
      <ActiveProjects projectList={projectList} />
      <DashboardProjectList projectList={projectList} />
    </div>
  );
};

export default OverviewDashboard;
