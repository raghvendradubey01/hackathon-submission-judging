import pptxgen from "pptxgenjs";
import fs from "fs";
import path from "path";

async function generatePitchDeck() {
  const pres = new pptxgen();

  pres.layout = "LAYOUT_16x9";
  pres.title = "HackForge - Enterprise Hackathon Lifecycle Engine";
  pres.company = "HackForge";
  pres.author = "HackForge Team";

  // Color Palette Definition
  const COLORS = {
    bgDark: "090D16",
    cardDark: "0F172A",
    cardBorder: "1E293B",
    primaryBlue: "0284C7",
    accentEmerald: "10B981",
    accentAmber: "F59E0B",
    accentPurple: "8B5CF6",
    accentCyan: "06B6D4",
    textWhite: "FFFFFF",
    textMuted: "94A3B8",
    textDim: "64748B",
  };

  // Helper for common slide background and top banner
  function setupSlideHeader(slide: any, title: string, category: string, badgeText: string = "HACKFORGE DECK") {
    slide.background = { color: COLORS.bgDark };

    // Header container box
    slide.addShape(pres.ShapeType.rect, {
      x: 0.5,
      y: 0.4,
      w: 12.33,
      h: 0.95,
      fill: { color: COLORS.cardDark },
      line: { color: COLORS.cardBorder, width: 1 },
    });

    // Category Pill / Tag
    slide.addText(category.toUpperCase(), {
      x: 0.7,
      y: 0.5,
      w: 2.4,
      h: 0.28,
      fontSize: 9,
      fontFace: "Arial",
      bold: true,
      color: COLORS.primaryBlue,
    });

    // Slide Title
    slide.addText(title, {
      x: 0.7,
      y: 0.75,
      w: 9.5,
      h: 0.5,
      fontSize: 20,
      fontFace: "Arial",
      bold: true,
      color: COLORS.textWhite,
    });

    // Badge Right
    slide.addText(badgeText, {
      x: 10.2,
      y: 0.65,
      w: 2.4,
      h: 0.4,
      fontSize: 10,
      fontFace: "Arial",
      bold: true,
      color: COLORS.accentEmerald,
      align: "right",
    });
  }

  // ==========================================
  // SLIDE 1: Title Slide (Cover)
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: COLORS.bgDark };

    // Outer framing card
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y: 0.6,
      w: 11.73,
      h: 6.3,
      rectRadius: 0.2,
      fill: { color: COLORS.cardDark },
      line: { color: COLORS.cardBorder, width: 1.5 },
    });

    // Pill badge
    slide.addText("SELF-HOSTABLE HACKATHON PLATFORM", {
      x: 1.3,
      y: 1.1,
      w: 4.5,
      h: 0.35,
      fontSize: 11,
      fontFace: "Arial",
      bold: true,
      color: COLORS.accentEmerald,
    });

    // Main Title
    slide.addText("HACKFORGE", {
      x: 1.25,
      y: 1.5,
      w: 10.5,
      h: 1.1,
      fontSize: 54,
      fontFace: "Arial",
      bold: true,
      color: COLORS.textWhite,
    });

    // Subtitle
    slide.addText("Enterprise-Grade Hackathon Lifecycle & Judging Engine", {
      x: 1.3,
      y: 2.7,
      w: 10.5,
      h: 0.6,
      fontSize: 22,
      fontFace: "Arial",
      bold: false,
      color: COLORS.primaryBlue,
    });

    // Value Prop Description
    slide.addText(
      "A complete, zero-cloud-lock-in platform for managing registrations, collaborative team studios, automated VCS integrity checks, blind rubric scoring, and Z-score normalized leaderboards.",
      {
        x: 1.3,
        y: 3.4,
        w: 10.2,
        h: 0.9,
        fontSize: 14,
        fontFace: "Arial",
        color: COLORS.textMuted,
        lineSpacing: 22,
      }
    );

    // 4 Key Stats / Feature Highlights
    const stats = [
      { num: "4-in-1", label: "Multi-Role RBAC", desc: "Hacker · Judge · Org · Admin" },
      { num: "100%", label: "Hermetic Offline", desc: "Zero external SaaS vendor lock-in" },
      { num: "Z-Score", label: "Score Normalization", desc: "Debiased fair cross-judge ranking" },
      { num: "SHA-256", label: "Receipt Verification", desc: "Cryptographic tamper-proof seal" },
    ];

    stats.forEach((st, idx) => {
      const colX = 1.3 + idx * 2.65;
      slide.addShape(pres.ShapeType.roundRect, {
        x: colX,
        y: 4.6,
        w: 2.45,
        h: 1.6,
        rectRadius: 0.12,
        fill: { color: COLORS.bgDark },
        line: { color: COLORS.cardBorder, width: 1 },
      });

      slide.addText(st.num, {
        x: colX + 0.15,
        y: 4.75,
        w: 2.15,
        h: 0.45,
        fontSize: 22,
        fontFace: "Arial",
        bold: true,
        color: idx === 0 ? COLORS.accentEmerald : idx === 1 ? COLORS.primaryBlue : idx === 2 ? COLORS.accentAmber : COLORS.accentPurple,
      });

      slide.addText(st.label, {
        x: colX + 0.15,
        y: 5.25,
        w: 2.15,
        h: 0.35,
        fontSize: 12,
        fontFace: "Arial",
        bold: true,
        color: COLORS.textWhite,
      });

      slide.addText(st.desc, {
        x: colX + 0.15,
        y: 5.6,
        w: 2.15,
        h: 0.45,
        fontSize: 10,
        fontFace: "Arial",
        color: COLORS.textDim,
      });
    });
  }

  // ==========================================
  // SLIDE 2: Problem & Solution
  // ==========================================
  {
    const slide = pres.addSlide();
    setupSlideHeader(slide, "The Problem With Conventional Hackathon Tools", "Executive Summary", "CHALLENGE & SOLUTION");

    // Left Column: The Problem (Red / Dark theme)
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.5,
      y: 1.6,
      w: 5.95,
      h: 5.2,
      rectRadius: 0.15,
      fill: { color: COLORS.cardDark },
      line: { color: "7F1D1D", width: 1.5 },
    });

    slide.addText("CURRENT PAIN POINTS", {
      x: 0.8,
      y: 1.85,
      w: 5.0,
      h: 0.35,
      fontSize: 11,
      fontFace: "Arial",
      bold: true,
      color: "F87171",
    });

    slide.addText("Why Hackathons Break Down at Scale", {
      x: 0.8,
      y: 2.2,
      w: 5.3,
      h: 0.45,
      fontSize: 17,
      fontFace: "Arial",
      bold: true,
      color: COLORS.textWhite,
    });

    const problems = [
      { t: "Fragile SaaS & Cloud Lock-in", d: "Relying on external portals causes outages during submission deadlines with zero offline recovery." },
      { t: "Subjective & Biased Judging", d: "Harsh vs. lenient judges distort overall standings; no mathematical compensation for skewed grading." },
      { t: "VCS & Cheating Blindspots", d: "No automated pre-flight Git validation, missing commit verification, or late branch changes." },
      { t: "Disjointed Participant Experience", d: "Teams juggle Google Forms, Discord, Devpost, and Airtable with fragmented credentials." },
    ];

    problems.forEach((p, idx) => {
      const pY = 2.8 + idx * 0.95;
      slide.addText(`❌  ${p.t}`, {
        x: 0.8,
        y: pY,
        w: 5.3,
        h: 0.3,
        fontSize: 12,
        fontFace: "Arial",
        bold: true,
        color: "FCA5A5",
      });
      slide.addText(p.d, {
        x: 1.15,
        y: pY + 0.28,
        w: 5.0,
        h: 0.55,
        fontSize: 10,
        fontFace: "Arial",
        color: COLORS.textMuted,
      });
    });

    // Right Column: The HackForge Solution (Emerald / Cyan theme)
    slide.addShape(pres.ShapeType.roundRect, {
      x: 6.85,
      y: 1.6,
      w: 6.0,
      h: 5.2,
      rectRadius: 0.15,
      fill: { color: COLORS.cardDark },
      line: { color: "065F46", width: 1.5 },
    });

    slide.addText("THE HACKFORGE SOLUTION", {
      x: 7.15,
      y: 1.85,
      w: 5.0,
      h: 0.35,
      fontSize: 11,
      fontFace: "Arial",
      bold: true,
      color: COLORS.accentEmerald,
    });

    slide.addText("Single Self-Hostable Command Center", {
      x: 7.15,
      y: 2.2,
      w: 5.4,
      h: 0.45,
      fontSize: 17,
      fontFace: "Arial",
      bold: true,
      color: COLORS.textWhite,
    });

    const solutions = [
      { t: "100% Hermetic & Self-Hostable", d: "Deploy anywhere via Docker or Node.js with built-in SQLite persistence and zero cloud dependencies." },
      { t: "Dual Judging: Rubric + Bradley-Terry", d: "Combines weighted multi-criteria cards with head-to-head pairwise preference algorithms." },
      { t: "Statistical Z-Score Normalization", d: "Normalizes grade distributions across all evaluators to guarantee fair and mathematically sound winners." },
      { t: "Automated Pre-Flight & SHA-256 Receipts", d: "Validates repository URLs, licenses, and deadlines before issuing immutable cryptographic receipts." },
    ];

    solutions.forEach((s, idx) => {
      const sY = 2.8 + idx * 0.95;
      slide.addText(`✅  ${s.t}`, {
        x: 7.15,
        y: sY,
        w: 5.4,
        h: 0.3,
        fontSize: 12,
        fontFace: "Arial",
        bold: true,
        color: COLORS.accentEmerald,
      });
      slide.addText(s.d, {
        x: 7.5,
        y: sY + 0.28,
        w: 5.1,
        h: 0.55,
        fontSize: 10,
        fontFace: "Arial",
        color: COLORS.textMuted,
      });
    });
  }

  // ==========================================
  // SLIDE 3: System Architecture & Technology Stack
  // ==========================================
  {
    const slide = pres.addSlide();
    setupSlideHeader(slide, "System Architecture & High-Performance Stack", "Architecture", "ZERO LOCK-IN");

    // 4 Architecture Layers
    const layers = [
      {
        tag: "CLIENT TIER",
        title: "Modern React 19 Frontend",
        accent: COLORS.primaryBlue,
        items: [
          "React 19 + TypeScript SPA with Vite 6 build tool",
          "Dark-modern aesthetic via Tailwind CSS v4",
          "Responsive layouts for desktop, tablet, and mobile",
          "Lucide icons + Canvas-based certificate renderers",
        ],
      },
      {
        tag: "SERVICE TIER",
        title: "Express & RESTful Engine",
        accent: COLORS.accentEmerald,
        items: [
          "Express API router with strict request validation",
          "JWT session verification and RBAC middleware",
          "Token-bucket rate limiting (120 req/min/IP)",
          "Live server health checks and Prometheus-ready telemetry",
        ],
      },
      {
        tag: "ALGORITHMIC TIER",
        title: "Fairness & Scoring Core",
        accent: COLORS.accentAmber,
        items: [
          "Multi-dimensional weighted rubric scoring engine",
          "Bradley-Terry log-odds pairwise matchup matrix",
          "Gaussian Z-score cross-judge normalization",
          "Conflict-of-interest (COI) judge auto-exclusion",
        ],
      },
      {
        tag: "PERSISTENCE & SECURITY",
        title: "Storage & Cryptographic Seals",
        accent: COLORS.accentPurple,
        items: [
          "Local high-throughput SQLite relational database",
          "SHA-256 tamper-evident submission receipts",
          "Ed25519-ready verifiable award certificate credentials",
          "One-command Docker Compose hermetic packaging",
        ],
      },
    ];

    layers.forEach((layer, idx) => {
      const colX = 0.5 + idx * 3.15;
      slide.addShape(pres.ShapeType.roundRect, {
        x: colX,
        y: 1.6,
        w: 2.95,
        h: 5.2,
        rectRadius: 0.12,
        fill: { color: COLORS.cardDark },
        line: { color: COLORS.cardBorder, width: 1.5 },
      });

      // Layer Tag
      slide.addText(layer.tag, {
        x: colX + 0.2,
        y: 1.85,
        w: 2.55,
        h: 0.3,
        fontSize: 10,
        fontFace: "Arial",
        bold: true,
        color: layer.accent,
      });

      // Layer Title
      slide.addText(layer.title, {
        x: colX + 0.2,
        y: 2.2,
        w: 2.55,
        h: 0.6,
        fontSize: 15,
        fontFace: "Arial",
        bold: true,
        color: COLORS.textWhite,
      });

      // Items bullet list
      layer.items.forEach((it, iIdx) => {
        const itemY = 2.95 + iIdx * 0.95;
        slide.addText("▪", {
          x: colX + 0.2,
          y: itemY,
          w: 0.2,
          h: 0.3,
          fontSize: 11,
          fontFace: "Arial",
          color: layer.accent,
        });
        slide.addText(it, {
          x: colX + 0.45,
          y: itemY,
          w: 2.3,
          h: 0.85,
          fontSize: 10,
          fontFace: "Arial",
          color: COLORS.textMuted,
        });
      });
    });
  }

  // ==========================================
  // SLIDE 4: End-to-End Hackathon Lifecycle
  // ==========================================
  {
    const slide = pres.addSlide();
    setupSlideHeader(slide, "The Complete Hackathon Lifecycle Engine", "Product Flow", "6 PHASES");

    const steps = [
      { num: "01", name: "Registration & Teams", desc: "Hackers create profiles, browse teammates, and form teams with unique invite codes." },
      { num: "02", name: "Specification & VCS", desc: "Teams define project title, select bounty tracks, write Markdown specs, and link GitHub URLs." },
      { num: "03", name: "Pre-Flight & Receipt", desc: "System validates live URLs, license, and freeze times before issuing an immutable SHA-256 seal." },
      { num: "04", name: "Blind Rubric Judging", desc: "Judges grade anonymously on weighted criteria without team-identity bias or conflict of interest." },
      { num: "05", name: "Z-Score Normalization", desc: "Algorithm balances strict vs lenient judges and exports verified rankings in real time." },
      { num: "06", name: "Certificates & Showcase", desc: "Automated verifiable SVG/PDF certificates issued to winners and public gallery widget embedded." },
    ];

    steps.forEach((st, idx) => {
      const row = Math.floor(idx / 3);
      const col = idx % 3;
      const bX = 0.5 + col * 4.2;
      const bY = 1.6 + row * 2.65;

      slide.addShape(pres.ShapeType.roundRect, {
        x: bX,
        y: bY,
        w: 3.95,
        h: 2.35,
        rectRadius: 0.12,
        fill: { color: COLORS.cardDark },
        line: { color: COLORS.cardBorder, width: 1.2 },
      });

      // Number badge
      slide.addText(st.num, {
        x: bX + 0.25,
        y: bY + 0.2,
        w: 0.8,
        h: 0.4,
        fontSize: 20,
        fontFace: "Arial",
        bold: true,
        color: COLORS.primaryBlue,
      });

      // Step title
      slide.addText(st.name, {
        x: bX + 1.1,
        y: bY + 0.22,
        w: 2.65,
        h: 0.4,
        fontSize: 14,
        fontFace: "Arial",
        bold: true,
        color: COLORS.textWhite,
      });

      // Step description
      slide.addText(st.desc, {
        x: bX + 0.25,
        y: bY + 0.75,
        w: 3.45,
        h: 1.4,
        fontSize: 11,
        fontFace: "Arial",
        color: COLORS.textMuted,
        lineSpacing: 16,
      });
    });
  }

  // ==========================================
  // SLIDE 5: Fair Judging & Normalization Science
  // ==========================================
  {
    const slide = pres.addSlide();
    setupSlideHeader(slide, "Evaluation Rigor: Rubrics, Bradley-Terry & Normalization", "Judging Core", "FAIRNESS & ALGORITHMS");

    // Card 1: Multi-Criteria Rubric
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.5,
      y: 1.6,
      w: 3.95,
      h: 5.2,
      rectRadius: 0.12,
      fill: { color: COLORS.cardDark },
      line: { color: COLORS.cardBorder, width: 1.2 },
    });

    slide.addText("DIMENSION 1", { x: 0.8, y: 1.85, w: 3.2, h: 0.3, fontSize: 10, fontFace: "Arial", bold: true, color: COLORS.primaryBlue });
    slide.addText("Weighted Multi-Criteria Rubrics", { x: 0.8, y: 2.15, w: 3.4, h: 0.55, fontSize: 15, fontFace: "Arial", bold: true, color: COLORS.textWhite });

    const rubricCriteria = [
      { name: "Technical Execution", wt: "30%", desc: "Code quality, architecture, robust edge handling" },
      { name: "Novelty & Innovation", wt: "25%", desc: "Originality and breakthrough problem solving" },
      { name: "Polish & User Experience", wt: "25%", desc: "Intuitive UI, responsive design, onboarding" },
      { name: "Practical Impact", wt: "20%", desc: "Viability, business reach, sustainability" },
    ];

    rubricCriteria.forEach((rc, rIdx) => {
      const rY = 2.9 + rIdx * 0.95;
      slide.addText(`${rc.name} (${rc.wt})`, { x: 0.8, y: rY, w: 3.3, h: 0.3, fontSize: 11, fontFace: "Arial", bold: true, color: COLORS.accentEmerald });
      slide.addText(rc.desc, { x: 0.8, y: rY + 0.28, w: 3.3, h: 0.55, fontSize: 10, fontFace: "Arial", color: COLORS.textMuted });
    });

    // Card 2: Bradley-Terry Pairwise Ranking
    slide.addShape(pres.ShapeType.roundRect, {
      x: 4.65,
      y: 1.6,
      w: 3.95,
      h: 5.2,
      rectRadius: 0.12,
      fill: { color: COLORS.cardDark },
      line: { color: COLORS.cardBorder, width: 1.2 },
    });

    slide.addText("DIMENSION 2", { x: 4.95, y: 1.85, w: 3.2, h: 0.3, fontSize: 10, fontFace: "Arial", bold: true, color: COLORS.accentAmber });
    slide.addText("Bradley-Terry Pairwise Engine", { x: 4.95, y: 2.15, w: 3.4, h: 0.55, fontSize: 15, fontFace: "Arial", bold: true, color: COLORS.textWhite });

    const btPoints = [
      { title: "Direct A vs. B Comparisons", desc: "Judges vote between pairs without arbitrary point scale anchor bias." },
      { title: "Latent Capability Estimation", desc: "Computes true ability parameter θ via logistic regression maximum likelihood." },
      { title: "Scale Invariance", desc: "Resolves issues where one judge rates all projects between 6-7 and another between 8-10." },
      { title: "Confidence Scoring", desc: "Calculates convergence metrics and highlights statistically tight matchups." },
    ];

    btPoints.forEach((bp, bIdx) => {
      const bY = 2.9 + bIdx * 0.95;
      slide.addText(bp.title, { x: 4.95, y: bY, w: 3.3, h: 0.3, fontSize: 11, fontFace: "Arial", bold: true, color: COLORS.accentAmber });
      slide.addText(bp.desc, { x: 4.95, y: bY + 0.28, w: 3.3, h: 0.55, fontSize: 10, fontFace: "Arial", color: COLORS.textMuted });
    });

    // Card 3: Gaussian Z-Score Normalization
    slide.addShape(pres.ShapeType.roundRect, {
      x: 8.8,
      y: 1.6,
      w: 4.0,
      h: 5.2,
      rectRadius: 0.12,
      fill: { color: COLORS.cardDark },
      line: { color: COLORS.cardBorder, width: 1.2 },
    });

    slide.addText("DIMENSION 3", { x: 9.1, y: 1.85, w: 3.2, h: 0.3, fontSize: 10, fontFace: "Arial", bold: true, color: COLORS.accentPurple });
    slide.addText("Gaussian Z-Score Normalization", { x: 9.1, y: 2.15, w: 3.4, h: 0.55, fontSize: 15, fontFace: "Arial", bold: true, color: COLORS.textWhite });

    const zPoints = [
      { title: "Formula: z = (x - μ) / σ", desc: "Centers each judge's score around mean zero and unit variance." },
      { title: "Removes Evaluator Leniency", desc: "Prevents a generous judge from crowning an average project prematurely." },
      { title: "Protects Strict Evaluator Teams", desc: "Guarantees excellent teams reviewed by harsh critics aren't unfairly penalized." },
      { title: "Auditable Mathematical Proof", desc: "Every calculation is logged with raw vs. normalized deltas available for organizers." },
    ];

    zPoints.forEach((zp, zIdx) => {
      const zY = 2.9 + zIdx * 0.95;
      slide.addText(zp.title, { x: 9.1, y: zY, w: 3.3, h: 0.3, fontSize: 11, fontFace: "Arial", bold: true, color: COLORS.accentPurple });
      slide.addText(zp.desc, { x: 9.1, y: zY + 0.28, w: 3.3, h: 0.55, fontSize: 10, fontFace: "Arial", color: COLORS.textMuted });
    });
  }

  // ==========================================
  // SLIDE 6: Role-Based Access Control (RBAC)
  // ==========================================
  {
    const slide = pres.addSlide();
    setupSlideHeader(slide, "Hermetic Role-Based Access Control (RBAC)", "Security & Roles", "4 ISOLATED ROLES");

    const roles = [
      {
        name: "Participant",
        badge: "ROLE: HACKER",
        accent: COLORS.accentEmerald,
        persona: "Elena Rostova",
        capabilities: [
          "Register & manage squad profile",
          "Invite teammates with secure join codes",
          "Submit GitHub repo, demo URL, & Markdown architecture",
          "Run pre-flight lint checks before deadline",
          "Receive cryptographic submission receipts",
        ],
      },
      {
        name: "Organizer",
        badge: "ROLE: DIRECTOR",
        accent: COLORS.primaryBlue,
        persona: "Sarah Jenkins",
        capabilities: [
          "Configure event schedule & freeze deadlines",
          "Manage prize bounty tracks and allocations",
          "Define weighted judging rubrics and criteria",
          "Inspect live registration velocity & track counters",
          "Export tamper-proof audit trails & CSV logs",
        ],
      },
      {
        name: "Judge",
        badge: "ROLE: EVALUATOR",
        accent: COLORS.accentAmber,
        persona: "Dr. Marcus Vance",
        capabilities: [
          "Double-blind evaluation queue (no team identities)",
          "Score projects on multi-criteria rubric sliders",
          "Conduct head-to-head pairwise matchups",
          "Write constructive feedback notes for hackers",
          "Conflict-of-interest exclusion guaranteed",
        ],
      },
      {
        name: "Super-Admin",
        badge: "ROLE: ROOT",
        accent: COLORS.accentPurple,
        persona: "System Administrator",
        capabilities: [
          "Raw database inspection and SQLite seeding",
          "Run automated hermetic test & acceptance suite",
          "API latency monitoring & token-bucket inspection",
          "Server configuration & environment provisioning",
          "Immediate zero-password role switcher for audits",
        ],
      },
    ];

    roles.forEach((r, idx) => {
      const colX = 0.5 + idx * 3.15;
      slide.addShape(pres.ShapeType.roundRect, {
        x: colX,
        y: 1.6,
        w: 2.95,
        h: 5.2,
        rectRadius: 0.12,
        fill: { color: COLORS.cardDark },
        line: { color: COLORS.cardBorder, width: 1.5 },
      });

      // Role Badge
      slide.addText(r.badge, {
        x: colX + 0.2,
        y: 1.85,
        w: 2.55,
        h: 0.3,
        fontSize: 10,
        fontFace: "Arial",
        bold: true,
        color: r.accent,
      });

      // Role Name
      slide.addText(r.name, {
        x: colX + 0.2,
        y: 2.15,
        w: 2.55,
        h: 0.45,
        fontSize: 16,
        fontFace: "Arial",
        bold: true,
        color: COLORS.textWhite,
      });

      // Persona
      slide.addText(`Default: ${r.persona}`, {
        x: colX + 0.2,
        y: 2.55,
        w: 2.55,
        h: 0.3,
        fontSize: 10,
        fontFace: "Arial",
        color: COLORS.textDim,
      });

      // Capabilities
      r.capabilities.forEach((cap, cIdx) => {
        const cY = 3.0 + cIdx * 0.78;
        slide.addText("✔", {
          x: colX + 0.2,
          y: cY,
          w: 0.2,
          h: 0.25,
          fontSize: 10,
          fontFace: "Arial",
          color: r.accent,
        });
        slide.addText(cap, {
          x: colX + 0.45,
          y: cY,
          w: 2.3,
          h: 0.7,
          fontSize: 10,
          fontFace: "Arial",
          color: COLORS.textMuted,
        });
      });
    });
  }

  // ==========================================
  // SLIDE 7: Security, Integrity & Cryptography
  // ==========================================
  {
    const slide = pres.addSlide();
    setupSlideHeader(slide, "Cryptographic Guarantees & Tamper-Proof Operations", "Trust & Safety", "AUDIT READY");

    const secCards = [
      {
        title: "SHA-256 Submission Receipts",
        tag: "IMMUTABLE RECEIPTS",
        accent: COLORS.accentEmerald,
        body: "Upon completing pre-flight checks, a cryptographic SHA-256 fingerprint is calculated over the team manifest, commit hash, timestamp, and spec. This receipt serves as indisputable proof of on-time submission.",
      },
      {
        title: "Double-Blind Judging Shield",
        tag: "ANTI-COLLUSION",
        accent: COLORS.primaryBlue,
        body: "Team names, university affiliations, and sponsor ties are completely stripped from evaluation cards. Judges only see anonymized project IDs and technical artifacts.",
      },
      {
        title: "Conflict of Interest (COI) Exclusion",
        tag: "NEUTRALITY GUARANTEE",
        accent: COLORS.accentAmber,
        body: "Mentors, university alumni, and corporate colleagues are automatically excluded from scoring affiliated submissions, eliminating favoritism without manual oversight.",
      },
      {
        title: "Verifiable Credential Certificates",
        tag: "ED25519 VERIFICATION",
        accent: COLORS.accentPurple,
        body: "Winners receive cryptographically verifiable certificates with signed metadata fingerprints. Anyone can verify award authenticity against the platform authority root.",
      },
    ];

    secCards.forEach((c, idx) => {
      const row = Math.floor(idx / 2);
      const col = idx % 2;
      const cX = 0.5 + col * 6.35;
      const cY = 1.6 + row * 2.65;

      slide.addShape(pres.ShapeType.roundRect, {
        x: cX,
        y: cY,
        w: 6.0,
        h: 2.35,
        rectRadius: 0.12,
        fill: { color: COLORS.cardDark },
        line: { color: COLORS.cardBorder, width: 1.2 },
      });

      slide.addText(c.tag, {
        x: cX + 0.3,
        y: cY + 0.22,
        w: 5.4,
        h: 0.3,
        fontSize: 10,
        fontFace: "Arial",
        bold: true,
        color: c.accent,
      });

      slide.addText(c.title, {
        x: cX + 0.3,
        y: cY + 0.52,
        w: 5.4,
        h: 0.4,
        fontSize: 15,
        fontFace: "Arial",
        bold: true,
        color: COLORS.textWhite,
      });

      slide.addText(c.body, {
        x: cX + 0.3,
        y: cY + 0.95,
        w: 5.4,
        h: 1.2,
        fontSize: 11,
        fontFace: "Arial",
        color: COLORS.textMuted,
        lineSpacing: 18,
      });
    });
  }

  // ==========================================
  // SLIDE 8: Deployment & Operational Readiness
  // ==========================================
  {
    const slide = pres.addSlide();
    setupSlideHeader(slide, "Zero-Effort Self-Hosting & 1-Command Deploy", "DevOps & Production", "PRODUCTION READY");

    // Left Column: Bash Command Walkthrough
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.5,
      y: 1.6,
      w: 6.5,
      h: 5.2,
      rectRadius: 0.12,
      fill: { color: "020617" },
      line: { color: COLORS.cardBorder, width: 1.5 },
    });

    slide.addText("TERMINAL INSTALLATION (DOCKER / NODE)", {
      x: 0.8,
      y: 1.85,
      w: 5.8,
      h: 0.3,
      fontSize: 10,
      fontFace: "Courier New",
      bold: true,
      color: COLORS.accentEmerald,
    });

    const terminalCode = [
      "# 1. Clone HackForge repository",
      "$ git clone https://github.com/hackforge/platform.git",
      "$ cd platform",
      "",
      "# 2. Launch production stack hermetically",
      "$ docker compose up -d",
      "",
      "# Output logs:",
      "[+] Running 2/2",
      " ✔ Container hackforge-db   Started (SQLite storage ready)",
      " ✔ Container hackforge-app  Healthy (Listening on :3000)",
      "",
      "# 3. Run automated acceptance suite",
      "$ npm run test:acceptance",
      "✔ 100% Hermetic Lifecycle Suite Passed (0 flaky tests)",
    ];

    slide.addText(terminalCode.join("\n"), {
      x: 0.8,
      y: 2.25,
      w: 5.9,
      h: 4.3,
      fontSize: 10,
      fontFace: "Courier New",
      color: "34D399",
      lineSpacing: 17,
    });

    // Right Column: Production Attributes
    slide.addShape(pres.ShapeType.roundRect, {
      x: 7.35,
      y: 1.6,
      w: 5.5,
      h: 5.2,
      rectRadius: 0.12,
      fill: { color: COLORS.cardDark },
      line: { color: COLORS.cardBorder, width: 1.2 },
    });

    slide.addText("PRODUCTION HIGHLIGHTS", {
      x: 7.65,
      y: 1.85,
      w: 4.8,
      h: 0.3,
      fontSize: 10,
      fontFace: "Arial",
      bold: true,
      color: COLORS.primaryBlue,
    });

    slide.addText("Built For Real-World Scale & Reliability", {
      x: 7.65,
      y: 2.15,
      w: 4.9,
      h: 0.4,
      fontSize: 15,
      fontFace: "Arial",
      bold: true,
      color: COLORS.textWhite,
    });

    const highlights = [
      { t: "Zero External Dependencies", d: "Runs fully air-gapped on private intranets or corporate clouds with no AWS/Firebase subscriptions." },
      { t: "Embedded SQLite Relational DB", d: "Zero complex setup; ACID compliance, atomic transactions, and instantaneous backup snapshots." },
      { t: "Automated Acceptance Verification", d: "Built-in interactive acceptance test suite to verify every API endpoint and workflow prior to launch." },
      { t: "Embeddable Live Widgets", d: "Shareable leaderboard and project gallery widgets that drop into any event website with 1 line of HTML." },
    ];

    highlights.forEach((h, idx) => {
      const hY = 2.75 + idx * 0.95;
      slide.addText(`✔  ${h.t}`, {
        x: 7.65,
        y: hY,
        w: 4.9,
        h: 0.3,
        fontSize: 11,
        fontFace: "Arial",
        bold: true,
        color: COLORS.accentEmerald,
      });
      slide.addText(h.d, {
        x: 8.0,
        y: hY + 0.28,
        w: 4.6,
        h: 0.55,
        fontSize: 10,
        fontFace: "Arial",
        color: COLORS.textMuted,
      });
    });
  }

  // ==========================================
  // SLIDE 9: Project Summary & Demonstration Call-To-Action
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: COLORS.bgDark };

    // Outer framing card
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y: 0.6,
      w: 11.73,
      h: 6.3,
      rectRadius: 0.2,
      fill: { color: COLORS.cardDark },
      line: { color: COLORS.cardBorder, width: 1.5 },
    });

    slide.addText("PROJECT SUMMARY & AUDIENCE DEMONSTRATION", {
      x: 1.3,
      y: 1.0,
      w: 8.5,
      h: 0.35,
      fontSize: 11,
      fontFace: "Arial",
      bold: true,
      color: COLORS.accentEmerald,
    });

    slide.addText("Experience HackForge in Action", {
      x: 1.3,
      y: 1.4,
      w: 10.5,
      h: 0.8,
      fontSize: 36,
      fontFace: "Arial",
      bold: true,
      color: COLORS.textWhite,
    });

    slide.addText("Live, hermetic hackathon lifecycle ready for instant demonstration.", {
      x: 1.3,
      y: 2.3,
      w: 10.5,
      h: 0.45,
      fontSize: 15,
      fontFace: "Arial",
      color: COLORS.textMuted,
    });

    // 3 Action Cards
    const demoCards = [
      {
        icon: "🎥",
        title: "35s Full HD Walkthrough Video",
        desc: "Watch the end-to-end flow from participant login to final Z-score normalized leaderboard and certificates.",
        action: "hackforge-demo.mp4",
        color: COLORS.primaryBlue,
      },
      {
        icon: "⚡",
        title: "Instant 1-Click Role Switcher",
        desc: "Switch between Participant, Organizer, Judge, and Super-Admin in real time without passwords or logins.",
        action: "Modal in Top Navigation",
        color: COLORS.accentEmerald,
      },
      {
        icon: "🏆",
        title: "Automated Certificate Generator",
        desc: "Generate and export verifiable SVG and PDF certificates of merit with Ed25519 signature verification.",
        action: "Verifiable Credential Suite",
        color: COLORS.accentPurple,
      },
    ];

    demoCards.forEach((dc, idx) => {
      const colX = 1.3 + idx * 3.55;
      slide.addShape(pres.ShapeType.roundRect, {
        x: colX,
        y: 3.1,
        w: 3.3,
        h: 3.1,
        rectRadius: 0.12,
        fill: { color: COLORS.bgDark },
        line: { color: COLORS.cardBorder, width: 1.2 },
      });

      slide.addText(dc.icon, {
        x: colX + 0.2,
        y: 3.3,
        w: 0.8,
        h: 0.5,
        fontSize: 26,
        fontFace: "Arial",
      });

      slide.addText(dc.title, {
        x: colX + 0.2,
        y: 3.9,
        w: 2.9,
        h: 0.5,
        fontSize: 13,
        fontFace: "Arial",
        bold: true,
        color: COLORS.textWhite,
      });

      slide.addText(dc.desc, {
        x: colX + 0.2,
        y: 4.45,
        w: 2.9,
        h: 1.0,
        fontSize: 10,
        fontFace: "Arial",
        color: COLORS.textMuted,
        lineSpacing: 15,
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: colX + 0.2,
        y: 5.55,
        w: 2.9,
        h: 0.45,
        rectRadius: 0.08,
        fill: { color: COLORS.cardDark },
        line: { color: dc.color, width: 1 },
      });

      slide.addText(dc.action, {
        x: colX + 0.2,
        y: 5.62,
        w: 2.9,
        h: 0.3,
        fontSize: 9,
        fontFace: "Arial",
        bold: true,
        color: dc.color,
        align: "center",
      });
    });
  }

  // Ensure public directory exists and write PPTX file
  const outPath = path.resolve("./public/hackforge-presentation.pptx");
  await pres.writeFile({ fileName: outPath });
  console.log("Successfully generated presentation deck at:", outPath);

  // Also create a copy as hackforge-slides.pptx for convenience
  fs.copyFileSync(outPath, path.resolve("./public/hackforge-slides.pptx"));
  console.log("Created alias hackforge-slides.pptx");
}

generatePitchDeck().catch((err) => {
  console.error("Error generating presentation:", err);
  process.exit(1);
});
