import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Brain,
  Pin,
  Clock,
  Network,
  MessageSquare,
  Plus,
  Trash2,
  Sparkles,
  Search,
  Bookmark,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { useAssistantStore, MemoryItem } from '../../store/useAssistantStore';
import { useToastStore } from '../../store/useToastStore';

export const DashboardMemoryPanel: React.FC = () => {
  const toast = useToastStore();
  const {
    memories,
    togglePinMemory,
    deleteMemory,
    addMemory,
    knowledgeNodes,
    timelineLogs,
  } = useAssistantStore();

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'pinned' | 'graph' | 'timeline'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'preference' | 'project' | 'chat_history' | 'goal'>('preference');

  const handleCreateMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    addMemory({
      title: newTitle,
      content: newContent,
      category: newCategory,
      isPinned: false,
      isLongTerm: true,
      relevanceScore: 0.9,
    });

    setNewTitle('');
    setNewContent('');
    toast.cyber('Memory Indexed', `Vector stored: "${newTitle}"`);
  };

  const filteredMemories = memories.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.content.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeSubTab === 'pinned') return matchesSearch && m.isPinned;
    return matchesSearch;
  });

  return (
    <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
              Autonomous Vector Memory Vault
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-bold uppercase">
                Pinecone / Vector Graph
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Stores preferences, projects, goals, and previous chats for Sir Aitzaz
            </p>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === 'all'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Memories ({memories.length})
          </button>
          <button
            onClick={() => setActiveSubTab('pinned')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === 'pinned'
                ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pinned
          </button>
          <button
            onClick={() => setActiveSubTab('graph')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === 'graph'
                ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Knowledge Graph
          </button>
          <button
            onClick={() => setActiveSubTab('timeline')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === 'timeline'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Timeline
          </button>
        </div>
      </div>

      {/* Tab Views */}
      {(activeSubTab === 'all' || activeSubTab === 'pinned') && (
        <div className="space-y-4">
          {/* Add Memory Form */}
          <form
            onSubmit={handleCreateMemory}
            className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3"
          >
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-cyan-400" /> Manual Memory Vector Index
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-2 py-1 text-[11px] text-cyan-300 focus:outline-none"
                >
                  <option value="preference">Preference</option>
                  <option value="project">Project</option>
                  <option value="goal">Goal</option>
                  <option value="chat_history">Chat Fact</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Memory Title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
              />
              <input
                type="text"
                placeholder="Content / Vector Knowledge text..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" /> Save Vector Memory
            </button>
          </form>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vector embeddings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
            />
          </div>

          {/* Memories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredMemories.map((m) => (
              <div
                key={m.id}
                className={`p-4 rounded-2xl border transition-all space-y-2 ${
                  m.isPinned
                    ? 'bg-gradient-to-b from-purple-950/40 to-slate-900 border-purple-500/40 shadow-lg'
                    : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-[9px] font-mono text-cyan-300 font-bold uppercase">
                      {m.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-100 font-mono truncate max-w-[180px]">
                      {m.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => togglePinMemory(m.id)}
                      className={`p-1 rounded-lg transition-colors cursor-pointer ${
                        m.isPinned ? 'text-purple-400 bg-purple-950' : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title={m.isPinned ? 'Unpin Memory' : 'Pin Memory'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteMemory(m.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete Memory Vector"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">{m.content}</p>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                  <span>Score: {(m.relevanceScore * 100).toFixed(0)}%</span>
                  <span>{m.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Knowledge Graph Tab */}
      {activeSubTab === 'graph' && (
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-2">
              <Network className="w-4 h-4 text-indigo-400" /> Multi-Entity Knowledge Graph
            </h4>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
              5 Active Nodes
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {knowledgeNodes.map((node) => (
              <div
                key={node.id}
                className="p-3.5 rounded-xl bg-slate-900 border border-indigo-500/30 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-slate-100">{node.label}</span>
                  <span className="text-[9px] font-mono text-cyan-400 uppercase bg-cyan-950 px-2 py-0.5 rounded-full">
                    {node.type}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Connected to: {node.connections.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conversation Timeline Tab */}
      {activeSubTab === 'timeline' && (
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {timelineLogs.map((log) => (
            <div
              key={log.id}
              className={`p-3 rounded-2xl border text-xs font-sans space-y-1 ${
                log.speaker === 'user'
                  ? 'bg-slate-950 border-amber-500/30 text-amber-200'
                  : 'bg-slate-900/80 border-cyan-500/30 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                <span className={log.speaker === 'user' ? 'text-amber-400' : 'text-cyan-400'}>
                  {log.speaker === 'user' ? 'Sir Aitzaz (Speech)' : 'Nexus Voice AI'}
                </span>
                <span className="text-slate-500">{log.time}</span>
              </div>
              <p className="leading-relaxed">{log.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
