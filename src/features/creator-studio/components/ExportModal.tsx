import { FC, useState } from 'react';
import { X, Download, Copy, Check, FileJson, Archive, Code } from 'lucide-react';
import { useCreatorStore } from '../store/useCreatorStore';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { activeProject } = useCreatorStore();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !activeProject) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(activeProject, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZipSim = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeProject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${activeProject.title.toLowerCase().replace(/\s+/g, '-')}-architecture.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Archive className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">
              Export Enterprise Blueprint: {activeProject.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={handleDownloadZipSim}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer space-y-2 group"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Download className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-200">Download Blueprint Specs (.json)</h3>
            <p className="text-xs text-slate-400 font-mono">
              Export complete file tree, OpenAPI schemas, Docker Compose, and code manifests.
            </p>
          </div>

          <div
            onClick={handleCopyJson}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer space-y-2 group"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </div>
            <h3 className="text-sm font-bold text-slate-200">Copy Manifest JSON</h3>
            <p className="text-xs text-slate-400 font-mono">
              {copied ? 'Copied to clipboard!' : 'Copy raw project architecture JSON payload.'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
          <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">
            CLI Quick Start Command
          </span>
          <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-cyan-300 overflow-x-auto">
            npx @nexus-ai/creator-cli init --project {activeProject.id} --stack {activeProject.techStack.join(',')}
          </pre>
        </div>
      </div>
    </div>
  );
};
