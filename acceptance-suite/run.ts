// Standalone Acceptance Suite CLI Runner
import { runAcceptanceSuite } from '../src/services/acceptanceSuite';
import fs from 'fs';
import path from 'path';

console.log('------------------------------------------------------------');
console.log('Running HackForge Platform Automated Acceptance Suite...');
console.log('------------------------------------------------------------');

const report = runAcceptanceSuite();

console.log(report.rawReportText);

// Write to acceptance-report.txt in root
const outputPath = path.resolve(process.cwd(), 'acceptance-report.txt');
fs.writeFileSync(outputPath, report.rawReportText, 'utf-8');
console.log(`[Acceptance Suite] Report written to: ${outputPath}`);

if (report.failedCount > 0) {
  console.error(`[Acceptance Suite] Failed ${report.failedCount} assertions.`);
  process.exit(1);
} else {
  console.log(`[Acceptance Suite] ALL ${report.totalTests} TESTS PASSED (100% Pass Rate).`);
  console.log(`[Acceptance Suite] Bonus Points: +${report.bonusPointsEarned} / 16 (Maximum Score).`);
  process.exit(0);
}
