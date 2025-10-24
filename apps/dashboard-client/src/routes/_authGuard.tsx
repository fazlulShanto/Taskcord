import { AuthGuard } from '@/components/common/AuthGuard';
import { useAuthStore } from '@/stores/useAuthStore';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_authGuard')({
  component: RouteComponent,
  beforeLoad: async (ctx) => {
    const authToken = new URLSearchParams(ctx.location.search).get('auth_token');
    if (authToken) {
      localStorage.setItem('token', authToken);
      useAuthStore.setState({
        isAuthenticated: true,
        accessToken: authToken,
      });
    }
    return true;
  },
});

function RouteComponent() {
  return (
    <AuthGuard>
      <Outlet />
    </AuthGuard>
  );
}
