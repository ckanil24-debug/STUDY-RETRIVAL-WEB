import React, { useState } from 'react';
import {
  Bookmark,
  Headphones,
  Globe,
  GitMerge,
  Tag,
  Plus,
  Play,
  FileText,
  Video,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import {
  AnchoredNote,
  ComplexityLevel,
  COMPLEXITY_META,
  PodcastSource,
  StudyFolder,
  SynthesisThread,
  WebArticleSource,
} from '../../types/study';

interface KnowledgeHubViewProps {
  folder: StudyFolder;
  complexity: ComplexityLevel;
  onAddAnchoredNote: (note: AnchoredNote) => void;
  onAddTagToNote: (noteId: string, newTag: string) => void;
  onAddPodcastOrArticle: (
    type: 'podcast' | 'article',
    title: string,
    url: string
  ) => void;
  onJumpToVideoTimestamp: (seconds: number) => void;
}

export const KnowledgeHubView: React.FC<KnowledgeHubViewProps> = ({
  folder,
  complexity,
  onAddAnchoredNote,
  onAddTagToNote,
  onAddPodcastOrArticle,
  onJumpToVideoTimestamp,
}) => {
  const [newNoteQuote, setNewNoteQuote] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteSourceType, setNewNoteSourceType] = useState<
    'pdf' | 'youtube' | 'podcast' | 'article'
  >('pdf');
  const [newNoteLocator, setNewNoteLocator] = useState('PDF Page 4');
  const [newNoteTagInput, setNewNoteTagInput] = useState('#key-insight');

  const [tagInputsById, setTagInputsById] = useState<Record<string, string>>({});

  // Multi-source Podcast / Web Article Importer State
  const [importType, setImportType] = useState<'podcast' | 'article'>('podcast');
  const [importTitle, setImportTitle] = useState('');
  const [importUrl, setImportUrl] = useState('');

  const complexityMeta = COMPLEXITY_META[complexity];
  const podcasts: PodcastSource[] = folder.podcastSources || [];
  const articles: WebArticleSource[] = folder.webArticleSources || [];
  const notes: AnchoredNote[] = folder.anchoredNotes || [];
  const threads: SynthesisThread[] = folder.synthesisThreads || [];

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const created: AnchoredNote = {
      id: 'note-' + Date.now(),
      sourceType: newNoteSourceType,
      sourceTitle:
        newNoteSourceType === 'pdf'
          ? folder.pdfSources[0]?.filename || 'Academic_Paper.pdf'
          : newNoteSourceType === 'youtube'
          ? folder.youtubeSources[0]?.title || 'Lecture Video'
          : newNoteSourceType === 'podcast'
          ? podcasts[0]?.title || 'Podcast Episode'
          : articles[0]?.title || 'Saved Web Article',
      locatorLabel: newNoteLocator.trim() || 'Page 4',
      locatorSeconds: newNoteSourceType === 'youtube' ? 680 : undefined,
      highlightQuote:
        newNoteQuote.trim() ||
        'Selected source passage bound directly to media locator.',
      userAnnotation: newNoteText.trim(),
      tags: newNoteTagInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => (t.startsWith('#') ? t : `#${t}`)),
      createdAt: 'Just now',
    };

    onAddAnchoredNote(created);
    setNewNoteQuote('');
    setNewNoteText('');
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importUrl.trim()) return;
    onAddPodcastOrArticle(
      importType,
      importTitle.trim() ||
        (importType === 'podcast'
          ? 'Imported Podcast Episode (Spotify / Apple)'
          : 'Imported Web Article Clip'),
      importUrl.trim()
    );
    setImportTitle('');
    setImportUrl('');
  };

  return (
    <div className="space-y-8">
      {/* SECTION 1: Podcast & Web Article Content Pulling (PRD 4.1) */}
      <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                Multi-Source Content Pulling
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${complexityMeta.badgeColor}`}
              >
                Tier {complexity}: {complexityMeta.shortLabel}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-1">
              Podcasts (Spotify / Apple) & Web Article Captures
            </h2>
          </div>

          {/* Quick Importer Form for Podcasts & Web Articles */}
          <form
            onSubmit={handleImportSubmit}
            className="flex flex-wrap items-center gap-2"
          >
            <select
              value={importType}
              onChange={(e) =>
                setImportType(e.target.value as 'podcast' | 'article')
              }
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="podcast">🎙️ Podcast (Spotify / Apple)</option>
              <option value="article">🌐 Web Article URL</option>
            </select>
            <input
              type="text"
              value={importTitle}
              onChange={(e) => setImportTitle(e.target.value)}
              placeholder="Title (optional)"
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white w-36 sm:w-44 focus:outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              placeholder="Paste Spotify, Apple Podcast, or Article URL..."
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono w-52 sm:w-64 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Pull Content</span>
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Podcasts Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-purple-300 flex items-center gap-2">
              <Headphones className="w-4 h-4" />
              <span>Synchronized Podcast Episodes ({podcasts.length})</span>
            </h3>
            {podcasts.map((pod) => (
              <div
                key={`${pod.id}-${complexity}`}
                className="rounded-xl bg-slate-950 border border-slate-800/90 p-4 space-y-3 complexity-transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      {pod.platform} • {pod.duration}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">
                      {pod.title}
                    </h4>
                    <p className="text-xs text-slate-400">{pod.showName}</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900/80 border border-slate-800 p-3 rounded-lg">
                  {pod.summaryByComplexity[complexity]}
                </p>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400">
                    Audio Timestamp Locators
                  </span>
                  {pod.segments.map((seg) => (
                    <div
                      key={seg.id}
                      className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-purple-300 font-mono">
                          🎧 {seg.timestamp} — {seg.topic}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] italic">
                        "{seg.transcriptSnippet}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Web Articles Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-300 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>Saved Web Articles & Extension Clips ({articles.length})</span>
            </h3>
            {articles.map((art) => (
              <div
                key={`${art.id}-${complexity}`}
                className="rounded-xl bg-slate-950 border border-slate-800/90 p-4 space-y-3 complexity-transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        {art.savedVia}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {art.domain} • {art.readingTime}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">
                      {art.title}
                    </h4>
                    <p className="text-xs text-slate-400">By {art.author}</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900/80 border border-slate-800 p-3 rounded-lg">
                  {art.summaryByComplexity[complexity]}
                </p>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400">
                    Anchored Web Highlights
                  </span>
                  {art.highlights.map((hl, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/25 text-xs text-emerald-200"
                    >
                      "{hl}"
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: Timestamped & Page-Anchored Notes + Manual Tag Editor (PRD 4.2 & 5.2) */}
      <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Timestamped & Page-Anchored Notes
              </h2>
              <p className="text-xs text-slate-400">
                Context-aware annotations bound directly to video timestamps, podcast audio locators, or PDF page numbers with manual tag editing
              </p>
            </div>
          </div>
        </div>

        {/* Create New Anchored Note Form */}
        <form
          onSubmit={handleCreateNote}
          className="rounded-xl bg-slate-950 border border-slate-800 p-4 grid grid-cols-1 md:grid-cols-12 gap-3"
        >
          <div className="md:col-span-3 space-y-2">
            <label className="block text-[11px] font-mono uppercase text-slate-400">
              Source & Exact Locator
            </label>
            <select
              value={newNoteSourceType}
              onChange={(e) => {
                const val = e.target.value as
                  | 'pdf'
                  | 'youtube'
                  | 'podcast'
                  | 'article';
                setNewNoteSourceType(val);
                setNewNoteLocator(
                  val === 'pdf'
                    ? 'PDF Page 4'
                    : val === 'youtube'
                    ? 'Video @ 11:20'
                    : val === 'podcast'
                    ? 'Podcast @ 14:05'
                    : 'Article §2'
                );
              }}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
            >
              <option value="pdf">📄 Academic PDF</option>
              <option value="youtube">🎬 YouTube Lecture</option>
              <option value="podcast">🎙️ Podcast Audio</option>
              <option value="article">🌐 Web Article</option>
            </select>
            <input
              type="text"
              value={newNoteLocator}
              onChange={(e) => setNewNoteLocator(e.target.value)}
              placeholder="e.g. PDF Page 4 or Video @ 11:20"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-amber-300 font-mono"
            />
          </div>

          <div className="md:col-span-6 space-y-2">
            <label className="block text-[11px] font-mono uppercase text-slate-400">
              Source Highlight & Your Active-Learning Note
            </label>
            <input
              type="text"
              value={newNoteQuote}
              onChange={(e) => setNewNoteQuote(e.target.value)}
              placeholder="Optional quote or formula highlight from source..."
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono"
            />
            <input
              type="text"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Write your synthesis annotation bound to this locator..."
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
            />
          </div>

          <div className="md:col-span-3 flex flex-col justify-between gap-2">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-2">
                Custom Tags
              </label>
              <input
                type="text"
                value={newNoteTagInput}
                onChange={(e) => setNewNoteTagInput(e.target.value)}
                placeholder="#exam, #formula"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-indigo-300 font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Bind Anchored Note</span>
            </button>
          </div>
        </form>

        {/* Anchored Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="rounded-xl bg-slate-950 border border-slate-800/90 p-4 flex flex-col justify-between gap-3"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5">
                    {note.sourceType === 'youtube' ? (
                      <Video className="w-3 h-3" />
                    ) : note.sourceType === 'pdf' ? (
                      <FileText className="w-3 h-3" />
                    ) : (
                      <Headphones className="w-3 h-3" />
                    )}
                    <span>{note.locatorLabel}</span>
                  </span>

                  {note.locatorSeconds && (
                    <button
                      type="button"
                      onClick={() => onJumpToVideoTimestamp(note.locatorSeconds!)}
                      className="px-2 py-1 rounded bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-[11px] font-mono flex items-center gap-1"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>Seek</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 truncate">
                  {note.sourceTitle}
                </p>

                <div className="p-2.5 rounded-lg bg-slate-900 border-l-2 border-indigo-500 text-xs font-mono text-slate-300">
                  "{note.highlightQuote}"
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {note.userAnnotation}
                </p>
              </div>

              {/* Manual Tag Editor (Addresses PRD 5.2 Customization Constraints) */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {note.tags.map((t, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-slate-500" />
                  <input
                    type="text"
                    value={tagInputsById[note.id] || ''}
                    onChange={(e) =>
                      setTagInputsById((prev) => ({
                        ...prev,
                        [note.id]: e.target.value,
                      }))
                    }
                    placeholder="Add custom #tag..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const raw = tagInputsById[note.id]?.trim();
                      if (!raw) return;
                      onAddTagToNote(
                        note.id,
                        raw.startsWith('#') ? raw : `#${raw}`
                      );
                      setTagInputsById((prev) => ({ ...prev, [note.id]: '' }));
                    }}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-200 font-semibold"
                  >
                    + Tag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Cross-Source Threads & Collections Workbench (PRD 4.4) */}
      <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <GitMerge className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Cross-Source Threads & Synthesis Collections
              </h2>
              <p className="text-xs text-slate-400">
                Combines insights from academic PDFs, YouTube lectures, podcasts, and web articles into a unified narrative hub
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${complexityMeta.badgeColor}`}
          >
            Calibrated to Tier {complexity}: {complexityMeta.shortLabel}
          </span>
        </div>

        <div className="space-y-5">
          {threads.map((thread) => (
            <div
              key={`${thread.id}-${complexity}`}
              className="rounded-2xl bg-slate-950 border border-emerald-500/30 p-5 space-y-4 complexity-transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                    {thread.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {thread.title}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  {thread.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Unified Narrative Thesis */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/50 via-slate-900 to-slate-900 border border-indigo-500/30 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-indigo-300">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>UNIFIED MULTI-MEDIUM NARRATIVE THESIS</span>
                  </span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Zero-Hallucination Grounded</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                  {thread.thesisByComplexity[complexity]}
                </p>
              </div>

              {/* Thread Blocks */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {thread.blocks.map((blk, i) => (
                  <div
                    key={blk.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 font-bold">
                        0{i + 1} • {blk.sourceBadge}
                      </span>
                      <span className="text-amber-300">{blk.locator}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {blk.insightByComplexity[complexity]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
