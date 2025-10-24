import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';

const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Project Name is required' })
    .min(2, { message: 'Project name is too small.' }),
  description: z.string().min(1, { message: 'Project description is required' }).min(4, {
    message: 'Project description is too small.',
  }),
});

type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

export const CreateProjectForm = () => {
  const handleCreateProject = (data: CreateProjectFormValues) => {
    console.log(data);
  };

  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="mt-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-purple-600 hover:shadow-xl"
        >
          <Plus className="h-8 w-8" />
          Create New Project
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-[90vw] rounded-md sm:max-w-xl"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>Create a new project to get started.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateProject)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Project Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Project Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Create Project</Button>
            </DialogFooter>{' '}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
