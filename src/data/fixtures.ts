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
  WebhookEndpoint
} from '../types';

export const SEED_EVENT: HackathonEvent = {
  id: 'evt-ai-challenge-2026',
  name: 'AI Innovation Challenge 2026',
  edition: '2026.1',
  tagline: 'Building the next generation of intelligent, distributed systems.',
  organizerName: 'AI Challenge Foundation',
  schedule: {
    registrationDeadline: '2026-09-25T18:00:00Z',
    submissionDeadline: '2026-09-28T18:00:00Z',
    judgingStarts: '2026-09-28T18:01:00Z',
    judgingEnds: '2026-10-08T18:00:00Z',
    winnersAnnounced: '2026-10-09T18:00:00Z',
  },
  tracks: [
    {
      id: 'trk-core',
      name: 'AI & Distributed Systems',
      description: 'Autonomous edge agents, decentralized consensus, and low-latency infrastructure.',
      prizeAmount: 8000,
    },
    {
      id: 'trk-judging',
      name: 'Healthcare & Biotech AI',
      description: 'Privacy-preserving diagnostics, offline medical triage, and clinical decision support.',
      prizeAmount: 5000,
    },
    {
      id: 'trk-security',
      name: 'Cybersecurity & Anti-Abuse',
      description: 'Sybil resistance, cryptographic auditing, quadratic mechanisms, and offline reliability.',
      prizeAmount: 3500,
    },
  ],
  prizes: [
    { id: 'prz-1', title: '1st Place — Grand Winner', amount: 8000, rank: 1, description: 'Top overall submission selected for production incubation.' },
    { id: 'prz-2', title: '2nd Place — Runner-Up', amount: 5000, rank: 2, description: 'Exceptional architectural rigor and engineering quality.' },
    { id: 'prz-3', title: '3rd Place', amount: 3500, rank: 3, description: 'Outstanding technical execution and user experience.' },
    { id: 'prz-4', title: '4th Place', amount: 2000, rank: 4, description: 'Solid implementation across core requirements.' },
    { id: 'prz-5', title: '5th Place', amount: 1500, rank: 5, description: 'High code quality and robust offline operation.' },
    { id: 'prz-innovation', title: 'Best Technical Innovation', amount: 1000, description: 'Most innovative algorithmic design.' },
    { id: 'prz-writeup-1', title: 'Best Architecture Documentation', amount: 4000, description: 'Comprehensive system architecture and data model documentation.' },
  ],
  totalPrizePool: 25000,
  status: 'judging',
  communityVotingEnabled: true,
  resultsEmbargoed: true, // Embargoed during active judging window
  minTeamSize: 1,
  maxTeamSize: 4,
};

export const SEED_USERS: User[] = [
  {
    id: 'usr-org-marcus',
    name: 'Marcus Chen',
    email: 'marcus@hackforge.dev',
    role: 'organizer',
    organization: 'AI Challenge Foundation',
    bio: 'Lead organizer. Managed dozens of competitive hackathons and engineering sprints.',
    createdAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'usr-jdg-elena',
    name: 'Dr. Elena Vance',
    email: 'elena.vance@research.org',
    role: 'judge',
    organization: 'Institute for Statistical Computing',
    bio: 'Senior Judge. Calibrated evaluator focusing on data normalization and algorithmic rigor.',
    createdAt: '2026-09-01T12:00:00Z',
  },
  {
    id: 'usr-jdg-liam',
    name: 'Liam Gallagher',
    email: 'liam@distribsys.io',
    role: 'judge',
    organization: 'Distributed Systems Foundry',
    bio: 'Systems architect & judge. Generous evaluator focusing on code ergonomics.',
    createdAt: '2026-09-02T14:30:00Z',
  },
  {
    id: 'usr-jdg-devendra',
    name: 'Devendra Kumar',
    email: 'devendra@infraforge.net',
    role: 'judge',
    organization: 'InfraForge Labs',
    bio: 'Lead DevOps engineer. Strict scoring on container hermeticity and zero-dependency guarantees.',
    createdAt: '2026-09-04T09:15:00Z',
  },
  {
    id: 'usr-part-sarah',
    name: 'Sarah Jenkins',
    email: 'sarah.j@mit.edu',
    role: 'participant',
    organization: 'MIT Distributed Media Lab',
    bio: 'Full-stack builder interested in social choice theory & quadratic voting.',
    createdAt: '2026-09-10T16:00:00Z',
  },
  {
    id: 'usr-part-alex',
    name: 'Alex Rivera',
    email: 'alex.rivera@eth.ch',
    role: 'participant',
    organization: 'ETH Zurich Cryptography Group',
    bio: 'Backend engineer passionate about Bradley-Terry probabilistic rankings.',
    createdAt: '2026-09-12T11:20:00Z',
  },
  {
    id: 'usr-part-jordan',
    name: 'Jordan Lee',
    email: 'jordan@kerneldev.org',
    role: 'participant',
    organization: 'Open Source Systems Collective',
    bio: 'Systems programmer focusing on single-binary offline hackathon engines.',
    createdAt: '2026-09-14T08:45:00Z',
  },
  {
    id: 'usr-admin-sys',
    name: 'Root Administrator',
    email: 'admin@hackforge.dev',
    role: 'admin',
    organization: 'Platform Security Operations',
    bio: 'Security operations and audit log compliance officer.',
    createdAt: '2026-08-01T00:00:00Z',
  },
];

export const SEED_TEAMS: Team[] = [
  {
    id: 'tm-consensus',
    eventId: 'evt-ai-challenge-2026',
    name: 'Team Nova',
    tagline: 'Autonomous IoT mesh network for energy conservation and laboratory safety',
    inviteCode: 'FORGE-9021',
    captainId: 'usr-part-sarah',
    members: [
      { userId: 'usr-part-sarah', name: 'Sarah Jenkins', roleInTeam: 'captain', joinedAt: '2026-09-10T16:10:00Z' },
      { userId: 'usr-part-alex', name: 'Alex Rivera', roleInTeam: 'member', joinedAt: '2026-09-12T12:00:00Z' },
    ],
    createdAt: '2026-09-10T16:05:00Z',
  },
  {
    id: 'tm-hermetic',
    eventId: 'evt-ai-challenge-2026',
    name: 'Code Titans',
    tagline: 'Privacy-preserving AI healthcare assistant and offline clinical diagnostics',
    inviteCode: 'FORGE-3382',
    captainId: 'usr-part-jordan',
    members: [
      { userId: 'usr-part-jordan', name: 'Jordan Lee', roleInTeam: 'captain', joinedAt: '2026-09-14T09:00:00Z' },
    ],
    createdAt: '2026-09-14T08:50:00Z',
  },
  {
    id: 'tm-sybilguard',
    eventId: 'evt-ai-challenge-2026',
    name: 'Neural Builders',
    tagline: 'Real-time carbon telemetry and renewable micro-grid load balancer',
    inviteCode: 'FORGE-7714',
    captainId: 'usr-part-sarah',
    members: [
      { userId: 'usr-part-sarah', name: 'Sarah Jenkins', roleInTeam: 'captain', joinedAt: '2026-09-15T10:00:00Z' },
    ],
    createdAt: '2026-09-15T09:40:00Z',
  },
  {
    id: 'tm-specforge',
    eventId: 'evt-ai-challenge-2026',
    name: 'Consensus Dynamics',
    tagline: 'Statistical fairness with Z-score cross-judge normalization & Bradley-Terry rankings',
    inviteCode: 'FORGE-4819',
    captainId: 'usr-part-alex',
    members: [
      { userId: 'usr-part-alex', name: 'Alex Rivera', roleInTeam: 'captain', joinedAt: '2026-09-16T14:00:00Z' },
    ],
    createdAt: '2026-09-16T13:30:00Z',
  },
];

export const SEED_RUBRIC: Rubric = {
  id: 'rb-ai-challenge-2026',
  eventId: 'evt-ai-challenge-2026',
  name: 'Official Multi-Criteria Rubric',
  criteria: [
    {
      id: 'crit-tier-completion',
      name: 'System Architecture & Completeness',
      description: 'Verified implementation of core requirements, robust workflows, and responsive interfaces.',
      minPoints: 0,
      maxPoints: 100,
      weight: 0.40, // 40%
    },
    {
      id: 'crit-judging-integrity',
      name: 'Algorithmic Rigor & Normalization',
      description: 'Backend role isolation, Z-score cross-judge normalization, Bradley-Terry pairwise ranking, and audit logging.',
      minPoints: 0,
      maxPoints: 100,
      weight: 0.25, // 25%
    },
    {
      id: 'crit-adoptability',
      name: 'Deployability & Self-Hosting',
      description: 'Single docker compose up command startup, seeded fixture dataset, zero cloud lock-in, complete docs.',
      minPoints: 0,
      maxPoints: 100,
      weight: 0.20, // 20%
    },
    {
      id: 'crit-code-quality',
      name: 'Code Quality & Design',
      description: 'Modular architecture, strict typing, schema clarity, defensive validation, and clean UX.',
      minPoints: 0,
      maxPoints: 100,
      weight: 0.15, // 15%
    },
  ],
};

export const SEED_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-smart-campus',
    teamId: 'tm-consensus',
    eventId: 'evt-ai-challenge-2026',
    title: 'Smart Campus Intelligence',
    tagline: 'Autonomous IoT mesh network for energy conservation and laboratory safety with edge sensors.',
    description: `## Problem
University and research campuses waste up to 34% of HVAC and lighting energy due to uncoordinated scheduling and legacy building management protocols.

## Solution
Smart Campus Intelligence introduces:
1. **Edge Intelligence**: Decentralized microcontroller sensor nodes operating on low-power LoRaWAN.
2. **Predictive Climate Control**: Machine learning model running inference locally to pre-cool and optimize power draws during peak grid tariffs.
3. **Emergency Mesh**: Peer-to-peer telemetry failover for emergency evacuation and hazardous chemical sensor alerts.`,
    trackId: 'trk-core',
    repoUrl: 'https://github.com/hackforge-demo/smart-campus',
    demoVideoUrl: 'https://cdn.hackforge.dev/demos/smart-campus.mp4',
    liveUrl: 'http://localhost:3000',
    techStack: ['TypeScript', 'React', 'Python', 'MQTT', 'Docker', 'FastAPI'],
    status: 'submitted',
    attachments: [
      { name: 'ARCHITECTURE.md', url: '/docs/ARCHITECTURE.md', size: '24 KB' },
      { name: 'DATA-MODEL.md', url: '/docs/DATA-MODEL.md', size: '18 KB' },
      { name: 'acceptance-report.txt', url: '/reports/acceptance.txt', size: '4.2 KB' },
    ],
    submittedAt: '2026-09-28T15:30:00Z',
    updatedAt: '2026-09-28T16:00:00Z',
  },
  {
    id: 'sub-health-ai',
    teamId: 'tm-hermetic',
    eventId: 'evt-ai-challenge-2026',
    title: 'AI Healthcare Assistant',
    tagline: 'Offline triage and clinical symptom analysis engine with zero external cloud dependencies.',
    description: `## Motivation
In emergency field hospitals, disaster zones, and rural clinics, reliable internet is unavailable. Clinical staff need instantaneous diagnostic decision support.

## Architecture
- **Hermetic On-Premise Core**: Entire neural reasoning pipeline packaged inside a single container image.
- **Privacy Guarantee**: Patient health data never leaves the local subnet.
- **Differential Diagnostics**: Multi-tier Bayesian symptom probability matrix.`,
    trackId: 'trk-judging',
    repoUrl: 'https://github.com/hackforge-demo/ai-healthcare-assistant',
    demoVideoUrl: 'https://cdn.hackforge.dev/demos/health-ai.mp4',
    liveUrl: 'http://localhost:8080',
    techStack: ['Python', 'FastAPI', 'React', 'Docker', 'SQLite'],
    status: 'submitted',
    attachments: [
      { name: 'CLINICAL-VALIDATION.pdf', url: '/docs/clinical.pdf', size: '1.2 MB' },
      { name: 'DOCKERFILE', url: '/Dockerfile', size: '2 KB' },
    ],
    submittedAt: '2026-09-28T14:45:00Z',
    updatedAt: '2026-09-28T14:50:00Z',
  },
  {
    id: 'sub-greencity',
    teamId: 'tm-sybilguard',
    eventId: 'evt-ai-challenge-2026',
    title: 'GreenCity Optimization Platform',
    tagline: 'Real-time carbon telemetry and renewable micro-grid load balancer with quadratic allocation.',
    description: `## Overview
GreenCity provides municipal energy authorities with verifiable renewable energy certificates and automated grid balancing.

## Key Features
1. **Dynamic Balancing**: Automatically diverts excess solar and wind generation to distributed battery reserves.
2. **Quadratic Resource Allocation**: Fair community voting on neighborhood environmental improvement grants.
3. **Immutable Audit Trail**: Cryptographic logging of every kilowatt distribution event.`,
    trackId: 'trk-security',
    repoUrl: 'https://github.com/hackforge-demo/greencity-platform',
    demoVideoUrl: 'https://cdn.hackforge.dev/demos/greencity.mp4',
    liveUrl: 'https://greencity.demo.internal',
    techStack: ['Go', 'TypeScript', 'React', 'Docker', 'PostgreSQL'],
    status: 'submitted',
    attachments: [
      { name: 'ENERGY-GRID-SPEC.md', url: '/docs/grid.md', size: '32 KB' },
    ],
    submittedAt: '2026-09-28T16:15:00Z',
    updatedAt: '2026-09-28T16:20:00Z',
  },
  {
    id: 'sub-consensus-matrix',
    teamId: 'tm-specforge',
    eventId: 'evt-ai-challenge-2026',
    title: 'ConsensusMatrix: Defensible Judging Engine',
    tagline: 'Mathematically sound scoring with Z-score standardization and Bradley-Terry pairwise solver.',
    description: `## Problem
Traditional competitions fail at scoring: lenient judges inflate scores while strict judges penalize high-tier submissions.

## Solution
1. **Dynamic Cross-Judge Normalization**: Standardizes individual judge scoring distributions to eliminate harshness and leniency biases.
2. **Bradley-Terry Pairwise Ranking Engine**: Solves maximum likelihood parameters over head-to-head project comparisons using minorization-maximization.
3. **Strict Backend-Enforced Role Isolation**: Judges never see fellow evaluations prior to official embargo lift.`,
    trackId: 'trk-judging',
    repoUrl: 'https://github.com/hackforge-demo/consensus-matrix',
    demoVideoUrl: 'https://cdn.hackforge.dev/demos/consensus-matrix.mp4',
    liveUrl: 'http://localhost:3000',
    techStack: ['TypeScript', 'React', 'Tailwind CSS', 'Docker', 'SQLite'],
    status: 'submitted',
    attachments: [
      { name: 'ARCHITECTURE.md', url: '/docs/ARCHITECTURE.md', size: '24 KB' },
      { name: 'JUDGING.md', url: '/docs/JUDGING.md', size: '18 KB' },
    ],
    submittedAt: '2026-09-28T17:00:00Z',
    updatedAt: '2026-09-28T17:10:00Z',
  },
  {
    id: 'sub-tetherflow',
    teamId: 'tm-consensus',
    eventId: 'evt-ai-challenge-2026',
    title: 'TetherFlow Data Pipeline',
    tagline: 'High-throughput peer-to-peer event broker for intermittent mesh connectivity.',
    description: `Experimental mesh pipeline. Currently in active draft development with protocol unit tests pending.`,
    trackId: 'trk-core',
    repoUrl: 'https://github.com/hackforge-demo/tetherflow',
    techStack: ['Rust', 'WebAssembly', 'TypeScript'],
    status: 'draft',
    attachments: [],
    updatedAt: '2026-09-27T10:00:00Z',
  },
];

export const SEED_ASSIGNMENTS: JudgeAssignment[] = [
  // Elena Vance (Calibrated / Rigorous)
  { id: 'asg-1', eventId: 'evt-ai-challenge-2026', judgeId: 'usr-jdg-elena', submissionId: 'sub-smart-campus', status: 'completed', assignedAt: '2026-09-28T18:05:00Z', completedAt: '2026-09-29T10:15:00Z' },
  { id: 'asg-2', eventId: 'evt-ai-challenge-2026', judgeId: 'usr-jdg-elena', submissionId: 'sub-health-ai', status: 'completed', assignedAt: '2026-09-28T18:05:00Z', completedAt: '2026-09-29T11:30:00Z' },
  { id: 'asg-3', eventId: 'evt-ai-challenge-2026', judgeId: 'usr-jdg-elena', submissionId: 'sub-greencity', status: 'completed', assignedAt: '2026-09-28T18:05:00Z', completedAt: '2026-09-29T14:00:00Z' },
  { id: 'asg-4', eventId: 'evt-ai-challenge-2026', judgeId: 'usr-jdg-elena', submissionId: 'sub-consensus-matrix', status: 'completed', assignedAt: '2026-09-28T18:05:00Z', completedAt: '2026-09-29T15:20:00Z' },

  // Liam Gallagher (Lenient evaluator: scores consistently high ~88-96)
  { id: 'asg-5', eventId: 'evt-ai-challenge-2026', judgeId: 'usr-jdg-liam', submissionId: 'sub-smart-campus', status: 'completed', assignedAt: '2026-09-28T18:05:00Z', completedAt: '2026-09-29T12:00:00Z' },
  { id: 'asg-6', eventId: 'evt-ai-challenge-2026', judgeId: 'usr-jdg-liam', submissionId: 'sub-consensus-matrix', status: 'completed', assignedAt: '2026-09-28T18:05:00Z', completedAt: '2026-09-29T13:45:00Z' },
  { id: 'asg-7', eventId: 'evt-ai-challenge-2026', judgeId: 'usr-jdg-liam', submissionId: 'sub-greencity', status: 'completed', assignedAt: '2026-09-28T18:05:00Z', completedAt: '2026-09-29T16:10:00Z' },
  { id: 'asg-8', eventId: 'evt-ai-challenge-2026', judgeId: 'usr-jdg-liam', submissionId: 'sub-health-ai', status: 'pending', assignedAt: '2026-09-28T18:05:00Z' },

  // Devendra Kumar (Strict evaluator: scores critically ~65-75)
  { id: 'asg-9', eventId: 'evt-ai-challenge-2026', judgeId: 'usr-jdg-devendra', submissionId: 'sub-smart-campus', status: 'completed', assignedAt: '2026-09-28T18:05:00Z', completedAt: '2026-09-30T09:00:00Z' },
  { id: 'asg-10', eventId: 'evt-ai-challenge-2026', judgeId: 'usr-jdg-devendra', submissionId: 'sub-health-ai', status: 'completed', assignedAt: '2026-09-28T18:05:00Z', completedAt: '2026-09-30T10:15:00Z' },
  { id: 'asg-11', eventId: 'evt-ai-challenge-2026', judgeId: 'usr-jdg-devendra', submissionId: 'sub-greencity', status: 'completed', assignedAt: '2026-09-28T18:05:00Z', completedAt: '2026-09-30T11:45:00Z' },
  { id: 'asg-12', eventId: 'evt-ai-challenge-2026', judgeId: 'usr-jdg-devendra', submissionId: 'sub-consensus-matrix', status: 'pending', assignedAt: '2026-09-28T18:05:00Z' },
];

export const SEED_SCORES: Score[] = [
  // Elena's Evaluations (Balanced: Mean ~84)
  {
    id: 'scr-1',
    assignmentId: 'asg-1',
    judgeId: 'usr-jdg-elena',
    submissionId: 'sub-smart-campus',
    criterionScores: {
      'crit-tier-completion': 92,
      'crit-judging-integrity': 88,
      'crit-adoptability': 85,
      'crit-code-quality': 90,
    },
    weightedTotal: 89.3,
    feedbackNote: 'Exemplary IoT mesh architecture and low-power sensor design. Docker setup started cleanly.',
    submittedAt: '2026-09-29T10:15:00Z',
  },
  {
    id: 'scr-2',
    assignmentId: 'asg-2',
    judgeId: 'usr-jdg-elena',
    submissionId: 'sub-health-ai',
    criterionScores: {
      'crit-tier-completion': 84,
      'crit-judging-integrity': 82,
      'crit-adoptability': 95,
      'crit-code-quality': 85,
    },
    weightedTotal: 85.85,
    feedbackNote: 'Complete offline healthcare support. Excellent container hermeticity.',
    submittedAt: '2026-09-29T11:30:00Z',
  },
  {
    id: 'scr-3',
    assignmentId: 'asg-3',
    judgeId: 'usr-jdg-elena',
    submissionId: 'sub-greencity',
    criterionScores: {
      'crit-tier-completion': 80,
      'crit-judging-integrity': 78,
      'crit-adoptability': 82,
      'crit-code-quality': 80,
    },
    weightedTotal: 79.9,
    feedbackNote: 'Strong quadratic allocation logic and clean grid telemetry.',
    submittedAt: '2026-09-29T14:00:00Z',
  },
  {
    id: 'scr-4',
    assignmentId: 'asg-4',
    judgeId: 'usr-jdg-elena',
    submissionId: 'sub-consensus-matrix',
    criterionScores: {
      'crit-tier-completion': 82,
      'crit-judging-integrity': 80,
      'crit-adoptability': 78,
      'crit-code-quality': 82,
    },
    weightedTotal: 80.7,
    feedbackNote: 'Good statistical derivation and clear documentation writeup.',
    submittedAt: '2026-09-29T15:20:00Z',
  },

  // Liam's Evaluations (Lenient: Mean ~92.5)
  {
    id: 'scr-5',
    assignmentId: 'asg-5',
    judgeId: 'usr-jdg-liam',
    submissionId: 'sub-smart-campus',
    criterionScores: {
      'crit-tier-completion': 96,
      'crit-judging-integrity': 95,
      'crit-adoptability': 94,
      'crit-code-quality': 95,
    },
    weightedTotal: 95.2,
    feedbackNote: 'Phenomenal ergonomics and fast response times. Great documentation.',
    submittedAt: '2026-09-29T12:00:00Z',
  },
  {
    id: 'scr-6',
    assignmentId: 'asg-6',
    judgeId: 'usr-jdg-liam',
    submissionId: 'sub-consensus-matrix',
    criterionScores: {
      'crit-tier-completion': 94,
      'crit-judging-integrity': 92,
      'crit-adoptability': 90,
      'crit-code-quality': 93,
    },
    weightedTotal: 92.55,
    feedbackNote: 'Very clean implementation and solid test coverage.',
    submittedAt: '2026-09-29T13:45:00Z',
  },
  {
    id: 'scr-7',
    assignmentId: 'asg-7',
    judgeId: 'usr-jdg-liam',
    submissionId: 'sub-greencity',
    criterionScores: {
      'crit-tier-completion': 90,
      'crit-judging-integrity': 88,
      'crit-adoptability': 89,
      'crit-code-quality': 90,
    },
    weightedTotal: 89.3,
    feedbackNote: 'Impressive live metrics and reactive charts.',
    submittedAt: '2026-09-29T16:10:00Z',
  },

  // Devendra's Evaluations (Strict: Mean ~70.7)
  {
    id: 'scr-8',
    assignmentId: 'asg-9',
    judgeId: 'usr-jdg-devendra',
    submissionId: 'sub-smart-campus',
    criterionScores: {
      'crit-tier-completion': 75,
      'crit-judging-integrity': 74,
      'crit-adoptability': 76,
      'crit-code-quality': 75,
    },
    weightedTotal: 74.9,
    feedbackNote: 'Good design. Minor log warnings during sensor disconnection edge cases.',
    submittedAt: '2026-09-30T09:00:00Z',
  },
  {
    id: 'scr-9',
    assignmentId: 'asg-10',
    judgeId: 'usr-jdg-devendra',
    submissionId: 'sub-health-ai',
    criterionScores: {
      'crit-tier-completion': 72,
      'crit-judging-integrity': 70,
      'crit-adoptability': 75,
      'crit-code-quality': 71,
    },
    weightedTotal: 71.95,
    feedbackNote: 'Hermetic execution confirmed. Diagnostic confidence intervals could be wider.',
    submittedAt: '2026-09-30T10:15:00Z',
  },
  {
    id: 'scr-10',
    assignmentId: 'asg-11',
    judgeId: 'usr-jdg-devendra',
    submissionId: 'sub-greencity',
    criterionScores: {
      'crit-tier-completion': 66,
      'crit-judging-integrity': 64,
      'crit-adoptability': 68,
      'crit-code-quality': 65,
    },
    weightedTotal: 65.75,
    feedbackNote: 'Adequate implementation. Missing healthcheck block in compose file.',
    submittedAt: '2026-09-30T11:45:00Z',
  },
];

export const SEED_PAIRWISE_MATCHES: PairwiseComparison[] = [
  {
    id: 'pwm-1',
    judgeId: 'usr-jdg-elena',
    submissionAId: 'sub-smart-campus',
    submissionBId: 'sub-health-ai',
    winnerId: 'sub-smart-campus',
    reason: 'Smart Campus demonstrated superior real-time telemetry responsiveness.',
    timestamp: '2026-09-29T16:30:00Z',
  },
  {
    id: 'pwm-2',
    judgeId: 'usr-jdg-liam',
    submissionAId: 'sub-smart-campus',
    submissionBId: 'sub-consensus-matrix',
    winnerId: 'sub-smart-campus',
    reason: 'More cohesive end-to-end integration and polished developer ergonomics.',
    timestamp: '2026-09-29T17:00:00Z',
  },
  {
    id: 'pwm-3',
    judgeId: 'usr-jdg-devendra',
    submissionAId: 'sub-health-ai',
    submissionBId: 'sub-greencity',
    winnerId: 'sub-health-ai',
    reason: 'Strict zero-cloud hermetic deployment guarantees verified.',
    timestamp: '2026-09-30T12:00:00Z',
  },
];

export const SEED_VOTES: CommunityVote[] = [
  {
    id: 'vt-1',
    submissionId: 'sub-smart-campus',
    voterId: 'usr-part-sarah',
    voteType: 'quadratic',
    creditsSpent: 9, // 9 tokens spent = 3 effective votes
    timestamp: '2026-09-28T20:00:00Z',
    fingerprint: 'fp_a98f12c',
  },
  {
    id: 'vt-2',
    submissionId: 'sub-health-ai',
    voterId: 'usr-part-alex',
    voteType: 'quadratic',
    creditsSpent: 4, // 4 tokens spent = 2 effective votes
    timestamp: '2026-09-28T21:15:00Z',
    fingerprint: 'fp_bb782d1',
  },
  {
    id: 'vt-3',
    submissionId: 'sub-smart-campus',
    voterId: 'usr-part-jordan',
    voteType: 'upvote',
    creditsSpent: 1,
    timestamp: '2026-09-29T08:30:00Z',
    fingerprint: 'fp_cc459e0',
  },
];

export const SEED_COMMENTS: ProjectComment[] = [
  {
    id: 'cmt-1',
    submissionId: 'sub-smart-campus',
    authorId: 'usr-jdg-elena',
    authorName: 'Dr. Elena Vance',
    authorRole: 'judge',
    content: 'Sensors mesh reconnect logic is very well engineered. Thoroughly enjoyed testing this offline.',
    timestamp: '2026-09-29T10:20:00Z',
  },
  {
    id: 'cmt-2',
    submissionId: 'sub-smart-campus',
    authorId: 'usr-part-jordan',
    authorName: 'Jordan Lee',
    authorRole: 'participant',
    content: 'Clean TypeScript architectural separation between the MQTT client and state machine.',
    timestamp: '2026-09-29T11:00:00Z',
  },
];

export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    actorId: 'usr-org-marcus',
    actorName: 'Marcus Chen',
    actorRole: 'organizer',
    action: 'EVENT_BOOTSTRAPPED',
    targetType: 'event',
    targetId: 'evt-ai-challenge-2026',
    details: 'Initial AI Innovation Challenge 2026 event bootstrapped with 3 tracks, prize structure, and 4-tier rubric.',
    timestamp: '2026-09-20T10:00:00Z',
    ipAddress: '127.0.0.1',
  },
  {
    id: 'log-2',
    actorId: 'usr-part-sarah',
    actorName: 'Sarah Jenkins',
    actorRole: 'participant',
    action: 'TEAM_CREATED',
    targetType: 'team',
    targetId: 'tm-consensus',
    details: 'Formed team "Team Nova" and generated invite token FORGE-9021.',
    timestamp: '2026-09-22T14:30:00Z',
    ipAddress: '127.0.0.1',
  },
  {
    id: 'log-3',
    actorId: 'usr-part-sarah',
    actorName: 'Sarah Jenkins',
    actorRole: 'participant',
    action: 'SUBMISSION_FINALIZED',
    targetType: 'submission',
    targetId: 'sub-smart-campus',
    details: 'Committed final submission for "Smart Campus Intelligence" before UTC deadline freeze.',
    timestamp: '2026-09-28T15:30:00Z',
    ipAddress: '127.0.0.1',
  },
  {
    id: 'log-4',
    actorId: 'usr-org-marcus',
    actorName: 'Marcus Chen',
    actorRole: 'organizer',
    action: 'JUDGE_ASSIGNMENTS_DISPATCHED',
    targetType: 'assignment',
    targetId: 'batch-01',
    details: 'Dispatched 12 conflict-isolated judging assignments across 3 active evaluators.',
    timestamp: '2026-09-28T18:05:00Z',
    ipAddress: '127.0.0.1',
  },
  {
    id: 'log-5',
    actorId: 'usr-jdg-elena',
    actorName: 'Dr. Elena Vance',
    actorRole: 'judge',
    action: 'SCORE_COMMITTED',
    targetType: 'score',
    targetId: 'scr-1',
    details: 'Submitted evaluation for "Smart Campus Intelligence" (Weighted: 89.30). Peer scores isolated.',
    timestamp: '2026-09-29T10:15:00Z',
    ipAddress: '127.0.0.1',
  },
];

export const SEED_WEBHOOKS: WebhookEndpoint[] = [
  {
    id: 'wh-1',
    url: 'http://localhost:3000/api/webhooks/listener',
    secret: 'whsec_hackforge_2026_x89',
    events: ['submission.created', 'submission.updated', 'score.submitted'],
    enabled: true,
  },
];
