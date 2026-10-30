import React, { useState } from 'react';
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
} from 'lucide-react';
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
  onPinPageAnchor?: (pdfName: string, page: number, quote: string) => void;
}

type LayoutMode = 'split' | 'reader' | 'summary';

export const PDFSummarizer: React.FC<PDFSummarizerProps> = ({
  pdfSources,
  multiPdfComparison,
  complexity,
  onPinPageAnchor,
}) => {
  const [activePdfId, setActivePdfId] = useState<string>(pdfSources[0]?.id || '');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>(
    pdfSources.map((p) => p.id)
  );
  const [showCompareMatrix, setShowCompareMatrix] = useState<boolean>(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('split');
  const [pdfZoom, setPdfZoom] = useState<number>(100);
  const [selectedPage, setSelectedPage] = useState<number>(4);
  const [glossarySearch, setGlossarySearch] = useState<string>('');
  const [summaryTab, setSummaryTab] = useState<'all' | 'tldr' | 'argument' | 'glossary'>('all');

  const activePdf =
    pdfSources.find((p) => p.id === activePdfId) || pdfSources[0];

  const complexityMeta = COMPLEXITY_META[complexity];

  const togglePdfCompareSelection = (id: string) => {
    setSelectedForCompare((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  if (!activePdf) {
    return (
      <div className="p-8 text-center text-slate-400">
        No PDF documents uploaded in this folder yet.
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
    <div className="space-y-5">
      {/* Top Header Bar: Document Switcher & View Mode Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 shadow-lg">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold">
              Split Model • Standard Academic PDF Reader
            </span>
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${complexityMeta.badgeColor}`}
            >
              Tier {complexity}: {complexityMeta.shortLabel}
            </span>
          </div>

          {/* Document Tabs */}
          <div className="flex flex-wrap gap-2 pt-1">
            {pdfSources.map((pdf) => {
              const isCurrent = pdf.id === activePdf.id && !showCompareMatrix;
              return (
                <button
                  key={pdf.id}
                  type="button"
                  onClick={() => {
                    setActivePdfId(pdf.id);
                    setShowCompareMatrix(false);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 border transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/20 font-semibold'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[200px]">{pdf.filename}</span>
                  <span className="text-[10px] font-mono opacity-75">
                    ({pdf.pageCount}p)
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Action Controls: Split Model Switcher + Matrix Toggle */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {!showCompareMatrix && (
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1">
              <button
                type="button"
                onClick={() => setLayoutMode('split')}
                title="Split Model (Side-by-Side: PDF + AI Summaries)"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  layoutMode === 'split'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Split Model</span>
              </button>

              <button
                type="button"
                onClick={() => setLayoutMode('reader')}
                title="Full-Screen Standard PDF Reader"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  layoutMode === 'reader'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Standard Reader</span>
              </button>

              <button
                type="button"
                onClick={() => setLayoutMode('summary')}
                title="Summary & Argument Map Focus"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  layoutMode === 'summary'
                    ? 'bg-indigo-600 text-white shadow-sm'
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
                  ? 'Back to Standard Split View'
                  : `Compare ${pdfSources.length} PDFs (Matrix)`}
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
        /* VIEW MODE B: STANDARD SPLIT SCREEN MODEL (Side-by-Side PDF Reader + 3-Tier Summaries) */
        <div
          className={`grid gap-6 transition-all ${
            layoutMode === 'split'
              ? 'grid-cols-1 lg:grid-cols-12'
              : 'grid-cols-1'
          }`}
        >
          {/* LEFT PANE: STANDARD-SIZE ACADEMIC PDF DOCUMENT VIEWER (Full Standard Height & A4 Proportions) */}
          {(layoutMode === 'split' || layoutMode === 'reader') && (
            <div
              className={`rounded-2xl bg-slate-900/95 border border-indigo-500/30 shadow-2xl flex flex-col overflow-hidden ${
                layoutMode === 'split' ? 'lg:col-span-7 h-[780px]' : 'w-full h-[850px]'
              }`}
            >
              {/* Document Reader Toolbar */}
              <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-400 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white font-mono truncate max-w-[260px] sm:max-w-[340px]">
                      {activePdf.filename}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Page {selectedPage} of {activePdf.pageCount} • Standard Academic Layout
                    </p>
                  </div>
                </div>

                {/* Reader Controls: Page Stepper, Direct Jump & Standard Zoom */}
                <div className="flex items-center gap-2">
                  {/* Prev / Next Page Buttons */}
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
                      <ZoomOut className="w-3 h-3" />
                    </button>
                    <span className="text-[11px] text-slate-300 px-1.5">{pdfZoom}%</span>
                    <button
                      type="button"
                      onClick={() => setPdfZoom((z) => Math.min(160, z + 15))}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Quick Page Jump Pills */}
                  <div className="hidden sm:flex items-center gap-1">
                    {availablePages.slice(0, 4).map((pg) => (
                      <button
                        key={pg}
                        type="button"
                        onClick={() => setSelectedPage(pg)}
                        className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                          selectedPage === pg
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {pg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Document Canvas Body: Real A4 Standard Proportions with Paper Styling */}
              <div className="flex-1 overflow-y-auto bg-slate-950/90 p-4 sm:p-6 flex justify-center scroll-smooth">
                <div
                  style={{ transform: `scale(${pdfZoom / 100})`, transformOrigin: 'top center' }}
                  className="w-full max-w-[650px] min-h-[920px] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 space-y-6 text-slate-200 transition-transform duration-150"
                >
                  {/* Academic Document Header / Running Title */}
                  <div className="border-b border-slate-800 pb-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{activePdf.authors} ({activePdf.publicationYear})</span>
                    <span className="text-indigo-400 font-semibold uppercase">
                      Page {selectedPage} of {activePdf.pageCount}
                    </span>
                  </div>

                  {/* Document Title Banner */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                      Peer-Reviewed Academic Publication
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                      {activePdf.filename.replace('.pdf', '').replace(/_/g, ' ')}
                    </h2>
                    <p className="text-xs text-slate-400 italic">
                      {activePdf.authors} • Published in Journal of Bioenergetics & Systems Modeling
                    </p>
                  </div>

                  {/* Simulated A4 Manuscript Sections for Selected Page */}
                  <div className="space-y-5 text-xs sm:text-sm leading-relaxed text-slate-300">
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono uppercase text-indigo-300 font-bold flex items-center gap-1.5">
                          <Highlighter className="w-3.5 h-3.5" />
                          <span>Manuscript Excerpt — Page {selectedPage}</span>
                        </span>
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
                            className="px-2 py-0.5 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1"
                          >
                            <BookmarkPlus className="w-3 h-3" />
                            <span>Anchor Page {selectedPage} Note</span>
                          </button>
                        )}
                      </div>
                      <p className="text-slate-300 leading-relaxed font-serif text-[13px]">
                        {activePdf.summary.tldr[complexity]}
                      </p>
                    </div>

                    {/* Section Headings & Formulas on this Page */}
                    <div className="space-y-4">
                      {activePdf.summary.argumentMap.map((arg, idx) => (
                        <div
                          key={arg.id}
                          className={`p-4 rounded-xl border transition-all ${
                            selectedPage === arg.pageRef
                              ? 'bg-indigo-950/30 border-indigo-500/60 shadow-md ring-1 ring-indigo-500/40'
                              : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                              <span className="text-indigo-400">§ {idx + 1}.0</span>
                              <span>{arg.heading}</span>
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                              Page {arg.pageRef}
                            </span>
                          </div>

                          {arg.formulaOrHighlight && (
                            <div className="my-2.5 p-3 rounded-lg bg-slate-950 border border-amber-500/30 font-mono text-amber-300 text-xs shadow-inner flex items-center justify-between">
                              <span>{arg.formulaOrHighlight}</span>
                              <span className="text-[10px] text-slate-500">Eq. ({idx + 1})</span>
                            </div>
                          )}

                          <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed">
                            {arg.contentByComplexity[complexity]}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Page Footer */}
                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>StudyRetrieval Grounded Document Engine</span>
                      <span>Page {selectedPage} of {activePdf.pageCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RIGHT PANE: 3-TIER HIERARCHICAL SUMMARIES & ARGUMENT MATRIX */}
          {(layoutMode === 'split' || layoutMode === 'summary') && (
            <div
              className={`space-y-5 overflow-y-auto ${
                layoutMode === 'split' ? 'lg:col-span-5 h-[780px] pr-1' : 'w-full'
              }`}
            >
              {/* Internal Tab Filter for Right Pane */}
              <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
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

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5">
                    {activePdf.summary.tldr[complexity]}
                  </p>
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
