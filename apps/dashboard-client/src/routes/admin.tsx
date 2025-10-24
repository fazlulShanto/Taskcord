import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/admin')({
  component: AdminComponent,
});

function AdminComponent() {
  return (
    <div className="bg-gray-900 text-white">
      <Outlet />
    </div>
  );
}
