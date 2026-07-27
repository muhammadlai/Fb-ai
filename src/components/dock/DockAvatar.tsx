import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Sparkles, Mic, Brain, Zap, Send, Volume2, X } from 'lucide-react';
import { useDockStore, AvatarState } from '../../store/useDockStore';

export const DockAvatar: React.FC = () => {
  const { avatarState, avatarMessage, setAvatarState, addNotification } = useDockStore();
  const [isOpen, setIsOpen] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');

  const getStateDetails = (state: AvatarState) => {
    switch (state) {
      case 'listening':
        return {
          label: 'LISTENING',
          color: 'from-amber-400 to-rose-500',
          ringColor: 'border-amber-400 shadow-amber-500/50',
          icon: <Mic className="w-4 h-4 text-amber-300 animate-pulse" />,
          bgPulse: 'bg-amber-500/20',
        };
      case 'thinking':
        return {
          label: 'THINKING',
          color: 'from-purple-500 to-indigo-600',
          ringColor: 'border-purple-400 shadow-purple-500/50',
          icon: <Brain className="w-4 h-4 text-purple-300 animate-spin" />,
          bgPulse: 'bg-purple-500/20',
        };
      case 'speaking':
        return {
          label: 'SPEAKING',
          color: 'from-cyan-400 to-blue-600',
          ringColor: 'border-cyan-400 shadow-cyan-500/50',
          icon: <Volume2 className="w-4 h-4 text-cyan-300 animate-bounce" />,
          bgPulse: 'bg-cyan-500/20',
        };
      case 'executing':
        return {
          label: 'EXECUTING',
          color: 'from-emerald-400 to-teal-600',
          ringColor: 'border-emerald-400 shadow-emerald-500/50',
          icon: <Zap className="w-4 h-4 text-emerald-300 animate-ping" />,
          bgPulse: 'bg-emerald-500/20',
        };
      default:
        return {
          label: 'IDLE',
          color: 'from-cyan-500 via-purple-500 to-indigo-500',
          ringColor: 'border-cyan-500/50 shadow-cyan-500/30',
          icon: <Bot className="w-4 h-4 text-cyan-300" />,
          bgPulse: 'bg-cyan-500/10',
        };
    }
  };

  const details = getStateDetails(avatarState);

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPrompt.trim()) return;

    const query = userPrompt;
    setUserPrompt('');

    setAvatarState('thinking', `Processing query: "${query}"`);
    addNotification({
      title: 'AI Command Sent',
      message: `Prompt: "${query}"`,
      type: 'ai_suggestion',
    });

    setTimeout(() => {
      setAvatarState('executing', `Executing action for: "${query}"`);
    }, 1500);

    setTimeout(() => {
      setAvatarState('speaking', `Completed: Processed request for "${query}".`);
    }, 3200);

    setTimeout(() => {
      setAvatarState('idle', 'Nexus AI Ready. How can I assist your workflow today?');
    }, 5500);
  };

  return (
    <div className="relative">
      {/* Dock Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer shadow-lg"
        title="Nexus Autonomous AI Avatar"
      >
        <div className="relative">
          {/* Animated Glow Ring */}
          <div
            className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${details.color} p-[2px] shadow-lg transition-all duration-300`}
          >
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
              {details.icon}
              {/* Subtle background pulse */}
              <div className={`absolute inset-0 ${details.bgPulse} opacity-60 animate-pulse`} />
            </div>
          </div>

          {/* Status Dot */}
          <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
            <span
              className={`w-2 h-2 rounded-full ${
                avatarState === 'idle'
                  ? 'bg-cyan-400'
                  : avatarState === 'listening'
                  ? 'bg-amber-400 animate-ping'
                  : avatarState === 'thinking'
                  ? 'bg-purple-400 animate-pulse'
                  : avatarState === 'speaking'
                  ? 'bg-cyan-300 animate-bounce'
                  : 'bg-emerald-400 animate-ping'
              }`}
            />
          </span>
        </div>

        <div className="hidden lg:block text-left pr-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-100">
            <span>Nexus Avatar</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 uppercase">
              {details.label}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 truncate max-w-[110px] font-mono">
            {avatarMessage}
          </p>
        </div>
      </button>

      {/* Floating AI Avatar Interaction Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-14 left-0 w-80 md:w-96 bg-slate-900/95 border border-cyan-500/40 rounded-2xl shadow-2xl p-4 space-y-4 z-50 backdrop-blur-xl font-mono"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl bg-gradient-to-tr ${details.color} text-slate-950 font-bold`}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                    Nexus Autonomous Avatar
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 font-mono font-bold uppercase">
                      Gemini 2.5 Pro
                    </span>
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    State: <span className="text-cyan-300 font-bold uppercase">{avatarState}</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live State Card */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  {details.icon} Avatar Status Response
                </span>
                <span className="text-emerald-400 font-bold">Live Stream Ready</span>
              </div>
              <p className="text-xs font-sans text-slate-200 leading-relaxed font-normal">
                {avatarMessage}
              </p>
            </div>

            {/* Quick State Simulation Buttons */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">
                Test Avatar State Matrix
              </span>
              <div className="grid grid-cols-5 gap-1.5 text-[10px]">
                <button
                  onClick={() => setAvatarState('idle', 'Standing by for instructions.')}
                  className={`p-1.5 rounded-lg border text-center font-bold cursor-pointer transition-all ${
                    avatarState === 'idle'
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Idle
                </button>
                <button
                  onClick={() => setAvatarState('listening', 'Listening to acoustic channel...')}
                  className={`p-1.5 rounded-lg border text-center font-bold cursor-pointer transition-all ${
                    avatarState === 'listening'
                      ? 'bg-amber-950 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Listen
                </button>
                <button
                  onClick={() => setAvatarState('thinking', 'Synthesizing knowledge graph...')}
                  className={`p-1.5 rounded-lg border text-center font-bold cursor-pointer transition-all ${
                    avatarState === 'thinking'
                      ? 'bg-purple-950 border-purple-500 text-purple-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Think
                </button>
                <button
                  onClick={() => setAvatarState('speaking', 'Audible text-to-speech output...')}
                  className={`p-1.5 rounded-lg border text-center font-bold cursor-pointer transition-all ${
                    avatarState === 'speaking'
                      ? 'bg-blue-950 border-blue-500 text-blue-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Speak
                </button>
                <button
                  onClick={() => setAvatarState('executing', 'Running Playwright browser agent...')}
                  className={`p-1.5 rounded-lg border text-center font-bold cursor-pointer transition-all ${
                    avatarState === 'executing'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Exec
                </button>
              </div>
            </div>

            {/* Quick Prompt Input */}
            <form onSubmit={handlePromptSubmit} className="relative">
              <input
                type="text"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Ask Nexus Avatar to run an agent or task..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-9 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 p-1 text-cyan-400 hover:text-cyan-300 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
