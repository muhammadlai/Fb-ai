import { create } from 'zustand';
import {
  LiveMetrics,
  HealthStatus,
  LogEntry,
  AuditLog,
  TokenModelAnalytics,
  AIPerformanceMetric,
  SecurityOverview,
  SecurityEvent,
  SystemAlert,
  LogSeverity,
  LogCategory,
  ActionType,
} from '../types/telemetry';
import {
  INITIAL_METRICS,
  INITIAL_HEALTH_STATUSES,
  INITIAL_LOGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_TOKEN_ANALYTICS,
  INITIAL_AI_PERFORMANCE,
  INITIAL_SECURITY_OVERVIEW,
  INITIAL_SECURITY_EVENTS,
  INITIAL_ALERTS,
} from '../data/mockTelemetryData';

interface TelemetryStore {
  metrics: LiveMetrics;
  healthStatuses: HealthStatus[];
  logs: LogEntry[];
  auditLogs: AuditLog[];
  tokenAnalytics: TokenModelAnalytics[];
  aiPerformance: AIPerformanceMetric[];
  securityOverview: SecurityOverview;
  securityEvents: SecurityEvent[];
  alerts: SystemAlert[];
  isLiveAutoRefresh: boolean;

  toggleLiveRefresh: () => void;
  tickLiveData: () => void;
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  addAuditLog: (audit: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  dismissAlert: (id: string) => void;
  muteAlert: (id: string) => void;
  archiveAlert: (id: string) => void;
  addSystemAlert: (alert: Omit<SystemAlert, 'id' | 'timestamp' | 'status'>) => void;
  clearLogs: () => void;
}

export const useTelemetryStore = create<TelemetryStore>()((set, get) => ({
  metrics: INITIAL_METRICS,
  healthStatuses: INITIAL_HEALTH_STATUSES,
  logs: INITIAL_LOGS,
  auditLogs: INITIAL_AUDIT_LOGS,
  tokenAnalytics: INITIAL_TOKEN_ANALYTICS,
  aiPerformance: INITIAL_AI_PERFORMANCE,
  securityOverview: INITIAL_SECURITY_OVERVIEW,
  securityEvents: INITIAL_SECURITY_EVENTS,
  alerts: INITIAL_ALERTS,
  isLiveAutoRefresh: true,

  toggleLiveRefresh: () => set((s) => ({ isLiveAutoRefresh: !s.isLiveAutoRefresh })),

  tickLiveData: () => {
    const s = get();
    if (!s.isLiveAutoRefresh) return;

    // Generate random realistic fluctuations
    const cpuDelta = (Math.random() - 0.5) * 4;
    const memDelta = (Math.random() - 0.5) * 1.5;
    const apiDelta = Math.floor((Math.random() - 0.5) * 30);
    const llmDelta = Math.floor((Math.random() - 0.5) * 15);

    const newCpu = Math.min(98, Math.max(15, +(s.metrics.cpuUsage + cpuDelta).toFixed(1)));
    const newMem = Math.min(95, Math.max(30, +(s.metrics.memoryUsage + memDelta).toFixed(1)));
    const newApiReqs = Math.max(400, s.metrics.apiRequestsPerSec + apiDelta);
    const newLlmReqs = Math.max(50, s.metrics.llmRequestsPerMin + llmDelta);

    const updatedHistCpu = [...s.metrics.historicalCpu.slice(1), Math.round(newCpu)];
    const updatedHistMem = [...s.metrics.historicalMemory.slice(1), Math.round(newMem)];
    const updatedHistApi = [...s.metrics.historicalApiReqs.slice(1), newApiReqs];

    // Occasionally generate a real-time event log
    let updatedLogs = s.logs;
    if (Math.random() > 0.6) {
      const logCategories: LogCategory[] = ['AI Events', 'System Events', 'Browser Events', 'Workflow Events'];
      const logSeverities: LogSeverity[] = ['info', 'success', 'trace', 'warning'];

      const cat = logCategories[Math.floor(Math.random() * logCategories.length)];
      const sev = logSeverities[Math.floor(Math.random() * logSeverities.length)];

      const sampleMsgs = {
        'AI Events': 'Gemini 1.5 Pro stream context token chunk verified',
        'System Events': 'Container replica memory check within SLA boundaries',
        'Browser Events': 'Playwright stealth context ping: anti-fingerprint score 100/100',
        'Workflow Events': 'Pipeline step [Vector-Embedding-Sync] completed in 42ms',
      };

      const newLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        severity: sev,
        category: cat,
        service: 'telemetry-live-daemon',
        message: sampleMsgs[cat],
        details: `Automated live metric probe tick. System load: CPU ${newCpu}%, RAM ${newMem}%.`,
        traceId: `tr-${Math.floor(Math.random() * 89999 + 10000)}`,
      };

      updatedLogs = [newLog, ...s.logs.slice(0, 49)];
    }

    set({
      metrics: {
        ...s.metrics,
        cpuUsage: newCpu,
        memoryUsage: newMem,
        memoryUsedGB: +((newMem / 100) * s.metrics.memoryTotalGB).toFixed(1),
        apiRequestsPerSec: newApiReqs,
        llmRequestsPerMin: newLlmReqs,
        tokenConsumptionTotal: s.metrics.tokenConsumptionTotal + Math.floor(Math.random() * 400 + 100),
        historicalCpu: updatedHistCpu,
        historicalMemory: updatedHistMem,
        historicalApiReqs: updatedHistApi,
      },
      logs: updatedLogs,
    });
  },

  addLog: (logData) => {
    const newLog: LogEntry = {
      ...logData,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    set((s) => ({ logs: [newLog, ...s.logs] }));
  },

  addAuditLog: (auditData) => {
    const newAudit: AuditLog = {
      ...auditData,
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    set((s) => ({ auditLogs: [newAudit, ...s.auditLogs] }));
  },

  dismissAlert: (id) =>
    set((s) => ({
      alerts: s.alerts.map((a) => (a.id === id ? { ...a, status: 'dismissed' } : a)),
    })),

  muteAlert: (id) =>
    set((s) => ({
      alerts: s.alerts.map((a) => (a.id === id ? { ...a, status: 'muted' } : a)),
    })),

  archiveAlert: (id) =>
    set((s) => ({
      alerts: s.alerts.map((a) => (a.id === id ? { ...a, status: 'archived' } : a)),
    })),

  addSystemAlert: (alertData) => {
    const newAlert: SystemAlert = {
      ...alertData,
      id: `alt-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'active',
    };
    set((s) => ({ alerts: [newAlert, ...s.alerts] }));
  },

  clearLogs: () => set({ logs: [] }),
}));
