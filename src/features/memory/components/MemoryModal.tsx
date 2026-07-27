import React, { useState } from 'react';
import { X, Brain, Tag, Sparkles } from 'lucide-react';
import { useMemoryStore } from '../store/useMemoryStore';
import { MemoryType } from '../types/memory';

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({ isOpen, onClose }) => {
  const { addMemory } = useMemoryStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<MemoryType>('long_term');
  const [tagsInput, setTagsInput] = useState('');
  const [importanceScore, setImportanceScore] = useState(8);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addMemory({
      title,
      content,
      type,
      tags: tags.length > 0 ? tags : ['General'],
      importanceScore,
    });

    // Reset and close
    setTitle('');
    setContent('');
    setTagsInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base text-slate-100">Create Memory Entry</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-mono mb-1.5 uppercase text-[10px]">Title / Headline</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Enterprise Database Backup Credentials"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-mono mb-1.5 uppercase text-[10px]">Memory Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as MemoryType)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500/50 uppercase font-mono"
              >
                <option value="long_term">Long-Term Memory</option>
                <option value="short_term">Short-Term Memory</option>
                <option value="conversation">Conversation Context</option>
                <option value="knowledge_base">Knowledge Base</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1.5 uppercase text-[10px]">Importance Score ({importanceScore}/10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={importanceScore}
                onChange={(e) => setImportanceScore(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer mt-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1.5 uppercase text-[10px]">Memory Content</label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write detailed memory context to index into vector database..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500/50 font-sans"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1.5 uppercase text-[10px]">Memory Tags (comma separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Architecture, Security, DevOps, API"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500/50 font-mono"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold uppercase tracking-wider flex items-center gap-1.5 hover:from-purple-500 hover:to-cyan-500 transition-all cursor-pointer shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Save Memory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
