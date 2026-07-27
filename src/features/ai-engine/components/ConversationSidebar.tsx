import React, { useState } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Search, 
  Trash2, 
  Pin, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Edit2,
  Check,
  X,
  FileJson,
  FileText
} from 'lucide-react';
import { Conversation } from '../types/ai';

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onCreateConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onTogglePin: (id: string) => void;
  onExport: (id: string, format: 'json' | 'markdown' | 'txt') => void;
  onClearHistory: () => void;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation,
  onUpdateTitle,
  onTogglePin,
  onExport,
  onClearHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState('');
  const [exportMenuId, setExportMenuId] = useState<string | null>(null);

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pinnedConversations = filteredConversations.filter((c) => c.isPinned);
  const recentConversations = filteredConversations.filter((c) => !c.isPinned);

  const startEditing = (c: Conversation) => {
    setEditingId(c.id);
    setEditTitleText(c.title);
  };

  const saveEditing = (id: string) => {
    if (editTitleText.trim()) {
      onUpdateTitle(id, editTitleText.trim());
    }
    setEditingId(null);
  };

  if (isCollapsed) {
    return (
      <div className="w-14 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-4 space-y-4">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 transition-colors"
          title="Expand History Sidebar"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={onCreateConversation}
          className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/30 transition-colors"
          title="New Chat"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-72 bg-slate-950/95 border-r border-slate-800 flex flex-col h-full backdrop-blur-xl z-20">
      {/* Sidebar Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
        <button
          onClick={onCreateConversation}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-500/20 mr-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>

        <button
          onClick={() => setIsCollapsed(true)}
          className="p-2 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-white transition-colors"
          title="Collapse Sidebar"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-slate-800/80">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4 scrollbar-thin">
        {/* Pinned Section */}
        {pinnedConversations.length > 0 && (
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-mono font-bold uppercase text-amber-400 flex items-center gap-1">
              <Pin className="w-3 h-3" />
              <span>Pinned</span>
            </div>
            {pinnedConversations.map((c) => (
              <ConversationItem
                key={c.id}
                conversation={c}
                isActive={c.id === activeConversationId}
                editingId={editingId}
                editTitleText={editTitleText}
                exportMenuId={exportMenuId}
                onSelect={() => onSelectConversation(c.id)}
                onDelete={() => onDeleteConversation(c.id)}
                onTogglePin={() => onTogglePin(c.id)}
                onStartEditing={() => startEditing(c)}
                onSaveEditing={() => saveEditing(c.id)}
                onCancelEditing={() => setEditingId(null)}
                setEditTitleText={setEditTitleText}
                setExportMenuId={setExportMenuId}
                onExport={onExport}
              />
            ))}
          </div>
        )}

        {/* Recent Section */}
        <div className="space-y-1">
          {pinnedConversations.length > 0 && (
            <div className="px-2 text-[10px] font-mono font-bold uppercase text-slate-500">
              Recent
            </div>
          )}
          {recentConversations.map((c) => (
            <ConversationItem
              key={c.id}
              conversation={c}
              isActive={c.id === activeConversationId}
              editingId={editingId}
              editTitleText={editTitleText}
              exportMenuId={exportMenuId}
              onSelect={() => onSelectConversation(c.id)}
              onDelete={() => onDeleteConversation(c.id)}
              onTogglePin={() => onTogglePin(c.id)}
              onStartEditing={() => startEditing(c)}
              onSaveEditing={() => saveEditing(c.id)}
              onCancelEditing={() => setEditingId(null)}
              setEditTitleText={setEditTitleText}
              setExportMenuId={setExportMenuId}
              onExport={onExport}
            />
          ))}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="font-mono text-[10px] text-slate-500">
          {conversations.length} Sessions Saved
        </span>
        <button
          onClick={onClearHistory}
          className="text-[11px] text-red-400 hover:text-red-300 font-medium hover:underline transition-colors"
        >
          Clear History
        </button>
      </div>
    </div>
  );
};

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  editingId: string | null;
  editTitleText: string;
  exportMenuId: string | null;
  onSelect: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
  onStartEditing: () => void;
  onSaveEditing: () => void;
  onCancelEditing: () => void;
  setEditTitleText: (text: string) => void;
  setExportMenuId: (id: string | null) => void;
  onExport: (id: string, format: 'json' | 'markdown' | 'txt') => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  editingId,
  editTitleText,
  exportMenuId,
  onSelect,
  onDelete,
  onTogglePin,
  onStartEditing,
  onSaveEditing,
  onCancelEditing,
  setEditTitleText,
  setExportMenuId,
  onExport,
}) => {
  const isEditing = editingId === conversation.id;
  const showExportMenu = exportMenuId === conversation.id;

  return (
    <div
      className={`relative group rounded-xl transition-all ${
        isActive
          ? 'bg-gradient-to-r from-cyan-950/80 to-slate-900 border border-cyan-500/40 text-cyan-200'
          : 'hover:bg-slate-900/80 text-slate-300'
      }`}
    >
      <div className="flex items-center justify-between p-2.5">
        <button
          onClick={onSelect}
          className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
        >
          <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
          {isEditing ? (
            <input
              type="text"
              value={editTitleText}
              onChange={(e) => setEditTitleText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSaveEditing()}
              className="w-full bg-slate-950 border border-cyan-500 rounded px-1.5 py-0.5 text-xs text-white outline-none"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="text-xs truncate font-medium">{conversation.title}</span>
          )}
        </button>

        {/* Action icons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isEditing ? (
            <>
              <button
                onClick={onSaveEditing}
                className="p-1 text-emerald-400 hover:bg-slate-800 rounded"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onCancelEditing}
                className="p-1 text-slate-400 hover:bg-slate-800 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onTogglePin}
                className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                  conversation.isPinned ? 'text-amber-400' : 'text-slate-400'
                }`}
                title="Pin Conversation"
              >
                <Pin className="w-3 h-3" />
              </button>

              <button
                onClick={onStartEditing}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title="Rename"
              >
                <Edit2 className="w-3 h-3" />
              </button>

              <button
                onClick={() => setExportMenuId(showExportMenu ? null : conversation.id)}
                className="p-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                title="Export"
              >
                <Download className="w-3 h-3" />
              </button>

              <button
                onClick={onDelete}
                className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Export Format Dropdown */}
      {showExportMenu && (
        <div className="absolute right-2 top-full mt-1 z-30 p-1.5 rounded-xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col gap-1 text-xs text-slate-200">
          <button
            onClick={() => {
              onExport(conversation.id, 'markdown');
              setExportMenuId(null);
            }}
            className="flex items-center gap-2 px-2.5 py-1 rounded hover:bg-slate-800 text-left font-mono"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Markdown (.md)</span>
          </button>
          <button
            onClick={() => {
              onExport(conversation.id, 'json');
              setExportMenuId(null);
            }}
            className="flex items-center gap-2 px-2.5 py-1 rounded hover:bg-slate-800 text-left font-mono"
          >
            <FileJson className="w-3.5 h-3.5 text-emerald-400" />
            <span>JSON (.json)</span>
          </button>
          <button
            onClick={() => {
              onExport(conversation.id, 'txt');
              setExportMenuId(null);
            }}
            className="flex items-center gap-2 px-2.5 py-1 rounded hover:bg-slate-800 text-left font-mono"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Plain Text (.txt)</span>
          </button>
        </div>
      )}
    </div>
  );
};
