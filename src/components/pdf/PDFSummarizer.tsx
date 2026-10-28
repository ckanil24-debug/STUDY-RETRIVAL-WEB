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
  Layers,
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
}

export const PDFSummarizer: React.FC<PDFSummarizerProps> = ({
  pdfSources,
  multiPdfComparison,
  complexity,
}) => {
  const [activePdfId, setActivePdfId] = useState<string>(pdfSources[0]?.id || '');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>(
    pdfSources.map((p) => p.id)
  );
  const [showCompareMatrix, setShowCompareMatrix] = useState<boolean>(false);
  const [glossarySearch, setGlossarySearch] = useState<string>('');

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

  return (
    <div className="space-y-6">
      {/* Top PDF Selector & Multi-PDF Cross-Reference Trigger */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              3-Tier Hierarchical PDF Summarizer
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
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/20'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[230px]">{pdf.filename}</span>
                  <span className="text-[10px] font-mono opacity-75">
                    ({pdf.pageCount}p)
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Multi-PDF Cross-Referencing Toggle */}
        {pdfSources.length > 1 && (
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowCompareMatrix(!showCompareMatrix)}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 border transition-all ${
                showCompareMatrix
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20'
                  : 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border-cyan-500/30'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>
                {showCompareMatrix
                  ? 'Back to Single-PDF 3-Tier View'
                  : `Compare ${pdfSources.length} PDFs (Cross-Reference Matrix)`}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* View Mode A: Multi-PDF Cross-Referencing Matrix */}
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

            {/* Checkboxes to Select PDFs for Cross-Referencing */}
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

          {/* Comparison Table */}
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
        /* View Mode B: Single PDF 3-Tier Hierarchical Breakdown */
        <div
          key={`${activePdf.id}-${complexity}`}
          className="space-y-6 complexity-transition"
        >
          {/* TIER 1: TL;DR / Executive Summary (3 Sentences Capturing Core Thesis) */}
          <section className="rounded-2xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-900 border border-indigo-500/40 p-5 sm:p-6 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono text-xs font-bold">
                  TIER 1
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>TL;DR / Executive Summary (3-Sentence Core Thesis)</span>
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {activePdf.authors} ({activePdf.publicationYear})
              </span>
            </div>

            <p className="text-sm sm:text-base text-slate-100 leading-relaxed bg-slate-950/70 border border-slate-800/90 rounded-xl p-4">
              {activePdf.summary.tldr[complexity]}
            </p>
          </section>

          {/* TIER 2 & TIER 3 Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* TIER 2: Core Argument Map (7 Cols) */}
            <section className="lg:col-span-7 rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
                    TIER 2
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-cyan-400" />
                      <span>Core Argument Map</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Methodologies, key findings, and theorem proofs with page citations
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {activePdf.summary.argumentMap.map((node, index) => (
                  <div
                    key={node.id}
                    className="rounded-xl bg-slate-950/90 border border-slate-800/90 p-4 space-y-2.5 hover:border-slate-700 transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                          {node.category}
                        </span>
                        <h4 className="text-sm font-bold text-white">{node.heading}</h4>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-mono text-xs font-semibold flex items-center gap-1">
                        <span>Page {node.pageRef}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>

                    {node.formulaOrHighlight && (
                      <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-amber-300">
                        {node.formulaOrHighlight}
                      </div>
                    )}

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {node.contentByComplexity[complexity]}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* TIER 3: Glossary & Terminology (5 Cols) */}
            <section className="lg:col-span-5 rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
                    TIER 3
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      <span>Glossary & Terminology</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Context-aware definitions calibrated to Tier {complexity}
                    </p>
                  </div>
                </div>
              </div>

              {/* Filter Input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  placeholder="Filter extracted terminology..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-3">
                {filteredGlossary.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm font-bold text-emerald-300">
                        {item.term}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                        p. {item.pageRef}
                      </span>
                    </div>

                    {item.symbolOrTag && (
                      <div className="text-[11px] font-mono text-indigo-300">
                        Notation: {item.symbolOrTag}
                      </div>
                    )}

                    <p className="text-xs text-slate-300 leading-relaxed pt-1">
                      {item.definitionByComplexity[complexity]}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};
