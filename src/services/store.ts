import {
  HackathonEvent,
  User,
  Team,
  Submission,
  Rubric,
  JudgeAssignment,
  Score,
  PairwiseComparison,
  CommunityVote,
  ProjectComment,
  AuditLog,
  WebhookEndpoint,
  NormalizedResult,
  JudgeStatistic,
} from '../types';
import {
  SEED_EVENT,
  SEED_USERS,
  SEED_TEAMS,
  SEED_RUBRIC,
  SEED_SUBMISSIONS,
  SEED_ASSIGNMENTS,
  SEED_SCORES,
  SEED_PAIRWISE_MATCHES,
  SEED_VOTES,
  SEED_COMMENTS,
  SEED_AUDIT_LOGS,
  SEED_WEBHOOKS,
} from '../data/fixtures';
import {
  calculateWeightedTotal,
  calculateJudgeStatistics,
  computeBradleyTerryScores,
  computeLeaderboard,
} from './scoringEngine';

const STORAGE_KEY = 'hackforge_store_v1';

export interface AppState {
  event: HackathonEvent;
  users: User[];
  currentUser: User;
  teams: Team[];
  submissions: Submission[];
  rubric: Rubric;
  assignments: JudgeAssignment[];
  scores: Score[];
  pairwiseMatches: PairwiseComparison[];
  votes: CommunityVote[];
  comments: ProjectComment[];
  auditLogs: AuditLog[];
  webhooks: WebhookEndpoint[];
}

export class HackathonStore {
  private state: AppState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadInitialState();
  }

  private loadInitialState(): AppState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.event && parsed.submissions && parsed.users) {
          return parsed;
        }
      }
    } catch {
      // Fallback to fresh seed
    }

    return {
      event: { ...SEED_EVENT },
      users: [...SEED_USERS],
      currentUser: SEED_USERS[0], // Default: Marcus Chen (Organizer)
      teams: [...SEED_TEAMS],
      submissions: [...SEED_SUBMISSIONS],
      rubric: { ...SEED_RUBRIC },
      assignments: [...SEED_ASSIGNMENTS],
      scores: [...SEED_SCORES],
      pairwiseMatches: [...SEED_PAIRWISE_MATCHES],
      votes: [...SEED_VOTES],
      comments: [...SEED_COMMENTS],
      auditLogs: [...SEED_AUDIT_LOGS],
      webhooks: [...SEED_WEBHOOKS],
    };
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // localStorage quota exceeded or unavailable in hermetic test
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  public resetToSeedData() {
    this.state = {
      event: { ...SEED_EVENT },
      users: [...SEED_USERS],
      currentUser: SEED_USERS[0],
      teams: [...SEED_TEAMS],
      submissions: [...SEED_SUBMISSIONS],
      rubric: { ...SEED_RUBRIC },
      assignments: [...SEED_ASSIGNMENTS],
      scores: [...SEED_SCORES],
      pairwiseMatches: [...SEED_PAIRWISE_MATCHES],
      votes: [...SEED_VOTES],
      comments: [...SEED_COMMENTS],
      auditLogs: [...SEED_AUDIT_LOGS],
      webhooks: [...SEED_WEBHOOKS],
    };
    this.persist();
  }

  // State Getters
  public getState(): AppState {
    return this.state;
  }

  public getCurrentUser(): User {
    return this.state.currentUser;
  }

  public setCurrentUser(userId: string) {
    const user = this.state.users.find(u => u.id === userId);
    if (user) {
      this.state.currentUser = user;
      this.persist();
    }
  }

  // Audit Logging
  public logAudit(action: string, targetType: AuditLog['targetType'], targetId: string, details: string) {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      actorId: this.state.currentUser.id,
      actorName: this.state.currentUser.name,
      actorRole: this.state.currentUser.role,
      action,
      targetType,
      targetId,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
    };
    this.state.auditLogs = [newLog, ...this.state.auditLogs];
    this.triggerWebhooks(action, { log: newLog });
    this.persist();
  }

  // Teams & Invites
  public createTeam(name: string, tagline: string): { success: boolean; team?: Team; message?: string } {
    const user = this.state.currentUser;
    // Check if user already captains or belongs to a team in this event
    const existing = this.state.teams.find(t => t.members.some(m => m.userId === user.id));
    if (existing) {
      return { success: false, message: `You are already part of team "${existing.name}". Leave it before creating a new one.` };
    }

    const inviteCode = `FORGE-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTeam: Team = {
      id: `tm-${Date.now()}`,
      eventId: this.state.event.id,
      name,
      tagline,
      inviteCode,
      captainId: user.id,
      members: [
        { userId: user.id, name: user.name, roleInTeam: 'captain', joinedAt: new Date().toISOString() }
      ],
      createdAt: new Date().toISOString(),
    };

    this.state.teams.push(newTeam);
    this.logAudit('TEAM_CREATED', 'team', newTeam.id, `Created team "${name}" with invite code ${inviteCode}.`);
    return { success: true, team: newTeam };
  }

  public joinTeamWithInvite(inviteCode: string): { success: boolean; message: string } {
    const user = this.state.currentUser;
    const team = this.state.teams.find(t => t.inviteCode.trim().toUpperCase() === inviteCode.trim().toUpperCase());
    if (!team) {
      return { success: false, message: 'Invalid invite code. Please check with your team captain.' };
    }

    if (team.members.some(m => m.userId === user.id)) {
      return { success: false, message: 'You are already a member of this team.' };
    }

    if (team.members.length >= this.state.event.maxTeamSize) {
      return { success: false, message: `Team is full (maximum ${this.state.event.maxTeamSize} members allowed).` };
    }

    team.members.push({
      userId: user.id,
      name: user.name,
      roleInTeam: 'member',
      joinedAt: new Date().toISOString(),
    });

    this.logAudit('TEAM_JOINED', 'team', team.id, `${user.name} joined team "${team.name}" via invite code.`);
    return { success: true, message: `Successfully joined ${team.name}!` };
  }

  public leaveTeam(teamId: string): { success: boolean; message: string } {
    const user = this.state.currentUser;
    const team = this.state.teams.find(t => t.id === teamId);
    if (!team) return { success: false, message: 'Team not found.' };

    const idx = team.members.findIndex(m => m.userId === user.id);
    if (idx === -1) return { success: false, message: 'You are not in this team.' };

    if (team.members.length === 1) {
      // Disband team
      this.state.teams = this.state.teams.filter(t => t.id !== teamId);
      this.logAudit('TEAM_DISBANDED', 'team', teamId, `Team "${team.name}" disbanded by last member.`);
    } else {
      team.members.splice(idx, 1);
      if (team.captainId === user.id && team.members.length > 0) {
        team.captainId = team.members[0].userId;
        team.members[0].roleInTeam = 'captain';
      }
      this.logAudit('TEAM_LEFT', 'team', teamId, `${user.name} left team "${team.name}".`);
    }

    this.persist();
    return { success: true, message: 'Successfully left team.' };
  }

  // Submissions
  public saveSubmission(
    submissionData: Partial<Submission>,
    asDraft: boolean = false
  ): { success: boolean; submission?: Submission; message?: string } {
    const user = this.state.currentUser;
    // Check deadline enforcement
    const now = new Date();
    const deadline = new Date(this.state.event.schedule.submissionDeadline);

    if (now > deadline && this.state.currentUser.role !== 'organizer' && this.state.currentUser.role !== 'admin') {
      return { success: false, message: 'Submission deadline has passed. Late submissions are locked by protocol.' };
    }

    // Find user's team
    const team = this.state.teams.find(t => t.members.some(m => m.userId === user.id));
    if (!team && this.state.currentUser.role === 'participant') {
      return { success: false, message: 'You must form or join a team before submitting a project.' };
    }

    const teamId = team ? team.id : (submissionData.teamId || 'tm-consensus');

    let sub = this.state.submissions.find(s => s.id === submissionData.id);
    if (!sub && submissionData.teamId) {
      sub = this.state.submissions.find(s => s.teamId === submissionData.teamId);
    }

    if (sub) {
      // Update
      sub.title = submissionData.title || sub.title;
      sub.tagline = submissionData.tagline || sub.tagline;
      sub.description = submissionData.description || sub.description;
      sub.trackId = submissionData.trackId || sub.trackId;
      sub.repoUrl = submissionData.repoUrl || sub.repoUrl;
      sub.demoVideoUrl = submissionData.demoVideoUrl || sub.demoVideoUrl;
      sub.liveUrl = submissionData.liveUrl || sub.liveUrl;
      sub.techStack = submissionData.techStack || sub.techStack;
      sub.status = asDraft ? 'draft' : 'submitted';
      sub.updatedAt = new Date().toISOString();
      if (!asDraft && !sub.submittedAt) {
        sub.submittedAt = new Date().toISOString();
      }
      this.logAudit('SUBMISSION_UPDATED', 'submission', sub.id, `Updated "${sub.title}" (${sub.status}).`);
      this.triggerWebhooks('submission.updated', { submission: sub });
      return { success: true, submission: sub };
    } else {
      // Create new
      const newSub: Submission = {
        id: `sub-${Date.now()}`,
        teamId,
        eventId: this.state.event.id,
        title: submissionData.title || 'Untitled Project',
        tagline: submissionData.tagline || '',
        description: submissionData.description || '',
        trackId: submissionData.trackId || this.state.event.tracks[0].id,
        repoUrl: submissionData.repoUrl || '',
        demoVideoUrl: submissionData.demoVideoUrl || '',
        liveUrl: submissionData.liveUrl || '',
        techStack: submissionData.techStack || ['TypeScript'],
        status: asDraft ? 'draft' : 'submitted',
        attachments: submissionData.attachments || [],
        submittedAt: asDraft ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.state.submissions.push(newSub);
      this.logAudit('SUBMISSION_CREATED', 'submission', newSub.id, `Created "${newSub.title}" (${newSub.status}).`);
      this.triggerWebhooks('submission.created', { submission: newSub });
      return { success: true, submission: newSub };
    }
  }

  // Rubric Editing
  public updateRubric(criteria: Rubric['criteria']): { success: boolean; message: string } {
    const totalWeight = Number(criteria.reduce((acc, c) => acc + c.weight, 0).toFixed(4));
    if (Math.abs(totalWeight - 1.0) > 0.001) {
      return { success: false, message: `Rubric criterion weights must sum exactly to 1.00 (Current: ${totalWeight.toFixed(2)}).` };
    }

    this.state.rubric.criteria = criteria;
    this.logAudit('RUBRIC_UPDATED', 'rubric', this.state.rubric.id, `Updated rubric criteria with normalized weights.`);
    return { success: true, message: 'Rubric saved successfully.' };
  }

  // Algorithmic & Batch Judge Assignment
  public runAlgorithmicAssignment(reviewsPerProject: number = 3): { success: boolean; assignmentsCount: number; message: string } {
    const judges = this.state.users.filter(u => u.role === 'judge');
    if (judges.length === 0) {
      return { success: false, assignmentsCount: 0, message: 'No judges available for assignment.' };
    }

    const submittedProjects = this.state.submissions.filter(s => s.status === 'submitted');
    if (submittedProjects.length === 0) {
      return { success: false, assignmentsCount: 0, message: 'No submitted projects available to judge.' };
    }

    // Build team member conflict graph (judges cannot judge projects from their own team/affiliations)
    const teamToMembers: Record<string, string[]> = {};
    for (const team of this.state.teams) {
      teamToMembers[team.id] = team.members.map(m => m.userId);
    }

    const newAssignments: JudgeAssignment[] = [];
    let judgeIndex = 0;

    for (const sub of submittedProjects) {
      const conflictedUserIds = teamToMembers[sub.teamId] || [];
      const eligibleJudges = judges.filter(j => !conflictedUserIds.includes(j.id));

      if (eligibleJudges.length === 0) continue;

      const needed = Math.min(reviewsPerProject, eligibleJudges.length);
      for (let k = 0; k < needed; k++) {
        const judge = eligibleJudges[(judgeIndex + k) % eligibleJudges.length];
        // Check if already assigned
        const exists = this.state.assignments.some(a => a.judgeId === judge.id && a.submissionId === sub.id);
        if (!exists) {
          const asg: JudgeAssignment = {
            id: `asg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            eventId: this.state.event.id,
            judgeId: judge.id,
            submissionId: sub.id,
            status: 'pending',
            assignedAt: new Date().toISOString(),
          };
          newAssignments.push(asg);
        }
      }
      judgeIndex++;
    }

    this.state.assignments.push(...newAssignments);
    this.logAudit('JUDGE_ASSIGNMENT_BATCH', 'assignment', `batch-${Date.now()}`, `Dispatched ${newAssignments.length} algorithmic assignments with conflict-of-interest checks.`);
    return { success: true, assignmentsCount: newAssignments.length, message: `Successfully assigned ${newAssignments.length} reviews.` };
  }

  // Scoring
  public submitScore(
    submissionId: string,
    criterionScores: Record<string, number>,
    feedbackNote: string
  ): { success: boolean; score?: Score; message?: string } {
    const judge = this.state.currentUser;
    if (judge.role !== 'judge' && judge.role !== 'organizer' && judge.role !== 'admin') {
      return { success: false, message: 'Role violation: Only assigned judges or administrators may submit scores.' };
    }

    const weightedTotal = calculateWeightedTotal(criterionScores, this.state.rubric);

    // Find assignment if exists
    const assignment = this.state.assignments.find(a => a.judgeId === judge.id && a.submissionId === submissionId);
    if (assignment) {
      assignment.status = 'completed';
      assignment.completedAt = new Date().toISOString();
    }

    // Check existing score by this judge
    let existingScore = this.state.scores.find(s => s.judgeId === judge.id && s.submissionId === submissionId);
    if (existingScore) {
      existingScore.criterionScores = criterionScores;
      existingScore.feedbackNote = feedbackNote;
      existingScore.weightedTotal = weightedTotal;
      existingScore.submittedAt = new Date().toISOString();
      this.logAudit('SCORE_UPDATED', 'score', existingScore.id, `Updated score for submission ${submissionId}: ${weightedTotal}`);
      return { success: true, score: existingScore };
    }

    const newScore: Score = {
      id: `scr-${Date.now()}`,
      assignmentId: assignment?.id,
      judgeId: judge.id,
      submissionId,
      criterionScores,
      weightedTotal,
      feedbackNote,
      submittedAt: new Date().toISOString(),
    };

    this.state.scores.push(newScore);
    this.logAudit('SCORE_SUBMITTED', 'score', newScore.id, `Judge ${judge.name} evaluated submission ${submissionId} (Total: ${weightedTotal}).`);
    this.triggerWebhooks('score.submitted', { score: newScore });
    return { success: true, score: newScore };
  }

  // Pairwise Comparisons
  public recordPairwiseMatch(submissionAId: string, submissionBId: string, winnerId: string, reason?: string) {
    const judge = this.state.currentUser;
    const match: PairwiseComparison = {
      id: `pwm-${Date.now()}`,
      judgeId: judge.id,
      submissionAId,
      submissionBId,
      winnerId,
      reason,
      timestamp: new Date().toISOString(),
    };
    this.state.pairwiseMatches.push(match);
    this.logAudit('PAIRWISE_COMPARISON', 'score', match.id, `Head-to-head evaluation: winner ${winnerId}`);
  }

  // Community Voting
  public castCommunityVote(submissionId: string, voteType: 'upvote' | 'quadratic', creditsSpent: number = 1): { success: boolean; message: string } {
    const user = this.state.currentUser;
    const fingerprint = `client_fp_${user.id.substring(4, 9)}`;

    // Anti-abuse: Check max credits / vote frequency
    const existingVotes = this.state.votes.filter(v => v.voterId === user.id && v.submissionId === submissionId);
    if (existingVotes.length > 0 && voteType === 'upvote') {
      return { success: false, message: 'You have already upvoted this project. Duplicate vote rejected by rate limiter.' };
    }

    const newVote: CommunityVote = {
      id: `vt-${Date.now()}`,
      submissionId,
      voterId: user.id,
      voteType,
      creditsSpent,
      timestamp: new Date().toISOString(),
      fingerprint,
    };

    this.state.votes.push(newVote);
    this.logAudit('COMMUNITY_VOTE', 'submission', submissionId, `${user.name} voted (${voteType}, ${creditsSpent} tokens).`);
    return { success: true, message: 'Vote recorded!' };
  }

  // Comments
  public addComment(submissionId: string, content: string) {
    const user = this.state.currentUser;
    const comment: ProjectComment = {
      id: `cmt-${Date.now()}`,
      submissionId,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      content,
      timestamp: new Date().toISOString(),
    };
    this.state.comments.push(comment);
    this.logAudit('COMMENT_ADDED', 'submission', submissionId, `${user.name} posted a comment.`);
    this.persist();
  }

  // Event Configuration
  public updateEvent(partialEvent: Partial<HackathonEvent>): { success: boolean; message: string } {
    this.state.event = { ...this.state.event, ...partialEvent };
    this.logAudit('EVENT_UPDATED', 'event', this.state.event.id, `Updated event configuration: "${this.state.event.name}".`);
    this.persist();
    return { success: true, message: 'Event successfully updated.' };
  }

  public createEvent(newEvent: HackathonEvent): { success: boolean; message: string } {
    this.state.event = newEvent;
    this.logAudit('EVENT_CREATED', 'event', newEvent.id, `Created new event: "${newEvent.name}".`);
    this.persist();
    return { success: true, message: `Event "${newEvent.name}" created and set as active.` };
  }

  public updateEventSchedule(schedule: Partial<HackathonEvent['schedule']>) {
    this.state.event.schedule = { ...this.state.event.schedule, ...schedule };
    this.logAudit('EVENT_SCHEDULE_UPDATED', 'event', this.state.event.id, 'Updated event deadlines.');
    this.persist();
  }

  public toggleEmbargo() {
    this.state.event.resultsEmbargoed = !this.state.event.resultsEmbargoed;
    this.logAudit('EMBARGO_TOGGLED', 'event', this.state.event.id, `Results embargo is now: ${this.state.event.resultsEmbargoed ? 'ACTIVE' : 'REVEALED'}`);
    this.persist();
  }

  // Webhooks
  private triggerWebhooks(event: string, payload: any) {
    for (const wh of this.state.webhooks) {
      if (wh.enabled && (wh.events.includes(event) || wh.events.includes('*'))) {
        wh.lastTriggered = new Date().toISOString();
        wh.lastStatus = 200;
      }
    }
  }

  // Normalization & Leaderboard Accessor
  public getLeaderboard(): { results: NormalizedResult[]; judgeStats: Record<string, JudgeStatistic> } {
    const judgeNames: Record<string, string> = {};
    for (const u of this.state.users) {
      judgeNames[u.id] = u.name;
    }

    const judgeStats = calculateJudgeStatistics(this.state.scores, judgeNames);
    const btScores = computeBradleyTerryScores(this.state.submissions, this.state.pairwiseMatches);
    const results = computeLeaderboard(
      this.state.submissions,
      this.state.teams,
      this.state.scores,
      judgeStats,
      btScores
    );

    return { results, judgeStats };
  }

  // Export CSV utilities
  public exportSubmissionsCSV(): string {
    const headers = ['ID', 'Title', 'Team', 'Track', 'Status', 'RepoUrl', 'LiveUrl', 'SubmittedAt'];
    const teamMap = Object.fromEntries(this.state.teams.map(t => [t.id, t.name]));
    const rows = this.state.submissions.map(s => [
      s.id,
      `"${s.title.replace(/"/g, '""')}"`,
      `"${(teamMap[s.teamId] || '').replace(/"/g, '""')}"`,
      s.trackId,
      s.status,
      s.repoUrl,
      s.liveUrl || '',
      s.submittedAt || '',
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  public exportScoresCSV(): string {
    const headers = ['ScoreID', 'JudgeName', 'SubmissionTitle', 'WeightedTotal', 'SubmittedAt', 'Feedback'];
    const judgeMap = Object.fromEntries(this.state.users.map(u => [u.id, u.name]));
    const subMap = Object.fromEntries(this.state.submissions.map(s => [s.id, s.title]));
    const rows = this.state.scores.map(s => [
      s.id,
      `"${(judgeMap[s.judgeId] || s.judgeId).replace(/"/g, '""')}"`,
      `"${(subMap[s.submissionId] || s.submissionId).replace(/"/g, '""')}"`,
      s.weightedTotal.toFixed(2),
      s.submittedAt,
      `"${(s.feedbackNote || '').replace(/"/g, '""')}"`,
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  public exportLeaderboardCSV(): string {
    const { results } = this.getLeaderboard();
    const headers = ['NormalizedRank', 'RawRank', 'RankDelta', 'SubmissionTitle', 'TeamName', 'RawMean', 'ZScoreMean', 'BradleyTerry', 'FinalScore', 'ScoresCount'];
    const rows = results.map(r => [
      r.normalizedRank,
      r.rawRank,
      r.rankDelta > 0 ? `+${r.rankDelta}` : r.rankDelta,
      `"${r.submissionTitle.replace(/"/g, '""')}"`,
      `"${r.teamName.replace(/"/g, '""')}"`,
      r.rawMean.toFixed(2),
      r.zScoreMean.toFixed(2),
      r.bradleyTerryScore.toFixed(2),
      r.finalScore.toFixed(2),
      r.scoresCount,
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  public exportAllAsJSON(): string {
    return JSON.stringify(this.state, null, 2);
  }

  public importFromJSON(jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.event || !parsed.submissions || !parsed.users) {
        return { success: false, message: 'Invalid backup file structure.' };
      }
      this.state = parsed;
      this.persist();
      return { success: true, message: 'Platform state imported successfully.' };
    } catch (e: any) {
      return { success: false, message: `Parse error: ${e.message}` };
    }
  }
}

// Global Singleton Instance
export const store = new HackathonStore();
