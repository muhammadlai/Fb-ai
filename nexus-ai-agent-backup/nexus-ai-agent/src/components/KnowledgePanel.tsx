import React, { useState } from 'react';
import {
  Database,
  Upload,
  FileText,
  Globe,
  Youtube,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Search,
  Plus,
  Trash2,
  HardDrive,
  Cpu,
  Layers,
  RefreshCw
} from 'lucide-react';
import { KNOWLEDGE_ITEMS, VECTOR_DB_STATUS } from '../data/mockData';
import { KnowledgeItem } from '../types';

export const KnowledgePanel: React.FC = () => {
  const [items, setItems] = useState<KnowledgeItem[]>(KNOWLEDGE_ITEMS);
  const [urlInput, setUrlInput] = useState('');
  const [activeTab, setActiveTab] = useState<'files' | 'urls' | 'youtube' | 'vectors'>('files');

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    const isYoutube = urlInput.includes('youtube.com') || urlInput.includes('youtu.be');
    const newItem: KnowledgeItem = {
      id: `k_${Date.now()}`,
      name: urlInput,
      type: isYoutube ? 'youtube' : 'web_url',
      size_or_url: urlInput,
      chunks_count: 140,
      embeddings_model: 'text-embedding-004 (1536d)',
      status: 'indexed',
      uploaded_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      tokens_count: 52000,
    };
    setItems(prev => [newItem, ...prev]);
    setUrlInput('');
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-6 p-1 custom-scrollbar animate-fadeIn">
      {/* Title & Vector DB Status Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-cyan-950/60 border border-purple-500/30 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Database className="w-6 h-6 text-purple-400" />
            Vector Knowledge Base & RAG Embeddings Store
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ingest PDFs, docs, CSV tables, live URLs, and YouTube transcripts into Pinecone Vector Database.
          </p>
        </div>

        {/* Vector DB Health Badge */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-purple-500/30 font-mono text-xs space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Cluster: {VECTOR_DB_STATUS.index_name}</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {VECTOR_DB_STATUS.health}
            </span>
          </div>
          <div className="text-purple-300 font-bold text-sm">
            {VECTOR_DB_STATUS.total_vectors.toLocaleString()} Vectors Indexed
          </div>
        </div>
      </div>

      {/* Upload Zone & Ingestion Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Dropzone */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border-2 border-dashed border-purple-500/40 hover:border-purple-400 backdrop-blur-xl flex flex-col items-center justify-center text-center space-y-3 cursor-pointer group transition-all">
          <div className="p-4 rounded-2xl bg-purple-600/20 text-purple-400 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-200">Upload Knowledge Documents</div>
            <p className="text-xs text-slate-400 mt-1">Support PDF, DOCX, TXT, CSV, or Image files</p>
          </div>
          <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Auto-Chunking & Embedding Active
          </span>
        </div>

        {/* Web URL & YouTube Links Ingestor */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-4">
          <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            Ingest Web URL or YouTube Video Transcript
          </div>
          <p className="text-xs text-slate-400">
            Automatically crawl webpage HTML or extract YouTube audio transcript into vector embeddings.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste Web URL (https://...) or YouTube link (https://youtube.com/watch?v=...)"
              className="flex-1 bg-slate-950 text-slate-200 text-xs rounded-xl px-3 py-2.5 border border-white/10 focus:outline-none focus:border-cyan-500/40"
            />
            <button
              onClick={handleAddUrl}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Ingest Link</span>
            </button>
          </div>
        </div>
      </div>

      {/* Knowledge Documents Index Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <span className="text-sm font-bold text-slate-100">Indexed Knowledge Documents ({items.length})</span>
          <span className="text-xs text-purple-400 font-mono">
            {items.reduce((acc, i) => acc + i.chunks_count, 0)} Total Chunks
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px]">
                <th className="pb-3 font-semibold">Document Name</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Chunks</th>
                <th className="pb-3 font-semibold">Embeddings Model</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 pr-2 font-medium text-slate-200 flex items-center gap-2">
                    {item.type === 'pdf' && <FileText className="w-4 h-4 text-purple-400" />}
                    {item.type === 'web_url' && <Globe className="w-4 h-4 text-cyan-400" />}
                    {item.type === 'youtube' && <Youtube className="w-4 h-4 text-rose-400" />}
                    {item.type === 'csv' && <Database className="w-4 h-4 text-emerald-400" />}
                    {item.type === 'txt' && <FileText className="w-4 h-4 text-amber-400" />}
                    <span className="truncate max-w-xs">{item.name}</span>
                  </td>
                  <td className="py-3 uppercase font-mono text-[10px] text-slate-400">{item.type}</td>
                  <td className="py-3 font-mono text-purple-300 font-bold">{item.chunks_count} chunks</td>
                  <td className="py-3 font-mono text-[11px] text-slate-400">{item.embeddings_model}</td>
                  <td className="py-3 font-mono text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {item.status}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove document from Vector DB"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
