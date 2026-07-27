import React, { useState } from 'react';
import {
  Brain,
  Database,
  Search,
  Upload,
  Plus,
  Tag,
  Trash2,
  FileText,
  Clock,
  Sparkles,
  Layers,
  CheckCircle2,
  Cpu,
  BookOpen,
} from 'lucide-react';
import { useMemoryStore } from '../store/useMemoryStore';
import { DocumentUploader } from './DocumentUploader';
import { SemanticSearchTester } from './SemanticSearchTester';
import { MemoryModal } from './MemoryModal';

export const MemoryDashboard: React.FC = () => {
  const {
    memories,
    documents,
    activeTab,
    selectedTag,
    setActiveTab,
    setSelectedTag,
    deleteMemory,
    deleteDocument,
  } = useMemoryStore();

  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);

  // Extract unique tags
  const allTags = Array.from(
    new Set([
      ...memories.flatMap((m) => m.tags),
      ...documents.flatMap((d) => d.tags),
    ])
  );

  // Filter memories
  const filteredMemories = memories.filter((m) => {
    if (activeTab !== 'all' && activeTab !== 'documents' && activeTab !== 'search') {
      if (m.type !== activeTab) return false;
    }
    if (selectedTag && !m.tags.includes(selectedTag)) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono uppercase tracking-wider">
              Phase 5 Vector Vault Live
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
            <Database className="w-7 h-7 text-cyan-400 animate-pulse" />
            Enterprise Memory & Vector Knowledge Vault
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Long-term & short-term memory persistence, conversation context index, PDF/Word/OCR document ingestion, and 128-dim vector RAG search.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMemoryModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add Memory Entry</span>
          </button>
        </div>
      </div>

      {/* Top Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Brain className="w-4 h-4 text-cyan-400" />
            <span>Total Memories</span>
          </div>
          <p className="text-2xl font-bold text-slate-100 font-mono">{memories.length}</p>
          <span className="text-[10px] font-mono text-cyan-400/80">Active in RAG Memory Store</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <FileText className="w-4 h-4 text-purple-400" />
            <span>Ingested Documents</span>
          </div>
          <p className="text-2xl font-bold text-slate-100 font-mono">{documents.length}</p>
          <span className="text-[10px] font-mono text-purple-400/80">PDF, Word & OCR Images</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Vector Index Chunks</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400 font-mono">
            {documents.reduce((acc, d) => acc + d.chunkCount, 0) + memories.length * 2}
          </p>
          <span className="text-[10px] font-mono text-emerald-400/80">128-Dim Embeddings</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Tag className="w-4 h-4 text-amber-400" />
            <span>Memory Tags</span>
          </div>
          <p className="text-2xl font-bold text-slate-100 font-mono">{allTags.length}</p>
          <span className="text-[10px] font-mono text-amber-400/80">Categorized Topics</span>
        </div>
      </div>

      {/* Semantic Search Panel */}
      <SemanticSearchTester />

      {/* Navigation Tabs & Tag Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'long_term', label: 'Long-Term Memory' },
            { id: 'short_term', label: 'Short-Term Memory' },
            { id: 'conversation', label: 'Conversation Memory' },
            { id: 'knowledge_base', label: 'Knowledge Base' },
            { id: 'documents', label: 'Ingested Documents' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tags Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Tags:</span>
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900 cursor-pointer"
            >
              Clear filter ({selectedTag}) ×
            </button>
          )}
          {allTags.slice(0, 5).map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                selectedTag === tag
                  ? 'bg-purple-950 border-purple-500/50 text-purple-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      {activeTab === 'documents' ? (
        <div className="space-y-6">
          <DocumentUploader />

          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Ingested Document Vault ({documents.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-200 truncate">{doc.fileName}</h4>
                        <span className="text-[10px] font-mono text-slate-500">
                          {(doc.fileSize / 1024).toFixed(1)} KB • {doc.chunkCount} Vector Chunks
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 font-sans">
                    {doc.extractedText}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {doc.ocrConfidence ? `Gemini OCR (${doc.ocrConfidence}%)` : 'Vector Indexed'}
                    </span>
                    <span className="text-slate-500">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMemories.map((mem) => (
            <div
              key={mem.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-colors space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    {mem.type.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">
                      Score: {mem.importanceScore}/10
                    </span>
                    <button
                      onClick={() => deleteMemory(mem.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-100">{mem.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{mem.content}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
                <div className="flex items-center gap-1 flex-wrap">
                  {mem.tags.map((tag) => (
                    <span key={tag} className="text-slate-400">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{new Date(mem.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Memory Creation Modal */}
      <MemoryModal isOpen={isMemoryModalOpen} onClose={() => setIsMemoryModalOpen(false)} />
    </div>
  );
};
