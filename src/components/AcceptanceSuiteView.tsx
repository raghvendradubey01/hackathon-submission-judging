import React, { useState, useEffect } from 'react';
import { runAcceptanceSuite, AcceptanceSuiteReport } from '../services/acceptanceSuite';

export const AcceptanceSuiteView: React.FC = () => {
  const [report, setReport] = useState<AcceptanceSuiteReport | null>(null);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [filterTier, setFilterTier] = useState<string>('all');

  useEffect(() => {
    // Run initial test suite on mount
    const initialReport = runAcceptanceSuite();
    setReport(initialReport);
  }, []);

  const handleRunTests = () => {
    setRunning(true);
    setTimeout(() => {
      const rep = runAcceptanceSuite();
      setReport(rep);
      setRunning(false);
    }, 400);
  };

  const handleDownloadReport = () => {
    if (!report) return;
    const blob = new Blob([report.rawReportText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'acceptance-report.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyReport = () => {
    if (!report) return;
    navigator.clipboard.writeText(report.rawReportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredResults = report
    ? report.results.filter((r) => filterTier === 'all' || r.tier === filterTier)
    : [];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Acceptance Test Suite Runner</h2>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Automated Verification
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Validates platform invariants across T1–T4 tiers and bonus challenges. Generates the mandatory <code className="font-mono bg-slate-100 px-1 py-0.2 rounded">acceptance-report.txt</code>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRunTests}
              disabled={running}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 font-mono"
            >
              {running ? 'Running Tests...' : '▶ Re-run Test Suite'}
            </button>
            <button
              onClick={handleCopyReport}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold font-mono border border-slate-300 transition-colors cursor-pointer"
            >
              {copied ? '✓ Copied' : 'Copy Report'}
            </button>
            <button
              onClick={handleDownloadReport}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer"
            >
              Download acceptance-report.txt
            </button>
          </div>
        </div>

        {/* Metrics Summary Grid */}
        {report && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs font-mono">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-slate-400 text-[10px]">Total Tests:</div>
              <div className="text-xl font-black text-slate-900 mt-0.5">{report.totalTests}</div>
            </div>
            <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200">
              <div className="text-emerald-700 text-[10px]">Passed Tests:</div>
              <div className="text-xl font-black text-emerald-800 mt-0.5">{report.passedCount}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-slate-400 text-[10px]">Pass Rate:</div>
              <div className="text-xl font-black text-slate-900 mt-0.5">
                {((report.passedCount / report.totalTests) * 100).toFixed(0)}%
              </div>
            </div>
            <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200">
              <div className="text-amber-800 text-[10px]">Bonus Points:</div>
              <div className="text-xl font-black text-amber-900 mt-0.5">
                +{report.bonusPointsEarned} / {report.maxBonusPoints}
              </div>
            </div>
          </div>
        )}

        {/* Tier Filter Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
          {['all', 'T1', 'T2', 'T3', 'T4', 'BONUS'].map((tier) => (
            <button
              key={tier}
              onClick={() => setFilterTier(tier)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                filterTier === tier
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {tier === 'all' ? 'All Assertions' : tier}
            </button>
          ))}
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono">
              <tr>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">ID</th>
                <th className="py-3 px-4 font-semibold">Tier</th>
                <th className="py-3 px-4 font-semibold">Category & Test Name</th>
                <th className="py-3 px-4 font-semibold">Assertion Description</th>
                <th className="py-3 px-4 font-semibold text-right">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredResults.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    {r.passed ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px] font-bold">
                        PASS
                      </span>
                    ) : (
                      <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[11px] font-bold">
                        FAIL
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">{r.id}</td>
                  <td className="py-3 px-4 text-slate-600">[{r.tier}]</td>
                  <td className="py-3 px-4 font-sans">
                    <div className="font-semibold text-slate-900">{r.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{r.category}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-sans text-[11px]">
                    {r.assertion}
                    {r.error && <div className="text-rose-600 mt-1">{r.error}</div>}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-400">{r.durationMs}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
