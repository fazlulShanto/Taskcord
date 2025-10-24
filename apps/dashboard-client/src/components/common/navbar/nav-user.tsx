import { BadgeCheck, ChevronsUpDown, CreditCard, LogOut, Moon, Sparkles, Sun } from 'lucide-react';

import { ToggleTheme } from '@/components/ThemeProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuthQuery } from '@/queries/useAuthQuery';
import { useAuthStore } from '@/stores/useAuthStore';

export function NavUser() {
  const { data } = useAuthQuery();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const userName = data?.fullName || data?.nickName || 'Annonymous User';
  const userLogo = data?.avatar;
  const userPlan = 'Free Plan';
  const userEmail = data?.email || '';
  const { isMobile } = useSidebar();

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/';
  };

  const renderThemeToggler = () => {
    return (
      <ToggleTheme
        render={({ theme, setTheme }) => {
          return (
            <Button
              variant="ghost"
              className="h-6 w-full justify-start px-0 text-sm font-normal"
              onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark');
              }}
            >
              {theme === 'dark' ? <Moon /> : <Sun />}
              Toggle Theme
            </Button>
          );
        }}
      />
    );
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={userLogo} alt={userName} />
                <AvatarFallback className="rounded-lg">{userName.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userName}</span>
                <span className="truncate text-xs">{userPlan}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'top'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={userLogo} alt={userName} />
                  <AvatarFallback className="rounded-lg">{userName.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{userName}</span>
                  <span className="truncate text-xs">{userEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>{renderThemeToggler()}</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
