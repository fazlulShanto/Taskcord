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
    <div className="flex h-full w-full flex-col gap-8 bg-background p-8">
      <h1 className="text-2xl font-semibold">Welcome Back, {userName}!</h1>
      <div className="grid w-full grid-cols-4 gap-3">
        <OverviewCard
          title="Total Projects"
          statData={projectList?.length || 0}
          icon={<FolderKanban className="size-10 text-muted-foreground" />}
        />
        <OverviewCard
          title="Completed"
          statData={15}
          icon={<CircleCheckBig className="size-10 text-muted-foreground" />}
        />
        <OverviewCard
          title="In Progress"
          statData={15}
          icon={<GitPullRequestDraft className="size-10 text-muted-foreground" />}
        />
        <OverviewCard
          title="In Todo"
          statData={15}
          icon={<ListTodo className="size-10 text-muted-foreground" />}
        />
      </div>
      <ActiveProjects projectList={projectList} />
      <DashboardProjectList projectList={projectList} />
    </div>
  );
};

export default OverviewDashboard;
