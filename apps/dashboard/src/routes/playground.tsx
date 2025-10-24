import { createFileRoute } from '@tanstack/react-router';
import { PlayGround } from '@/pages/playground';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/common/navbar/app-sidebar';
export const Route = createFileRoute('/playground')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <PlayGround />
      </SidebarInset>
    </SidebarProvider>
  );
}
