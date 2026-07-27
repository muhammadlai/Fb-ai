import React, { useState } from 'react';
import { Search, Sparkles, Loader2, Database, Tag, ArrowRight } from 'lucide-react';
import { useMemoryStore } from '../store/useMemoryStore';

export const SemanticSearchTester: React.FC = () => {
  const [query, setQuery] = useState('');
  const { performSemanticSearch, searchResults, isSearching } = useMemoryStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSemanticSearch(query);
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-200">Vector Engine Semantic Search</h3>
        </div>
        <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded-full">
          Cosine Similarity RAG
        </span>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything or search semantically (e.g., 'security policy', 'sprint schedule')..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono"
          />
        </div>
        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shadow-md"
        >
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Search</span>
            </>
          )}
        </button>
      </form>

      {/* Results View */}
      {searchResults.length > 0 && (
        <div className="space-y-3 pt-2">
          <p className="text-xs font-mono text-slate-400">
            Found <span className="text-cyan-400 font-bold">{searchResults.length}</span> semantic matches:
          </p>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
            {searchResults.map((result, idx) => {
              const mem = result.memoryItem;
              if (!mem) return null;

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-200">{mem.title}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      {(result.similarityScore * 100).toFixed(1)}% Match
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{mem.content}</p>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400">
                      {mem.type.replace('_', ' ')}
                    </span>
                    {mem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 flex items-center gap-1"
                      >
                        <Tag className="w-2.5 h-2.5 text-slate-500" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
