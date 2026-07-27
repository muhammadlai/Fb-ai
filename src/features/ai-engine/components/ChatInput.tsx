import React, { useState, useRef } from 'react';
import { 
  Send, 
  Square, 
  Paperclip, 
  Mic, 
  MicOff, 
  Brain, 
  Workflow, 
  Sparkles, 
  X, 
  FileText, 
  Image as ImageIcon,
  BookOpen
} from 'lucide-react';
import { FileAttachment } from '../types/ai';

interface ChatInputProps {
  onSendMessage: (content: string, attachments?: FileAttachment[]) => void;
  onStopGeneration: () => void;
  isGenerating: boolean;
  isReasoningEnabled: boolean;
  onToggleReasoning: () => void;
  isAgentModeEnabled: boolean;
  onToggleAgentMode: () => void;
  onOpenTemplatesModal: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onStopGeneration,
  isGenerating,
  isReasoningEnabled,
  onToggleReasoning,
  isAgentModeEnabled,
  onToggleAgentMode,
  onOpenTemplatesModal,
}) => {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if ((!content.trim() && attachments.length === 0) || isGenerating) return;
    onSendMessage(content.trim(), attachments);
    setContent('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        const newAttachment: FileAttachment = {
          id: `att-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: file.type || 'text/plain',
          size: file.size,
          url: base64Url,
        };
        setAttachments((prev) => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Voice Input Speech Recognition
  const toggleVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser environment.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setContent(transcript);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  return (
    <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 backdrop-blur-xl sticky bottom-0 z-20">
      <div className="max-w-4xl mx-auto space-y-3">
        {/* Attachment Previews */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-200 border border-slate-700"
              >
                {att.type.startsWith('image/') ? (
                  <ImageIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                ) : (
                  <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                )}
                <span className="truncate max-w-[150px] font-mono">{att.name}</span>
                <button
                  onClick={() => removeAttachment(att.id)}
                  className="p-0.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 focus-within:border-cyan-500/60 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all p-3">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              isAgentModeEnabled
                ? 'Describe objective for Autonomous Agent mode...'
                : 'Ask Nexus AI OS or describe an architecture component...'
            }
            rows={1}
            className="w-full bg-transparent text-slate-100 text-sm placeholder-slate-500 resize-none outline-none pr-12 min-h-[40px] max-h-[180px] scrollbar-thin"
          />

          {/* Controls toolbar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 mt-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Upload File */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.txt,.js,.ts,.tsx,.json,.py"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                title="Attach files or vision images"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Voice Input */}
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`p-2 rounded-lg transition-colors ${
                  isRecording
                    ? 'bg-red-500/20 text-red-400 animate-pulse border border-red-500/40'
                    : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800'
                }`}
                title="Voice Dictation"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Reasoning Toggle */}
              <button
                type="button"
                onClick={onToggleReasoning}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isReasoningEnabled
                    ? 'bg-purple-900/50 text-purple-300 border border-purple-700/60 shadow-sm shadow-purple-500/20'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
                title="Reasoning Trace Panel"
              >
                <Brain className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">Reasoning</span>
              </button>

              {/* Agent Mode Toggle */}
              <button
                type="button"
                onClick={onToggleAgentMode}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isAgentModeEnabled
                    ? 'bg-cyan-900/50 text-cyan-300 border border-cyan-700/60 shadow-sm shadow-cyan-500/20'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
                title="Autonomous Agent Mode"
              >
                <Workflow className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Agent Mode</span>
              </button>

              {/* Prompt Templates Trigger */}
              <button
                type="button"
                onClick={onOpenTemplatesModal}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="Prompt Templates Library"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Templates</span>
              </button>
            </div>

            {/* Send / Stop button */}
            {isGenerating ? (
              <button
                type="button"
                onClick={onStopGeneration}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-red-600/30"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!content.trim() && attachments.length === 0}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
