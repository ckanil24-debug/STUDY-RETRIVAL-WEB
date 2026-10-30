import React, { useState, useEffect } from 'react';
import { Video, FileText, Layers, CheckCircle2, Bookmark, ShieldCheck } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthView } from './components/auth/AuthView';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { YouTubeSummarizer } from './components/youtube/YouTubeSummarizer';
import { PDFSummarizer } from './components/pdf/PDFSummarizer';
import { SmartCompanionView } from './components/companion/SmartCompanionView';
import { KnowledgeHubView } from './components/notebook/KnowledgeHubView';
import { EcosystemAndChecklistView } from './components/notebook/EcosystemAndChecklistView';
import { INITIAL_STUDY_FOLDERS } from './data/mockStudyFolders';
import {
  AnchoredNote,
  ComplexityLevel,
  PDFSource,
  PodcastSource,
  StudyFolder,
  WebArticleSource,
  YouTubeSource,
} from './types/study';

type WorkspaceTab = 'youtube' | 'pdf' | 'companion' | 'notebook' | 'checklist';

function extractYouTubeId(url: string): string {
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : 'sQK3Yr4Sc_k';
}

const WorkspaceContent: React.FC = () => {
  const { user } = useAuth();
  const [folders, setFolders] = useState<StudyFolder[]>(INITIAL_STUDY_FOLDERS);
  const [activeFolderId, setActiveFolderId] = useState<string>(
    INITIAL_STUDY_FOLDERS[0].id
  );
  const [selectedPdfId, setSelectedPdfId] = useState<string>(
    INITIAL_STUDY_FOLDERS[0].pdfSources[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('pdf');
  const [complexity, setComplexity] = useState<ComplexityLevel>(3);
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  const [externalSeekSeconds, setExternalSeekSeconds] = useState<number | null>(
    null
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<string>('EN');
  const [userPlan, setUserPlan] = useState<'Free' | 'Pro'>('Pro');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === '1') setActiveTab('youtube');
      if (e.altKey && e.key === '2') setActiveTab('pdf');
      if (e.altKey && e.key === '3') setActiveTab('companion');
      if (e.altKey && e.key === '4') setActiveTab('notebook');
      if (e.altKey && e.key === '5') setActiveTab('checklist');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!user) {
    return <AuthView />;
  }

  const activeFolder =
    folders.find((f) => f.id === activeFolderId) || folders[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const handleAddYouTubeUrl = (url: string, title: string) => {
    const videoId = extractYouTubeId(url);
    const newYt: YouTubeSource = {
      id: 'yt-' + Date.now(),
      title,
      channelName: 'Ingested Lecture Stream',
      videoId,
      url,
      duration: '19:45',
      crashCourseSummary: {
        1: [
          '🌟 Core Idea: Breaks down the big lecture topic into simple everyday steps.',
          '🔋 Mechanism: Shows how the main parts pass energy and information back and forth.',
          '🎯 Takeaway: Gives you the 3 must-know facts for your next quiz!',
        ],
        2: [
          '📌 Concept Overview: Introduces the primary definitions and foundational equations from the lecture.',
          '⚙️ Step-by-Step Mechanism: Traces how inputs transform into outputs across each stage.',
          '📝 Exam High-Yield Summary: Highlights common test pitfalls and key boundary conditions.',
        ],
        3: [
          '🔬 Theoretical Framework: Establishes formal definitions, system architecture, and governing equations.',
          '📊 Mechanistic Derivation: Connects empirical observations to underlying rate-limiting steps.',
          '⚖️ Comparative Synthesis: Contrasts standard assumptions against real-world edge cases.',
        ],
        4: [
          '📐 Formal Derivation: Derives coupled state equations and thermodynamic/computational constraints.',
          '🧪 Methodological Rigor: Evaluates experimental parameterization and asymptotic scaling behavior.',
          '🔍 Boundary Limitations: Identifies regime transitions where linear approximations break down.',
        ],
        5: [
          '⚛️ First-Principles Formalism: Constructs the complete operator-theoretic and kinetic framework.',
          '📈 Spectral & Perturbation Analysis: Resolves non-linear coupling and stability manifolds.',
          '📑 Scholarly Critique: Synthesizes open theoretical tensions and empirical reproducibility bounds.',
        ],
      },
      chapters: [
        {
          id: 'custom-ch-1',
          timestampSeconds: 90,
          formattedTime: '01:30',
          title: 'Core Thesis & Foundational Definitions',
          slideSnapshotTitle: 'Slide 02: Core System Architecture',
          slideDiagramType: 'custom',
          slideVisualKeypoints: [
            'Primary Input-Output Formulation',
            'Key State Variables & Notation',
            'Baseline Conservation Laws',
          ],
          summaryByComplexity: {
            1: 'At 01:30, the speaker introduces the big picture using a simple building-block story so anyone can follow along.',
            2: 'This opening chapter defines the main terms on the slide and explains what problem the lecture is solving.',
            3: 'Establishes the formal system boundaries, variable notation, and core governing relationship presented on Slide 2.',
            4: 'Formulates the axiomatic assumptions and parameter spaces required prior to deriving the main theorem.',
            5: 'Critically examines the domain constraints and measure-theoretic prerequisites underlying the canonical formulation.',
          },
        },
        {
          id: 'custom-ch-2',
          timestampSeconds: 435,
          formattedTime: '07:15',
          title: 'Step-by-Step Derivation & Bottleneck Analysis',
          slideSnapshotTitle: 'Slide 08: Rate-Limiting Equation & Proof',
          slideDiagramType: 'custom',
          slideVisualKeypoints: [
            'Page 4 / Slide 8 Coupled Equation',
            'Scaling & Normalization Factor',
            'Empirical Performance Curve',
          ],
          summaryByComplexity: {
            1: 'At 07:15, we see why the system slows down at a narrow bottleneck and how a clever trick speeds it right back up!',
            2: 'Walks through the main formula step-by-step, showing how changing the input affects the final output rate.',
            3: 'Derives the primary rate-limiting equation and demonstrates how normalization prevents instability.',
            4: 'Performs a rigorous asymptotic bottleneck analysis across regimes, linking slide equations to experimental curves.',
            5: 'Resolves the non-analytic regime switching behavior and proves optimality bounds under resource constraints.',
          },
        },
      ],
    };

    setFolders((prev) =>
      prev.map((f) =>
        f.id === activeFolder.id
          ? { ...f, youtubeSources: [newYt, ...f.youtubeSources] }
          : f
      )
    );
    setActiveTab('youtube');
    showToast(`Ingested YouTube lecture "${title}" with timestamped chapters.`);
  };

  const handleUploadPdfFile = (file: File) => {
    const cleanName = file.name;
    const blobUrl = URL.createObjectURL(file);
    const newPdf: PDFSource = {
      id: 'pdf-' + Date.now(),
      filename: cleanName,
      authors: 'Uploaded Academic Manuscript',
      publicationYear: 2026,
      pageCount: 12,
      uploadedAt: 'Just now',
      fileUrl: blobUrl,
      summary: {
        tldr: {
          1: `This uploaded document (${cleanName}) explains a big scientific idea using clear step-by-step building blocks. It shows what slows the system down and how a smart design fixes the problem. By the end, you can see how all the pieces work together in real life!`,
          2: `This paper (${cleanName}) investigates the core mechanisms and rate-limiting steps of the target system. It presents a clear mathematical model on Page 4 and validates it with experimental measurements. Finally, it summarizes key takeaways for exam preparation and practical application.`,
          3: `In ${cleanName}, the authors formulate a structured analytical model capturing the primary governing equations and empirical trade-offs of the domain. The core thesis demonstrates that system throughput is bounded by two competing regimes that transition sharply at a critical threshold. Experimental validation confirms the theoretical predictions across standard operating parameters.`,
          4: `This manuscript (${cleanName}) establishes a rigorous mechanistic and quantitative framework coupling microscopic kinetics to macroscopic system performance. By deriving closed-form boundary conditions on Page 4, the authors resolve longstanding discrepancies between idealized models and empirical observations. Sensitivity analysis further isolates the dominant control parameters governing regime stability.`,
          5: `${cleanName} derives an asymptotically exact coupled formulation bridging foundational theory with high-dimensional empirical phenomenology. Through perturbation analysis and variational bounds, the authors prove that the governing operator exhibits a Pareto-optimal trade-off manifold constrained by intrinsic thermodynamic and informational limits. These findings generalize prior domain-specific heuristics into a unified canonical theory.`,
        },
        argumentMap: [
          {
            id: 'up-arg-1',
            heading: 'Core Governing Formulation & Threshold Proof (Page 4)',
            category: 'Theorem / Proof',
            pageRef: 4,
            formulaOrHighlight: 'Ψ(x) = α · min(Φ_supply(x), Φ_capacity(x)) - δ_loss',
            contentByComplexity: {
              1: 'Page 4 shows that the system only runs as fast as its slowest helper part!',
              2: 'Page 4 introduces the core equation showing how output depends on the minimum of supply and capacity.',
              3: 'Page 4 derives the piecewise rate equation governing steady-state flux and boundary transitions.',
              4: 'Page 4 formalizes the coupled constraint equation and proves uniqueness of the inflection point.',
              5: 'Page 4 establishes the non-linear operator bound and proves tight convergence across parameter manifolds.',
            },
          },
          {
            id: 'up-arg-2',
            heading: 'Experimental Validation & Comparative Benchmarks',
            category: 'Empirical Result',
            pageRef: 8,
            formulaOrHighlight: 'R² = 0.994 across N = 120 experimental trials',
            contentByComplexity: {
              1: 'Page 8 tests the idea in real life and proves the math rule works almost every single time!',
              2: 'Page 8 compares the model against real lab data, showing 99.4% accuracy across 120 tests.',
              3: 'Page 8 presents empirical benchmarks validating the theoretical predictions across temperature and load regimes.',
              4: 'Page 8 quantifies residual variance and demonstrates superior predictive power over legacy baseline models.',
              5: 'Page 8 executes non-parametric cross-validation, confirming homoscedastic error bounds across all regimes.',
            },
          },
        ],
        glossary: [
          {
            term: 'Critical Inflection Threshold',
            pageRef: 4,
            symbolOrTag: 'x_crit',
            definitionByComplexity: {
              1: 'The exact tipping point where the system switches from one speed limit to another.',
              2: 'The threshold value on Page 4 where the rate-limiting factor switches between supply and capacity.',
              3: 'The analytical boundary point equating primary supply flux to maximum catalytic/system capacity.',
              4: 'The bifurcation coordinate in parameter space where ∂Ψ/∂x exhibits a discontinuous derivative.',
              5: 'Singular perturbation manifold separating zero-order saturation from first-order diffusive limitation.',
            },
          },
        ],
      },
    };

    setFolders((prev) =>
      prev.map((f) =>
        f.id === activeFolder.id
          ? { ...f, pdfSources: [newPdf, ...f.pdfSources] }
          : f
      )
    );
    setSelectedPdfId(newPdf.id);
    setActiveTab('pdf');
    showToast(`Loaded PDF into Split Model: "${cleanName}".`);
  };

  const handleCrossSourceVideoJump = (seconds: number) => {
    setExternalSeekSeconds(seconds);
    setActiveTab('youtube');
    showToast(
      `Jumped embedded YouTube player to ${Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`
    );
  };

  const handleAddAnchoredNote = (note: AnchoredNote) => {
    setFolders((prev) =>
      prev.map((f) =>
        f.id === activeFolder.id
          ? { ...f, anchoredNotes: [note, ...(f.anchoredNotes || [])] }
          : f
      )
    );
    showToast(`Bound note directly to locator "${note.locatorLabel}".`);
  };

  const handlePinPageAnchor = (pdfName: string, page: number, quote: string) => {
    const newNote: AnchoredNote = {
      id: 'note-pin-' + Date.now(),
      sourceType: 'pdf',
      sourceTitle: pdfName,
      locatorLabel: `PDF Page ${page}`,
      locatorPage: page,
      highlightQuote: quote,
      userAnnotation: `Anchored from In-App PDF Viewer on Page ${page} for rapid revision.`,
      tags: [`#page-${page}`, '#pdf-anchor'],
      createdAt: 'Just now',
    };
    handleAddAnchoredNote(newNote);
    setActiveTab('notebook');
  };

  const handleAddTagToNote = (noteId: string, newTag: string) => {
    setFolders((prev) =>
      prev.map((f) =>
        f.id === activeFolder.id
          ? {
              ...f,
              anchoredNotes: (f.anchoredNotes || []).map((n) =>
                n.id === noteId && !n.tags.includes(newTag)
                  ? { ...n, tags: [...n.tags, newTag] }
                  : n
              ),
            }
          : f
      )
    );
    showToast(`Added custom tag ${newTag}`);
  };

  const handleAddPodcastOrArticle = (
    type: 'podcast' | 'article',
    title: string,
    url: string
  ) => {
    if (type === 'podcast') {
      const newPod: PodcastSource = {
        id: 'pod-' + Date.now(),
        title,
        showName: url.includes('apple') ? 'Apple Podcasts Stream' : 'Spotify Academic Feed',
        platform: url.includes('apple') ? 'Apple Podcasts' : 'Spotify',
        duration: '32:10',
        episodeUrl: url,
        segments: [
          {
            id: 'seg-custom-' + Date.now(),
            timestamp: '08:15',
            seconds: 495,
            topic: 'Core Mechanism & Cross-Source Takeaway',
            transcriptSnippet:
              'Key spoken insight extracted from the audio stream and anchored to timestamp 08:15...',
          },
        ],
        summaryByComplexity: {
          1: `A fun podcast episode (${title}) that explains the main idea using everyday stories!`,
          2: `Summarizes key interview takeaways from ${title} for quick exam review.`,
          3: `Synthesizes primary arguments, methodology discussions, and timestamps from ${title}.`,
          4: `Evaluates technical trade-offs and experimental context discussed in ${title}.`,
          5: `Critiques domain formalisms and open research questions presented in ${title}.`,
        },
      };
      setFolders((prev) =>
        prev.map((f) =>
          f.id === activeFolder.id
            ? { ...f, podcastSources: [newPod, ...(f.podcastSources || [])] }
            : f
        )
      );
      showToast(`Pulled podcast episode "${title}" into Smart Notebook.`);
    } else {
      const newArt: WebArticleSource = {
        id: 'art-' + Date.now(),
        title,
        domain: 'web-capture.org',
        url,
        author: 'Research Contributor',
        readingTime: '6 min read',
        savedVia: 'Web Importer',
        highlights: [
          `Primary thesis extracted from ${url} and grounded against folder sources.`,
        ],
        summaryByComplexity: {
          1: `This web article (${title}) explains the topic in simple, friendly language!`,
          2: `Highlights the main facts and examples from ${title} for study prep.`,
          3: `Connects empirical findings in ${title} to the folder's PDF and video lectures.`,
          4: `Analyzes methodological nuances and quantitative claims in ${title}.`,
          5: `Synthesizes theoretical implications and boundary conditions from ${title}.`,
        },
      };
      setFolders((prev) =>
        prev.map((f) =>
          f.id === activeFolder.id
            ? {
                ...f,
                webArticleSources: [newArt, ...(f.webArticleSources || [])],
              }
            : f
        )
      );
      showToast(`Pulled web article "${title}" into Smart Notebook.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header with User Profile, Logout & Standout 5-Tier Complexity Slider */}
      <Header
        complexity={complexity}
        onComplexityChange={setComplexity}
        geminiApiKey={geminiApiKey}
        onSaveApiKey={(key) => {
          setGeminiApiKey(key);
          showToast(
            key
              ? 'Live Gemini API key saved for Cross-Source Q&A.'
              : 'Switched to built-in instant multi-tier engine.'
          );
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-indigo-950/95 border border-indigo-500/50 text-indigo-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-medium backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Workspace Body */}
      <div className="max-w-[1600px] w-full mx-auto flex-1 flex flex-col lg:flex-row">
        {/* Left Sidebar: Study Spaces & Ingestion Controls */}
        <Sidebar
          folders={folders}
          activeFolderId={activeFolder.id}
          activePdfId={selectedPdfId}
          onSelectFolder={(id) => {
            setActiveFolderId(id);
            setExternalSeekSeconds(null);
            const found = folders.find((f) => f.id === id);
            if (found && found.pdfSources[0]) {
              setSelectedPdfId(found.pdfSources[0].id);
            }
          }}
          onSelectPdf={(pdfId) => {
            setSelectedPdfId(pdfId);
            setActiveTab('pdf');
            showToast('Opened PDF in Standard Split Model Viewer.');
          }}
          onSelectYouTube={() => {
            setActiveTab('youtube');
          }}
          onAddYouTubeUrl={handleAddYouTubeUrl}
          onUploadPdfFile={handleUploadPdfFile}
        />

        {/* Right Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 min-w-0">
          {/* Folder Header + Pillar Navigation Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/90 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {activeFolder.courseCode}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {activeFolder.name}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {activeFolder.description}
              </p>
            </div>

            {/* Pillar Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('youtube')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === 'youtube'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>YouTube Summarizer</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('pdf')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === 'pdf'
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 ring-2 ring-cyan-400/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <FileText className="w-4 h-4 text-cyan-300" />
                <span>PDF Viewer & Summaries (Split Model)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('companion')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === 'companion'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Grounded Sync & Q&A</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('notebook')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === 'notebook'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Smart Notebook & Threads</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('checklist')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === 'checklist'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Ecosystem & PRD Check</span>
              </button>
            </div>
          </div>

          {/* Active Pillar View */}
          {activeTab === 'youtube' && activeFolder.youtubeSources[0] && (
            <YouTubeSummarizer
              source={activeFolder.youtubeSources[0]}
              complexity={complexity}
              externalSeekSeconds={externalSeekSeconds}
            />
          )}

          {activeTab === 'pdf' && (
            <PDFSummarizer
              pdfSources={activeFolder.pdfSources}
              multiPdfComparison={activeFolder.multiPdfComparison}
              complexity={complexity}
              selectedPdfId={selectedPdfId}
              onSelectPdf={setSelectedPdfId}
              onPinPageAnchor={handlePinPageAnchor}
              onUploadPdfFile={handleUploadPdfFile}
            />
          )}

          {activeTab === 'companion' && (
            <SmartCompanionView
              folder={activeFolder}
              complexity={complexity}
              geminiApiKey={geminiApiKey}
              onJumpToVideoTimestamp={handleCrossSourceVideoJump}
            />
          )}

          {activeTab === 'notebook' && (
            <KnowledgeHubView
              folder={activeFolder}
              complexity={complexity}
              onAddAnchoredNote={handleAddAnchoredNote}
              onAddTagToNote={handleAddTagToNote}
              onAddPodcastOrArticle={handleAddPodcastOrArticle}
              onJumpToVideoTimestamp={handleCrossSourceVideoJump}
            />
          )}

          {activeTab === 'checklist' && (
            <EcosystemAndChecklistView
              folder={activeFolder}
              activeLanguage={activeLanguage}
              onSelectLanguage={(lang) => {
                setActiveLanguage(lang);
                showToast(`Switched study workspace localization mode to ${lang}.`);
              }}
              userPlan={userPlan}
              onTogglePlan={() => {
                const nextPlan = userPlan === 'Free' ? 'Pro' : 'Free';
                setUserPlan(nextPlan);
                showToast(`Switched workspace tier to ${nextPlan} Plan.`);
              }}
              onSimulateChromeClip={(title, url, highlight) => {
                handleAddPodcastOrArticle('article', title, url);
                handleAddAnchoredNote({
                  id: 'note-chrome-' + Date.now(),
                  sourceType: 'article',
                  sourceTitle: title,
                  locatorLabel: 'Chrome Web Clip §1',
                  highlightQuote: highlight,
                  userAnnotation: `Captured via 1-Click Chrome Browser Extension from ${url}`,
                  tags: ['#chrome-clip', '#web-highlight'],
                  createdAt: 'Just now',
                });
                setActiveTab('notebook');
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <WorkspaceContent />
    </AuthProvider>
  );
}

export default App;
