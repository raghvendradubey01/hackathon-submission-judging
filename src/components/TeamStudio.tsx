import React, { useState } from 'react';
import { User, Team, Submission, Track, HackathonEvent } from '../types';
import { 
  Users, 
  Copy, 
  Check, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  FileCode2, 
  Save, 
  Send,
  ExternalLink,
  GitFork,
  LogOut,
  UserPlus
} from 'lucide-react';

interface TeamStudioProps {
  currentUser: User;
  teams: Team[];
  submissions: Submission[];
  tracks: Track[];
  event: HackathonEvent;
  onCreateTeam: (name: string, tagline: string) => { success: boolean; message?: string };
  onJoinTeam: (inviteCode: string) => { success: boolean; message: string };
  onLeaveTeam: (teamId: string) => { success: boolean; message: string };
  onSaveSubmission: (submission: Partial<Submission>, asDraft: boolean) => { success: boolean; message?: string };
}

export const TeamStudio: React.FC<TeamStudioProps> = ({
  currentUser,
  teams,
  submissions,
  tracks,
  event,
  onCreateTeam,
  onJoinTeam,
  onLeaveTeam,
  onSaveSubmission,
}) => {
  const myTeam = teams.find((t) => t.members.some((m) => m.userId === currentUser.id));
  const mySubmission = myTeam ? submissions.find((s) => s.teamId === myTeam.id) : null;

  // Form states
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamTagline, setNewTeamTagline] = useState('');
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Submission form state
  const [title, setTitle] = useState(mySubmission?.title || '');
  const [tagline, setTagline] = useState(mySubmission?.tagline || '');
  const [description, setDescription] = useState(mySubmission?.description || '');
  const [trackId, setTrackId] = useState(mySubmission?.trackId || tracks[0]?.id || '');
  const [repoUrl, setRepoUrl] = useState(mySubmission?.repoUrl || '');
  const [demoVideoUrl, setDemoVideoUrl] = useState(mySubmission?.demoVideoUrl || '');
  const [liveUrl, setLiveUrl] = useState(mySubmission?.liveUrl || '');
  const [techStackInput, setTechStackInput] = useState(mySubmission?.techStack?.join(', ') || 'TypeScript, React 19, Tailwind CSS, Docker');

  // Deadline check
  const now = new Date();
  const deadline = new Date(event.schedule.submissionDeadline);
  const isPastDeadline = now > deadline;

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    const res = onCreateTeam(newTeamName.trim(), newTeamTagline.trim());
    if (res.success) {
      showToast('Team successfully created! Share your invite code with teammates.');
      setNewTeamName('');
      setNewTeamTagline('');
    } else {
      showToast(res.message || 'Failed to create team', 'error');
    }
  };

  const handleJoinTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) return;
    const res = onJoinTeam(inviteCodeInput.trim());
    if (res.success) {
      showToast(res.message);
      setInviteCodeInput('');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleSave = (asDraft: boolean) => {
    if (!myTeam) {
      showToast('Please create or join a team first.', 'error');
      return;
    }

    if (!title.trim() && !asDraft) {
      showToast('Project title is required for submission.', 'error');
      return;
    }

    if (!repoUrl.trim() && !asDraft) {
      showToast('Repository URL is required for project submission.', 'error');
      return;
    }

    const techStack = techStackInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const res = onSaveSubmission(
      {
        id: mySubmission?.id,
        teamId: myTeam.id,
        title: title.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        trackId,
        repoUrl: repoUrl.trim(),
        demoVideoUrl: demoVideoUrl.trim(),
        liveUrl: liveUrl.trim(),
        techStack,
      },
      asDraft
    );

    if (res.success) {
      showToast(asDraft ? 'Draft saved privately in local storage.' : 'Project successfully submitted for official judging!');
    } else {
      showToast(res.message || 'Submission failed.', 'error');
    }
  };

  const copyInviteToClipboard = () => {
    if (!myTeam) return;
    navigator.clipboard.writeText(myTeam.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3 rounded-md text-xs font-mono border flex items-center justify-between shadow-xs ${
            notification.type === 'success'
              ? 'bg-slate-900 text-white border-slate-800'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          <span>{notification.text}</span>
          <button onClick={() => setNotification(null)} className="cursor-pointer ml-3 text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Deadline Protocol Alert Banner */}
      <div className="p-4 rounded-lg border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-slate-500 shrink-0" />
          <div>
            <span className="font-mono uppercase text-[10px] text-slate-400 font-bold tracking-wider">
              Submission Deadline Window
            </span>
            <div className="text-xs font-bold font-mono text-slate-900">
              {new Date(event.schedule.submissionDeadline).toUTCString()}
            </div>
          </div>
        </div>
        <div className="font-mono text-xs">
          {isPastDeadline ? (
            <span className="text-rose-700 bg-rose-50 px-2.5 py-1 rounded border border-rose-200 font-semibold inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              Locked (Code Freeze Active)
            </span>
          ) : (
            <span className="text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-semibold inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Open (Edits Permitted)
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Team Formation & Management */}
        <div className="space-y-6">
          {myTeam ? (
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">My Team</span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">{myTeam.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{myTeam.tagline}</p>
              </div>

              {/* Invite Code Box */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">Invite Token:</span>
                  <button
                    onClick={copyInviteToClipboard}
                    className="inline-flex items-center gap-1 text-slate-900 hover:text-slate-700 font-mono text-[11px] font-semibold cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-sm font-extrabold text-slate-900 tracking-wider bg-white p-2 rounded border border-slate-200 text-center">
                  {myTeam.inviteCode}
                </div>
                <p className="text-[10px] text-slate-500 font-mono text-center">
                  Pass to teammates (1–4 members permitted).
                </p>
              </div>

              {/* Members Roster */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 font-mono">
                  <span>Roster ({myTeam.members.length} / {event.maxTeamSize})</span>
                  {myTeam.members.length === event.maxTeamSize && (
                    <span className="text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 text-[10px]">Full</span>
                  )}
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {myTeam.members.map((m) => (
                    <div key={m.userId} className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold font-mono text-[10px]">
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">
                            {m.name} {m.userId === currentUser.id && <span className="text-slate-400 font-normal">(You)</span>}
                          </div>
                          <div className="text-[10px] text-slate-400 capitalize font-mono">{m.roleInTeam}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to leave this team?')) {
                      onLeaveTeam(myTeam.id);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Leave Team</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Create Team Card */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <h2 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
                    Create a Team
                  </h2>
                  <p className="text-xs text-slate-500">
                    Solo hackers or teams up to 4 members.
                  </p>
                </div>
                <form onSubmit={handleCreateTeamSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Team Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Consensus Dynamics"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-800 focus:outline-hidden"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Mission Tagline</label>
                    <input
                      type="text"
                      placeholder="e.g. Statistical Z-score standardization engine"
                      value={newTeamTagline}
                      onChange={(e) => setNewTeamTagline(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-800 focus:outline-hidden"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-900 text-white rounded font-semibold hover:bg-slate-800 transition-colors cursor-pointer text-xs font-mono"
                  >
                    Register Team & Get Invite Token
                  </button>
                </form>
              </div>

              {/* Join Team Card */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <h2 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
                    Join with Invite Code
                  </h2>
                  <p className="text-xs text-slate-500">
                    Enter the token shared by your team captain.
                  </p>
                </div>
                <form onSubmit={handleJoinTeamSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Invite Code</label>
                    <input
                      type="text"
                      placeholder="e.g. FORGE-9021"
                      value={inviteCodeInput}
                      onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-mono focus:ring-1 focus:ring-slate-800 focus:outline-hidden"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-white text-slate-800 border border-slate-300 rounded font-semibold hover:bg-slate-50 transition-colors cursor-pointer text-xs font-mono"
                  >
                    Join Team
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Right 2 Columns: Project Submission Worksheet */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-slate-900">
                  Project Submission & Draft Studio
                </h2>
                <p className="text-xs text-slate-500">
                  Drafts are private; only submitted entries appear in the public gallery.
                </p>
              </div>
              {mySubmission && (
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border self-start ${
                    mySubmission.status === 'submitted'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {mySubmission.status.toUpperCase()}
                </span>
              )}
            </div>

            <div className="space-y-4 text-xs">
              {/* Title & Tagline */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Project Title *</label>
                <input
                  type="text"
                  placeholder="e.g. ConsensusMatrix: Statistical Judging Engine"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold focus:ring-1 focus:ring-slate-800 focus:outline-hidden font-sans"
                  disabled={isPastDeadline && currentUser.role === 'participant'}
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Elevator Tagline</label>
                <input
                  type="text"
                  placeholder="One-line technical summary of your submission"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-800 focus:outline-hidden font-sans"
                  disabled={isPastDeadline && currentUser.role === 'participant'}
                />
              </div>

              {/* Challenge Track */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Challenge Track</label>
                <select
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-800 focus:outline-hidden cursor-pointer font-sans"
                  disabled={isPastDeadline && currentUser.role === 'participant'}
                >
                  {tracks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} (Bounty: ₹{t.prizeAmount.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Tech Stack */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tech Stack (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. TypeScript, React 19, Tailwind CSS, Docker, PostgreSQL"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md font-mono focus:ring-1 focus:ring-slate-800 focus:outline-hidden"
                  disabled={isPastDeadline && currentUser.role === 'participant'}
                />
              </div>

              {/* URLs: Repo, Demo, Live */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">GitHub Repo URL *</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md font-mono text-xs focus:ring-1 focus:ring-slate-800 focus:outline-hidden"
                    required
                    disabled={isPastDeadline && currentUser.role === 'participant'}
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Demo Video URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={demoVideoUrl}
                    onChange={(e) => setDemoVideoUrl(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md font-mono text-xs focus:ring-1 focus:ring-slate-800 focus:outline-hidden"
                    disabled={isPastDeadline && currentUser.role === 'participant'}
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Live Endpoint URL</label>
                  <input
                    type="text"
                    placeholder="http://localhost:3000"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md font-mono text-xs focus:ring-1 focus:ring-slate-800 focus:outline-hidden"
                    disabled={isPastDeadline && currentUser.role === 'participant'}
                  />
                </div>
              </div>

              {/* Description Markdown */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Full Project Writeup (Markdown supported)
                </label>
                <textarea
                  rows={8}
                  placeholder="Detail your architecture, data model, judging engine, normalization proofs, and offline single-command startup..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md font-mono text-xs focus:ring-1 focus:ring-slate-800 focus:outline-hidden leading-relaxed"
                  disabled={isPastDeadline && currentUser.role === 'participant'}
                />
              </div>

              {/* Submission Controls */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500 font-mono">
                  {mySubmission?.updatedAt && `Last saved: ${new Date(mySubmission.updatedAt).toLocaleTimeString()}`}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSave(true)}
                    disabled={isPastDeadline && currentUser.role === 'participant'}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 rounded-md font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5 text-slate-500" />
                    <span>Save Private Draft</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSave(false)}
                    disabled={isPastDeadline && currentUser.role === 'participant'}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-md font-bold text-xs transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit for Judging &rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
