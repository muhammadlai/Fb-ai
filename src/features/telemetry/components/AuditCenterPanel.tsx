import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Shield,
  Bot,
  Zap,
  Globe,
  Lock,
  Download,
} from 'lucide-react';
import { AuditLog, ActionType } from '../types/telemetry';

interface Props {
  auditLogs: AuditLog[];
}

export const AuditCenterPanel: React.FC<Props> = ({ auditLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<ActionType | 'all'>('all');
  const [selectedAudit, setSelectedAudit] = useState<AuditLog | null>(null);

  const filtered = auditLogs.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm);

    const matchesAction = selectedAction === 'all' || log.actionType === selectedAction;
    return matchesSearch && matchesAction;
  });

  const getActionIcon = (action: ActionType) => {
    switch (action) {
      case 'Prompt':
        return <FileText className="w-3.5 h-3.5 text-cyan-400" />;
      case 'AI Response':
        return <Bot className="w-3.5 h-3.5 text-purple-400" />;
      case 'API Call':
        return <Zap className="w-3.5 h-3.5 text-indigo-400" />;
      case 'Browser Automation':
        return <Globe className="w-3.5 h-3.5 text-amber-400" />;
      case 'Workflow':
        return <Clock className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Login':
        return <Lock className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <User className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const handleExportAuditCSV = () => {
    const headers = 'ID,Timestamp,ActionType,Actor,IPAddress,Status,DurationMs,Resource,Details\n';
    const rows = filtered
      .map(
        (a) =>
          `"${a.id}","${a.timestamp}","${a.actionType}","${a.actor}","${a.ipAddress}","${a.status}",${a.durationMs},"${a.resource}","${a.details.replace(/"/g, '""')}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `enterprise-audit-trail-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search audit trail by actor email, IP address, resource or action details..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <button
            onClick={handleExportAuditCSV}
            className="px-3.5 py-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-xs text-cyan-300 font-mono font-bold hover:bg-cyan-900 cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Download className="w-4 h-4" />
            Export Audit Trail (CSV)
          </button>
        </div>

        {/* Action Type Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-800/80 text-xs font-mono">
          <span className="text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Action Filter:
          </span>
          {(['all', 'Prompt', 'AI Response', 'API Call', 'Browser Automation', 'Workflow', 'Login', 'User Action'] as const).map(
            (act) => (
              <button
                key={act}
                onClick={() => setSelectedAction(act)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                  selectedAction === act
                    ? 'bg-purple-950 text-purple-300 border border-purple-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {act}
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Audit List & Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400 font-bold uppercase">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              Compliance Audit Trail ({filtered.length} Entries)
            </span>
            <span>Duration / Status</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedAudit(item)}
                className={`p-3.5 rounded-xl border cursor-pointer space-y-2 transition-all ${
                  selectedAudit?.id === item.id
                    ? 'bg-slate-900 border-cyan-500/60 shadow-lg'
                    : 'bg-slate-900/50 border-slate-800 hover:bg-slate-900'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
                      {getActionIcon(item.actionType)}
                    </span>
                    <span className="text-slate-100 font-bold">{item.actionType}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {item.actor}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-cyan-300 font-bold">{item.durationMs} ms</span>
                    {item.status === 'success' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> SUCCESS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/30 font-bold uppercase">
                        <XCircle className="w-3 h-3 text-rose-400" /> FAILED
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-slate-300 text-xs font-sans">{item.details}</p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                  <span>Resource: {item.resource}</span>
                  <span>IP: {item.ipAddress} • {new Date(item.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Inspector Card */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 font-mono">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Audit Inspector
          </h3>

          {selectedAudit ? (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Audit ID</span>
                <span className="text-slate-100 font-bold">{selectedAudit.id}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Action Category</span>
                <span className="text-purple-300 font-bold">{selectedAudit.actionType}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Actor Identity</span>
                <span className="text-cyan-300 font-bold">{selectedAudit.actor}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Source IP Address</span>
                <span className="text-amber-300 font-bold">{selectedAudit.ipAddress}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Timestamp & SLA Duration</span>
                <span className="text-slate-200">{new Date(selectedAudit.timestamp).toLocaleString()} ({selectedAudit.durationMs}ms)</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Execution Payload</span>
                <p className="text-xs font-sans text-slate-300 leading-relaxed">{selectedAudit.details}</p>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500 text-xs italic">
              Select an audit log entry from the list to inspect full compliance telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
