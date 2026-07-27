// FloatingAIAssistant.tsx - Live Floating Voice Assistant Widget

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Bot,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  X,
  Minimize2,
  Maximize2,
  UserCheck,
  Settings,
  Brain,
  Square,
  Smile,
  Frown,
  Flame,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';
import { useAssistantStore } from '../../store/useAssistantStore';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import { ThreeDAvatarCanvas } from '../ThreeDAvatarCanvas';
import { VoiceSettingsModal } from './VoiceSettingsModal';

export const FloatingAIAssistant: React.FC = () => {
  const {
    isWidgetOpen,
    toggleWidget,
    emotion,
    thinkingStage,
    avatarAnimation,
    isOwnerMode,
    lastResponseText,
  } = useAssistantStore();

  const {
    isListening,
    isSpeaking,
    mouthVolume,
    transcript,
    micPermissionError,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  } = useVoiceAssistant();

  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Color mappings
  const getEmotionColors = () => {
    switch (emotion) {
      case 'happy':
        return { border: 'border-amber-400/60', glow: 'shadow-amber-500/30', ring: 'border-amber-400' };
      case 'sad':
        return { border: 'border-blue-500/40', glow: 'shadow-blue-500/20', ring: 'border-blue-400' };
      case 'angry':
        return { border: 'border-rose-500/60', glow: 'shadow-rose-500/30', ring: 'border-rose-400' };
      case 'excited':
        return { border: 'border-purple-400/60', glow: 'shadow-purple-500/40', ring: 'border-purple-400' };
      case 'confused':
        return { border: 'border-violet-500/40', glow: 'shadow-violet-500/20', ring: 'border-violet-400' };
      default:
        return { border: 'border-cyan-500/50', glow: 'shadow-cyan-500/30', ring: 'border-cyan-400' };
    }
  };

  const emotionStyle = getEmotionColors();

  if (!isWidgetOpen) {
    return (
      <motion.button
        onClick={toggleWidget}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.08 }}
        className="fixed bottom-6 right-6 z-50 p-3.5 rounded-2xl bg-slate-900/95 border border-cyan-500/60 shadow-[0_0_25px_rgba(6,182,212,0.4)] text-cyan-300 backdrop-blur-2xl cursor-pointer flex items-center gap-2 font-mono text-xs font-bold"
      >
        <div className="relative">
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <span>Nexus AI Assistant</span>
      </motion.button>
    );
  }

  return (
    <>
      <VoiceSettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 font-sans ${
          isMinimized ? 'w-80' : 'w-96'
        }`}
      >
        <div
          className={`bg-slate-950/95 border ${emotionStyle.border} rounded-3xl p-5 shadow-2xl backdrop-blur-2xl relative overflow-hidden space-y-4`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 relative z-10">
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2 rounded-xl bg-slate-900 border ${emotionStyle.border} ${emotionStyle.glow} shadow-md`}
              >
                <Bot className="w-4 h-4 text-cyan-300" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-100 flex items-center gap-1.5 font-mono">
                  Nexus AI Voice Assistant
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-[9px] text-emerald-400 uppercase">
                    Live
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-cyan-400" />
                  System Owner: <span className="text-cyan-300 font-bold">Sir Aitzaz</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings(true)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Voice Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={toggleWidget}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Permission Error Banner */}
              {micPermissionError && (
                <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/40 text-[11px] font-mono text-red-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{micPermissionError}</span>
                </div>
              )}

              {/* 3D Animated Avatar Canvas with Real-time Lip Sync */}
              <div className="py-2 flex flex-col items-center justify-center space-y-2 relative z-10">
                <ThreeDAvatarCanvas
                  emotion={emotion}
                  avatarAnimation={avatarAnimation}
                  mouthVolume={mouthVolume}
                  isListening={isListening}
                  isSpeaking={isSpeaking}
                />

                {/* Thinking Stage Banner */}
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/30 inline-block shadow-md">
                  {thinkingStage === 'thinking'
                    ? 'Thinking...'
                    : thinkingStage === 'searching_memory'
                    ? 'Searching Vector Memory...'
                    : thinkingStage === 'planning'
                    ? 'Planning Execution...'
                    : thinkingStage === 'executing'
                    ? 'Executing Command...'
                    : thinkingStage === 'listening'
                    ? 'Listening to Speech...'
                    : thinkingStage === 'talking'
                    ? 'Synthesizing Speech...'
                    : 'Awaiting Command'}
                </span>

                {/* Live Speech Transcript / AI Response Bubble */}
                <div className="w-full text-center px-2 pt-1">
                  {transcript ? (
                    <p className="text-xs text-amber-300 font-mono bg-amber-950/30 border border-amber-500/30 rounded-xl p-2.5">
                      "{transcript}"
                    </p>
                  ) : (
                    <p className="text-xs text-slate-300 font-sans leading-relaxed bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 max-h-24 overflow-y-auto">
                      "{lastResponseText}"
                    </p>
                  )}
                </div>
              </div>

              {/* Floating Action Controls */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800 relative z-10">
                {isListening ? (
                  <button
                    onClick={stopListening}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" /> Stop Listening
                  </button>
                ) : (
                  <button
                    onClick={startListening}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
                  >
                    <Mic className="w-3.5 h-3.5 animate-pulse" /> Speak Command
                  </button>
                )}

                {isSpeaking ? (
                  <button
                    onClick={stopSpeaking}
                    className="p-2.5 rounded-xl bg-red-600/30 border border-red-500/40 text-red-300 hover:bg-red-600/50 cursor-pointer"
                    title="Mute Audio Speech"
                  >
                    <VolumeX className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => speak(lastResponseText)}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 cursor-pointer"
                    title="Replay Audio Response"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
};
