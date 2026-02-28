import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMilestonesQuery } from '@/queries/useMilestoneQuery';
import { useProjectUserRolesQuery } from '@/queries/useProjectUserRolesQuery';
import { useTasksQuery } from '@/queries/useTaskQuery';
import { useParams } from '@tanstack/react-router';
import { Fragment, useMemo, useState } from 'react';
import { CreateTask } from './CreateTask';

type TaskListRow = {
  id: string;
  title: string;
  description: string;
  assignee: {
    name: string;
    avatar?: string;
  };
  dueDate: string;
  milestone: string;
  priority: 'highest' | 'high' | 'medium' | 'low' | 'lowest';
  status: 'todo' | 'in-progress' | 'done';
  createdAt: string;
  updatedAt: string;
};

const getInitials = (name: string) => {
  const chunks = name.trim().split(/\s+/).slice(0, 2);
  return chunks.map((chunk) => chunk[0]?.toUpperCase() ?? '').join('');
};

const StatusBadge = ({ status }: { status: TaskListRow['status'] }) => {
  if (status === 'done') {
    return <Badge variant="secondary">Done</Badge>;
  }

  if (status === 'in-progress') {
    return <Badge>In Progress</Badge>;
  }

  return <Badge variant="outline">Todo</Badge>;
};

const PriorityBadge = ({ priority }: { priority: TaskListRow['priority'] }) => {
  if (priority === 'highest' || priority === 'high') {
    return <Badge variant="outline">{priority}</Badge>;
  }

  if (priority === 'medium') {
    return <Badge variant="secondary">{priority}</Badge>;
  }

  return <Badge variant="outline">{priority}</Badge>;
};

export const TaskListBoard = () => {
  const { projectId = '' } = useParams({ strict: false });
  const [selectedTask, setSelectedTask] = useState<TaskListRow | null>(null);

  const {
    data: taskData,
    isLoading: isLoadingTasks,
    isError: isTasksError,
  } = useTasksQuery(projectId);
  const { data: usersData } = useProjectUserRolesQuery(projectId);
  const { data: milestoneData } = useMilestonesQuery(projectId);

  const userById = useMemo(() => {
    const map = new Map<string, { name: string; avatar?: string }>();
    (usersData?.users ?? []).forEach((user) => {
      map.set(user.id, {
        name: user.fullName ?? user.nickName ?? user.email ?? user.discordId,
        avatar: user.avatar ?? undefined,
      });
    });
    return map;
  }, [usersData?.users]);

  const milestoneById = useMemo(() => {
    const map = new Map<string, string>();
    (milestoneData?.data.milestones ?? []).forEach((milestone) => {
      map.set(milestone.id, milestone.title);
    });
    return map;
  }, [milestoneData?.data.milestones]);

  const listSections = useMemo<Array<{ title: string; tasks: TaskListRow[] }>>(() => {
    const rows: TaskListRow[] = (taskData?.data.tasks ?? []).map((task) => {
      const firstAssigneeId = task.assignees[0];
      const assignee =
        (firstAssigneeId ? userById.get(firstAssigneeId) : undefined) ??
        ({ name: 'Unassigned' } as const);

      const normalizedPriority = task.priority.toLowerCase();
      const priority: TaskListRow['priority'] =
        normalizedPriority === 'highest' ||
        normalizedPriority === 'high' ||
        normalizedPriority === 'medium' ||
        normalizedPriority === 'low' ||
        normalizedPriority === 'lowest'
          ? normalizedPriority
          : 'medium';

      const normalizedStatus = task.status.toLowerCase();
      const status: TaskListRow['status'] =
        normalizedStatus === 'done'
          ? 'done'
          : normalizedStatus === 'in-progress' ||
              normalizedStatus === 'in_progress' ||
              normalizedStatus === 'in progress'
            ? 'in-progress'
            : 'todo';

      return {
        id: task.id,
        title: task.title,
        description: task.description ?? '',
        assignee,
        dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-',
        milestone:
          (task.milestoneId ? milestoneById.get(task.milestoneId) : undefined) ?? 'No milestone',
        priority,
        status,
        createdAt: task.createdAt ? new Date(task.createdAt).toLocaleDateString() : '-',
        updatedAt: task.updatedAt ? new Date(task.updatedAt).toLocaleDateString() : '-',
      };
    });

    const grouped: Record<TaskListRow['status'], TaskListRow[]> = {
      todo: [],
      'in-progress': [],
      done: [],
    };

    rows.forEach((row) => {
      grouped[row.status].push(row);
    });

    return [
      { title: 'Todo', tasks: grouped.todo },
      { title: 'In Progress', tasks: grouped['in-progress'] },
      { title: 'Done', tasks: grouped.done },
    ].filter((section) => section.tasks.length > 0);
  }, [milestoneById, taskData?.data.tasks, userById]);

  if (isLoadingTasks) {
    return <div className="text-muted-foreground p-6">Loading tasks...</div>;
  }

  if (isTasksError) {
    return <div className="text-destructive p-6">Failed to load tasks.</div>;
  }

  return (
    <Sheet
      open={!!selectedTask}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedTask(null);
        }
      }}
    >
      <div className="flex h-full w-full flex-col gap-3">
        <div className="flex items-center justify-end">
          <CreateTask />
        </div>

        {listSections.length === 0 ? (
          <div className="text-muted-foreground rounded-md border p-8 text-center">
            No tasks found for this project.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Task Name</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Milestone</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {listSections.map((section) => (
                  <Fragment key={section.title}>
                    <TableRow
                      key={`${section.title}-header`}
                      className="bg-muted/20 hover:bg-muted/20"
                    >
                      <TableCell colSpan={6} className="py-3 text-base font-semibold">
                        {section.title}
                      </TableCell>
                    </TableRow>

                    {section.tasks.map((task) => (
                      <TableRow
                        key={task.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedTask(task)}
                      >
                        <TableCell className="font-medium">{task.title}</TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="size-6">
                              <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                              <AvatarFallback className="text-[10px]">
                                {getInitials(task.assignee.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{task.assignee.name}</span>
                          </div>
                        </TableCell>

                        <TableCell>{task.dueDate}</TableCell>

                        <TableCell>
                          <Badge variant="secondary">{task.milestone}</Badge>
                        </TableCell>

                        <TableCell>
                          <PriorityBadge priority={task.priority} />
                        </TableCell>

                        <TableCell>
                          <StatusBadge status={task.status} />
                        </TableCell>
                      </TableRow>
                    ))}

                    <TableRow key={`${section.title}-add`} className="hover:bg-transparent">
                      <TableCell colSpan={6}>
                        <Button variant="ghost" className="text-muted-foreground h-8 px-0">
                          + Add task...
                        </Button>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <SheetContent className="w-full max-w-lg overflow-y-auto p-0 sm:max-w-xl">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle>{selectedTask?.title ?? 'Task Details'}</SheetTitle>
          <SheetDescription>Details and comments</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 p-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Assignee</p>
                <p>{selectedTask?.assignee.name ?? '-'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Due Date</p>
                <p>{selectedTask?.dueDate ?? '-'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Milestone</p>
                <p>{selectedTask?.milestone ?? '-'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Priority</p>
                <p className="capitalize">{selectedTask?.priority ?? '-'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <p className="capitalize">{selectedTask?.status ?? '-'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Updated</p>
                <p>{selectedTask?.updatedAt ?? '-'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Description</h3>
            <div className="text-muted-foreground rounded-md border p-3 text-sm">
              {selectedTask?.description || 'No description provided.'}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Comments</h3>
            <div className="text-muted-foreground rounded-md border p-3 text-sm">
              No comments yet.
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
