import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Lock, Mail, Sparkles, ArrowRight, CheckCircle2, Layers, Sliders, Video, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthView: React.FC = () => {
  const { signInWithCredentials, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('alex.rivera@stanford.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both your academic email and password.');
      return;
    }
    setError('');
    signInWithCredentials(email, password);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl" />

      {/* Public Top Navigation */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">StudyRetrieval</span>
                <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  MVP v3
                </span>
              </div>
              <p className="text-xs text-slate-400">Cross-Source Academic PDF & Video Synthesis</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Protected Study Workspace • JWT Session Auth</span>
          </div>
        </div>
      </header>

      {/* Main Split Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center flex-1">
        {/* Left Column: Product Value Prop & 5 Pillars */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built for University & AP/IB Research Workflows</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.15]">
            Synchronize dense{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300">
              PDF papers & YouTube lectures
            </span>{' '}
            at any complexity level.
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
            Upload your professor’s slide deck alongside a recorded lecture. StudyRetrieval automatically links formulas to spoken explanations, builds a 3-tier argument hierarchy, and rewrites everything on the fly from{' '}
            <span className="text-emerald-300 font-medium">ELI5 analogies</span> to{' '}
            <span className="text-rose-300 font-medium">Academic Peer Review</span>.
          </p>

          {/* 4 Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-rose-500/15 text-rose-400 mt-0.5">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Timestamped Video Chapters</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Clickable timestamps (`04:12`), visual slide snapshots, and 3-min Crash Course mode.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-400 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">3-Tier PDF Breakdown</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  3-sentence TL;DR, Core Argument Map with page refs, and Multi-PDF Synthesis Matrix.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-400 mt-0.5">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Cross-Source Q&A Bridging</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ask how a YouTube lecture at `18:45` explained a formula on `Page 4` of your PDF.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 mt-0.5">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">5-Tier Complexity Slider</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Slide seamlessly between ELI5, High School, Undergrad, Grad Seminar, and Peer Review.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pillar 1 Authentication Card */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/50 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Sign in to your Workspace</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Access persisted study spaces, synced transcripts, and uploaded PDFs
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Lock className="w-5 h-5" />
              </div>
            </div>

            {/* One-Click Google OAuth Button */}
            <button
              type="button"
              onClick={signInWithGoogle}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm flex items-center justify-center gap-3 transition shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span>Continue with Google OAuth (.edu)</span>
            </button>

            <div className="relative my-5 flex items-center justify-center">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-500 font-mono">
                or email credentials
              </span>
              <div className="border-t border-slate-800 w-full" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  University or Student Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-300">Password</label>
                  <span className="text-[11px] text-indigo-400">Demo credentials pre-filled</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition"
              >
                <span>Sign In to Study Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Persists folders & custom uploads
              </span>
              <span className="font-mono text-slate-500">v3.0 Auth Guard</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        StudyRetrieval MVP (v3) • Built for University & High School Research Synthesis
      </footer>
    </div>
  );
};
