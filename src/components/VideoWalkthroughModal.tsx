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
  Check,
  Film,
  Copy,
  ExternalLink
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
    timeEnd: 5,
    title: 'Platform Architecture & Command Center',
    subtitle: 'Self-hostable, zero-cloud dependency hackathon management engine.',
    badge: '1: Overview',
  },
  {
    id: 2,
    timeStart: 5,
    timeEnd: 10,
    title: 'Hermetic Multi-Role Authentication',
    subtitle: 'Zero-lockin instant login with granular role isolation and 1-click switcher.',
    badge: '2: Auth & RBAC',
  },
  {
    id: 3,
    timeStart: 10,
    timeEnd: 15,
    title: 'Team Studio & Project Submissions',
    subtitle: 'Collaborative roster, bounty tracks, and automated GitHub VCS verification.',
    badge: '3: Team & Spec',
  },
  {
    id: 4,
    timeStart: 15,
    timeEnd: 20,
    title: 'Pre-Flight Integrity & SHA-256 Freeze',
    subtitle: 'Tamper-evident verification before UTC deadline with immutable receipt.',
    badge: '4: Pre-Flight & Seal',
  },
  {
    id: 5,
    timeStart: 20,
    timeEnd: 25,
    title: 'Blind Rubrics & Bradley-Terry Scoring',
    subtitle: 'Weighted multi-criteria scoring combined with pairwise preference engine.',
    badge: '5: Rubrics & Judging',
  },
  {
    id: 6,
    timeStart: 25,
    timeEnd: 30,
    title: 'Z-Score Normalization & Live Results',
    subtitle: 'Cross-judge mathematical standardization neutralizing harsh/lenient bias.',
    badge: '6: Normalization',
  },
  {
    id: 7,
    timeStart: 30,
    timeEnd: 35,
    title: 'Verifiable Certificates & 1-Command Deploy',
    subtitle: 'Cryptographic credentials export and production docker compose up -d.',
    badge: '7: Deploy & Certs',
  },
];

export const VideoWalkthroughModal: React.FC<VideoWalkthroughModalProps> = ({
  isOpen,
  onClose,
  event,
  currentUser,
}) => {
  if (!isOpen) return null;

  const [activeMode, setActiveMode] = useState<'video' | 'interactive'>('video');
  const [videoTime, setVideoTime] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(35);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Derive direct video URLs
  const videoMp4Url = '/hackforge-demo.mp4';
  const videoWebmUrl = '/hackforge-demo.webm';
  const fullMp4Url = typeof window !== 'undefined' 
    ? `${window.location.origin}${videoMp4Url}` 
    : videoMp4Url;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullMp4Url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setVideoTime(videoRef.current.currentTime);
      if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setVideoDuration(videoRef.current.duration);
      }
    }
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setVideoTime(time);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const activeChapter = CHAPTERS.find(
    (c) => videoTime >= c.timeStart && videoTime < c.timeEnd
  ) || CHAPTERS[CHAPTERS.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 text-white rounded-xl shadow-2xl max-w-5xl w-full border border-slate-700 overflow-hidden flex flex-col max-h-[96vh]">
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <div>
              <h2 className="text-sm font-bold font-mono tracking-tight text-white flex items-center gap-2">
                <span>HackForge Demo Video</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
                  1080p HD · MP4 & WebM
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Download Dropdown / Buttons */}
            <a
              href={videoMp4Url}
              download="hackforge-demo.mp4"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors cursor-pointer shadow-xs"
              title="Download high-resolution 1080p MP4 (Universal playback)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download MP4 (2.9 MB)</span>
            </a>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors cursor-pointer border border-slate-700"
              title="Copy direct download link to clipboard"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer text-sm"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Video Player Viewport */}
        <div className="relative bg-black aspect-video w-full flex items-center justify-center overflow-hidden select-none">
          <video
            ref={videoRef}
            src={videoMp4Url}
            autoPlay
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsVideoPlaying(false)}
            onPlay={() => setIsVideoPlaying(true)}
            onPause={() => setIsVideoPlaying(false)}
            className="w-full h-full object-contain"
          >
            <source src={videoMp4Url} type="video/mp4" />
            <source src={videoWebmUrl} type="video/webm" />
            Your browser does not support HTML5 video.
          </video>

          {/* Subtitle / Active Chapter Overlay at Bottom */}
          <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
            <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-lg backdrop-blur-md flex items-center justify-between text-xs pointer-events-auto shadow-lg">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono text-[10px] font-bold">
                  {activeChapter.badge}
                </span>
                <span className="font-semibold text-white">{activeChapter.title}:</span>
                <span className="text-slate-300 hidden sm:inline">{activeChapter.subtitle}</span>
              </div>

              <div className="text-[10px] font-mono text-slate-400 shrink-0">
                00:{videoTime < 10 ? `0${Math.floor(videoTime)}` : Math.floor(videoTime)} / 00:{Math.floor(videoDuration)}
              </div>
            </div>
          </div>
        </div>

        {/* Video Scrubber & Playback Controls Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
          
          {/* Timeline Track with Chapter Markers */}
          <div className="relative">
            <input
              type="range"
              min={0}
              max={videoDuration || 35}
              step={0.1}
              value={videoTime}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />

            {/* Chapter Milestone Ticks */}
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1 px-1 overflow-x-auto no-scrollbar">
              {CHAPTERS.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => handleSeek(ch.timeStart)}
                  className={`hover:text-emerald-400 transition-colors cursor-pointer whitespace-nowrap px-1 ${
                    videoTime >= ch.timeStart && videoTime < ch.timeEnd ? 'text-emerald-400 font-bold' : ''
                  }`}
                >
                  00:{ch.timeStart < 10 ? `0${ch.timeStart}` : ch.timeStart} {ch.badge.split(':')[1]}
                </button>
              ))}
              <span className="px-1">00:35 End</span>
            </div>
          </div>

          {/* Control Buttons & Download Links */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2.5">
              <button
                onClick={handlePlayPause}
                className="p-2 rounded-lg bg-white text-slate-950 hover:bg-slate-200 transition-colors cursor-pointer shadow-xs"
                title={isVideoPlaying ? 'Pause Video' : 'Play Video'}
              >
                {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={() => handleSeek(0)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Restart from beginning"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleToggleMute}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Playback speed selector */}
              <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs font-mono">
                {[1, 1.25, 1.5, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => handleSpeedChange(spd)}
                    className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                      playbackSpeed === spd ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              <button
                onClick={handleFullscreen}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Direct Links and Format Download Options */}
            <div className="flex items-center gap-2">
              <a
                href={videoMp4Url}
                download="hackforge-demo.mp4"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>MP4 (1080p)</span>
              </a>

              <a
                href={videoWebmUrl}
                download="hackforge-demo.webm"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-md transition-colors cursor-pointer"
                title="Download lightweight WebM video"
              >
                <Download className="w-3.5 h-3.5" />
                <span>WebM</span>
              </a>

              <a
                href={videoMp4Url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Open raw video in new browser tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Raw File</span>
              </a>
            </div>
          </div>

          {/* Direct Download URL Info Box */}
          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2 truncate">
              <span className="text-slate-500 text-[11px] uppercase">Direct URL:</span>
              <span className="text-emerald-400 select-all truncate text-[11px]">{fullMp4Url}</span>
            </div>
            <button
              onClick={handleCopyLink}
              className="px-2 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 cursor-pointer shrink-0"
            >
              {copiedLink ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
