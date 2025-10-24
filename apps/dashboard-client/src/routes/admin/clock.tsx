import { createFileRoute } from '@tanstack/react-router';
import ClockPage from '@/pages/clockPage';

export const Route = createFileRoute('/admin/clock')({
  component: ClockPage,
});
