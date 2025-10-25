import { cn } from '@/lib/utils';

export const AppLogo = ({ className }: { className?: string }) => {
  return <img src="/applogo.svg" alt="App Logo" className={cn('size-8', className)} />;
};
