import React, { useState } from 'react';
import {
  Sparkles,
  Sun,
  Moon,
  Folder,
  Tv,
  LogOut,
  ShieldCheck,
  KeyRound,
  Check,
  Sliders,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ComplexityLevel } from '../../types/study';
import { ComplexitySlider } from '../common/ComplexitySlider';

interface HeaderProps {
  complexity: ComplexityLevel;
  onComplexityChange: (level: ComplexityLevel) => void;
  geminiApiKey: string;
  onSaveApiKey: (key: string) => void;
  activeLanguage: string;
  onToggleLanguage: () => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  libraryCount: number;
  onOpenLibrary: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  complexity,
  onComplexityChange,
  geminiApiKey,
  onSaveApiKey,
  activeLanguage,
  onToggleLanguage,
  isDarkTheme,
  onToggleTheme,
  libraryCount,
  onOpenLibrary,
}) => {
  const { user, logout } = useAuth();
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showSliderDrawer, setShowSliderDrawer] = useState(false);
  const [tempKey, setTempKey] = useState(geminiApiKey);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(tempKey.trim());
    setShowKeyModal(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0b0f19]/95 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Left: InstAI Logo & Branding */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-400 p-[1.5px] shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-[#0d1224] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300/30" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                  Inst<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">AI</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  v3
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden xs:block -mt-0.5">
                {activeLanguage === 'ML' ? 'AI പഠന & ഡോക്യുമെന്റ് അസിസ്റ്റന്റ്' : 'AI Study & Document Assistant'}
              </p>
            </div>
          </div>

          {/* Right Action Icons: Language Pill [EN | മല], Theme Toggle, Profile, Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Language Switcher Pill [EN | മല] matching user screenshot */}
            <button
              type="button"
              onClick={onToggleLanguage}
              className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold flex items-center gap-1 text-slate-300 transition shadow-inner"
              title="Toggle English / Malayalam (മലയാളം)"
            >
              <span className={activeLanguage === 'EN' ? 'text-indigo-400 font-bold' : 'text-slate-500'}>
                EN
              </span>
              <span className="text-slate-600">|</span>
              <span className={activeLanguage === 'ML' ? 'text-purple-400 font-bold' : 'text-slate-500'}>
                മല
              </span>
            </button>

            {/* Theme Toggle Sun / Moon */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-amber-400 hover:text-amber-300 transition"
              title="Toggle Theme"
            >
              {isDarkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Quick Library Button */}
            <button
              type="button"
              onClick={onOpenLibrary}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition"
              title="Open Document Library"
            >
              <Folder className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-mono text-[11px] text-indigo-300 font-bold">{libraryCount}</span>
            </button>

            {/* Presentation/Screen Mode */}
            <button
              type="button"
              onClick={() => setShowSliderDrawer(!showSliderDrawer)}
              className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/30 flex items-center justify-center transition"
              title="Toggle Complexity Calibration Slider"
            >
              <Tv className="w-4 h-4" />
            </button>

            {/* Gemini API Key */}
            <button
              type="button"
              onClick={() => {
                setTempKey(geminiApiKey);
                setShowKeyModal(true);
              }}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-medium transition ${
                geminiApiKey
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Configure Gemini API"
            >
              <KeyRound className="w-3 h-3" />
              <span className="text-[11px]">{geminiApiKey ? 'Live AI' : 'API Key'}</span>
            </button>

            {/* Profile Avatar & Logout */}
            {user && (
              <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-800">
                <div
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 border border-purple-400/50 flex items-center justify-center text-white font-bold text-xs shadow-md"
                  title={`${user.name} (${user.email})`}
                >
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Expandable Top Complexity Slider (Pillar 5) */}
        {showSliderDrawer && (
          <div className="mt-3 pt-3 border-t border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
            <ComplexitySlider level={complexity} onChange={onComplexityChange} compact />
          </div>
        )}
      </div>

      {/* Optional Gemini API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">AI Synthesis Engine Settings</h3>
                <p className="text-xs text-slate-400">Instant Multi-Tier + Optional Live Gemini Flash</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              InstAI runs with built-in instant academic summaries across all 5 complexity tiers. You can optionally paste a Gemini API Key for live custom question answering.
            </p>

            <form onSubmit={handleSaveKey} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Google Gemini API Key
                </label>
                <input
                  type="password"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-purple-500"
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
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5"
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
