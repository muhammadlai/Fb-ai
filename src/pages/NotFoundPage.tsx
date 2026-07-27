import { Link } from 'react-router-dom';
import { Cpu, ArrowLeft, Terminal } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#080711] flex items-center justify-center p-6 cyber-grid-bg text-slate-100">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-purple-500/30 shadow-2xl text-center space-y-6">
        <div className="inline-flex p-4 bg-slate-950 border border-purple-500/40 rounded-2xl text-purple-400 glow-purple">
          <Cpu className="w-10 h-10 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gradient-cyber">404 EXCEPTION</h1>
          <p className="text-xs font-mono text-purple-300/80 uppercase tracking-widest">
            Vector Address Not Resolved
          </p>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-xl border border-purple-900/40 text-left font-mono text-xs text-slate-400 space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 mb-1 font-semibold">
            <Terminal className="w-3.5 h-3.5" />
            <span>Kernel Log</span>
          </div>
          <p className="text-red-400">ERR_ROUTE_NOT_FOUND: 0x800404</p>
          <p>Target endpoint is out of bounds or locked in a future phase.</p>
        </div>

        <Link
          to="/dashboard"
          className="cyber-button w-full py-3 rounded-xl font-bold text-xs text-white uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg inline-flex"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Command Center
        </Link>
      </div>
    </div>
  );
}
