import React, { useState, useEffect } from 'react';
import {
  FileText,
  BookOpen,
  GitBranch,
  Search,
  CheckSquare,
  Square,
  Sparkles,
  Scale,
  ArrowUpRight,
  ZoomIn,
  ZoomOut,
  BookmarkPlus,
  Columns,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Highlighter,
  SlidersHorizontal,
  Upload,
  Sun,
  Moon,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { AIVoiceSpeaker } from '../common/AIVoiceSpeaker';
import {
  ComplexityLevel,
  COMPLEXITY_META,
  MultiPDFComparisonRow,
  PDFSource,
} from '../../types/study';

interface PDFSummarizerProps {
  pdfSources: PDFSource[];
  multiPdfComparison: MultiPDFComparisonRow[];
  complexity: ComplexityLevel;
  selectedPdfId?: string;
  onSelectPdf?: (id: string) => void;
  onPinPageAnchor?: (pdfName: string, page: number, quote: string) => void;
  onUploadPdfFile?: (file: File) => void;
}

type LayoutMode = 'split' | 'reader' | 'summary';
type PaperTheme = 'light' | 'dark' | 'sepia';

export const PDFSummarizer: React.FC<PDFSummarizerProps> = ({
  pdfSources,
  multiPdfComparison,
  complexity,
  selectedPdfId,
  onSelectPdf,
  onPinPageAnchor,
  onUploadPdfFile,
}) => {
  const [activePdfId, setActivePdfId] = useState<string>(
    selectedPdfId || pdfSources[0]?.id || ''
  );
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>(
    pdfSources.map((p) => p.id)
  );
  const [showCompareMatrix, setShowCompareMatrix] = useState<boolean>(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('split');
  const [pdfZoom, setPdfZoom] = useState<number>(100);
  const [selectedPage, setSelectedPage] = useState<number>(4);
  const [glossarySearch, setGlossarySearch] = useState<string>('');
  const [summaryTab, setSummaryTab] = useState<'all' | 'tldr' | 'argument' | 'glossary'>('all');
  const [paperTheme, setPaperTheme] = useState<PaperTheme>('light');
  const [viewModeType, setViewModeType] = useState<'sheet' | 'embed'>('sheet');

  useEffect(() => {
    if (selectedPdfId && selectedPdfId !== activePdfId) {
      setActivePdfId(selectedPdfId);
    }
  }, [selectedPdfId]);

  useEffect(() => {
    if (pdfSources.length > 0 && !pdfSources.some((p) => p.id === activePdfId)) {
      setActivePdfId(pdfSources[0].id);
    }
  }, [pdfSources, activePdfId]);

  const activePdf =
    pdfSources.find((p) => p.id === activePdfId) || pdfSources[0];

  const complexityMeta = COMPLEXITY_META[complexity];

  const togglePdfCompareSelection = (id: string) => {
    setSelectedForCompare((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectActivePdf = (id: string) => {
    setActivePdfId(id);
    setShowCompareMatrix(false);
    if (onSelectPdf) onSelectPdf(id);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadPdfFile) {
      onUploadPdfFile(file);
      e.target.value = '';
    }
  };

  if (!activePdf) {
    return (
      <div className="p-12 text-center text-slate-400 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <FileText className="w-10 h-10 text-cyan-400 mx-auto opacity-70" />
        <h3 className="text-base font-bold text-white">No PDF Documents Loaded</h3>
        <p className="text-xs text-slate-400">Upload an academic PDF file to begin reading and summarizing.</p>
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs cursor-pointer hover:bg-indigo-500 transition">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Academic PDF</span>
          <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>
    );
  }

  const filteredGlossary = activePdf.summary.glossary.filter(
    (g) =>
      g.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      g.definitionByComplexity[complexity]
        .toLowerCase()
        .includes(glossarySearch.toLowerCase())
  );

  const availablePages = Array.from(
    new Set([1, 2, 4, 8, 11, activePdf.pageCount])
  ).sort((a, b) => a - b);

  return (
    <div className="space-y-4">
      {/* Top Document Bar: Active Document Selector & View Mode Switcher */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 shadow-xl">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Standard Academic PDF Viewer & Split Workbench</span>
            </span>
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${complexityMeta.badgeColor}`}
            >
              Tier {complexity}: {complexityMeta.shortLabel}
            </span>
          </div>

          {/* Document Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {pdfSources.map((pdf) => {
              const isCurrent = pdf.id === activePdf.id && !showCompareMatrix;
              return (
                <button
                  key={pdf.id}
                  type="button"
                  onClick={() => handleSelectActivePdf(pdf.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 border transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/25 font-semibold'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[210px]">{pdf.filename}</span>
                  <span className="text-[10px] font-mono opacity-80">
                    ({pdf.pageCount}p)
                  </span>
                </button>
              );
            })}

            {onUploadPdfFile && (
              <label className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 cursor-pointer transition">
                <Upload className="w-3.5 h-3.5" />
                <span>+ Upload PDF</span>
                <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* View Mode Switcher: Split Model vs Standard Full Reader vs Summaries */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {!showCompareMatrix && (
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1">
              <button
                type="button"
                onClick={() => setLayoutMode('split')}
                title="Split Model (Side-by-Side: PDF Document + AI Summaries)"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  layoutMode === 'split'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Split Model (Side-by-Side)</span>
              </button>

              <button
                type="button"
                onClick={() => setLayoutMode('reader')}
                title="Full-Screen Standard PDF Document Reader"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  layoutMode === 'reader'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Full Reader</span>
              </button>

              <button
                type="button"
                onClick={() => setLayoutMode('summary')}
                title="Summaries & Argument Map Only"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  layoutMode === 'summary'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Summaries Only</span>
              </button>
            </div>
          )}

          {pdfSources.length > 1 && (
            <button
              type="button"
              onClick={() => setShowCompareMatrix(!showCompareMatrix)}
              className={`px-3.5 py-2 rounded-xl font-semibold text-xs flex items-center gap-2 border transition-all ${
                showCompareMatrix
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20'
                  : 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border-cyan-500/30'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>
                {showCompareMatrix
                  ? 'Back to Split Model'
                  : `Compare ${pdfSources.length} PDFs`}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW MODE A: MULTI-PDF CROSS-REFERENCE MATRIX */}
      {showCompareMatrix && pdfSources.length > 1 ? (
        <div className="rounded-2xl bg-slate-900/90 border border-cyan-500/40 p-5 sm:p-6 space-y-5 complexity-transition">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-cyan-400" />
                <span>Multi-PDF Cross-Referencing & Contradiction Matrix</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Unified synthesis comparing arguments, agreements, and bioenergetic contradictions across selected papers
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {pdfSources.map((pdf) => {
                const checked = selectedForCompare.includes(pdf.id);
                return (
                  <button
                    key={pdf.id}
                    type="button"
                    onClick={() => togglePdfCompareSelection(pdf.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 border transition ${
                      checked
                        ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    {checked ? (
                      <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
                    ) : (
                      <Square className="w-3.5 h-3.5" />
                    )}
                    <span className="truncate max-w-[180px]">{pdf.filename}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                  <th className="py-3 px-4 w-48">Comparative Dimension</th>
                  {pdfSources
                    .filter((p) => selectedForCompare.includes(p.id))
                    .map((pdf) => (
                      <th key={pdf.id} className="py-3 px-4 min-w-[240px]">
                        <div className="text-cyan-300 font-semibold truncate max-w-[240px]">
                          {pdf.filename}
                        </div>
                        <div className="text-[10px] text-slate-500">{pdf.authors}</div>
                      </th>
                    ))}
                  <th className="py-3 px-4 min-w-[260px]">
                    Unified Synthesis & Agreement Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs sm:text-sm">
                {multiPdfComparison.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-950/40">
                    <td className="py-4 px-4 font-semibold text-white align-top">
                      {row.dimension}
                    </td>
                    {pdfSources
                      .filter((p) => selectedForCompare.includes(p.id))
                      .map((pdf) => (
                        <td
                          key={pdf.id}
                          className="py-4 px-4 text-slate-300 leading-relaxed align-top"
                        >
                          {row.perPdfAnalysis[pdf.id]?.[complexity] ||
                            pdf.summary.tldr[complexity]}
                        </td>
                      ))}
                    <td className="py-4 px-4 align-top space-y-2">
                      <span
                        className={`inline-block text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                          row.agreementStatus === 'Contradiction'
                            ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                            : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {row.agreementStatus}
                      </span>
                      <p className="text-slate-200 text-xs leading-relaxed">
                        {row.synthesisNote[complexity]}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* VIEW MODE B: STANDARD SPLIT SCREEN MODEL (Side-by-Side Standard PDF Reader + 3-Tier Summaries) */
        <div
          className={`grid gap-6 transition-all ${
            layoutMode === 'split'
              ? 'grid-cols-1 lg:grid-cols-12 items-start'
              : 'grid-cols-1'
          }`}
        >
          {/* LEFT PANE: STANDARD-SIZE ACADEMIC PDF DOCUMENT VIEWER */}
          {(layoutMode === 'split' || layoutMode === 'reader') && (
            <div
              className={`rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden ${
                layoutMode === 'split' ? 'lg:col-span-7 h-[850px]' : 'w-full h-[900px]'
              }`}
            >
              {/* Document Reader Toolbar */}
              <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white font-mono truncate max-w-[200px] sm:max-w-[320px]">
                        {activePdf.filename}
                      </h4>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-cyan-300 shrink-0">
                        Page {selectedPage} / {activePdf.pageCount}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">
                      {activePdf.authors} ({activePdf.publicationYear})
                    </p>
                  </div>
                </div>

                {/* Reader Controls: Page Stepper, Theme & View Mode */}
                <div className="flex items-center gap-2">
                  {/* Page Stepper */}
                  <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                    <button
                      type="button"
                      disabled={selectedPage <= 1}
                      onClick={() => setSelectedPage((p) => Math.max(1, p - 1))}
                      className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-40"
                      title="Previous Page"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-mono px-2 text-indigo-300 font-semibold">
                      p.{selectedPage}
                    </span>
                    <button
                      type="button"
                      disabled={selectedPage >= activePdf.pageCount}
                      onClick={() => setSelectedPage((p) => Math.min(activePdf.pageCount, p + 1))}
                      className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-40"
                      title="Next Page"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2 py-0.5 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setPdfZoom((z) => Math.max(75, z - 15))}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] text-slate-300 px-1.5">{pdfZoom}%</span>
                    <button
                      type="button"
                      onClick={() => setPdfZoom((z) => Math.min(160, z + 15))}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Paper Theme (Light/Dark Paper Mode) */}
                  <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => setPaperTheme('light')}
                      className={`p-1 rounded text-xs transition ${
                        paperTheme === 'light' ? 'bg-amber-100 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Crisp White Paper A4 Mode"
                    >
                      <Sun className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaperTheme('dark')}
                      className={`p-1 rounded text-xs transition ${
                        paperTheme === 'dark' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Dark Document Mode"
                    >
                      <Moon className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* If activePdf has real fileUrl, allow toggle to direct embed */}
                  {activePdf.fileUrl && (
                    <button
                      type="button"
                      onClick={() => setViewModeType(viewModeType === 'sheet' ? 'embed' : 'sheet')}
                      className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>{viewModeType === 'sheet' ? 'Direct PDF' : 'Paper View'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Jump Page Strip */}
              <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Document Outline & Pages:</span>
                </span>
                <div className="flex items-center gap-1.5">
                  {availablePages.map((pg) => (
                    <button
                      key={pg}
                      type="button"
                      onClick={() => setSelectedPage(pg)}
                      className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition ${
                        selectedPage === pg
                          ? 'bg-indigo-600 text-white font-bold shadow-sm'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      Page {pg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Document Canvas Body: Authentic High-Contrast Paper Sheet or Direct PDF Embed */}
              <div className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 flex justify-center scroll-smooth">
                {viewModeType === 'embed' && activePdf.fileUrl ? (
                  <iframe
                    src={`${activePdf.fileUrl}#page=${selectedPage}`}
                    title={activePdf.filename}
                    className="w-full h-full rounded-xl border border-slate-800 bg-white"
                  />
                ) : (
                  <div
                    style={{ transform: `scale(${pdfZoom / 100})`, transformOrigin: 'top center' }}
                    className={`w-full max-w-[680px] min-h-[960px] rounded-xl shadow-2xl p-8 sm:p-10 space-y-6 transition-all duration-150 border ${
                      paperTheme === 'light'
                        ? 'bg-white text-slate-950 border-slate-300 shadow-white/5 ring-1 ring-black/5'
                        : 'bg-slate-900 text-slate-100 border-slate-800 shadow-black/60'
                    }`}
                  >
                    {/* Running Header */}
                    <div
                      className={`border-b pb-3 flex items-center justify-between text-[11px] font-mono ${
                        paperTheme === 'light' ? 'border-slate-300 text-slate-500' : 'border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="font-semibold">{activePdf.authors}</span>
                      <span className="uppercase tracking-wider font-bold text-indigo-600">
                        Academic Research Journal • Page {selectedPage} of {activePdf.pageCount}
                      </span>
                    </div>

                    {/* Paper Title Banner */}
                    <div className="space-y-2 pt-1 border-b pb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 border border-indigo-200">
                          Peer-Reviewed Research Manuscript
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          DOI: 10.1038/s41586-026-bioenergetics
                        </span>
                      </div>
                      <h2
                        className={`text-xl sm:text-2xl font-serif font-bold tracking-tight leading-snug ${
                          paperTheme === 'light' ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        {activePdf.filename.replace('.pdf', '').replace(/_/g, ' ')}
                      </h2>
                      <p className={`text-xs font-serif italic ${paperTheme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                        {activePdf.authors} • Department of Systems Biology & Mathematical Physics
                      </p>
                    </div>

                    {/* Abstract Box */}
                    <div
                      className={`p-4 rounded-xl border-l-4 ${
                        paperTheme === 'light'
                          ? 'bg-slate-50 border-indigo-600 text-slate-800'
                          : 'bg-slate-950 border-indigo-500 text-slate-200'
                      } space-y-1.5`}
                    >
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block">
                        ABSTRACT & CORE THESIS (PAGE {selectedPage})
                      </span>
                      <p className="text-xs sm:text-[13px] font-serif leading-relaxed text-justify">
                        {activePdf.summary.tldr[complexity]}
                      </p>
                    </div>

                    {/* Manuscript Page Sections & Formulas */}
                    <div className="space-y-6 pt-2 font-serif">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600">
                          Section Content for Page {selectedPage}
                        </h3>
                        {onPinPageAnchor && (
                          <button
                            type="button"
                            onClick={() =>
                              onPinPageAnchor(
                                activePdf.filename,
                                selectedPage,
                                activePdf.summary.argumentMap.find((a) => a.pageRef === selectedPage)?.formulaOrHighlight ||
                                  `Section discussion on page ${selectedPage}`
                              )
                            }
                            className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-sans font-bold flex items-center gap-1 hover:bg-emerald-200 transition"
                          >
                            <BookmarkPlus className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Anchor Highlight (Page {selectedPage})</span>
                          </button>
                        )}
                      </div>

                      {/* Display Nodes related to this page */}
                      {activePdf.summary.argumentMap.map((node, idx) => (
                        <div
                          key={node.id}
                          className={`p-4 rounded-xl border transition-all ${
                            selectedPage === node.pageRef
                              ? paperTheme === 'light'
                                ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-500/20 shadow-md'
                                : 'bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500/40'
                              : paperTheme === 'light'
                              ? 'bg-slate-50/60 border-slate-200'
                              : 'bg-slate-950/40 border-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2 font-sans">
                            <span className="text-xs font-bold text-indigo-600 flex items-center gap-1.5">
                              <span>§ {idx + 1}.0</span>
                              <span>{node.heading}</span>
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">
                              Page {node.pageRef}
                            </span>
                          </div>

                          {node.formulaOrHighlight && (
                            <div
                              className={`my-3 p-3 rounded-lg border font-mono text-xs flex items-center justify-between shadow-inner ${
                                paperTheme === 'light'
                                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                                  : 'bg-slate-950 border-amber-500/40 text-amber-300'
                              }`}
                            >
                              <span className="font-bold">{node.formulaOrHighlight}</span>
                              <span className="text-[10px] opacity-75">Eq. ({idx + 1})</span>
                            </div>
                          )}

                          <p
                            className={`text-xs sm:text-[13px] leading-relaxed text-justify ${
                              paperTheme === 'light' ? 'text-slate-800' : 'text-slate-300'
                            }`}
                          >
                            {node.contentByComplexity[complexity]}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Page Footer Watermark */}
                    <div
                      className={`pt-6 border-t flex items-center justify-between text-[11px] font-mono ${
                        paperTheme === 'light' ? 'border-slate-300 text-slate-400' : 'border-slate-800 text-slate-500'
                      }`}
                    >
                      <span>StudyRetrieval Grounded Academic Engine</span>
                      <span className="font-bold">Page {selectedPage} of {activePdf.pageCount}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RIGHT PANE: 3-TIER HIERARCHICAL SUMMARIES & ARGUMENT MATRIX */}
          {(layoutMode === 'split' || layoutMode === 'summary') && (
            <div
              className={`space-y-4 overflow-y-auto ${
                layoutMode === 'split' ? 'lg:col-span-5 h-[850px] pr-1' : 'w-full'
              }`}
            >
              {/* Internal Tab Filter for Right Pane */}
              <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2 rounded-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 px-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>3-Tier AI Breakdown</span>
                </span>
                <div className="flex items-center gap-1">
                  {(['all', 'tldr', 'argument', 'glossary'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setSummaryTab(tab)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase transition ${
                        summaryTab === tab
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab === 'all' ? 'All Tiers' : tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* TIER 1: TL;DR / Executive Summary (3 Sentences) */}
              {(summaryTab === 'all' || summaryTab === 'tldr') && (
                <section className="rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/40 p-4 sm:p-5 shadow-lg complexity-transition">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold">
                        TIER 1
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span>TL;DR (3-Sentence Core Thesis)</span>
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {activePdf.authors}
                    </span>
                  </div>

                  <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5">
                    <AIVoiceSpeaker
                      text={activePdf.summary.tldr[complexity]}
                      autoPlay={false}
                    />
                  </div>
                </section>
              )}

              {/* TIER 2: Core Argument Map with Page Links */}
              {(summaryTab === 'all' || summaryTab === 'argument') && (
                <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 sm:p-5 space-y-3 complexity-transition">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                        TIER 2
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                        <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Core Argument Map</span>
                      </h3>
                    </div>
                    <span className="text-[10px] text-slate-400">Click Page to Seek Reader</span>
                  </div>

                  <div className="space-y-3">
                    {activePdf.summary.argumentMap.map((node, index) => (
                      <div
                        key={node.id}
                        className="rounded-xl bg-slate-950 border border-slate-800/90 p-3.5 space-y-2 hover:border-slate-700 transition"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded bg-indigo-500/15 text-indigo-300 font-mono text-[11px] font-bold flex items-center justify-center">
                              {index + 1}
                            </span>
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                              {node.category}
                            </span>
                            <h4 className="text-xs font-bold text-white">{node.heading}</h4>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPage(node.pageRef);
                              if (layoutMode === 'summary') setLayoutMode('split');
                            }}
                            className="px-2 py-0.5 rounded bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 font-mono text-[11px] font-semibold flex items-center gap-1"
                          >
                            <span>Page {node.pageRef}</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>

                        {node.formulaOrHighlight && (
                          <div className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 font-mono text-xs text-amber-300">
                            {node.formulaOrHighlight}
                          </div>
                        )}

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {node.contentByComplexity[complexity]}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* TIER 3: Context-Aware Glossary & Terminology */}
              {(summaryTab === 'all' || summaryTab === 'glossary') && (
                <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 sm:p-5 space-y-3 complexity-transition">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                        TIER 3
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Glossary & Terminology</span>
                      </h3>
                    </div>
                  </div>

                  <div className="relative">
                    <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={glossarySearch}
                      onChange={(e) => setGlossarySearch(e.target.value)}
                      placeholder="Search terms..."
                      className="w-full pl-8 pr-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    {filteredGlossary.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1"
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-xs font-bold text-emerald-300">
                            {item.term}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                            p. {item.pageRef}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {item.definitionByComplexity[complexity]}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
