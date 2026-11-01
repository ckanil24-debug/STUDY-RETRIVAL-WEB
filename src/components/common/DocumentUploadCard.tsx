import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Camera,
  Sparkles,
  Folder,
  Youtube,
  Layers,
  CheckCircle2,
  Mic,
  Send,
  GraduationCap,
} from 'lucide-react';
import { VoiceInputButton } from './VoiceInputButton';

interface DocumentUploadCardProps {
  activeTab: 'pdf' | 'youtube' | 'companion' | 'notebook' | 'checklist' | 'teacher';
  onSelectTab: (tab: 'pdf' | 'youtube' | 'companion' | 'notebook' | 'checklist' | 'teacher') => void;
  onUploadFile: (file: File) => void;
  onTrySamplePdf: () => void;
  onOpenLibrary: () => void;
  onAskVoiceQuestion?: (question: string) => void;
  libraryCount: number;
  activeLanguage: string;
}

export const DocumentUploadCard: React.FC<DocumentUploadCardProps> = ({
  activeTab,
  onSelectTab,
  onUploadFile,
  onTrySamplePdf,
  onOpenLibrary,
  onAskVoiceQuestion,
  libraryCount,
  activeLanguage,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [heroVoiceText, setHeroVoiceText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onUploadFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadFile(file);
      e.target.value = '';
    }
  };

  const isMalayalam = activeLanguage === 'ML';

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0 space-y-4 pt-2 pb-6">
      {/* Hero Headline matching user's image */}
      <div className="text-center space-y-1.5 px-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          {isMalayalam ? (
            <>
              ഏതൊരു ഡോക്യുമെന്റും വീഡിയോയും{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
                തൽക്ഷണം പഠിക്കാം
              </span>
            </>
          ) : (
            <>
              Instant Study & Reading{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
                Superpowers for Any Document & Video
              </span>
            </>
          )}
        </h1>
      </div>

      {/* Segmented Switcher [ 📄 Documents ] | [ ▶️ YouTube ] */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 rounded-2xl bg-[#0f172a]/90 border border-slate-800 shadow-lg">
          <button
            type="button"
            onClick={() => onSelectTab('pdf')}
            className={`px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all duration-200 ${
              activeTab === 'pdf'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-cyan-300" />
            <span>{isMalayalam ? 'ഡോക്യുമെന്റുകൾ' : 'Documents'}</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('youtube')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all duration-200 ${
              activeTab === 'youtube'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Youtube className="w-4 h-4 text-rose-400" />
            <span>YouTube</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('teacher')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all duration-200 ${
              activeTab === 'teacher'
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-indigo-300" />
            <span>{isMalayalam ? 'ടീച്ചർ മോഡ്' : 'Teacher Mode'}</span>
          </button>
        </div>
      </div>

      {/* Main Upload Box Card matching user's image */}
      {activeTab === 'pdf' ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`rounded-3xl p-5 sm:p-7 border transition-all duration-200 text-center space-y-4 ${
            isDragging
              ? 'bg-indigo-950/40 border-indigo-400 shadow-2xl scale-[1.01]'
              : 'bg-[#0f172a]/70 border-slate-800/90 shadow-2xl backdrop-blur-md hover:border-slate-700'
          }`}
        >
          {/* Big Upload Cloud Icon inside rounded purple-blue container */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-blue-500/20 border border-indigo-500/30 flex items-center justify-center hover:scale-105 transition-transform group shadow-inner"
            >
              <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400 group-hover:text-indigo-300 transition" />
            </button>
          </div>

          {/* Upload Documents Title & Subtitle */}
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {isMalayalam
                ? 'ഡോക്യുമെന്റുകൾ അപ്‌ലോഡ് ചെയ്യുക (PDF, MD, DOCX, PPTX, EPUB, TXT)'
                : 'Upload Documents (PDF, MD, DOCX, PPTX, EPUB, TXT)'}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              {isMalayalam
                ? 'ഫയൽ ഇവിടെ ഇടുക, അല്ലെങ്കിൽ തിരഞ്ഞെടുക്കാൻ ക്ലിക്ക് ചെയ്യുക'
                : 'Drag and drop your file here, or click to browse'}
            </p>
          </div>

          {/* Format Badges matching user's image */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
              📕 PDF
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
              📝 MD
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
              📄 DOCX
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              📊 PPTX
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              📖 EPUB
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              📑 TXT
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30">
              📷 Photo / Notes OCR
            </span>
          </div>

          {/* Action Buttons Stack matching screenshot */}
          <div className="space-y-2.5 pt-2 max-w-md mx-auto">
            {/* 1. Primary: Select Document Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-[0.99] transition"
            >
              <FileText className="w-4 h-4" />
              <span>{isMalayalam ? 'ഡോക്യുമെന്റ് തിരഞ്ഞെടുക്കുക' : 'Select Document'}</span>
            </button>

            {/* 2. Secondary: Scan Photo / Notes Button */}
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 active:scale-[0.99] transition"
            >
              <Camera className="w-4 h-4" />
              <span>{isMalayalam ? 'ഫോട്ടോ / നോട്ടുകൾ സ്കാൻ ചെയ്യുക' : 'Scan photo / notes'}</span>
            </button>

            {/* 3. Tertiary: Try with Sample PDF */}
            <button
              type="button"
              onClick={onTrySamplePdf}
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-amber-300 hover:text-amber-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isMalayalam ? 'സാമ്പിൾ PDF ഉപയോഗിച്ച് പരീക്ഷിക്കുക' : 'Try with Sample PDF'}</span>
            </button>

            {/* 4. Quaternary: Open My Library */}
            <button
              type="button"
              onClick={onOpenLibrary}
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition"
            >
              <Folder className="w-4 h-4 text-indigo-400" />
              <span>{isMalayalam ? 'എന്റെ ലൈബ്രറി തുറക്കുക' : 'Open My Library'}</span>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-indigo-300 font-mono text-[11px] font-bold">
                {libraryCount}
              </span>
            </button>
          </div>

          {/* Footer note */}
          <p className="text-[11px] text-slate-500 font-mono pt-1">
            Supported Formats: PDF (up to 25MB), MD, DOCX, PPTX, EPUB, TXT • Client-side extraction
          </p>

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.md,.docx,.pptx,.epub,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        /* YouTube Quick Entry Mode */
        <div className="rounded-3xl p-5 sm:p-7 bg-[#0f172a]/70 border border-slate-800/90 shadow-2xl backdrop-blur-md text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400 shadow-inner">
            <Youtube className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              {isMalayalam ? 'യൂട്യൂബ് പ്രഭാഷണം സമ്മറൈസ് ചെയ്യുക' : 'YouTube Lecture Summarizer'}
            </h2>
            <p className="text-xs text-slate-400">
              {isMalayalam
                ? 'ക്ലിക്കബിൾ ടൈംസ്റ്റാമ്പുകളും 3-മിനിറ്റ് ക്രാഷ് കോഴ്‌സും നേടുക'
                : 'Extract timestamped chapters, visual slide snapshots & 3-Min crash course'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectTab('youtube')}
            className="px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm transition inline-flex items-center gap-2"
          >
            <Youtube className="w-4 h-4" />
            <span>{isMalayalam ? 'യൂട്യൂബ് പ്ലെയർ കാണുക' : 'Open YouTube Player & Notes'}</span>
          </button>
        </div>
      )}

      {/* Voice-First Instant Question Query Bar */}
      <div className="bg-[#0f172a]/85 border border-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-xl space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (heroVoiceText.trim() && onAskVoiceQuestion) {
              onAskVoiceQuestion(heroVoiceText);
              setHeroVoiceText('');
            }
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={heroVoiceText}
              onChange={(e) => setHeroVoiceText(e.target.value)}
              placeholder={
                isMalayalam
                  ? '🎤 ശബ്ദത്തിലൂടെ ചോദിക്കുക: "പേജ് 4-ലെ സമവാക്യം എന്താണ്?"...'
                  : '🎤 Ask question by voice (English or മലയാളം)...'
              }
              className="w-full pl-3.5 pr-28 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <VoiceInputButton
                currentValue={heroVoiceText}
                defaultLanguage={isMalayalam ? 'ml-IN' : 'en-US'}
                onTranscript={(text) => setHeroVoiceText(text)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!heroVoiceText.trim()}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shrink-0 transition shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isMalayalam ? 'ചോദിക്കുക' : 'Ask AI'}</span>
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono px-1">
          <span className="flex items-center gap-1">
            <Mic className="w-3 h-3 text-rose-400" />
            <span>
              {isMalayalam
                ? 'മൈക്ക് അമർത്തി സംസാരിക്കുക (മലയാളം / English STT പിന്തുണയ്ക്കുന്നു)'
                : 'Click mic to speak in English or മലയാളം. Edit text before querying.'}
            </span>
          </span>
          {heroVoiceText && (
            <span className="text-indigo-400 font-semibold">{heroVoiceText.length} chars</span>
          )}
        </div>
      </div>

      {/* Quick Navigation Pills for Mobile/Web (Companion, Notebook, Checklist) */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
        <button
          type="button"
          onClick={() => onSelectTab('companion')}
          className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition ${
            activeTab === 'companion'
              ? 'bg-indigo-600 text-white border-indigo-400 font-semibold'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>{isMalayalam ? 'ക്രോസ്-സോഴ്സ് Q&A' : 'Cross-Source Q&A'}</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('notebook')}
          className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition ${
            activeTab === 'notebook'
              ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{isMalayalam ? 'സ്മാർട്ട് നോട്ട്ബുക്ക്' : 'Smart Notebook & Threads'}</span>
        </button>
      </div>
    </div>
  );
};
