import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Globe,
  Gauge,
  Sparkles,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

interface AIVoiceSpeakerProps {
  text: string;
  autoPlay?: boolean;
  defaultLanguage?: 'en-US' | 'ml-IN';
  className?: string;
  showSynchronizedText?: boolean;
}

// Clean markdown syntax for natural voice synthesis
function cleanMarkdownForSpeech(rawText: string): string {
  return rawText
    .replace(/[*_#`~[\]]/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Split long text into natural sentence chunks to prevent browser TTS cutoffs
function splitIntoManageableChunks(text: string): string[] {
  const cleaned = cleanMarkdownForSpeech(text);
  if (!cleaned) return [];

  // Match sentences ending in punctuation or line breaks
  const matched = cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  if (!matched) return [cleaned];

  return matched
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export const AIVoiceSpeaker: React.FC<AIVoiceSpeakerProps> = ({
  text,
  autoPlay = false,
  defaultLanguage = 'en-US',
  className = '',
  showSynchronizedText = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState<number>(1.0);
  const [activeLang, setActiveLang] = useState<'en-US' | 'ml-IN'>(defaultLanguage);
  const [currentChunkIndex, setCurrentChunkIndex] = useState<number>(-1);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState<boolean>(autoPlay);

  const chunks = useRef<string[]>([]);
  const isCancelledRef = useRef<boolean>(false);

  // Detect Malayalam characters in the text
  const containsMalayalam = /[\u0D00-\u0D7F]/.test(text);

  useEffect(() => {
    chunks.current = splitIntoManageableChunks(text);
  }, [text]);

  useEffect(() => {
    if (containsMalayalam) {
      setActiveLang('ml-IN');
    } else {
      setActiveLang(defaultLanguage);
    }
  }, [containsMalayalam, defaultLanguage]);

  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Handle auto-play on initial render if enabled
  useEffect(() => {
    if (autoPlayEnabled && text) {
      const timer = setTimeout(() => {
        handlePlay();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoPlayEnabled, text]);

  // Find the most natural voice available for the language
  const getBestVoice = (lang: 'en-US' | 'ml-IN'): SpeechSynthesisVoice | null => {
    if (availableVoices.length === 0) return null;

    if (lang === 'ml-IN') {
      const mlVoice = availableVoices.find(
        (v) =>
          v.lang.toLowerCase().includes('ml') ||
          v.name.toLowerCase().includes('malayalam')
      );
      if (mlVoice) return mlVoice;
      // Fallback to Indian English or primary voice if Malayalam not pre-installed
      const inVoice = availableVoices.find((v) => v.lang.toLowerCase().includes('en-in'));
      if (inVoice) return inVoice;
    } else {
      // Prioritize natural sounding Google, Microsoft, or Apple English voices
      const naturalVoice = availableVoices.find(
        (v) =>
          (v.lang.toLowerCase().includes('en-us') || v.lang.toLowerCase().includes('en-gb')) &&
          (v.name.toLowerCase().includes('natural') ||
            v.name.toLowerCase().includes('google') ||
            v.name.toLowerCase().includes('samantha') ||
            v.name.toLowerCase().includes('jenny'))
      );
      if (naturalVoice) return naturalVoice;

      const enVoice = availableVoices.find((v) => v.lang.toLowerCase().includes('en'));
      if (enVoice) return enVoice;
    }

    return availableVoices[0] || null;
  };

  const playChunk = (index: number) => {
    if (isCancelledRef.current) return;
    if (index >= chunks.current.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentChunkIndex(-1);
      return;
    }

    setCurrentChunkIndex(index);
    const chunkText = chunks.current[index];
    const utterance = new SpeechSynthesisUtterance(chunkText);

    utterance.rate = rate;
    utterance.pitch = 1.0;
    utterance.lang = activeLang;

    const voice = getBestVoice(activeLang);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => {
      if (!isCancelledRef.current) {
        playChunk(index + 1);
      }
    };

    utterance.onerror = (e) => {
      // If stopped manually or interrupted, ignore
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        if (!isCancelledRef.current) {
          playChunk(index + 1);
        }
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePlay = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    chunks.current = splitIntoManageableChunks(text);
    if (chunks.current.length === 0) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    isCancelledRef.current = false;
    window.speechSynthesis.cancel();
    setIsPlaying(true);
    setIsPaused(false);
    playChunk(0);
  };

  const handlePause = () => {
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    isCancelledRef.current = true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentChunkIndex(-1);
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
    const nextIdx = (speeds.indexOf(rate) + 1) % speeds.length;
    const nextRate = speeds[nextIdx];
    setRate(nextRate);

    // If currently playing, restart from current chunk with new speed
    if (isPlaying) {
      const resumeIndex = Math.max(0, currentChunkIndex);
      window.speechSynthesis.cancel();
      playChunk(resumeIndex);
    }
  };

  const toggleLanguage = () => {
    const next = activeLang === 'en-US' ? 'ml-IN' : 'en-US';
    setActiveLang(next);
    if (isPlaying) {
      handleStop();
    }
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Voice Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          {/* Main Play / Pause Button */}
          {!isPlaying || isPaused ? (
            <button
              type="button"
              onClick={handlePlay}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition active:scale-95"
              title="Play AI Voice Answer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isPaused ? 'Resume' : 'Listen Answer'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePause}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-amber-600/30 transition"
              title="Pause Audio"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </button>
          )}

          {/* Stop Button */}
          {(isPlaying || isPaused) && (
            <button
              type="button"
              onClick={handleStop}
              className="p-1.5 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30 transition"
              title="Stop Audio"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          )}

          {/* Speech Speed Pill */}
          <button
            type="button"
            onClick={cycleSpeed}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-mono text-xs font-semibold flex items-center gap-1 transition"
            title="Adjust Speech Speed (0.75x, 1x, 1.25x, 1.5x, 2x)"
          >
            <Gauge className="w-3 h-3 text-indigo-400" />
            <span>{rate}x</span>
          </button>

          {/* Voice Language Selector: English vs Malayalam */}
          <button
            type="button"
            onClick={toggleLanguage}
            className={`px-2 py-1 rounded-lg border text-xs font-mono font-semibold flex items-center gap-1 transition ${
              activeLang === 'ml-IN'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-slate-950 text-slate-300 border-slate-800'
            }`}
            title="Switch Voice Output Language"
          >
            <Globe className="w-3 h-3 text-indigo-400" />
            <span>{activeLang === 'en-US' ? 'Voice: EN' : 'Voice: മല'}</span>
          </button>
        </div>

        {/* Right Status & Auto-play Option */}
        <div className="flex items-center gap-2 text-xs">
          {isPlaying && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-mono text-[11px] animate-pulse">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span>
                Section {Math.min(currentChunkIndex + 1, chunks.current.length)}/{chunks.current.length}
              </span>
            </span>
          )}

          <label
            className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer select-none hover:text-slate-200"
            title="Automatically play speech when new answers arrive"
          >
            <input
              type="checkbox"
              checked={autoPlayEnabled}
              onChange={(e) => setAutoPlayEnabled(e.target.checked)}
              className="w-3.5 h-3.5 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0 accent-indigo-500"
            />
            <span>Auto-read</span>
          </label>
        </div>
      </div>

      {/* Synchronized Text View with Real-Time Sentence Highlighting */}
      {showSynchronizedText && chunks.current.length > 0 && (
        <div className="text-xs sm:text-sm leading-relaxed text-slate-200 space-y-1 pt-0.5">
          {chunks.current.map((chunk, idx) => {
            const isCurrent = isPlaying && currentChunkIndex === idx;
            return (
              <span
                key={idx}
                className={`transition-all duration-200 inline ${
                  isCurrent
                    ? 'bg-indigo-600/30 text-white font-medium px-1 rounded shadow-sm ring-1 ring-indigo-400/50'
                    : 'hover:text-indigo-200'
                }`}
              >
                {chunk}{' '}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};
