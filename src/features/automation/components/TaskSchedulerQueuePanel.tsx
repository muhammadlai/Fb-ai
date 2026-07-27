import React from 'react';
import { Clock, ListOrdered, Calendar, Play, Trash2, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';
import { useAutomationStore } from '../store/useAutomationStore';

export const TaskSchedulerQueuePanel: React.FC = () => {
  const { queue, tasks, removeFromQueue, executeTask } = useAutomationStore();

  const pendingQueue = queue.filter((q) => q.status === 'pending');
  const scheduledTasks = tasks.filter((t) => t.triggerType === 'scheduled' || t.cronSchedule);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            Task Scheduler & Live Automation Queue
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage priority automation queues, cron triggers, retry counters, and scheduled social media dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-purple-300 bg-purple-950 px-3 py-1.5 rounded-xl border border-purple-800/40">
          <ListOrdered className="w-4 h-4" />
          <span>Queue Engine Active: {pendingQueue.length} Pending Tasks</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Queue */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center justify-between">
            <span>Automation Execution Queue</span>
            <span className="text-xs font-mono text-slate-400">({queue.length} Total)</span>
          </h3>

          <div className="space-y-3">
            {queue.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-100">{item.taskName}</span>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                      item.priority === 'high'
                        ? 'bg-rose-950 text-rose-300 border-rose-500/30'
                        : 'bg-cyan-950 text-cyan-300 border-cyan-500/30'
                    }`}
                  >
                    {item.priority} priority
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                  <span>Scheduled: {item.scheduledTime}</span>
                  <span>Retries: {item.retriesLeft} Left</span>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => executeTask(item.taskId)}
                    className="px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono hover:bg-emerald-900 cursor-pointer flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-emerald-300" />
                    <span>Run Now</span>
                  </button>
                  <button
                    onClick={() => removeFromQueue(item.id)}
                    className="p-1.5 rounded-lg bg-slate-900 text-slate-500 hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Tasks Cron Overview */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center justify-between">
            <span>Scheduled Cron Jobs</span>
            <span className="text-xs font-mono text-slate-400">({scheduledTasks.length} Active)</span>
          </h3>

          <div className="space-y-3">
            {scheduledTasks.map((task) => (
              <div key={task.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-100">{task.name}</span>
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800/40">
                    Cron: {task.cronSchedule || '0 09 * * 1-5'}
                  </span>
                </div>

                <p className="text-xs text-slate-400">{task.description}</p>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                  <span>Last Run: {task.lastRunAt ? new Date(task.lastRunAt).toLocaleTimeString() : 'Never'}</span>
                  <span className="text-emerald-400">Status: {task.lastStatus || 'idle'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
