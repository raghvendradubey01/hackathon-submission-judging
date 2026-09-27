import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Award, 
  Terminal, 
  ShieldCheck, 
  Layers, 
  Gavel, 
  Trophy, 
  BookOpen, 
  CheckCircle2, 
  Users,
  LayoutDashboard,
  Calendar,
  FileCode2,
  Activity,
  Sparkles,
  Play,
  Presentation
} from 'lucide-react';

interface TopNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User;
  onOpenRoleSwitcher: () => void;
  onOpenCertificates: () => void;
  onOpenApiDocs: () => void;
  onOpenVideoDemo: () => void;
  onResetData: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onOpenRoleSwitcher,
  onOpenCertificates,
  onOpenApiDocs,
  onOpenVideoDemo,
  onResetData,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Sparkles,
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'events',
      label: 'Events',
      icon: Calendar,
    },
    { 
      id: 'teams', 
      label: 'Teams',
      icon: Users 
    },
    { 
      id: 'submissions', 
      label: 'Submissions',
      icon: FileCode2 
    },
    { 
      id: 'gallery', 
      label: 'Gallery',
      icon: Layers 
    },
    { 
      id: 'judging', 
      label: 'Judging',
      icon: Gavel 
    },
    { 
      id: 'results', 
      label: 'Results',
      icon: Trophy 
    },
    { 
      id: 'audit', 
      label: 'Audit Logs',
      icon: ShieldCheck 
    },
    { 
      id: 'acceptance', 
      label: 'Tests',
      icon: CheckCircle2 
    },
    { 
      id: 'docs', 
      label: 'Docs',
      icon: BookOpen 
    },
  ];

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'organizer':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'judge':
        return 'text-blue-800 bg-blue-50 border-blue-200';
      case 'admin':
        return 'text-purple-800 bg-purple-50 border-purple-200';
      default:
        return 'text-emerald-800 bg-emerald-50 border-emerald-200';
    }
  };

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Brand: HackForge */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('overview')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-wider font-mono shadow-xs">
                HF
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors">
                    HackForge
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold hidden md:inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Self-Hosted
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono hidden lg:block -mt-0.5">
                  Open-source Hackathon Platform
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Utilities: Certificates, API, Role Switcher */}
          <div className="flex items-center gap-2">
            
            {/* Quick Actions (Desktop & Tablet) */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={onOpenVideoDemo}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-md transition-colors cursor-pointer shadow-xs"
                title="Watch 30-Second Demo: Login to Submission"
              >
                <Play className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
                <span>30s Demo</span>
              </button>

              <a
                href="/hackforge-presentation.pptx"
                download="hackforge-presentation.pptx"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-300 rounded-md transition-colors cursor-pointer shadow-xs"
                title="Download 9-Slide Presentation Deck (.pptx)"
              >
                <Presentation className="w-3.5 h-3.5 text-sky-600" />
                <span>Slide PPT</span>
              </a>

              <button
                onClick={onOpenCertificates}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer"
                title="Cryptographic SVG Certificates"
              >
                <Award className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden lg:inline">Certificates</span>
              </button>
              
              <button
                onClick={onOpenApiDocs}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors font-mono cursor-pointer"
                title="REST API & OpenAPI 3.0"
              >
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden lg:inline">API</span>
              </button>
            </div>

            {/* Role & Session Switcher Pill */}
            <button
              onClick={onOpenRoleSwitcher}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all cursor-pointer"
              title="Switch user role (Participant, Judge, Organizer, Admin)"
            >
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold font-mono">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-medium text-slate-900 leading-tight truncate max-w-[110px]">
                  {currentUser.name.split(' ')[0]}
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono -mt-0.5">
                  {currentUser.role}
                </div>
              </div>
              <span className={`text-[10px] px-1.5 py-0.2 rounded border uppercase font-mono font-medium ${getRoleBadgeStyle(currentUser.role)}`}>
                Switch
              </span>
            </button>

            {/* Mobile/Tablet Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 cursor-pointer ml-1"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Secondary Scrollable Quick Tab Bar on Tablet / Mobile */}
        <div className="flex xl:hidden overflow-x-auto py-2 border-t border-slate-100 gap-1.5 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar touch-pan-x">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 text-xs whitespace-nowrap px-2.5 py-1.5 rounded-md transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white font-medium shadow-xs'
                    : 'text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Dropdown Drawer when hamburger opened */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-3 border-t border-slate-200 bg-white space-y-1">
            <div className="px-2 py-1 text-[11px] font-mono font-semibold uppercase text-slate-400 tracking-wider">
              Navigation
            </div>
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-md transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <span className="text-[10px] font-mono text-emerald-600 font-bold">Active</span>}
                </button>
              );
            })}

            <div className="pt-2 mt-2 border-t border-slate-100 grid grid-cols-3 gap-1.5 px-1">
              <button
                onClick={() => { onOpenVideoDemo(); setMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-1 p-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-md cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
                Demo
              </button>
              <button
                onClick={() => { onOpenCertificates(); setMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-1 p-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-slate-600" />
                Certs
              </button>
              <button
                onClick={() => { onOpenApiDocs(); setMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-1 p-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md font-mono cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-slate-600" />
                API
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
