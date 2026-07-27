import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, Mic, Radio, Globe, Sliders, Zap, Check } from 'lucide-react';
import { useAssistantStore } from '../../store/useAssistantStore';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({ isOpen, onClose }) => {
  const { voiceConfig, updateVoiceConfig } = useAssistantStore();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-slate-900 border border-purple-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-5 backdrop-blur-2xl font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100 font-mono">
                  Voice & Speech Synthesis Settings
                </h3>
                <p className="text-[11px] text-slate-400">
                  Configure natural speech synthesis parameters
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Voice Gender Selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase text-slate-300 block">
              Assistant Voice Identity
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateVoiceConfig({ gender: 'female' })}
                className={`p-3 rounded-2xl border text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  voiceConfig.gender === 'female'
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Volume2 className="w-4 h-4" /> Female (Natural Neural)
              </button>

              <button
                onClick={() => updateVoiceConfig({ gender: 'male' })}
                className={`p-3 rounded-2xl border text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  voiceConfig.gender === 'male'
                    ? 'bg-purple-950 border-purple-500 text-purple-300 shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Volume2 className="w-4 h-4" /> Male (Executive Accent)
              </button>
            </div>
          </div>

          {/* Speed Rate Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold">Speech Rate / Speed</span>
              <span className="text-cyan-400 font-bold">{voiceConfig.rate}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.5"
              step="0.1"
              value={voiceConfig.rate}
              onChange={(e) => updateVoiceConfig({ rate: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Pitch Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold">Voice Pitch / Resonance</span>
              <span className="text-purple-400 font-bold">{voiceConfig.pitch}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.2"
              step="0.1"
              value={voiceConfig.pitch}
              onChange={(e) => updateVoiceConfig({ pitch: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* Wake Word Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-slate-200 block">
                Wake Word ("Hello Nexus")
              </span>
              <span className="text-[10px] text-slate-400">
                Trigger audio speech immediately upon wake phrase
              </span>
            </div>

            <button
              onClick={() => updateVoiceConfig({ wakeWordEnabled: !voiceConfig.wakeWordEnabled })}
              className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                voiceConfig.wakeWordEnabled ? 'bg-cyan-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  voiceConfig.wakeWordEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Continuous Hands-free Mode Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-slate-200 block">
                Continuous Conversation Mode
              </span>
              <span className="text-[10px] text-slate-400">
                Auto-reopens mic loop without pressing button
              </span>
            </div>

            <button
              onClick={() =>
                updateVoiceConfig({ continuousListening: !voiceConfig.continuousListening })
              }
              className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                voiceConfig.continuousListening ? 'bg-purple-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  voiceConfig.continuousListening ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <Check className="w-4 h-4" /> Save Voice Preferences
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
