import React, { useState } from 'react';
import {
  README_MD,
  ARCHITECTURE_MD,
  DATA_MODEL_MD,
  JUDGING_MD,
  THREAT_MODEL_MD,
  DOCKER_COMPOSE_YML,
  DOCKERFILE,
} from '../docs/documentationContent';

export const DocumentationView: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<string>('readme');
  const [copied, setCopied] = useState(false);

  const docsMap: Record<string, { title: string; filename: string; content: string }> = {
    readme: { title: 'README.md', filename: 'README.md', content: README_MD },
    architecture: { title: 'ARCHITECTURE.md', filename: 'ARCHITECTURE.md', content: ARCHITECTURE_MD },
    datamodel: { title: 'DATA-MODEL.md', filename: 'DATA-MODEL.md', content: DATA_MODEL_MD },
    judging: { title: 'JUDGING.md', filename: 'JUDGING.md', content: JUDGING_MD },
    threatmodel: { title: 'THREAT-MODEL.md', filename: 'THREAT-MODEL.md', content: THREAT_MODEL_MD },
    docker: { title: 'docker-compose.yml', filename: 'docker-compose.yml', content: DOCKER_COMPOSE_YML },
    dockerfile: { title: 'Dockerfile', filename: 'Dockerfile', content: DOCKERFILE },
  };

  const current = docsMap[activeDoc];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([current.content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', current.filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Project Documentation & Architecture Hub</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive specifications, mathematical proofs, threat models, and Docker configs as mandated for submission.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-300 transition-colors cursor-pointer font-mono"
            >
              {copied ? '✓ Copied Markdown' : 'Copy Content'}
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer font-mono"
            >
              Download {current.filename}
            </button>
          </div>
        </div>

        {/* Document Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-t border-slate-100 pt-3 scrollbar-none">
          {Object.entries(docsMap).map(([key, d]) => (
            <button
              key={key}
              onClick={() => setActiveDoc(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeDoc === key
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {d.title}
            </button>
          ))}
        </div>
      </div>

      {/* Reader Container */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 shadow-xs">
        <pre className="font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed overflow-x-auto">
          {current.content}
        </pre>
      </div>
    </div>
  );
};
