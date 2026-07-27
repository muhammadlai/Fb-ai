import { useState, FC } from 'react';
import { Layout, Code, Network, Download, FileText, Check, Copy, Brain, Layers, Sparkles } from 'lucide-react';
import { useCreatorStore } from '../store/useCreatorStore';
import { ProjectFileTree } from './ProjectFileTree';
import { CodeFile, ComponentItem } from '../types/creator';
import { ExportModal } from './ExportModal';

export const ProjectPreviewCanvas: FC = () => {
  const { activeProject } = useCreatorStore();
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'architecture' | 'docker' | 'reasoning' | 'components'>('preview');
  const [selectedFile, setSelectedFile] = useState<CodeFile | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!activeProject) {
    return (
      <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 font-mono text-xs">
        No active project generated yet. Select a module and click "Generate Enterprise Architecture".
      </div>
    );
  }

  const currentCodeFile = selectedFile || activeProject.files[0];
  const activeComp = selectedComponent || activeProject.components?.[0];

  const handleCopyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Viewport Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'preview'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Live Interactive Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'code'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Code Files ({activeProject.files.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reasoning')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'reasoning'
                ? 'bg-purple-950 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Reasoning Plan ({activeProject.planningSteps?.length || 4})</span>
          </button>

          <button
            onClick={() => setActiveTab('components')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'components'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Component Library ({activeProject.components?.length || 3})</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'architecture'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Mermaid Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('docker')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'docker'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Docker & OpenAPI</span>
          </button>
        </div>

        <button
          onClick={() => setIsExportOpen(true)}
          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Blueprint</span>
        </button>
      </div>

      {/* Viewport Content */}
      {activeTab === 'preview' ? (
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 min-h-[420px] overflow-hidden">
          <div
            dangerouslySetInnerHTML={{ __html: activeProject.previewHtml || '<p>Loading preview...</p>' }}
          />
        </div>
      ) : activeTab === 'code' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ProjectFileTree
            treeNodes={activeProject.fileTree}
            files={activeProject.files}
            onSelectFile={setSelectedFile}
            activeFilePath={currentCodeFile?.path}
          />

          <div className="md:col-span-2 rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3 font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs text-cyan-400 font-bold">{currentCodeFile?.path}</span>
              <button
                onClick={() => handleCopyCode(currentCodeFile?.content || '')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-white cursor-pointer flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="text-xs text-slate-200 overflow-x-auto p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 leading-relaxed max-h-[450px]">
              <code>{currentCodeFile?.content}</code>
            </pre>
          </div>
        </div>
      ) : activeTab === 'reasoning' ? (
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI Multi-Step Planning & System Reasoning Log
          </h3>
          <div className="space-y-3">
            {activeProject.planningSteps?.map((s) => (
              <div key={s.step} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-bold">Step {s.step}: {s.title}</span>
                  <span className="text-emerald-400 font-bold uppercase text-[10px] bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    {s.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'components' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">Generated UI Components</h4>
            {activeProject.components?.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedComponent(c)}
                className={`p-3 rounded-xl border cursor-pointer space-y-1 ${
                  activeComp?.id === c.id
                    ? 'bg-slate-900 border-emerald-500/60'
                    : 'bg-slate-900/50 border-slate-800 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-100">
                  <span>{c.name}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">{c.category}</span>
                </div>
                <p className="text-[11px] text-slate-400">{c.description}</p>
              </div>
            ))}
          </div>

          <div className="md:col-span-2 rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3 font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs text-emerald-400 font-bold">{activeComp?.name}</span>
              <button
                onClick={() => handleCopyCode(activeComp?.code || '')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-white cursor-pointer flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Component'}</span>
              </button>
            </div>

            <pre className="text-xs text-slate-200 overflow-x-auto p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 leading-relaxed max-h-[420px]">
              <code>{activeComp?.code}</code>
            </pre>
          </div>
        </div>
      ) : activeTab === 'architecture' ? (
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
          <h3 className="text-sm font-bold text-purple-400">Mermaid.js High-Availability Topology</h3>
          <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 overflow-x-auto leading-relaxed">
            {activeProject.architectureDiagramMarkdown}
          </pre>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-cyan-400 uppercase">docker-compose.yml</h3>
            <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 overflow-x-auto">
              {activeProject.dockerComposeYaml}
            </pre>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-purple-400 uppercase">OpenAPI 3.0 Schema</h3>
            <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 overflow-x-auto">
              {activeProject.apiDocsJson}
            </pre>
          </div>
        </div>
      )}

      {/* Export Modal */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
};

