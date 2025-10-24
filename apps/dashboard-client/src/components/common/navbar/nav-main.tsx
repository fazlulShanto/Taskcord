import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@components/ui/sidebar';
import { Link, useMatchRoute, useNavigate } from '@tanstack/react-router';
import { Cable, ChevronRight, LayoutDashboard, ListTodo, Settings } from 'lucide-react';
import { FC } from 'react';
const NavbarData = [
  {
    title: 'Dashboard',
    url: '#',
    icon: LayoutDashboard,
    isActive: true,
    items: [],
  },
  {
    title: 'Tasks',
    url: '#',
    icon: ListTodo,
    items: [],
  },
  {
    title: 'Integrations',
    url: '#',
    icon: Cable,
    items: [],
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
    items: [
      {
        title: 'Project Informations',
        url: '#',
      },
      {
        title: 'Member Management',
        url: '#',
      },
    ],
  },
];

type NavMainItems = typeof NavbarData;
interface NavMainItemProps {
  navbarData?: NavMainItems;
  label?: string;
  hideLabel?: boolean;
}

export const NavMain: FC<NavMainItemProps> = ({
  navbarData,
  label = 'Project Menu',
  hideLabel = false,
}) => {
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();
  const items = Array.isArray(navbarData) && navbarData.length ? navbarData : NavbarData;

  const matchedRoute = items
    .filter((navItem) => {
      try {
        return !!matchRoute({ to: navItem.url, fuzzy: true });
      } catch {
        return false;
      }
    })
    ?.at(0);

  const renderCollapsibleNabItem = (item: (typeof items)[0]) => {
    return (
      <Collapsible
        key={item.title}
        asChild
        defaultOpen={item.isActive}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items?.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton asChild>
                    <Link to={subItem.url}>
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  };

  const renderSidebarMenuItem = (item: (typeof items)[0]) => {
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          isActive={item.url === matchedRoute?.url}
          tooltip={item.title}
          onClick={() => navigate({ to: item?.url })}
        >
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <SidebarGroup>
      {!hideLabel && <SidebarGroupLabel> {label} </SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => {
          if (item?.items?.length) {
            return renderCollapsibleNabItem(item);
          }
          return renderSidebarMenuItem(item);
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};
