import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Plus } from 'lucide-react';
import { FC } from 'react';
import { z } from 'zod';
import { TaskForm } from './TaskForm';
interface CreateTaskProps {
  // open: boolean;
  // onOpenChange: (open: boolean) => void;
}

/* @ts-expect-error - TODO: fix this */
const _FormSchema = z.object({
  title: z.string().min(2, {
    message: 'Title too short.',
  }),
});

export const CreateTask: FC<CreateTaskProps> = () => {
  return (
    <Sheet modal={false}>
      <SheetTrigger asChild>
        <Button>
          <Plus
            strokeWidth={2.5}
            className="h-5 w-5 transition-transform duration-300 group-hover:rotate-180"
          />
          Create New Task
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-full max-w-lg overflow-y-scroll p-0 sm:max-w-2xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="border-b px-4 py-1.5">
          <SheetTitle>Create New Task</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 p-4">
          <TaskForm />
        </div>
      </SheetContent>
    </Sheet>
  );
};
