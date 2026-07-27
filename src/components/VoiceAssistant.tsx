// VoiceAssistant.tsx - Standalone Voice Assistant Component with 3D Canvas Avatar

import React from 'react';
import { motion } from 'motion/react';
import { Mic, MicOff, Volume2, VolumeX, Square, UserCheck, Bot } from 'lucide-react';
import { useAssistantStore } from '../store/useAssistantStore';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { ThreeDAvatarCanvas } from './ThreeDAvatarCanvas';

export const VoiceAssistant: React.FC = () => {
  const { emotion, thinkingStage, avatarAnimation, isOwnerMode, lastResponseText } =
    useAssistantStore();

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

  return (
    <div className="p-6 rounded-3xl bg-slate-950/90 border border-cyan-500/40 shadow-2xl space-y-4 font-sans backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-cyan-950 border border-cyan-500/50 text-cyan-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 font-mono">
              3D AI Voice Assistant Core
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Web Speech API • Real-time STT & Speech Synthesis • Vector Memory
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Sir Aitzaz Mode</span>
        </div>
      </div>

      {/* Mic Permission Banner */}
      {micPermissionError && (
        <div className="p-3 rounded-2xl bg-red-950/80 border border-red-500/40 text-xs font-mono text-red-200">
          {micPermissionError}
        </div>
      )}

      {/* 3D Avatar Canvas */}
      <div className="flex flex-col items-center justify-center space-y-3 py-2">
        <ThreeDAvatarCanvas
          emotion={emotion}
          avatarAnimation={avatarAnimation}
          mouthVolume={mouthVolume}
          isListening={isListening}
          isSpeaking={isSpeaking}
        />

        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/30">
          Stage: {thinkingStage.replace('_', ' ')}
        </span>

        {/* Live Transcript / Reply Text */}
        <div className="w-full text-center px-4">
          {transcript ? (
            <p className="text-xs font-mono text-amber-300 bg-amber-950/30 border border-amber-500/30 p-3 rounded-2xl">
              "{transcript}"
            </p>
          ) : (
            <p className="text-xs font-sans text-slate-300 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
              "{lastResponseText}"
            </p>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 pt-2">
        {isListening ? (
          <button
            onClick={stopListening}
            className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <Square className="w-4 h-4 fill-current" /> Stop Listening
          </button>
        ) : (
          <button
            onClick={startListening}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <Mic className="w-4 h-4" /> Start Voice Conversation
          </button>
        )}

        {isSpeaking ? (
          <button
            onClick={stopSpeaking}
            className="p-3 rounded-2xl bg-red-600/30 border border-red-500/40 text-red-300 hover:bg-red-600/50 cursor-pointer"
            title="Stop Speech Output"
          >
            <VolumeX className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => speak(lastResponseText)}
            className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 cursor-pointer"
            title="Replay Voice Response"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
