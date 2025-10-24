import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCreateProjectMutation } from '@/queries/useProjectQuery';
import { useProjectCreation } from '@/stores/useProjectCreation';
import { useNavigate } from '@tanstack/react-router';
import { FC } from 'react';
interface ConnectGithubProps {
  onNext: () => void;
}

export const ConnectGithub: FC<ConnectGithubProps> = () => {
  const navigate = useNavigate();
  const createProjectMutation = useCreateProjectMutation();
  const projectName = useProjectCreation((state) => state.projectName);
  const selectedServer = useProjectCreation((state) => state.selectedServer);
  const projectDescription = useProjectCreation((state) => state.projectDescription);

  const handleCreateProject = async () => {
    const projectData = {
      title: projectName,
      description: projectDescription,
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      discordServerId: selectedServer?.id!,
    };

    createProjectMutation.mutate(projectData, {
      onSuccess: (res) => {
        const projectId = res?.project?.id;
        if (!projectId) return;
        navigate({
          to: '/project/$projectId/dashboard',
          params: {
            projectId: projectId,
          },
        });
        // onNext();
        // Optionally, you can navigate to a new page or perform other actions
      },
      onError: (error) => {
        console.error('Error creating project:', error);
      },
    });
  };

  const renderStepHeader = () => {
    return (
      <div className="sticky -top-0.5 z-10 bg-background p-3">
        <h2 className="text-xl font-bold text-primary">GitHub Integration</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Seamlessly connect your projects with GitHub repositories.
        </p>
      </div>
    );
  };

  return (
    <div className="relative">
      {renderStepHeader()}
      <Separator />
      <div className="relative flex flex-col items-center justify-center p-6">
        <div className="relative w-full max-w-2xl transform rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-white shadow-2xl transition-transform">
          <div className="absolute -right-2 -top-2 animate-bounce">
            <div className="flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-600 shadow-lg">
              <span className="relative mr-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500"></span>
              </span>
              Comming Soon
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <svg className="mt-1 h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              <div>
                <h3 className="font-semibold">Create & Manage Issues</h3>
                <p className="text-sm opacity-90">
                  Create GitHub issues directly from our platform and link them to tasks
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <svg className="mt-1 h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              <div>
                <h3 className="font-semibold">Multi-Repository Support</h3>
                <p className="text-sm opacity-90">
                  Connect multiple repositories to a single project for unified management
                </p>
              </div>
            </div>
          </div>
        </div>
        <Button onClick={handleCreateProject} className="ml-auto mt-6">
          Create Project
        </Button>
      </div>
    </div>
  );
};
