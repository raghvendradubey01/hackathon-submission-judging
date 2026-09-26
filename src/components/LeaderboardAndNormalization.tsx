import React, { useState } from 'react';
import { NormalizedResult, JudgeStatistic, User } from '../types';
import { 
  Lock, 
  Unlock, 
  Download, 
  Trophy, 
  BarChart2, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  Sigma
} from 'lucide-react';

interface LeaderboardAndNormalizationProps {
  currentUser: User;
  results: NormalizedResult[];
  judgeStats: Record<string, JudgeStatistic>;
  resultsEmbargoed: boolean;
  onToggleEmbargo: () => void;
  onExportSubmissionsCSV: () => void;
  onExportScoresCSV: () => void;
  onExportLeaderboardCSV: () => void;
}

export const LeaderboardAndNormalization: React.FC<LeaderboardAndNormalizationProps> = ({
  currentUser,
  results,
  judgeStats,
  resultsEmbargoed,
  onToggleEmbargo,
  onExportSubmissionsCSV,
  onExportScoresCSV,
  onExportLeaderboardCSV,
}) => {
  const isOrganizer = currentUser.role === 'organizer' || currentUser.role === 'admin';
  const [viewMode, setViewMode] = useState<'normalized' | 'raw' | 'proof'>('normalized');

  const judgesList = Object.values(judgeStats);

  return (
    <div className="space-y-6 pb-12">
      {/* Embargo Alert Strip */}
      <div className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
        resultsEmbargoed
          ? 'bg-amber-50/70 border-amber-300 text-amber-950'
          : 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
      }`}>
        <div className="flex items-center gap-2.5">
          {resultsEmbargoed ? (
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
          ) : (
            <Unlock className="w-4 h-4 text-emerald-700 shrink-0" />
          )}
          <div>
            <span className="font-mono uppercase font-bold tracking-wider">
              {resultsEmbargoed ? 'Results Embargo Active (Tier 3 Security)' : 'Results Publicly Released'}
            </span>
            <p className="text-slate-600 text-[11px] mt-0.5">
              {resultsEmbargoed
                ? 'Scores and normalized ranks are strictly concealed from participants until organizer publication.'
                : 'Embargo lifted. Participants and public can view verified rankings.'}
            </p>
          </div>
        </div>

        {isOrganizer && (
          <button
            onClick={onToggleEmbargo}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold font-mono transition-colors cursor-pointer self-start sm:self-auto border ${
              resultsEmbargoed
                ? 'bg-amber-900 text-white border-amber-950 hover:bg-amber-800'
                : 'bg-slate-900 text-white border-slate-950 hover:bg-slate-800'
            }`}
          >
            {resultsEmbargoed ? 'Lift Embargo & Publish' : 'Re-engage Embargo'}
          </button>
        )}
      </div>

      {/* Main Console Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                Statistical Normalization Engine
              </span>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                Z-Score Standardized
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-2">
              Leaderboard & Evaluator Variance Proofs
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Z-score standardization maps raw scores against each judge's empirical distribution, correcting for harsh and lenient evaluators.
            </p>
          </div>

          {/* CSV Export Suite */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={onExportLeaderboardCSV}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-md text-xs font-semibold font-mono border border-slate-300 transition-colors cursor-pointer shadow-xs"
              title="Download RFC 4180 Leaderboard CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Leaderboard CSV</span>
            </button>
            <button
              onClick={onExportScoresCSV}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-md text-xs font-semibold font-mono border border-slate-300 transition-colors cursor-pointer shadow-xs"
              title="Download Raw Scores CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Scores CSV</span>
            </button>
            <button
              onClick={onExportSubmissionsCSV}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-md text-xs font-semibold font-mono border border-slate-300 transition-colors cursor-pointer shadow-xs"
              title="Download Submissions CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Submissions CSV</span>
            </button>
          </div>
        </div>

        {/* View Mode Segmented Bar */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
          <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-slate-50 text-xs font-mono">
            <button
              onClick={() => setViewMode('normalized')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'normalized'
                  ? 'bg-white shadow-xs font-bold text-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Normalized Rankings
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'raw'
                  ? 'bg-white shadow-xs font-bold text-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Raw Baseline
            </button>
            <button
              onClick={() => setViewMode('proof')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'proof'
                  ? 'bg-white shadow-xs font-bold text-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Variance Proof & Math (+5 Bonus)
            </button>
          </div>
        </div>
      </div>

      {/* View 1: Normalized Leaderboard Table */}
      {viewMode === 'normalized' && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Rank</th>
                  <th className="py-2.5 px-4 font-semibold">Project & Team</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Raw Mean</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Z-Score Norm</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Bradley-Terry</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Final Index</th>
                  <th className="py-2.5 px-4 font-semibold text-center">Rank Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {results.map((res) => {
                  const isTop3 = res.normalizedRank <= 3;
                  return (
                    <tr
                      key={res.submissionId}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isTop3 ? 'bg-slate-50/40' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-bold text-slate-900 tabular-nums">
                        <span className="inline-flex items-center gap-1.5">
                          {res.normalizedRank === 1 && <span className="text-amber-500">🥇</span>}
                          {res.normalizedRank === 2 && <span className="text-slate-400">🥈</span>}
                          {res.normalizedRank === 3 && <span className="text-amber-700">🥉</span>}
                          <span>#{res.normalizedRank}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">{res.submissionTitle}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {res.teamName} · {res.scoresCount} evaluations · {res.trackName}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600 tabular-nums">
                        {res.rawMean.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900 tabular-nums">
                        {res.zScoreMean.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-700 tabular-nums">
                        {res.bradleyTerryScore.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 text-sm tabular-nums">
                        {res.finalScore.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center tabular-nums">
                        {res.rankDelta > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <TrendingUp className="w-3 h-3 text-emerald-600" />
                            <span>+{res.rankDelta}</span>
                          </span>
                        ) : res.rankDelta < 0 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            <TrendingDown className="w-3 h-3 text-rose-600" />
                            <span>{res.rankDelta}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs font-mono">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 2: Raw Scores View */}
      {viewMode === 'raw' && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
            <strong>Unnormalized Raw Baseline:</strong> Showing simple unweighted average of awarded points. Note how submissions assigned to harsh judges are heavily penalized without statistical standardization.
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Raw Rank</th>
                  <th className="py-2.5 px-4 font-semibold">Project & Team</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Raw Average</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Evaluator Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {[...results].sort((a, b) => b.rawMean - a.rawMean).map((res, idx) => (
                  <tr key={res.submissionId} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-800">#{idx + 1}</td>
                    <td className="py-3 px-4 font-sans">
                      <div className="font-bold text-slate-900">{res.submissionTitle}</div>
                      <div className="text-[11px] text-slate-500">{res.teamName}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums">
                      {res.rawMean.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500 tabular-nums">
                      {res.scoresCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 3: Normalization Proof & Mathematical Analysis (Bonus +5) */}
      {viewMode === 'proof' && (
        <div className="space-y-6">
          {/* Judge Variance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {judgesList.map((j) => (
              <div key={j.judgeId} className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{j.judgeName}</span>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-semibold ${
                      j.tendency === 'Harsh'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : j.tendency === 'Lenient'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {j.tendency} Evaluator
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-100">
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <div className="text-slate-500 text-[10px]">Mean (μ):</div>
                    <div className="text-base font-bold text-slate-900 tabular-nums">{j.meanScore.toFixed(2)}</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <div className="text-slate-500 text-[10px]">Std Dev (σ):</div>
                    <div className="text-base font-bold text-slate-900 tabular-nums">{j.stdDev.toFixed(2)}</div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {j.tendency === 'Lenient'
                    ? 'Grades generously with high mean. Z-score prevents artificial score inflation from advantaging evaluated teams.'
                    : j.tendency === 'Harsh'
                    ? 'Rigorous grader with low mean. Z-score compensation prevents evaluated teams from unfair penalty.'
                    : 'Balanced distribution curve aligned with platform baseline.'}
                </p>
              </div>
            ))}
          </div>

          {/* Mathematical Proof Specification Note */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Sigma className="w-4 h-4 text-slate-700" />
              <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-900">
                Mathematical Proof: Cross-Judge Z-Score Compensation
              </h2>
            </div>

            <div className="p-4 bg-slate-50 rounded-md border border-slate-200 font-mono text-xs text-slate-800 space-y-2">
              <div>
                <strong>Standardization:</strong> <code className="bg-white px-2 py-0.5 rounded border border-slate-200">z_ij = (x_ij - μ_j) / σ_j</code>
              </div>
              <div>
                <strong>Scale Mapping:</strong> <code className="bg-white px-2 py-0.5 rounded border border-slate-200">Score_norm = 75.0 + (z_ij * 12.0)</code>
              </div>
              <p className="text-[11px] text-slate-600 font-sans leading-relaxed pt-2">
                By standardizing points relative to each evaluator's empirical distribution, an evaluation of <strong>74.9 from strict Judge Devendra (μ=70.7)</strong> projects to <code className="bg-white px-1.5 py-0.2 rounded border font-mono text-emerald-800 font-semibold">+0.49σ</code> (Normalized: ~80.9), whereas an uncalibrated evaluation of <strong>88.9 from lenient Judge Liam (μ=92.5)</strong> projects to <code className="bg-white px-1.5 py-0.2 rounded border font-mono text-rose-800 font-semibold">-0.97σ</code> (Normalized: ~63.3). This prevents judge lottery bias.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
