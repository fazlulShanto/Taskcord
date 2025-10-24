import { CreateProjectForm } from '@/components/project-form';
import { PackageOpen } from 'lucide-react';
import { type FC } from 'react';

interface EmptyDashboardProps {
  onCreateProject?: () => void;
}

export const EmptyDashboard: FC<EmptyDashboardProps> = () => {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="flex max-w-md flex-col items-center justify-center space-y-6 text-center">
        <PackageOpen className="h-20 w-20 text-blue-500 opacity-80" />

        <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
          Start Your First Project
        </h1>
        <p className="text-muted-foreground text-lg">
          Create a new project and begin your journey. Your workspace is ready for amazing ideas.
        </p>

        <CreateProjectForm />

        <p className="text-muted-foreground mt-4 text-sm">
          Need help getting started? Check out our{' '}
          <a href="/docs" className="text-blue-500 underline hover:text-blue-600">
            documentation
          </a>
        </p>
      </div>
    </div>
  );
};
