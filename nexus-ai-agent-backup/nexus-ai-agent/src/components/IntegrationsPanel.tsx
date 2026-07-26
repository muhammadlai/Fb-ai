import React, { useState } from 'react';
import {
  Sliders,
  Search,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Zap,
  CloudSun,
  Globe,
  Calendar,
  Mail,
  MessageSquare,
  MessageCircle,
  Phone,
  Send,
  Github,
  GitBranch,
  Box,
  CheckSquare,
  FileText,
  HardDrive,
  Cloud,
  Folder,
  Workflow,
  Plus
} from 'lucide-react';
import { TOOL_INTEGRATIONS } from '../data/mockData';
import { ToolIntegration } from '../types';

export const IntegrationsPanel: React.FC = () => {
  const [tools, setTools] = useState<ToolIntegration[]>(TOOL_INTEGRATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Dev', 'Communication', 'Productivity', 'Automation', 'Storage', 'Search'];

  const filteredTools = tools.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleConnection = (id: string) => {
    setTools(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              is_connected: !t.is_connected,
              status: t.is_connected ? 'disconnected' : 'active',
            }
          : t
      )
    );
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'CloudSun': return <CloudSun className="w-5 h-5 text-amber-400" />;
      case 'Globe': return <Globe className="w-5 h-5 text-cyan-400" />;
      case 'Calendar': return <Calendar className="w-5 h-5 text-blue-400" />;
      case 'Mail': return <Mail className="w-5 h-5 text-rose-400" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-fuchsia-400" />;
      case 'MessageCircle': return <MessageCircle className="w-5 h-5 text-indigo-400" />;
      case 'Phone': return <Phone className="w-5 h-5 text-emerald-400" />;
      case 'Send': return <Send className="w-5 h-5 text-sky-400" />;
      case 'Github': return <Github className="w-5 h-5 text-slate-100" />;
      case 'GitBranch': return <GitBranch className="w-5 h-5 text-orange-400" />;
      case 'Box': return <Box className="w-5 h-5 text-blue-400" />;
      case 'CheckSquare': return <CheckSquare className="w-5 h-5 text-indigo-400" />;
      case 'FileText': return <FileText className="w-5 h-5 text-amber-400" />;
      case 'HardDrive': return <HardDrive className="w-5 h-5 text-emerald-400" />;
      case 'Cloud': return <Cloud className="w-5 h-5 text-sky-400" />;
      case 'Folder': return <Folder className="w-5 h-5 text-purple-400" />;
      case 'Workflow': return <Workflow className="w-5 h-5 text-purple-400" />;
      default: return <Zap className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-6 p-1 custom-scrollbar animate-fadeIn">
      {/* Title Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-cyan-950/60 border border-purple-500/30 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-purple-400" />
            Connected Tools & Ecosystem Integrations ({tools.length})
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Connect Nexus AI Agent directly to Weather, Google, Slack, WhatsApp, GitHub, Jira, Notion, and n8n webhooks.
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
          {tools.filter(t => t.is_connected).length} / {tools.length} Tools Connected
        </span>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-white/10 text-xs font-medium overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools & webhooks..."
            className="w-full bg-slate-900 text-xs text-slate-200 placeholder-slate-500 pl-8 pr-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500/40"
          />
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className={`p-4 rounded-2xl bg-slate-900/80 border backdrop-blur-xl shadow-xl transition-all duration-300 hover:-translate-y-1 ${
              tool.is_connected
                ? 'border-purple-500/40 shadow-purple-950/30'
                : 'border-white/10 opacity-75 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 shadow-inner">
                  {renderIcon(tool.icon_name)}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-100">{tool.name}</div>
                  <div className="text-[10px] font-mono text-purple-400">{tool.category}</div>
                </div>
              </div>

              {/* Toggle switch */}
              <button
                onClick={() => toggleConnection(tool.id)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all ${
                  tool.is_connected
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border border-white/10 hover:text-white'
                }`}
              >
                {tool.is_connected ? 'CONNECTED' : 'DISCONNECTED'}
              </button>
            </div>

            <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
              {tool.description}
            </p>

            {tool.last_used && (
              <div className="mt-3 pt-2 border-t border-white/5 text-[10px] text-slate-500 font-mono">
                Last used: {tool.last_used}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
