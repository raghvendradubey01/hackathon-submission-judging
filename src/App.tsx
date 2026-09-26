import React, { useState, useEffect } from 'react';
import { store, AppState } from './services/store';
import { TopNav } from './components/TopNav';
import { ProductLandingPage } from './components/ProductLandingPage';
import { EventManagementView } from './components/EventManagementView';
import { PublicGallery } from './components/PublicGallery';
import { TeamStudio } from './components/TeamStudio';
import { JudgingDashboard } from './components/JudgingDashboard';
import { LeaderboardAndNormalization } from './components/LeaderboardAndNormalization';
import { DocumentationView } from './components/DocumentationView';
import { AcceptanceSuiteView } from './components/AcceptanceSuiteView';
import { ParticipantDashboard } from './components/ParticipantDashboard';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { CertificateGeneratorModal } from './components/CertificateGeneratorModal';
import { InteractiveApiPlayground } from './components/InteractiveApiPlayground';
import { EmbedWidgetModal } from './components/EmbedWidgetModal';

export default function App() {
  const [state, setState] = useState<AppState>(store.getState());
  const [currentTab, setCurrentTab] = useState<string>('overview');

  // Modals
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [isCertificatesOpen, setIsCertificatesOpen] = useState(false);
  const [isApiPlaygroundOpen, setIsApiPlaygroundOpen] = useState(false);
  const [isEmbedWidgetOpen, setIsEmbedWidgetOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState({ ...store.getState() });
    });
    return unsubscribe;
  }, []);

  // Leaderboard data
  const { results: leaderboardResults, judgeStats } = store.getLeaderboard();

  // CSV download helper
  const downloadFile = (content: string, filename: string, type: string = 'text/csv') => {
    const blob = new Blob([content], { type: `${type};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Bar Contract Navigation */}
      <TopNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={state.currentUser}
        onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
        onOpenCertificates={() => setIsCertificatesOpen(true)}
        onOpenApiDocs={() => setIsApiPlaygroundOpen(true)}
        onResetData={() => store.resetToSeedData()}
      />

      {/* Main Viewport Container (1440px max width baseline) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'overview' && (
          <ProductLandingPage
            event={state.event}
            onNavigateTab={setCurrentTab}
            onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
          />
        )}

        {currentTab === 'dashboard' && (
          <>
            {state.currentUser.role === 'participant' && (
              <ParticipantDashboard
                currentUser={state.currentUser}
                event={state.event}
                teams={state.teams}
                submissions={state.submissions}
                onNavigateTab={setCurrentTab}
              />
            )}

            {state.currentUser.role === 'judge' && (
              <JudgingDashboard
                currentUser={state.currentUser}
                assignments={state.assignments}
                submissions={state.submissions}
                rubric={state.rubric}
                scores={state.scores}
                pairwiseMatches={state.pairwiseMatches}
                teams={state.teams}
                onSubmitScore={(subId, scoresMap, note) => store.submitScore(subId, scoresMap, note)}
                onRecordPairwiseMatch={(a, b, winner, reason) => store.recordPairwiseMatch(a, b, winner, reason)}
                onRunAlgorithmicAssignment={() => store.runAlgorithmicAssignment(3)}
              />
            )}

            {state.currentUser.role === 'organizer' && (
              <OrganizerDashboard
                currentUser={state.currentUser}
                event={state.event}
                users={state.users}
                teams={state.teams}
                submissions={state.submissions}
                rubric={state.rubric}
                scores={state.scores}
                assignments={state.assignments}
                votes={state.votes}
                onToggleEmbargo={() => store.toggleEmbargo()}
                onRunAlgorithmicAssignment={() => store.runAlgorithmicAssignment(3)}
                onUpdateRubric={(criteria) => store.updateRubric(criteria)}
                onNavigateTab={setCurrentTab}
                onExportSubmissionsCSV={() => downloadFile(store.exportSubmissionsCSV(), 'submissions.csv')}
                onExportScoresCSV={() => downloadFile(store.exportScoresCSV(), 'scores.csv')}
                onExportLeaderboardCSV={() => downloadFile(store.exportLeaderboardCSV(), 'leaderboard.csv')}
              />
            )}

            {state.currentUser.role === 'admin' && (
              <AdminDashboard
                currentUser={state.currentUser}
                users={state.users}
                event={state.event}
                auditLogs={state.auditLogs}
                webhooks={state.webhooks}
                onResetSeedData={() => store.resetToSeedData()}
                onExportAllJSON={() => downloadFile(store.exportAllAsJSON(), 'hackforge-backup.json', 'application/json')}
                onImportJSON={(json) => store.importFromJSON(json)}
                onNavigateTab={setCurrentTab}
              />
            )}
          </>
        )}

        {currentTab === 'events' && (
          <EventManagementView
            currentUser={state.currentUser}
            event={state.event}
            teams={state.teams}
            submissions={state.submissions}
            onUpdateEvent={(updated) => store.updateEvent(updated)}
            onCreateNewEvent={(newEvent) => store.createEvent(newEvent)}
            onNavigateTab={setCurrentTab}
          />
        )}

        {(currentTab === 'teams' || currentTab === 'team' || currentTab === 'submissions') && (
          <TeamStudio
            currentUser={state.currentUser}
            teams={state.teams}
            submissions={state.submissions}
            tracks={state.event.tracks}
            event={state.event}
            onCreateTeam={(name, tagline) => store.createTeam(name, tagline)}
            onJoinTeam={(code) => store.joinTeamWithInvite(code)}
            onLeaveTeam={(id) => store.leaveTeam(id)}
            onSaveSubmission={(data, asDraft) => store.saveSubmission(data, asDraft)}
          />
        )}

        {currentTab === 'gallery' && (
          <PublicGallery
            submissions={state.submissions}
            teams={state.teams}
            tracks={state.event.tracks}
            currentUser={state.currentUser}
            votes={state.votes}
            comments={state.comments}
            onCastVote={(subId, type, credits) => {
              const res = store.castCommunityVote(subId, type, credits);
              alert(res.message);
            }}
            onAddComment={(subId, content) => {
              store.addComment(subId, content);
            }}
            onOpenEmbedWidget={() => setIsEmbedWidgetOpen(true)}
          />
        )}

        {currentTab === 'judging' && (
          <JudgingDashboard
            currentUser={state.currentUser}
            assignments={state.assignments}
            submissions={state.submissions}
            rubric={state.rubric}
            scores={state.scores}
            pairwiseMatches={state.pairwiseMatches}
            teams={state.teams}
            onSubmitScore={(subId, scoresMap, note) => store.submitScore(subId, scoresMap, note)}
            onRecordPairwiseMatch={(a, b, winner, reason) => store.recordPairwiseMatch(a, b, winner, reason)}
            onRunAlgorithmicAssignment={() => store.runAlgorithmicAssignment(3)}
          />
        )}

        {(currentTab === 'results' || currentTab === 'leaderboard') && (
          <LeaderboardAndNormalization
            currentUser={state.currentUser}
            results={leaderboardResults}
            judgeStats={judgeStats}
            resultsEmbargoed={state.event.resultsEmbargoed}
            onToggleEmbargo={() => store.toggleEmbargo()}
            onExportSubmissionsCSV={() => downloadFile(store.exportSubmissionsCSV(), 'submissions.csv')}
            onExportScoresCSV={() => downloadFile(store.exportScoresCSV(), 'scores.csv')}
            onExportLeaderboardCSV={() => downloadFile(store.exportLeaderboardCSV(), 'leaderboard.csv')}
          />
        )}

        {currentTab === 'audit' && (
          <AdminDashboard
            currentUser={state.currentUser}
            users={state.users}
            event={state.event}
            auditLogs={state.auditLogs}
            webhooks={state.webhooks}
            onResetSeedData={() => store.resetToSeedData()}
            onExportAllJSON={() => downloadFile(store.exportAllAsJSON(), 'hackforge-backup.json', 'application/json')}
            onImportJSON={(json) => store.importFromJSON(json)}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'docs' && <DocumentationView />}

        {currentTab === 'acceptance' && <AcceptanceSuiteView />}
      </main>

      {/* Global Modals */}
      <RoleSwitcherModal
        isOpen={isRoleSwitcherOpen}
        onClose={() => setIsRoleSwitcherOpen(false)}
        users={state.users}
        currentUser={state.currentUser}
        onSelectUser={(userId) => store.setCurrentUser(userId)}
        onResetSeedData={() => store.resetToSeedData()}
      />

      <CertificateGeneratorModal
        isOpen={isCertificatesOpen}
        onClose={() => setIsCertificatesOpen(false)}
        users={state.users}
        submissions={state.submissions}
        teams={state.teams}
      />

      <InteractiveApiPlayground
        isOpen={isApiPlaygroundOpen}
        onClose={() => setIsApiPlaygroundOpen(false)}
      />

      <EmbedWidgetModal
        isOpen={isEmbedWidgetOpen}
        onClose={() => setIsEmbedWidgetOpen(false)}
      />

      {/* Footer (Clean, natural SaaS footer) */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">HackForge</span>
            <span aria-hidden="true">·</span>
            <span>Open-source Hackathon Platform</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-mono">Self-Hosted</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <button
              onClick={() => store.resetToSeedData()}
              className="text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Reset Seed Data
            </button>
            <button
              onClick={() => downloadFile(store.exportAllAsJSON(), 'hackforge-backup.json', 'application/json')}
              className="text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Export JSON Snapshot
            </button>
            <button
              onClick={() => setIsApiPlaygroundOpen(true)}
              className="text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              OpenAPI 3.0
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
