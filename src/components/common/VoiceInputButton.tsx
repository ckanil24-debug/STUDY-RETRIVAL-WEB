import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, AlertCircle, RefreshCw, Globe } from 'lucide-react';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  currentValue?: string;
  defaultLanguage?: 'en-US' | 'ml-IN';
  className?: string;
}

// Window augment for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  currentValue = '',
  defaultLanguage = 'en-US',
  className = '',
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [speechLang, setSpeechLang] = useState<'en-US' | 'ml-IN'>(defaultLanguage);
  const [interimText, setInterimText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const audioTimerRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setIsSupported(false);
      return;
    }
  }, []);

  const clearError = () => setErrorMessage(null);

  const startRecording = () => {
    clearError();
    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setErrorMessage(
        'Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = speechLang; // 'en-US' or 'ml-IN'
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
        setInterimText('');
        clearError();

        // Safety timeout for silent/noisy audio: auto stop after 20s if no input
        audioTimerRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        }, 20000);
      };

      recognition.onresult = (event: any) => {
        let finalTrans = '';
        let interim = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTrans += result[0].transcript;
          } else {
            interim += result[0].transcript;
          }
        }

        if (interim) {
          setInterimText(interim);
        }

        if (finalTrans) {
          const combined = currentValue
            ? `${currentValue.trim()} ${finalTrans.trim()}`
            : finalTrans.trim();
          onTranscript(combined);
          setInterimText('');
        }
      };

      recognition.onerror = (event: any) => {
        setIsRecording(false);
        if (audioTimerRef.current) clearTimeout(audioTimerRef.current);

        const error = event.error;
        if (error === 'not-allowed' || error === 'permission-denied') {
          setErrorMessage(
            'Microphone access was denied. Please allow microphone permissions in your browser address bar settings.'
          );
        } else if (error === 'no-speech') {
          setErrorMessage(
            'No clear speech detected. Please speak closer to the mic and try again.'
          );
        } else if (error === 'audio-capture') {
          setErrorMessage('No microphone device found or audio capture failed.');
        } else if (error === 'network') {
          setErrorMessage('Speech service network error. Please verify your connection.');
        } else {
          setErrorMessage(`Speech input error: ${error || 'unclear audio'}. Please try again.`);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        setInterimText('');
        if (audioTimerRef.current) clearTimeout(audioTimerRef.current);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setIsRecording(false);
      setErrorMessage(
        'Unable to initialize microphone. Please check permissions and try again.'
      );
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore stop error
      }
    }
    setIsRecording(false);
    setInterimText('');
    if (audioTimerRef.current) clearTimeout(audioTimerRef.current);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className={`relative inline-flex items-center gap-1.5 ${className}`}>
      {/* Language Selector for Speech Input: English vs Malayalam */}
      <button
        type="button"
        onClick={() => {
          const next = speechLang === 'en-US' ? 'ml-IN' : 'en-US';
          setSpeechLang(next);
          if (isRecording) {
            stopRecording();
          }
        }}
        title={`Speech Language: ${speechLang === 'en-US' ? 'English (en-US)' : 'മലയാളം (ml-IN)'}. Click to switch.`}
        className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-[11px] font-mono font-semibold text-slate-300 flex items-center gap-1 transition"
      >
        <Globe className="w-3 h-3 text-indigo-400" />
        <span>{speechLang === 'en-US' ? 'EN' : 'മല'}</span>
      </button>

      {/* Main Microphone Button */}
      <button
        type="button"
        onClick={toggleRecording}
        title={
          isRecording
            ? 'Stop Voice Recording'
            : `Click to speak question (${speechLang === 'en-US' ? 'English' : 'മലയാളം'})`
        }
        className={`relative p-2.5 rounded-xl border font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
          isRecording
            ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-600/40 animate-pulse'
            : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-slate-700'
        }`}
      >
        {isRecording ? (
          <>
            <MicOff className="w-4 h-4 text-white animate-bounce" />
            <span className="hidden sm:inline font-mono text-[11px]">Stop</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 text-rose-400 hover:text-rose-300" />
            <span className="hidden sm:inline text-[11px]">Voice</span>
          </>
        )}
      </button>

      {/* Live Recording Waves Indicator Pill */}
      {isRecording && (
        <div className="absolute -top-10 left-0 right-0 sm:right-auto z-30 bg-rose-950/95 border border-rose-500/50 text-rose-200 px-3 py-1 rounded-xl shadow-xl flex items-center gap-2 text-xs font-mono backdrop-blur-md whitespace-nowrap animate-in fade-in zoom-in-95">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <Volume2 className="w-3.5 h-3.5 text-rose-300" />
          <span>
            Listening ({speechLang === 'en-US' ? 'English' : 'മലയാളം'})...
          </span>
          {interimText && (
            <span className="text-slate-300 italic max-w-[140px] truncate">
              "{interimText}"
            </span>
          )}
        </div>
      )}

      {/* Error / Permission Banner Popup */}
      {errorMessage && (
        <div className="absolute top-full left-0 mt-2 z-50 w-72 bg-slate-900 border border-rose-500/50 rounded-xl p-3 shadow-2xl text-xs space-y-1.5 backdrop-blur-md animate-in fade-in slide-in-from-top-1">
          <div className="flex items-start justify-between gap-1 text-rose-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Voice Input Feedback</span>
            </span>
            <button
              type="button"
              onClick={clearError}
              className="text-slate-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {errorMessage}
          </p>
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={startRecording}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
