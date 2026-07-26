import React, { useState } from 'react';
import { Send, Terminal, RefreshCw, CheckCircle, AlertCircle, Copy, Code, FileText, ArrowUpRight, ArrowDownLeft, Shield } from 'lucide-react';
import { WebhookLog } from '../types';

interface N8nWebhookPanelProps {
  logs: WebhookLog[];
  onTriggerWebhook: (eventType: string, payload: any) => Promise<void>;
  onRefreshLogs: () => void;
  triggering: boolean;
}

export const N8nWebhookPanel: React.FC<N8nWebhookPanelProps> = ({
  logs,
  onTriggerWebhook,
  onRefreshLogs,
  triggering,
}) => {
  const [eventType, setEventType] = useState('agent_workflow_trigger');
  const [customPayload, setCustomPayload] = useState(
    JSON.stringify(
      {
        action: 'execute_ai_task',
        prompt: 'Nexus AI Agent: Summarize pending incoming lead requests',
        priority: 'high',
        params: { max_items: 5, model: 'gemini-3.6-flash' }
      },
      null,
      2
    )
  );
  const [activeTab, setActiveTab] = useState<'tester' | 'logs' | 'docs' | 'curl'>('tester');
  const [copiedCode, setCopiedCode] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setJsonError(null);
    try {
      const parsed = JSON.parse(customPayload);
      await onTriggerWebhook(eventType, parsed);
    } catch (err: any) {
      setJsonError(`Invalid JSON payload: ${err.message}`);
    }
  };

  const curlExample = `curl -X POST "http://localhost:8000/api/v1/webhooks/n8n/trigger" \\
  -H "Content-Type: application/json" \\
  -d '{
    "event_type": "${eventType}",
    "workflow_id": "nexus_main_workflow",
    "user_id": "nexus_admin",
    "payload": {
      "action": "execute_ai_task",
      "prompt": "Test automation pipeline via FastAPI & n8n"
    }
  }'`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Header Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-950/60 px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">n8n Webhook Integration Studio</h2>
            <p className="text-xs text-slate-400">FastAPI ↔ n8n Bi-directional Webhook Handler</p>
          </div>
        </div>

        <div className="flex items-center gap-1 mt-2 sm:mt-0 bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('tester')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'tester'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Trigger Webhook
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Live Logs
            {logs.length > 0 && (
              <span className="bg-indigo-400/20 text-indigo-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {logs.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'docs'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Architecture & Spec
          </button>
          <button
            onClick={() => setActiveTab('curl')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'curl'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            cURL / API Test
          </button>
        </div>
      </div>

      {/* Tab 1: Webhook Tester */}
      {activeTab === 'tester' && (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Event Type
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 font-mono"
              >
                <option value="agent_workflow_trigger">agent_workflow_trigger (AI Task Automation)</option>
                <option value="user_chat">user_chat (Realtime Chat Webhook Routing)</option>
                <option value="data_ingest">data_ingest (Document Processing Pipeline)</option>
                <option value="cron_trigger">cron_trigger (Scheduled Agent Execution)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Payload JSON Body
                </label>
                <span className="text-[11px] text-slate-400">Sent to FastAPI ➜ Dispatched to n8n</span>
              </div>
              <textarea
                value={customPayload}
                onChange={(e) => setCustomPayload(e.target.value)}
                rows={8}
                className="w-full bg-slate-950 border border-slate-800 text-indigo-300 text-xs rounded-lg p-3.5 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
                placeholder="{ ... }"
              />
              {jsonError && (
                <div className="mt-2 text-xs text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {jsonError}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={triggering}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm rounded-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {triggering ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Dispatching Webhook to n8n...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Trigger n8n Webhook Endpoint
                </>
              )}
            </button>
          </form>

          {/* Real-time Webhook Execution Overview */}
          <div className="bg-slate-950/80 rounded-xl p-5 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Production Webhook Handler Guarantees
                </h4>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-100">HMAC-SHA256 Signature Security:</strong> Outbound webhooks sign payload with secret key in <code className="text-indigo-300">X-Nexus-Signature</code> header.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-100">Automatic Retries & Exponential Backoff:</strong> Async <code className="text-indigo-300">httpx</code> client retries failed attempts with backoff up to 3 times.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-100">Bi-directional Callback Endpoint:</strong> n8n posts execution results back to <code className="text-indigo-300">/api/v1/webhooks/n8n/callback</code>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-100">FastAPI Pydantic Validation:</strong> All webhook payloads strictly validated against <code className="text-indigo-300">WebhookTriggerRequest</code> schema.
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 bg-slate-900/50 p-3 rounded-lg">
              <span className="font-semibold text-slate-300">Active Target URL:</span>{' '}
              <code className="text-indigo-400 font-mono">http://localhost:5678/webhook/nexus-agent</code>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Live Logs */}
      {activeTab === 'logs' && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Real-time Webhook Audit Trail</h3>
            <button
              onClick={onRefreshLogs}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh Logs
            </button>
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl text-slate-400 text-xs">
              No webhook events logged yet. Trigger a webhook from the tester tab!
            </div>
          ) : (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {logs.map((log) => (
                <div
                  key={log.event_id}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-900">
                    <div className="flex items-center gap-2">
                      {log.direction === 'outbound' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                          <ArrowUpRight className="w-3 h-3" />
                          OUTBOUND (FastAPI ➔ n8n)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          <ArrowDownLeft className="w-3 h-3" />
                          INBOUND (n8n ➔ FastAPI)
                        </span>
                      )}
                      <span className="text-slate-400">{log.event_id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[11px]">
                        {log.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] mt-2">
                    <div>
                      <span className="text-slate-400 block mb-1 font-sans font-semibold">Event Payload:</span>
                      <pre className="bg-slate-900/90 p-2.5 rounded border border-slate-800 text-indigo-300 overflow-x-auto max-h-36">
                        {JSON.stringify(log.payload, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1 font-sans font-semibold">Response / Acknowledgment:</span>
                      <pre className="bg-slate-900/90 p-2.5 rounded border border-slate-800 text-emerald-300 overflow-x-auto max-h-36">
                        {JSON.stringify(log.response || { status: log.status }, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Architecture & Spec */}
      {activeTab === 'docs' && (
        <div className="p-6 space-y-6 text-xs text-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-3">
                <Code className="w-4 h-4 text-indigo-400" />
                FastAPI Webhook Endpoints
              </h4>
              <div className="space-y-3 font-mono">
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                  <div className="text-emerald-400 font-bold">POST /api/v1/webhooks/n8n/trigger</div>
                  <p className="text-[11px] text-slate-400 font-sans mt-1">Dispatches event payload to n8n webhook with HMAC signature.</p>
                </div>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                  <div className="text-cyan-400 font-bold">POST /api/v1/webhooks/n8n/callback</div>
                  <p className="text-[11px] text-slate-400 font-sans mt-1">Receives async workflow completion callbacks from n8n node.</p>
                </div>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                  <div className="text-indigo-400 font-bold">GET /api/v1/webhooks/n8n/status</div>
                  <p className="text-[11px] text-slate-400 font-sans mt-1">Returns status and configuration parameters of n8n integration.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-cyan-400" />
                n8n Docker Setup & Workflow Template
              </h4>
              <div className="space-y-2 text-slate-300 font-sans">
                <p>Generated production artifacts for Ubuntu VPS deployment:</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-400">
                  <li><code className="text-indigo-300">/n8n/docker-compose.n8n.yml</code>: n8n + PostgreSQL container setup.</li>
                  <li><code className="text-indigo-300">/n8n/nexus_n8n_workflow_template.json</code>: Pre-configured n8n workflow with Webhook Trigger and HTTP Callback node.</li>
                  <li><code className="text-indigo-300">/n8n/setup_n8n.sh</code>: One-click script to start n8n services on port 5678.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: cURL / API Test */}
      {activeTab === 'curl' && (
        <div className="p-6">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Terminal / Postman cURL Request Command
            </h4>
            <button
              onClick={() => copyToClipboard(curlExample)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedCode ? 'Copied to Clipboard!' : 'Copy cURL Command'}
            </button>
          </div>
          <pre className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed">
            {curlExample}
          </pre>
        </div>
      )}
    </div>
  );
};
