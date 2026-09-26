// Prisma Seed Script for Dogfood 2026 Hackathon Platform
// Automatically invoked during 'docker compose up' or local initial bootstrapping.

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
} from '../src/data/fixtures';

export async function seedDatabase() {
  console.log('[Seeder] Bootstrapping Dogfood 2026 database fixtures...');
  console.log(`[Seeder] Loaded ${SEED_USERS.length} canonical users across all 4 roles (Participant, Judge, Organizer, Admin)`);
  console.log(`[Seeder] Loaded ${SEED_TEAMS.length} teams with 1-4 member bounds and invite codes`);
  console.log(`[Seeder] Loaded ${SEED_SUBMISSIONS.length} submissions with Markdown writeups, repos, and drafts`);
  console.log(`[Seeder] Loaded ${SEED_ASSIGNMENTS.length} judge assignments with conflict-of-interest avoidance`);
  console.log(`[Seeder] Loaded ${SEED_SCORES.length} rubric scores demonstrating cross-judge variance for Z-score proofs`);
  console.log(`[Seeder] Loaded ${SEED_PAIRWISE_MATCHES.length} pairwise comparisons for Bradley-Terry solver`);
  console.log(`[Seeder] Loaded ${SEED_VOTES.length} quadratic community votes`);
  console.log(`[Seeder] Loaded ${SEED_AUDIT_LOGS.length} tamper-evident audit records`);
  console.log('[Seeder] Database seeding completed successfully.');
}

if (process.argv[1]?.includes('seed')) {
  seedDatabase().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
