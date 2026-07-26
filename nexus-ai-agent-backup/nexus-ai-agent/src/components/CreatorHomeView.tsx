import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Smartphone,
  Bot,
  Sparkles,
  Image as ImageIcon,
  Video,
  Layers,
  Workflow,
  BarChart3,
  Mic,
  MicOff,
  Radio,
  Volume2,
  VolumeX,
  Sparkle,
  Zap,
  ArrowRight,
  Flame,
  Wand2,
  Cpu,
  UserCheck,
  CheckCircle2,
  Play,
  RotateCcw,
  Sliders,
  X,
  Compass,
  Code2,
  Database
} from 'lucide-react';
import { ActiveView } from '../types';
import { ThreeDAvatarCanvas, AvatarType, AvatarState } from './ThreeDAvatarCanvas';
import { AvatarVoiceEngine } from '../utils/avatarVoiceEngine';

interface CreatorHomeViewProps {
  onSelectOption: (view: ActiveView, initialPrompt?: string) => void;
  onOpenVoice: () => void;
}

export const CreatorHomeView: React.FC<CreatorHomeViewProps> = ({
  onSelectOption,
  onOpenVoice,
}) => {
  // Avatar Configuration & State
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarType>('professional_female');
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [speechVolume, setSpeechVolume] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasGreeted, setHasGreeted] = useState(false);

  // Guided Step-by-Step Creator Modal State
  const [selectedCardStep, setSelectedCardStep] = useState<any | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>(['React 19', 'Tailwind CSS v4', 'TypeScript']);
  const [guidedPromptInput, setGuidedPromptInput] = useState('');

  // Speech Recognition for Push-To-Talk
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const voiceEngine = AvatarVoiceEngine.getInstance();

  // Attach Voice Engine state listener to update mouth lip sync
  useEffect(() => {
    voiceEngine.onStateChange = (speaking, vol) => {
      setSpeechVolume(vol);
      if (speaking) {
        setAvatarState('speaking');
      } else if (avatarState === 'speaking') {
        setAvatarState('idle');
      }
    };
  }, [avatarState]);

  // Initial Automatic Greeting when Component Mounts
  const triggerGreeting = () => {
    setHasGreeted(true);
    setAvatarState('speaking');
    const greetingText =
      "Hello! Welcome to Nexus AI. I'm your personal AI Creator. What would you like to create today?";

    if (voiceEnabled) {
      voiceEngine.speak(greetingText, selectedAvatar, () => {
        setAvatarState('idle');
      });
    }
  };

  useEffect(() => {
    // Attempt automatic greeting trigger
    const timer = setTimeout(() => {
      triggerGreeting();
    }, 600);
    return () => {
      clearTimeout(timer);
      voiceEngine.stop();
    };
  }, [selectedAvatar]);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setSearchQuery(transcript);
      };

      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser tab.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setSearchQuery('');
      setAvatarState('listening');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Creator Cards Array
  const creatorCards = [
    {
      id: 'website',
      title: 'Build Website',
      description: 'Generate production-ready React, Next.js, & Tailwind websites with modern animations.',
      icon: Globe,
      view: 'chat' as ActiveView,
      badge: 'POPULAR',
      gradient: 'from-purple-600 via-indigo-600 to-cyan-500',
      speechGuide: 'Awesome! Let\'s build a high-performance modern React website. I\'ll guide you through the layout, components, and animations.',
      defaultPrompt: 'Build a full-stack modern React SaaS landing page with dark theme glassmorphism, pricing tables, and Framer Motion animations.',
      stacks: ['React 19 + Vite', 'Tailwind CSS v4', 'Framer Motion', 'Express Backend'],
    },
    {
      id: 'mobile',
      title: 'Build Mobile App',
      description: 'Create cross-platform iOS & Android mobile apps using React Native, Expo, and Tailwind.',
      icon: Smartphone,
      view: 'chat' as ActiveView,
      badge: 'REACT NATIVE',
      gradient: 'from-cyan-500 via-teal-600 to-emerald-500',
      speechGuide: 'Mobile app development mode activated! Let\'s design native iOS and Android screens with fluid tab navigation.',
      defaultPrompt: 'Generate a React Native Expo application architecture for a fitness and wellness tracker with dark mode and tab transitions.',
      stacks: ['React Native Expo', 'NativeWind Tailwind', 'TypeScript', 'AsyncStorage'],
    },
    {
      id: 'agent',
      title: 'Create AI Agent',
      description: 'Deploy autonomous AI agents with tools, vector memory, and automated task execution.',
      icon: Bot,
      view: 'agents' as ActiveView,
      badge: 'AUTONOMOUS',
      gradient: 'from-yellow-500 via-amber-600 to-orange-600',
      speechGuide: 'Creating an autonomous AI agent! We can equip your agent with web browsing, code execution, and vector memory.',
      defaultPrompt: 'Deploy an autonomous market research AI agent that continuously monitors tech news feeds and compiles daily vector summaries.',
      stacks: ['Gemini 3.6 Flash', 'Pinecone Vector RAG', 'Tool Calling SDK', 'Express Proxy'],
    },
    {
      id: 'logo',
      title: 'Generate Logo',
      description: 'Design minimalist vector logos, brand identities, typography kits, and icon sets.',
      icon: Sparkles,
      view: 'imagegen' as ActiveView,
      badge: 'BRAND KIT',
      gradient: 'from-amber-500 via-orange-600 to-red-500',
      speechGuide: 'Logo and Brand Kit Studio! I will synthesize vector-style brand logos with custom typography and color palettes.',
      defaultPrompt: 'Minimalist futuristic tech logo emblem featuring geometric intersecting infinity curves, metallic cyan and neon purple gradient accents.',
      stacks: ['Imagen 3 Model', 'SVG Vector Tracing', 'Color Palette Synth'],
    },
    {
      id: 'image',
      title: 'Generate Image',
      description: 'Synthesize photorealistic 8K images, digital concept art, and UI visual assets with Imagen 3.',
      icon: ImageIcon,
      view: 'imagegen' as ActiveView,
      badge: 'IMAGEN 3',
      gradient: 'from-fuchsia-600 via-pink-600 to-rose-500',
      speechGuide: 'Image Generation Studio ready! Tell me what atmosphere, lighting, or visual assets you want to render in 8K.',
      defaultPrompt: 'A futuristic cybernetic AI control room with holographic data displays, neon purple and cyan glassmorphism UI, 8K photorealistic render.',
      stacks: ['Imagen 3 Ultra', 'Aspect Ratio 16:9', 'Prompt Enhancer'],
    },
    {
      id: 'video',
      title: 'Generate Video',
      description: 'Craft video generation scripts, visual scene storyboards, and Veo model motion prompts.',
      icon: Video,
      view: 'chat' as ActiveView,
      badge: 'VEO SYNTH',
      gradient: 'from-indigo-600 via-purple-600 to-pink-500',
      speechGuide: 'Video Production Mode! I will write scene-by-scene cinematic storyboards and Veo video generator prompts.',
      defaultPrompt: 'Generate a 30-second futuristic tech launch video script complete with cinematic scene descriptions, voiceover lines, and AI video prompts.',
      stacks: ['Veo AI Model', 'Cinematic Script Engine', 'Audio Voiceover Spec'],
    },
    {
      id: 'saas',
      title: 'Build SaaS',
      description: 'Architect multi-tenant SaaS platforms complete with Stripe subscriptions and RBAC auth.',
      icon: Layers,
      view: 'chat' as ActiveView,
      badge: 'COMPLETE ENGINE',
      gradient: 'from-purple-600 via-violet-700 to-indigo-800',
      speechGuide: 'SaaS Platform Architect engaged! We will build multi-tenant databases, Stripe billing webhooks, and team management.',
      defaultPrompt: 'Architect a multi-tenant SaaS application structure in React + FastAPI, including Stripe webhook handlers, user team management, and RBAC.',
      stacks: ['React 19 SPA', 'FastAPI Backend', 'PostgreSQL DB', 'Stripe Payments'],
    },
    {
      id: 'workflow',
      title: 'Create Workflow',
      description: 'Build visual n8n automation pipelines, webhook listeners, and multi-node LLM chains.',
      icon: Workflow,
      view: 'workflows' as ActiveView,
      badge: 'N8N HUB',
      gradient: 'from-violet-600 via-purple-600 to-fuchsia-600',
      speechGuide: 'n8n Workflow Automation Studio! I will build visual multi-node pipelines connecting webhooks, LLMs, and databases.',
      defaultPrompt: 'Build an automated n8n pipeline that receives GitHub pull request webhooks, runs an AI code review via Gemini, and sends Slack summaries.',
      stacks: ['n8n Engine', 'Webhook Handlers', 'Slack API', 'Gemini RAG'],
    },
    {
      id: 'dashboard',
      title: 'Build Dashboard',
      description: 'Design analytical admin dashboards with real-time charts, telemetry cards, and data tables.',
      icon: BarChart3,
      view: 'dashboard' as ActiveView,
      badge: 'ANALYTICAL',
      gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
      speechGuide: 'Analytical Dashboard Studio! I will construct real-time telemetry panels, data tables, and interactive metric charts.',
      defaultPrompt: 'Build an analytical AI API usage dashboard with real-time request charts, token cost breakdowns, and system latency monitoring.',
      stacks: ['Recharts / D3', 'Real-time Telemetry', 'Glassmorphic Cards', 'Tailwind CSS'],
    },
  ];

  // Handle Card Click -> Avatar Reacts + Speaks Guidance + Opens Step Guidance
  const handleSelectCard = (card: typeof creatorCards[0]) => {
    setSelectedCardStep(card);
    setStepIndex(0);
    setGuidedPromptInput(card.defaultPrompt);

    // Avatar Reaction
    setAvatarState('celebrating');

    // Avatar Speaks Step Guidance
    if (voiceEnabled) {
      voiceEngine.speak(card.speechGuide, selectedAvatar, () => {
        setAvatarState('idle');
      });
    }

    setTimeout(() => {
      setAvatarState('idle');
    }, 2500);
  };

  // Confirm Step Guidance & Proceed to Execution
  const handleConfirmGuidanceAndExecute = () => {
    if (!selectedCardStep) return;

    // Avatar Says final confirmation
    setAvatarState('thinking');
    const finalSpeech = `Executing your ${selectedCardStep.title}! Initializing code generation and workspace environment.`;

    if (voiceEnabled) {
      voiceEngine.speak(finalSpeech, selectedAvatar);
    }

    onSelectOption(selectedCardStep.view, guidedPromptInput || selectedCardStep.defaultPrompt);
    setSelectedCardStep(null);
  };

  const handleCustomPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setAvatarState('thinking');
    if (voiceEnabled) {
      voiceEngine.speak(`Processing your request: "${searchQuery}". Launching AI creator studio.`, selectedAvatar);
    }

    onSelectOption('chat', searchQuery);
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-950 text-slate-100 overflow-y-auto p-3 sm:p-8 space-y-8 pb-32 relative select-none">
      {/* Background Cinematic Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-gradient-to-b from-purple-600/20 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

      {/* 3D AVATAR HERO CENTERPIECE STAGE */}
      <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center">
        {/* Top Header System Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-purple-500/40 text-purple-300 text-xs font-mono shadow-xl backdrop-blur-xl mb-2"
        >
          <Flame className="w-4 h-4 text-cyan-400 animate-bounce" />
          <span>NEXUS 3D HUMAN AI ASSISTANT OPERATING SYSTEM</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" />
        </motion.div>

        {/* Avatar Persona Selector Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-wrap items-center justify-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl mb-4"
        >
          {[
            { id: 'professional_female', label: 'Professional Female', icon: UserCheck, color: 'text-purple-400' },
            { id: 'professional_male', label: 'Professional Male', icon: UserCheck, color: 'text-cyan-400' },
            { id: 'futuristic_robot', label: 'Futuristic Robot', icon: Cpu, color: 'text-emerald-400' },
            { id: 'holographic_ai', label: 'Holographic AI', icon: Radio, color: 'text-fuchsia-400' },
          ].map((persona) => {
            const Icon = persona.icon;
            const isSelected = selectedAvatar === persona.id;
            return (
              <button
                key={persona.id}
                onClick={() => {
                  setSelectedAvatar(persona.id as AvatarType);
                  setAvatarState('thinking');
                  setTimeout(() => setAvatarState('idle'), 1000);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/60 border border-purple-400/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${persona.color}`} />
                <span>{persona.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* 3D AVATAR CANVAS BOX */}
        <div className="relative w-full max-w-2xl h-[380px] sm:h-[420px] rounded-3xl bg-slate-950/80 border border-purple-500/30 shadow-[0_0_60px_rgba(168,85,247,0.25)] backdrop-blur-3xl overflow-hidden flex flex-col items-center justify-center">
          {/* Ambient Corner Glows */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Three.js 3D Canvas */}
          <ThreeDAvatarCanvas
            avatarType={selectedAvatar}
            avatarState={avatarState}
            speechVolume={speechVolume}
            onAvatarClick={triggerGreeting}
          />

          {/* Live Avatar Status Badge Overlay */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-md text-xs font-mono shadow-lg">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                avatarState === 'speaking'
                  ? 'bg-cyan-400 animate-ping'
                  : avatarState === 'thinking'
                  ? 'bg-purple-400 animate-pulse'
                  : avatarState === 'celebrating'
                  ? 'bg-amber-400 animate-bounce'
                  : 'bg-emerald-400'
              }`}
            />
            <span className="text-slate-200 uppercase tracking-wider font-bold text-[10px]">
              {avatarState === 'speaking'
                ? 'AI Speaking...'
                : avatarState === 'thinking'
                ? 'Processing Thought...'
                : avatarState === 'celebrating'
                ? 'Task Celebrated!'
                : avatarState === 'listening'
                ? 'Listening to Voice...'
                : 'AI Ready'}
            </span>
          </div>

          {/* Controls Bar Overlay (Voice Toggle & Replay Greeting) */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg">
            <button
              onClick={() => {
                const newVoice = !voiceEnabled;
                setVoiceEnabled(newVoice);
                if (!newVoice) voiceEngine.stop();
              }}
              className={`p-2 rounded-xl transition-colors ${
                voiceEnabled ? 'text-cyan-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-800'
              }`}
              title={voiceEnabled ? 'Mute AI Speech Voice' : 'Enable AI Speech Voice'}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={triggerGreeting}
              className="p-2 rounded-xl text-purple-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Replay 3D Avatar Greeting Speech"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Live Subtitle / Spoken Greeting Text Overlay */}
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 border border-purple-500/30 p-3 rounded-2xl backdrop-blur-2xl text-center shadow-2xl">
            <p className="text-xs sm:text-sm font-medium text-slate-100 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-spin" />
              <span>
                "Hello! Welcome to Nexus AI. I'm your personal AI Creator. What would you like to create today?"
              </span>
            </p>
          </div>
        </div>

        {/* Central Futuristic Prompt Input Bar */}
        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCustomPromptSubmit}
          className="w-full max-w-2xl relative group mt-6"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-cyan-500 to-indigo-600 rounded-2xl blur opacity-40 group-hover:opacity-75 transition duration-500" />
          <div className="relative flex items-center bg-slate-900/90 backdrop-blur-2xl rounded-2xl border border-white/15 p-2 shadow-2xl">
            <Wand2 className="w-5 h-5 text-cyan-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Talk to 3D AI Assistant (e.g. 'Build a SaaS dashboard', 'Generate logo')..."
              className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none px-3 py-2"
            />
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-xl border transition-all mr-1.5 ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-cyan-400 border-cyan-500/20'
              }`}
              title="Speak to Avatar"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs flex items-center gap-2 hover:brightness-110 shadow-lg shadow-purple-950/60 transition-all shrink-0"
            >
              <span>Create</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.form>
      </div>

      {/* LARGE ANIMATED CREATOR CARDS SECTION */}
      <div className="max-w-6xl mx-auto space-y-4 relative z-10 pt-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
              <Sparkle className="w-5 h-5 text-purple-400" />
              <span>Interactive AI Creator Studio</span>
            </h2>
            <p className="text-xs text-slate-400">
              Select a studio card. Your 3D AI Assistant will guide you step by step.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {creatorCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => handleSelectCard(card)}
                className="group relative cursor-pointer rounded-2xl bg-slate-900/80 border border-white/10 hover:border-purple-500/50 p-5 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 shadow-xl overflow-hidden"
              >
                {/* Accent Background Glow */}
                <div
                  className={`absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br ${card.gradient} opacity-15 rounded-full blur-2xl group-hover:opacity-35 transition duration-500 pointer-events-none`}
                />

                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} p-3 text-white flex items-center justify-center shadow-lg shadow-slate-950/80 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-cyan-300 group-hover:border-cyan-500/40">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-purple-300 group-hover:text-cyan-300 relative z-10 mt-4">
                  <span>Talk to AI Assistant</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* STEP-BY-STEP GUIDANCE MODAL OVERLAY */}
      <AnimatePresence>
        {selectedCardStep && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-xl bg-slate-900/95 border border-purple-500/40 rounded-3xl p-6 text-slate-100 shadow-2xl shadow-purple-950/60 relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCardStep(null)}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${selectedCardStep.gradient} text-white`}>
                  <selectedCardStep.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{selectedCardStep.title} Creator Guide</h3>
                  <p className="text-xs text-purple-300 font-mono">Guided by 3D AI Assistant</p>
                </div>
              </div>

              {/* Step Contents */}
              <div className="py-5 space-y-4">
                {/* AI Guidance Speech Bubble */}
                <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 font-medium flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
                  <p>{selectedCardStep.speechGuide}</p>
                </div>

                {/* Tech Stack Chips */}
                <div>
                  <label className="text-xs font-mono text-slate-400 mb-2 block">
                    Recommended Tech Stack & Architecture:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedCardStep.stacks.map((st: string, i: number) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-xl bg-slate-800 border border-white/10 text-xs font-mono text-cyan-300 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {st}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Prompt Customization Input */}
                <div>
                  <label className="text-xs font-mono text-slate-400 mb-1.5 block">
                    Customize Prompt Goal for AI Agent:
                  </label>
                  <textarea
                    value={guidedPromptInput}
                    onChange={(e) => setGuidedPromptInput(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-950 text-slate-100 text-xs p-3 rounded-2xl border border-white/10 focus:outline-none focus:border-purple-500/50 font-mono resize-none"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => setSelectedCardStep(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmGuidanceAndExecute}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-purple-950/60 hover:brightness-110 flex items-center gap-2 transition-all"
                >
                  <span>Generate Application</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
