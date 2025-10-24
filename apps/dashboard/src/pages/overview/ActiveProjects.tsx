import { Card, CardContent } from '@/components/ui/card';
import { type SingleProject } from '@/types/project';
import { Link } from '@tanstack/react-router';
import { type FC } from 'react';

interface ActiveProjectsProps {
  projectList: SingleProject[];
}

export const ActiveProjects: FC<ActiveProjectsProps> = ({ projectList }) => {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-primary text-lg font-semibold">Active Projects</p>
      <div className="flex flex-wrap gap-3">
        {projectList.map((project) => {
          return (
            <Card key={project.id} className="min-w-[200px]">
              <CardContent className="flex flex-col gap-3 p-3">
                <p className="text-xl font-medium">{project.title}</p>
                <p className="text-muted-foreground text-sm">{project.description}</p>
                <Link
                  className="rounded-md border p-0.5 text-center"
                  to="/project/$projectId/dashboard"
                  params={{ projectId: project.id }}
                >
                  View
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>{' '}
    </div>
  );
};
