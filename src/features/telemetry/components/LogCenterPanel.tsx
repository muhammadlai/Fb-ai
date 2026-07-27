import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Copy,
  Check,
  Trash2,
  Terminal,
  AlertTriangle,
  XCircle,
  Info,
  CheckCircle2,
  Radio,
  FileCode,
} from 'lucide-react';
import { LogEntry, LogSeverity, LogCategory } from '../types/telemetry';

interface Props {
  logs: LogEntry[];
  onClearLogs: () => void;
}

export const LogCenterPanel: React.FC<Props> = ({ logs, onClearLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<LogSeverity | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<LogCategory | 'all'>('all');
  const [copied, setCopied] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.traceId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;
    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;

    return matchesSearch && matchesSeverity && matchesCategory;
  });

  const getSeverityBadge = (sev: LogSeverity) => {
    switch (sev) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold uppercase">
            <XCircle className="w-3 h-3 text-rose-400" />
            CRITICAL
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold uppercase">
            <XCircle className="w-3 h-3 text-rose-400" />
            ERROR
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold uppercase">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            WARNING
          </span>
        );
      case 'success':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            SUCCESS
          </span>
        );
      case 'trace':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold uppercase">
            <Radio className="w-3 h-3 text-purple-400" />
            TRACE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold uppercase">
            <Info className="w-3 h-3 text-cyan-400" />
            INFO
          </span>
        );
    }
  };

  const handleCopyLogs = () => {
    const text = JSON.stringify(filteredLogs, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadLogsJSON = () => {
    const blob = new Blob([JSON.stringify(filteredLogs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-telemetry-logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadLogsCSV = () => {
    const headers = 'ID,Timestamp,Severity,Category,Service,Message,TraceID\n';
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.severity}","${l.category}","${l.service}","${l.message.replace(/"/g, '""')}","${l.traceId}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-telemetry-logs-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs by message, service, details or trace ID..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLogs}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 cursor-pointer flex items-center gap-1.5 font-mono"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownloadLogsJSON}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 hover:border-cyan-500 cursor-pointer flex items-center gap-1.5 font-mono"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>

            <button
              onClick={handleDownloadLogsCSV}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-purple-300 hover:border-purple-500 cursor-pointer flex items-center gap-1.5 font-mono"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>

            <button
              onClick={onClearLogs}
              className="px-3 py-1.5 rounded-xl bg-rose-950/50 border border-rose-500/30 text-xs text-rose-300 hover:bg-rose-950 cursor-pointer flex items-center gap-1.5 font-mono"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Severity & Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs font-mono">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Severity:
            </span>
            {(['all', 'info', 'success', 'warning', 'error', 'critical', 'trace'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSeverity(s)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-all cursor-pointer ${
                  selectedSeverity === s
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-slate-400">Category:</span>
            {(['all', 'AI Events', 'System Events', 'Browser Events', 'Workflow Events'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  selectedCategory === c
                    ? 'bg-purple-950 text-purple-300 border border-purple-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Log Console Output List */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-2 font-mono text-xs overflow-hidden">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400 font-bold uppercase">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            Realtime Output ({filteredLogs.length} Events)
          </span>
          <span>Trace ID / Timestamp</span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-slate-500 italic">
            No logs matching filter criteria. Try adjusting search or category filters.
          </div>
        ) : (
          <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              return (
                <div
                  key={log.id}
                  onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 cursor-pointer space-y-2 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getSeverityBadge(log.severity)}
                      <span className="text-slate-400 font-bold">[{log.category}]</span>
                      <span className="text-cyan-400 font-semibold">{log.service}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-slate-400">
                      <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-purple-300">
                        {log.traceId}
                      </span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <p className="text-slate-200 text-xs font-sans leading-relaxed">{log.message}</p>

                  {isExpanded && (
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1 mt-2">
                      <div className="text-slate-400 font-bold">Detailed Telemetry Stack:</div>
                      <p className="text-slate-300">{log.details}</p>
                      <div className="text-[10px] text-cyan-400 pt-1">
                        Full ISO Timestamp: {log.timestamp}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
