import React, { useState } from 'react';
import { Globe, UserCheck, Sliders, Shield, MousePointer, Activity, Plus, Trash2 } from 'lucide-react';
import { useAutomationStore } from '../store/useAutomationStore';

export const BrowserProfilesPanel: React.FC = () => {
  const { profiles, addProfile, deleteProfile, updateProfileBehavior, activeProfileId, setActiveProfileId } = useAutomationStore();
  
  const [newProfileName, setNewProfileName] = useState('');
  const [proxyInput, setProxyInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const selectedProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;

    addProfile({
      name: newProfileName,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Playwright/1.43.0',
      viewport: { width: 1920, height: 1080 },
      cookiesCount: 12,
      proxyServer: proxyInput.trim() || undefined,
      status: 'idle',
      stealthMode: true,
      behaviorConfig: {
        typingSpeedWpm: 80,
        clickDelayMs: 500,
        mouseJitterEnabled: true,
        scrollPacingMs: 1000,
        randomizePauses: true,
        userAgentRotation: true,
      },
    });

    setNewProfileName('');
    setProxyInput('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            Playwright Browser Profiles & Stealth Behavior
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure isolated browser contexts, humanized typing cadence (WPM), organic mouse pathing, and stealth proxy fingerprints.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Stealth Profile</span>
        </button>
      </div>

      {/* Add Profile Modal Form */}
      {isAdding && (
        <form onSubmit={handleCreateProfile} className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-4">
          <h3 className="text-sm font-bold text-slate-100">Create New Browser Context Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400">Profile Name</label>
              <input
                type="text"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="E.g., LinkedIn Stealth Agent 3"
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400">Proxy Server (Optional)</label>
              <input
                type="text"
                value={proxyInput}
                onChange={(e) => setProxyInput(e.target.value)}
                placeholder="https://proxy.us-east.net:8080"
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl bg-slate-950 text-slate-400 text-xs font-mono cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold cursor-pointer"
            >
              Save Context Profile
            </button>
          </div>
        </form>
      )}

      {/* Grid view of profiles & Behavior tweaking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile List */}
        <div className="space-y-3 lg:col-span-1">
          <span className="text-xs font-mono text-slate-400 uppercase">Active Browser Contexts</span>
          {profiles.map((prof) => (
            <div
              key={prof.id}
              onClick={() => setActiveProfileId(prof.id)}
              className={`p-4 rounded-2xl bg-slate-900 border transition-all cursor-pointer space-y-2 ${
                selectedProfile?.id === prof.id
                  ? 'border-cyan-500 bg-slate-900/90 shadow-md'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  {prof.name}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                  {prof.status}
                </span>
              </div>

              <p className="text-[11px] font-mono text-slate-400 truncate">{prof.userAgent}</p>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                <span>Cookies: {prof.cookiesCount}</span>
                {prof.proxyServer ? (
                  <span className="text-purple-400">Proxy Active</span>
                ) : (
                  <span>Direct IP</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Human Behavior Configuration for selected profile */}
        {selectedProfile && (
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 lg:col-span-2 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  Human Behavior Engine Settings: {selectedProfile.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Simulate human typing speed, random micro-pauses, and Bezier curve mouse cursor jitter.
                </p>
              </div>

              {profiles.length > 1 && (
                <button
                  onClick={() => deleteProfile(selectedProfile.id)}
                  className="p-2 rounded-xl bg-slate-950 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Delete Profile"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Typing Speed WPM */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-300">Simulated Typing Speed (WPM):</span>
                  <span className="text-cyan-400 font-bold">{selectedProfile.behaviorConfig?.typingSpeedWpm || 80} WPM</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="140"
                  value={selectedProfile.behaviorConfig?.typingSpeedWpm || 80}
                  onChange={(e) =>
                    updateProfileBehavior(selectedProfile.id, {
                      typingSpeedWpm: parseInt(e.target.value, 10),
                    })
                  }
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500">
                  Adds natural inter-keystroke variance (40-140 WPM) to bypass anti-bot heuristics.
                </p>
              </div>

              {/* Click Delay */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-300">DOM Click Delay:</span>
                  <span className="text-purple-400 font-bold">{selectedProfile.behaviorConfig?.clickDelayMs || 500} ms</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="1500"
                  step="50"
                  value={selectedProfile.behaviorConfig?.clickDelayMs || 500}
                  onChange={(e) =>
                    updateProfileBehavior(selectedProfile.id, {
                      clickDelayMs: parseInt(e.target.value, 10),
                    })
                  }
                  className="w-full accent-purple-400 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500">
                  Artificial hold and release click duration for button interactions.
                </p>
              </div>

              {/* Toggle Options */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedProfile.behaviorConfig?.mouseJitterEnabled ?? true}
                    onChange={(e) =>
                      updateProfileBehavior(selectedProfile.id, {
                        mouseJitterEnabled: e.target.checked,
                      })
                    }
                    className="rounded accent-cyan-500"
                  />
                  <span>Bezier Mouse Jitter</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedProfile.behaviorConfig?.randomizePauses ?? true}
                    onChange={(e) =>
                      updateProfileBehavior(selectedProfile.id, {
                        randomizePauses: e.target.checked,
                      })
                    }
                    className="rounded accent-cyan-500"
                  />
                  <span>Random Micro-Pauses</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedProfile.behaviorConfig?.userAgentRotation ?? true}
                    onChange={(e) =>
                      updateProfileBehavior(selectedProfile.id, {
                        userAgentRotation: e.target.checked,
                      })
                    }
                    className="rounded accent-cyan-500"
                  />
                  <span>User Agent Spoofing</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
