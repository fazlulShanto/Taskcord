import {
  MoreHorizontal,
  Frame,
  PieChart,
  Map,
  PinIcon,
  Settings2,
  Eye,
  PinOff,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const dummyProjectData = [
  {
    name: 'Design Engineering',
    url: '#',
    icon: Frame,
  },
  {
    name: 'Sales & Marketing',
    url: '#',
    icon: PieChart,
  },
  {
    name: 'Travel',
    url: '#',
    icon: Map,
  },
];

export function NavProjects() {
  const projects = dummyProjectData;
  const { isMobile, open } = useSidebar();

  return (
    // <SidebarGroup className="group-data-[collapsible=icon]:hidden">
    <SidebarGroup>
      <SidebarGroupLabel>
        <PinIcon className="mr-1 rotate-45" /> Pinned Projects
      </SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton tooltip={item.name}>
              <item.icon />
              <span>{item.name}</span>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                disabled={!open}
                className={!open ? 'hidden' : 'visible'}
              >
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
              >
                <DropdownMenuItem>
                  <PinOff className="text-destructive" />
                  <span className="text-destructive">Unpin Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Eye className="text-muted-foreground" />
                  <span>View Tasks</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings2 className="text-muted-foreground" />
                  <span>Project Settings</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
