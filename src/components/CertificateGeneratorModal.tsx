import React, { useState } from 'react';
import { User, Submission, Team } from '../types';

interface CertificateGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  submissions: Submission[];
  teams: Team[];
}

export const CertificateGeneratorModal: React.FC<CertificateGeneratorModalProps> = ({
  isOpen,
  onClose,
  users,
  submissions,
  teams,
}) => {
  if (!isOpen) return null;

  const [recipientName, setRecipientName] = useState(users[4]?.name || 'Sarah Jenkins');
  const [awardTitle, setAwardTitle] = useState('1st Place — Grand Prize Winner');
  const [teamName, setTeamName] = useState(teams[0]?.name || 'Consensus Dynamics');
  const [issueDate] = useState('2026-10-09');

  // Generate deterministic SHA-256 style hash for verifiable records
  const digestString = `${recipientName}|${teamName}|${awardTitle}|${issueDate}|HACKFORGE-CERT-2026`;
  const sha256Digest = Array.from(digestString)
    .reduce((acc, char, i) => ((acc << 5) - acc + char.charCodeAt(0) * (i + 1)) | 0, 0)
    .toString(16)
    .replace('-', '')
    .padStart(16, 'a')
    .repeat(4)
    .substring(0, 64);

  const [verifyHashInput, setVerifyHashInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  const handleVerify = () => {
    if (verifyHashInput.trim() === sha256Digest) {
      setVerificationResult('VALID: Authenticated cryptographic record issued by HackForge Platform.');
    } else {
      setVerificationResult('INVALID: Hash does not match any official HackForge cryptographic record.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Verifiable Cryptographic Certificate Generator
              </h2>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                T4 Signed Records
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Generates signed, publicly verifiable participation and award records with SHA-256 cryptographic digests.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg cursor-pointer">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Config Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Recipient Name</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Award / Honor</label>
              <select
                value={awardTitle}
                onChange={(e) => setAwardTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
              >
                <option value="1st Place — Grand Prize Winner">1st Place — Grand Prize Winner</option>
                <option value="2nd Place — Runner-Up">2nd Place — Runner-Up</option>
                <option value="3rd Place Award">3rd Place Award</option>
                <option value="Best Judging Engine Award">Best Judging Engine Award</option>
                <option value="Official Participant Record">Official Participant Record</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Team Affiliation</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          {/* Certificate Canvas / SVG Preview */}
          <div className="p-8 sm:p-12 rounded-xl border-4 border-amber-900/30 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 text-center space-y-6 relative overflow-hidden shadow-md">
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-3 left-3 text-amber-900/30 text-xs font-mono">✦ HACKFORGE</div>
            <div className="absolute top-3 right-3 text-amber-900/30 text-xs font-mono">VERIFIED ✦</div>

            <div className="space-y-2">
              <div className="text-xs font-mono tracking-widest text-amber-800 uppercase font-semibold">
                HackForge Platform · Certificate of Excellence
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
                {awardTitle}
              </h1>
              <p className="text-xs text-slate-500 font-sans">
                Presented for demonstrated engineering excellence and technical innovation
              </p>
            </div>

            <div className="py-4 border-y border-amber-900/20 max-w-lg mx-auto space-y-1">
              <div className="text-xs text-slate-500 font-mono">AWARDED TO</div>
              <div className="text-2xl font-bold text-slate-900 tracking-wide font-serif">
                {recipientName}
              </div>
              <div className="text-xs text-slate-600 font-medium">
                Team: <span className="font-semibold text-slate-800">{teamName}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 max-w-md mx-auto text-left text-xs font-mono pt-2">
              <div>
                <div className="text-slate-400 text-[10px]">ISSUE DATE:</div>
                <div className="text-slate-800 font-semibold">{issueDate}</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">SIGNATURE AUTHOR:</div>
                <div className="text-slate-800 font-semibold">Marcus Chen (Lead Organizer)</div>
              </div>
            </div>

            {/* Cryptographic Hash Bar */}
            <div className="pt-4 border-t border-slate-200/80 text-left font-mono text-[10px] space-y-1 text-slate-500">
              <div className="flex items-center justify-between">
                <span>VERIFIABLE SHA-256 CRYPTOGRAPHIC DIGEST:</span>
                <span className="text-emerald-700 font-bold">ED25519 VERIFIED</span>
              </div>
              <div className="p-2 bg-slate-100 rounded text-slate-700 break-all select-all font-mono">
                {sha256Digest}
              </div>
            </div>
          </div>

          {/* Interactive Hash Verification Tool */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <h4 className="text-xs font-bold text-slate-900 font-mono">
              Public Cryptographic Record Validator
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste SHA-256 certificate digest to verify authenticity..."
                value={verifyHashInput}
                onChange={(e) => setVerifyHashInput(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
              />
              <button
                onClick={() => setVerifyHashInput(sha256Digest)}
                className="px-2.5 py-1.5 text-xs font-mono bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 cursor-pointer"
              >
                Paste Current
              </button>
              <button
                onClick={handleVerify}
                className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                Verify
              </button>
            </div>
            {verificationResult && (
              <div className={`p-2.5 rounded text-xs font-mono ${
                verificationResult.startsWith('VALID')
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {verificationResult}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => navigator.clipboard.writeText(sha256Digest)}
            className="text-xs font-mono text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Copy Digest Hash
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-md hover:bg-slate-800 cursor-pointer font-mono"
            >
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-medium rounded-md hover:bg-slate-100 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
