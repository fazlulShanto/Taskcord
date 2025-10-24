import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import ErrorBoundary from './components/ErrorBoundary';
import PageNotFound from './components/PageNotFound';
import { ThemeProvider } from './components/ThemeProvider';
import { SonnerToaster } from './components/ui/sonner';
import './index.css';
import { routeTree } from './routeTree.gen';
const queryClient = new QueryClient();

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultErrorComponent: ErrorBoundary,
  defaultNotFoundComponent: PageNotFound,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SonnerToaster />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
};
