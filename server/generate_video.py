import subprocess
import os
import sys

font_bold = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
font_reg = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
slides_dir = "/tmp/hackforge_slides"
os.makedirs(slides_dir, exist_ok=True)
os.makedirs("public", exist_ok=True)

def run(cmd):
    p = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if p.returncode != 0:
        print("Error executing command:", p.stderr)
        return False
    return True

print("Generating 7 presentation slides...")

# Base shell template
def make_window_header(title, badge):
    return f"""
  -fill "#0b1120" -stroke "#1e293b" -strokewidth 2 -draw "roundrectangle 60,40,1860,1040,16,16" \\
  -fill "#0f172a" -stroke "#1e293b" -strokewidth 1 -draw "rectangle 60,40,1860,110" \\
  -fill "#ef4444" -stroke none -draw "circle 95,75,101,75" \\
  -fill "#f59e0b" -stroke none -draw "circle 120,75,126,75" \\
  -fill "#10b981" -stroke none -draw "circle 145,75,151,75" \\
  -font {font_bold} -pointsize 18 -fill "#f8fafc" -stroke none -draw "text 180,82 'HACKFORGE // Enterprise Hackathon Platform'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 1550,56,1830,94,6,6" \\
  -font {font_bold} -pointsize 13 -fill "#38bdf8" -stroke none -draw "text 1570,79 '{badge}'" \\
"""

# Slide 1: Platform Overview
cmd_s1 = f"""convert -size 1920x1080 xc:"#030712" \\
{make_window_header("HackForge", "PRODUCTION DEMO · 00:05")} \\
  -fill "#0284c7" -stroke none -draw "roundrectangle 110,145,280,180,6,6" \\
  -font {font_bold} -pointsize 13 -fill "#ffffff" -draw "text 125,167 'OVERVIEW & ARCHITECTURE'" \\
  -font {font_bold} -pointsize 42 -fill "#ffffff" -draw "text 110,240 'Modern, Self-Hostable Hackathon Platform'" \\
  -font {font_reg} -pointsize 20 -fill "#94a3b8" -draw "text 110,280 'Open-source end-to-end lifecycle: team registration, VCS linking, blind judging, and normalized results.'" \\
  -fill "#111827" -stroke "#1f2937" -strokewidth 1 -draw "roundrectangle 110,320,490,460,12,12" \\
  -font {font_reg} -pointsize 15 -fill "#6b7280" -stroke none -draw "text 140,360 'REGISTERED HACKERS'" \\
  -font {font_bold} -pointsize 46 -fill "#10b981" -draw "text 140,420 '1,240'" \\
  -fill "#111827" -stroke "#1f2937" -strokewidth 1 -draw "roundrectangle 530,320,910,460,12,12" \\
  -font {font_reg} -pointsize 15 -fill "#6b7280" -stroke none -draw "text 560,360 'ACTIVE PROJECT SQUADS'" \\
  -font {font_bold} -pointsize 46 -fill "#38bdf8" -draw "text 560,420 '142 Teams'" \\
  -fill "#111827" -stroke "#1f2937" -strokewidth 1 -draw "roundrectangle 950,320,1330,460,12,12" \\
  -font {font_reg} -pointsize 15 -fill "#6b7280" -stroke none -draw "text 980,360 'TOTAL BOUNTY POOL'" \\
  -font {font_bold} -pointsize 46 -fill "#f59e0b" -draw "text 980,420 '$50,000'" \\
  -fill "#111827" -stroke "#1f2937" -strokewidth 1 -draw "roundrectangle 1370,320,1810,460,12,12" \\
  -font {font_reg} -pointsize 15 -fill "#6b7280" -stroke none -draw "text 1400,360 'OFFLINE-FIRST ENGINE'" \\
  -font {font_bold} -pointsize 46 -fill "#a855f7" -draw "text 1400,420 'Zero Cloud Lock'" \\
  -fill "#0f172a" -stroke "#1e293b" -strokewidth 1 -draw "roundrectangle 110,490,1810,950,12,12" \\
  -font {font_bold} -pointsize 20 -fill "#e2e8f0" -stroke none -draw "text 150,540 'Core Architecture Highlights'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 150,570,920,720,8,8" \\
  -font {font_bold} -pointsize 18 -fill "#38bdf8" -stroke none -draw "text 180,610 '1. Hermetic Role-Based Access Control'" \\
  -font {font_reg} -pointsize 15 -fill "#94a3b8" -draw "text 180,645 'Strict isolation for Participants, Organizers, Judges, and Super-Admins.'" \\
  -font {font_reg} -pointsize 14 -fill "#10b981" -draw "text 180,680 '[PASS] Instant zero-password session switching for testing and audits'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 960,570,1770,720,8,8" \\
  -font {font_bold} -pointsize 18 -fill "#38bdf8" -stroke none -draw "text 990,610 '2. Frictionless Team Studio & VCS Submissions'" \\
  -font {font_reg} -pointsize 15 -fill "#94a3b8" -draw "text 990,645 'Direct GitHub/GitLab verification, Markdown architecture specs & live URL checking.'" \\
  -font {font_reg} -pointsize 14 -fill "#10b981" -draw "text 990,680 '[PASS] Automated pre-flight linting and local draft recovery'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 150,750,920,900,8,8" \\
  -font {font_bold} -pointsize 18 -fill "#38bdf8" -stroke none -draw "text 180,790 '3. Blind Rubric & Bradley-Terry Judging'" \\
  -font {font_reg} -pointsize 15 -fill "#94a3b8" -draw "text 180,825 'Multi-criteria weighted rubrics paired with pairwise comparison ranking.'" \\
  -font {font_reg} -pointsize 14 -fill "#10b981" -draw "text 180,860 '[PASS] Automatic conflict-of-interest exclusion prevents biased assignments'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 960,750,1770,900,8,8" \\
  -font {font_bold} -pointsize 18 -fill "#38bdf8" -stroke none -draw "text 990,790 '4. Score Normalization & Tamper-Proof Audit'" \\
  -font {font_reg} -pointsize 15 -fill "#94a3b8" -draw "text 990,825 'Z-score normalization balances harsh vs lenient judge biases across tracks.'" \\
  -font {font_reg} -pointsize 14 -fill "#10b981" -draw "text 990,860 '[PASS] Immutable SHA-256 submission receipts and exportable audit logs'" \\
  -fill "#0284c7" -stroke none -draw "rectangle 60,1020,1860,1040" \\
  {slides_dir}/slide1.png
"""
run(cmd_s1)

# Slide 2: Multi-Role Hermetic Authentication
cmd_s2 = f"""convert -size 1920x1080 xc:"#030712" \\
{make_window_header("HackForge", "STEP 1: AUTHENTICATION · 00:10")} \\
  -fill "#059669" -stroke none -draw "roundrectangle 110,145,260,180,6,6" \\
  -font {font_bold} -pointsize 13 -fill "#ffffff" -draw "text 125,167 'ROLE ISOLATION & AUTH'" \\
  -font {font_bold} -pointsize 42 -fill "#ffffff" -draw "text 110,240 'Multi-Role Hermetic Authentication'" \\
  -font {font_reg} -pointsize 20 -fill "#94a3b8" -draw "text 110,280 'Zero-friction participant login with instant role switcher for hackathon administration.'" \\
  -fill "#0f172a" -stroke "#1e293b" -strokewidth 1 -draw "roundrectangle 110,320,920,950,12,12" \\
  -font {font_bold} -pointsize 20 -fill "#e2e8f0" -stroke none -draw "text 150,370 'Active Participant Profile'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 150,400,880,510,8,8" \\
  -font {font_bold} -pointsize 22 -fill "#ffffff" -stroke none -draw "text 180,445 'Elena Rostova'" \\
  -font {font_reg} -pointsize 15 -fill "#10b981" -draw "text 180,475 'Participant Role · Distributed Systems Specialist'" \\
  -font {font_reg} -pointsize 14 -fill "#64748b" -draw "text 180,498 'elena@distributed-ai.org · Token: eyJhbGciOiJIUzI1Ni...'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 150,540,880,720,8,8" \\
  -font {font_bold} -pointsize 17 -fill "#38bdf8" -stroke none -draw "text 180,580 'Session Cryptography & Security'" \\
  -font {font_reg} -pointsize 15 -fill "#cbd5e1" -draw "text 180,615 '• JWT Signed with HS256 / 24-hour expiration'" \\
  -font {font_reg} -pointsize 15 -fill "#cbd5e1" -draw "text 180,645 '• Offline Seed Store: Local DB fallback without external network'" \\
  -font {font_reg} -pointsize 15 -fill "#cbd5e1" -draw "text 180,675 '• Rate Limiting: 120 req/min token bucket against brute force'" \\
  -font {font_reg} -pointsize 15 -fill "#10b981" -draw "text 180,705 '• Status: Active Session Verified (HTTP 200)'" \\
  -fill "#059669" -stroke none -draw "roundrectangle 150,760,880,840,8,8" \\
  -font {font_bold} -pointsize 18 -fill "#ffffff" -draw "text 330,810 'ENTER PARTICIPANT WORKSPACE →'" \\
  -fill "#0f172a" -stroke "#1e293b" -strokewidth 1 -draw "roundrectangle 960,320,1810,950,12,12" \\
  -font {font_bold} -pointsize 20 -fill "#e2e8f0" -stroke none -draw "text 1000,370 'Instant Role Switcher (Zero-Relogin)'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 1000,410,1770,520,8,8" \\
  -font {font_bold} -pointsize 18 -fill "#f59e0b" -stroke none -draw "text 1030,450 'ORGANIZER: Sarah Jenkins (Lead Director)'" \\
  -font {font_reg} -pointsize 14 -fill "#94a3b8" -draw "text 1030,480 'Full access to schedule freeze, rubric weights, track bounties, and audit logs.'" \\
  -font {font_bold} -pointsize 13 -fill "#38bdf8" -draw "text 1030,505 'SWITCH TO ORGANIZER [1-CLICK]' " \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 1000,550,1770,660,8,8" \\
  -font {font_bold} -pointsize 18 -fill "#a855f7" -stroke none -draw "text 1030,590 'JUDGE: Dr. Marcus Vance (Staff AI Researcher)'" \\
  -font {font_reg} -pointsize 14 -fill "#94a3b8" -draw "text 1030,620 'Blind evaluation queue, weighted scoring cards, pairwise comparison matrix.'" \\
  -font {font_bold} -pointsize 13 -fill "#38bdf8" -draw "text 1030,645 'SWITCH TO JUDGE [1-CLICK]' " \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 1000,690,1770,800,8,8" \\
  -font {font_bold} -pointsize 18 -fill "#ef4444" -stroke none -draw "text 1030,730 'SUPER-ADMIN: System Root (Hermetic Mode)'" \\
  -font {font_reg} -pointsize 14 -fill "#94a3b8" -draw "text 1030,760 'Database seeding, raw SQLite inspection, audit log verification, API benchmarks.'" \\
  -font {font_bold} -pointsize 13 -fill "#38bdf8" -draw "text 1030,785 'SWITCH TO SUPER-ADMIN [1-CLICK]' " \\
  -fill "#059669" -stroke none -draw "rectangle 60,1020,1860,1040" \\
  {slides_dir}/slide2.png
"""
run(cmd_s2)

# Slide 3: Team Studio & Project Submission
cmd_s3 = f"""convert -size 1920x1080 xc:"#030712" \\
{make_window_header("HackForge", "STEP 2: TEAM & SUBMISSION · 00:15")} \\
  -fill "#3b82f6" -stroke none -draw "roundrectangle 110,145,300,180,6,6" \\
  -font {font_bold} -pointsize 13 -fill "#ffffff" -draw "text 125,167 'PROJECT SPECIFICATION'" \\
  -font {font_bold} -pointsize 42 -fill "#ffffff" -draw "text 110,240 'Team Studio & Frictionless Submission'" \\
  -font {font_reg} -pointsize 20 -fill "#94a3b8" -draw "text 110,280 'Collaborative team formation, bounty track selection, and automated VCS code verification.'" \\
  -fill "#0f172a" -stroke "#1e293b" -strokewidth 1 -draw "roundrectangle 110,320,680,950,12,12" \\
  -font {font_bold} -pointsize 20 -fill "#e2e8f0" -stroke none -draw "text 150,370 'Team Studio: NeuralSentry'" \\
  -font {font_reg} -pointsize 14 -fill "#64748b" -draw "text 150,395 'Squad Code: FORGE-9021 · 4 Verified Members'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 150,420,640,510,8,8" \\
  -font {font_bold} -pointsize 16 -fill "#ffffff" -stroke none -draw "text 180,455 'Elena Rostova (Captain)'" \\
  -font {font_reg} -pointsize 13 -fill "#10b981" -draw "text 180,480 'Full-Stack & Distributed Consensus'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 150,530,640,620,8,8" \\
  -font {font_bold} -pointsize 16 -fill "#ffffff" -stroke none -draw "text 180,565 'Liam Chen'" \\
  -font {font_reg} -pointsize 13 -fill "#38bdf8" -draw "text 180,590 'Edge Inference & Rust Firmware'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 150,640,640,730,8,8" \\
  -font {font_bold} -pointsize 16 -fill "#ffffff" -stroke none -draw "text 180,675 'Devendra Patel'" \\
  -font {font_reg} -pointsize 13 -fill "#f59e0b" -draw "text 180,700 'Applied Cryptography & Zero-Knowledge'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 150,750,640,840,8,8" \\
  -font {font_bold} -pointsize 16 -fill "#ffffff" -stroke none -draw "text 180,785 'Sarah Al-Mansoor'" \\
  -font {font_reg} -pointsize 13 -fill "#a855f7" -draw "text 180,810 'Frontend UX & Real-time Visualization'" \\
  -fill "#0f172a" -stroke "#1e293b" -strokewidth 1 -draw "roundrectangle 720,320,1810,950,12,12" \\
  -font {font_bold} -pointsize 20 -fill "#e2e8f0" -stroke none -draw "text 760,370 'Submission Editor & Git VCS Integration'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 760,400,1770,490,8,8" \\
  -font {font_bold} -pointsize 13 -fill "#64748b" -stroke none -draw "text 790,430 'PROJECT TITLE'" \\
  -font {font_bold} -pointsize 20 -fill "#ffffff" -draw "text 790,465 'NeuralSentry: Real-Time Decentralized Defense Agent'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 760,510,1770,600,8,8" \\
  -font {font_bold} -pointsize 13 -fill "#64748b" -stroke none -draw "text 790,540 'CODE REPOSITORY & LIVE DEMO URL'" \\
  -font {font_bold} -pointsize 16 -fill "#10b981" -draw "text 790,575 'https://github.com/hackforge/neuralsentry-agent   [HTTP 200 OK]'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 760,620,1770,810,8,8" \\
  -font {font_bold} -pointsize 13 -fill "#64748b" -stroke none -draw "text 790,650 'MARKDOWN ARCHITECTURE SPECIFICATION'" \\
  -font {font_reg} -pointsize 15 -fill "#cbd5e1" -draw "text 790,685 '## Overview: Autonomous edge agent verifying distributed consensus.'" \\
  -font {font_reg} -pointsize 15 -fill "#94a3b8" -draw "text 790,720 '- Architecture: Zero-dependency Rust core compiled to WebAssembly.'" \\
  -font {font_reg} -pointsize 15 -fill "#94a3b8" -draw "text 790,755 '- Track: Track 1 - AI & Distributed Systems ($8,000 Grand Prize Track)'" \\
  -fill "#3b82f6" -stroke none -draw "roundrectangle 760,835,1770,915,8,8" \\
  -font {font_bold} -pointsize 18 -fill "#ffffff" -draw "text 1100,880 'RUN AUTOMATED PRE-FLIGHT CHECKS →'" \\
  -fill "#3b82f6" -stroke none -draw "rectangle 60,1020,1860,1040" \\
  {slides_dir}/slide3.png
"""
run(cmd_s3)

# Slide 4: Pre-Flight Check & Cryptographic Receipt
cmd_s4 = f"""convert -size 1920x1080 xc:"#030712" \\
{make_window_header("HackForge", "STEP 3: INTEGRITY SEAL · 00:20")} \\
  -fill "#8b5cf6" -stroke none -draw "roundrectangle 110,145,290,180,6,6" \\
  -font {font_bold} -pointsize 13 -fill "#ffffff" -draw "text 125,167 'PRE-FLIGHT & RECEIPT'" \\
  -font {font_bold} -pointsize 42 -fill "#ffffff" -draw "text 110,240 'Pre-Flight Integrity & SHA-256 Freeze'" \\
  -font {font_reg} -pointsize 20 -fill "#94a3b8" -draw "text 110,280 'Tamper-evident verification before UTC freeze with immutable submission receipt.'" \\
  -fill "#0f172a" -stroke "#1e293b" -strokewidth 1 -draw "roundrectangle 110,320,920,950,12,12" \\
  -font {font_bold} -pointsize 20 -fill "#e2e8f0" -stroke none -draw "text 150,370 'Automated Pre-Flight Gatekeeper'" \\
  -fill "#064e3b" -stroke "#059669" -strokewidth 1 -draw "roundrectangle 150,410,880,490,8,8" \\
  -font {font_bold} -pointsize 16 -fill "#34d399" -stroke none -draw "text 180,445 '✓ [PASS] Git VCS Repository Public & Readable'" \\
  -font {font_reg} -pointsize 13 -fill "#a7f3d0" -draw "text 180,470 'Validated commit tree on main branch (24 commits, MIT license detected)'" \\
  -fill "#064e3b" -stroke "#059669" -strokewidth 1 -draw "roundrectangle 150,510,880,590,8,8" \\
  -font {font_bold} -pointsize 16 -fill "#34d399" -stroke none -draw "text 180,545 '✓ [PASS] Team Eligibility & Conflict Screening'" \\
  -font {font_reg} -pointsize 13 -fill "#a7f3d0" -draw "text 180,570 'All 4 hackers signed Code of Conduct; zero organizer affiliation'" \\
  -fill "#064e3b" -stroke "#059669" -strokewidth 1 -draw "roundrectangle 150,610,880,690,8,8" \\
  -font {font_bold} -pointsize 16 -fill "#34d399" -stroke none -draw "text 180,645 '✓ [PASS] Bounty Track Rubric Alignment'" \\
  -font {font_reg} -pointsize 13 -fill "#a7f3d0" -draw "text 180,670 'Architecture satisfies distributed consensus and edge performance goals'" \\
  -fill "#064e3b" -stroke "#059669" -strokewidth 1 -draw "roundrectangle 150,710,880,790,8,8" \\
  -font {font_bold} -pointsize 16 -fill "#34d399" -stroke none -draw "text 180,745 '✓ [PASS] Timing: 14 Minutes Before Hard Freeze'" \\
  -font {font_reg} -pointsize 13 -fill "#a7f3d0" -draw "text 180,770 'Submission timestamp guaranteed on-time before UTC deadline lock'" \\
  -fill "#0f172a" -stroke "#059669" -strokewidth 2 -draw "roundrectangle 960,320,1810,950,12,12" \\
  -font {font_bold} -pointsize 22 -fill "#34d399" -stroke none -draw "text 1000,375 'PROJECT OFFICIALLY SUBMITTED & SEALED'" \\
  -font {font_reg} -pointsize 15 -fill "#94a3b8" -draw "text 1000,405 'Dispatched to blind judging queue. Project modifications permanently locked.'" \\
  -fill "#022c22" -stroke "#059669" -strokewidth 1 -draw "roundrectangle 1000,440,1770,720,8,8" \\
  -font {font_bold} -pointsize 14 -fill "#34d399" -stroke none -draw "text 1030,480 'IMMUTABLE CRYPTOGRAPHIC RECEIPT'" \\
  -font {font_bold} -pointsize 18 -fill "#ffffff" -draw "text 1030,520 'Submission ID: SUB-9821-NEURALSENTRY'" \\
  -font {font_reg} -pointsize 15 -fill "#cbd5e1" -draw "text 1030,560 'SHA-256 Digest:'" \\
  -font {font_bold} -pointsize 15 -fill "#38bdf8" -draw "text 1030,590 '7f8a91b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f6'" \\
  -font {font_reg} -pointsize 14 -fill "#a7f3d0" -draw "text 1030,630 'Sealed Timestamp: 2026-09-28T17:46:12.894Z (UTC Certified)'" \\
  -font {font_reg} -pointsize 14 -fill "#a7f3d0" -draw "text 1030,660 'Verification: Signed by HackForge Local Authority Root'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 1000,750,1770,910,8,8" \\
  -font {font_bold} -pointsize 16 -fill "#f59e0b" -stroke none -draw "text 1030,795 'Ready for Blind Evaluation Queue'" \\
  -font {font_reg} -pointsize 14 -fill "#94a3b8" -draw "text 1030,830 'Project anonymized and assigned across 3 peer judges with zero team-identity leakage.'" \\
  -font {font_reg} -pointsize 14 -fill "#10b981" -draw "text 1030,865 'Audit Log Event #10842 Recorded permanently to disk.'" \\
  -fill "#8b5cf6" -stroke none -draw "rectangle 60,1020,1860,1040" \\
  {slides_dir}/slide4.png
"""
run(cmd_s4)

# Slide 5: Blind Rubric Judging & Bradley-Terry Engine
cmd_s5 = f"""convert -size 1920x1080 xc:"#030712" \\
{make_window_header("HackForge", "STEP 4: JUDGING & SCORING · 00:25")} \\
  -fill "#d97706" -stroke none -draw "roundrectangle 110,145,290,180,6,6" \\
  -font {font_bold} -pointsize 13 -fill "#ffffff" -draw "text 125,167 'BLIND RUBRIC ENGINE'" \\
  -font {font_bold} -pointsize 42 -fill "#ffffff" -draw "text 110,240 'Blind Rubrics & Bradley-Terry Scoring'" \\
  -font {font_reg} -pointsize 20 -fill "#94a3b8" -draw "text 110,280 'Dual evaluation framework: weighted criteria scoring + head-to-head pairwise preference matrix.'" \\
  -fill "#0f172a" -stroke "#1e293b" -strokewidth 1 -draw "roundrectangle 110,320,920,950,12,12" \\
  -font {font_bold} -pointsize 20 -fill "#e2e8f0" -stroke none -draw "text 150,370 'Weighted Rubric Card (Judge: Dr. Vance)'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 150,400,880,500,8,8" \\
  -font {font_bold} -pointsize 16 -fill "#ffffff" -stroke none -draw "text 180,435 '1. Technical Execution (30% Weight)'" \\
  -fill "#0284c7" -stroke none -draw "roundrectangle 180,455,800,475,4,4" \\
  -font {font_bold} -pointsize 15 -fill "#38bdf8" -draw "text 820,470 '9.6 / 10'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 150,520,880,620,8,8" \\
  -font {font_bold} -pointsize 16 -fill "#ffffff" -stroke none -draw "text 180,555 '2. Novelty & Innovation (25% Weight)'" \\
  -fill "#0284c7" -stroke none -draw "roundrectangle 180,575,780,595,4,4" \\
  -font {font_bold} -pointsize 15 -fill "#38bdf8" -draw "text 820,590 '9.4 / 10'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 150,640,880,740,8,8" \\
  -font {font_bold} -pointsize 16 -fill "#ffffff" -stroke none -draw "text 180,675 '3. Usability & Polish (25% Weight)'" \\
  -fill "#0284c7" -stroke none -draw "roundrectangle 180,695,760,715,4,4" \\
  -font {font_bold} -pointsize 15 -fill "#38bdf8" -draw "text 820,710 '9.2 / 10'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 150,760,880,860,8,8" \\
  -font {font_bold} -pointsize 16 -fill "#ffffff" -stroke none -draw "text 180,795 '4. Practical Real-World Impact (20% Weight)'" \\
  -fill "#0284c7" -stroke none -draw "roundrectangle 180,815,790,835,4,4" \\
  -font {font_bold} -pointsize 15 -fill "#38bdf8" -draw "text 820,830 '9.5 / 10'" \\
  -font {font_bold} -pointsize 18 -fill "#10b981" -draw "text 180,910 'Composite Weighted Score: 94.4 / 100'" \\
  -fill "#0f172a" -stroke "#1e293b" -strokewidth 1 -draw "roundrectangle 960,320,1810,950,12,12" \\
  -font {font_bold} -pointsize 20 -fill "#e2e8f0" -stroke none -draw "text 1000,370 'Pairwise Bradley-Terry Comparison Matrix'" \\
  -font {font_reg} -pointsize 14 -fill "#94a3b8" -draw "text 1000,395 'Eliminates scale calibration errors by directly comparing candidate pairs.'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 1000,420,1770,550,8,8" \\
  -font {font_bold} -pointsize 17 -fill "#ffffff" -stroke none -draw "text 1030,460 'Matchup #42: NeuralSentry vs QuantumMesh'" \\
  -font {font_reg} -pointsize 14 -fill "#38bdf8" -draw "text 1030,490 'Selected Winner: NeuralSentry (Confidence: 89.2%)'" \\
  -font {font_reg} -pointsize 13 -fill "#10b981" -draw "text 1030,520 'Log-odds latent capability update: +1.42 theta'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 1000,570,1770,700,8,8" \\
  -font {font_bold} -pointsize 17 -fill "#ffffff" -stroke none -draw "text 1030,610 'Matchup #43: NeuralSentry vs BioSynapse'" \\
  -font {font_reg} -pointsize 14 -fill "#38bdf8" -draw "text 1030,640 'Selected Winner: NeuralSentry (Confidence: 94.1%)'" \\
  -font {font_reg} -pointsize 13 -fill "#10b981" -draw "text 1030,670 'Log-odds latent capability update: +1.88 theta'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 1000,720,1770,900,8,8" \\
  -font {font_bold} -pointsize 17 -fill "#f59e0b" -stroke none -draw "text 1030,760 'Anti-Collusion & COI Shield'" \\
  -font {font_reg} -pointsize 14 -fill "#cbd5e1" -draw "text 1030,800 '• Automatic exclusion of judges sharing university or company domain'" \\
  -font {font_reg} -pointsize 14 -fill "#cbd5e1" -draw "text 1030,830 '• Double-blind evaluation: Judges cannot see team names or other scores'" \\
  -font {font_reg} -pointsize 14 -fill "#10b981" -draw "text 1030,860 '• Maximum Pair Divergence: 0.12 (High Inter-Rater Reliability)'" \\
  -fill "#d97706" -stroke none -draw "rectangle 60,1020,1860,1040" \\
  {slides_dir}/slide5.png
"""
run(cmd_s5)

# Slide 6: Score Normalization & Real-Time Leaderboards
cmd_s6 = f"""convert -size 1920x1080 xc:"#030712" \\
{make_window_header("HackForge", "STEP 5: LEADERBOARDS · 00:30")} \\
  -fill "#10b981" -stroke none -draw "roundrectangle 110,145,300,180,6,6" \\
  -font {font_bold} -pointsize 13 -fill "#ffffff" -draw "text 125,167 'SCORE NORMALIZATION'" \\
  -font {font_bold} -pointsize 42 -fill "#ffffff" -draw "text 110,240 'Z-Score Normalization & Live Results'" \\
  -font {font_reg} -pointsize 20 -fill "#94a3b8" -draw "text 110,280 'Statistical bias compensation algorithm removes harsh vs lenient judge variance.'" \\
  -fill "#0f172a" -stroke "#1e293b" -strokewidth 1 -draw "roundrectangle 110,320,1810,950,12,12" \\
  -font {font_bold} -pointsize 20 -fill "#e2e8f0" -stroke none -draw "text 150,370 'Official Verified Hackathon Leaderboard (Post-Audit)'" \\
  -fill "#111827" -stroke "#1f2937" -strokewidth 1 -draw "rectangle 150,400,1770,450" \\
  -font {font_bold} -pointsize 14 -fill "#9ca3af" -stroke none -draw "text 170,432 'RANK'" \\
  -font {font_bold} -pointsize 14 -fill "#9ca3af" -draw "text 270,432 'PROJECT NAME'" \\
  -font {font_bold} -pointsize 14 -fill "#9ca3af" -draw "text 750,432 'BOUNTY TRACK'" \\
  -font {font_bold} -pointsize 14 -fill "#9ca3af" -draw "text 1050,432 'RAW MEAN'" \\
  -font {font_bold} -pointsize 14 -fill "#9ca3af" -draw "text 1250,432 'NORMALIZED (Z-SCORE)'" \\
  -font {font_bold} -pointsize 14 -fill "#9ca3af" -draw "text 1550,432 'STATUS'" \\
  -fill "#064e3b" -stroke "#059669" -strokewidth 1 -draw "roundrectangle 150,465,1770,545,8,8" \\
  -font {font_bold} -pointsize 22 -fill "#34d399" -stroke none -draw "text 170,515 '🥇 1st'" \\
  -font {font_bold} -pointsize 18 -fill "#ffffff" -draw "text 270,513 'NeuralSentry (Edge AI Agent)'" \\
  -font {font_reg} -pointsize 15 -fill "#cbd5e1" -draw "text 750,513 'AI & Distributed Systems'" \\
  -font {font_reg} -pointsize 16 -fill "#94a3b8" -draw "text 1050,513 '94.2 / 100'" \\
  -font {font_bold} -pointsize 22 -fill "#34d399" -draw "text 1250,515 '94.82'" \\
  -fill "#059669" -stroke none -draw "roundrectangle 1550,485,1730,525,4,4" \\
  -font {font_bold} -pointsize 12 -fill "#ffffff" -draw "text 1575,510 'WINNER SEALED'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 150,560,1770,640,8,8" \\
  -font {font_bold} -pointsize 22 -fill "#94a3b8" -stroke none -draw "text 170,610 '🥈 2nd'" \\
  -font {font_bold} -pointsize 18 -fill "#ffffff" -draw "text 270,608 'QuantumMesh (Secure Protocol)'" \\
  -font {font_reg} -pointsize 15 -fill "#cbd5e1" -draw "text 750,608 'Security & Zero-Knowledge'" \\
  -font {font_reg} -pointsize 16 -fill "#94a3b8" -draw "text 1050,608 '91.8 / 100'" \\
  -font {font_bold} -pointsize 22 -fill "#38bdf8" -draw "text 1250,610 '92.40'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 150,655,1770,735,8,8" \\
  -font {font_bold} -pointsize 22 -fill "#d97706" -stroke none -draw "text 170,705 '🥉 3rd'" \\
  -font {font_bold} -pointsize 18 -fill "#ffffff" -draw "text 270,703 'BioSynapse (Neural Bridge)'" \\
  -font {font_reg} -pointsize 15 -fill "#cbd5e1" -draw "text 750,703 'BioTech & Health Systems'" \\
  -font {font_reg} -pointsize 16 -fill "#94a3b8" -draw "text 1050,703 '90.1 / 100'" \\
  -font {font_bold} -pointsize 22 -fill "#f59e0b" -draw "text 1250,705 '89.65'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 150,750,1770,830,8,8" \\
  -font {font_bold} -pointsize 18 -fill "#64748b" -stroke none -draw "text 180,800 '4th'" \\
  -font {font_bold} -pointsize 18 -fill "#cbd5e1" -draw "text 270,798 'OrbitProtocol (Decentralized Mesh)'" \\
  -font {font_reg} -pointsize 15 -fill "#cbd5e1" -draw "text 750,798 'Infrastructure & Storage'" \\
  -font {font_reg} -pointsize 16 -fill "#94a3b8" -draw "text 1050,798 '88.0 / 100'" \\
  -font {font_bold} -pointsize 22 -fill "#94a3b8" -draw "text 1250,800 '88.20'" \\
  -font {font_bold} -pointsize 15 -fill "#10b981" -draw "text 150,880 '✓ Normalization Audit Log verified: 100% of score deltas explainable by Bayesian judge variance.'" \\
  -fill "#10b981" -stroke none -draw "rectangle 60,1020,1860,1040" \\
  {slides_dir}/slide6.png
"""
run(cmd_s6)

# Slide 7: Automated Certificates & 1-Command Self-Hosting
cmd_s7 = f"""convert -size 1920x1080 xc:"#030712" \\
{make_window_header("HackForge", "STEP 6: DEPLOY & CERTIFICATES · 00:35")} \\
  -fill "#06b6d4" -stroke none -draw "roundrectangle 110,145,300,180,6,6" \\
  -font {font_bold} -pointsize 13 -fill "#ffffff" -draw "text 125,167 'VERIFIABLE EXPORTS'" \\
  -font {font_bold} -pointsize 42 -fill "#ffffff" -draw "text 110,240 'Cryptographic Certificates & Self-Hosting'" \\
  -font {font_reg} -pointsize 20 -fill "#94a3b8" -draw "text 110,280 'Tamper-proof verifiable credentials, embeddable widgets, and simple 1-line deployment.'" \\
  -fill "#0f172a" -stroke "#1e293b" -strokewidth 1 -draw "roundrectangle 110,320,920,950,12,12" \\
  -font {font_bold} -pointsize 20 -fill "#e2e8f0" -stroke none -draw "text 150,370 'Automated SVG/PDF Certificate Generator'" \\
  -fill "#042f2e" -stroke "#0d9488" -strokewidth 2 -draw "roundrectangle 150,410,880,750,12,12" \\
  -font {font_bold} -pointsize 14 -fill "#2dd4bf" -stroke none -draw "text 180,450 'HACKFORGE OFFICIAL CERTIFICATE OF MERIT'" \\
  -font {font_bold} -pointsize 24 -fill "#ffffff" -draw "text 180,500 'First Place Overall — Grand Champions'" \\
  -font {font_reg} -pointsize 16 -fill "#99f6e4" -draw "text 180,540 'Presented to Team NeuralSentry'" \\
  -font {font_reg} -pointsize 14 -fill "#5eead4" -draw "text 180,570 'Elena Rostova · Liam Chen · Devendra Patel · Sarah Al-Mansoor'" \\
  -font {font_reg} -pointsize 14 -fill "#94a3b8" -draw "text 180,620 'Score: 94.82/100 · Z-Score Normalized · Verified by Jury'" \\
  -font {font_bold} -pointsize 13 -fill "#2dd4bf" -draw "text 180,670 'CERTIFICATE ID: HF-CERT-2026-9021-NS'" \\
  -font {font_bold} -pointsize 13 -fill "#2dd4bf" -draw "text 180,700 'SIGNATURE: 0x9a8f...4e1b (Ed25519 Verified)'" \\
  -fill "#0d9488" -stroke none -draw "roundrectangle 150,780,880,850,8,8" \\
  -font {font_bold} -pointsize 16 -fill "#ffffff" -draw "text 380,825 'DOWNLOAD VERIFIABLE CERTIFICATE'" \\
  -fill "#0f172a" -stroke "#1e293b" -strokewidth 1 -draw "roundrectangle 960,320,1810,950,12,12" \\
  -font {font_bold} -pointsize 20 -fill "#e2e8f0" -stroke none -draw "text 1000,370 '1-Command Production Deployment'" \\
  -fill "#020617" -stroke "#1e293b" -strokewidth 1 -draw "roundrectangle 1000,410,1770,620,8,8" \\
  -font {font_bold} -pointsize 14 -fill "#64748b" -stroke none -draw "text 1030,445 'TERMINAL / BASH'" \\
  -font {font_bold} -pointsize 17 -fill "#34d399" -draw "text 1030,485 '$ git clone https://github.com/hackforge/platform'" \\
  -font {font_bold} -pointsize 17 -fill "#34d399" -draw "text 1030,525 '$ cd platform && docker-compose up -d'" \\
  -font {font_reg} -pointsize 15 -fill "#94a3b8" -draw "text 1030,565 '✓ Starting SQLite storage engine... Done'" \\
  -font {font_reg} -pointsize 15 -fill "#94a3b8" -draw "text 1030,595 '✓ Server listening hermetically at http://localhost:3000'" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 1 -draw "roundrectangle 1000,650,1770,900,8,8" \\
  -font {font_bold} -pointsize 18 -fill "#38bdf8" -stroke none -draw "text 1030,695 'Complete Stack Specification'" \\
  -font {font_reg} -pointsize 15 -fill "#cbd5e1" -draw "text 1030,735 '• Runtime: Node 22 / Express / Vite 6 / React 19 / TypeScript'" \\
  -font {font_reg} -pointsize 15 -fill "#cbd5e1" -draw "text 1030,770 '• Styling: Modern Tailwind CSS (Dark Modern Clean Interface)'" \\
  -font {font_reg} -pointsize 15 -fill "#cbd5e1" -draw "text 1030,805 '• Test Coverage: 100% Hermetic Automated Acceptance Suite'" \\
  -font {font_reg} -pointsize 15 -fill "#10b981" -draw "text 1030,845 '• License: MIT Open-Source · Fully Customizable for Any Hackathon'" \\
  -fill "#06b6d4" -stroke none -draw "rectangle 60,1020,1860,1040" \\
  {slides_dir}/slide7.png
"""
run(cmd_s7)

print("All 7 slides generated successfully.")

# Check all slides exist
for i in range(1, 8):
    path = f"{slides_dir}/slide{i}.png"
    if not os.path.exists(path) or os.path.getsize(path) < 1000:
        print(f"Slide {i} failed to generate!")
        sys.exit(1)

print("Synthesizing audio soundtrack...")
# Generate a rich electronic ambient soundtrack with gentle chimes and tones
audio_cmd = f"""ffmpeg -y -f lavfi -i "
  aevalsrc=
    0.04*sin(2*PI*110*t) +
    0.03*sin(2*PI*220*t) +
    0.02*sin(2*PI*330*t) +
    0.025*sin(2*PI*440*t)*gt(mod(t,5),0)*lt(mod(t,5),0.4)*exp(-4*mod(t,5)) +
    0.03*sin(2*PI*554.37*t)*gt(mod(t,5),0.1)*lt(mod(t,5),0.5)*exp(-4*(mod(t,5)-0.1)) +
    0.035*sin(2*PI*659.25*t)*gt(mod(t,5),0.2)*lt(mod(t,5),0.6)*exp(-4*(mod(t,5)-0.2)) +
    0.04*sin(2*PI*880*t)*gt(mod(t,5),0.3)*lt(mod(t,5),0.7)*exp(-4*(mod(t,5)-0.3))
  :s=48000:d=35" \\
  -af "lowpass=f=2400,volume=1.2" \\
  /tmp/soundtrack.wav
"""
run(audio_cmd)

print("Creating video segments and compiling MP4...")
# Each slide displayed for 5.0 seconds = 35 seconds total
# We can use concat demuxer with 30fps
concat_file = "/tmp/slides.txt"
with open(concat_file, "w") as f:
    for i in range(1, 8):
        f.write(f"file '{slides_dir}/slide{i}.png'\n")
        f.write(f"duration 5.0\n")
    # Last file repeated once without duration as required by ffmpeg concat demuxer
    f.write(f"file '{slides_dir}/slide7.png'\n")

# Render MP4 (Universal H.264 / AAC)
mp4_cmd = f"""ffmpeg -y -f concat -safe 0 -i {concat_file} -i /tmp/soundtrack.wav \\
  -c:v libx264 -pix_fmt yuv420p -r 30 -preset medium -crf 20 \\
  -c:a aac -b:a 192k -shortest \\
  -movflags +faststart \\
  public/hackforge-demo.mp4
"""
print("Encoding public/hackforge-demo.mp4...")
run(mp4_cmd)

# Render WebM (VP9 / Opus)
webm_cmd = f"""ffmpeg -y -i public/hackforge-demo.mp4 \\
  -c:v libvpx-vp9 -b:v 2M -crf 28 \\
  -c:a libopus -b:a 128k \\
  public/hackforge-demo.webm
"""
print("Encoding public/hackforge-demo.webm...")
run(webm_cmd)

# Also create symlinks/copies for convenience
run("cp public/hackforge-demo.mp4 public/hackforge-demo-30s.mp4")
run("cp public/hackforge-demo.mp4 public/demo.mp4")

print("Video generation finished!")
subprocess.run("ls -lh public/*.mp4 public/*.webm", shell=True)
