import React from 'react';
import { User, UserRole } from '../types';
import { ShieldCheck, UserCheck, Scale, Users, RotateCcw, X } from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentUser: User;
  onSelectUser: (userId: string) => void;
  onResetSeedData: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUser,
  onSelectUser,
  onResetSeedData,
}) => {
  if (!isOpen) return null;

  const roleDescriptions: Record<UserRole, { badge: string; desc: string }> = {
    organizer: {
      badge: 'bg-amber-50 text-amber-900 border-amber-300',
      desc: 'Full governance: configure deadlines, dispatch algorithmic assignments, lift results embargo, and export CSV ledgers.',
    },
    judge: {
      badge: 'bg-blue-50 text-blue-900 border-blue-300',
      desc: 'Isolated evaluation: scores assigned projects against weighted rubrics and participates in head-to-head pairwise battles. Peer scores hidden.',
    },
    participant: {
      badge: 'bg-emerald-50 text-emerald-900 border-emerald-300',
      desc: 'Hacker workspace: manage 1-4 member team via invite codes, edit drafts, submit before hard deadline, and cast quadratic community votes.',
    },
    admin: {
      badge: 'bg-purple-50 text-purple-900 border-purple-300',
      desc: 'System operator: view tamper-evident audit logs, inspect webhook deliveries, and manage platform snapshot fixtures.',
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-mono">Role & Session Switcher</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Switch identities to test end-to-end backend role isolation across the hackathon lifecycle.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-lg leading-none p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* User List */}
        <div className="p-5 overflow-y-auto divide-y divide-slate-100 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {users.map((user) => {
              const isSelected = user.id === currentUser.id;
              const roleMeta = roleDescriptions[user.role];

              return (
                <div
                  key={user.id}
                  onClick={() => {
                    onSelectUser(user.id);
                    onClose();
                  }}
                  className={`p-3 rounded-md border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900/10'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                      <span>{user.name}</span>
                      {isSelected && (
                        <span className="text-[9px] text-slate-900 bg-slate-200 px-1.5 py-0.2 rounded font-mono font-bold">
                          Active
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border font-semibold ${roleMeta.badge}`}>
                      {user.role}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 font-mono mb-1 truncate">
                    {user.organization}
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-2 leading-snug">
                    {user.bio}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Role Isolation Summary */}
          <div className="pt-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono mb-1.5">
              Backend Role Isolation Guarantees
            </h3>
            <div className="bg-slate-50 p-3 rounded-md border border-slate-200 text-xs text-slate-600 space-y-1 font-mono text-[11px]">
              <div>
                <strong className="text-slate-900">Judges:</strong> Blind queue evaluation. Fellow scores and aggregate standings strictly concealed until embargo lift.
              </div>
              <div>
                <strong className="text-slate-900">Participants:</strong> Cannot access review queues, score entries, or unrevealed leaderboards.
              </div>
              <div>
                <strong className="text-slate-900">Organizers:</strong> Manage assignment matrices, Z-score normalization parameters, and CSV pipelines.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm('Reset platform data back to clean seed fixtures? All edits will be restored.')) {
                onResetSeedData();
                onClose();
              }
            }}
            className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-medium cursor-pointer font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Seed Fixtures</span>
          </button>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
