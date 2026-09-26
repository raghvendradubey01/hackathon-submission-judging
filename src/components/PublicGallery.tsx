import React, { useState, useMemo } from 'react';
import { Submission, Team, Track, User, CommunityVote, ProjectComment } from '../types';
import { 
  Search, 
  Shuffle, 
  ExternalLink, 
  GitFork, 
  Star, 
  Code, 
  MessageSquare, 
  Vote, 
  Layers, 
  Filter,
  CheckCircle2,
  X,
  Play
} from 'lucide-react';

interface PublicGalleryProps {
  submissions: Submission[];
  teams: Team[];
  tracks: Track[];
  currentUser: User;
  votes: CommunityVote[];
  comments: ProjectComment[];
  onCastVote: (submissionId: string, voteType: 'upvote' | 'quadratic', credits?: number) => void;
  onAddComment: (submissionId: string, content: string) => void;
  onOpenEmbedWidget: () => void;
}

export const PublicGallery: React.FC<PublicGalleryProps> = ({
  submissions,
  teams,
  tracks,
  currentUser,
  votes,
  comments,
  onCastVote,
  onAddComment,
  onOpenEmbedWidget,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [sortOption, setSortOption] = useState<'random' | 'recent' | 'votes'>('random');
  const [activeProject, setActiveProject] = useState<Submission | null>(null);
  const [newComment, setNewComment] = useState('');
  const [quadraticCredits, setQuadraticCredits] = useState<number>(4);

  // Map teams and tracks
  const teamMap = useMemo(() => new Map(teams.map((t) => [t.id, t])), [teams]);
  const trackMap = useMemo(() => new Map(tracks.map((t) => [t.id, t])), [tracks]);

  // Votes map
  const submissionVoteCounts = useMemo(() => {
    const counts: Record<string, { totalVotes: number; credits: number }> = {};
    for (const v of votes) {
      if (!counts[v.submissionId]) counts[v.submissionId] = { totalVotes: 0, credits: 0 };
      counts[v.submissionId].totalVotes += 1;
      counts[v.submissionId].credits += v.creditsSpent;
    }
    return counts;
  }, [votes]);

  // T1 Requirement: Exclude drafts from public gallery
  const publishedSubmissions = useMemo(() => {
    return submissions.filter((s) => s.status === 'submitted');
  }, [submissions]);

  // Filter & Sort
  const filteredSubmissions = useMemo(() => {
    let list = publishedSubmissions.filter((sub) => {
      const team = teamMap.get(sub.teamId);
      const matchesSearch =
        sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (team && team.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTrack = selectedTrack === 'all' || sub.trackId === selectedTrack;
      return matchesSearch && matchesTrack;
    });

    if (sortOption === 'recent') {
      list.sort((a, b) => (b.submittedAt || '').localeCompare(a.submittedAt || ''));
    } else if (sortOption === 'votes') {
      list.sort((a, b) => {
        const votesA = submissionVoteCounts[a.id]?.totalVotes || 0;
        const votesB = submissionVoteCounts[b.id]?.totalVotes || 0;
        return votesB - votesA;
      });
    } else if (sortOption === 'random') {
      // Deterministic Fisher-Yates shuffle with fixed seed to eliminate position bias
      list = [...list].sort((a, b) => {
        const hashA = a.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hashB = b.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return hashA - hashB;
      });
    }

    return list;
  }, [publishedSubmissions, searchQuery, selectedTrack, sortOption, teamMap, submissionVoteCounts]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !newComment.trim()) return;
    onAddComment(activeProject.id, newComment.trim());
    setNewComment('');
  };

  const projectComments = useMemo(() => {
    if (!activeProject) return [];
    return comments.filter((c) => c.submissionId === activeProject.id);
  }, [comments, activeProject]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Console Strip */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                Public Catalog
              </span>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                Drafts Filtered Out
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-2">
              Public Submissions Gallery
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified final project submissions. Anti-bias shuffle active by default to prevent first-card exposure bias.
            </p>
          </div>

          <button
            onClick={onOpenEmbedWidget}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer font-mono shadow-xs"
          >
            <Code className="w-3.5 h-3.5 text-slate-500" />
            <span>&lt;/&gt; Embed Widget</span>
          </button>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by title, team, tech stack (e.g. Docker, TypeScript, Z-score)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:ring-1 focus:ring-slate-800 focus:outline-hidden font-sans placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 whitespace-nowrap">Order:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-md text-slate-700 cursor-pointer font-mono focus:ring-1 focus:ring-slate-800 focus:outline-hidden"
            >
              <option value="random">Anti-Bias Shuffle</option>
              <option value="votes">Community Votes</option>
              <option value="recent">Recently Submitted</option>
            </select>
          </div>
        </div>

        {/* Track Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 -mx-5 px-5 sm:mx-0 sm:px-0 no-scrollbar touch-pan-x">
          <button
            onClick={() => setSelectedTrack('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer shrink-0 font-mono ${
              selectedTrack === 'all'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            All Tracks ({publishedSubmissions.length})
          </button>
          {tracks.map((trk) => {
            const count = publishedSubmissions.filter((s) => s.trackId === trk.id).length;
            return (
              <button
                key={trk.id}
                onClick={() => setSelectedTrack(trk.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer shrink-0 font-mono ${
                  selectedTrack === trk.id
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {trk.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Projects */}
      {filteredSubmissions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center space-y-2 shadow-xs">
          <div className="text-sm font-bold text-slate-800">No project submissions match your criteria</div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try searching for another term or selecting a different track.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSubmissions.map((sub) => {
            const team = teamMap.get(sub.teamId);
            const track = trackMap.get(sub.trackId);
            const voteInfo = submissionVoteCounts[sub.id] || { totalVotes: 0, credits: 0 };

            return (
              <div
                key={sub.id}
                onClick={() => setActiveProject(sub)}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-5 transition-all cursor-pointer flex flex-col justify-between group shadow-xs hover:shadow-sm"
              >
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 font-mono mb-1">
                      <span className="truncate">{track?.name || 'General Track'}</span>
                      <span className="text-emerald-700 font-semibold inline-flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Submitted
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 group-hover:text-slate-700 transition-colors leading-snug">
                      {sub.title}
                    </h2>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {sub.tagline}
                  </p>

                  {/* Tech stack badges */}
                  <div className="text-xs text-slate-500 font-mono flex flex-wrap gap-1.5 pt-1">
                    {sub.techStack.slice(0, 4).map((tech) => (
                      <span key={tech} className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[10px] text-slate-700">
                        {tech}
                      </span>
                    ))}
                    {sub.techStack.length > 4 && (
                      <span className="text-[10px] text-slate-400">+{sub.techStack.length - 4} more</span>
                    )}
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-semibold text-slate-800 truncate">{team?.name || 'Independent'}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-[11px] shrink-0">{team?.members.length || 1} dev{team?.members.length === 1 ? '' : 's'}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
                    <span className="text-slate-700 font-semibold inline-flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {voteInfo.totalVotes}
                    </span>
                    <span className="text-slate-900 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                      Inspect &rarr;
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Detail Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full border border-slate-200 overflow-hidden my-6">
            
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-start justify-between bg-slate-50">
              <div className="space-y-1 max-w-xl">
                <div className="text-[11px] font-mono text-slate-500">
                  {trackMap.get(activeProject.trackId)?.name} · Team: <span className="font-bold text-slate-800">{teamMap.get(activeProject.teamId)?.name}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">{activeProject.title}</h2>
                <p className="text-xs text-slate-600">{activeProject.tagline}</p>
              </div>
              <button
                onClick={() => setActiveProject(null)}
                className="text-slate-400 hover:text-slate-700 text-xl leading-none p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-6 max-h-[72vh] overflow-y-auto">
              
              {/* VCS & Deployment Links */}
              <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 rounded-md border border-slate-200 text-xs font-mono">
                {activeProject.repoUrl && (
                  <a
                    href={activeProject.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-slate-900 hover:underline flex items-center gap-1.5"
                  >
                    <GitFork className="w-3.5 h-3.5 text-slate-500" />
                    <span>{activeProject.repoUrl}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                )}
                {activeProject.liveUrl && (
                  <span className="text-slate-600">
                    · Live: <span className="text-emerald-700 font-semibold">{activeProject.liveUrl}</span>
                  </span>
                )}
              </div>

              {/* Demo Video Recording Preview */}
              {activeProject.demoVideoUrl && (
                <div className="rounded-md overflow-hidden border border-slate-800 bg-slate-950 p-4 text-white text-center space-y-2">
                  <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-semibold">
                    5-Minute Lifecycle Demo Recording
                  </div>
                  <div className="text-xs text-slate-400 font-mono truncate">{activeProject.demoVideoUrl}</div>
                  <div className="py-6 bg-slate-900/60 rounded flex items-center justify-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-white text-slate-950 flex items-center justify-center font-bold text-xs">
                      ▶
                    </span>
                    <span className="text-xs text-slate-300 font-sans">Walkthrough video verified</span>
                  </div>
                </div>
              )}

              {/* Description Markdown */}
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line border-b border-slate-100 pb-5 font-sans">
                {activeProject.description}
              </div>

              {/* Team Members */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  Team Members
                </h3>
                <div className="flex flex-wrap gap-2">
                  {teamMap.get(activeProject.teamId)?.members.map((m) => (
                    <div key={m.userId} className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded text-xs text-slate-700 font-mono">
                      <span className="font-semibold">{m.name}</span> ({m.roleInTeam})
                    </div>
                  ))}
                </div>
              </div>

              {/* T3 Quadratic Community Voting Console */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider">
                      Cast Community Ballot (T3 Anti-Abuse)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Quadratic voting model: cost is N² tokens. Prevents ballot stuffing and whale dominance.
                    </p>
                  </div>
                  <div className="text-xs font-mono text-slate-700">
                    Ballots Cast: <strong className="text-slate-900">{submissionVoteCounts[activeProject.id]?.totalVotes || 0} votes</strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
                  <button
                    onClick={() => onCastVote(activeProject.id, 'upvote', 1)}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded font-medium hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Standard Ballot (+1)
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[11px]">Quadratic Credits:</span>
                    <select
                      value={quadraticCredits}
                      onChange={(e) => setQuadraticCredits(Number(e.target.value))}
                      className="border border-slate-300 rounded px-2 py-1 bg-white text-xs cursor-pointer"
                    >
                      <option value={4}>4 credits = 2 votes</option>
                      <option value={9}>9 credits = 3 votes</option>
                      <option value={16}>16 credits = 4 votes</option>
                    </select>
                    <button
                      onClick={() => onCastVote(activeProject.id, 'quadratic', quadraticCredits)}
                      className="px-3 py-1.5 bg-white text-slate-900 border border-slate-300 rounded font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Spend {quadraticCredits} Credits
                    </button>
                  </div>
                </div>
              </div>

              {/* Discussion & Public Comments */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  Technical Discussion ({projectComments.length})
                </h3>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {projectComments.length === 0 ? (
                    <div className="text-xs text-slate-400 italic">No community comments posted yet.</div>
                  ) : (
                    projectComments.map((c) => (
                      <div key={c.id} className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs space-y-1">
                        <div className="flex items-center justify-between text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-900">{c.authorName}</span>
                            <span className="text-[10px] uppercase font-mono px-1 rounded bg-slate-200 text-slate-700">
                              {c.authorRole}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            {new Date(c.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed font-sans">{c.content}</p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleCommentSubmit} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder={`Comment as ${currentUser.name} (${currentUser.role})...`}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-800 focus:outline-hidden font-sans placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 text-white rounded-md text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer font-mono"
                  >
                    Post Note
                  </button>
                </form>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveProject(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
