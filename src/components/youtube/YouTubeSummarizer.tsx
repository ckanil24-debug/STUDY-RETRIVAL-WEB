import React, { useState, useEffect } from 'react';
import {
  Play,
  Clock,
  Zap,
  Camera,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { ComplexityLevel, COMPLEXITY_META, VideoChapter, YouTubeSource } from '../../types/study';

interface YouTubeSummarizerProps {
  source: YouTubeSource;
  complexity: ComplexityLevel;
  externalSeekSeconds?: number | null;
}

const SlideDiagramVisual: React.FC<{ chapter: VideoChapter }> = ({ chapter }) => {
  return (
    <div className="rounded-xl bg-slate-950 border border-slate-800/90 p-3.5 space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/25 px-2 py-0.5 rounded-md">
          <Camera className="w-3 h-3" />
          <span>Frame Snapshot @ {chapter.formattedTime}</span>
        </span>
        <span className="text-[10px] font-mono text-slate-500">EXTRACTED SLIDE</span>
      </div>

      {/* Stylized Vector Lecture Slide Preview */}
      <div className="rounded-lg bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-3">
        <p className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>{chapter.slideSnapshotTitle}</span>
        </p>

        <ul className="space-y-1.5">
          {chapter.slideVisualKeypoints.map((pt, idx) => (
            <li
              key={idx}
              className="text-[11px] font-mono text-slate-300 bg-slate-950/80 border border-slate-800/80 px-2.5 py-1.5 rounded flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const YouTubeSummarizer: React.FC<YouTubeSummarizerProps> = ({
  source,
  complexity,
  externalSeekSeconds,
}) => {
  const [activeChapterId, setActiveChapterId] = useState<string>(
    source.chapters[0]?.id || ''
  );
  const [currentSeconds, setCurrentSeconds] = useState<number>(
    source.chapters[0]?.timestampSeconds || 0
  );
  const [isPlayingSeek, setIsPlayingSeek] = useState<boolean>(false);
  const [crashCourseMode, setCrashCourseMode] = useState<boolean>(false);

  useEffect(() => {
    if (source.chapters.length > 0) {
      setActiveChapterId(source.chapters[0].id);
      setCurrentSeconds(source.chapters[0].timestampSeconds);
      setIsPlayingSeek(false);
    }
  }, [source.id]);

  useEffect(() => {
    if (typeof externalSeekSeconds === 'number') {
      setCurrentSeconds(externalSeekSeconds);
      setIsPlayingSeek(true);
      const matchingChapter = source.chapters.find(
        (c) => c.timestampSeconds === externalSeekSeconds
      );
      if (matchingChapter) {
        setActiveChapterId(matchingChapter.id);
      }
    }
  }, [externalSeekSeconds, source.chapters]);

  const handleJumpToChapter = (chapter: VideoChapter) => {
    setActiveChapterId(chapter.id);
    setCurrentSeconds(chapter.timestampSeconds);
    setIsPlayingSeek(true);
  };

  const activeChapter =
    source.chapters.find((c) => c.id === activeChapterId) || source.chapters[0];

  const embedSrc = `https://www.youtube.com/embed/${source.videoId}?start=${currentSeconds}&autoplay=${
    isPlayingSeek ? 1 : 0
  }&rel=0`;

  const complexityMeta = COMPLEXITY_META[complexity];

  return (
    <div className="space-y-6">
      {/* Top Bar: Source Title & Auto-Generated 3-Min Crash Course Toggle */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
              YouTube Lecture Summarizer
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {source.channelName} • {source.duration}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">{source.title}</h2>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setCrashCourseMode(!crashCourseMode)}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 border transition-all ${
              crashCourseMode
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/30'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{crashCourseMode ? 'Exit 3-Min Crash Course' : '⚡ 3-Min Crash Course Mode'}</span>
          </button>
        </div>
      </div>

      {/* Conditional Auto-Generated 3-Minute Crash Course Banner */}
      {crashCourseMode && (
        <div className="rounded-2xl bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/40 p-5 space-y-4 complexity-transition">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Auto-Generated 3-Minute Executive Crash Course
                </h3>
                <p className="text-xs text-amber-200/80">
                  Rapid pre-exam revision condensed from {source.duration} of lecture video
                </p>
              </div>
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${complexityMeta.badgeColor}`}
            >
              Rewritten at Tier {complexity}: {complexityMeta.shortLabel}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {source.crashCourseSummary[complexity].map((point, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/90 border border-amber-500/25 flex flex-col justify-between gap-2"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-amber-300">
                  <span>KEY TAKEAWAY 0{idx + 1}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Split Grid: Embedded Player & Chapter Navigation Timeline */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 5 Cols: Embedded Video Player + Active Timestamp Controller */}
        <div className="xl:col-span-5 space-y-4">
          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl">
            <div className="aspect-video w-full bg-black relative">
              <iframe
                key={`${source.videoId}-${currentSeconds}-${isPlayingSeek}`}
                src={embedSrc}
                title={source.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Active Player Status Bar */}
            <div className="p-3.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono text-xs font-semibold flex items-center gap-1.5 shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {Math.floor(currentSeconds / 60)
                      .toString()
                      .padStart(2, '0')}
                    :
                    {(currentSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </span>
                <span className="text-xs text-slate-300 font-medium truncate">
                  {activeChapter ? activeChapter.title : 'Ready to jump'}
                </span>
              </div>

              <a
                href={`${source.url}&t=${currentSeconds}s`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-slate-400 hover:text-indigo-300 flex items-center gap-1 shrink-0"
              >
                <span>YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Quick Jump Timestamp Pills */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-2.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
              Quick-Jump Chapter Timestamps (Click to Seek Player)
            </span>
            <div className="flex flex-wrap gap-2">
              {source.chapters.map((chapter) => {
                const isSelected = chapter.id === activeChapterId;
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => handleJumpToChapter(chapter)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/20'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span className="font-mono font-semibold">{chapter.formattedTime}</span>
                    <span className="truncate max-w-[180px]">{chapter.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Timestamped Chapter Cards + Pinned Visual Slide Snapshots */}
        <div className="xl:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span>Timestamped Chapters & Pinned Slide Snapshots</span>
            </h3>
            <span className="text-xs text-indigo-300 font-mono">
              {source.chapters.length} Synchronized Segments
            </span>
          </div>

          <div className="space-y-4">
            {source.chapters.map((chapter) => {
              const isSelected = chapter.id === activeChapterId;
              return (
                <div
                  key={`${chapter.id}-${complexity}`}
                  className={`rounded-2xl border p-5 transition-all complexity-transition ${
                    isSelected
                      ? 'bg-slate-900/95 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  {/* Chapter Header with Clickable Timestamp */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => handleJumpToChapter(chapter)}
                      className="group inline-flex items-center gap-2.5 text-left"
                    >
                      <span
                        className={`px-3 py-1 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 transition ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-indigo-500/15 text-indigo-300 group-hover:bg-indigo-500/30'
                        }`}
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{chapter.formattedTime}</span>
                      </span>
                      <span className="text-base font-bold text-white group-hover:text-indigo-300 transition flex items-center gap-1">
                        <span>
                          {chapter.formattedTime} - {chapter.title}
                        </span>
                        <ChevronRight className="w-4 h-4 opacity-60" />
                      </span>
                    </button>

                    <span
                      className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${complexityMeta.badgeColor}`}
                    >
                      {complexityMeta.shortLabel}
                    </span>
                  </div>

                  {/* Two-Column Interior: Summary Notes + Pinned Visual Slide Snapshot */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    <div className="md:col-span-7 space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span>AI CHAPTER SYNTHESIS (TIER {complexity})</span>
                      </div>
                      <p className="text-sm text-slate-200 leading-relaxed">
                        {chapter.summaryByComplexity[complexity]}
                      </p>
                    </div>

                    <div className="md:col-span-5">
                      <SlideDiagramVisual chapter={chapter} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
