import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  useCreateMilestoneMutation,
  useDeleteMilestoneMutation,
  useMilestonesQuery,
  useUpdateMilestoneMutation,
} from '@/queries/useMilestoneQuery';
import { Milestone } from '@/types/tasks';
import { useParams } from '@tanstack/react-router';
import { Pencil, PlusCircle, Trash2, X } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { toast } from 'sonner';

type MilestoneFormState = {
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
};

const INITIAL_FORM: MilestoneFormState = {
  title: '',
  description: '',
  status: 'pending',
  startDate: '',
  endDate: '',
};

const toDateInputValue = (value: string | null) => {
  if (!value) {
    return '';
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  return parsedDate.toISOString().slice(0, 10);
};

const toDisplayDate = (value: string | null) => {
  if (!value) {
    return '—';
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return '—';
  }

  return parsedDate.toLocaleDateString();
};

const MilestoneSettingsPage = () => {
  const { projectId = '' } = useParams({ strict: false });
  const [formState, setFormState] = useState<MilestoneFormState>(INITIAL_FORM);
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);

  const { data, isLoading, isError } = useMilestonesQuery(projectId);
  const { mutateAsync: createMilestone, isPending: isCreating } =
    useCreateMilestoneMutation(projectId);
  const { mutateAsync: updateMilestone, isPending: isUpdating } =
    useUpdateMilestoneMutation(projectId);
  const { mutateAsync: deleteMilestone, isPending: isDeleting } =
    useDeleteMilestoneMutation(projectId);

  const milestones = useMemo(() => data?.data.milestones ?? [], [data]);

  const resetForm = () => {
    setEditingMilestoneId(null);
    setFormState(INITIAL_FORM);
  };

  const handleEdit = (milestone: Milestone) => {
    setEditingMilestoneId(milestone.id);
    setFormState({
      title: milestone.title,
      description: milestone.description,
      status: milestone.status,
      startDate: toDateInputValue(milestone.startDate),
      endDate: toDateInputValue(milestone.endDate),
    });
  };

  const handleDelete = async (milestoneId: string) => {
    await deleteMilestone(milestoneId);
    toast.success('Milestone deleted successfully');

    if (editingMilestoneId === milestoneId) {
      resetForm();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.title.trim()) {
      toast.error('Title is required');
      return;
    }

    const payload = {
      title: formState.title.trim(),
      description: formState.description.trim() || undefined,
      status: formState.status.trim() || 'pending',
      startDate: formState.startDate || undefined,
      endDate: formState.endDate || undefined,
    };

    if (editingMilestoneId) {
      await updateMilestone({
        milestoneId: editingMilestoneId,
        payload,
      });
      toast.success('Milestone updated successfully');
    } else {
      await createMilestone(payload);
      toast.success('Milestone created successfully');
    }

    resetForm();
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-hidden p-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-lg font-bold">Milestones</h1>
        <p className="text-muted-foreground text-sm">
          Create and manage milestones for this project.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="border-border flex flex-col gap-3 rounded-md border p-4"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Input
            placeholder="Milestone title"
            value={formState.title}
            onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
          />
          <Input
            placeholder="Status (e.g. pending, in_progress, done)"
            value={formState.status}
            onChange={(event) => setFormState((prev) => ({ ...prev, status: event.target.value }))}
          />
          <Input
            type="date"
            value={formState.startDate}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, startDate: event.target.value }))
            }
          />
          <Input
            type="date"
            value={formState.endDate}
            onChange={(event) => setFormState((prev) => ({ ...prev, endDate: event.target.value }))}
          />
        </div>

        <Textarea
          rows={4}
          placeholder="Description"
          value={formState.description}
          onChange={(event) =>
            setFormState((prev) => ({ ...prev, description: event.target.value }))
          }
        />

        <div className="flex items-center gap-2">
          <Button type="submit" size="sm" disabled={isSubmitting}>
            <PlusCircle className="size-4" />
            {editingMilestoneId ? 'Update Milestone' : 'Create Milestone'}
          </Button>
          {editingMilestoneId && (
            <Button type="button" variant="outline" size="sm" onClick={resetForm}>
              <X className="size-4" />
              Cancel Edit
            </Button>
          )}
        </div>
      </form>

      <section className="border-border flex-1 overflow-auto rounded-md border p-4">
        {isLoading && <p className="text-muted-foreground text-sm">Loading milestones...</p>}
        {isError && <p className="text-destructive text-sm">Failed to load milestones.</p>}

        {!isLoading && !isError && milestones.length === 0 && (
          <p className="text-muted-foreground text-sm">No milestones found.</p>
        )}

        {!isLoading && !isError && milestones.length > 0 && (
          <div className="flex flex-col gap-3">
            {milestones.map((milestone) => (
              <article key={milestone.id} className="border-border rounded-md border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate font-semibold">{milestone.title}</h2>
                    <p className="text-muted-foreground text-sm">
                      {toDisplayDate(milestone.startDate)} - {toDisplayDate(milestone.endDate)}
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm">Status: {milestone.status}</p>
                    {milestone.description && (
                      <p className="mt-2 text-sm">{milestone.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(milestone)}
                    >
                      <Pencil className="size-4" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      disabled={isDeleting}
                      onClick={() => handleDelete(milestone.id)}
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MilestoneSettingsPage;
