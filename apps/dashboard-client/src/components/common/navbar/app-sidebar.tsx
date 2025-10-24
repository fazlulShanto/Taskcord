import { NavMain } from '@/components/common/navbar/nav-main';
import { NavProjects } from '@/components/common/navbar/nav-projects';
import { NavUser } from '@/components/common/navbar/nav-user';
import { ProjectSwitcher } from '@/components/common/navbar/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useDashboardProjectStore } from '@/stores/usedashboardStore';
import { Cable, ChartNoAxesCombined, LayoutDashboard, ListTodo, Settings } from 'lucide-react';
import * as React from 'react';

const getNavbarDataWithProjectId = (projectId: string | undefined) => {
  if (!projectId) {
    return [];
  }
  const NavbarData = [
    {
      title: 'Dashboard',
      url: `/project/${projectId}/dashboard`,
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      title: 'Tasks',
      url: `/project/${projectId}/tasks`,
      icon: ListTodo,
      items: [],
    },
    {
      title: 'Integrations',
      url: `/project/${projectId}/integrations`,
      icon: Cable,
      items: [],
    },
    {
      title: 'Settings',
      url: `/project/${projectId}/settings`,
      icon: Settings,
      items: [
        {
          title: 'Team Informations',
          url: `/project/${projectId}/settings/team-info`,
        },
        {
          title: 'Member Management',
          url: `/project/${projectId}/settings/member-management`,
        },
        {
          title: 'Task Settings',
          url: `/project/${projectId}/settings/task-settings`,
        },
      ],
    },
  ];
  return NavbarData;
};

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { selectedProject } = useDashboardProjectStore();

  const mainNavData = getNavbarDataWithProjectId(selectedProject?.id);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-border">
        <ProjectSwitcher />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <NavMain
          navbarData={[
            {
              title: 'Overview',
              url: '/overview',
              icon: ChartNoAxesCombined,
              isActive: true,
              items: [],
            },
          ]}
          hideLabel
          key={'overview-nav'}
        />
        <NavMain
          key="main-nav-menu"
          navbarData={mainNavData || []}
          label={selectedProject?.title || 'Project Specific Menu'}
        />
        <NavProjects />
      </SidebarContent>
      <SidebarFooter className="border-t border-border">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
