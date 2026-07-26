import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Workflow, Sparkles, Copy, Check, Zap, Cpu } from 'lucide-react';
import { ChatMessage, SystemSettings } from '../types';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (content: string, triggerN8n: boolean) => Promise<void>;
  isGenerating: boolean;
  settings: SystemSettings | null;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  isGenerating,
  settings,
}) => {
  const [input, setInput] = useState('');
  const [triggerN8n, setTriggerN8n] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    const msg = input;
    setInput('');
    await onSendMessage(msg, triggerN8n);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePromptClick = (promptText: string, n8nToggle: boolean = false) => {
    setInput(promptText);
    setTriggerN8n(n8nToggle);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Top Chat Subheader */}
      <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Nexus AI Conversation Engine
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h2>
            <p className="text-[11px] text-slate-400 flex items-center gap-2">
              <span className="font-mono text-indigo-300">
                Model: {settings?.selected_model || 'gemini-2.5-flash'}
              </span>
              •
              <span>Temperature: {settings?.temperature ?? 0.7}</span>
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            FastAPI Connected
          </span>
        </div>
      </div>

      {/* Message List Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="max-w-md space-y-1">
              <h3 className="text-base font-bold text-slate-100">Welcome to Nexus AI Agent</h3>
              <p className="text-xs text-slate-400">
                Ask any question, analyze code, or dispatch automated n8n webhook workflows directly from chat!
              </p>
            </div>

            {/* Quick Starter Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full pt-4">
              <button
                onClick={() => handlePromptClick('Check FastAPI backend health and webhook status', false)}
                className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left text-xs text-slate-300 transition-colors flex items-center justify-between group"
              >
                <span>⚡ Check FastAPI Health Status</span>
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={() => handlePromptClick('Trigger n8n workflow for automated task execution', true)}
                className="p-3 bg-slate-950 hover:bg-slate-800 border border-indigo-900/50 rounded-xl text-left text-xs text-indigo-300 transition-colors flex items-center justify-between group"
              >
                <span className="flex items-center gap-1.5">
                  <Workflow className="w-3.5 h-3.5 text-indigo-400" />
                  Dispatch n8n Webhook Task
                </span>
                <Zap className="w-3.5 h-3.5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={() => handlePromptClick('Explain how FastAPI connects with n8n via webhooks', false)}
                className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left text-xs text-slate-300 transition-colors flex items-center justify-between group"
              >
                <span>📘 Webhook Architecture Overview</span>
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={() => handlePromptClick('Write a production FastAPI pydantic model example', false)}
                className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left text-xs text-slate-300 transition-colors flex items-center justify-between group"
              >
                <span>💻 FastAPI Code Generation</span>
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-bold text-xs ${
                    isUser
                      ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-md shadow-indigo-500/20'
                      : 'bg-slate-800 text-emerald-400 border border-slate-700'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="group relative space-y-1 max-w-[85%]">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-300">
                      {isUser ? 'You' : 'Nexus AI Agent'}
                    </span>
                    <span>•</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {msg.n8n_triggered && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">
                        <Workflow className="w-3 h-3 text-indigo-400" />
                        n8n Triggered
                      </span>
                    )}
                  </div>

                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/10'
                        : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => copyToClipboard(msg.id, msg.content)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5 right-1 p-1 text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 bg-slate-900 border border-slate-800 rounded px-1.5"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Typing Indicator */}
        {isGenerating && (
          <div className="flex gap-3 max-w-xl mr-auto">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Nexus AI thinking</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping delay-150" />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping delay-300" />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex items-center justify-between px-1 text-xs">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-indigo-300 transition-colors">
              <input
                type="checkbox"
                checked={triggerN8n}
                onChange={(e) => setTriggerN8n(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900"
              />
              <Workflow className={`w-3.5 h-3.5 ${triggerN8n ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span>Dispatch n8n Webhook Automation for this prompt</span>
            </label>

            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Press Enter to send
            </span>
          </div>

          <div className="relative flex items-center">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              rows={2}
              placeholder="Message Nexus AI Agent or enter automation command..."
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-xs sm:text-sm rounded-xl p-3 pr-12 focus:outline-none focus:border-indigo-500 placeholder:text-slate-500 resize-none font-sans"
            />
            <button
              type="submit"
              disabled={!input.trim() || isGenerating}
              className="absolute right-2.5 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md shadow-indigo-600/20 transition-all disabled:opacity-40 disabled:hover:bg-indigo-600"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
