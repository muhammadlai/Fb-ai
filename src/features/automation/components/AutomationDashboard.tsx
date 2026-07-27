import React, { useState } from 'react';
import {
  Workflow,
  Globe,
  Play,
  Square,
  Plus,
  ShieldCheck,
  Clock,
  FileText,
  Trash2,
  Share2,
  Lock,
  ListOrdered,
  Sparkles,
} from 'lucide-react';
import { useAutomationStore } from '../store/useAutomationStore';
import { InteractiveBrowserCanvas } from './InteractiveBrowserCanvas';
import { WorkflowBuilderModal } from './WorkflowBuilderModal';
import { AuthorizationModal } from './AuthorizationModal';
import { AICommandCenterBar } from './AICommandCenterBar';
import { SocialFrameworksPanel } from './SocialFrameworksPanel';
import { BrowserProfilesPanel } from './BrowserProfilesPanel';
import { CredentialVaultPanel } from './CredentialVaultPanel';
import { TaskSchedulerQueuePanel } from './TaskSchedulerQueuePanel';

export const AutomationDashboard: React.FC = () => {
  const {
    tasks,
    profiles,
    vault,
    queue,
    activeTaskId,
    isExecuting,
    setActiveTaskId,
    executeTask,
    stopExecution,
    deleteTask,
    reports,
  } = useAutomationStore();

  const [isBuilderModalOpen, setIsBuilderModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'canvas' | 'social' | 'workflows' | 'profiles' | 'vault' | 'queue' | 'reports'
  >('canvas');

  const activeTask = tasks.find((t) => t.id === activeTaskId) || tasks[0];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-100 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono uppercase tracking-wider">
              Phase 6 Autonomous AI Agent Platform Live
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
            <Workflow className="w-7 h-7 text-cyan-400" />
            Autonomous AI Agent & Browser Automation Platform
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Autonomous multi-agent orchestration, Playwright browser automation, human-like mouse/keyboard behavior, browser profile sessions, task scheduler, secure credential vault, and live execution telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isExecuting ? (
            <button
              onClick={stopExecution}
              className="px-4 py-2.5 rounded-xl bg-rose-950 border border-rose-500/40 text-rose-300 hover:bg-rose-900 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <Square className="w-4 h-4 fill-rose-300" />
              <span>Stop Execution</span>
            </button>
          ) : (
            <button
              onClick={() => activeTask && executeTask(activeTask.id)}
              disabled={!activeTask}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Run Selected Pipeline</span>
            </button>
          )}

          <button
            onClick={() => setIsBuilderModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Pipeline</span>
          </button>
        </div>
      </div>

      {/* AI Command Center Integration Bar */}
      <AICommandCenterBar />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('canvas')}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'canvas'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Interactive Browser Stage
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeTab === 'social'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Social Frameworks</span>
        </button>
        <button
          onClick={() => setActiveTab('workflows')}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'workflows'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Workflows ({tasks.length})
        </button>
        <button
          onClick={() => setActiveTab('profiles')}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'profiles'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Profiles & Behavior ({profiles.length})
        </button>
        <button
          onClick={() => setActiveTab('vault')}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeTab === 'vault'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Login Vault ({vault.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeTab === 'queue'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
          <span>Queue & Scheduler ({queue.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'reports'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Reports ({reports.length})
        </button>
      </div>

      {/* Tab Views */}
      {activeTab === 'canvas' ? (
        <div className="space-y-6">
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400 uppercase">Active Pipeline Task:</span>
              <select
                value={activeTaskId || ''}
                onChange={(e) => setActiveTaskId(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-500/50"
              >
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.platform || 'custom'})
                  </option>
                ))}
              </select>
            </div>

            {activeTask && (
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Auth Confirmation Gate Enabled
                </span>
                <span className="text-slate-500">
                  {activeTask.steps.length} Steps
                </span>
              </div>
            )}
          </div>

          <InteractiveBrowserCanvas />
        </div>
      ) : activeTab === 'social' ? (
        <SocialFrameworksPanel />
      ) : activeTab === 'workflows' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-5 rounded-2xl bg-slate-900 border transition-all space-y-4 ${
                activeTaskId === task.id ? 'border-cyan-500/50 shadow-lg' : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      {task.platform || task.triggerType}
                    </span>
                    {task.cronSchedule && (
                      <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.cronSchedule}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-100">{task.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{task.description}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => executeTask(task.id)}
                    className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900 transition-colors cursor-pointer"
                    title="Run Workflow"
                  >
                    <Play className="w-4 h-4 fill-emerald-400" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Workflow"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Steps overview */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  Pipeline Steps ({task.steps.length})
                </span>
                <div className="space-y-1.5">
                  {task.steps.map((step, idx) => (
                    <div
                      key={step.id}
                      className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-xs font-mono flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-cyan-400 font-bold">{idx + 1}.</span>
                        <span className="text-slate-300 truncate">{step.description}</span>
                      </div>
                      <span className="text-[10px] text-purple-400 uppercase shrink-0 ml-2">
                        {step.action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === 'profiles' ? (
        <BrowserProfilesPanel />
      ) : activeTab === 'vault' ? (
        <CredentialVaultPanel />
      ) : activeTab === 'queue' ? (
        <TaskSchedulerQueuePanel />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((rep) => (
            <div key={rep.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-slate-100">{rep.taskName}</h3>
                </div>
                <span className="text-[10px] font-mono uppercase text-purple-300 px-2 py-0.5 rounded bg-purple-950 border border-purple-800/40">
                  PDF Report
                </span>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
                {rep.summary}
              </p>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-xs">
                <p className="text-[10px] text-slate-500 uppercase">EXTRACTED KEY METRICS</p>
                <pre className="text-emerald-400 text-[11px] overflow-x-auto">
                  {JSON.stringify(rep.extractedData, null, 2)}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <WorkflowBuilderModal
        isOpen={isBuilderModalOpen}
        onClose={() => setIsBuilderModalOpen(false)}
      />
      <AuthorizationModal />
    </div>
  );
};
