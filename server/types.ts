export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: Record<string, any>;
}

export interface AuthSession {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'PARTICIPANT' | 'JUDGE' | 'ORGANIZER' | 'ADMIN';
    organization: string;
  };
}

export interface SubmissionPayload {
  title: string;
  tagline: string;
  description: string;
  problemStatement?: string;
  solution?: string;
  trackId: string;
  repoUrl: string;
  demoVideoUrl?: string;
  liveUrl?: string;
  techStack: string[];
  status?: 'DRAFT' | 'SUBMITTED';
}

export interface ScorePayload {
  submissionId: string;
  criterionScores: Record<string, number>;
  feedbackNote: string;
  finalized?: boolean;
}

export interface VotePayload {
  submissionId: string;
  voteType: 'UPVOTE' | 'QUADRATIC';
  creditsSpent: number;
  fingerprint: string;
}
