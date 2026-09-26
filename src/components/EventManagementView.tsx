import React, { useState } from 'react';
import { HackathonEvent, Track, Prize, Team, Submission, User } from '../types';
import { 
  Calendar, 
  Layers, 
  Trophy, 
  Clock, 
  Settings, 
  Plus, 
  Save, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Users, 
  FileCode2, 
  ArrowRight,
  Edit2
} from 'lucide-react';

interface EventManagementViewProps {
  currentUser: User;
  event: HackathonEvent;
  teams: Team[];
  submissions: Submission[];
  onUpdateEvent: (updated: Partial<HackathonEvent>) => { success: boolean; message: string };
  onCreateNewEvent: (newEvent: HackathonEvent) => { success: boolean; message: string };
  onNavigateTab: (tab: string) => void;
}

export const EventManagementView: React.FC<EventManagementViewProps> = ({
  currentUser,
  event,
  teams,
  submissions,
  onUpdateEvent,
  onCreateNewEvent,
  onNavigateTab,
}) => {
  const isOrganizer = currentUser.role === 'organizer' || currentUser.role === 'admin';

  // Event Edit Form States
  const [eventName, setEventName] = useState(event.name);
  const [tagline, setTagline] = useState(event.tagline);
  const [organizerName, setOrganizerName] = useState(event.organizerName);
  const [eventStatus, setEventStatus] = useState<HackathonEvent['status']>(event.status);
  const [regDeadline, setRegDeadline] = useState(event.schedule.registrationDeadline);
  const [subDeadline, setSubDeadline] = useState(event.schedule.submissionDeadline);
  const [judgingStarts, setJudgingStarts] = useState(event.schedule.judgingStarts);
  const [judgingEnds, setJudgingEnds] = useState(event.schedule.judgingEnds);
  const [winnersAnnounced, setWinnersAnnounced] = useState(event.schedule.winnersAnnounced);
  const [communityVoting, setCommunityVoting] = useState(event.communityVotingEnabled);
  const [resultsEmbargoed, setResultsEmbargoed] = useState(event.resultsEmbargoed);

  // New Event Modal State
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('Campus Hackathon 2026');
  const [newEventTagline, setNewEventTagline] = useState('Engineering solutions for campus automation & sustainability');

  // Notification Toast
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onUpdateEvent({
      name: eventName.trim(),
      tagline: tagline.trim(),
      organizerName: organizerName.trim(),
      status: eventStatus,
      communityVotingEnabled: communityVoting,
      resultsEmbargoed,
      schedule: {
        registrationDeadline: regDeadline,
        submissionDeadline: subDeadline,
        judgingStarts,
        judgingEnds,
        winnersAnnounced,
      },
    });
    showToast(res.message);
  };

  const handleCreateNewEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `evt-${Date.now()}`;
    const newEvt: HackathonEvent = {
      id,
      name: newEventTitle.trim(),
      edition: '2026.1',
      tagline: newEventTagline.trim(),
      organizerName: currentUser.organization || currentUser.name,
      schedule: {
        registrationDeadline: new Date(Date.now() + 7 * 86400000).toISOString(),
        submissionDeadline: new Date(Date.now() + 14 * 86400000).toISOString(),
        judgingStarts: new Date(Date.now() + 14 * 86400000 + 3600000).toISOString(),
        judgingEnds: new Date(Date.now() + 21 * 86400000).toISOString(),
        winnersAnnounced: new Date(Date.now() + 22 * 86400000).toISOString(),
      },
      tracks: [
        { id: `trk-1-${id}`, name: 'General Innovation', description: 'Open track for high-impact software solutions.', prizeAmount: 5000 },
        { id: `trk-2-${id}`, name: 'Developer Tooling', description: 'Libraries, CLI tools, and infrastructure utilities.', prizeAmount: 3000 },
        { id: `trk-3-${id}`, name: 'User Experience & Design', description: 'Exceptional human interface design and ergonomics.', prizeAmount: 2000 },
      ],
      prizes: [
        { id: `prz-1-${id}`, title: '1st Place Winner', amount: 5000, rank: 1, description: 'Overall champion of the hackathon.' },
        { id: `prz-2-${id}`, title: '2nd Place', amount: 3000, rank: 2, description: 'First runner-up.' },
        { id: `prz-3-${id}`, title: '3rd Place', amount: 2000, rank: 3, description: 'Second runner-up.' },
        { id: `prz-4-${id}`, title: 'Best Technical Writeup', amount: 1000, description: 'Highest documentation quality.' },
        { id: `prz-5-${id}`, title: 'Community Choice', amount: 500, description: 'Voted by peers via quadratic ballot.' },
      ],
      totalPrizePool: 11500,
      status: 'open',
      communityVotingEnabled: true,
      resultsEmbargoed: true,
      minTeamSize: 1,
      maxTeamSize: 4,
    };

    const res = onCreateNewEvent(newEvt);
    setIsCreatingEvent(false);
    showToast(res.message);
  };

  const submittedSubmissions = submissions.filter((s) => s.status === 'submitted');

  return (
    <div className="space-y-6 pb-16">
      {/* Toast */}
      {notification && (
        <div className="p-3 bg-slate-900 text-white rounded-md text-xs font-mono flex items-center justify-between shadow-md">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="cursor-pointer ml-3 text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Header Context Strip */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                Event Governance
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                ID: {event.id}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-2">
              {event.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Host: <span className="font-semibold text-slate-700">{event.organizerName}</span> · Tagline: "{event.tagline}"
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isOrganizer && (
              <button
                onClick={() => setIsCreatingEvent(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold font-mono cursor-pointer transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Event</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Operational Metrics for Active Event */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs font-mono">
          <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
            <div className="text-[10px] text-slate-400 uppercase">Teams Registered</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{teams.length}</div>
            <div className="text-[10px] text-slate-500">1–4 members/team</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
            <div className="text-[10px] text-slate-400 uppercase">Submitted Projects</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{submittedSubmissions.length}</div>
            <div className="text-[10px] text-emerald-700">{submissions.length - submittedSubmissions.length} drafts in progress</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
            <div className="text-[10px] text-slate-400 uppercase">Challenge Tracks</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{event.tracks.length}</div>
            <div className="text-[10px] text-slate-500">Bounties configured</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
            <div className="text-[10px] text-slate-400 uppercase">Prize Bounties</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">${event.totalPrizePool.toLocaleString()}</div>
            <div className="text-[10px] text-slate-500">{event.prizes.length} prize tiers</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Event Editor & Track/Prize Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Event Parameters Form */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
                Event Parameters & Lifecycle
              </h2>
              <p className="text-xs text-slate-500">Configure event details, UTC deadlines, and privacy controls.</p>
            </div>
            {!isOrganizer && (
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-500">
                View Only (Organizer Role Required)
              </span>
            )}
          </div>

          <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Event Name</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  disabled={!isOrganizer}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-800 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Host Organization</label>
                <input
                  type="text"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  disabled={!isOrganizer}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-800 focus:outline-hidden"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Event Tagline / Mission</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                disabled={!isOrganizer}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-800 focus:outline-hidden"
              />
            </div>

            {/* Schedule Deadlines */}
            <div className="pt-2 border-t border-slate-100">
              <h3 className="font-bold text-slate-800 font-mono text-xs uppercase tracking-wider mb-2">
                UTC Deadlines & Evaluation Window
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Registration Cutoff (UTC)</label>
                  <input
                    type="text"
                    value={regDeadline}
                    onChange={(e) => setRegDeadline(e.target.value)}
                    disabled={!isOrganizer}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Submission Deadline (Code Freeze)</label>
                  <input
                    type="text"
                    value={subDeadline}
                    onChange={(e) => setSubDeadline(e.target.value)}
                    disabled={!isOrganizer}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Judging Commences (UTC)</label>
                  <input
                    type="text"
                    value={judgingStarts}
                    onChange={(e) => setJudgingStarts(e.target.value)}
                    disabled={!isOrganizer}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Winners Announcement (UTC)</label>
                  <input
                    type="text"
                    value={winnersAnnounced}
                    onChange={(e) => setWinnersAnnounced(e.target.value)}
                    disabled={!isOrganizer}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={resultsEmbargoed}
                    onChange={(e) => setResultsEmbargoed(e.target.checked)}
                    disabled={!isOrganizer}
                    className="rounded accent-slate-900"
                  />
                  <span>Results Embargo</span>
                </label>
                <p className="text-[10px] text-slate-500 mt-1">Conceal scores until official publication.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={communityVoting}
                    onChange={(e) => setCommunityVoting(e.target.checked)}
                    disabled={!isOrganizer}
                    className="rounded accent-slate-900"
                  />
                  <span>Quadratic Voting</span>
                </label>
                <p className="text-[10px] text-slate-500 mt-1">Enable community quadratic token ballot.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <div className="font-semibold text-slate-800">Lifecycle Phase</div>
                <select
                  value={eventStatus}
                  onChange={(e) => setEventStatus(e.target.value as any)}
                  disabled={!isOrganizer}
                  className="w-full mt-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-semibold"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="open">Open (Submissions Active)</option>
                  <option value="judging">Judging (In Review)</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {isOrganizer && (
              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-bold font-mono cursor-pointer transition-colors shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Event Configuration</span>
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Right 1 Col: Challenge Tracks & Prize Tiers */}
        <div className="space-y-6">
          {/* Tracks Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                Challenge Tracks ({event.tracks.length})
              </h2>
              <Layers className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="space-y-2 text-xs">
              {event.tracks.map((trk) => (
                <div key={trk.id} className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{trk.name}</span>
                    <span className="font-mono text-[11px] font-bold text-slate-900 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                      ${trk.prizeAmount.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{trk.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Prizes Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                Prize Allocations (${event.totalPrizePool.toLocaleString()})
              </h2>
              <Trophy className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {event.prizes.map((prz) => (
                <div key={prz.id} className="py-2 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">{prz.title}</div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">{prz.description}</div>
                  </div>
                  <div className="font-mono font-bold text-slate-900 tabular-nums ml-2 shrink-0">
                    ${prz.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Create New Event */}
      {isCreatingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-sm font-bold text-slate-900 font-mono">Create New Hackathon Event</h2>
              <button onClick={() => setIsCreatingEvent(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateNewEventSubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Event Name</label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g. Campus Hackathon 2026"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-semibold focus:ring-1 focus:ring-slate-800 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mission / Tagline</label>
                <input
                  type="text"
                  value={newEventTagline}
                  onChange={(e) => setNewEventTagline(e.target.value)}
                  placeholder="e.g. Engineering solutions for sustainability"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-800 focus:outline-hidden"
                  required
                />
              </div>

              <p className="text-[11px] text-slate-500 pt-1">
                Will bootstrap initial tracks, prizes, and schedule templates for immediate participant registration.
              </p>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingEvent(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold font-mono text-white bg-slate-900 rounded hover:bg-slate-800 cursor-pointer"
                >
                  Bootstrap Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
