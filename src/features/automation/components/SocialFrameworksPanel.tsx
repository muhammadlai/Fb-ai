import React from 'react';
import { Share2, Linkedin, Twitter, Facebook, Instagram, Zap, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAutomationStore } from '../store/useAutomationStore';
import { SocialPlatform } from '../types/automation';

export const SocialFrameworksPanel: React.FC = () => {
  const { socialPresets, instantiatePreset } = useAutomationStore();

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'linkedin':
        return <Linkedin className="w-5 h-5 text-sky-400" />;
      case 'x_twitter':
        return <Twitter className="w-5 h-5 text-cyan-300" />;
      case 'facebook':
        return <Facebook className="w-5 h-5 text-blue-500" />;
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-400" />;
      default:
        return <Share2 className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-cyan-400" />
            Social Media Automation Framework
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pre-configured stealth automation pipelines for Facebook, LinkedIn, X (Twitter), and Instagram with humanized DOM interactions.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-500/30">
          <Zap className="w-4 h-4" />
          <span>Stealth DOM Anti-Detection Enabled</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {socialPresets.map((preset) => (
          <div
            key={preset.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    {getPlatformIcon(preset.platform)}
                  </div>
                  <h3 className="text-sm font-bold text-slate-100">{preset.title}</h3>
                </div>

                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                    preset.riskLevel === 'low'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                      : preset.riskLevel === 'medium'
                      ? 'bg-amber-950 text-amber-300 border-amber-500/30'
                      : 'bg-rose-950 text-rose-300 border-rose-500/30'
                  }`}
                >
                  {preset.riskLevel} risk
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{preset.description}</p>

              {/* Default steps preview */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  Pipeline Steps ({preset.stepsCount})
                </span>
                {preset.defaultSteps.slice(0, 3).map((step, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-slate-300 flex items-center justify-between"
                  >
                    <span>{idx + 1}. {step.description}</span>
                    <span className="text-[9px] text-cyan-400 uppercase">{step.action}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => instantiatePreset(preset.id)}
              className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span>Instantiate Automation Pipeline</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
