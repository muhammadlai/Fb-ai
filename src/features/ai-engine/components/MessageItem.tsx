import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Bot, 
  User, 
  Copy, 
  Check, 
  Brain, 
  Workflow, 
  AlertTriangle, 
  Paperclip, 
  FileText, 
  Sparkles,
  Zap,
  Clock
} from 'lucide-react';
import { ChatMessage } from '../types/ai';
import { AI_MODELS } from '../data/modelsAndTemplates';

interface MessageItemProps {
  message: ChatMessage;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showReasoning, setShowReasoning] = useState<boolean>(true);
  const [showAgentSteps, setShowAgentSteps] = useState<boolean>(true);

  const isUser = message.role === 'user';
  const modelInfo = AI_MODELS.find((m) => m.id === message.modelId);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div
      className={`py-6 px-4 md:px-6 rounded-2xl transition-all duration-200 border ${
        isUser
          ? 'bg-slate-900/40 border-slate-800/60 ml-auto max-w-3xl'
          : 'bg-slate-950/60 border-slate-800/80 backdrop-blur-md max-w-4xl'
      }`}
    >
      {/* Header Info */}
      <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-800/50">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
              isUser
                ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-purple-500/20 animate-pulse'
            }`}
          >
            {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-200">
                {isUser ? 'You' : modelInfo?.name || message.modelId || 'Nexus AI'}
              </span>

              {!isUser && message.provider && (
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {message.provider}
                </span>
              )}

              {message.failoverOccurred && (
                <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  Auto-Failover
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Token telemetry & Latency */}
        {!isUser && message.tokenUsage && (
          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400 font-mono bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-800">
            <span className="flex items-center gap-1 text-cyan-400">
              <Zap className="w-3.5 h-3.5" />
              {message.tokenUsage.totalTokens} tokens
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              {message.tokenUsage.latencyMs}ms
            </span>
          </div>
        )}
      </div>

      {/* Attachments Preview */}
      {message.attachments && message.attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {message.attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 max-w-xs"
            >
              {att.type.startsWith('image/') ? (
                <img
                  src={att.url}
                  alt={att.name}
                  className="w-12 h-12 object-cover rounded border border-slate-700"
                />
              ) : (
                <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
              )}
              <div className="truncate">
                <p className="font-medium truncate">{att.name}</p>
                <p className="text-[10px] text-slate-500">{(att.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reasoning Steps Accordion */}
      {!isUser && message.reasoningSteps && message.reasoningSteps.length > 0 && (
        <div className="mb-4 rounded-xl bg-purple-950/20 border border-purple-800/40 overflow-hidden">
          <button
            onClick={() => setShowReasoning(!showReasoning)}
            className="w-full flex items-center justify-between p-3 text-xs font-semibold text-purple-300 hover:bg-purple-950/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
              <span>Reasoning & Thinking Process ({message.reasoningSteps.length} steps)</span>
            </div>
            <span className="text-[10px] font-mono text-purple-400">
              {showReasoning ? 'Hide Trace' : 'View Trace'}
            </span>
          </button>

          {showReasoning && (
            <div className="p-3 pt-0 space-y-2 border-t border-purple-900/30">
              {message.reasoningSteps.map((step) => (
                <div key={step.id} className="p-2.5 rounded-lg bg-purple-900/10 text-xs text-purple-200">
                  <p className="font-semibold text-purple-300 mb-0.5">
                    Step {step.stepNumber}: {step.title}
                  </p>
                  <p className="text-slate-300 font-mono text-[11px] whitespace-pre-wrap">{step.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Agent Execution Steps Accordion */}
      {!isUser && message.agentSteps && message.agentSteps.length > 0 && (
        <div className="mb-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 overflow-hidden">
          <button
            onClick={() => setShowAgentSteps(!showAgentSteps)}
            className="w-full flex items-center justify-between p-3 text-xs font-semibold text-cyan-300 hover:bg-cyan-950/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Workflow className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>Agent Mode Tool Execution ({message.agentSteps.length} steps)</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">
              {showAgentSteps ? 'Collapse' : 'Expand'}
            </span>
          </button>

          {showAgentSteps && (
            <div className="p-3 pt-0 space-y-2 border-t border-cyan-900/30">
              {message.agentSteps.map((step) => (
                <div key={step.id} className="p-2.5 rounded-lg bg-cyan-900/10 text-xs text-cyan-200 flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1 shrink-0 animate-ping" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-cyan-300">{step.toolName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{step.timestamp}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] mt-0.5">{step.action}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Message Content */}
      <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed">
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="markdown-body">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');
                  const codeId = `code-${Math.random()}`;

                  return !inline ? (
                    <div className="relative my-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs font-mono text-slate-400">
                        <span>{match ? match[1] : 'code'}</span>
                        <button
                          onClick={() => copyToClipboard(codeString, codeId)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        >
                          {copiedCode === codeId ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-4 overflow-x-auto font-mono text-xs text-slate-200 leading-normal">
                        <code>{children}</code>
                      </pre>
                    </div>
                  ) : (
                    <code className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-xs" {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* Streaming Indicator */}
      {message.isStreaming && (
        <div className="flex items-center gap-2 mt-3 text-xs text-cyan-400 font-mono animate-pulse">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Generating stream response...</span>
        </div>
      )}
    </div>
  );
};
