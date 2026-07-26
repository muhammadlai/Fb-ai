import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  Settings,
  X,
  ChevronUp,
  Sparkles,
  Play,
  Square,
  Globe,
  Sliders,
  Send,
  Zap
} from 'lucide-react';

interface FloatingVoiceAssistantProps {
  onSendSpokenMessage?: (text: string) => void;
  isGenerating?: boolean;
}

export const FloatingVoiceAssistant: React.FC<FloatingVoiceAssistantProps> = ({
  onSendSpokenMessage,
  isGenerating = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [wakeWordEnabled, setWakeWordEnabled] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState<'female' | 'male'>('female');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [transcript, setTranscript] = useState('');
  const [speechRate, setSpeechRate] = useState(1.0);
  const [speechPitch, setSpeechPitch] = useState(1.0);
  const [showSettings, setShowSettings] = useState(false);

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = selectedLanguage;

      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        // Check for wake word if enabled
        if (wakeWordEnabled && currentTranscript.toLowerCase().includes('hey nexus')) {
          console.log('Wake word "Hey Nexus" detected!');
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          try {
            recognitionRef.current.start();
          } catch {
            setIsListening(false);
          }
        }
      };
    }
  }, [selectedLanguage, wakeWordEnabled]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser tab.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Speech recognition start error:', err);
      }
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = speechRate;
    utterance.pitch = selectedVoice === 'female' ? 1.2 : 0.8;
    utterance.lang = selectedLanguage;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const matchedVoice = voices.find(
        (v) =>
          v.lang.includes(selectedLanguage) &&
          (selectedVoice === 'female'
            ? v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha')
            : v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('alex'))
      );
      if (matchedVoice) utterance.voice = matchedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSendTranscript = () => {
    if (!transcript.trim()) return;
    if (onSendSpokenMessage) {
      onSendSpokenMessage(transcript);
    }
    setTranscript('');
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-80 sm:w-96 mb-4 rounded-3xl bg-slate-900/95 border border-purple-500/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(168,85,247,0.3)] p-5 text-slate-100 flex flex-col gap-4 relative overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-600/30 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-purple-950/60">
                  <Radio className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    Nexus Voice Neural Core
                    <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-mono border border-cyan-500/30">
                      LIVE
                    </span>
                  </h3>
                  <p className="text-[10px] text-purple-300 font-mono">
                    Wake Word: {wakeWordEnabled ? '"Hey Nexus"' : 'Disabled'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Voice Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Voice Settings Panel Overlay */}
            {showSettings ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3 bg-slate-950/80 p-3 rounded-2xl border border-white/10 text-xs font-mono relative z-10"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Voice Persona</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setSelectedVoice('female')}
                      className={`px-2.5 py-1 rounded-lg ${
                        selectedVoice === 'female' ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      Female
                    </button>
                    <button
                      onClick={() => setSelectedVoice('male')}
                      className={`px-2.5 py-1 rounded-lg ${
                        selectedVoice === 'male' ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      Male
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Language</span>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="bg-slate-900 text-slate-200 text-xs rounded-lg px-2 py-1 border border-white/10"
                  >
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Spanish (ES)</option>
                    <option value="fr-FR">French (FR)</option>
                    <option value="de-DE">German (DE)</option>
                    <option value="ja-JP">Japanese (JP)</option>
                    <option value="zh-CN">Chinese (CN)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Wake Word Listener</span>
                  <button
                    onClick={() => setWakeWordEnabled(!wakeWordEnabled)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      wakeWordEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {wakeWordEnabled ? 'ACTIVE' : 'OFF'}
                  </button>
                </div>
              </motion.div>
            ) : null}

            {/* Audio Spectrum Waveform Visualizer */}
            <div className="h-20 bg-slate-950/80 rounded-2xl border border-purple-500/30 p-3 flex items-center justify-center gap-1.5 relative overflow-hidden">
              {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 65, 85, 40, 75, 90, 60, 35, 80, 50, 30].map(
                (h, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: isListening || isSpeaking ? [`${h * 0.2}%`, `${h}%`, `${h * 0.3}%`] : '15%',
                    }}
                    transition={{
                      repeat: Infinity,
                      repeatType: 'reverse',
                      duration: 0.4 + (i % 5) * 0.1,
                    }}
                    className={`w-1.5 rounded-full ${
                      isListening
                        ? 'bg-gradient-to-t from-cyan-500 via-indigo-500 to-purple-400'
                        : isSpeaking
                        ? 'bg-gradient-to-t from-emerald-500 via-teal-400 to-cyan-300'
                        : 'bg-slate-700/50'
                    }`}
                  />
                )
              )}

              {/* Status Badge inside wave */}
              <div className="absolute top-2 left-3 text-[10px] font-mono text-purple-300 flex items-center gap-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isListening ? 'bg-cyan-400 animate-ping' : isSpeaking ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                  }`}
                />
                {isListening ? 'Listening...' : isSpeaking ? 'Synthesizing Audio...' : 'Voice Ready'}
              </div>
            </div>

            {/* Live Transcript Display Box */}
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/10 text-xs min-h-[60px] max-h-28 overflow-y-auto font-mono text-slate-200">
              {transcript ? (
                <p>{transcript}</p>
              ) : (
                <p className="text-slate-500 italic">Say "Hey Nexus" or click push-to-talk to speak...</p>
              )}
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-1">
              {/* Push To Talk Main Button */}
              <button
                onClick={toggleListening}
                className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isListening
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/60 animate-pulse'
                    : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-purple-950/60'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isListening ? 'Stop Listening' : 'Push to Talk'}</span>
              </button>

              {/* Stop Speaking Button if AI TTS is playing */}
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="ml-2 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 border border-rose-500/30 transition-colors"
                  title="Stop AI Speech"
                >
                  <VolumeX className="w-4 h-4" />
                </button>
              )}

              {/* Submit Spoken Text to Agent */}
              {transcript.trim() && (
                <button
                  onClick={handleSendTranscript}
                  className="ml-2 p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-950/60 transition-colors"
                  title="Send to AI Agent"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="relative group p-4 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 text-white shadow-[0_0_30px_rgba(168,85,247,0.5)] border border-purple-300/30 flex items-center gap-2.5"
        >
          <div className="relative">
            <Radio className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-ping" />
          </div>
          <span className="text-xs font-bold tracking-wide hidden sm:inline">Voice Assistant</span>
        </motion.button>
      )}
    </div>
  );
};
