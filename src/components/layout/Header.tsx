import React, { useState } from 'react';
import { BookOpen, LogOut, ShieldCheck, KeyRound, Check, User, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ComplexityLevel } from '../../types/study';
import { ComplexitySlider } from '../common/ComplexitySlider';

interface HeaderProps {
  complexity: ComplexityLevel;
  onComplexityChange: (level: ComplexityLevel) => void;
  geminiApiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  complexity,
  onComplexityChange,
  geminiApiKey,
  onSaveApiKey,
}) => {
  const { user, logout } = useAuth();
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(geminiApiKey);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(tempKey.trim());
    setShowKeyModal(false);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/90 bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Left: Brand & Active User Session Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">StudyRetrieval</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v3 Workspace
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Multi-Tier Academic PDF & YouTube Synthesis
              </p>
            </div>
          </div>

          {/* Mobile Logout Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={logout}
              className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-medium flex items-center gap-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Center: Global Standout Complexity Slider (Pillar 5) */}
        <div className="flex-1 max-w-2xl mx-auto w-full">
          <ComplexitySlider level={complexity} onChange={onComplexityChange} compact />
        </div>

        {/* Right: API Mode Indicator, User Profile & Explicit Logout (Pillar 1) */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setTempKey(geminiApiKey);
              setShowKeyModal(true);
            }}
            className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition ${
              geminiApiKey
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
            title="Configure Optional Live Gemini API Key"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{geminiApiKey ? 'Live Gemini Active' : 'AI Engine: Instant Multi-Tier'}</span>
          </button>

          {user && (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-semibold text-xs">
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5" title={`Session Token: ${user.token}`}>
                    <span className="text-xs font-semibold text-white leading-none">{user.name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">{user.email}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 text-xs font-semibold flex items-center gap-1.5 transition"
                title="Destroy session token and return to sign-in"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Optional Gemini API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">AI Synthesis Engine Settings</h3>
                <p className="text-xs text-slate-400">Dual-Mode Precomputed + Live Gemini 2.5 Flash</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              StudyRetrieval works out-of-the-box with zero-latency precomputed multi-tier academic summaries across all 5 complexity levels. Optionally paste a{' '}
              <span className="text-indigo-300 font-mono">Gemini API Key</span> to enable live LLM synthesis for custom questions and uploaded documents.
            </p>

            <form onSubmit={handleSaveKey} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Google Gemini API Key (Optional)
                </label>
                <input
                  type="password"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
