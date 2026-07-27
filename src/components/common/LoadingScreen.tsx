import { Cpu, CpuIcon } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  subtext?: string;
  fullScreen?: boolean;
}

export function LoadingScreen({
  message = 'Initializing Nexus AI OS Engine...',
  subtext = 'Connecting neural pathways and verifying authorization signatures',
  fullScreen = true,
}: LoadingScreenProps) {
  const content = (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="relative mb-8">
        {/* Outer glowing animated pulse ring */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 blur-xl opacity-50 animate-pulse" />
        <div className="relative w-20 h-20 bg-slate-950/90 border border-cyan-500/40 rounded-2xl flex items-center justify-center glow-cyan backdrop-blur-md">
          <Cpu className="w-10 h-10 text-cyan-400 animate-bounce" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-gradient-cyber mb-2 tracking-wide">
        {message}
      </h3>
      <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-6 font-mono">
        {subtext}
      </p>

      {/* Cyberpunk Loading Bar */}
      <div className="w-64 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-purple-900/40 relative">
        <div className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500 w-1/2 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" />
      </div>
    </div>
  );

  if (!fullScreen) {
    return <div className="py-12 flex justify-center">{content}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#080711] flex items-center justify-center cyber-grid-bg">
      {content}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-6 rounded-2xl border border-purple-500/20 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-xl bg-purple-900/30" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-purple-900/30 rounded w-1/3" />
          <div className="h-3 bg-purple-900/20 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-800/60 rounded w-full" />
        <div className="h-3 bg-slate-800/40 rounded w-5/6" />
        <div className="h-3 bg-slate-800/40 rounded w-2/3" />
      </div>
    </div>
  );
}
