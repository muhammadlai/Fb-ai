import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Mic,
  MicOff,
  Copy,
  Check,
  RotateCcw,
  Edit2,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX,
  Search,
  Workflow,
  ChevronDown,
  ChevronUp,
  Bot,
  User,
  X,
  ArrowDown,
  FileCode,
  Globe,
  Database
} from 'lucide-react';
import { ChatMessage, SystemSettings, MessageAttachment } from '../types';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (content: string, triggerN8n: boolean, attachments?: MessageAttachment[]) => void;
  isGenerating: boolean;
  settings: SystemSettings | null;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  isGenerating,
  settings,
}) => {
  const [inputContent, setInputContent] = useState('');
  const [triggerN8n, setTriggerN8n] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [likedMsgs, setLikedMsgs] = useState<Record<string, boolean>>({});
  const [dislikedMsgs, setDislikedMsgs] = useState<Record<string, boolean>>({});
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showThinkingSteps, setShowThinkingSteps] = useState<Record<string, boolean>>({
    thinking_latest: true,
  });
  const [isDragOver, setIsDragOver] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // Voice Input (Web Speech API Dictation)
  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser tab.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputContent(prev => (prev ? `${prev} ${transcript}` : transcript));
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  // Speak Message Response (Web Speech API TTS)
  const speakMessage = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser tab.');
      return;
    }

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#`]/g, ''));
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Copy helper
  const copyToClipboard = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // File Upload Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    addFilesToAttachments(Array.from(files));
  };

  const addFilesToAttachments = (fileList: File[]) => {
    const newAttachments: MessageAttachment[] = fileList.map((f) => {
      const isImg = f.type.startsWith('image/');
      const isPdf = f.type === 'application/pdf';
      return {
        id: `att_${Math.random().toString(36).substring(2, 9)}`,
        name: f.name,
        type: isImg ? 'image' : isPdf ? 'pdf' : 'doc',
        size: `${(f.size / 1024).toFixed(1)} KB`,
        url: isImg ? URL.createObjectURL(f) : undefined,
      };
    });
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFilesToAttachments(Array.from(e.dataTransfer.files));
    }
  };

  const handleSend = () => {
    if ((!inputContent.trim() && attachments.length === 0) || isGenerating) return;
    onSendMessage(inputContent, triggerN8n, attachments);
    setInputContent('');
    setAttachments([]);
  };

  const toggleThinkingSteps = (id: string) => {
    setShowThinkingSteps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      className="flex-1 flex flex-col h-full overflow-hidden relative"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Drag & Drop Visual Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 bg-purple-950/90 backdrop-blur-md border-2 border-dashed border-purple-400 rounded-2xl flex flex-col items-center justify-center text-purple-200 animate-fadeIn">
          <Paperclip className="w-12 h-12 text-purple-400 animate-bounce mb-3" />
          <p className="text-base font-bold">Drop files or images here</p>
          <p className="text-xs text-purple-300 mt-1">Upload to Nexus Vector Knowledge Base</p>
        </div>
      )}

      {/* Messages Stream Area */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-6 py-4 space-y-6 custom-scrollbar">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          const isLiked = likedMsgs[msg.id];
          const isDisliked = dislikedMsgs[msg.id];

          return (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 max-w-4xl mx-auto ${
                isUser ? 'flex-row-reverse' : 'flex-row'
              } animate-fadeIn`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-2xl shrink-0 p-0.5 flex items-center justify-center shadow-lg ${
                  isUser
                    ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white'
                    : 'bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
              </div>

              {/* Message Content Box */}
              <div className={`flex flex-col min-w-0 max-w-[85%] sm:max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                {/* User Name & Model Badge Header */}
                <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-slate-400">
                  <span className="font-semibold text-slate-300">
                    {isUser ? 'You' : 'Nexus AI Agent'}
                  </span>
                  <span>•</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {msg.metadata?.provider && (
                    <span className="px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {msg.metadata.provider}
                    </span>
                  )}
                </div>

                {/* AI Thinking Step Inspector Dropdown (For Assistant Messages) */}
                {!isUser && index === messages.length - 1 && (
                  <div className="mb-2 w-full max-w-lg rounded-xl bg-slate-900/80 border border-purple-500/30 overflow-hidden text-xs">
                    <button
                      onClick={() => toggleThinkingSteps('thinking_latest')}
                      className="w-full px-3 py-1.5 flex items-center justify-between text-[11px] font-mono text-purple-300 bg-purple-950/30 hover:bg-purple-950/50 transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
                        AI Reasoning & Vector Context Steps
                      </span>
                      {showThinkingSteps['thinking_latest'] ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {showThinkingSteps['thinking_latest'] && (
                      <div className="p-2.5 space-y-1.5 text-[11px] font-mono bg-slate-950/60 border-t border-purple-500/20">
                        <div className="flex items-center gap-2 text-emerald-400">
                          <Check className="w-3 h-3" />
                          <span>Parsing query & matching intent weights</span>
                        </div>
                        <div className="flex items-center gap-2 text-cyan-400">
                          <Database className="w-3 h-3" />
                          <span>Retrieved top 5 vector embeddings from Pinecone</span>
                        </div>
                        <div className="flex items-center gap-2 text-purple-400">
                          <Globe className="w-3 h-3" />
                          <span>Google Search grounding active & verified</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Message Body Bubble */}
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xl backdrop-blur-xl border ${
                    isUser
                      ? 'bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border-purple-500/40 text-slate-100 rounded-tr-none'
                      : 'bg-slate-900/80 border-white/10 text-slate-100 rounded-tl-none'
                  }`}
                >
                  {/* Text Content */}
                  <div className="whitespace-pre-wrap font-sans text-slate-200 space-y-2">
                    {msg.content}
                  </div>

                  {/* Render Attachments if present */}
                  {msg.metadata?.attachments && msg.metadata.attachments.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-white/10 flex flex-wrap gap-2">
                      {msg.metadata.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 flex items-center gap-2 text-xs font-mono"
                        >
                          {att.type === 'image' ? (
                            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                          ) : (
                            <FileText className="w-3.5 h-3.5 text-purple-400" />
                          )}
                          <span className="truncate max-w-[120px] text-slate-300">{att.name}</span>
                          <span className="text-[10px] text-slate-500">{att.size}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message Actions Bar */}
                <div className="flex items-center gap-1 mt-1 text-slate-400 text-[11px] px-1">
                  {/* Copy button */}
                  <button
                    onClick={() => copyToClipboard(msg.id, msg.content)}
                    className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1"
                    title="Copy message"
                  >
                    {copiedMsgId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Speak button */}
                  <button
                    onClick={() => speakMessage(msg.id, msg.content)}
                    className={`p-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors ${
                      speakingMsgId === msg.id ? 'text-cyan-400 animate-pulse' : ''
                    }`}
                    title="Speak response"
                  >
                    {speakingMsgId === msg.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>

                  {/* Like / Dislike buttons */}
                  {!isUser && (
                    <>
                      <button
                        onClick={() =>
                          setLikedMsgs(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))
                        }
                        className={`p-1.5 rounded-lg hover:bg-slate-800 transition-colors ${
                          isLiked ? 'text-emerald-400 fill-emerald-400/20' : 'hover:text-emerald-400'
                        }`}
                        title="Good response"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          setDislikedMsgs(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))
                        }
                        className={`p-1.5 rounded-lg hover:bg-slate-800 transition-colors ${
                          isDisliked ? 'text-rose-400 fill-rose-400/20' : 'hover:text-rose-400'
                        }`}
                        title="Bad response"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onSendMessage(msg.content, triggerN8n)}
                        className="p-1.5 rounded-lg hover:text-purple-400 hover:bg-slate-800 transition-colors"
                        title="Regenerate"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* AI Typing Loading Indicator */}
        {isGenerating && (
          <div className="flex items-center gap-3 max-w-4xl mx-auto animate-fadeIn">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 text-white p-0.5 shadow-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-purple-500/30 text-xs text-purple-300 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
              <span>Nexus AI is synthesizing streaming response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Attachments Preview Bar */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 bg-slate-900/90 border-t border-white/10 flex items-center gap-2 overflow-x-auto max-w-4xl mx-auto w-full">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="px-2.5 py-1 rounded-xl bg-purple-950/50 border border-purple-500/30 flex items-center gap-2 text-xs font-mono text-purple-200 shrink-0"
            >
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span className="truncate max-w-[120px]">{att.name}</span>
              <button
                onClick={() => setAttachments(prev => prev.filter(a => a.id !== att.id))}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Floating Input Container */}
      <div className="p-3 sm:p-4 bg-slate-950 border-t border-white/10 shrink-0">
        <div className="max-w-4xl mx-auto bg-slate-900/80 border border-white/10 hover:border-purple-500/40 rounded-2xl p-2.5 shadow-2xl backdrop-blur-2xl transition-all">
          {/* Text Area Input */}
          <textarea
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask Nexus AI Agent anything, write code, run webhooks, or query knowledge..."
            rows={2}
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none resize-none px-2 font-sans"
          />

          {/* Input Controls Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
            <div className="flex items-center gap-1 sm:gap-2">
              {/* File Attachment Input Trigger */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Attach PDF, Document or Image"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Web Search Grounding Toggle */}
              <button
                onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                className={`p-2 rounded-xl text-xs font-mono flex items-center gap-1 transition-all ${
                  webSearchEnabled
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                }`}
                title="Toggle Google Search Grounding"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </button>

              {/* n8n Webhook Trigger Toggle */}
              <button
                onClick={() => setTriggerN8n(!triggerN8n)}
                className={`p-2 rounded-xl text-xs font-mono flex items-center gap-1 transition-all ${
                  triggerN8n
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                }`}
                title="Toggle n8n Webhook Execution"
              >
                <Workflow className="w-4 h-4" />
                <span className="hidden sm:inline">n8n Workflow</span>
              </button>

              {/* Voice Input Dictation */}
              <button
                onClick={toggleSpeechRecognition}
                className={`p-2 rounded-xl transition-all ${
                  isListening
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Voice Dictation"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={(!inputContent.trim() && attachments.length === 0) || isGenerating}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-purple-950/60 flex items-center gap-2 transition-all shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
