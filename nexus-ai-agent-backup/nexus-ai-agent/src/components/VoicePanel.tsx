import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Square,
  Sparkles,
  Radio,
  Sliders,
  Activity
} from 'lucide-react';

export const VoicePanel: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('Nexus Neural Alpha (Female)');
  const [transcript, setTranscript] = useState('Hello Nexus AI Agent! I would like you to analyze our latest infrastructure metrics and execute the n8n automation pipeline.');

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const togglePlayback = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser tab.');
      return;
    }
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(transcript);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-6 p-1 custom-scrollbar animate-fadeIn">
      {/* Title Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-cyan-950/60 border border-purple-500/30 backdrop-blur-xl shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Mic className="w-6 h-6 text-purple-400 animate-pulse" />
            Nexus Neural Voice Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time speech-to-text dictation, multi-voice neural audio synthesis, and live wave visualizer.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voice Dictation & Wave Visualizer */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-6 flex flex-col items-center justify-center text-center">
          {/* Animated Waveform Visualizer */}
          <div className="w-full h-32 bg-slate-950 rounded-2xl border border-purple-500/30 p-4 flex items-center justify-center gap-1.5 overflow-hidden">
            {[30, 45, 80, 60, 95, 40, 100, 75, 50, 90, 65, 85, 40, 70, 90, 55, 35, 80, 60, 40].map((h, i) => (
              <div
                key={i}
                className={`w-2 rounded-full bg-gradient-to-t from-purple-600 via-indigo-500 to-cyan-400 transition-all duration-300 ${
                  isRecording || isPlaying ? 'animate-pulse' : 'opacity-40'
                }`}
                style={{ height: isRecording || isPlaying ? `${h}%` : '20%' }}
              />
            ))}
          </div>

          {/* Record Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleRecording}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 ${
                isRecording
                  ? 'bg-rose-600 text-white ring-4 ring-rose-500/40 animate-pulse'
                  : 'bg-gradient-to-tr from-purple-600 to-cyan-400 text-white'
              }`}
            >
              {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>

            <button
              onClick={togglePlayback}
              className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-white/10 flex items-center justify-center transition-all"
              title="Test Speech Playback"
            >
              {isPlaying ? <Square className="w-5 h-5 fill-cyan-400" /> : <Play className="w-5 h-5 fill-cyan-400" />}
            </button>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            {isRecording ? 'Listening live to audio input...' : 'Click mic button to start voice dictation'}
          </div>
        </div>

        {/* Voice Parameters & Transcript */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
          <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" /> Speech Model Settings
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Neural TTS Voice Model</label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl p-2.5 border border-white/10 focus:outline-none"
            >
              <option value="Nexus Neural Alpha (Female)">Nexus Neural Alpha (Female)</option>
              <option value="Nexus Quantum Studio (Male)">Nexus Quantum Studio (Male)</option>
              <option value="Gemini Multilingual Audio">Gemini Multilingual Audio</option>
              <option value="ElevenLabs Natural Neural">ElevenLabs Natural Neural</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Live Voice Transcript</label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={5}
              className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl p-3 border border-white/10 focus:outline-none font-sans resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
