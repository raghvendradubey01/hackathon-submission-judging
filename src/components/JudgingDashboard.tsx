import React, { useState } from 'react';
import { User, JudgeAssignment, Submission, Rubric, Score, PairwiseComparison, Team } from '../types';
import { calculateWeightedTotal } from '../services/scoringEngine';
import { 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Scale, 
  Cpu, 
  Sliders, 
  Award, 
  AlertCircle,
  FileText,
  GitFork,
  ArrowRight,
  BarChart2,
  Percent
} from 'lucide-react';

interface JudgingDashboardProps {
  currentUser: User;
  assignments: JudgeAssignment[];
  submissions: Submission[];
  rubric: Rubric;
  scores: Score[];
  pairwiseMatches: PairwiseComparison[];
  teams: Team[];
  onSubmitScore: (submissionId: string, criterionScores: Record<string, number>, feedbackNote: string) => { success: boolean; message?: string };
  onRecordPairwiseMatch: (subAId: string, subBId: string, winnerId: string, reason?: string) => void;
  onRunAlgorithmicAssignment: () => { success: boolean; message: string };
}

export const JudgingDashboard: React.FC<JudgingDashboardProps> = ({
  currentUser,
  assignments,
  submissions,
  rubric,
  scores,
  pairwiseMatches,
  teams,
  onSubmitScore,
  onRecordPairwiseMatch,
  onRunAlgorithmicAssignment,
}) => {
  const isJudge = currentUser.role === 'judge';

  const subMap = new Map(submissions.map((s) => [s.id, s]));
  const teamMap = new Map(teams.map((t) => [t.id, t]));

  // Active Judge's Assigned Queue
  const myAssignments = isJudge
    ? assignments.filter((a) => a.judgeId === currentUser.id)
    : assignments;

  const completedAssignments = myAssignments.filter((a) => a.status === 'completed');
  const pendingAssignments = myAssignments.filter((a) => a.status === 'pending');
  const completedCount = completedAssignments.length;
  const pendingCount = pendingAssignments.length;
  const progressPct = myAssignments.length > 0 ? (completedCount / myAssignments.length) * 100 : 0;

  // Judge's personal score statistics
  const myScores = scores.filter((s) => s.judgeId === currentUser.id);
  const avgScoreGiven = myScores.length > 0
    ? myScores.reduce((acc, s) => acc + s.weightedTotal, 0) / myScores.length
    : 0;

  // Selected Submission for evaluation
  const [activeSubId, setActiveSubId] = useState<string | null>(
    myAssignments.length > 0 ? myAssignments[0].submissionId : null
  );

  // Rubric Scores State for active submission
  const currentScoreRecord = scores.find(
    (s) => s.judgeId === currentUser.id && s.submissionId === activeSubId
  );

  const [criterionScores, setCriterionScores] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const crit of rubric.criteria) {
      init[crit.id] = currentScoreRecord?.criterionScores[crit.id] ?? 80;
    }
    return init;
  });

  const [feedbackNote, setFeedbackNote] = useState(currentScoreRecord?.feedbackNote || '');
  const [notification, setNotification] = useState<string | null>(null);

  // Pairwise Mode State
  const [pairwiseSubA, setPairwiseSubA] = useState<string>(submissions[0]?.id || '');
  const [pairwiseSubB, setPairwiseSubB] = useState<string>(submissions[1]?.id || '');
  const [pairwiseReason, setPairwiseReason] = useState('');
  const [activeTab, setActiveTab] = useState<'rubric' | 'pairwise'>('rubric');

  const liveWeightedTotal = calculateWeightedTotal(criterionScores, rubric);

  const handleSelectSubmission = (subId: string) => {
    setActiveSubId(subId);
    const existing = scores.find((s) => s.judgeId === currentUser.id && s.submissionId === subId);
    const newCrit: Record<string, number> = {};
    for (const crit of rubric.criteria) {
      newCrit[crit.id] = existing?.criterionScores[crit.id] ?? 80;
    }
    setCriterionScores(newCrit);
    setFeedbackNote(existing?.feedbackNote || '');
  };

  const handleScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubId) return;

    const res = onSubmitScore(activeSubId, criterionScores, feedbackNote.trim());
    if (res.success) {
      setNotification(`Score successfully recorded (${liveWeightedTotal.toFixed(2)}/100)!`);
      setTimeout(() => setNotification(null), 3000);
    } else {
      setNotification(res.message || 'Scoring error');
    }
  };

  const handlePairwiseVote = (winnerId: string) => {
    if (!pairwiseSubA || !pairwiseSubB || pairwiseSubA === pairwiseSubB) {
      alert('Please select two distinct projects to compare.');
      return;
    }
    onRecordPairwiseMatch(pairwiseSubA, pairwiseSubB, winnerId, pairwiseReason.trim());
    setNotification('Pairwise outcome recorded into Bradley-Terry solver matrix!');
    setPairwiseReason('');
    setTimeout(() => setNotification(null), 3000);
  };

  const activeSub = activeSubId ? subMap.get(activeSubId) : null;
  const activeTeam = activeSub ? teamMap.get(activeSub.teamId) : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3 bg-slate-900 text-white border border-slate-700 rounded-md text-xs font-mono flex items-center justify-between shadow-md">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white cursor-pointer ml-3">✕</button>
        </div>
      )}

      {/* Header Context Strip */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                Judge Dashboard
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Evaluator: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.organization})
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-2">
              Judging Queue & Scoring Console
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Backend role isolation guarantees unsubmitted scores and peer reviews remain strictly hidden until embargo lift.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-slate-50 text-xs font-mono">
              <button
                onClick={() => setActiveTab('rubric')}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  activeTab === 'rubric' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Weighted Rubric
              </button>
              <button
                onClick={() => setActiveTab('pairwise')}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  activeTab === 'pairwise' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pairwise Mode
              </button>
            </div>
          </div>
        </div>

        {/* 5 Required Judge Metric Cards: Assigned projects, Pending reviews, Completed reviews, Judging progress, Score statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-slate-100 text-xs font-mono">
          {/* 1. Assigned Projects */}
          <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
            <div className="text-[10px] text-slate-400 uppercase">Assigned Projects</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5 tabular-nums">{myAssignments.length}</div>
            <div className="text-[10px] text-slate-500">Review quota</div>
          </div>

          {/* 2. Pending Reviews */}
          <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
            <div className="text-[10px] text-slate-400 uppercase">Pending Reviews</div>
            <div className="text-lg font-bold text-amber-700 mt-0.5 tabular-nums">{pendingCount}</div>
            <div className="text-[10px] text-slate-500">Awaiting score</div>
          </div>

          {/* 3. Completed Reviews */}
          <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
            <div className="text-[10px] text-slate-400 uppercase">Completed</div>
            <div className="text-lg font-bold text-emerald-800 mt-0.5 tabular-nums">{completedCount}</div>
            <div className="text-[10px] text-slate-500">Submitted to ledger</div>
          </div>

          {/* 4. Judging Progress */}
          <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
            <div className="text-[10px] text-slate-400 uppercase">Queue Progress</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5 tabular-nums">{progressPct.toFixed(0)}%</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-slate-900 h-full rounded-full transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          {/* 5. Score Statistics */}
          <div className="p-3 bg-slate-50 rounded-md border border-slate-200 col-span-2 sm:col-span-1">
            <div className="text-[10px] text-slate-400 uppercase">Avg Score Given</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5 tabular-nums">
              {avgScoreGiven > 0 ? avgScoreGiven.toFixed(1) : '—'} <span className="text-[10px] text-slate-400 font-normal">/100</span>
            </div>
            <div className="text-[10px] text-slate-500">{myScores.length} scored projects</div>
          </div>
        </div>
      </div>

      {activeTab === 'rubric' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Assigned Queue list */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-800">
                Assigned Queue ({myAssignments.length})
              </h2>
              <span className="text-[10px] font-mono text-slate-400">Isolated</span>
            </div>

            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {myAssignments.length === 0 ? (
                <div className="text-xs text-slate-400 p-6 text-center border border-dashed border-slate-200 rounded">
                  No projects currently assigned to your queue.
                </div>
              ) : (
                myAssignments.map((asg) => {
                  const sub = subMap.get(asg.submissionId);
                  const isSelected = asg.submissionId === activeSubId;
                  const isDone = asg.status === 'completed';

                  if (!sub) return null;

                  return (
                    <button
                      key={asg.id}
                      onClick={() => handleSelectSubmission(asg.submissionId)}
                      className={`w-full p-3 rounded-md border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-slate-900 bg-slate-50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
                        <span className="flex items-center gap-1">
                          {isDone ? (
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Reviewed
                            </span>
                          ) : (
                            <span className="text-amber-700 font-semibold flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-500" /> Pending
                            </span>
                          )}
                        </span>
                        <span>{sub.trackId}</span>
                      </div>
                      <div className="font-semibold text-xs text-slate-900 leading-snug line-clamp-1">
                        {sub.title}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                        {teamMap.get(sub.teamId)?.name || 'Team'}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right 2 Columns: Evaluation Worksheet */}
          <div className="lg:col-span-2 space-y-6">
            {activeSub ? (
              <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-6">
                
                {/* Project Header Info */}
                <div className="border-b border-slate-100 pb-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>Team: <strong className="text-slate-700">{activeTeam?.name}</strong></span>
                    {activeSub.repoUrl && (
                      <a
                        href={activeSub.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-900 font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <span>GitHub VCS</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">{activeSub.title}</h2>
                  <p className="text-xs text-slate-600 leading-relaxed">{activeSub.tagline}</p>
                </div>

                {/* Rubric Evaluation Form */}
                <form onSubmit={handleScoreSubmit} className="space-y-6">
                  <div className="space-y-3.5">
                    {rubric.criteria.map((crit) => {
                      const scoreVal = criterionScores[crit.id] ?? 80;
                      return (
                        <div key={crit.id} className="p-3.5 rounded-md border border-slate-200 bg-slate-50/70 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                                <span>{crit.name}</span>
                                <span className="font-mono text-[10px] text-slate-500 font-normal px-1.5 py-0.2 bg-white rounded border border-slate-200">
                                  {(crit.weight * 100).toFixed(0)}% weight
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{crit.description}</p>
                            </div>
                            <div className="font-mono text-sm font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 tabular-nums">
                              {scoreVal} <span className="text-[10px] text-slate-400 font-normal">/ {crit.maxPoints}</span>
                            </div>
                          </div>

                          <div className="pt-1">
                            <input
                              type="range"
                              min={crit.minPoints}
                              max={crit.maxPoints}
                              value={scoreVal}
                              onChange={(e) =>
                                setCriterionScores({
                                  ...criterionScores,
                                  [crit.id]: Number(e.target.value),
                                })
                              }
                              className="w-full accent-slate-900 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                            />
                            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                              <span>0 (Deficient)</span>
                              <span>50 (Adequate)</span>
                              <span>100 (Flawless)</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Feedback Comments */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                      Technical Critique & Qualitative Notes
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Comment on architecture design, code quality, edge case handling, or documentation..."
                      value={feedbackNote}
                      onChange={(e) => setFeedbackNote(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 font-sans"
                    />
                  </div>

                  {/* Scoring Footer */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] text-slate-500 font-mono uppercase">Live Weighted Total:</div>
                      <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                        {liveWeightedTotal.toFixed(2)} <span className="text-xs font-normal text-slate-400 font-sans">/ 100 pts</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-slate-900 text-white rounded-md text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer shadow-xs inline-flex items-center justify-center gap-1.5 font-mono"
                    >
                      <span>Commit Evaluation Record</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-xs text-slate-500">
                Select a project from the left queue to evaluate.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Pairwise Comparison Mode */
        <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                Pairwise Bradley-Terry Comparison Solver
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
                Head-to-Head Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
              Head-to-head comparisons eliminate subjective numeric point-scale bias. Outcomes are iteratively computed via Minorization-Maximization (MM) to extract latent strength parameters γ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project A */}
            <div className="p-4 rounded-md border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Project Alpha</span>
                <select
                  value={pairwiseSubA}
                  onChange={(e) => setPairwiseSubA(e.target.value)}
                  className="w-full text-xs font-semibold p-2 bg-white border border-slate-300 rounded cursor-pointer font-sans"
                >
                  {submissions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {subMap.get(pairwiseSubA)?.tagline}
                </p>
              </div>
              <button
                onClick={() => handlePairwiseVote(pairwiseSubA)}
                className="w-full py-2 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer mt-2 font-mono"
              >
                Select Alpha as Superior &rarr;
              </button>
            </div>

            {/* Project B */}
            <div className="p-4 rounded-md border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Project Beta</span>
                <select
                  value={pairwiseSubB}
                  onChange={(e) => setPairwiseSubB(e.target.value)}
                  className="w-full text-xs font-semibold p-2 bg-white border border-slate-300 rounded cursor-pointer font-sans"
                >
                  {submissions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {subMap.get(pairwiseSubB)?.tagline}
                </p>
              </div>
              <button
                onClick={() => handlePairwiseVote(pairwiseSubB)}
                className="w-full py-2 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer mt-2 font-mono"
              >
                Select Beta as Superior &rarr;
              </button>
            </div>
          </div>

          {/* Historical Pairwise Ledger */}
          <div className="pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-800 mb-2">
              Recorded Pairwise Outcomes ({pairwiseMatches.length})
            </h3>
            <div className="divide-y divide-slate-100 text-xs border border-slate-200 rounded-md bg-white overflow-hidden">
              {pairwiseMatches.map((m) => (
                <div key={m.id} className="p-2.5 flex items-center justify-between font-mono text-[11px]">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-slate-900">{subMap.get(m.winnerId)?.title}</span>
                    <span className="text-emerald-700 font-semibold">won over</span>
                    <span className="text-slate-500">{subMap.get(m.winnerId === m.submissionAId ? m.submissionBId : m.submissionAId)?.title}</span>
                  </div>
                  <span className="text-slate-400 text-[10px] shrink-0 ml-2">
                    {m.reason || 'Pairwise Decision'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
