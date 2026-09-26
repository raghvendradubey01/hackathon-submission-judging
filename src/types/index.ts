/**
 * Core Domain Models for HackForge Platform
 * Open-source Hackathon Management, Submission & Judging Engine
 */

export type UserRole = 'participant' | 'judge' | 'organizer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  organization: string;
  bio?: string;
  createdAt: string;
}

export interface Track {
  id: string;
  name: string;
  description: string;
  prizeAmount: number;
}

export interface Prize {
  id: string;
  title: string;
  amount: number;
  description: string;
  rank?: number;
}

export interface EventSchedule {
  registrationDeadline: string;
  submissionDeadline: string;
  judgingStarts: string;
  judgingEnds: string;
  winnersAnnounced: string;
}

export interface HackathonEvent {
  id: string;
  name: string;
  edition: string;
  tagline: string;
  organizerName: string;
  schedule: EventSchedule;
  tracks: Track[];
  prizes: Prize[];
  totalPrizePool: number;
  status: 'upcoming' | 'open' | 'judging' | 'completed';
  communityVotingEnabled: boolean;
  resultsEmbargoed: boolean;
  minTeamSize: number;
  maxTeamSize: number;
}

export interface TeamMember {
  userId: string;
  name: string;
  roleInTeam: 'captain' | 'member';
  joinedAt: string;
}

export interface Team {
  id: string;
  eventId: string;
  name: string;
  tagline: string;
  inviteCode: string;
  captainId: string;
  members: TeamMember[];
  createdAt: string;
}

export interface ProjectAttachment {
  name: string;
  url: string;
  size: string;
}

export interface Submission {
  id: string;
  teamId: string;
  eventId: string;
  title: string;
  tagline: string;
  description: string;
  trackId: string;
  repoUrl: string;
  demoVideoUrl?: string;
  liveUrl?: string;
  techStack: string[];
  status: 'draft' | 'submitted';
  attachments: ProjectAttachment[];
  submittedAt?: string;
  updatedAt?: string;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  minPoints: number;
  maxPoints: number;
  weight: number; // Sum of weights across rubric must equal 1.00
}

export interface Rubric {
  id: string;
  eventId: string;
  name: string;
  criteria: RubricCriterion[];
}

export interface JudgeAssignment {
  id: string;
  eventId: string;
  judgeId: string;
  submissionId: string;
  status: 'pending' | 'completed';
  assignedAt: string;
  completedAt?: string;
}

export interface Score {
  id: string;
  assignmentId?: string;
  judgeId: string;
  submissionId: string;
  criterionScores: Record<string, number>;
  weightedTotal: number;
  feedbackNote: string;
  submittedAt: string;
}

export interface PairwiseComparison {
  id: string;
  judgeId: string;
  submissionAId: string;
  submissionBId: string;
  winnerId: string;
  reason?: string;
  timestamp: string;
}

export interface CommunityVote {
  id: string;
  submissionId: string;
  voterId: string;
  voteType: 'upvote' | 'quadratic';
  creditsSpent: number;
  timestamp: string;
  fingerprint: string;
}

export interface ProjectComment {
  id: string;
  submissionId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetType: 'event' | 'team' | 'submission' | 'rubric' | 'assignment' | 'score' | 'auth' | 'settings';
  targetId: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  secret: string;
  events: string[];
  enabled: boolean;
  lastTriggered?: string;
  lastStatus?: number;
}

export interface NormalizedResult {
  submissionId: string;
  submissionTitle: string;
  teamId: string;
  teamName: string;
  trackId: string;
  trackName: string;
  rawMean: number;
  rawRank: number;
  zScoreMean: number;
  minMaxScore?: number;
  normalizedRank: number;
  bradleyTerryScore: number;
  finalScore: number;
  rankDelta: number;
  scoresCount: number;
}

export interface JudgeStatistic {
  judgeId: string;
  judgeName: string;
  meanScore: number;
  stdDev: number;
  evaluationsCount: number;
  tendency: 'Harsh' | 'Balanced' | 'Lenient';
}
