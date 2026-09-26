import React, { useState } from 'react';
import { User, AuditLog, WebhookEndpoint, HackathonEvent } from '../types';
import { 
  Users, 
  ShieldCheck, 
  Terminal, 
  RotateCcw, 
  Download, 
  Upload, 
  Calendar, 
  Radio, 
  Activity,
  Layers,
  Search,
  Filter
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User;
  users: User[];
  event: HackathonEvent;
  auditLogs: AuditLog[];
  webhooks: WebhookEndpoint[];
  onResetSeedData: () => void;
  onExportAllJSON: () => void;
  onImportJSON: (jsonString: string) => { success: boolean; message: string };
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  users,
  event,
  auditLogs,
  webhooks,
  onResetSeedData,
  onExportAllJSON,
  onImportJSON,
  onNavigateTab,
}) => {
  const [filterAction, setFilterAction] = useState('ALL');
  const [searchLog, setSearchLog] = useState('');
  const [importJsonText, setImportJsonText] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'audit' | 'users' | 'events' | 'system'>('audit');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesAction = filterAction === 'ALL' || log.action.includes(filterAction);
    const matchesSearch =
      searchLog === '' ||
      log.details.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.action.toLowerCase().includes(searchLog.toLowerCase());
    return matchesAction && matchesSearch;
  });

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const res = onImportJSON(importJsonText.trim());
    setNotification(res.message);
    setImportJsonText('');
    setTimeout(() => setNotification(null), 4000);
  };

  const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3 bg-slate-900 text-white rounded-md text-xs font-mono flex items-center justify-between shadow-md">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white cursor-pointer ml-3">✕</button>
        </div>
      )}

      {/* Admin Context Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 font-semibold">
                Admin Console
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Security & Ledger Operations
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-2">
              System Administration & Audit Ledger
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Operator: <span className="font-semibold text-slate-700">{currentUser.name}</span> ({currentUser.email})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onExportAllJSON}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-mono font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Snapshot JSON</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Revert all platform records back to clean seed fixtures? All manual edits will be reset.')) {
                  onResetSeedData();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-md text-xs font-mono font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Seed Fixtures</span>
            </button>
          </div>
        </div>

        {/* 5 Required Admin Metric Cards: Users, Events, System Activity, Audit Logs, Platform Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-slate-100 text-xs font-mono">
          {/* 1. Users */}
          <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>Users</span>
              <Users className="w-3 h-3 text-slate-400" />
            </div>
            <div className="text-lg font-bold text-slate-900 mt-0.5 tabular-nums">{users.length}</div>
            <div className="text-[10px] text-slate-500">4 distinct roles</div>
          </div>

          {/* 2. Events */}
          <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>Events</span>
              <Calendar className="w-3 h-3 text-slate-400" />
            </div>
            <div className="text-lg font-bold text-slate-900 mt-0.5 tabular-nums">1 Active</div>
            <div className="text-[10px] text-emerald-700 font-semibold">{event.name}</div>
          </div>

          {/* 3. System Activity / Webhooks */}
          <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>Webhooks</span>
              <Radio className="w-3 h-3 text-slate-400" />
            </div>
            <div className="text-lg font-bold text-slate-900 mt-0.5 tabular-nums">{webhooks.length}</div>
            <div className="text-[10px] text-emerald-700 font-semibold">Active listener</div>
          </div>

          {/* 4. Audit Logs */}
          <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>Audit Logs</span>
              <ShieldCheck className="w-3 h-3 text-slate-400" />
            </div>
            <div className="text-lg font-bold text-slate-900 mt-0.5 tabular-nums">{auditLogs.length}</div>
            <div className="text-[10px] text-slate-500">Immutable ledger</div>
          </div>

          {/* 5. Platform Statistics */}
          <div className="p-3 bg-slate-50 rounded-md border border-slate-200 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>Runtime</span>
              <Activity className="w-3 h-3 text-slate-400" />
            </div>
            <div className="text-lg font-bold text-slate-900 mt-0.5 tabular-nums">Hermetic</div>
            <div className="text-[10px] text-slate-500">Local / In-memory</div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
          <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-slate-50 text-xs font-mono">
            <button
              onClick={() => setActiveSubTab('audit')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${activeSubTab === 'audit' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Audit Trail ({auditLogs.length})
            </button>
            <button
              onClick={() => setActiveSubTab('users')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${activeSubTab === 'users' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
            >
              User Directory ({users.length})
            </button>
            <button
              onClick={() => setActiveSubTab('events')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${activeSubTab === 'events' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Event Oversight
            </button>
            <button
              onClick={() => setActiveSubTab('system')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${activeSubTab === 'system' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
            >
              System & Backup
            </button>
          </div>
        </div>
      </div>

      {/* Subtab 1: Audit Log Table */}
      {activeSubTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                Tamper-Evident Audit Ledger
              </h2>
              <p className="text-xs text-slate-500">Every score change, assignment dispatch, and role action is immutably logged.</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Filter logs by keyword or actor..."
                value={searchLog}
                onChange={(e) => setSearchLog(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-sans placeholder:text-slate-400 focus:bg-white focus:outline-hidden"
              />
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono font-semibold"
              >
                <option value="ALL">All Actions</option>
                <option value="SCORE">Scores</option>
                <option value="TEAM">Teams</option>
                <option value="SUBMISSION">Submissions</option>
                <option value="ASSIGNMENT">Assignments</option>
                <option value="EVENT">Event Lifecycle</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 font-mono text-[11px] text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Timestamp (UTC)</th>
                  <th className="py-2.5 px-3">Actor</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Target</th>
                  <th className="py-2.5 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()} · {new Date(log.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className="font-semibold text-slate-900">{log.actorName}</span>
                      <span className="text-[10px] text-slate-400 ml-1.5 uppercase font-mono">({log.actorRole})</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 font-bold text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{log.targetType}:{log.targetId}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-700 max-w-sm truncate" title={log.details}>
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 2: User Directory */}
      {activeSubTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                User Identities & Role Directory
              </h2>
              <p className="text-xs text-slate-500">Participant ({roleCounts.participant || 0}), Judge ({roleCounts.judge || 0}), Organizer ({roleCounts.organizer || 0}), Admin ({roleCounts.admin || 0})</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {users.map((u) => (
              <div key={u.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-md space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{u.name}</span>
                  <span className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded border font-semibold ${
                    u.role === 'organizer'
                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                      : u.role === 'judge'
                      ? 'bg-blue-50 text-blue-900 border-blue-300'
                      : u.role === 'admin'
                      ? 'bg-purple-50 text-purple-900 border-purple-300'
                      : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  }`}>
                    {u.role}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono truncate">{u.email}</div>
                <div className="text-[11px] text-slate-600 line-clamp-1">{u.organization}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 3: Event Oversight */}
      {activeSubTab === 'events' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                Active Event Oversight
              </h2>
              <p className="text-xs text-slate-500">Manage event rules, tracks, prizes, and deadlines directly.</p>
            </div>
            <button
              onClick={() => onNavigateTab('events')}
              className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-mono font-semibold"
            >
              Open Event Studio &rarr;
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-md border border-slate-200 text-xs space-y-2">
            <div className="font-bold text-slate-900 text-sm">{event.name}</div>
            <p className="text-slate-600">{event.tagline}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 font-mono text-[11px] text-slate-500">
              <div>Organizer: <strong className="text-slate-800">{event.organizerName}</strong></div>
              <div>Tracks: <strong className="text-slate-800">{event.tracks.length}</strong></div>
              <div>Prize Pool: <strong className="text-slate-800">${event.totalPrizePool.toLocaleString()}</strong></div>
              <div>Status: <strong className="text-emerald-800 uppercase">{event.status}</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 4: System & Backup */}
      {activeSubTab === 'system' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                JSON Fixture Backup & Export
              </h2>
              <p className="text-xs text-slate-500">One-click snapshot download of all database collections.</p>
            </div>
            <button
              onClick={onExportAllJSON}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-mono font-semibold transition-colors cursor-pointer"
            >
              Download Full Platform State JSON
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                Restore State from JSON
              </h2>
              <p className="text-xs text-slate-500">Paste raw platform JSON string to restore hermetic state.</p>
            </div>
            <textarea
              rows={4}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste valid HackForge state JSON here..."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded font-mono text-xs focus:bg-white focus:outline-hidden"
            />
            <button
              onClick={handleImport}
              className="w-full py-2 bg-white text-slate-800 border border-slate-300 rounded-md text-xs font-mono font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Restore Platform State
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
