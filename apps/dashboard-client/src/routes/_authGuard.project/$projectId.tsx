import { AppSidebar } from '@/components/common/navbar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_authGuard/project/$projectId')({
  component: RouteComponent,
});

function RouteComponent() {
  // TODO: handle teamauth here
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
