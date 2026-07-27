import { useState } from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { CyberThemeMode } from '../../types/ui';

export function ThemeToggle() {
  const { theme, setTheme } = useUIStore();
  const [isOpen, setIsOpen] = useState(false);

  const themeOptions: { id: CyberThemeMode; name: string; color: string }[] = [
    { id: 'cyber-purple', name: 'Cyber Purple (Default)', color: 'bg-purple-600' },
    { id: 'neon-cyan', name: 'Neon Cyan Overdrive', color: 'bg-cyan-500' },
    { id: 'matrix-green', name: 'Matrix Emerald Core', color: 'bg-emerald-500' },
    { id: 'dark-midnight', name: 'Midnight Stealth', color: 'bg-slate-700' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl glass-panel text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all flex items-center gap-2 text-xs font-mono cursor-pointer"
        title="Change Cyber Theme"
      >
        <Palette className="w-4 h-4 text-purple-400" />
        <span className="hidden sm:inline capitalize">{theme.replace('-', ' ')}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl p-2 z-50 border border-purple-500/30 shadow-2xl backdrop-blur-2xl">
          <div className="px-3 py-2 border-b border-purple-900/30 flex items-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-200">Visual Theme Matrix</span>
          </div>
          <div className="space-y-1">
            {themeOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setTheme(opt.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  theme === opt.id
                    ? 'bg-purple-950/60 text-cyan-300 font-semibold border border-purple-500/30'
                    : 'text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${opt.color} shadow-sm`} />
                  <span>{opt.name}</span>
                </div>
                {theme === opt.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
