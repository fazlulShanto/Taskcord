import { BoxSelect, ChevronsUpDown, Plus } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { toast } from '@/components/ui/sonner';
import { useProjectListQuery } from '@/queries/useProjectQuery';
import { useDashboardProjectStore } from '@/stores/usedashboardStore';

export function ProjectSwitcher() {
  const { data, isLoading, isError } = useProjectListQuery();
  const { updatedSelectedProject, selectedProject } = useDashboardProjectStore();
  const projectList = data?.projects || [];
  const { isMobile } = useSidebar();

  if (isLoading) {
    return <div className="h-full w-full animate-pulse bg-gray-600">loading</div>;
  }
  if (isError) {
    toast({
      title: 'Failed',
      description: 'Failed to fetch projects',
      toastType: 'destructive',
    });
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="default"
              className="p-1 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-6 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <BoxSelect className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{selectedProject?.title}</span>
                <span className="truncate text-xs">{selectedProject?.status}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={isMobile ? 4 : 12}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Projects you are a part of
            </DropdownMenuLabel>
            {projectList.map((project, index) => (
              <DropdownMenuItem
                key={project.title}
                disabled={selectedProject?.id === project.id}
                onClick={() => updatedSelectedProject(project)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <BoxSelect className="size-4 shrink-0" />
                </div>
                {project.title}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Create a new Project</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
