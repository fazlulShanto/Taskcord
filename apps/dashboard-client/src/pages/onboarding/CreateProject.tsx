import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
const projectDetailsFormSchema = z.object({
  projectName: z.string().min(1, 'Project name is required'),
  projectDescription: z.string().min(1, 'Project description is required'),
});
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useProjectCreation } from '@/stores/useProjectCreation';
import { FC } from 'react';
import { Separator } from '@/components/ui/separator';

export interface ProjectDetailsProps {
  onNext: () => void;
}

export const ProjectDetails: FC<ProjectDetailsProps> = ({ onNext }) => {
  const updateProjectDetails = useProjectCreation((state) => state.updateProjectDetails);
  const projectName = useProjectCreation((state) => state.projectName);
  const projectDescription = useProjectCreation((state) => state.projectDescription);

  const formInstance = useForm({
    resolver: zodResolver(projectDetailsFormSchema),
    defaultValues: {
      projectName: projectName,
      projectDescription: projectDescription,
    },
    mode: 'onChange',
  });

  const onSubmit = (values: z.infer<typeof projectDetailsFormSchema>) => {
    //update the values into the store
    updateProjectDetails(values);
    onNext();
  };

  return (
    <div className="relative">
      <div className="p-3">
        <h2 className="text-xl font-bold">Project Informations</h2>
        <p className="text-sm text-muted-foreground">Provide project info</p>
      </div>
      <Separator />
      <Form {...formInstance}>
        <form onSubmit={formInstance.handleSubmit(onSubmit)} className="space-y-4 p-6">
          <FormField
            control={formInstance.control}
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter project name" {...field} />
                </FormControl>
                <FormDescription>This is your project name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formInstance.control}
            name="projectDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter project description" {...field} />
                </FormControl>
                <FormDescription>write details about the project.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full justify-end">
            <Button type="submit" className="ml-auto">
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
