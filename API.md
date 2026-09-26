# API.md — Dogfood 2026 RESTful API Specification

The Dogfood Platform exposes a fully-featured, production-ready REST API. All endpoints run locally with zero external network access.

## Base URL
\`\`\`
http://localhost:3000/api
\`\`\`

---

## 1. Authentication & Sessions

### \`POST /api/auth/login\`
Authenticates a user via self-hosted credentials and returns a signed JWT token.

**Request Body:**
\`\`\`json
{
  "email": "marcus@raptors.dev"
}
\`\`\`

**Response (\`200 OK\`):**
\`\`\`json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr-org-marcus",
      "email": "marcus@raptors.dev",
      "name": "Marcus Chen",
      "role": "organizer",
      "organization": "Hackathon Raptors CIC"
    }
  }
}
\`\`\`

### \`GET /api/auth/me\`
Returns the profile and role of the currently authenticated token bearer. Requires \`Authorization: Bearer <token>\`.

---

## 2. Event Lifecycle

### \`GET /api/events\`
Retrieves current event metadata, schedule dates, tracks, and prize pool.

### \`PUT /api/events/schedule\`
*(Role: ORGANIZER, ADMIN)*
Modifies event start and end deadlines with strict UTC boundaries.

### \`POST /api/events/embargo/toggle\`
*(Role: ORGANIZER, ADMIN)*
Toggles the results embargo on/off during the active judging window.

---

## 3. Teams & Membership

### \`GET /api/teams\`
Lists all teams, their member rosters (1–4 members), and status.

### \`POST /api/teams\`
*(Role: PARTICIPANT)*
Creates a new team and issues a cryptographic invite token (\`RAPTOR-XXXX\`).

### \`POST /api/teams/join\`
*(Role: PARTICIPANT)*
Joins an existing team via invite code. Rejects duplicate memberships or overflow (>4 members).

---

## 4. Submissions & Drafts

### \`GET /api/submissions?public=true\`
Public gallery feed. Excludes all private drafts to prevent premature disclosure.

### \`POST /api/submissions\`
*(Role: PARTICIPANT)*
Saves a private draft or commits a final submission before the deadline lock.

---

## 5. Judging, Rubrics & Scoring

### \`GET /api/rubric\`
Returns active multi-criteria rubric with weights ($\sum w_i = 1.00$).

### \`GET /api/judging/assignments\`
*(Role: JUDGE, ORGANIZER)*
Returns assigned evaluation queue. **Role Isolation:** Judges only see their own assignments; peer evaluations remain hidden.

### \`POST /api/judging/scores\`
*(Role: JUDGE)*
Submits points for all rubric criteria. Validates ranges ($0 \le score \le 100$) and records feedback notes.

### \`POST /api/judging/assign-batch\`
*(Role: ORGANIZER)*
Executes algorithmic conflict-of-interest assignment across all available judges.

---

## 6. Normalization & Leaderboard

### \`GET /api/leaderboard\`
Returns Z-score standardized rankings with Bradley-Terry pairwise consensus parameters.

---

## 7. Community Voting & Anti-Abuse (T3)

### \`POST /api/votes\`
Submits a community vote. Supports quadratic token voting ($Cost = N^2$) with hardware fingerprint deduplication.

---

## 8. Export Pipelines

### \`GET /api/export/csv/:resource\`
*(Role: ORGANIZER, ADMIN)*
Generates streaming CSV downloads for:
- \`submissions.csv\`
- \`scores.csv\`
- \`leaderboard.csv\`

### \`GET /api/export/backup\`
*(Role: ORGANIZER, ADMIN)*
Generates a complete JSON state backup for zero-downtime hermetic migration.
