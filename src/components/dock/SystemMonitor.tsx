import React, { useEffect } from 'react';
import {
  Clock,
  Wifi,
  Cpu,
  Zap,
  HardDrive,
  Bot,
  Bell,
  Download,
  UploadCloud,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Activity,
  Layers,
} from 'lucide-react';
import { useDockStore } from '../../store/useDockStore';

export const SystemMonitor: React.FC = () => {
  const {
    systemMetrics,
    notifications,
    processes,
    activeDockDrawer,
    setActiveDockDrawer,
    toggleMic,
    toggleSpeaker,
    tickDockTelemetry,
  } = useDockStore();

  // Tick live system telemetry every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      tickDockTelemetry();
    }, 3000);
    return () => clearInterval(interval);
  }, [tickDockTelemetry]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const runningProcessesCount = processes.filter((p) => p.status === 'running').length;

  return (
    <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800/80 backdrop-blur-md font-mono text-xs text-slate-200">
      {/* Time & Date Widget */}
      <div className="hidden sm:flex flex-col items-end px-2 border-r border-slate-800/80">
        <span className="text-[11px] font-bold text-slate-100 flex items-center gap-1">
          <Clock className="w-3 h-3 text-cyan-400" />
          {systemMetrics.currentTime}
        </span>
        <span className="text-[9px] text-slate-400 uppercase">{systemMetrics.currentDate}</span>
      </div>

      {/* Network Internet Status */}
      <div className="group relative p-1.5 rounded-xl hover:bg-slate-900 cursor-pointer flex items-center gap-1">
        <Wifi className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden xl:inline text-[10px] text-emerald-300 font-bold">
          {systemMetrics.internetSpeedMbps}M
        </span>

        {/* Hover Tooltip */}
        <div className="absolute -top-12 right-0 hidden group-hover:block p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] whitespace-nowrap z-50 shadow-xl">
          <div className="text-emerald-400 font-bold">Status: Online (Low Jitter)</div>
          <div className="text-slate-400">Bandwidth: 985 Mbps Fiber</div>
        </div>
      </div>

      {/* Hardware Telemetry Gauges (CPU / GPU / RAM / Disk) */}
      <button
        onClick={() => setActiveDockDrawer('systemMonitor')}
        className={`group relative p-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${
          activeDockDrawer === 'systemMonitor'
            ? 'bg-purple-950 border-purple-500 text-cyan-300'
            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
        }`}
        title="Hardware System Metrics"
      >
        <div className="flex items-center gap-1">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-bold text-cyan-300">{systemMetrics.cpuUsage}%</span>
        </div>

        <div className="hidden lg:flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-[10px] font-bold text-purple-300">{systemMetrics.gpuUsage}%</span>
        </div>

        <div className="hidden xl:flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-bold text-emerald-300">{systemMetrics.ramUsage}%</span>
        </div>

        <div className="hidden 2xl:flex items-center gap-1">
          <HardDrive className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-bold text-amber-300">{systemMetrics.diskUsage}%</span>
        </div>
      </button>

      {/* Active AI Model & Agents Indicator */}
      <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-xl bg-purple-950/60 border border-purple-500/30 text-[10px]">
        <Bot className="w-3.5 h-3.5 text-cyan-400" />
        <span className="text-cyan-300 font-bold">{systemMetrics.activeModel}</span>
        <span className="bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded font-bold">
          {systemMetrics.activeAgentsCount} Agents
        </span>
      </div>

      {/* Running Processes Drawer Trigger */}
      <button
        onClick={() => setActiveDockDrawer('processes')}
        className={`relative p-1.5 rounded-xl border cursor-pointer transition-all flex items-center gap-1 ${
          activeDockDrawer === 'processes'
            ? 'bg-purple-950 border-purple-500 text-purple-300'
            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
        }`}
        title="Active Background Processes & Queue"
      >
        <Layers className="w-3.5 h-3.5 text-indigo-400" />
        <span className="text-[10px] font-bold text-indigo-300">{runningProcessesCount}</span>

        {/* Download & Upload Queue Badges */}
        <div className="hidden xl:flex items-center gap-1 text-[9px] text-slate-400 border-l border-slate-800 pl-1.5">
          <span className="flex items-center text-cyan-400">
            <Download className="w-2.5 h-2.5 mr-0.5" />
            {systemMetrics.downloadsCount}
          </span>
          <span className="flex items-center text-purple-400">
            <UploadCloud className="w-2.5 h-2.5 mr-0.5" />
            {systemMetrics.uploadQueueCount}
          </span>
        </div>
      </button>

      {/* Audio Controls (Mic & Speaker) */}
      <div className="flex items-center gap-1 border-l border-slate-800/80 pl-1.5">
        <button
          onClick={toggleMic}
          className={`p-1.5 rounded-lg border cursor-pointer transition-all ${
            systemMetrics.micStatus === 'on'
              ? 'bg-slate-900 border-slate-800 text-cyan-400 hover:text-cyan-300'
              : 'bg-rose-950 border-rose-500/50 text-rose-300'
          }`}
          title={`Microphone: ${systemMetrics.micStatus}`}
        >
          {systemMetrics.micStatus === 'on' ? (
            <Mic className="w-3.5 h-3.5" />
          ) : (
            <MicOff className="w-3.5 h-3.5" />
          )}
        </button>

        <button
          onClick={toggleSpeaker}
          className={`p-1.5 rounded-lg border cursor-pointer transition-all ${
            systemMetrics.speakerStatus === 'on'
              ? 'bg-slate-900 border-slate-800 text-purple-400 hover:text-purple-300'
              : 'bg-rose-950 border-rose-500/50 text-rose-300'
          }`}
          title={`Speaker: ${systemMetrics.speakerStatus}`}
        >
          {systemMetrics.speakerStatus === 'on' ? (
            <Volume2 className="w-3.5 h-3.5" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Notifications Drawer Button */}
      <button
        onClick={() => setActiveDockDrawer('notifications')}
        className={`relative p-1.5 rounded-xl border cursor-pointer transition-all ${
          activeDockDrawer === 'notifications'
            ? 'bg-purple-950 border-purple-500 text-rose-300'
            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
        }`}
        title="Enterprise Notification Center"
      >
        <Bell className="w-3.5 h-3.5 text-rose-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};
