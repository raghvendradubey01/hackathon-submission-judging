import React from 'react';
import { User, Submission, Team, HackathonEvent } from '../types';
import { 
  Users, 
  FileCode2, 
  Clock, 
  ShieldCheck, 
  ExternalLink, 
  GitFork, 
  ArrowRight,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ParticipantDashboardProps {
  currentUser: User;
  event: HackathonEvent;
  teams: Team[];
  submissions: Submission[];
  onNavigateTab: (tab: string) => void;
}

export const ParticipantDashboard: React.FC<ParticipantDashboardProps> = ({
  currentUser,
  event,
  teams,
  submissions,
  onNavigateTab,
}) => {
  const myTeam = teams.find((t) => t.members.some((m) => m.userId === currentUser.id));
  const mySubmission = myTeam ? submissions.find((s) => s.teamId === myTeam.id) : null;

  const now = new Date();
  const subDeadline = new Date(event.schedule.submissionDeadline);
  const isPastDeadline = now > subDeadline;
  const hoursRemaining = Math.max(0, Math.floor((subDeadline.getTime() - now.getTime()) / (1000 * 60 * 60)));

  return (
    <div className="space-y-6 pb-12">
      {/* Participant Workspace Context */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                Participant Dashboard
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Account: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.email})
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-2">
              My Hackathon Hub
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Active Organization: <span className="font-semibold text-slate-800">{currentUser.organization}</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigateTab('submissions')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold font-mono transition-colors cursor-pointer shadow-xs"
            >
              <span>{mySubmission ? 'Manage Submission' : 'Create Submission'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 6 Required Core Telemetry Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-5 mt-5 border-t border-slate-100 text-xs font-mono">
          
          {/* 1. My Events */}
          <div className="p-3 bg-slate-50/70 rounded-md border border-slate-200">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>My Events</span>
              <Calendar className="w-3 h-3 text-slate-400" />
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1 truncate" title={event.name}>
              {event.name}
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5 uppercase">
              {event.status}
            </div>
          </div>

          {/* 2. My Team */}
          <div className="p-3 bg-slate-50/70 rounded-md border border-slate-200">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>My Team</span>
              <Users className="w-3 h-3 text-slate-400" />
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1 truncate">
              {myTeam ? myTeam.name : 'No Team'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {myTeam ? `${myTeam.members.length} / ${event.maxTeamSize} members` : 'Join code required'}
            </div>
          </div>

          {/* 3. My Projects */}
          <div className="p-3 bg-slate-50/70 rounded-md border border-slate-200">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>My Project</span>
              <FileCode2 className="w-3 h-3 text-slate-400" />
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1 truncate">
              {mySubmission ? mySubmission.title : 'None Started'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {mySubmission ? mySubmission.trackId : 'Unassigned track'}
            </div>
          </div>

          {/* 4. Submission Status */}
          <div className="p-3 bg-slate-50/70 rounded-md border border-slate-200">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>Status</span>
              <CheckCircle2 className="w-3 h-3 text-slate-400" />
            </div>
            <div className="text-xs font-bold mt-1">
              {mySubmission ? (
                <span className={mySubmission.status === 'submitted' ? 'text-emerald-700' : 'text-amber-700'}>
                  {mySubmission.status.toUpperCase()}
                </span>
              ) : (
                <span className="text-slate-400">PENDING</span>
              )}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {mySubmission?.repoUrl ? 'VCS Linked' : 'Repo pending'}
            </div>
          </div>

          {/* 5. Upcoming Deadlines */}
          <div className="p-3 bg-slate-50/70 rounded-md border border-slate-200">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>Code Freeze</span>
              <Clock className="w-3 h-3 text-slate-400" />
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1">
              {isPastDeadline ? 'Locked' : `${hoursRemaining}h remaining`}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Strict UTC deadline
            </div>
          </div>

          {/* 6. Judging Status */}
          <div className="p-3 bg-slate-50/70 rounded-md border border-slate-200">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>Judging Stage</span>
              <ShieldCheck className="w-3 h-3 text-slate-400" />
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1">
              {event.status === 'judging' ? 'Active Review' : event.status}
            </div>
            <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
              {event.resultsEmbargoed ? 'Embargo Active' : 'Public Results'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Project Summary & Team Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Project Submission Status Card */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                Project Information & Repository
              </h2>
              <p className="text-xs text-slate-500">
                Drafts are kept strictly private; only finalized submissions appear in the public catalog.
              </p>
            </div>
            {mySubmission && (
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                mySubmission.status === 'submitted'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {mySubmission.status}
              </span>
            )}
          </div>

          {mySubmission ? (
            <div className="space-y-4 text-xs">
              <div>
                <h3 className="text-base font-bold text-slate-900">{mySubmission.title}</h3>
                <p className="text-slate-600 mt-1 leading-relaxed">{mySubmission.tagline}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-md border border-slate-200 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <GitFork className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-500">Repository:</span>
                    <a 
                      href={mySubmission.repoUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-slate-900 font-semibold hover:underline flex items-center gap-1"
                    >
                      {mySubmission.repoUrl}
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-600">
                    {mySubmission.trackId}
                  </span>
                </div>

                <div className="pt-1 text-[11px] text-slate-600">
                  <span className="text-slate-400">Tech Stack:</span> {mySubmission.techStack.join(', ')}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => onNavigateTab('submissions')}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold cursor-pointer transition-colors font-mono"
                >
                  Edit Project Writeup &rarr;
                </button>
                <button
                  onClick={() => onNavigateTab('gallery')}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-md text-xs font-semibold cursor-pointer transition-colors font-mono"
                >
                  View in Gallery
                </button>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-xs text-slate-500 border border-dashed border-slate-300 rounded-lg space-y-3">
              <FileCode2 className="w-8 h-8 text-slate-400 mx-auto" />
              <div>
                <p className="font-semibold text-slate-800 text-sm">No project recorded yet</p>
                <p className="text-slate-500 text-xs mt-0.5">
                  Form a team or enter your invite code to begin your project submission.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('teams')}
                className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-md text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 font-mono"
              >
                <span>Open Team Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right 1 Col: Team Roster Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                Team Roster
              </h2>
              <p className="text-xs text-slate-500">1–4 members permitted</p>
            </div>
            {myTeam && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                {myTeam.inviteCode}
              </span>
            )}
          </div>

          {myTeam ? (
            <div className="space-y-3 text-xs">
              <div className="font-bold text-slate-900">{myTeam.name}</div>
              <div className="divide-y divide-slate-100">
                {myTeam.members.map((m) => (
                  <div key={m.userId} className="py-2 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-800">
                        {m.name} {m.userId === currentUser.id && <span className="text-slate-400 font-normal">(You)</span>}
                      </div>
                      <div className="text-[10px] text-slate-400 capitalize font-mono">{m.roleInTeam}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => onNavigateTab('teams')}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold font-mono text-center rounded transition-colors cursor-pointer"
                >
                  Manage Team & Invite Members
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500 space-y-2">
              <Users className="w-6 h-6 text-slate-400 mx-auto" />
              <p>You have not joined or formed a team for this event yet.</p>
              <button
                onClick={() => onNavigateTab('teams')}
                className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-mono font-semibold"
              >
                Join or Create Team
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
