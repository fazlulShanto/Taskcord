import { FC } from 'react';
import { useAuthQuery } from '@/queries/useAuthQuery';
import { Navigate } from '@tanstack/react-router';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuthQuery();

  // TODO: show loading UI

  if (isLoading) return <div className="flex-center h-screen w-screen">Loading...</div>;

  // if not authenticated, redirect to login
  if (!isAuthenticated) return <Navigate to="/" />;

  // if authenticated, render children
  return <>{children}</>;
};
