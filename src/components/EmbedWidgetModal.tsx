import React, { useState } from 'react';

interface EmbedWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmbedWidgetModal: React.FC<EmbedWidgetModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [trackFilter, setTrackFilter] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  const embedCode = `<iframe
  src="https://hackforge.dev/embed/gallery?theme=${theme}&track=${trackFilter}"
  width="100%"
  height="650"
  frameborder="0"
  style="border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;"
  title="HackForge Public Gallery"
></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Embeddable Gallery Widget Generator</h2>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                Widget Integration
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Embed the live hackathon public gallery into university portals, sponsor pages, or community blogs.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg cursor-pointer">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
              >
                <option value="light">Light Theme (Clean White)</option>
                <option value="dark">Dark Theme (Slate Black)</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Track Filter</label>
              <select
                value={trackFilter}
                onChange={(e) => setTrackFilter(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
              >
                <option value="all">All Tracks</option>
                <option value="trk-core">Platform Architecture</option>
                <option value="trk-judging">Judging & Normalization</option>
                <option value="trk-security">Anti-Abuse & DevOps</option>
              </select>
            </div>
          </div>

          {/* Snippet */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-500 uppercase text-[10px]">HTML Embed Code</span>
              <button
                onClick={handleCopy}
                className="text-amber-700 font-semibold cursor-pointer text-xs"
              >
                {copied ? '✓ Copied Snippet!' : 'Copy Code'}
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-amber-300 font-mono text-xs rounded-lg overflow-x-auto select-all leading-relaxed">
              {embedCode}
            </pre>
          </div>

          {/* Live Preview Container */}
          <div className="pt-2 space-y-1">
            <span className="font-mono text-slate-500 uppercase text-[10px]">Widget Live Preview</span>
            <div
              className={`p-4 rounded-xl border text-center space-y-2 ${
                theme === 'dark' ? 'bg-slate-950 text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-200'
              }`}
            >
              <div className="text-xs font-bold font-mono tracking-wider">
                HACKFORGE · PUBLIC GALLERY WIDGET
              </div>
              <div className="text-[11px] text-slate-400">
                Rendering 4 verified submissions · Randomized position bias mitigation active
              </div>
              <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto pt-2 text-[11px]">
                <div className={`p-2 rounded border text-left ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="font-bold truncate">ConsensusMatrix</div>
                  <div className="text-[10px] text-slate-500 truncate">Judging Engine</div>
                </div>
                <div className={`p-2 rounded border text-left ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="font-bold truncate">ZeroCloud Pod</div>
                  <div className="text-[10px] text-slate-500 truncate">Hermetic Local</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-medium rounded-md hover:bg-slate-100 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
