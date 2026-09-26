import React, { useState } from 'react';
import { HackathonEvent, User, Submission, Team, Score, Rubric, JudgeAssignment, CommunityVote } from '../types';
import { 
  Lock, 
  Unlock, 
  Download, 
  Cpu, 
  Users, 
  FileCode2, 
  CheckCircle2, 
  Scale, 
  ArrowRight,
  Vote,
  Trophy,
  ExternalLink,
  Layers
} from 'lucide-react';

interface OrganizerDashboardProps {
  currentUser: User;
  event: HackathonEvent;
  users: User[];
  teams: Team[];
  submissions: Submission[];
  rubric: Rubric;
  scores: Score[];
  assignments: JudgeAssignment[];
  votes: CommunityVote[];
  onToggleEmbargo: () => void;
  onRunAlgorithmicAssignment: () => { success: boolean; message: string };
  onUpdateRubric: (criteria: any[]) => { success: boolean; message: string };
  onNavigateTab: (tab: string) => void;
  onExportSubmissionsCSV: () => void;
  onExportScoresCSV: () => void;
  onExportLeaderboardCSV: () => void;
}

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({
  currentUser,
  event,
  users,
  teams,
  submissions,
  rubric,
  scores,
  assignments,
  votes,
  onToggleEmbargo,
  onRunAlgorithmicAssignment,
  onUpdateRubric,
  onNavigateTab,
  onExportSubmissionsCSV,
  onExportScoresCSV,
  onExportLeaderboardCSV,
}) => {
  const [reviewsPerProject, setReviewsPerProject] = useState(3);
  const [notification, setNotification] = useState<string | null>(null);
  const [tableFilter, setTableFilter] = useState<'all' | 'submitted' | 'draft'>('all');

  const judges = users.filter((u) => u.role === 'judge');
  const participants = users.filter((u) => u.role === 'participant');
  const submittedCount = submissions.filter((s) => s.status === 'submitted').length;
  const completedReviews = assignments.filter((a) => a.status === 'completed').length;
  const reviewProgress = assignments.length > 0 ? (completedReviews / assignments.length) * 100 : 0;
  const totalVotesCast = votes.length;
  const totalCreditsSpent = votes.reduce((acc, v) => acc + v.creditsSpent, 0);

  const handleRunAssignment = () => {
    const res = onRunAlgorithmicAssignment();
    setNotification(res.message);
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (tableFilter === 'submitted') return s.status === 'submitted';
    if (tableFilter === 'draft') return s.status === 'draft';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3 bg-slate-900 text-white border border-slate-700 rounded-md text-xs font-mono flex items-center justify-between shadow-md">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white cursor-pointer ml-3">✕</button>
        </div>
      )}

      {/* Control Strip & Operational Status */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                Organizer Dashboard
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Event: {event.name}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-2">
              Mission Control & Operations
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Active Coordinator: <span className="font-semibold text-slate-700">{currentUser.name}</span> ({currentUser.email})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onToggleEmbargo}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold font-mono transition-colors cursor-pointer border ${
                event.resultsEmbargoed
                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              {event.resultsEmbargoed ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{event.resultsEmbargoed ? 'Embargo: ACTIVE (Scores Concealed)' : 'Embargo: LIFTED (Public)'}</span>
            </button>

            <button
              onClick={() => onNavigateTab('results')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold font-mono transition-colors cursor-pointer shadow-xs"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Leaderboard & Results</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>

        {/* 8 Required Organizer Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-4 border-t border-slate-100 text-xs font-mono">
          
          {/* 1. Total Participants */}
          <div className="p-3 bg-slate-50/70 rounded-md border border-slate-200">
            <div className="text-[10px] text-slate-400 uppercase">Participants</div>
            <div className="text-lg font-bold text-slate-900 mt-1 tabular-nums">{participants.length}</div>
            <div className="text-[10px] text-slate-500">Active users</div>
          </div>

          {/* 2. Teams */}
          <div className="p-3 bg-slate-50/70 rounded-md border border-slate-200">
            <div className="text-[10px] text-slate-400 uppercase">Teams</div>
            <div className="text-lg font-bold text-slate-900 mt-1 tabular-nums">{teams.length}</div>
            <div className="text-[10px] text-slate-500">1–4 members</div>
          </div>

          {/* 3. Projects (Total) */}
          <div className="p-3 bg-slate-50/70 rounded-md border border-slate-200">
            <div className="text-[10px] text-slate-400 uppercase">Projects</div>
            <div className="text-lg font-bold text-slate-900 mt-1 tabular-nums">{submissions.length}</div>
            <div className="text-[10px] text-slate-500">All records</div>
          </div>

          {/* 4. Submitted Projects */}
          <div className="p-3 bg-slate-50/70 rounded-md border border-slate-200">
            <div className="text-[10px] text-slate-400 uppercase">Submitted</div>
            <div className="text-lg font-bold text-emerald-800 mt-1 tabular-nums">{submittedCount}</div>
            <div className="text-[10px] text-slate-500">{submissions.length - submittedCount} drafts</div>
          </div>

          {/* 5. Judges */}
          <div className="p-3 bg-slate-50/70 rounded-md border border-slate-200">
            <div className="text-[10px] text-slate-400 uppercase">Judges</div>
            <div className="text-lg font-bold text-slate-900 mt-1 tabular-nums">{judges.length}</div>
            <div className="text-[10px] text-slate-500">Active pool</div>
          </div>

          {/* 6. Judging Progress */}
          <div className="p-3 bg-slate-50/70 rounded-md border border-slate-200">
            <div className="text-[10px] text-slate-400 uppercase">Review Progress</div>
            <div className="text-lg font-bold text-slate-900 mt-1 tabular-nums">
              {completedReviews}/{assignments.length}
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold">{reviewProgress.toFixed(0)}% done</div>
          </div>

          {/* 7. Voting Activity */}
          <div className="p-3 bg-slate-50/70 rounded-md border border-slate-200">
            <div className="text-[10px] text-slate-400 uppercase">Community Votes</div>
            <div className="text-lg font-bold text-slate-900 mt-1 tabular-nums">{totalVotesCast}</div>
            <div className="text-[10px] text-slate-500">{totalCreditsSpent} tokens</div>
          </div>

          {/* 8. Results / Prize Allocation */}
          <div className="p-3 bg-slate-50/70 rounded-md border border-slate-200">
            <div className="text-[10px] text-slate-400 uppercase">Bounties Pool</div>
            <div className="text-lg font-bold text-slate-900 mt-1 tabular-nums">${event.totalPrizePool.toLocaleString()}</div>
            <div className="text-[10px] text-amber-700 font-semibold">{event.prizes.length} prizes</div>
          </div>
        </div>
      </div>

      {/* Two-Column Utility: Algorithmic Balancer & CSV Export Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Algorithmic Judge Assignment Studio */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                Algorithmic Load Balancer
              </h2>
              <p className="text-xs text-slate-500">
                Maps submissions across judges with strict conflict-of-interest exclusion.
              </p>
            </div>
            <span className="text-[10px] font-mono bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-semibold">
              Conflict-Aware
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-md border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-semibold text-slate-700 font-mono">Target Quota:</span>
              <select
                value={reviewsPerProject}
                onChange={(e) => setReviewsPerProject(Number(e.target.value))}
                className="bg-white border border-slate-300 rounded px-3 py-1.5 font-mono text-xs cursor-pointer focus:ring-1 focus:ring-slate-800 focus:outline-hidden"
              >
                <option value={2}>2 Reviews / Project</option>
                <option value={3}>3 Reviews / Project (Default)</option>
                <option value={4}>4 Reviews / Project</option>
              </select>
            </div>

            <button
              onClick={handleRunAssignment}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-bold text-xs font-mono transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Dispatch Algorithmic Allocation</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-mono pt-1">
            Status: <span className="text-slate-900 font-bold">{assignments.length}</span> assignments active across <span className="text-slate-900 font-bold">{judges.length}</span> judges.
          </div>
        </div>

        {/* Data Pipeline & CSV Exporters */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                Data Pipeline & Archiving
              </h2>
              <p className="text-xs text-slate-500">
                RFC 4180 compliant CSV exports for external compliance audits and spreadsheets.
              </p>
            </div>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
              RFC 4180
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <button
              onClick={onExportSubmissionsCSV}
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 font-mono">Submissions</span>
                <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900" />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Teams, repos, tech stacks</p>
            </button>

            <button
              onClick={onExportScoresCSV}
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 font-mono">Raw Scores</span>
                <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900" />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Rubric scores, judge notes</p>
            </button>

            <button
              onClick={onExportLeaderboardCSV}
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 font-mono">Leaderboard</span>
                <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900" />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Normalized Z-scores, ranks</p>
            </button>
          </div>

          <p className="text-[10px] font-mono text-slate-400 pt-1">
            All CSV streams generate in-memory and download directly without external network latency.
          </p>
        </div>
      </div>

      {/* Judging Rubric Configuration Matrix */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
              Judging Rubric Configuration
            </h2>
            <p className="text-xs text-slate-500">
              Weights must sum precisely to 1.00 (100%). Evaluated in real-time by the normalization engine.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200 font-bold">
              Total Weight: {(rubric.criteria.reduce((a, b) => a + b.weight, 0) * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {rubric.criteria.map((crit) => (
            <div key={crit.id} className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-md space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs truncate">{crit.name}</span>
                <span className="font-mono text-xs font-bold text-slate-900 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                  {(crit.weight * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{crit.description}</p>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-200/60">
                <span>0 - {crit.maxPoints} pts</span>
                <span>{crit.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submissions & Evaluation Coverage Ledger */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
              Submissions & Coverage Table
            </h2>
            <p className="text-xs text-slate-500">Live inventory of team project drafts and review quotas</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-slate-50 text-xs font-mono">
              <button
                onClick={() => setTableFilter('all')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${tableFilter === 'all' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
              >
                All ({submissions.length})
              </button>
              <button
                onClick={() => setTableFilter('submitted')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${tableFilter === 'submitted' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Submitted ({submittedCount})
              </button>
              <button
                onClick={() => setTableFilter('draft')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${tableFilter === 'draft' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Drafts ({submissions.length - submittedCount})
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
          <table className="w-full text-left text-xs min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 font-mono text-[11px] text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Project Title</th>
                <th className="py-2.5 px-3">Team</th>
                <th className="py-2.5 px-3">Track</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Evaluation Progress</th>
                <th className="py-2.5 px-3 text-right">Links</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredSubmissions.map((sub) => {
                const team = teams.find((t) => t.id === sub.teamId);
                const subAssignments = assignments.filter((a) => a.submissionId === sub.id);
                const completed = subAssignments.filter((a) => a.status === 'completed').length;
                return (
                  <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900 font-sans max-w-[220px] truncate">
                      {sub.title}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-sans">{team ? team.name : 'Unknown Team'}</td>
                    <td className="py-3 px-3 text-[11px] text-slate-500">{sub.trackId}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        sub.status === 'submitted'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sub.status === 'submitted' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{completed}</span>
                        <span className="text-slate-400">/</span>
                        <span>{subAssignments.length}</span>
                        <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden ml-1">
                          <div
                            className="bg-slate-900 h-full rounded-full"
                            style={{ width: `${subAssignments.length > 0 ? (completed / subAssignments.length) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {sub.repoUrl && (
                        <a
                          href={sub.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-slate-900 hover:underline text-[11px] font-semibold"
                        >
                          <span>VCS</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
