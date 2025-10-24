import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PlayGround } from '../playground';

// Form Schema based on Task type
const taskFormSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
  description: z.string().min(4, { message: 'Description must be at least 4 characters' }),
  label: z.string().min(1, { message: 'Label is required' }),
  issueType: z.string().min(1, { message: 'Issue type is required' }),
  assignee: z.string().min(1, { message: 'Assignee is required' }),
  milestone: z.string().min(1, { message: 'Milestone is required' }),
  status: z.string().min(1, { message: 'Status is required' }),
  priority: z.string().min(1, { message: 'Priority is required' }),
  dueDate: z.string().min(1, { message: 'Due date is required' }),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

export const TaskForm = () => {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      label: '',
      issueType: '',
      assignee: '',
      milestone: '',
      status: 'todo', // Default status
      priority: 'medium', // Default priority
      dueDate: '',
    },
  });

  const onSubmit = (data: TaskFormValues) => {
    console.log('Form submitted:', data);
    // Handle form submission here
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} />
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
                <Textarea placeholder="Enter task description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="label"
            render={() => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <PlayGround />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="issueType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Type</FormLabel>
                <FormControl>
                  <Input placeholder="Enter issue type" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="assignee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assignee</FormLabel>
                <FormControl>
                  <Input placeholder="Enter assignee" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="milestone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Milestone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter milestone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Input placeholder="Enter status" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <Input placeholder="Enter priority" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Create Task
        </Button>
      </form>
    </Form>
  );
};
