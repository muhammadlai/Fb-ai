import React, { useState } from 'react';
import {
  Workflow,
  Play,
  Plus,
  RefreshCw,
  Terminal,
  CheckCircle2,
  Clock,
  Zap,
  Globe,
  Database,
  MessageSquare,
  Code2,
  Settings,
  Layers
} from 'lucide-react';
import { WORKFLOW_NODES, WORKFLOW_CONNECTIONS, EXECUTION_LOGS } from '../data/mockData';
import { WorkflowNode, ExecutionLog } from '../types';

export const WorkflowPanel: React.FC = () => {
  const [nodes, setNodes] = useState<WorkflowNode[]>(WORKFLOW_NODES);
  const [logs, setLogs] = useState<ExecutionLog[]>(EXECUTION_LOGS);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(nodes[1]);

  const handleRunWorkflow = async () => {
    setIsRunning(true);
    const newLog: ExecutionLog = {
      id: `l_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      node_name: 'Manual Trigger',
      level: 'info',
      message: 'Triggered n8n workflow execution loop via Nexus API canvas...',
      duration_ms: 15,
    };
    setLogs(prev => [newLog, ...prev]);

    setTimeout(() => {
      const successLog: ExecutionLog = {
        id: `l_${Date.now() + 1}`,
        timestamp: new Date().toLocaleTimeString(),
        node_name: 'Slack / Discord Broadcast',
        level: 'success',
        message: 'All 5 workflow nodes executed with 200 OK status in 380ms',
        duration_ms: 380,
      };
      setLogs(prev => [successLog, ...prev]);
      setIsRunning(false);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-950/80 backdrop-blur-md">
        <div>
          <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
            <Workflow className="w-5 h-5 text-purple-400" />
            Visual Automation Canvas & n8n Workflow Studio
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Node-based pipeline orchestration connecting LLM reasoning, Pinecone RAG vectors, and HTTP webhooks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunWorkflow}
            disabled={isRunning}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-purple-950/60 flex items-center gap-2 transition-all"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Executing Nodes...' : 'Run Workflow'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body: Canvas + Sidebar Inspector */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* Interactive Node Graph Canvas */}
        <div className="flex-1 bg-slate-950 relative overflow-auto p-8 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:24px_24px]">
          {/* Animated Connection Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            {WORKFLOW_CONNECTIONS.map((c) => {
              const fromNode = nodes.find(n => n.id === c.from);
              const toNode = nodes.find(n => n.id === c.to);
              if (!fromNode || !toNode) return null;

              const x1 = fromNode.position.x + 180;
              const y1 = fromNode.position.y + 40;
              const x2 = toNode.position.x;
              const y2 = toNode.position.y + 40;

              return (
                <g key={c.id}>
                  <path
                    d={`M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`}
                    stroke="url(#lineGrad)"
                    strokeWidth="2.5"
                    fill="none"
                    strokeDasharray="6 4"
                    className="animate-pulse opacity-80"
                  />
                </g>
              );
            })}
          </svg>

          {/* Workflow Nodes */}
          <div className="relative z-10 space-y-6">
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  style={{
                    transform: `translate(${node.position.x}px, ${node.position.y}px)`,
                    position: 'absolute',
                  }}
                  className={`w-64 p-4 rounded-2xl bg-slate-900/90 border backdrop-blur-xl shadow-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'border-purple-400 ring-2 ring-purple-500/30 shadow-purple-950/60 scale-105'
                      : 'border-white/10 hover:border-purple-500/30 hover:scale-102'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        {node.type === 'trigger' && <Zap className="w-3.5 h-3.5" />}
                        {node.type === 'ai_llm' && <Workflow className="w-3.5 h-3.5" />}
                        {node.type === 'vector_db' && <Database className="w-3.5 h-3.5" />}
                        {node.type === 'code_exec' && <Code2 className="w-3.5 h-3.5" />}
                        {node.type === 'slack_notify' && <MessageSquare className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs font-bold text-slate-100">{node.title}</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  <div className="text-[11px] text-slate-400 mt-2 font-mono leading-tight">
                    {node.subtitle}
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>Status: {node.status}</span>
                    <span className="text-purple-400">Node ID: {node.id}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Node Config Inspector Panel */}
        {selectedNode && (
          <div className="w-80 border-l border-white/10 bg-slate-950 p-4 space-y-4 overflow-y-auto text-xs shrink-0">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-bold text-slate-200">Node Inspector</span>
              <span className="font-mono text-[10px] text-purple-400">{selectedNode.id}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-white/10 space-y-2">
              <div className="font-semibold text-slate-200">{selectedNode.title}</div>
              <div className="text-slate-400 font-mono text-[11px]">{selectedNode.subtitle}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-white/10 space-y-2 font-mono">
              <div className="text-slate-400 text-[10px] uppercase">Node Parameters</div>
              {Object.entries(selectedNode.config).map(([key, val]) => (
                <div key={key} className="flex justify-between py-1 border-b border-white/5 text-[11px]">
                  <span className="text-slate-400">{key}:</span>
                  <span className="text-purple-300 font-bold">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Real-time Terminal Execution Logs */}
      <div className="h-44 border-t border-white/10 bg-slate-950 p-3 flex flex-col font-mono text-[11px] shrink-0">
        <div className="flex items-center justify-between pb-2 border-b border-white/10 text-slate-400">
          <span className="flex items-center gap-1.5 font-bold text-slate-200">
            <Terminal className="w-4 h-4 text-purple-400" /> n8n Live Execution Log Stream
          </span>
          <span className="text-emerald-400">5 Events Dispatched</span>
        </div>

        <div className="flex-1 overflow-y-auto pt-2 space-y-1 custom-scrollbar">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center gap-3 text-slate-300">
              <span className="text-slate-500">{log.timestamp}</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-900 text-purple-300 border border-purple-500/20">
                [{log.node_name}]
              </span>
              <span className={log.level === 'success' ? 'text-emerald-400' : 'text-slate-300'}>
                {log.message}
              </span>
              <span className="ml-auto text-slate-600">{log.duration_ms}ms</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
