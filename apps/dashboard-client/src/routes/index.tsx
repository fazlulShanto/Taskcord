import LandingPage from '@/pages/landingPage/NewLandingPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: LandingPage,
});
