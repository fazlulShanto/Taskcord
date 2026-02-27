import { AutosizeTextarea } from '@/components/extended-ui/autosize-textarea';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input, InputWithCounter } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const taskTypeFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Name must be at least 1 character.',
    })
    .max(160, {
      message: 'Name must not be longer than 30 characters.',
    }),
  order: z
    .number()
    .min(1, {
      message: 'Order must be at least 1',
    })
    .max(Number.MAX_SAFE_INTEGER, {
      message: 'Order must not be longer than ' + Number.MAX_SAFE_INTEGER,
    }),
  description: z.string().optional(),
});

export type TaskTypeFormData = z.infer<typeof taskTypeFormSchema>;

interface TaskTypeFormProps {
  taskTypeFormData?: TaskTypeFormData;
  onSubmit: (data: TaskTypeFormData) => void;
  onCancel: () => void;
}

export const TaskTypeForm: FC<TaskTypeFormProps> = ({ onSubmit, taskTypeFormData, onCancel }) => {
  const form = useForm<TaskTypeFormData>({
    resolver: zodResolver(taskTypeFormSchema),
    defaultValues: taskTypeFormData ?? {
      name: '',
      description: '',
      order: 1,
    },
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <InputWithCounter maxLength={24} placeholder="Enter task type name" {...field} />
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
                  <AutosizeTextarea
                    maxHeight={220}
                    placeholder="Describe the task type and its purpose."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => {
                      field.onChange(+e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end gap-2">
            <Button
              size={'sm'}
              variant={'destructive'}
              type="button"
              onClick={() => {
                form.reset();
                onCancel();
              }}
            >
              Cancel
            </Button>
            <Button size={'sm'} type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
