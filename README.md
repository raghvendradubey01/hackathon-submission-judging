# Hackathon Platform

> **An open-source, self-hostable platform for managing hackathons from registration to results.**

Hackathon Platform is a full-stack application designed to simplify the complete hackathon lifecycle — from event creation and team formation to project submissions, judge assignment, scoring, normalization, community voting, and final results.

The platform is designed to be **self-hosted, modular, secure, and production-oriented**, with all core functionality running locally without depending on external cloud services.

---

## ✨ Features

### 👤 Authentication & Roles

* User registration and login
* Secure authentication
* Session management
* Role-based access control
* Participant, Judge, Organizer, and Admin roles
* Backend-enforced authorization

### 🏆 Event Management

Organizers can:

* Create and manage events
* Configure event dates
* Create tracks
* Configure prizes
* Manage event lifecycle
* Control registration, submission, judging, and voting phases

### 👥 Team Management

* Create teams
* Invite team members
* Accept/reject invitations
* Manage team members
* Team ownership and permissions
* Secure invitation workflow

### 🚀 Project Submissions

Participants can:

* Create projects
* Save submissions as drafts
* Edit project details
* Add repository and demo links
* Add technologies and project descriptions
* Preview submissions
* Submit projects
* Track submission status

The platform enforces submission deadlines and prevents unauthorized modifications after submission deadlines.

### 🔍 Public Project Gallery

* Browse projects
* Search projects
* Filter by track
* View project details
* View team information
* Discover submitted projects

### ⚖️ Judge Management

Organizers can:

* Add judges
* Manage judges
* Assign judges to projects
* Batch-assign judges
* Reassign judges
* Monitor judging progress

Judges can only access projects assigned to them.

### 📊 Configurable Judging System

The judging system supports:

* Custom judging rubrics
* Multiple criteria
* Configurable weights
* Maximum scores
* Judge comments
* Draft scoring
* Final score submission
* Judging progress tracking

Example rubric:

| Criterion                | Weight |
| ------------------------ | -----: |
| Innovation               |    25% |
| Technical Implementation |    30% |
| Impact                   |    20% |
| Design & UX              |    15% |
| Presentation             |    10% |

### 📈 Score Normalization

The platform supports cross-judge score normalization to account for differences in judging patterns.

The system maintains:

* Raw scores
* Judge statistics
* Normalized scores
* Final scores

Original scores are preserved for transparency and auditability.

### 🗳️ Community Voting

Configurable community voting includes:

* Voting periods
* Duplicate vote prevention
* Rate limiting
* Hidden results during voting
* Randomized project ordering
* Comments
* Voting audit trails

### 🔐 Audit & Security

Important platform actions can be recorded through audit logs, including:

* Login events
* Team creation
* Invitations
* Project submissions
* Judge assignments
* Score changes
* Score finalization
* Voting activity

The platform also uses server-side authorization and validation to protect sensitive operations.

### 📤 Data Export

Export important platform data as CSV:

* Participants
* Teams
* Projects
* Judges
* Judge assignments
* Raw scores
* Normalized scores
* Results
* Audit data

### 🔌 REST API

The platform is designed around an API-first architecture.

The API supports operations for:

* Authentication
* Events
* Teams
* Projects
* Submissions
* Judges
* Assignments
* Rubrics
* Scores
* Results
* Voting
* Audit logs

---

# 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      Frontend       │
                    │ React + TypeScript  │
                    │      + Vite         │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │       Backend       │
                    │ Node.js + TypeScript│
                    │  Authentication     │
                    │  Authorization      │
                    │  Business Logic     │
                    └──────────┬──────────┘
                               │
                               │ Prisma ORM
                               ▼
                    ┌─────────────────────┐
                    │     PostgreSQL      │
                    │      Database       │
                    └─────────────────────┘
```

The application is containerized using Docker and can be deployed locally using Docker Compose.

---

# 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

### Backend

* Node.js
* TypeScript
* REST API

### Database

* PostgreSQL
* Prisma ORM

### DevOps

* Docker
* Docker Compose

### Testing

* Unit/API tests
* Integration tests
* End-to-end testing

---

# 📁 Project Structure

```text
hackathon-platform/
│
├── apps/
│   ├── web/                 # Frontend
│   └── api/                 # Backend API
│
├── packages/
│   ├── database/            # Database layer
│   ├── shared/              # Shared types/utilities
│   └── validation/          # Validation schemas
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── tests/
│
├── docs/
│
├── docker/
│
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── README.md
├── ARCHITECTURE.md
├── DATA-MODEL.md
├── JUDGING.md
└── THREAT-MODEL.md
```

> The exact structure may evolve as the project develops.

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

* Docker
* Docker Compose
* Git

---

## Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/hackathon-platform.git

cd hackathon-platform
```

Replace `YOUR-USERNAME` with your GitHub username.

---

## Environment Configuration

Create an environment file:

```bash
cp .env.example .env
```

Update the environment variables if required.

---

## Run with Docker

Start the complete application:

```bash
docker compose up
```

For detached mode:

```bash
docker compose up -d
```

The application should automatically:

1. Start PostgreSQL
2. Run database migrations
3. Seed demo data
4. Start the backend
5. Start the frontend

---

# 🧪 Testing

Run the test suite using the project's configured test commands.

Example:

```bash
npm test
```

For API tests:

```bash
npm run test:api
```

For end-to-end tests:

```bash
npm run test:e2e
```

> Use the commands defined in the project configuration if they differ from the examples above.

---

# 🔑 Demo Roles

The development seed can provide demo accounts for:

| Role        | Purpose                          |
| ----------- | -------------------------------- |
| Participant | Create teams and submit projects |
| Judge       | Review assigned projects         |
| Organizer   | Manage events and judging        |
| Admin       | Manage the platform              |

Demo credentials should be documented in the project's local development configuration and should never contain real production credentials.

---

# 🔄 Typical Workflow

```text
Create Event
     ↓
Configure Tracks & Prizes
     ↓
Participants Register
     ↓
Teams Form
     ↓
Projects Created
     ↓
Projects Submitted
     ↓
Judges Assigned
     ↓
Rubrics Configured
     ↓
Judging
     ↓
Score Normalization
     ↓
Community Voting
     ↓
Results
     ↓
Export / Records
```

---

# ⚖️ Judging Methodology

The judging engine supports weighted criteria.

For example:

```text
Final Raw Score =
(Criterion 1 × Weight 1) +
(Criterion 2 × Weight 2) +
...
```

Cross-judge normalization can then be applied to reduce differences in individual judging patterns.

The original raw scores are retained so that normalized results remain auditable.

More details are available in:

```text
JUDGING.md
```

---

# 🔐 Security

The platform is designed with security and role isolation in mind.

Key protections include:

* Password hashing
* Server-side authorization
* Input validation
* Database constraints
* Rate limiting
* Duplicate vote prevention
* Audit logging
* Secure session handling
* No hard-coded secrets

Frontend permissions are not treated as the security boundary. Sensitive operations are validated on the backend.

---

# 🐳 Self-Hosting

The platform is designed to be self-hosted.

Core functionality does not require:

* Firebase
* Supabase
* Auth0
* Clerk
* Hosted databases
* External authentication providers
* External APIs
* Cloud accounts

The goal is to provide a complete locally deployable platform.

---

# 📚 Documentation

Additional technical documentation:

* `ARCHITECTURE.md` — System architecture and technical decisions
* `DATA-MODEL.md` — Database schema and relationships
* `JUDGING.md` — Judging, scoring and normalization methodology
* `THREAT-MODEL.md` — Security and abuse considerations
* `API.md` — REST API documentation
* `acceptance-report.txt` — Feature/acceptance test status

---

# 🤝 Contributing

Contributions are welcome.

To contribute:

```bash
git clone https://github.com/YOUR-USERNAME/hackathon-platform.git
cd hackathon-platform
```

Create a feature branch:

```bash
git checkout -b feature/your-feature
```

Make your changes, test them, and submit a pull request.

---

# 📄 License

This project is open source and released under the **MIT License**.

See:

```text
LICENSE
```

for details.

---

# 🎯 Project Goal

The goal of Hackathon Platform is to provide a reliable, transparent, and self-hostable system for managing the complete hackathon lifecycle — from participant registration and project submission to judging, scoring, voting, and results.

Built with a focus on:

**Correctness • Transparency • Security • Maintainability • Self-Hosting**
