import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useMilestonesQuery } from '@/queries/useMilestoneQuery';
import { useProjectUserRolesQuery } from '@/queries/useProjectUserRolesQuery';
import {
  useCreateTaskCommentMutation,
  useDeleteTaskCommentMutation,
  useTaskCommentsQuery,
  useUpdateTaskCommentMutation,
} from '@/queries/useTaskCommentQuery';
import { useTasksQuery, useUpdateTaskMutation } from '@/queries/useTaskQuery';
import { useTaskStatusesQuery } from '@/queries/useTaskStatusQuery';
import { useEffect, useMemo, useState } from 'react';

type TaskDetailsSheetProps = {
  projectId: string;
  taskId: string | null;
  onOpenChange: (open: boolean) => void;
};

type TaskDetails = {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  assignee: {
    name: string;
    avatar?: string;
  };
  dueDate: string;
  dueDateValue: string;
  milestone: string;
  milestoneId: string;
  priorityRaw: string;
  statusRaw: string;
  updatedAt: string;
};

type TaskEditFormState = {
  title: string;
  description: string;
  assigneeId: string;
  milestoneId: string;
  status: string;
  priority: string;
  dueDate: string;
};

const TASK_PRIORITIES = ['highest', 'high', 'medium', 'low', 'lowest'] as const;
const NO_ASSIGNEE_VALUE = '__no_assignee__';
const NO_MILESTONE_VALUE = '__no_milestone__';

const getInitials = (name: string) => {
  const chunks = name.trim().split(/\s+/).slice(0, 2);
  return chunks.map((chunk) => chunk[0]?.toUpperCase() ?? '').join('');
};

export const TaskDetailsSheet = ({ projectId, taskId, onOpenChange }: TaskDetailsSheetProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [taskEditForm, setTaskEditForm] = useState<TaskEditFormState>({
    title: '',
    description: '',
    assigneeId: NO_ASSIGNEE_VALUE,
    milestoneId: NO_MILESTONE_VALUE,
    status: 'TODO',
    priority: 'medium',
    dueDate: '',
  });
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');

  const { data: taskData } = useTasksQuery(projectId);
  const { mutateAsync: updateTask, isPending: isUpdatingTask } = useUpdateTaskMutation(projectId);
  const { data: usersData } = useProjectUserRolesQuery(projectId);
  const { data: milestoneData } = useMilestonesQuery(projectId);
  const { data: taskStatusData } = useTaskStatusesQuery(projectId);

  const selectedTaskIdValue = taskId ?? '';
  const { data: commentsData, isLoading: isLoadingComments } = useTaskCommentsQuery(
    projectId,
    selectedTaskIdValue
  );
  const { mutateAsync: createComment, isPending: isCreatingComment } = useCreateTaskCommentMutation(
    projectId,
    selectedTaskIdValue
  );
  const { mutateAsync: updateComment, isPending: isUpdatingComment } = useUpdateTaskCommentMutation(
    projectId,
    selectedTaskIdValue
  );
  const { mutateAsync: deleteComment, isPending: isDeletingComment } = useDeleteTaskCommentMutation(
    projectId,
    selectedTaskIdValue
  );

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

  const statusOptions = useMemo(() => {
    return (taskStatusData?.data.statuses ?? []).map((status) => status.name).filter(Boolean);
  }, [taskStatusData?.data.statuses]);

  const selectedTask = useMemo<TaskDetails | null>(() => {
    if (!taskId) {
      return null;
    }

    const task = (taskData?.data.tasks ?? []).find((item) => item.id === taskId);

    if (!task) {
      return null;
    }

    const firstAssigneeId = task.assignees[0] ?? '';
    const assignee =
      (firstAssigneeId ? userById.get(firstAssigneeId) : undefined) ??
      ({ name: 'Unassigned' } as const);

    return {
      id: task.id,
      title: task.title,
      description: task.description ?? '',
      assigneeId: firstAssigneeId,
      assignee,
      dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-',
      dueDateValue: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : '',
      milestone:
        (task.milestoneId ? milestoneById.get(task.milestoneId) : undefined) ?? 'No milestone',
      milestoneId: task.milestoneId ?? '',
      priorityRaw: task.priority.toLowerCase(),
      statusRaw: task.status,
      updatedAt: task.updatedAt ? new Date(task.updatedAt).toLocaleDateString() : '-',
    };
  }, [milestoneById, taskData?.data.tasks, taskId, userById]);

  useEffect(() => {
    if (!selectedTask) {
      return;
    }

    setTaskEditForm({
      title: selectedTask.title,
      description: selectedTask.description,
      assigneeId: selectedTask.assigneeId || NO_ASSIGNEE_VALUE,
      milestoneId: selectedTask.milestoneId || NO_MILESTONE_VALUE,
      status: selectedTask.statusRaw || 'TODO',
      priority: selectedTask.priorityRaw,
      dueDate: selectedTask.dueDateValue,
    });
  }, [selectedTask]);

  const handleUpdateTask = async () => {
    if (!selectedTask) {
      return;
    }

    await updateTask({
      taskId: selectedTask.id,
      payload: {
        title: taskEditForm.title,
        description: taskEditForm.description,
        status: taskEditForm.status,
        priority: taskEditForm.priority,
        milestoneId:
          taskEditForm.milestoneId === NO_MILESTONE_VALUE ? null : taskEditForm.milestoneId,
        assignees: taskEditForm.assigneeId === NO_ASSIGNEE_VALUE ? [] : [taskEditForm.assigneeId],
        dueDate: taskEditForm.dueDate || null,
      },
    });

    setIsEditMode(false);
  };

  const handleCreateComment = async () => {
    if (!newComment.trim()) {
      return;
    }

    await createComment({ content: newComment.trim() });
    setNewComment('');
  };

  const handleSaveCommentEdit = async (commentId: string) => {
    if (!editingCommentContent.trim()) {
      return;
    }

    await updateComment({
      commentId,
      payload: { content: editingCommentContent.trim() },
    });

    setEditingCommentId(null);
    setEditingCommentContent('');
  };

  const comments = commentsData?.data.comments ?? [];

  return (
    <Sheet
      open={!!selectedTask}
      onOpenChange={(open) => {
        if (!open) {
          setIsEditMode(false);
          setEditingCommentId(null);
          setEditingCommentContent('');
          onOpenChange(false);
        }
      }}
    >
      <SheetContent className="w-full max-w-lg overflow-y-auto p-0 sm:max-w-xl">
        <SheetHeader className="border-b px-4 py-3">
          <div className="flex items-start justify-between gap-2 pr-8">
            <div>
              <SheetTitle>{selectedTask?.title ?? 'Task Details'}</SheetTitle>
              <SheetDescription>Details and comments</SheetDescription>
            </div>

            {selectedTask && (
              <div className="flex items-center gap-2">
                {isEditMode ? (
                  <>
                    <Button size="sm" variant="outline" onClick={() => setIsEditMode(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleUpdateTask} disabled={isUpdatingTask}>
                      {isUpdatingTask ? 'Saving...' : 'Save'}
                    </Button>
                  </>
                ) : (
                  <Button size="sm" onClick={() => setIsEditMode(true)}>
                    Edit
                  </Button>
                )}
              </div>
            )}
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-4 p-4">
          {isEditMode ? (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Edit Task</h3>
              <Input
                value={taskEditForm.title}
                onChange={(e) => setTaskEditForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Task title"
              />
              <Textarea
                value={taskEditForm.description}
                onChange={(e) =>
                  setTaskEditForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Task description"
              />
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={taskEditForm.assigneeId}
                  onValueChange={(value) =>
                    setTaskEditForm((prev) => ({ ...prev, assigneeId: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_ASSIGNEE_VALUE}>Unassigned</SelectItem>
                    {(usersData?.users ?? []).map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.fullName ?? user.nickName ?? user.email ?? user.discordId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={taskEditForm.milestoneId}
                  onValueChange={(value) =>
                    setTaskEditForm((prev) => ({ ...prev, milestoneId: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select milestone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_MILESTONE_VALUE}>No milestone</SelectItem>
                    {(milestoneData?.data.milestones ?? []).map((milestone) => (
                      <SelectItem key={milestone.id} value={milestone.id}>
                        {milestone.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={taskEditForm.status}
                  onValueChange={(value) => setTaskEditForm((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {(statusOptions.length > 0 ? statusOptions : [taskEditForm.status]).map(
                      (status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>

                <Select
                  value={taskEditForm.priority}
                  onValueChange={(value) =>
                    setTaskEditForm((prev) => ({ ...prev, priority: value }))
                  }
                >
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
              </div>
              <Input
                type="date"
                value={taskEditForm.dueDate}
                onChange={(e) => setTaskEditForm((prev) => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
          ) : (
            <>
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
                    <p className="capitalize">{selectedTask?.priorityRaw ?? '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="capitalize">{selectedTask?.statusRaw ?? '-'}</p>
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
            </>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Comments</h3>
            <div className="space-y-2 rounded-md border p-3">
              {isLoadingComments ? (
                <div className="text-muted-foreground text-sm">Loading comments...</div>
              ) : comments.length === 0 ? (
                <div className="text-muted-foreground text-sm">No comments yet.</div>
              ) : (
                <div className="space-y-2">
                  {comments.map((comment) => {
                    const author = userById.get(comment.userId)?.name ?? 'Unknown user';

                    return (
                      <div key={comment.id} className="rounded-md border p-2">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <Avatar className="size-6">
                              <AvatarImage
                                src={userById.get(comment.userId)?.avatar}
                                alt={author}
                              />
                              <AvatarFallback className="text-[10px]">
                                {getInitials(author)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-muted-foreground">{author}</span>
                          </div>
                          <span className="text-muted-foreground">
                            {comment.createdAt
                              ? new Date(comment.createdAt).toLocaleString()
                              : 'Just now'}
                          </span>
                        </div>

                        {editingCommentId === comment.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editingCommentContent}
                              onChange={(e) => setEditingCommentContent(e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleSaveCommentEdit(comment.id)}
                                disabled={isUpdatingComment}
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingCommentId(null);
                                  setEditingCommentContent('');
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm">{comment.content}</p>
                            <div className="mt-2 flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingCommentId(comment.id);
                                  setEditingCommentContent(comment.content);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={async () => {
                                  await deleteComment(comment.id);
                                }}
                                disabled={isDeletingComment}
                              >
                                Delete
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="space-y-2 pt-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleCreateComment}
                    disabled={isCreatingComment || !newComment.trim()}
                  >
                    {isCreatingComment ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
