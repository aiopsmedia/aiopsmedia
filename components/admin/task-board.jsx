'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { GripVertical, Plus, Calendar, AlignLeft } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '@/config/constants';
import { updateTaskStatus } from '@/actions/tasks';

const COLUMNS = [
  { key: 'TODO', label: 'To Do', accent: 'border-t-[#94A3B8]' },
  { key: 'IN_PROGRESS', label: 'In Progress', accent: 'border-t-[#22D3EE]' },
  { key: 'REVIEW', label: 'Review', accent: 'border-t-[#8B5CF6]' },
  { key: 'DONE', label: 'Done', accent: 'border-t-[#34D399]' },
];

const priorityVariant = {
  LOW: 'outline',
  MEDIUM: 'info',
  HIGH: 'warning',
  URGENT: 'danger',
};

export default function TaskBoard({ tasks, users, projectId }) {
  const [columns, setColumns] = React.useState({
    TODO: tasks.filter((t) => t.status === 'TODO'),
    IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS'),
    REVIEW: tasks.filter((t) => t.status === 'REVIEW'),
    DONE: tasks.filter((t) => t.status === 'DONE'),
  });
  const [dragged, setDragged] = React.useState(null);
  const [dragOver, setDragOver] = React.useState(null);
  const [updating, setUpdating] = React.useState(false);

  const handleDragStart = (e, task) => {
    setDragged(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, colKey) => {
    e.preventDefault();
    setDragOver(colKey);
  };

  const handleDrop = async (e, colKey) => {
    e.preventDefault();
    if (!dragged || dragged.status === colKey) {
      setDragged(null);
      setDragOver(null);
      return;
    }

    const prevColumns = columns;
    setColumns((prev) => ({
      ...prev,
      [dragged.status]: prev[dragged.status].filter((t) => t.id !== dragged.id),
      [colKey]: [...prev[colKey], { ...dragged, status: colKey }],
    }));
    setDragged(null);
    setDragOver(null);
    setUpdating(true);

    try {
      const res = await updateTaskStatus(dragged.id, colKey);
      if (res?.error) {
        toast.error(res.error);
        setColumns(prevColumns);
      }
    } catch {
      toast.error('Failed to update task');
      setColumns(prevColumns);
    } finally {
      setUpdating(false);
    }
  };

  const handleDragEnd = () => {
    setDragged(null);
    setDragOver(null);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {COLUMNS.map((col) => {
        const colTasks = columns[col.key] || [];
        return (
          <div
            key={col.key}
            onDragOver={(e) => handleDragOver(e, col.key)}
            onDrop={(e) => handleDrop(e, col.key)}
            className={cn(
              'rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] pt-0 transition-colors',
              col.accent,
              dragOver === col.key && 'border-[#22D3EE]/50 bg-[#111827]'
            )}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#F8FAFC]">{col.label}</span>
                <span className="rounded-full bg-[#111827] px-2 py-0.5 text-xs text-[#94A3B8]">{colTasks.length}</span>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`Add task to ${col.label}`}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 px-3 pb-3 min-h-[120px]">
              {colTasks.length === 0 ? (
                <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-[rgba(148,163,184,0.15)]">
                  <span className="text-xs text-[#94A3B8]">Drop tasks here</span>
                </div>
              ) : (
                colTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      'cursor-grab rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#111827] p-3 shadow-sm transition-all hover:border-[#22D3EE]/30 active:cursor-grabbing',
                      dragged?.id === task.id && 'opacity-50'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-[#F8FAFC]">{task.title}</p>
                      <GripVertical className="h-4 w-4 shrink-0 text-[#94A3B8]" />
                    </div>
                    {/* {task.description && (
                      <p className="mt-1 flex items-start gap-1 text-xs text-[#94A3B8]">
                        <AlignLeft className="mt-0.5 h-3 w-3 shrink-0" />
                        <span className="line-clamp-2">{task.description}</span>
                      </p>
                    )} */}
                    <div className="mt-2 flex items-center justify-between">
                      <Badge variant={priorityVariant[task.priority]}>{TASK_PRIORITY_LABELS[task.priority]}</Badge>
                      {task.dueDate && (
                        <span className="flex items-center gap-1 text-xs text-[#94A3B8]">
                          <Calendar className="h-3 w-3" />
                          {formatDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                    {task.assignee?.name && (
                      <div className="mt-2 flex items-center gap-2 border-t border-[rgba(148,163,184,0.1)] pt-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#22D3EE]/20 to-[#8B5CF6]/20 text-[10px] font-semibold text-[#22D3EE]">
                          {task.assignee.name.charAt(0).toUpperCase()}
                        </span>
                        <span className="text-xs text-[#94A3B8]">{task.assignee.name}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
