import React from 'react';
import { 
  Calendar, 
  Users, 
  FileCode2, 
  Scale, 
  Sliders, 
  TrendingUp, 
  Vote, 
  BarChart3, 
  ShieldCheck, 
  Server, 
  ArrowRight,
  Terminal,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Play
} from 'lucide-react';
import { HackathonEvent } from '../types';

interface ProductLandingPageProps {
  event: HackathonEvent;
  onNavigateTab: (tab: string) => void;
  onOpenRoleSwitcher: () => void;
  onOpenVideoDemo?: () => void;
}

export const ProductLandingPage: React.FC<ProductLandingPageProps> = ({
  event,
  onNavigateTab,
  onOpenRoleSwitcher,
  onOpenVideoDemo,
}) => {
  const platformFeatures = [
    {
      title: 'Event Management',
      icon: Calendar,
      description: 'Configure multiple events, customize challenge tracks, set submission freeze windows, and manage prize allocations.',
      actionTab: 'events',
      tag: 'Core Hub',
    },
    {
      title: 'Team Formation',
      icon: Users,
      description: 'Self-service team formation (1–4 members) with cryptographically secure alphanumeric invite codes and roster tracking.',
      actionTab: 'teams',
      tag: 'Collaboration',
    },
    {
      title: 'Project Submissions',
      icon: FileCode2,
      description: 'Support private drafts, Markdown writeups, repository URLs, demo videos, and automated UTC deadline locks.',
      actionTab: 'submissions',
      tag: 'Lifecycle',
    },
    {
      title: 'Judge Assignment',
      icon: Scale,
      description: 'Algorithmic load balancer with conflict-of-interest exclusion preventing evaluators from reviewing their own teams.',
      actionTab: 'judging',
      tag: 'Integrity',
    },
    {
      title: 'Configurable Rubrics',
      icon: Sliders,
      description: 'Weighted multi-criteria rubrics summing strictly to 1.00 (100%) with qualitative critique notes.',
      actionTab: 'events',
      tag: 'Evaluation',
    },
    {
      title: 'Score Normalization',
      icon: TrendingUp,
      description: 'Cross-judge Z-score mathematical standardization to neutralize harsh vs. lenient evaluator bias.',
      actionTab: 'results',
      tag: 'Statistics',
    },
    {
      title: 'Community Voting',
      icon: Vote,
      description: 'Sybil-resistant quadratic token voting (N² token cost) with duplicate ballot suppression and randomized project shuffle.',
      actionTab: 'gallery',
      tag: 'Engagement',
    },
    {
      title: 'Audit Logs & Governance',
      icon: ShieldCheck,
      description: 'Tamper-evident append-only activity ledger recording every score change, assignment dispatch, and role mutation.',
      actionTab: 'audit',
      tag: 'Compliance',
    },
    {
      title: 'Self-Hosted Deployment',
      icon: Server,
      description: 'Containerized zero-cloud architecture running hermetically via single-command docker compose up.',
      actionTab: 'docs',
      tag: 'DevOps',
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Product Hero Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Open-source Hackathon Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Run hackathons from registration to results.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Manage participants, teams, projects, judging, and statistical results from one platform.
            Engineered for reliability, zero cloud lock-in, and mathematical scoring integrity.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            {onOpenVideoDemo && (
              <button
                onClick={onOpenVideoDemo}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs font-mono flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                title="Watch automated 30-second walkthrough from login to final submission"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Watch 30s Demo Video</span>
              </button>
            )}

            <button
              onClick={() => onNavigateTab('dashboard')}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold font-mono flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <span>Open Management Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigateTab('events')}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold font-mono flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>Manage Events ({event.name})</span>
            </button>

            <button
              onClick={onOpenRoleSwitcher}
              className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold font-mono cursor-pointer transition-colors"
            >
              <span>Switch Active Role</span>
            </button>
          </div>
        </div>

        {/* Live Architecture Badge */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-slate-600">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Deployment</div>
            <div className="font-bold text-slate-900 text-sm mt-0.5">Self-Hostable</div>
            <div className="text-[11px] text-slate-500">docker compose up</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Scoring Engine</div>
            <div className="font-bold text-slate-900 text-sm mt-0.5">Z-Score + Pairwise</div>
            <div className="text-[11px] text-slate-500">Cross-judge bias correction</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Active Event</div>
            <div className="font-bold text-slate-900 text-sm mt-0.5 truncate">{event.name}</div>
            <div className="text-[11px] text-emerald-700 font-semibold">{event.status.toUpperCase()}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Security Model</div>
            <div className="font-bold text-slate-900 text-sm mt-0.5">RBAC & Isolation</div>
            <div className="text-[11px] text-slate-500">Blind queues & embargoes</div>
          </div>
        </div>
      </div>

      {/* Feature Architecture Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Platform Capabilities</h2>
            <p className="text-xs text-slate-500">
              End-to-end tooling designed for hackathon organizers, judges, participants, and platform operators.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platformFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                onClick={() => onNavigateTab(feat.actionTab)}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-5 transition-all cursor-pointer group flex flex-col justify-between shadow-xs hover:shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200 font-medium">
                      {feat.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-slate-700 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-slate-900 transition-colors">
                  <span>Open Module</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
