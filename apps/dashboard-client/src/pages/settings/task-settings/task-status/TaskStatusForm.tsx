import { AutosizeTextarea } from '@/components/extended-ui/autosize-textarea';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input, InputWithCounter } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';

import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const taskStatusFormSchema = z.object({
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
  backgroundColor: z.string().min(1, {
    message: 'Background color can not be empty',
  }),
  foregroundColor: z.string().min(1, {
    message: 'Foreground color can not be empty',
  }),
});

export type TaskStatusFormData = z.infer<typeof taskStatusFormSchema>;

interface TaskStatusFormProps {
  statusFormData?: TaskStatusFormData;
  onSubmit: (data: TaskStatusFormData) => void;
  onCancel: () => void;
}

export const TaskStatusForm: FC<TaskStatusFormProps> = ({ onSubmit, statusFormData, onCancel }) => {
  const form = useForm<TaskStatusFormData>({
    resolver: zodResolver(taskStatusFormSchema),
    defaultValues: statusFormData ?? {
      name: '',
      description: '',
      order: 1,
      backgroundColor: '#164b37',
      foregroundColor: '#1aeab6',
    },
  });
  const watchName = form.watch('name');
  const watchBackgroundColor = form.watch('backgroundColor');
  const watchForegroundColor = form.watch('foregroundColor');

  return (
    <div className="flex w-full flex-col gap-4">
      <TaskStatusFormPreview
        name={watchName}
        backgroundColor={watchBackgroundColor}
        foregroundColor={watchForegroundColor}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <InputWithCounter maxLength={24} placeholder="Enter status name" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
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
                    placeholder="Describe the status and its purpose."
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

          <div className="flex w-full gap-2">
            <FormField
              control={form.control}
              name="backgroundColor"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Background Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="foregroundColor"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Foreground Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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

export const TaskStatusFormPreview = ({
  name,
  backgroundColor,
  foregroundColor,
}: {
  name: string;
  backgroundColor: string;
  foregroundColor: string;
}) => {
  if (!name) return null;
  return (
    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
      {/* <span className="text-sm text-muted-foreground">Preview :</span> */}
      <div
        className="h-auto w-auto rounded-2xl border border-primary px-2"
        style={{ backgroundColor: backgroundColor, borderColor: foregroundColor }}
      >
        <span className="text-sm font-medium" style={{ color: foregroundColor }}>
          {name || ''}
        </span>
      </div>
    </div>
  );
};
