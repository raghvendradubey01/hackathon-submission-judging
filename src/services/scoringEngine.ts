import { Score, Rubric, NormalizedResult, JudgeStatistic, PairwiseComparison, Submission, Team } from '../types';

/**
 * Calculates raw weighted total score for a rubric evaluation.
 */
export function calculateWeightedTotal(
  criterionScores: Record<string, number>,
  rubric: Rubric
): number {
  let total = 0;
  for (const criterion of rubric.criteria) {
    const rawScore = criterionScores[criterion.id] ?? 0;
    total += rawScore * criterion.weight;
  }
  return Number(total.toFixed(2));
}

/**
 * Calculates per-judge statistics (mean, variance, standard deviation)
 * to identify harsh vs lenient evaluators.
 */
export function calculateJudgeStatistics(
  scores: Score[],
  judgeNames: Record<string, string>
): Record<string, JudgeStatistic> {
  const judgeScores: Record<string, number[]> = {};

  for (const score of scores) {
    if (!judgeScores[score.judgeId]) {
      judgeScores[score.judgeId] = [];
    }
    judgeScores[score.judgeId].push(score.weightedTotal);
  }

  const stats: Record<string, JudgeStatistic> = {};

  for (const [judgeId, valList] of Object.entries(judgeScores)) {
    const n = valList.length;
    if (n === 0) continue;

    const mean = valList.reduce((acc, v) => acc + v, 0) / n;
    
    // Sample variance (or 0 if n < 2)
    let variance = 0;
    if (n > 1) {
      variance = valList.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (n - 1);
    }
    const stdDev = Math.sqrt(variance);

    let tendency: 'Harsh' | 'Balanced' | 'Lenient' = 'Balanced';
    if (mean < 75) tendency = 'Harsh';
    else if (mean > 88) tendency = 'Lenient';

    stats[judgeId] = {
      judgeId,
      judgeName: judgeNames[judgeId] || judgeId,
      evaluationsCount: n,
      meanScore: Number(mean.toFixed(2)),
      stdDev: Number(stdDev.toFixed(2)),
      tendency,
    };
  }

  return stats;
}

/**
 * Computes Bradley-Terry pairwise latent strength parameters using
 * Minorization-Maximization (MM) algorithm.
 * P(i > j) = gamma_i / (gamma_i + gamma_j)
 */
export function computeBradleyTerryScores(
  submissions: Submission[],
  pairwiseMatches: PairwiseComparison[]
): Record<string, number> {
  const submissionIds = submissions.map(s => s.id);
  if (submissionIds.length === 0) return {};

  // Initialize weights gamma_i = 1.0
  let gamma: Record<string, number> = {};
  for (const id of submissionIds) {
    gamma[id] = 1.0;
  }

  // Count wins W_i and match counts N_ij
  const wins: Record<string, number> = {};
  const matches: Record<string, Record<string, number>> = {};

  for (const id of submissionIds) {
    wins[id] = 0;
    matches[id] = {};
    for (const otherId of submissionIds) {
      matches[id][otherId] = 0;
    }
  }

  for (const match of pairwiseMatches) {
    if (wins[match.winnerId] !== undefined) {
      wins[match.winnerId] += 1;
    }
    const a = match.submissionAId;
    const b = match.submissionBId;
    if (matches[a] && matches[a][b] !== undefined) matches[a][b] += 1;
    if (matches[b] && matches[b][a] !== undefined) matches[b][a] += 1;
  }

  // If no pairwise matches exist, return uniform scores
  if (pairwiseMatches.length === 0) {
    const uniform: Record<string, number> = {};
    for (const id of submissionIds) uniform[id] = 75;
    return uniform;
  }

  // MM Iterative Solver (up to 100 iterations)
  const maxIterations = 100;
  const tolerance = 1e-5;

  for (let iter = 0; iter < maxIterations; iter++) {
    const nextGamma: Record<string, number> = {};
    let maxDelta = 0;

    for (const i of submissionIds) {
      let denomSum = 0;
      for (const j of submissionIds) {
        if (i === j) continue;
        const n_ij = matches[i]?.[j] || 0;
        if (n_ij > 0) {
          denomSum += n_ij / (gamma[i] + gamma[j]);
        }
      }

      // Add Laplace smoothing (0.5) to avoid zero denominators for unranked pairs
      const w_i = (wins[i] || 0) + 0.5;
      const effectiveDenom = denomSum + 0.5;
      nextGamma[i] = w_i / effectiveDenom;

      const delta = Math.abs(nextGamma[i] - gamma[i]);
      if (delta > maxDelta) maxDelta = delta;
    }

    gamma = nextGamma;
    if (maxDelta < tolerance) break;
  }

  // Normalize gammas into 0 - 100 score distribution
  const values = Object.values(gamma);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const result: Record<string, number> = {};
  for (const id of submissionIds) {
    // Map to 60 - 98 range
    const scaled = 60 + ((gamma[id] - minVal) / range) * 38;
    result[id] = Number(scaled.toFixed(2));
  }

  return result;
}

/**
 * Computes cross-judge Z-Score Normalization and Leaderboard rankings.
 * Target distribution: Mean 75, Standard Deviation 12 (bounded between 10 and 100).
 */
export function computeLeaderboard(
  submissions: Submission[],
  teams: Team[],
  scores: Score[],
  judgeStats: Record<string, JudgeStatistic>,
  bradleyTerryScores: Record<string, number> = {}
): NormalizedResult[] {
  const TARGET_MEAN = 75.0;
  const TARGET_STD = 12.0;

  // Group scores by submission
  const subScoresMap: Record<string, Score[]> = {};
  for (const sub of submissions) {
    subScoresMap[sub.id] = [];
  }
  for (const score of scores) {
    if (subScoresMap[score.submissionId]) {
      subScoresMap[score.submissionId].push(score);
    }
  }

  // Map teams
  const teamMap: Record<string, Team> = {};
  for (const t of teams) {
    teamMap[t.id] = t;
  }

  // Calculate raw means and normalized scores
  const results: NormalizedResult[] = [];

  for (const sub of submissions) {
    if (sub.status === 'draft') continue; // Do not score drafts

    const subScores = subScoresMap[sub.id] || [];
    const team = teamMap[sub.teamId];

    if (subScores.length === 0) {
      results.push({
        submissionId: sub.id,
        submissionTitle: sub.title,
        teamId: sub.teamId,
        teamName: team ? team.name : 'Unknown Team',
        trackId: sub.trackId,
        trackName: sub.trackId,
        scoresCount: 0,
        rawMean: 0,
        zScoreMean: 0,
        minMaxScore: 0,
        bradleyTerryScore: bradleyTerryScores[sub.id] || 0,
        finalScore: 0,
        rawRank: 999,
        normalizedRank: 999,
        rankDelta: 0,
      });
      continue;
    }

    // 1. Raw Mean
    const rawSum = subScores.reduce((acc, s) => acc + s.weightedTotal, 0);
    const rawMean = Number((rawSum / subScores.length).toFixed(2));

    // 2. Normalized Z-Scores
    let zScoreSum = 0;
    let minMaxSum = 0;

    for (const score of subScores) {
      const jStat = judgeStats[score.judgeId];
      if (jStat && jStat.stdDev > 0) {
        // z = (x - mu) / sigma
        const z = (score.weightedTotal - jStat.meanScore) / jStat.stdDev;
        // Project onto target scale
        const scaledScore = Math.max(10, Math.min(100, TARGET_MEAN + z * TARGET_STD));
        zScoreSum += scaledScore;
      } else {
        zScoreSum += score.weightedTotal; // Fallback to raw if no variance
      }

      // Min-Max approximation: calibrate against judge mean
      const judgeDiff = jStat ? TARGET_MEAN - jStat.meanScore : 0;
      minMaxSum += Math.max(0, Math.min(100, score.weightedTotal + judgeDiff));
    }

    const zScoreMean = Number((zScoreSum / subScores.length).toFixed(2));
    const minMaxScore = Number((minMaxSum / subScores.length).toFixed(2));
    const btScore = bradleyTerryScores[sub.id] || zScoreMean;

    // Final combined score (e.g. 85% Z-Score Normalized + 15% Pairwise Consensus)
    const finalScore = Number((zScoreMean * 0.85 + btScore * 0.15).toFixed(2));

    results.push({
      submissionId: sub.id,
      submissionTitle: sub.title,
      teamId: sub.teamId,
      teamName: team ? team.name : 'Unknown Team',
      trackId: sub.trackId,
      trackName: sub.trackId,
      scoresCount: subScores.length,
      rawMean,
      zScoreMean,
      minMaxScore,
      bradleyTerryScore: btScore,
      finalScore,
      rawRank: 0,
      normalizedRank: 0,
      rankDelta: 0,
    });
  }

  // Compute Raw Ranks
  const byRaw = [...results].sort((a, b) => b.rawMean - a.rawMean);
  byRaw.forEach((item, index) => {
    item.rawRank = index + 1;
  });

  // Compute Normalized Ranks
  const byNormalized = [...results].sort((a, b) => b.finalScore - a.finalScore);
  byNormalized.forEach((item, index) => {
    item.normalizedRank = index + 1;
    item.rankDelta = item.rawRank - item.normalizedRank; // +2 means moved up 2 spots after normalization
  });

  return byNormalized;
}
