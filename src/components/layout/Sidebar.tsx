import React, { useState } from 'react';
import {
  FolderOpen,
  FileText,
  Video,
  Plus,
  Upload,
  Link2,
  CheckCircle2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { StudyFolder } from '../../types/study';

interface SidebarProps {
  folders: StudyFolder[];
  activeFolderId: string;
  onSelectFolder: (folderId: string) => void;
  onAddYouTubeUrl: (url: string, title: string) => void;
  onUploadPdfFile: (file: File) => void;
  onSelectPdf?: (pdfId: string) => void;
  onSelectYouTube?: (ytId: string) => void;
  activePdfId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  folders,
  activeFolderId,
  onSelectFolder,
  onAddYouTubeUrl,
  onUploadPdfFile,
  onSelectPdf,
  onSelectYouTube,
  activePdfId,
}) => {
  const [showAddYoutube, setShowAddYoutube] = useState(false);
  const [ytUrl, setYtUrl] = useState('');
  const [ytTitle, setYtTitle] = useState('');

  const activeFolder = folders.find((f) => f.id === activeFolderId) || folders[0];

  const handleYoutubeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ytUrl.trim()) return;
    onAddYouTubeUrl(
      ytUrl.trim(),
      ytTitle.trim() || 'Uploaded Lecture: Custom Video Analysis'
    );
    setYtUrl('');
    setYtTitle('');
    setShowAddYoutube(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadPdfFile(file);
      e.target.value = '';
    }
  };

  return (
    <aside className="w-full lg:w-80 shrink-0 bg-slate-900/60 border-b lg:border-b-0 lg:border-r border-slate-800/80 p-4 flex flex-col justify-between gap-6">
      <div className="space-y-6">
        {/* Study Folders Section */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Study Spaces ({folders.length})
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
              Synced
            </span>
          </div>

          <div className="space-y-2">
            {folders.map((folder) => {
              const isSelected = folder.id === activeFolderId;
              return (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => onSelectFolder(folder.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500/50 shadow-sm'
                      : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                      {folder.courseCode}
                    </span>
                    <span className="text-[10px] text-slate-500">{folder.updatedAt}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <FolderOpen
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-indigo-400' : 'text-slate-400'
                      }`}
                    />
                    <span className="text-xs font-semibold text-white line-clamp-1">
                      {folder.name}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5 mt-2 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Video className="w-3 h-3 text-rose-400" />
                      {folder.youtubeSources.length} Video
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3 text-cyan-400" />
                      {folder.pdfSources.length} PDFs
                    </span>
                    {(folder.podcastSources?.length || 0) > 0 && (
                      <span className="text-purple-300 font-mono">
                        +{folder.podcastSources?.length} Pod
                      </span>
                    )}
                    {(folder.webArticleSources?.length || 0) > 0 && (
                      <span className="text-emerald-300 font-mono">
                        +{folder.webArticleSources?.length} Web
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Folder Ingested Sources */}
        {activeFolder && (
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Ingested Sources in Folder
              </span>
            </div>

            {/* YouTube Videos List */}
            <div className="space-y-1.5">
              {activeFolder.youtubeSources.map((yt) => (
                <button
                  key={yt.id}
                  type="button"
                  onClick={() => onSelectYouTube && onSelectYouTube(yt.id)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-rose-500/50 hover:bg-slate-900 transition flex items-start gap-2.5 group"
                >
                  <div className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400 mt-0.5 group-hover:bg-rose-500/25">
                    <Video className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-200 truncate group-hover:text-rose-300">
                      {yt.title}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {yt.chapters.length} Chapters • {yt.duration}
                    </p>
                  </div>
                </button>
              ))}

              {/* PDFs List */}
              {activeFolder.pdfSources.map((pdf) => {
                const isSelected = activePdfId === pdf.id;
                return (
                  <button
                    key={pdf.id}
                    type="button"
                    onClick={() => onSelectPdf && onSelectPdf(pdf.id)}
                    className={`w-full text-left p-2.5 rounded-xl border transition flex items-start gap-2.5 group ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/60 shadow-sm'
                        : 'bg-slate-950/80 border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-900'
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg mt-0.5 ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-cyan-500/15 text-cyan-400 group-hover:bg-cyan-500/25'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-medium truncate ${
                          isSelected ? 'text-cyan-300 font-bold' : 'text-slate-200 group-hover:text-cyan-300'
                        }`}
                      >
                        {pdf.filename}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                        <span>{pdf.pageCount} pages</span>
                        <span className="text-cyan-400 font-semibold group-hover:underline">
                          View in Split Model →
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Ingest Actions: Upload PDF or Paste YouTube URL */}
            <div className="pt-2 space-y-2">
              <label className="w-full py-2 px-3 rounded-xl bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Academic PDF</span>
                <input
                  type="file"
                  accept=".pdf,.txt,.md"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => setShowAddYoutube(!showAddYoutube)}
                className="w-full py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <Link2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Paste YouTube Lecture Link</span>
              </button>

              {showAddYoutube && (
                <form
                  onSubmit={handleYoutubeSubmit}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 mt-2"
                >
                  <input
                    type="text"
                    value={ytTitle}
                    onChange={(e) => setYtTitle(e.target.value)}
                    placeholder="Lecture Title (optional)"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    value={ytUrl}
                    onChange={(e) => setYtUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowAddYoutube(false)}
                      className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Ingest Video</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Ecosystem Access & Cross-Source Status Card (PRD 4.5) */}
      <div className="space-y-3">
        <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300">
            <span>ECOSYSTEM TOUCHPOINTS</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-[10px]">
              Connected
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            <strong>Chrome Extension:</strong> 1-click web highlighting & clip capture synced to active study folders.
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            <strong>Mobile Companion Ready:</strong> Responsive layout + keyboard shortcuts (<code className="text-indigo-300">Alt+1..4</code> tabs).
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/25 space-y-2">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
            <Layers className="w-4 h-4" />
            <span>Grounded Multi-Source Sync</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            PDFs, YouTube lectures, podcasts, and web articles are indexed with zero-hallucination citations.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>All 5 Complexity Tiers Ready</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
