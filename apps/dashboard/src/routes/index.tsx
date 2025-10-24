import LandingPage from '@/pages/landingPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: LandingPage,
});
