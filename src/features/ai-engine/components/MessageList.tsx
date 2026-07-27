import React, { useEffect, useRef } from 'react';
import { Sparkles, Cpu, Layers, ShieldAlert, Code2, Terminal, Bot } from 'lucide-react';
import { ChatMessage } from '../types/ai';
import { MessageItem } from './MessageItem';
import { PROMPT_TEMPLATES } from '../data/modelsAndTemplates';

interface MessageListProps {
  messages: ChatMessage[];
  isGenerating: boolean;
  onSelectPromptTemplate: (prompt: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isGenerating,
  onSelectPromptTemplate,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-0.5 shadow-2xl shadow-cyan-500/20 mb-6">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-cyan-400 mb-3 tracking-tight">
          Nexus AI Creator OS Engine
        </h2>
        <p className="text-sm text-slate-400 max-w-lg mb-8 leading-relaxed">
          Select a multi-model provider, attach code files, or pick an enterprise architecture template below to begin.
        </p>

        {/* Starter Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full text-left">
          {PROMPT_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => onSelectPromptTemplate(tpl.promptText)}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all duration-200 group flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-slate-800 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-colors shrink-0 mt-0.5">
                {tpl.category === 'Architecture' && <Layers className="w-4 h-4" />}
                {tpl.category === 'Coding' && <Code2 className="w-4 h-4" />}
                {tpl.category === 'Security' && <ShieldAlert className="w-4 h-4" />}
                {tpl.category === 'Reasoning' && <Cpu className="w-4 h-4" />}
                {tpl.category === 'Writing' && <Bot className="w-4 h-4" />}
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {tpl.title}
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                    {tpl.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-1">{tpl.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
      {messages.map((msg) => (
        <MessageItem key={msg.id} message={msg} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
