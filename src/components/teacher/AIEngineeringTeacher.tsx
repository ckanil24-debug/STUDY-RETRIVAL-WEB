import React, { useState } from 'react';
import {
  GraduationCap,
  Smile,
  BookOpen,
  Target,
  ShieldAlert,
  Sparkles,
  Send,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Cpu,
  Layers,
  ArrowRight,
  Flame,
  RotateCcw,
  BookMarked,
  Sliders,
  ChevronDown,
  Terminal,
  Radio,
  Zap,
  Cog,
  Building2,
  BrainCircuit,
  MessageSquare,
  Volume2,
} from 'lucide-react';
import {
  EngineeringBranch,
  ENGINEERING_BRANCHES,
  FormulaBreakdown,
  PracticalEngineeringExample,
  ProgressiveHintLadder,
  Semester,
  StepExplanation,
  TeacherMessage,
  TEACHING_STYLES,
  TeachingStyle,
  UnderstandingCheck,
} from '../../types/teacher';
import {
  generateTeacherResponse,
  QUICK_START_TOPICS,
} from '../../services/teacherAiService';
import { VoiceInputButton } from '../common/VoiceInputButton';
import { AIVoiceSpeaker } from '../common/AIVoiceSpeaker';

interface AIEngineeringTeacherProps {
  geminiApiKey?: string;
  activeLanguage?: string;
}

export const AIEngineeringTeacher: React.FC<AIEngineeringTeacherProps> = ({
  geminiApiKey = '',
  activeLanguage = 'EN',
}) => {
  const [selectedStyle, setSelectedStyle] = useState<TeachingStyle>('friendly');
  const [selectedBranch, setSelectedBranch] = useState<EngineeringBranch>('cse');
  const [selectedSemester, setSelectedSemester] = useState<Semester>(4);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<TeacherMessage[]>(() => {
    const initial = generateTeacherResponse({
      studentQuery: 'Explain Virtual Memory and Paging in OS step by step',
      style: 'friendly',
      branch: 'cse',
      semester: 4,
    });
    return [initial];
  });

  const activeBranchMeta = ENGINEERING_BRANCHES[selectedBranch];
  const activeStyleMeta = TEACHING_STYLES[selectedStyle];
  const currentSemesterSubjects = activeBranchMeta.coreSubjectsBySemester[selectedSemester] || [];

  // Helper to send query
  const handleSendMessage = (queryText: string, actionType?: 'normal' | 'step_by_step' | 'practical_example' | 'formula_breakdown' | 'viva_challenge' | 'request_hint') => {
    if (!queryText.trim() && actionType !== 'request_hint' && actionType !== 'viva_challenge') return;

    // Student message
    if (queryText.trim()) {
      const studentMsg: TeacherMessage = {
        id: `msg-student-${Date.now()}`,
        sender: 'student',
        style: selectedStyle,
        content: queryText.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, studentMsg]);
    }

    setIsTyping(true);

    // Look for active hint ladder in the latest teacher message
    const lastTeacherMsg = [...messages].reverse().find((m) => m.sender === 'teacher' && m.hintLadder);
    const activeLadder = lastTeacherMsg ? lastTeacherMsg.hintLadder : undefined;

    setTimeout(() => {
      const teacherResponse = generateTeacherResponse({
        studentQuery: queryText,
        style: selectedStyle,
        branch: selectedBranch,
        semester: selectedSemester,
        geminiApiKey,
        actionType: actionType || 'normal',
        activeHintLadder: activeLadder,
      });

      setMessages((prev) => [...prev, teacherResponse]);
      setIsTyping(false);
    }, 600);

    setInputText('');
  };

  const handleQuickTopicClick = (topic: typeof QUICK_START_TOPICS[0]) => {
    setSelectedBranch(topic.branch);
    setSelectedSemester(topic.semester);
    handleSendMessage(topic.query);
  };

  const handleAnswerUnderstandingCheck = (msgId: string, optionIdx: number) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== msgId || !msg.understandingCheck) return msg;
        const isCorrect = optionIdx === msg.understandingCheck.correctOptionIndex;
        return {
          ...msg,
          understandingCheck: {
            ...msg.understandingCheck,
            studentAnswer: optionIdx,
            isAnswered: true,
            isCorrect,
          },
        };
      })
    );
  };

  const handleRequestNextHint = (ladder: ProgressiveHintLadder) => {
    handleSendMessage('', 'request_hint');
  };

  // Branch icon rendering helper
  const renderBranchIcon = (branch: EngineeringBranch) => {
    switch (branch) {
      case 'cse':
        return <Terminal className="w-4 h-4 text-cyan-400" />;
      case 'ece':
        return <Radio className="w-4 h-4 text-indigo-400" />;
      case 'eee':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'mech':
        return <Cog className="w-4 h-4 text-emerald-400" />;
      case 'civil':
        return <Building2 className="w-4 h-4 text-orange-400" />;
      case 'aids':
        return <BrainCircuit className="w-4 h-4 text-purple-400" />;
    }
  };

  const renderStyleIcon = (style: TeachingStyle) => {
    switch (style) {
      case 'friendly':
        return <Smile className="w-4 h-4 text-emerald-400" />;
      case 'detailed':
        return <BookOpen className="w-4 h-4 text-cyan-400" />;
      case 'exam':
        return <Target className="w-4 h-4 text-amber-400" />;
      case 'viva':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'beginner':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6" role="region" aria-label="AI Engineering Teacher Hub">
      {/* HEADER BANNER */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-inner">
                <GraduationCap className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Interactive AI Engineering Teacher
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-mono text-[10px] font-bold tracking-wider uppercase shadow-sm">
                    TEACHER MODE
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Step-by-step concept breakdown, formulas with worked examples, practical industry applications, and progressive hints.
                </p>
              </div>
            </div>
          </div>

          {/* Branch & Semester Selectors */}
          <div className="flex flex-wrap items-center gap-2.5 bg-slate-950/90 p-2.5 rounded-2xl border border-slate-800 shadow-md">
            {/* Branch Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono text-slate-400 font-semibold pl-1">Branch:</span>
              <select
                aria-label="Engineering Branch"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value as EngineeringBranch)}
                className="bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {(Object.keys(ENGINEERING_BRANCHES) as EngineeringBranch[]).map((b) => (
                  <option key={b} value={b}>
                    {ENGINEERING_BRANCHES[b].shortCode} — {ENGINEERING_BRANCHES[b].name}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono text-slate-400 font-semibold">Semester:</span>
              <div className="flex items-center gap-1 bg-slate-900 rounded-xl p-1 border border-slate-700/80">
                {([1, 2, 3, 4, 5, 6, 7, 8] as Semester[]).map((sem) => (
                  <button
                    key={sem}
                    type="button"
                    onClick={() => setSelectedSemester(sem)}
                    className={`w-6 h-6 rounded-lg text-xs font-bold transition ${
                      selectedSemester === sem
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    S{sem}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Current Syllabus Preview Pill */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-mono font-semibold text-indigo-400 flex items-center gap-1.5">
            {renderBranchIcon(selectedBranch)}
            <span>{activeBranchMeta.name} (Semester {selectedSemester}):</span>
          </span>
          {currentSemesterSubjects.map((sub, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 text-[11px] font-medium"
            >
              {sub}
            </span>
          ))}
        </div>
      </div>

      {/* 5 TEACHING STYLES SELECTOR */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>Select Teaching Style (Persona & Tone):</span>
          </span>
          <span className="text-[11px] text-slate-400 italic">
            {activeStyleMeta.tagline}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {(Object.keys(TEACHING_STYLES) as TeachingStyle[]).map((styleKey) => {
            const meta = TEACHING_STYLES[styleKey];
            const isSelected = selectedStyle === styleKey;
            return (
              <button
                key={styleKey}
                type="button"
                onClick={() => setSelectedStyle(styleKey)}
                className={`text-left p-3.5 rounded-2xl border transition-all relative ${
                  isSelected
                    ? `bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/50`
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {renderStyleIcon(styleKey)}
                    <span className="text-xs font-bold text-white">{meta.label}</span>
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                  {meta.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* QUICK-START TOPICS CAROUSEL */}
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
          <BookMarked className="w-3.5 h-3.5 text-cyan-400" />
          <span>Curated Engineering Syllabus Topics (1-Click Test):</span>
        </span>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {QUICK_START_TOPICS.map((topic, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickTopicClick(topic)}
              className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-850 text-left transition group shadow-sm"
            >
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-indigo-400 mb-1">
                <span>{topic.branch.toUpperCase()} • S{topic.semester}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <h4 className="text-xs font-semibold text-slate-200 line-clamp-2 group-hover:text-white">
                {topic.title}
              </h4>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONVERSATION FEED */}
      <div className="space-y-6 pt-2">
        {messages.map((msg) => {
          const isTeacher = msg.sender === 'teacher';
          const styleConfig = TEACHING_STYLES[msg.style];

          if (!isTeacher) {
            // Student Message Bubble
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-2xl rounded-2xl bg-indigo-600 text-white p-4 shadow-lg space-y-1">
                  <div className="flex items-center justify-between gap-3 text-[11px] text-indigo-200 border-b border-indigo-500/50 pb-1 mb-2 font-mono">
                    <span className="font-semibold">Student (Semester {selectedSemester} {activeBranchMeta.shortCode})</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              </div>
            );
          }

          // Teacher Message Card
          return (
            <div
              key={msg.id}
              className={`rounded-3xl bg-slate-950 border border-slate-800/90 p-5 sm:p-7 space-y-6 shadow-xl`}
            >
              {/* Teacher Header with Style Persona Badge & Timestamp */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                    {renderStyleIcon(msg.style)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        {styleConfig.label}
                      </h3>
                      <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${styleConfig.badgeColor}`}>
                        {styleConfig.tagline}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Specialized for {activeBranchMeta.name} • Semester {selectedSemester}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-500">{msg.timestamp}</span>
                </div>
              </div>

              {/* Natural AI Voice Speaker Output */}
              {msg.speechText && (
                <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-2.5">
                  <AIVoiceSpeaker
                    text={msg.speechText}
                    defaultLanguage={activeLanguage === 'ML' ? 'ml-IN' : 'en-US'}
                    autoPlay={false}
                    showSynchronizedText={false}
                  />
                </div>
              )}

              {/* Intro / Core Narrative Content */}
              <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </div>

              {/* CAPABILITY 1: STEP-BY-STEP CONCEPT EXPLANATION */}
              {msg.steps && msg.steps.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400 font-mono text-xs font-bold">
                      STEP-BY-STEP
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      Sequential Concept Architecture:
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {msg.steps.map((st) => (
                      <div
                        key={st.stepNumber}
                        className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-2 hover:border-indigo-500/40 transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-600/30 text-indigo-300 font-mono text-[10px] font-bold">
                            PHASE {st.stepNumber}
                          </span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <h5 className="text-xs sm:text-sm font-bold text-white">
                          {st.title}
                        </h5>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {st.explanation}
                        </p>
                        {st.keyRule && (
                          <div className="pt-1 border-t border-slate-800/80">
                            <span className="text-[11px] font-mono text-amber-300 font-semibold block">
                              ⚡ Key Rule: {st.keyRule}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CAPABILITY 2: PRACTICAL ENGINEERING REAL-WORLD EXAMPLE */}
              {msg.practicalExample && (
                <div className="rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/35 p-4 sm:p-5 space-y-3 shadow-lg">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                        PRACTICAL APPLICATION
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-cyan-200">
                        {msg.practicalExample.title}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25">
                      Domain: {msg.practicalExample.industryDomain}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                        ⚙️ Real-World Implementation
                      </span>
                      <p className="text-slate-200 leading-relaxed">
                        {msg.practicalExample.realWorldApplication}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                        ⚖️ Engineering Trade-Off Analysis
                      </span>
                      <p className="text-slate-200 leading-relaxed">
                        {msg.practicalExample.engineeringTradeoff}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block mb-1">
                      🏭 Industry Case Study
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {msg.practicalExample.fieldCaseStudy}
                    </p>
                  </div>
                </div>
              )}

              {/* CAPABILITY 3: FORMULA EXPLAINER & WORKED NUMERICAL */}
              {msg.formula && (
                <div className="rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/35 p-4 sm:p-5 space-y-4 shadow-lg">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-500/20 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold">
                        FORMULA EXPLAINER
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        {msg.formula.equationName}
                      </h4>
                    </div>
                    <span className="text-[11px] font-mono text-indigo-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 font-semibold">
                      {msg.formula.equationLatex}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 italic">
                    Physical Meaning: {msg.formula.physicalMeaning}
                  </p>

                  {/* Variable-by-Variable Breakdown Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                        <tr>
                          <th className="p-2.5">Symbol</th>
                          <th className="p-2.5">Variable Name</th>
                          <th className="p-2.5">Standard SI Unit</th>
                          <th className="p-2.5">Physical Significance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 bg-slate-900/60 font-mono text-[11px]">
                        {msg.formula.variables.map((v, i) => (
                          <tr key={i} className="hover:bg-slate-850">
                            <td className="p-2.5 font-bold text-indigo-300">{v.symbol}</td>
                            <td className="p-2.5 text-slate-200 font-sans">{v.name}</td>
                            <td className="p-2.5 text-amber-300">{v.unit}</td>
                            <td className="p-2.5 text-slate-400 font-sans">{v.significance}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Worked Numerical Example */}
                  {msg.formula.workedExample && (
                    <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-indigo-300 font-mono">
                          📝 Worked Engineering Numerical:
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Given: {msg.formula.workedExample.givenValues}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        {msg.formula.workedExample.problemStatement}
                      </p>
                      <div className="space-y-1 pt-1 border-t border-slate-800 font-mono text-xs text-slate-300">
                        {msg.formula.workedExample.stepByStepSolution.map((st, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-indigo-400 font-bold">{idx + 1}.</span>
                            <span>{st}</span>
                          </div>
                        ))}
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
                        Result: {msg.formula.workedExample.finalResult}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CAPABILITY 4: CHECK STUDENT UNDERSTANDING */}
              {msg.understandingCheck && (
                <div className="rounded-2xl bg-slate-900/90 border border-indigo-500/30 p-4 sm:p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">
                      UNDERSTANDING CHECK
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      Check Your Understanding:
                    </h4>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 font-medium">
                    {msg.understandingCheck.question}
                  </p>

                  {/* Multiple Choice Options */}
                  {msg.understandingCheck.options && (
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {msg.understandingCheck.options.map((opt, optIdx) => {
                        const isSelected = msg.understandingCheck?.studentAnswer === optIdx;
                        const isAnswered = msg.understandingCheck?.isAnswered;
                        const isCorrectOpt = optIdx === msg.understandingCheck?.correctOptionIndex;

                        let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-indigo-500/50';
                        if (isAnswered) {
                          if (isCorrectOpt) {
                            btnStyle = 'bg-emerald-600/20 border-emerald-500 text-emerald-200 font-semibold';
                          } else if (isSelected && !isCorrectOpt) {
                            btnStyle = 'bg-rose-600/20 border-rose-500 text-rose-200';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isAnswered}
                            onClick={() => handleAnswerUnderstandingCheck(msg.id, optIdx)}
                            className={`text-left p-3 rounded-xl border text-xs flex items-center justify-between gap-3 transition ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {isAnswered && isCorrectOpt && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                            {isAnswered && isSelected && !isCorrectOpt && (
                              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Feedback on answer */}
                  {msg.understandingCheck.isAnswered && (
                    <div
                      className={`p-3 rounded-xl text-xs space-y-1 border ${
                        msg.understandingCheck.isCorrect
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
                          : 'bg-amber-500/15 border-amber-500/30 text-amber-200'
                      }`}
                    >
                      <span className="font-bold block">
                        {msg.understandingCheck.isCorrect ? '🎉 Excellent! Exactly right.' : '💡 Good try! Here is the concept:'}
                      </span>
                      <p>{msg.understandingCheck.explanation}</p>
                    </div>
                  )}
                </div>
              )}

              {/* CAPABILITY 5: PROGRESSIVE HINT LADDER ("HINT-FIRST MODE") */}
              {msg.hintLadder && (
                <div className="rounded-2xl bg-amber-950/30 border border-amber-500/30 p-4 sm:p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/20 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                        HINT-FIRST MODE
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-amber-200">
                        Need a Hint? (Active Problem Solving)
                      </h4>
                    </div>

                    <span className="text-[11px] font-mono text-amber-400">
                      Hint Level: {msg.hintLadder.currentRevealedLevel} of 3
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    {msg.hintLadder.problemContext}
                  </p>

                  {/* Revealed Hints */}
                  <div className="space-y-2">
                    {msg.hintLadder.hints.map((hint, hIdx) => {
                      const isRevealed = hIdx < (msg.hintLadder?.currentRevealedLevel || 0);
                      if (!isRevealed) return null;
                      return (
                        <div
                          key={hIdx}
                          className="p-3 rounded-xl bg-slate-950/90 border border-amber-500/30 text-xs text-amber-200 space-y-1 animate-fadeIn"
                        >
                          <span className="font-bold font-mono text-[10px] text-amber-400 block uppercase">
                            Level {hIdx + 1} Clue
                          </span>
                          <p>{hint}</p>
                        </div>
                      );
                    })}

                    {msg.hintLadder.currentRevealedLevel >= 4 && (
                      <div className="p-3.5 rounded-xl bg-slate-950/90 border border-emerald-500/40 text-xs text-emerald-200 space-y-1.5 animate-fadeIn">
                        <span className="font-bold font-mono text-[10px] text-emerald-400 block uppercase">
                          ✅ Full Worked Solution
                        </span>
                        <p className="leading-relaxed">{msg.hintLadder.fullSolution}</p>
                      </div>
                    )}
                  </div>

                  {/* Hint Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {msg.hintLadder.currentRevealedLevel < 3 ? (
                      <button
                        type="button"
                        onClick={() => handleRequestNextHint(msg.hintLadder!)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Give Me Hint #{msg.hintLadder.currentRevealedLevel + 1}</span>
                      </button>
                    ) : msg.hintLadder.currentRevealedLevel === 3 ? (
                      <button
                        type="button"
                        onClick={() => handleRequestNextHint(msg.hintLadder!)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Reveal Full Worked Solution</span>
                      </button>
                    ) : null}

                    <span className="text-[11px] text-slate-400 italic">
                      Hints guide you to solve problems independently instead of giving answers immediately.
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 animate-pulse p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            <span>AI Engineering Teacher ({activeStyleMeta.label}) is analyzing and synthesizing response...</span>
          </div>
        )}
      </div>

      {/* QUICK CAPABILITY BUTTONS BAR */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-slate-900/80 border border-slate-800">
        <span className="text-[11px] font-mono text-slate-400 font-semibold pl-2">
          Teacher Action:
        </span>
        <button
          type="button"
          onClick={() => handleSendMessage(inputText || 'Explain step by step', 'step_by_step')}
          className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <span>🪜 Step-by-Step</span>
        </button>

        <button
          type="button"
          onClick={() => handleSendMessage(inputText || 'Give practical example', 'practical_example')}
          className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <span>⚙️ Practical Example</span>
        </button>

        <button
          type="button"
          onClick={() => handleSendMessage(inputText || 'Explain formula and numerical', 'formula_breakdown')}
          className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <span>📐 Formula Explainer</span>
        </button>

        <button
          type="button"
          onClick={() => handleSendMessage('Give me a strict viva question', 'viva_challenge')}
          className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/50 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <span>⚡ Strict Viva Challenge</span>
        </button>

        <button
          type="button"
          onClick={() => handleSendMessage('', 'request_hint')}
          className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <span>💡 Need a Hint</span>
        </button>
      </div>

      {/* INPUT BAR WITH VOICE INPUT (ENGLISH & MALAYALAM) */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputText);
        }}
        className="rounded-2xl bg-slate-900 border border-slate-800 p-2 sm:p-3 space-y-2 shadow-2xl focus-within:border-indigo-500/80 transition"
      >
        <div className="flex items-center gap-2">
          {/* Voice Input Button supporting Malayalam and English STT */}
          <VoiceInputButton
            onTranscript={(text: string) => {
              setInputText((prev) => (prev ? `${prev} ${text}` : text));
            }}
            defaultLanguage={activeLanguage === 'ML' ? 'ml-IN' : 'en-US'}
          />

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask ${activeStyleMeta.label} anything in ${activeBranchMeta.shortCode} (e.g. "Explain Nyquist theorem with formula", "Why do we need paging?")`}
            className="flex-1 bg-transparent border-0 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-0 px-2"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition shrink-0"
          >
            <span>Ask Teacher</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 px-1 pt-1 border-t border-slate-800/60">
          <span>
            🎓 Tailored for: <strong className="text-slate-300">{activeBranchMeta.name}</strong> • <strong className="text-slate-300">Semester {selectedSemester}</strong> • Style: <strong className="text-indigo-400">{activeStyleMeta.label}</strong>
          </span>
          <span>Voice input supported in Malayalam (മലയാളം) & English</span>
        </div>
      </form>
    </div>
  );
};
