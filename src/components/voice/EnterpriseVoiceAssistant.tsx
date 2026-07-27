import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  X,
  Zap,
  Globe,
  Radio,
  Play,
  Square,
  Cpu,
  UserCheck,
} from 'lucide-react';
import { useChatStore } from '../../features/ai-engine/store/useChatStore';
import { useToastStore } from '../../store/useToastStore';

interface EnterpriseVoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnterpriseVoiceAssistant: React.FC<EnterpriseVoiceAssistantProps> = ({
  isOpen,
  onClose,
}) => {
  const { sendMessage, isGenerating, setSelectedModelId, selectedModelId } = useChatStore();
  const toast = useToastStore();

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [language, setLanguage] = useState<'en' | 'ur' | 'bilingual'>('bilingual');
  const [wakeWordEnabled, setWakeWordEnabled] = useState(true);
  const [ownerVerified, setOwnerVerified] = useState(true); // Sir Aitzaz

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const speakText = (text: string) => {
    if (!synthRef.current) return;

    // Intercept previous speech
    synthRef.current.cancel();

    // Clean markdown symbols for natural TTS speech
    const cleanText = text
      .replace(/[*#`_~]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/```[\s\S]*?```/g, 'Code snippet output generated.');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    if (language === 'ur') {
      utterance.lang = 'ur-PK';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice Error', 'Speech recognition is not supported in this browser environment.');
      return;
    }

    stopSpeaking();

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language === 'ur' ? 'ur-PK' : 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      const current = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setTranscript(current);
    };

    recognition.onerror = (err: any) => {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleProcessVoiceCommand = async (textToSend?: string) => {
    const query = textToSend || transcript;
    if (!query.trim()) return;

    // Check for owner identification phrase
    const lower = query.toLowerCase();
    let responseText = '';

    if (
      lower.includes('i am aitzaz') ||
      lower.includes('main aitzaz hoon') ||
      lower.includes('mera naam aitzaz hai') ||
      lower.includes('aitzaz hoon')
    ) {
      setOwnerVerified(true);
      responseText = 'Welcome back Sir Aitzaz. How may I assist you today?';
      setLastResponse(responseText);
      speakText(responseText);
      toast.cyber('Owner Recognized', 'Welcome back Sir Aitzaz!');
      return;
    }

    // Process via Chat Engine
    toast.cyber('Voice Command Dispatched', `"${query}"`);
    await sendMessage(query);

    // Default response feedback
    const aiOutput = `Processed voice request for Sir Aitzaz: "${query}". Executing autonomous AI pipeline.`;
    setLastResponse(aiOutput);
    speakText(aiOutput);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-2xl"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    Nexus Voice AI Assistant
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-bold uppercase">
                      Streaming Speech
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Owner: <span className="text-emerald-400 font-bold">Sir Aitzaz</span>
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

            {/* Voice Audio Wave Visualizer Area */}
            <div className="py-8 flex flex-col items-center justify-center space-y-6 relative z-10">
              {/* Outer Pulsing Orbit */}
              <div className="relative">
                <div
                  className={`w-32 h-32 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isListening
                      ? 'border-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.4)] scale-105'
                      : isSpeaking
                      ? 'border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.4)] scale-105'
                      : 'border-slate-800 shadow-lg'
                  }`}
                >
                  {/* Waveform Bar Graphic */}
                  <div className="flex items-center gap-1.5 h-12">
                    {[0.4, 0.8, 1.2, 0.6, 1.0, 0.5, 0.9, 0.7].map((heightFactor, idx) => (
                      <motion.div
                        key={idx}
                        animate={{
                          height: isListening || isSpeaking
                            ? [`${15 * heightFactor}px`, `${45 * heightFactor}px`, `${15 * heightFactor}px`]
                            : '8px',
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.6,
                          delay: idx * 0.08,
                        }}
                        className={`w-1.5 rounded-full ${
                          isListening
                            ? 'bg-amber-400'
                            : isSpeaking
                            ? 'bg-cyan-400'
                            : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-300 shadow-md">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isListening
                        ? 'bg-amber-400 animate-ping'
                        : isSpeaking
                        ? 'bg-cyan-400 animate-bounce'
                        : 'bg-emerald-400'
                    }`}
                  />
                  {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready'}
                </div>
              </div>

              {/* Live Transcript Display */}
              <div className="w-full text-center space-y-2 px-4">
                {transcript ? (
                  <p className="text-sm font-medium text-amber-300 bg-amber-950/30 border border-amber-500/30 rounded-2xl p-3 font-mono">
                    "{transcript}"
                  </p>
                ) : lastResponse ? (
                  <p className="text-xs text-cyan-200 bg-slate-950 border border-slate-800 rounded-2xl p-3 font-sans leading-relaxed">
                    "{lastResponse}"
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 font-mono">
                    Say <span className="text-cyan-300 font-bold">"Main Aitzaz hoon"</span> or speak your command in English/Urdu.
                  </p>
                )}
              </div>
            </div>

            {/* Language & Settings Bar */}
            <div className="grid grid-cols-3 gap-2 pb-4 relative z-10 border-t border-b border-slate-800 py-3">
              <button
                onClick={() => setLanguage('en')}
                className={`p-2 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  language === 'en'
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                English
              </button>

              <button
                onClick={() => setLanguage('ur')}
                className={`p-2 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  language === 'ur'
                    ? 'bg-purple-950 border-purple-500 text-purple-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                Urdu (اردو)
              </button>

              <button
                onClick={() => setLanguage('bilingual')}
                className={`p-2 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  language === 'bilingual'
                    ? 'bg-amber-950 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                Bilingual
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 relative z-10">
              {isListening ? (
                <button
                  onClick={stopListening}
                  className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <Square className="w-4 h-4 fill-current" />
                  Stop Listening
                </button>
              ) : (
                <button
                  onClick={startListening}
                  className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <Mic className="w-4 h-4" />
                  Start Listening
                </button>
              )}

              {isSpeaking ? (
                <button
                  onClick={stopSpeaking}
                  className="p-3 rounded-2xl bg-red-600/30 border border-red-500/50 text-red-300 hover:bg-red-600/50 cursor-pointer"
                  title="Interrupted Audio"
                >
                  <VolumeX className="w-5 h-5" />
                </button>
              ) : transcript ? (
                <button
                  onClick={() => handleProcessVoiceCommand()}
                  className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-lg shadow-emerald-600/20"
                  title="Process Command"
                >
                  <Play className="w-5 h-5 fill-current" />
                </button>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
