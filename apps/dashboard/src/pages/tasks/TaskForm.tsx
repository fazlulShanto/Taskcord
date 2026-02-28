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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLabelQuery } from '@/queries/useLabelQuery';
import { useMilestonesQuery } from '@/queries/useMilestoneQuery';
import { useProjectUserRolesQuery } from '@/queries/useProjectUserRolesQuery';
import { useCreateTaskMutation } from '@/queries/useTaskQuery';
import { useTaskStatusesQuery } from '@/queries/useTaskStatusQuery';
import { useTaskTypesQuery } from '@/queries/useTaskTypeQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const TASK_PRIORITIES = ['highest', 'high', 'medium', 'low', 'lowest'] as const;

// Form Schema based on Task type
const taskFormSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
  description: z.string().min(4, { message: 'Description must be at least 4 characters' }),
  label: z.string().min(1, { message: 'Label is required' }),
  issueType: z.string().min(1, { message: 'Issue type is required' }),
  assignee: z.string().min(1, { message: 'Assignee is required' }),
  milestone: z.string().min(1, { message: 'Milestone is required' }),
  status: z.string().min(1, { message: 'Status is required' }),
  priority: z.enum(TASK_PRIORITIES, { message: 'Priority is required' }),
  dueDate: z.string().min(1, { message: 'Due date is required' }),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  onSuccess?: () => void;
}

export const TaskForm = ({ onSuccess }: TaskFormProps) => {
  const { projectId = '' } = useParams({ strict: false });
  const { data: taskTypeData } = useTaskTypesQuery(projectId);
  const { data: userRoleData } = useProjectUserRolesQuery(projectId);
  const { data: milestoneData } = useMilestonesQuery(projectId);
  const { data: taskStatusData } = useTaskStatusesQuery(projectId);
  const { data: labelData } = useLabelQuery(projectId);
  const { mutateAsync: createTask, isPending: isCreatingTask } = useCreateTaskMutation(projectId);

  const projectUsers = userRoleData?.users ?? [];
  const milestones = milestoneData?.data.milestones ?? [];
  const statuses = taskStatusData?.data.statuses ?? [];
  const labels = (labelData?.data.taskLabels ?? []).filter((label) => !label.isStatus);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      label: '',
      issueType: '',
      assignee: '',
      milestone: '',
      status: '',
      priority: 'medium', // Default priority
      dueDate: '',
    },
  });

  const onSubmit = async (data: TaskFormValues) => {
    await createTask({
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      milestoneId: data.milestone,
      assignees: [data.assignee],
      dueDate: data.dueDate,
    });

    form.reset();
    onSuccess?.();
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select label" />
                    </SelectTrigger>
                    <SelectContent>
                      {labels.map((label) => (
                        <SelectItem key={label.id} value={label.id}>
                          {label.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      {(taskTypeData?.data.taskTypes ?? []).map((taskType) => (
                        <SelectItem key={taskType.id} value={taskType.id}>
                          {taskType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectUsers.map((user) => {
                        const displayName =
                          user.fullName ?? user.nickName ?? user.email ?? user.discordId;

                        return (
                          <SelectItem key={user.id} value={user.id}>
                            {displayName}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select milestone" />
                    </SelectTrigger>
                    <SelectContent>
                      {milestones.map((milestone) => (
                        <SelectItem key={milestone.id} value={milestone.id}>
                          {milestone.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.id} value={status.name}>
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {TASK_PRIORITIES.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

        <Button type="submit" className="w-full" disabled={isCreatingTask}>
          {isCreatingTask ? 'Creating...' : 'Create Task'}
        </Button>
      </form>
    </Form>
  );
};
