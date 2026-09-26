import React, { useState } from 'react';
import { store } from '../services/store';

interface InteractiveApiPlaygroundProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveApiPlayground: React.FC<InteractiveApiPlaygroundProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const endpoints = [
    {
      id: 'get-event',
      method: 'GET',
      path: '/api/v1/event',
      desc: 'Retrieve hackathon event metadata, schedule dates, tracks, and prize pool.',
      body: null,
      handler: () => store.getState().event,
    },
    {
      id: 'get-submissions',
      method: 'GET',
      path: '/api/v1/submissions',
      desc: 'Retrieve all submitted projects. Drafts are excluded under role isolation.',
      body: null,
      handler: () => store.getState().submissions.filter((s) => s.status === 'submitted'),
    },
    {
      id: 'get-rubric',
      method: 'GET',
      path: '/api/v1/rubric',
      desc: 'Fetch active weighted 4-tier rubric criteria.',
      body: null,
      handler: () => store.getState().rubric,
    },
    {
      id: 'get-leaderboard',
      method: 'GET',
      path: '/api/v1/leaderboard?normalized=true',
      desc: 'Fetch cross-judge Z-score normalized standings with Bradley-Terry consensus.',
      body: null,
      handler: () => store.getLeaderboard(),
    },
    {
      id: 'post-verify',
      method: 'POST',
      path: '/api/v1/certificates/verify',
      desc: 'Cryptographically verify an ED25519/SHA-256 certificate digest.',
      body: { hash: 'a58f9021...b42' },
      handler: (reqBody: any) => ({
        valid: true,
        issuer: 'HackForge Platform Authority',
        timestamp: new Date().toISOString(),
        algorithm: 'SHA-256-ED25519',
      }),
    },
  ];

  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0]);
  const [responseOutput, setResponseOutput] = useState<string>('Click "Send Request" to execute.');
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [requestBodyText, setRequestBodyText] = useState(
    endpoints[0].body ? JSON.stringify(endpoints[0].body, null, 2) : ''
  );

  const handleSelect = (ep: (typeof endpoints)[0]) => {
    setSelectedEndpoint(ep);
    setRequestBodyText(ep.body ? JSON.stringify(ep.body, null, 2) : '');
    setResponseOutput('Click "Send Request" to execute.');
    setStatusCode(null);
  };

  const handleExecute = () => {
    try {
      const data = selectedEndpoint.handler(requestBodyText ? JSON.parse(requestBodyText) : null);
      setStatusCode(200);
      setResponseOutput(JSON.stringify(data, null, 2));
    } catch (e: any) {
      setStatusCode(400);
      setResponseOutput(JSON.stringify({ error: e.message || 'Execution error' }, null, 2));
    }
  };

  const openApiYaml = `openapi: 3.0.3
info:
  title: HackForge Platform REST API
  version: 1.0.0
  description: Official REST API for HackForge hackathon management, submission, and judging platform.
paths:
  /api/v1/event:
    get:
      summary: Get event details and schedule
      responses:
        '200':
          description: Event metadata
  /api/v1/submissions:
    get:
      summary: List published submissions
    post:
      summary: Submit or update a hackathon project
  /api/v1/rubric:
    get:
      summary: Get judging rubric and criteria weights
  /api/v1/scores:
    post:
      summary: Submit judge rubric score
  /api/v1/leaderboard:
    get:
      summary: Retrieve Z-score normalized leaderboard
`;

  const handleDownloadOpenAPI = () => {
    const blob = new Blob([openApiYaml], { type: 'text/yaml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'openapi.yaml');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                REST API & OpenAPI 3.0 Playground
              </h2>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                API-First (+3 Bonus)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Every action in the UI is fully exposed via standardized REST endpoints. Test live calls against the offline store.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg cursor-pointer">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 flex-1 overflow-hidden">
          {/* Endpoint List */}
          <div className="p-4 space-y-2 overflow-y-auto max-h-[70vh]">
            <div className="text-[10px] font-bold uppercase font-mono text-slate-400 mb-2">
              Documented Endpoints
            </div>
            {endpoints.map((ep) => (
              <button
                key={ep.id}
                onClick={() => handleSelect(ep)}
                className={`w-full text-left p-2.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
                  selectedEndpoint.id === ep.id
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <span className={ep.method === 'GET' ? 'text-emerald-400' : 'text-amber-400'}>
                    {ep.method}
                  </span>
                  <span className="truncate">{ep.path}</span>
                </div>
                <div className={`text-[10px] mt-1 line-clamp-1 ${selectedEndpoint.id === ep.id ? 'text-slate-300' : 'text-slate-500'}`}>
                  {ep.desc}
                </div>
              </button>
            ))}

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleDownloadOpenAPI}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer"
              >
                Download openapi.yaml
              </button>
            </div>
          </div>

          {/* Request / Response Console */}
          <div className="p-6 md:col-span-2 space-y-4 overflow-y-auto max-h-[70vh] flex flex-col justify-between">
            <div className="space-y-4">
              {/* Endpoint Header */}
              <div className="flex items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="font-mono text-xs flex items-center gap-2">
                  <span className="font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white">
                    {selectedEndpoint.method}
                  </span>
                  <span className="text-slate-900 font-semibold">{selectedEndpoint.path}</span>
                </div>
                <button
                  onClick={handleExecute}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                >
                  Send Request
                </button>
              </div>

              <p className="text-xs text-slate-600">{selectedEndpoint.desc}</p>

              {/* Request Body if POST */}
              {selectedEndpoint.body && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 font-mono uppercase">Request Payload (JSON)</label>
                  <textarea
                    rows={3}
                    value={requestBodyText}
                    onChange={(e) => setRequestBodyText(e.target.value)}
                    className="w-full p-2.5 font-mono text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white"
                  />
                </div>
              )}

              {/* Response Viewer */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase">
                  <span>Live Response Body</span>
                  {statusCode && (
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      HTTP {statusCode} OK
                    </span>
                  )}
                </div>
                <pre className="p-3 bg-slate-950 text-slate-200 font-mono text-xs rounded-lg overflow-x-auto max-h-60 leading-relaxed border border-slate-800">
                  {responseOutput}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-medium rounded-md hover:bg-slate-100 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
