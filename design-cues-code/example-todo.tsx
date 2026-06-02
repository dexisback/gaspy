//NOTE: FOR KIMIK2.6 , THIS NOTE IS FOR YOU: THIS FILE COVERS SLICING ANIMATIONS (TO BE IMPLEMENTED IN THE QNA SECTION)
//THIS COVERS ADDING AND DELETING BUTTON FUNCTOINS
//THIS COVERS THE CREATE ICON BUTTON AND THE UI FOR IT 
//THIS COVERS TRASH ANIMATION, YOU ARE SUPPOSED TO IMPLEMENT THE SAME MICROINTERACTIONS FOR EDIT, TRASH ANIMATIONS


'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CalendarDays, CheckSquare, Goal, Pencil, Plus, X } from 'lucide-react';
import { useSound } from '@/components/sound-provider';
import type { TaskType } from './page';

type TodoTask = {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  deadline?: string;
  isCompleted: boolean;
};

const TYPE_META: Record<
  TaskType,
  { label: string; color: string; bg: string }
> = {
  DAILY: {
    label: 'Daily',
    color: 'oklch(0.52 0.12 250)',
    bg: 'oklch(0.52 0.12 250 / 0.09)',
  },
  DEADLINE: {
    label: 'Deadline',
    color: 'oklch(0.60 0.14 25)',
    bg: 'oklch(0.60 0.14 25 / 0.09)',
  },
  YEARLY: {
    label: 'Yearly',
    color: 'oklch(0.56 0.10 155)',
    bg: 'oklch(0.56 0.10 155 / 0.09)',
  },
};

function dateDiff(target: Date) {
  const now = new Date();
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const end = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate(),
  ).getTime();
  return Math.ceil((end - start) / 86_400_000);
}

function AnimatedTrashIcon({ open }: { open: boolean }) {
  return (
    <motion.svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <motion.g
        animate={
          open ? { rotate: -14, x: 0, y: -2.4 } : { rotate: 0, x: 0, y: 0 }
        }
        transition={{ type: 'spring', duration: 0.22, bounce: 0 }}
        style={{ transformOrigin: '11px 7px' }}
      >
        <path
          d="M6 7H16"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M10 4h2a1 1 0 0 1 1 1v2H9V5a1 1 0 0 1 1-1Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </motion.g>
      <path
        d="M6 7h10v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M10 10v7M14 10v7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

export default function TodoWorkspaceClient({
  initialTasks,
  initialDdayDate,
  initialDdayTitle,
}: {
  initialTasks: TodoTask[];
  initialDdayDate: string;
  initialDdayTitle: string;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [slicedId, setSlicedId] = useState<string | null>(null);
  const [hoveredDeleteId, setHoveredDeleteId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [modalType, setModalType] = useState<TaskType>('DAILY');
  const [modalDeadline, setModalDeadline] = useState('');
  const [modalTime, setModalTime] = useState('09:00');
  const [modalBusy, setModalBusy] = useState(false);
  const [dDay, setDDay] = useState(initialDdayDate);
  const [dDayName, setDDayName] = useState(initialDdayTitle);
  const [weeklyGoal, setWeeklyGoal] = useState(12);
  const [monthlyGoal, setMonthlyGoal] = useState(42);
  const reduceMotion = useReducedMotion();
  const { play } = useSound();
  const opSeqRef = useRef<Map<string, number>>(new Map());
  const ddayHydratedRef = useRef(false);
  const ddaySaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ddaySnapshotRef = useRef({
    todoDdayDate: initialDdayDate,
    todoDdayTitle: initialDdayTitle,
  });

  const done = tasks.filter((t) => t.isCompleted).length;
  const dValue = dateDiff(new Date(dDay + 'T12:00:00'));

  useEffect(() => {
    setDDay(initialDdayDate);
  }, [initialDdayDate]);

  useEffect(() => {
    setDDayName(initialDdayTitle);
  }, [initialDdayTitle]);

  useEffect(() => {
    if (!ddayHydratedRef.current) {
      ddayHydratedRef.current = true;
      return;
    }

    const nextPayload = {
      todoDdayDate: dDay,
      // Allow clearing the title completely; server will accept empty string.
      todoDdayTitle: dDayName.trim(),
    };

    if (
      ddaySnapshotRef.current.todoDdayDate === nextPayload.todoDdayDate &&
      ddaySnapshotRef.current.todoDdayTitle === nextPayload.todoDdayTitle
    ) {
      return;
    }

    if (ddaySaveTimerRef.current) clearTimeout(ddaySaveTimerRef.current);

    ddaySaveTimerRef.current = setTimeout(() => {
      const previousSnapshot = ddaySnapshotRef.current;
      ddaySnapshotRef.current = nextPayload;
      void fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextPayload),
      })
        .then(async (res) => {
          if (res.ok) return;
          ddaySnapshotRef.current = previousSnapshot;
          play('error');
        })
        .catch(() => {
          ddaySnapshotRef.current = previousSnapshot;
          play('error');
        });
    }, 250);

    return () => {
      if (ddaySaveTimerRef.current) clearTimeout(ddaySaveTimerRef.current);
    };
  }, [dDay, dDayName, initialDdayTitle, play]);

  function openCreateModal() {
    setModalMode('create');
    setEditingTaskId(null);
    setModalTitle('');
    setModalDescription('');
    setModalType('DAILY');
    setModalDeadline('');
    setModalTime('09:00');
    play('modalOpen');
  }

  function openEditModal(task: TodoTask) {
    setModalMode('edit');
    setEditingTaskId(task.id);
    setModalTitle(task.title);
    setModalDescription(task.description ?? '');
    setModalType(task.type);
    if (task.deadline) {
      const parsed = new Date(task.deadline);
      if (!Number.isNaN(parsed.getTime())) {
        setModalDeadline(parsed.toISOString().slice(0, 10));
        setModalTime(parsed.toISOString().slice(11, 16));
      } else {
        setModalDeadline(task.deadline.slice(0, 10));
        setModalTime('09:00');
      }
    } else {
      setModalDeadline('');
      setModalTime('09:00');
    }
    play('modalOpen');
  }

  function closeModal() {
    setModalMode(null);
    setEditingTaskId(null);
    setModalBusy(false);
    play('modalClose');
  }

  async function markWithSlice(id: string) {
    setSlicedId(id);
    if (!reduceMotion) setTimeout(() => setSlicedId(null), 220);
    else setSlicedId(null);

    let previousCompleted = false;
    let nextCompleted = false;
    let found = false;
    setTasks((prev) => {
      const row = prev.find((t) => t.id === id);
      if (!row) return prev;
      found = true;
      previousCompleted = row.isCompleted;
      nextCompleted = !previousCompleted;
      return prev.map((t) =>
        t.id === id ? { ...t, isCompleted: nextCompleted } : t,
      );
    });
    if (!found) return;
    play(previousCompleted ? 'toggleOff' : 'success');

    const nextSeq = (opSeqRef.current.get(id) ?? 0) + 1;
    opSeqRef.current.set(id, nextSeq);

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: nextCompleted }),
      });
      if (!res.ok) {
        if (opSeqRef.current.get(id) !== nextSeq) return;
        setTasks((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, isCompleted: previousCompleted } : t,
          ),
        );
        play('error');
      }
    } catch {
      if (opSeqRef.current.get(id) !== nextSeq) return;
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, isCompleted: previousCompleted } : t,
        ),
      );
      play('error');
    }
  }

  async function saveModalTask() {
    if (modalBusy) return;
    const title = modalTitle.trim();
    if (!title) return;
    setModalBusy(true);
    try {
      //i aint reading all that shi, happy for you or sad that it happened
      if (modalMode === 'edit' && editingTaskId) {
        const res = await fetch(`/api/tasks/${editingTaskId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            description: modalDescription.trim() || null,
            type: modalType,
            deadline: modalDeadline
              ? new Date(
                  `${modalDeadline}T${modalTime || '09:00'}:00`,
                ).toISOString()
              : null,
          }),
        });
        if (!res.ok) {
          play('error');
          return;
        }
        const updated = (await res.json()) as TodoTask;
        setTasks((prev) =>
          prev.map((t) =>
            t.id === updated.id
              ? {
                  ...t,
                  title: updated.title,
                  description: updated.description,
                  type: updated.type,
                  deadline: updated.deadline ?? undefined,
                }
              : t,
          ),
        );
        play('success');
        closeModal();
        return;
      }

      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: modalDescription.trim() || undefined,
          type: modalType,
          deadline: modalDeadline
            ? new Date(
                `${modalDeadline}T${modalTime || '09:00'}:00`,
              ).toISOString()
            : undefined,
        }),
      });
      if (!res.ok) {
        play('error');
        return;
      }
      const created = (await res.json()) as TodoTask;
      setTasks((prev) => [
        {
          ...created,
          description: created.description ?? undefined,
          deadline: created.deadline ?? undefined,
        },
        ...prev,
      ]);
      play('success');
      closeModal();
    } catch {
      play('error');
    } finally {
      setModalBusy(false);
    }
  }

  async function deleteTask(id: string) {
    if (!window.confirm('Delete this todo? This cannot be undone.')) return;
    const snapshot = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        setTasks(snapshot);
        play('error');
        return;
      }
      play('success');
    } catch {
      setTasks(snapshot);
      play('error');
    }
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-y-auto px-4 pb-8 pt-2 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-5xl flex-col space-y-6 pt-2">
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <CheckSquare
              size={14}
              strokeWidth={1.6}
              className="text-muted-foreground opacity-70"
            />
            <h1 className="text-[14px] font-semibold tracking-tight text-foreground">
              Todo
            </h1>
          </div>
          <span className="text-[11px] tabular-nums text-muted-foreground">
            {done} / {tasks.length} done
          </span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="bg-[color:var(--panel-texture-bg)] bg-[image:var(--panel-texture-image)] bg-[length:340px_340px] rounded-2xl border border-border/50 p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-[11px] font-medium text-muted-foreground">
                Task slicing mode
              </p>
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                whileHover={{ y: -1, scale: 1.04, rotate: 0 }}
                transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
                onClick={openCreateModal}
                className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-border/70 bg-background text-foreground
                  shadow-[0_1px_2px_rgba(17,24,39,0.06)]"
                aria-label="Create todo"
              >
                <Plus size={14} />
              </motion.button>
            </div>

            {tasks.length === 0 ? (
              <div className="flex min-h-[18rem] items-center justify-center px-6 text-center">
                <p className="max-w-md text-[13px] font-medium text-muted-foreground [text-wrap:pretty]">
                  Scientists agree: writing it down beats overthinking it.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    className="relative flex min-h-[6rem] items-start gap-2 rounded-xl border border-border/50 bg-background/85 px-3 py-3"
                  >
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => void markWithSlice(task.id)}
                      className="relative flex min-w-0 flex-1 items-start gap-3 overflow-hidden rounded-lg px-3 py-3 text-left"
                    >
                      <span
                        className={
                          'mt-0.5 h-4 w-4 rounded-[4px] border ' +
                          (task.isCompleted
                            ? 'border-transparent bg-cta/80'
                            : 'border-border/70')
                        }
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={
                            'text-[13.5px] font-medium ' +
                            (task.isCompleted
                              ? 'line-through text-muted-foreground'
                              : 'text-foreground')
                          }
                        >
                          {task.title}
                        </p>
                        <p
                          className="mt-1 text-[10.5px] leading-relaxed text-muted-foreground line-clamp-2"
                          title={
                            task.description?.trim() ||
                            TYPE_META[task.type].label
                          }
                        >
                          {task.description?.trim() ||
                            TYPE_META[task.type].label}
                        </p>
                      </div>
                    </motion.button>

                    <div className="flex shrink-0 flex-col items-center gap-1 pr-1 pt-0.5">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        whileHover={{ rotate: -18, x: 0.3 }}
                        transition={{
                          type: 'spring',
                          duration: 0.3,
                          bounce: 0,
                        }}
                        onClick={() => openEditModal(task)}
                        className="group relative flex h-7 w-7 items-center justify-center rounded-[6px] text-muted-foreground hover:bg-muted"
                        aria-label="Edit todo"
                      >
                        <Pencil size={12} />
                        <motion.span
                          className="pointer-events-none absolute -bottom-0.5 left-1/2 h-[1.5px] w-3 -translate-x-1/2 rounded-full bg-current opacity-0"
                          initial={false}
                          whileHover={{ opacity: 0.55, scaleX: [0.2, 1] }}
                          transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                        />
                      </motion.button>

                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        onHoverStart={() => setHoveredDeleteId(task.id)}
                        onHoverEnd={() =>
                          setHoveredDeleteId((prev) =>
                            prev === task.id ? null : prev,
                          )
                        }
                        onClick={() => void deleteTask(task.id)}
                        className="relative flex h-7 w-7 items-center justify-center rounded-[6px] text-muted-foreground hover:bg-muted"
                        aria-label="Delete todo"
                      >
                        <AnimatedTrashIcon open={hoveredDeleteId === task.id} />
                      </motion.button>
                    </div>

                    <AnimatePresence>
                      {slicedId === task.id && (
                        <motion.span
                          initial={{ opacity: 0, x: -40 }}
                          animate={{ opacity: 0.9, x: 150 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.24, ease: [0, 0, 0.58, 1] }}
                          className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white/5 via-white/70 to-white/5"
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-[color:var(--panel-texture-bg)] bg-[image:var(--panel-texture-image)] bg-[length:340px_340px] rounded-2xl border border-border/50 p-4">
              <p className="mb-3 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                <CalendarDays size={12} />
                D-Day setup
              </p>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-[10.5px] font-medium text-muted-foreground">
                    Date
                  </span>
                  <input
                    type="date"
                    value={dDay}
                    onChange={(e) => setDDay(e.target.value)}
                    className="w-full rounded-md border border-border/70 bg-background px-3 py-2 text-[13px] font-medium text-foreground"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10.5px] font-medium text-muted-foreground">
                    Name
                  </span>
                  <input
                    type="text"
                    value={dDayName}
                    onChange={(e) => setDDayName(e.target.value)}
                    placeholder="Name your D-Day"
                    className="w-full rounded-md border border-border/70 bg-background px-3 py-2 text-[13px] font-medium text-foreground"
                  />
                </label>
              </div>
              <p className="mt-2 text-[11px] font-medium text-muted-foreground tabular-nums">
                D{dValue >= 0 ? `-${dValue}` : `+${Math.abs(dValue)}`}
              </p>
            </div>

            <div className="bg-[color:var(--panel-texture-bg)] bg-[image:var(--panel-texture-image)] bg-[length:340px_340px] rounded-2xl border border-border/50 p-4">
              <p className="mb-3 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                <Goal size={12} />
                Goal configuration
              </p>
              <label className="mb-3 block text-[10.5px] text-muted-foreground">
                Weekly focus goals
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={weeklyGoal}
                  onChange={(e) => {
                    setWeeklyGoal(Number(e.target.value));
                    play('tap');
                  }}
                  className="mt-1 w-full"
                />
                <span className="tabular-nums text-[12px] text-foreground">
                  {weeklyGoal} tasks/week
                </span>
              </label>
              <label className="block text-[10.5px] text-muted-foreground">
                Monthly focus goals
                <input
                  type="range"
                  min={5}
                  max={100}
                  value={monthlyGoal}
                  onChange={(e) => {
                    setMonthlyGoal(Number(e.target.value));
                    play('tap');
                  }}
                  className="mt-1 w-full"
                />
                <span className="tabular-nums text-[12px] text-foreground">
                  {monthlyGoal} tasks/month
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {modalMode && (
          <motion.div
            className="fixed inset-0 z-[120] flex max-h-[100dvh] items-end justify-center overflow-y-auto overflow-x-hidden p-4 sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget && !modalBusy) closeModal();
            }}
          >
            <div
              className="absolute inset-0 bg-background/25"
              style={{
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
            />
            <motion.div
              initial={{ y: 8, opacity: 0, scale: 0.985 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 8, opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.2, ease: [0, 0, 0.58, 1] }}
              className="relative z-10 my-auto w-full max-w-md rounded-xl border border-border/60 bg-card p-4 sm:my-0
                shadow-[0_1px_2px_rgba(17,24,39,0.06),0_18px_40px_rgba(17,24,39,0.12)]"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[13px] font-semibold text-foreground">
                  {modalMode === 'edit' ? 'Edit todo' : 'Create todo'}
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={modalBusy}
                  className="flex h-7 w-7 items-center justify-center rounded-[6px] text-muted-foreground hover:bg-muted"
                  aria-label="Close"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-3">
                <label className="block">
                  <span className="mb-1 block text-[10.5px] text-muted-foreground">
                    Title
                  </span>
                  <input
                    type="text"
                    value={modalTitle}
                    onChange={(e) => setModalTitle(e.target.value)}
                    placeholder="Write your task title"
                    className="w-full rounded-md border border-border/70 bg-background px-3 py-2 text-[12px] text-foreground"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[10.5px] text-muted-foreground">
                    Content
                  </span>
                  <textarea
                    value={modalDescription}
                    onChange={(e) => setModalDescription(e.target.value)}
                    rows={3}
                    placeholder="Optional notes"
                    className="w-full resize-none rounded-md border border-border/70 bg-background px-3 py-2 text-[12px] text-foreground"
                  />
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <label className="block">
                    <span className="mb-1 block text-[10.5px] text-muted-foreground">
                      Type
                    </span>
                    <select
                      value={modalType}
                      onChange={(e) => setModalType(e.target.value as TaskType)}
                      className="w-full rounded-md border border-border/70 bg-background px-3 py-2 text-[12px] text-foreground"
                    >
                      <option value="DAILY">Daily</option>
                      <option value="DEADLINE">Deadline</option>
                      <option value="YEARLY">Yearly</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-[10.5px] text-muted-foreground">
                      Date to be done
                    </span>
                    <input
                      type="date"
                      value={modalDeadline}
                      onChange={(e) => setModalDeadline(e.target.value)}
                      className="w-full rounded-md border border-border/70 bg-background px-3 py-2 text-[12px] text-foreground"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-1 block text-[10.5px] text-muted-foreground">
                    Time
                  </span>
                  <input
                    type="time"
                    value={modalTime}
                    onChange={(e) => setModalTime(e.target.value)}
                    className="w-full rounded-md border border-border/70 bg-background px-3 py-2 text-[12px] text-foreground"
                  />
                </label>

                <div className="flex justify-end gap-2 pt-1">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={closeModal}
                    disabled={modalBusy}
                    className="rounded-[6px] border border-border/70 bg-background px-3 py-1.5 text-[11px] font-medium text-foreground"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => void saveModalTask()}
                    disabled={modalBusy || !modalTitle.trim()}
                    className="app-cta-surface rounded-[6px] px-3 py-1.5 text-[11px] font-medium text-cta-foreground
                      disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {modalBusy ? 'Saving...' : 'Save'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// — Client todo list: modals, CRUD via /api/tasks, deadlines.
