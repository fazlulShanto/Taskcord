import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TaskDetailsSheet } from '@/pages/tasks/TaskDetailsSheet';
import { useProjectUserRolesQuery } from '@/queries/useProjectUserRolesQuery';
import { useTasksQuery, useUpdateTaskMutation } from '@/queries/useTaskQuery';
import { useTaskStatusesQuery } from '@/queries/useTaskStatusQuery';
import { DragDropProvider, DragOverlay, useDroppable } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import { useParams } from '@tanstack/react-router';
import { CalendarClock, GripVertical } from 'lucide-react';
import { type ComponentProps, type FC, useEffect, useMemo, useState } from 'react';

type BoardTask = {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string | null;
  priority: string;
  assigneeIds: string[];
};

type BoardColumn = {
  id: string;
  name: string;
  order: number;
  tasks: BoardTask[];
};

const asKey = (value: string) => value.trim().toLowerCase();
const toTaskId = (taskId: string) => `task:${taskId}`;
const toColumnId = (columnId: string) => `column:${columnId}`;
const toColumnDropId = (columnId: string) => `column-drop:${columnId}`;

const parsePrefixedId = (rawId: string | null | undefined, prefix: string) => {
  if (!rawId || !rawId.startsWith(prefix)) {
    return null;
  }

  return rawId.slice(prefix.length);
};

const formatDate = (rawDate: string | null) => {
  if (!rawDate) {
    return 'No due date';
  }

  return new Date(rawDate).toLocaleDateString();
};

const getInitials = (name: string) => {
  const chunks = name.trim().split(/\s+/).slice(0, 2);
  return chunks.map((chunk) => chunk[0]?.toUpperCase() ?? '').join('');
};

const priorityToBadgeVariant = (priority: string): 'default' | 'outline' | 'secondary' => {
  const value = asKey(priority);

  if (value === 'highest' || value === 'high') {
    return 'default';
  }

  if (value === 'medium') {
    return 'secondary';
  }

  return 'outline';
};

const reorderArray = <T,>(items: T[], from: number, to: number) => {
  if (from === to) {
    return items;
  }

  const cloned = [...items];
  const [removed] = cloned.splice(from, 1);

  if (removed === undefined) {
    return items;
  }

  cloned.splice(to, 0, removed);
  return cloned;
};

const findTaskLocation = (columns: BoardColumn[], taskId: string) => {
  for (let columnIndex = 0; columnIndex < columns.length; columnIndex += 1) {
    const taskIndex = columns[columnIndex].tasks.findIndex((task) => task.id === taskId);

    if (taskIndex >= 0) {
      return { columnIndex, taskIndex };
    }
  }

  return null;
};

const moveTaskInColumns = (
  previousColumns: BoardColumn[],
  taskId: string,
  targetTaskId: string | null,
  targetColumnId: string | null
) => {
  const sourceLocation = findTaskLocation(previousColumns, taskId);

  if (!sourceLocation) {
    return previousColumns;
  }

  const sourceColumn = previousColumns[sourceLocation.columnIndex];
  const draggedTask = sourceColumn.tasks[sourceLocation.taskIndex];

  if (!draggedTask) {
    return previousColumns;
  }

  let destinationColumnIndex = -1;
  let destinationTaskIndex = -1;

  if (targetTaskId) {
    const targetLocation = findTaskLocation(previousColumns, targetTaskId);

    if (!targetLocation) {
      return previousColumns;
    }

    destinationColumnIndex = targetLocation.columnIndex;
    destinationTaskIndex = targetLocation.taskIndex;
  } else if (targetColumnId) {
    destinationColumnIndex = previousColumns.findIndex((column) => column.id === targetColumnId);

    if (destinationColumnIndex === -1) {
      return previousColumns;
    }

    destinationTaskIndex = previousColumns[destinationColumnIndex].tasks.length;
  } else {
    return previousColumns;
  }

  if (
    sourceLocation.columnIndex === destinationColumnIndex &&
    sourceLocation.taskIndex === destinationTaskIndex
  ) {
    return previousColumns;
  }

  const nextColumns = previousColumns.map((column) => ({
    ...column,
    tasks: [...column.tasks],
  }));

  const [removedTask] = nextColumns[sourceLocation.columnIndex].tasks.splice(
    sourceLocation.taskIndex,
    1
  );

  if (!removedTask) {
    return previousColumns;
  }

  if (
    sourceLocation.columnIndex === destinationColumnIndex &&
    sourceLocation.taskIndex < destinationTaskIndex
  ) {
    destinationTaskIndex -= 1;
  }

  nextColumns[destinationColumnIndex].tasks.splice(destinationTaskIndex, 0, {
    ...removedTask,
    status: nextColumns[destinationColumnIndex].name,
  });

  return nextColumns;
};

type TaskCardProps = {
  task: BoardTask;
  columnId: string;
  index: number;
  assigneeMap: Map<string, { name: string; avatar?: string }>;
  onOpenTask: (taskId: string) => void;
};

const TaskCard = ({ task, columnId, index, assigneeMap, onOpenTask }: TaskCardProps) => {
  const { ref, handleRef, isDragging } = useSortable({
    id: toTaskId(task.id),
    index,
    group: `tasks:${columnId}`,
    feedback: 'clone',
  });

  const assignees = task.assigneeIds
    .map((assigneeId) => assigneeMap.get(assigneeId))
    .filter((value): value is { name: string; avatar?: string } => !!value)
    .slice(0, 4);

  return (
    <Card
      ref={ref}
      onClick={() => {
        if (!isDragging) {
          onOpenTask(task.id);
        }
      }}
      className={cn(
        'bg-card cursor-pointer gap-3 rounded-lg border py-4 shadow-none transition-opacity',
        isDragging && 'opacity-40'
      )}
    >
      <CardHeader className="grid-cols-[1fr_auto] items-center gap-1 px-4 pb-0">
        <CardTitle className="line-clamp-2 text-sm leading-5">{task.title}</CardTitle>
        <button
          ref={handleRef}
          type="button"
          className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
          aria-label="Drag task"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent className="space-y-3 px-4">
        {task.description ? (
          <p className="text-muted-foreground line-clamp-2 text-xs">{task.description}</p>
        ) : null}
        <div className="flex items-center justify-between gap-2">
          <Badge variant={priorityToBadgeVariant(task.priority)} className="text-[10px] uppercase">
            {task.priority}
          </Badge>
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <CalendarClock className="h-3.5 w-3.5" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex -space-x-2">
            {assignees.map((assignee) => (
              <Avatar key={assignee.name} className="border-background h-6 w-6 border-2">
                <AvatarImage src={assignee.avatar} alt={assignee.name} />
                <AvatarFallback className="text-[10px]">
                  {getInitials(assignee.name || 'U')}
                </AvatarFallback>
              </Avatar>
            ))}
            {assignees.length === 0 ? (
              <span className="text-muted-foreground text-xs">Unassigned</span>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

type ColumnProps = {
  column: BoardColumn;
  index: number;
  assigneeMap: Map<string, { name: string; avatar?: string }>;
  onOpenTask: (taskId: string) => void;
};

const KanbanColumn = ({ column, index, assigneeMap, onOpenTask }: ColumnProps) => {
  const { ref, handleRef, isDragging } = useSortable({
    id: toColumnId(column.id),
    index,
    group: 'columns',
    feedback: 'clone',
  });

  const { ref: dropRef, isDropTarget } = useDroppable({
    id: toColumnDropId(column.id),
    accept: (draggable) => String(draggable.id).startsWith('task:'),
  });

  return (
    <div
      ref={ref}
      className={cn(
        'bg-muted/40 flex h-full w-xs min-w-xs flex-col rounded-xl border p-3',
        isDragging && 'opacity-50'
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <button
            ref={handleRef}
            type="button"
            className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
            aria-label="Drag column"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <h3 className="text-sm font-semibold">{column.name}</h3>
          <Badge variant="secondary" className="h-5 px-2 text-[10px]">
            {column.tasks.length}
          </Badge>
        </div>
      </div>

      <div
        ref={dropRef}
        className={cn(
          'flex min-h-[150px] flex-1 flex-col gap-2 overflow-y-auto rounded-md transition-colors',
          isDropTarget && 'bg-muted/70'
        )}
      >
        {column.tasks.map((task, taskIndex) => (
          <TaskCard
            key={task.id}
            task={task}
            columnId={column.id}
            index={taskIndex}
            assigneeMap={assigneeMap}
            onOpenTask={onOpenTask}
          />
        ))}
      </div>

      <Button variant="ghost" className="mt-2 justify-start px-2 text-xs">
        + Add new task
      </Button>
    </div>
  );
};

interface KanbanBoardProps {}

type DragStartHandler = NonNullable<ComponentProps<typeof DragDropProvider>['onDragStart']>;
type DragEndHandler = NonNullable<ComponentProps<typeof DragDropProvider>['onDragEnd']>;

export const KanbanBoard: FC<KanbanBoardProps> = () => {
  const { projectId = '' } = useParams({ strict: false });

  const {
    data: taskData,
    isLoading: isLoadingTasks,
    isError: isTasksError,
  } = useTasksQuery(projectId);
  const { data: statusesData } = useTaskStatusesQuery(projectId);
  const { data: usersData } = useProjectUserRolesQuery(projectId);
  const { mutateAsync: updateTask } = useUpdateTaskMutation(projectId);

  const assigneeMap = useMemo(() => {
    const map = new Map<string, { name: string; avatar?: string }>();

    (usersData?.users ?? []).forEach((user) => {
      map.set(user.id, {
        name: user.fullName ?? user.nickName ?? user.email ?? user.discordId,
        avatar: user.avatar ?? undefined,
      });
    });

    return map;
  }, [usersData?.users]);

  const statusColumns = useMemo(() => {
    return [...(statusesData?.data.statuses ?? [])]
      .sort((a, b) => a.order - b.order)
      .map((status, index) => ({
        id: status.id,
        name: status.name,
        order: status.order || index + 1,
      }));
  }, [statusesData?.data.statuses]);

  const normalizedStatusIdByName = useMemo(() => {
    const map = new Map<string, string>();

    statusColumns.forEach((column) => {
      map.set(asKey(column.name), column.id);
    });

    return map;
  }, [statusColumns]);

  const tasks = useMemo<BoardTask[]>(() => {
    return (taskData?.data.tasks ?? []).map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description ?? '',
      dueDate: task.dueDate,
      status: task.status,
      priority: task.priority,
      assigneeIds: task.assignees ?? [],
    }));
  }, [taskData?.data.tasks]);

  const taskById = useMemo(() => {
    const map = new Map<string, BoardTask>();

    tasks.forEach((task) => {
      map.set(task.id, task);
    });

    return map;
  }, [tasks]);

  const initialBoardColumns = useMemo<BoardColumn[]>(() => {
    const groupedColumns = statusColumns.map((status) => ({
      id: status.id,
      name: status.name,
      order: status.order,
      tasks: [] as BoardTask[],
    }));

    tasks.forEach((task) => {
      if (groupedColumns.length === 0) {
        return;
      }

      const statusKey = asKey(task.status);
      const matchingColumnId = normalizedStatusIdByName.get(statusKey);
      const targetColumn =
        groupedColumns.find((column) => column.id === matchingColumnId) ?? groupedColumns[0];

      if (targetColumn) {
        targetColumn.tasks.push(task);
      }
    });

    return groupedColumns;
  }, [normalizedStatusIdByName, statusColumns, tasks]);

  const [columns, setColumns] = useState<BoardColumn[]>(initialBoardColumns);
  const [activeTask, setActiveTask] = useState<BoardTask | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    setColumns(initialBoardColumns);
  }, [initialBoardColumns]);

  const handleDragEnd: DragEndHandler = (event) => {
    const sourceId = String(event.operation.source?.id ?? '');
    const targetId = String(event.operation.target?.id ?? '');

    if (event.canceled || !targetId) {
      setActiveTask(null);
      return;
    }

    const sourceColumnId = parsePrefixedId(sourceId, 'column:');
    const targetColumnId = parsePrefixedId(targetId, 'column:');

    if (sourceColumnId && targetColumnId) {
      setColumns((previousColumns) => {
        const sourceIndex = previousColumns.findIndex((column) => column.id === sourceColumnId);
        const destinationIndex = previousColumns.findIndex(
          (column) => column.id === targetColumnId
        );

        if (sourceIndex < 0 || destinationIndex < 0) {
          return previousColumns;
        }

        return reorderArray(previousColumns, sourceIndex, destinationIndex).map(
          (column, index) => ({
            ...column,
            order: index + 1,
          })
        );
      });

      setActiveTask(null);
      return;
    }

    const sourceTaskId = parsePrefixedId(sourceId, 'task:');

    if (!sourceTaskId) {
      setActiveTask(null);
      return;
    }

    const targetTaskId = parsePrefixedId(targetId, 'task:');
    const targetColumnDropId = parsePrefixedId(targetId, 'column-drop:');

    if (!targetTaskId && !targetColumnDropId) {
      setActiveTask(null);
      return;
    }

    let destinationStatusName: string | null = null;

    setColumns((previousColumns) => {
      const nextColumns = moveTaskInColumns(
        previousColumns,
        sourceTaskId,
        targetTaskId,
        targetColumnDropId
      );
      const destination = findTaskLocation(nextColumns, sourceTaskId);

      if (destination) {
        destinationStatusName = nextColumns[destination.columnIndex]?.name ?? null;
      }

      return nextColumns;
    });

    const movedTask = taskById.get(sourceTaskId);

    if (
      movedTask &&
      destinationStatusName &&
      asKey(movedTask.status) !== asKey(destinationStatusName)
    ) {
      void updateTask({
        taskId: movedTask.id,
        payload: {
          status: destinationStatusName,
        },
      });
    }

    setActiveTask(null);
  };

  const handleDragStart: DragStartHandler = (event) => {
    const sourceId = String(event.operation.source?.id ?? '');
    const sourceTaskId = parsePrefixedId(sourceId, 'task:');

    if (!sourceTaskId) {
      setActiveTask(null);
      return;
    }

    const currentTask = taskById.get(sourceTaskId) ?? null;
    setActiveTask(currentTask);
  };

  if (isLoadingTasks) {
    return <div className="text-muted-foreground p-4">Loading board...</div>;
  }

  if (isTasksError) {
    return <div className="text-destructive p-4">Failed to load tasks.</div>;
  }

  if (statusColumns.length === 0) {
    return (
      <div className="text-muted-foreground p-4">
        No statuses found. Create statuses to show Kanban columns.
      </div>
    );
  }

  return (
    <DragDropProvider onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-full w-full overflow-x-auto pb-2">
        <div className="flex h-full min-w-full items-start gap-3">
          {columns
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((column, columnIndex) => (
              <KanbanColumn
                key={column.id}
                column={column}
                index={columnIndex}
                assigneeMap={assigneeMap}
                onOpenTask={(taskId) => setSelectedTaskId(taskId)}
              />
            ))}
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <Card className="bg-card w-[300px] gap-2 rounded-lg border py-4 shadow-lg">
            <CardHeader className="px-4 pb-0">
              <CardTitle className="text-sm">{activeTask.title}</CardTitle>
            </CardHeader>
          </Card>
        ) : null}
      </DragOverlay>

      <TaskDetailsSheet
        projectId={projectId}
        taskId={selectedTaskId}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTaskId(null);
          }
        }}
      />
    </DragDropProvider>
  );
};
