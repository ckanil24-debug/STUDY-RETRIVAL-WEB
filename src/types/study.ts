export type ComplexityLevel = 1 | 2 | 3 | 4 | 5;

export interface ComplexityMeta {
  level: ComplexityLevel;
  shortLabel: string;
  label: string;
  badgeColor: string;
  description: string;
}

export const COMPLEXITY_META: Record<ComplexityLevel, ComplexityMeta> = {
  1: {
    level: 1,
    shortLabel: 'ELI5',
    label: "ELI5 (Explain Like I'm 5)",
    badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    description: 'Everyday analogies, zero equations or jargon.',
  },
  2: {
    level: 2,
    shortLabel: 'High School',
    label: 'High School Crash Course',
    badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    description: 'Clear foundational concepts geared toward AP/IB exam prep.',
  },
  3: {
    level: 3,
    shortLabel: 'Undergrad',
    label: 'Undergraduate Lecture',
    badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    description: 'Balanced theoretical framework, standard equations & mechanisms.',
  },
  4: {
    level: 4,
    shortLabel: 'Grad Seminar',
    label: 'Graduate Seminar',
    badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    description: 'Rigorous derivations, experimental methodology & edge cases.',
  },
  5: {
    level: 5,
    shortLabel: 'Peer Review',
    label: 'Academic Peer Review',
    badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    description: 'Formal scholarly critique, biophysical/mathematical formalism & limitations.',
  },
};

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
  institution: string;
  provider: 'credentials' | 'google';
  token: string;
  signedInAt: string;
}

export interface VideoChapter {
  id: string;
  timestampSeconds: number;
  formattedTime: string; // e.g. "04:12"
  title: string;
  slideSnapshotTitle: string;
  slideDiagramType: 'chloroplast' | 'z-scheme' | 'calvin-cycle' | 'attention-matrix' | 'transformer-arch' | 'custom';
  slideVisualKeypoints: string[];
  summaryByComplexity: Record<ComplexityLevel, string>;
}

export interface YouTubeSource {
  id: string;
  title: string;
  channelName: string;
  videoId: string;
  url: string;
  duration: string;
  chapters: VideoChapter[];
  crashCourseSummary: Record<ComplexityLevel, string[]>;
}

export interface ArgumentNode {
  id: string;
  heading: string;
  category: 'Methodology' | 'Key Finding' | 'Theorem / Proof' | 'Empirical Result';
  pageRef: number;
  formulaOrHighlight?: string;
  contentByComplexity: Record<ComplexityLevel, string>;
}

export interface GlossaryItem {
  term: string;
  pageRef: number;
  symbolOrTag?: string;
  definitionByComplexity: Record<ComplexityLevel, string>;
}

export interface PDFTieredSummary {
  tldr: Record<ComplexityLevel, string>; // 3 sentences capturing the core thesis
  argumentMap: ArgumentNode[];
  glossary: GlossaryItem[];
}

export interface PDFSource {
  id: string;
  filename: string;
  authors: string;
  publicationYear: number;
  pageCount: number;
  uploadedAt: string;
  summary: PDFTieredSummary;
}

export interface MultiPDFComparisonRow {
  id: string;
  dimension: string;
  perPdfAnalysis: Record<string, Record<ComplexityLevel, string>>; // pdfId -> ComplexityLevel -> text
  agreementStatus: 'Agreement' | 'Complementary' | 'Contradiction';
  synthesisNote: Record<ComplexityLevel, string>;
}

export interface LectureSyncItem {
  id: string;
  topic: string;
  pdfSourceId: string;
  pdfSlideOrPage: number;
  pdfSlideExcerpt: string;
  missingFromSlide: string;
  videoChapterId: string;
  videoTimestamp: string;
  videoSeconds: number;
  verbalSupplementByComplexity: Record<ComplexityLevel, string>;
  syncBadge: 'Verbal Intuition Added' | 'Formula Derived Live' | 'Exam Caveat Emphasized';
}

export interface CrossSourceQAPair {
  id: string;
  question: string;
  pdfCitation: {
    pdfName: string;
    page: number;
    quote: string;
  };
  videoCitation: {
    videoTitle: string;
    timestamp: string;
    seconds: number;
    quote: string;
  };
  answerByComplexity: Record<ComplexityLevel, string>;
}

export interface StudyFolder {
  id: string;
  name: string;
  courseCode: string;
  description: string;
  updatedAt: string;
  youtubeSources: YouTubeSource[];
  pdfSources: PDFSource[];
  multiPdfComparison: MultiPDFComparisonRow[];
  lectureCompanionSync: LectureSyncItem[];
  presetQA: CrossSourceQAPair[];
}
