import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  Users, 
  FileCode2, 
  Sparkles, 
  Terminal, 
  ArrowRight,
  Clock,
  Layers,
  Check
} from 'lucide-react';
import { HackathonEvent, User } from '../types';

interface VideoWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: HackathonEvent;
  currentUser: User;
}

interface Chapter {
  id: number;
  timeStart: number; // in seconds
  timeEnd: number;
  title: string;
  subtitle: string;
  badge: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: 1,
    timeStart: 0,
    timeEnd: 6,
    title: 'Fast Authentication & Participant Session',
    subtitle: 'Elena Rostova logs into HackForge via zero-friction hermetic auth.',
    badge: 'Step 1: Auth & Login',
  },
  {
    id: 2,
    timeStart: 6,
    timeEnd: 12,
    title: 'Team Formation & Track Selection',
    subtitle: 'Joins "NeuralSentry" via invite code and selects AI & Distributed Systems track.',
    badge: 'Step 2: Team & Track',
  },
  {
    id: 3,
    timeStart: 12,
    timeEnd: 18,
    title: 'Project Specification & VCS Linking',
    subtitle: 'Enters project title, GitHub repo, live demo URL, and architecture spec.',
    badge: 'Step 3: Specification',
  },
  {
    id: 4,
    timeStart: 18,
    timeEnd: 24,
    title: 'Automated Pre-Flight & Offline Auto-Save',
    subtitle: 'Local-first offline store validates repo accessibility and attachment integrity.',
    badge: 'Step 4: Pre-Flight Check',
  },
  {
    id: 5,
    timeStart: 24,
    timeEnd: 30,
    title: 'Hard Freeze Submission & Cryptographic Receipt',
    subtitle: 'Submits before UTC freeze; receives immutable SHA-256 verification hash.',
    badge: 'Step 5: Final Submission',
  },
];

const TOTAL_DURATION = 30; // 30 seconds exact

export const VideoWalkthroughModal: React.FC<VideoWalkthroughModalProps> = ({
  isOpen,
  onClose,
  event,
  currentUser,
}) => {
  if (!isOpen) return null;

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);

  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Audio synthesis helper for clean tactile UI sound effects
  const playBeep = (freq = 440, type: OscillatorType = 'sine', duration = 0.08) => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Ignore audio context errors if browser policies block
    }
  };

  // Main playback timer loop
  useEffect(() => {
    if (!isPlaying) {
      lastTimestampRef.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }
      const deltaSec = ((timestamp - lastTimestampRef.current) / 1000) * playbackSpeed;
      lastTimestampRef.current = timestamp;

      setCurrentTime((prev) => {
        const next = prev + deltaSec;
        if (next >= TOTAL_DURATION) {
          setIsPlaying(false);
          return TOTAL_DURATION;
        }
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, playbackSpeed]);

  const activeChapter = CHAPTERS.find(
    (c) => currentTime >= c.timeStart && currentTime < c.timeEnd
  ) || CHAPTERS[CHAPTERS.length - 1];

  const handlePlayPause = () => {
    if (currentTime >= TOTAL_DURATION) {
      setCurrentTime(0);
      setIsPlaying(true);
      playBeep(520, 'sine', 0.1);
    } else {
      setIsPlaying(!isPlaying);
      playBeep(isPlaying ? 380 : 520, 'sine', 0.08);
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
    playBeep(600, 'sine', 0.12);
  };

  const handleSeek = (newTime: number) => {
    setCurrentTime(Math.min(TOTAL_DURATION, Math.max(0, newTime)));
    playBeep(480, 'sine', 0.05);
  };

  // Cursor coordinate interpolation for realistic simulated mouse trajectory
  const getCursorPosition = (time: number) => {
    if (time < 2.5) {
      // Moving to Login Button
      const progress = time / 2.5;
      return { x: 25 + progress * 50, y: 70, click: time > 2.2 && time < 2.5 };
    } else if (time < 6.0) {
      // Logged in, gliding to navigation
      const progress = (time - 2.5) / 3.5;
      return { x: 75 - progress * 40, y: 70 - progress * 50, click: false };
    } else if (time < 9.0) {
      // Navigating to Team Studio and selecting Track
      const progress = (time - 6.0) / 3.0;
      return { x: 35 + progress * 30, y: 20 + progress * 25, click: time > 8.6 && time < 9.0 };
    } else if (time < 14.0) {
      // Filling in Title & VCS Repo inputs
      const progress = (time - 9.0) / 5.0;
      return { x: 65 - progress * 20, y: 45 + progress * 15, click: time > 11.0 && time < 11.4 };
    } else if (time < 20.0) {
      // Adding Live Demo & Tech Stack
      const progress = (time - 14.0) / 6.0;
      return { x: 45 + progress * 25, y: 60 + progress * 10, click: time > 18.0 && time < 18.4 };
    } else if (time < 25.0) {
      // Inspecting Pre-Flight Check & Hovering Submit Button
      const progress = (time - 20.0) / 5.0;
      return { x: 70 + progress * 8, y: 70 + progress * 12, click: false };
    } else {
      // Clicking Final Submit & Receipt
      return { x: 78, y: 82, click: time > 25.5 && time < 26.2 };
    }
  };

  const cursorState = getCursorPosition(currentTime);

  // Real WebM Video Export via Canvas 2D + MediaRecorder
  const handleExportVideo = async () => {
    setIsExporting(true);
    setExportProgress(0);

    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      alert('Unable to initialize HTML5 2D Canvas for video encoding.');
      setIsExporting(false);
      return;
    }

    const stream = canvas.captureStream(30); // 30 fps
    let recorder: MediaRecorder;
    try {
      const mimeTypes = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
      const supportedMime = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || 'video/webm';
      recorder = new MediaRecorder(stream, { mimeType: supportedMime, videoBitsPerSecond: 2500000 });
    } catch {
      alert('Video recording is not supported in this browser environment.');
      setIsExporting(false);
      return;
    }

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'hackforge-login-to-submission-30s.webm';
      a.click();
      URL.revokeObjectURL(url);
      setIsExporting(false);
      setExportProgress(100);
    };

    recorder.start();

    // Render 30 frames per second over 30 seconds = 900 frames total (fast render mode)
    const totalFrames = 30 * 30; // 900 frames
    const frameIntervalMs = 1000 / 30;

    for (let f = 0; f < totalFrames; f++) {
      const simTime = (f / totalFrames) * TOTAL_DURATION;

      // Draw background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 1280, 720);

      // Window Frame
      ctx.fillStyle = '#ffffff';
      ctx.roundRect(40, 40, 1200, 640, 12);
      ctx.fill();

      // Top bar
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(40, 40, 1200, 52);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(40, 91, 1200, 1);

      // Window traffic lights
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(65, 66, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath(); ctx.arc(85, 66, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.beginPath(); ctx.arc(105, 66, 6, 0, Math.PI * 2); ctx.fill();

      // App Title
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.fillText('HackForge Platform · 30-Second Walkthrough', 130, 72);

      // Draw active chapter content
      if (simTime < 6) {
        // Step 1: Login
        ctx.fillStyle = '#f1f5f9';
        ctx.roundRect(380, 160, 520, 360, 12);
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 22px Inter, sans-serif';
        ctx.fillText('Sign In to HackForge', 420, 215);

        ctx.font = '14px Inter, sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText('Zero-lockin instant authentication with participant role', 420, 245);

        // Account card
        ctx.fillStyle = '#ffffff';
        ctx.roundRect(420, 280, 440, 90, 8);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.fillText('Elena Rostova (Participant)', 445, 318);
        ctx.font = '13px monospace';
        ctx.fillStyle = '#059669';
        ctx.fillText('Token: eyJhbGciOiJIUzI1Ni... (Verified)', 445, 345);

        // Login Button
        ctx.fillStyle = '#0f172a';
        ctx.roundRect(420, 400, 440, 50, 8);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px monospace';
        ctx.fillText('CONTINUE AS PARTICIPANT →', 510, 432);
      } else if (simTime < 12) {
        // Step 2: Team & Track
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 22px Inter, sans-serif';
        ctx.fillText('Team Studio · Squad Formation', 70, 140);

        ctx.fillStyle = '#ffffff';
        ctx.roundRect(70, 170, 540, 470, 10);
        ctx.fill();
        ctx.strokeStyle = '#e2e8f0';
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 18px Inter, sans-serif';
        ctx.fillText('Active Team: NeuralSentry', 100, 220);
        ctx.font = '13px monospace';
        ctx.fillStyle = '#64748b';
        ctx.fillText('Invite Code: FORGE-9021 · 4/4 Members', 100, 250);

        // Track Card
        ctx.fillStyle = '#f8fafc';
        ctx.roundRect(640, 170, 570, 470, 10);
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 18px Inter, sans-serif';
        ctx.fillText('Challenge Track Selected', 670, 220);
        ctx.fillStyle = '#047857';
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.fillText('Track 1: AI & Distributed Systems ($8,000 Bounty)', 670, 260);
      } else if (simTime < 18) {
        // Step 3: Project Spec
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 22px Inter, sans-serif';
        ctx.fillText('Project Submission Editor', 70, 140);

        // Title box
        ctx.fillStyle = '#f8fafc';
        ctx.roundRect(70, 170, 1140, 80, 8);
        ctx.fill();
        ctx.fillStyle = '#64748b';
        ctx.font = '12px monospace';
        ctx.fillText('PROJECT TITLE', 90, 195);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 18px Inter, sans-serif';
        ctx.fillText('NeuralSentry: Real-Time Decentralized Defense Agent', 90, 230);

        // Repo & Demo
        ctx.fillStyle = '#f8fafc';
        ctx.roundRect(70, 270, 1140, 80, 8);
        ctx.fill();
        ctx.fillStyle = '#64748b';
        ctx.font = '12px monospace';
        ctx.fillText('REPOSITORY & LIVE DEMO URL', 90, 295);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('https://github.com/hackforge/neuralsentry-agent · https://neuralsentry.dev', 90, 330);

        // Description
        ctx.fillStyle = '#f8fafc';
        ctx.roundRect(70, 370, 1140, 270, 8);
        ctx.fill();
        ctx.fillStyle = '#64748b';
        ctx.font = '12px monospace';
        ctx.fillText('MARKDOWN ARCHITECTURE SPECIFICATION', 90, 395);
        ctx.fillStyle = '#334155';
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText('## Problem & Architectural Solution', 90, 430);
        ctx.fillText('Autonomous edge agent verifying distributed consensus with zero-dependency runtime.', 90, 460);
      } else if (simTime < 24) {
        // Step 4: Pre-Flight Check
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 22px Inter, sans-serif';
        ctx.fillText('Submission Pre-Flight Verification', 70, 140);

        const checks = [
          'GitHub VCS Repository Accessible (200 OK)',
          'Track Requirements & License Verified',
          'Roster Check: 4 Verified Members (No Conflict of Interest)',
          'Offline Local-First Storage Synchronized',
        ];

        checks.forEach((chk, i) => {
          ctx.fillStyle = '#ecfdf5';
          ctx.roundRect(70, 180 + i * 85, 1140, 65, 8);
          ctx.fill();
          ctx.strokeStyle = '#a7f3d0';
          ctx.stroke();

          ctx.fillStyle = '#059669';
          ctx.font = 'bold 16px Inter, sans-serif';
          ctx.fillText(`✓  ${chk}`, 100, 220 + i * 85);
        });
      } else {
        // Step 5: Submitted & Confirmed
        ctx.fillStyle = '#ecfdf5';
        ctx.roundRect(240, 150, 800, 480, 16);
        ctx.fill();
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#065f46';
        ctx.font = 'bold 28px Inter, sans-serif';
        ctx.fillText('Project Successfully Submitted!', 360, 230);

        ctx.font = '15px Inter, sans-serif';
        ctx.fillStyle = '#047857';
        ctx.fillText('Locked prior to UTC deadline freeze · Ready for Blind Rubric Evaluation', 320, 270);

        ctx.fillStyle = '#ffffff';
        ctx.roundRect(280, 310, 720, 160, 8);
        ctx.fill();
        ctx.strokeStyle = '#d1fae5';
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 15px monospace';
        ctx.fillText('IMMUTABLE SUBMISSION RECEIPT:', 310, 345);
        ctx.fillStyle = '#059669';
        ctx.font = '13px monospace';
        ctx.fillText('ID: sub-neuralsentry-2026', 310, 380);
        ctx.fillText('SHA-256: 7f8a91b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f6', 310, 410);
        ctx.fillText('TIMESTAMP: 2026-09-28T17:59:42Z (VERIFIED ON-TIME)', 310, 440);
      }

      // Draw cursor
      const cx = (cursorState.x / 100) * 1280;
      const cy = (cursorState.y / 100) * 720;

      ctx.fillStyle = cursorState.click ? '#ef4444' : '#0f172a';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 16, cy + 16);
      ctx.lineTo(cx + 6, cy + 18);
      ctx.lineTo(cx, cy + 24);
      ctx.closePath();
      ctx.fill();

      // Draw Bottom Video Progress Bar
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 690, 1280, 30);
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(0, 690, (simTime / TOTAL_DURATION) * 1280, 30);

      // Overlay Timestamp
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px monospace';
      ctx.fillText(`${simTime.toFixed(1)}s / 30.0s · ${activeChapter.title}`, 20, 710);

      // Yield frame to recorder every 10 frames to avoid event loop starvation
      if (f % 15 === 0) {
        setExportProgress(Math.round((f / totalFrames) * 100));
        await new Promise((r) => setTimeout(r, 4));
      }
    }

    recorder.stop();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 text-white rounded-xl shadow-2xl max-w-5xl w-full border border-slate-700 overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <h2 className="text-sm font-bold font-mono tracking-tight text-white">
              30-Second Walkthrough: Login to Submission
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              00:{currentTime < 10 ? `0${Math.floor(currentTime)}` : Math.floor(currentTime)} / 00:30
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportVideo}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors cursor-pointer disabled:opacity-50"
              title="Record and download high-resolution WebM video"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? `Encoding (${exportProgress}%)` : 'Download 30s WebM Video'}</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Main Video Viewport Canvas */}
        <div className="relative bg-slate-950 aspect-video w-full flex items-center justify-center overflow-hidden select-none">
          {/* Simulated App Screen */}
          <div className="w-full h-full p-4 sm:p-8 flex flex-col justify-between relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
            
            {/* Top Simulated App Navigation */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-white text-slate-950 font-bold font-mono text-xs flex items-center justify-center">
                  HF
                </div>
                <span className="font-bold text-xs tracking-tight text-white font-mono">
                  HackForge
                </span>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800">
                  {event.name}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <span className={currentTime < 6 ? 'text-amber-400 font-bold' : 'text-slate-500'}>1. Auth</span>
                <span>&rarr;</span>
                <span className={currentTime >= 6 && currentTime < 12 ? 'text-amber-400 font-bold' : 'text-slate-500'}>2. Team</span>
                <span>&rarr;</span>
                <span className={currentTime >= 12 && currentTime < 18 ? 'text-amber-400 font-bold' : 'text-slate-500'}>3. Spec</span>
                <span>&rarr;</span>
                <span className={currentTime >= 18 && currentTime < 24 ? 'text-amber-400 font-bold' : 'text-slate-500'}>4. Checks</span>
                <span>&rarr;</span>
                <span className={currentTime >= 24 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>5. Submit</span>
              </div>
            </div>

            {/* Dynamic Simulated Step Content */}
            <div className="flex-1 flex items-center justify-center my-4">
              
              {/* Step 1: Login / Auth (0-6s) */}
              {currentTime < 6 && (
                <div className="max-w-md w-full p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                      Phase 1 · Instant Authentication
                    </span>
                    <h3 className="text-base font-bold text-white">Sign In to Participant Workspace</h3>
                    <p className="text-xs text-slate-400">Local-first, zero-cloud dependency authentication.</p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">Elena Rostova</span>
                      <span className="text-[10px] text-emerald-400 font-mono">Active Hacker</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 truncate">
                      elena@distributed-ai.org · Token: eyJhbGciOiJIUzI1Ni...
                    </div>
                  </div>

                  <button className="w-full py-2.5 bg-white text-slate-950 rounded-lg font-bold text-xs font-mono flex items-center justify-center gap-1.5 shadow-md">
                    <span>Sign In & Open Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Step 2: Team Formation & Track (6-12s) */}
              {currentTime >= 6 && currentTime < 12 && (
                <div className="max-w-xl w-full p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                        Phase 2 · Team Roster & Track
                      </span>
                      <h3 className="text-base font-bold text-white">Team Studio: "NeuralSentry"</h3>
                    </div>
                    <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      Code: FORGE-9021
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase font-mono">Team Roster</div>
                      <div className="font-bold text-white">4 Members Ready</div>
                      <div className="text-[11px] text-emerald-400 font-mono">Elena, Liam, Devendra, Sarah</div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase font-mono">Selected Bounty Track</div>
                      <div className="font-bold text-white">AI & Distributed Systems</div>
                      <div className="text-[11px] text-amber-400 font-mono">$8,000 Grand Prize Track</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Project Spec (12-18s) */}
              {currentTime >= 12 && currentTime < 18 && (
                <div className="max-w-2xl w-full p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                      Phase 3 · Technical Specification
                    </span>
                    <h3 className="text-base font-bold text-white">NeuralSentry: Real-Time Decentralized Defense Agent</h3>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded text-slate-300">
                      <span className="text-slate-500">Repository: </span>
                      <span className="text-emerald-400">https://github.com/hackforge/neuralsentry-agent</span>
                    </div>
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded text-slate-300">
                      <span className="text-slate-500">Live Demo: </span>
                      <span className="text-emerald-400">https://neuralsentry.hackforge.dev</span>
                    </div>
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded text-slate-400 text-[11px] line-clamp-2">
                      Markdown: ## Architecture Spec\nAutonomous agent leveraging LoRaWAN edge mesh and hermetic verification.
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Pre-Flight Check (18-24s) */}
              {currentTime >= 18 && currentTime < 24 && (
                <div className="max-w-lg w-full p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                      Phase 4 · Pre-Flight Integrity Check
                    </span>
                    <h3 className="text-base font-bold text-white">Verifying Submission Constraints</h3>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/80 rounded-lg flex items-center justify-between text-emerald-300 font-mono">
                      <span>Git VCS Accessible (HTTP 200)</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/80 rounded-lg flex items-center justify-between text-emerald-300 font-mono">
                      <span>Track Alignment & Open License</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/80 rounded-lg flex items-center justify-between text-emerald-300 font-mono">
                      <span>Conflict of Interest Excluded</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/80 rounded-lg flex items-center justify-between text-emerald-300 font-mono">
                      <span>Local-First Draft Synchronized</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Final Submission & Receipt (24-30s) */}
              {currentTime >= 24 && (
                <div className="max-w-xl w-full p-6 bg-emerald-950/30 border border-emerald-700/60 rounded-xl shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                        Phase 5 · Verified & Sealed
                      </span>
                      <h3 className="text-base font-bold text-white">Project Officially Submitted</h3>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-950/90 rounded-lg border border-slate-800 font-mono text-xs space-y-1.5">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Immutable Cryptographic Receipt</div>
                    <div className="text-emerald-400">Submission ID: sub-neuralsentry-2026</div>
                    <div className="text-slate-400 text-[11px] truncate">
                      SHA-256: 7f8a91b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f6
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Status: Locked Prior to UTC Freeze · Dispatched to Blind Judging Queue
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Simulated Animated Mouse Cursor */}
            <div
              className="absolute pointer-events-none transition-all duration-75 ease-out z-20"
              style={{
                left: `${cursorState.x}%`,
                top: `${cursorState.y}%`,
              }}
            >
              <div className="relative">
                <svg
                  className="w-5 h-5 drop-shadow-md text-white fill-slate-950"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                </svg>
                {cursorState.click && (
                  <span className="absolute -top-2 -left-2 w-9 h-9 rounded-full border-2 border-emerald-400 bg-emerald-400/30 animate-ping" />
                )}
              </div>
            </div>

            {/* Subtitle / Narration Banner in Video Frame */}
            <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-lg backdrop-blur-md flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono text-[10px] font-bold">
                  {activeChapter.badge}
                </span>
                <span className="font-semibold text-white">{activeChapter.title}:</span>
                <span className="text-slate-300 hidden sm:inline">{activeChapter.subtitle}</span>
              </div>

              <div className="text-[10px] font-mono text-slate-500 shrink-0">
                00:{currentTime < 10 ? `0${Math.floor(currentTime)}` : Math.floor(currentTime)} / 00:30
              </div>
            </div>
          </div>
        </div>

        {/* Video Scrubber & Playback Controls Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
          
          {/* Timeline Track with 5 Chapter Markers */}
          <div className="relative">
            <input
              type="range"
              min={0}
              max={TOTAL_DURATION}
              step={0.1}
              value={currentTime}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />

            {/* Chapter Milestone Ticks */}
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1 px-1">
              {CHAPTERS.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => handleSeek(ch.timeStart)}
                  className={`hover:text-emerald-400 transition-colors cursor-pointer ${
                    currentTime >= ch.timeStart && currentTime < ch.timeEnd ? 'text-emerald-400 font-bold' : ''
                  }`}
                >
                  00:{ch.timeStart < 10 ? `0${ch.timeStart}` : ch.timeStart} {ch.badge.split(':')[1]}
                </button>
              ))}
              <span>00:30 Done</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlayPause}
                className="p-2 rounded-lg bg-white text-slate-950 hover:bg-slate-200 transition-colors cursor-pointer shadow-xs"
                title={isPlaying ? 'Pause Walkthrough' : 'Play Walkthrough'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={handleRestart}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Replay from 00:00"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Playback speed selector */}
              <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs font-mono">
                {[1, 1.5, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                      playbackSpeed === spd ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportVideo}
                disabled={isExporting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? `Encoding Video (${exportProgress}%)` : 'Export .webm Video'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
