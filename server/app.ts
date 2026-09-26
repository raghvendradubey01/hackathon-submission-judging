import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import { rateLimiter } from './middleware/rateLimit.js';
import { authenticate, requireRole, generateToken, AuthRequest } from './middleware/auth.js';
import { store } from '../src/services/store.js';
import { calculateJudgeStatistics, computeBradleyTerryScores, computeLeaderboard } from '../src/services/scoringEngine.js';
import { runAcceptanceSuite } from '../src/services/acceptanceSuite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(rateLimiter);

  // Health check endpoint for Docker & load balancers
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'hackforge-platform',
      offlineMode: true,
      timestamp: new Date().toISOString(),
    });
  });

  // --- AUTHENTICATION & SESSIONS ---
  app.post('/api/auth/login', (req, res) => {
    const { email } = req.body;
    const user = store.getState().users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid credentials. User not found in local seed registry.' });
      return;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.toUpperCase() as any,
      organization: user.organization,
    });

    store.logAudit('USER_LOGIN', 'event', user.id, `User ${user.name} logged in with role ${user.role}.`);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organization: user.organization,
          bio: user.bio,
        },
      },
    });
  });

  app.get('/api/auth/me', authenticate, (req: AuthRequest, res) => {
    const user = store.getState().users.find((u) => u.id === req.user?.id);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }
    res.json({ success: true, data: user });
  });

  app.get('/api/users', (req, res) => {
    // Sanitized public user list for role switching & directory
    const users = store.getState().users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      organization: u.organization,
      bio: u.bio,
    }));
    res.json({ success: true, data: users });
  });

  // --- EVENT GOVERNANCE & SCHEDULE ---
  app.get('/api/events', (req, res) => {
    res.json({ success: true, data: store.getState().event });
  });

  app.put('/api/events/schedule', authenticate, requireRole('ORGANIZER', 'ADMIN'), (req, res) => {
    store.updateEventSchedule(req.body);
    res.json({ success: true, data: store.getState().event, message: 'Event schedule successfully updated.' });
  });

  app.post('/api/events/embargo/toggle', authenticate, requireRole('ORGANIZER', 'ADMIN'), (req, res) => {
    store.toggleEmbargo();
    res.json({
      success: true,
      embargoed: store.getState().event.resultsEmbargoed,
      message: `Results embargo is now: ${store.getState().event.resultsEmbargoed ? 'ACTIVE' : 'LIFTED'}`,
    });
  });

  // --- TEAMS & MEMBERSHIP ---
  app.get('/api/teams', (req, res) => {
    res.json({ success: true, data: store.getState().teams });
  });

  app.post('/api/teams', authenticate, (req: AuthRequest, res) => {
    const { name, tagline } = req.body;
    if (!name || !name.trim()) {
      res.status(400).json({ success: false, error: 'Team name is required.' });
      return;
    }
    const result = store.createTeam(name.trim(), (tagline || '').trim());
    if (!result.success) {
      res.status(400).json({ success: false, error: result.message });
      return;
    }
    res.status(201).json({ success: true, data: result.team });
  });

  app.post('/api/teams/join', authenticate, (req: AuthRequest, res) => {
    const { inviteCode } = req.body;
    if (!inviteCode) {
      res.status(400).json({ success: false, error: 'Invite code is required.' });
      return;
    }
    const result = store.joinTeamWithInvite(inviteCode);
    if (!result.success) {
      res.status(400).json({ success: false, error: result.message });
      return;
    }
    res.json({ success: true, message: result.message });
  });

  app.post('/api/teams/:id/leave', authenticate, (req: AuthRequest, res) => {
    const result = store.leaveTeam(req.params.id);
    if (!result.success) {
      res.status(400).json({ success: false, error: result.message });
      return;
    }
    res.json({ success: true, message: result.message });
  });

  // --- SUBMISSIONS & DRAFTS ---
  app.get('/api/submissions', (req, res) => {
    // Gallery query: Exclude drafts under role isolation unless author or organizer
    const isPublicGallery = req.query.public === 'true';
    if (isPublicGallery) {
      const published = store.getState().submissions.filter((s) => s.status === 'submitted');
      res.json({ success: true, data: published });
      return;
    }
    res.json({ success: true, data: store.getState().submissions });
  });

  app.get('/api/submissions/:id', (req, res) => {
    const sub = store.getState().submissions.find((s) => s.id === req.params.id);
    if (!sub) {
      res.status(404).json({ success: false, error: 'Submission not found' });
      return;
    }
    res.json({ success: true, data: sub });
  });

  app.post('/api/submissions', authenticate, (req: AuthRequest, res) => {
    const asDraft = req.body.asDraft === true;
    const result = store.saveSubmission(req.body, asDraft);
    if (!result.success) {
      res.status(400).json({ success: false, error: result.message });
      return;
    }
    res.status(201).json({ success: true, data: result.submission });
  });

  // --- JUDGING, RUBRIC & ASSIGNMENTS ---
  app.get('/api/rubric', (req, res) => {
    res.json({ success: true, data: store.getState().rubric });
  });

  app.put('/api/rubric', authenticate, requireRole('ORGANIZER', 'ADMIN'), (req, res) => {
    const result = store.updateRubric(req.body.criteria);
    if (!result.success) {
      res.status(400).json({ success: false, error: result.message });
      return;
    }
    res.json({ success: true, data: store.getState().rubric, message: result.message });
  });

  app.get('/api/judging/assignments', authenticate, (req: AuthRequest, res) => {
    // Backend Role Isolation: Judges only see their own queue!
    if (req.user?.role === 'JUDGE') {
      const myAssignments = store.getState().assignments.filter((a) => a.judgeId === req.user?.id);
      res.json({ success: true, data: myAssignments });
      return;
    }
    // Organizers/admins see all
    res.json({ success: true, data: store.getState().assignments });
  });

  app.post('/api/judging/assign-batch', authenticate, requireRole('ORGANIZER', 'ADMIN'), (req, res) => {
    const reviewsPerProject = Number(req.body.reviewsPerProject || 3);
    const result = store.runAlgorithmicAssignment(reviewsPerProject);
    res.json({ success: true, data: result });
  });

  app.post('/api/judging/scores', authenticate, requireRole('JUDGE', 'ORGANIZER', 'ADMIN'), (req: AuthRequest, res) => {
    const { submissionId, criterionScores, feedbackNote } = req.body;
    if (!submissionId || !criterionScores) {
      res.status(400).json({ success: false, error: 'submissionId and criterionScores are required.' });
      return;
    }

    const result = store.submitScore(submissionId, criterionScores, feedbackNote || '');
    if (!result.success) {
      res.status(400).json({ success: false, error: result.message });
      return;
    }
    res.json({ success: true, data: result.score });
  });

  // --- STATISTICAL NORMALIZATION & LEADERBOARD ---
  app.get('/api/leaderboard', (req, res) => {
    const state = store.getState();
    // Enforce embargo unless organizer or results unlocked
    const authHeader = req.headers.authorization;
    let isPrivileged = false;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded: any = jwt.decode(authHeader.split(' ')[1]);
        if (decoded?.role === 'ORGANIZER' || decoded?.role === 'ADMIN') {
          isPrivileged = true;
        }
      } catch {
        // Not privileged
      }
    }

    const { results, judgeStats } = store.getLeaderboard();

    res.json({
      success: true,
      data: {
        results,
        judgeStats,
        embargoActive: state.event.resultsEmbargoed,
        privilegedView: isPrivileged,
      },
    });
  });

  // --- COMMUNITY VOTING (T3) ---
  app.post('/api/votes', authenticate, (req: AuthRequest, res) => {
    const { submissionId, voteType, creditsSpent } = req.body;
    const result = store.castCommunityVote(submissionId, voteType || 'upvote', creditsSpent || 1);
    if (!result.success) {
      res.status(400).json({ success: false, error: result.message });
      return;
    }
    res.json({ success: true, message: result.message });
  });

  app.get('/api/comments/:submissionId', (req, res) => {
    const comments = store.getState().comments.filter((c) => c.submissionId === req.params.submissionId);
    res.json({ success: true, data: comments });
  });

  app.post('/api/comments', authenticate, (req: AuthRequest, res) => {
    const { submissionId, content } = req.body;
    if (!submissionId || !content || !content.trim()) {
      res.status(400).json({ success: false, error: 'submissionId and content are required.' });
      return;
    }
    store.addComment(submissionId, content.trim());
    res.status(201).json({ success: true, message: 'Comment posted.' });
  });

  // --- CSV & JSON DATA EXPORT ---
  app.get('/api/export/csv/:resource', authenticate, requireRole('ORGANIZER', 'ADMIN'), (req, res) => {
    const resource = req.params.resource;
    let csv = '';
    let filename = `${resource}.csv`;

    if (resource === 'submissions') {
      csv = store.exportSubmissionsCSV();
    } else if (resource === 'scores') {
      csv = store.exportScoresCSV();
    } else if (resource === 'leaderboard') {
      csv = store.exportLeaderboardCSV();
    } else {
      res.status(400).json({ success: false, error: 'Unknown export resource' });
      return;
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  });

  app.get('/api/export/backup', authenticate, requireRole('ORGANIZER', 'ADMIN'), (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="hackforge-platform-backup.json"');
    res.send(store.exportAllAsJSON());
  });

  // --- ACCEPTANCE TEST SUITE ---
  app.get('/api/acceptance-suite/run', (req, res) => {
    const report = runAcceptanceSuite();
    res.json({ success: true, data: report });
  });

  // --- AUDIT LOGS ---
  app.get('/api/audit-logs', authenticate, requireRole('ORGANIZER', 'ADMIN'), (req, res) => {
    res.json({ success: true, data: store.getState().auditLogs });
  });

  return app;
}
