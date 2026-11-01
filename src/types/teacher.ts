export type TeachingStyle = 'friendly' | 'detailed' | 'exam' | 'viva' | 'beginner';

export interface TeachingStyleMeta {
  id: TeachingStyle;
  label: string;
  tagline: string;
  iconName: string;
  badgeColor: string;
  accentColor: string;
  bgGradient: string;
  description: string;
  systemInstruction: string;
}

export type EngineeringBranch = 'cse' | 'ece' | 'eee' | 'mech' | 'civil' | 'aids';

export interface BranchMeta {
  id: EngineeringBranch;
  name: string;
  shortCode: string;
  icon: string;
  coreSubjectsBySemester: Record<number, string[]>;
}

export type Semester = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface FormulaVariable {
  symbol: string;
  name: string;
  unit: string;
  significance: string;
}

export interface FormulaBreakdown {
  equationLatex: string;
  equationName: string;
  physicalMeaning: string;
  variables: FormulaVariable[];
  workedExample?: {
    problemStatement: string;
    givenValues: string;
    stepByStepSolution: string[];
    finalResult: string;
  };
}

export interface PracticalEngineeringExample {
  title: string;
  industryDomain: string;
  realWorldApplication: string;
  engineeringTradeoff: string;
  fieldCaseStudy: string;
}

export interface StepExplanation {
  stepNumber: number;
  title: string;
  explanation: string;
  keyRule?: string;
}

export interface UnderstandingCheck {
  question: string;
  questionType: 'multiple_choice' | 'conceptual_reflection';
  options?: string[];
  correctOptionIndex?: number;
  explanation: string;
  studentAnswer?: string | number;
  isAnswered?: boolean;
  isCorrect?: boolean;
}

export interface ProgressiveHintLadder {
  problemContext: string;
  hints: string[]; // [Hint 1: Intuition, Hint 2: Formula, Hint 3: Key Calculation]
  currentRevealedLevel: number; // 0 = none, 1 = hint 1, 2 = hint 2, 3 = hint 3, 4 = full answer
  fullSolution: string;
}

export interface TeacherMessage {
  id: string;
  sender: 'teacher' | 'student';
  style: TeachingStyle;
  content: string;
  timestamp: string;
  steps?: StepExplanation[];
  practicalExample?: PracticalEngineeringExample;
  formula?: FormulaBreakdown;
  understandingCheck?: UnderstandingCheck;
  hintLadder?: ProgressiveHintLadder;
  vivaScore?: {
    score: number; // 1 to 10
    feedback: string;
    strengths: string[];
    improvements: string[];
  };
  speechText?: string;
}

export const TEACHING_STYLES: Record<TeachingStyle, TeachingStyleMeta> = {
  friendly: {
    id: 'friendly',
    label: 'Friendly Teacher',
    tagline: 'Warm, encouraging, and supportive mentorship',
    iconName: 'Smile',
    badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    accentColor: 'text-emerald-400',
    bgGradient: 'from-emerald-950/40 via-slate-900 to-slate-900',
    description: 'Celebrates your progress, explains with positive reinforcement, and makes hard engineering concepts stress-free.',
    systemInstruction:
      'You are a friendly, encouraging Engineering Professor. Warm tone, celebrate good questions, use supportive remarks ("Great intuition!", "You are very close!"), break down fears of math, and guide patiently.',
  },
  detailed: {
    id: 'detailed',
    label: 'Detailed Teacher',
    tagline: 'Deep dive, theoretical rigor, and mathematical proofs',
    iconName: 'BookOpen',
    badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    accentColor: 'text-cyan-400',
    bgGradient: 'from-cyan-950/40 via-slate-900 to-slate-900',
    description: 'Covers underlying physics, derivations from first principles, internal hardware/software architectures, and edge cases.',
    systemInstruction:
      'You are a senior Engineering Researcher and Professor. Provide comprehensive derivations, first-principles logic, state equations, timing diagrams, internal mechanics, and boundary conditions.',
  },
  exam: {
    id: 'exam',
    label: 'Exam Preparation Teacher',
    tagline: 'High-yield questions, marks breakdown, and exam tips',
    iconName: 'Target',
    badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    accentColor: 'text-amber-400',
    bgGradient: 'from-amber-950/40 via-slate-900 to-slate-900',
    description: 'Targets university exam formats (2-mark definitions, 5-mark short notes, 10-mark full derivations), key diagrams, and examiner pitfalls.',
    systemInstruction:
      'You are a university exam evaluator and subject expert. Highlight how questions appear in semester finals (2-mark vs 10-mark), expected block diagrams, crucial keywords examiners look for, and common traps students fall into.',
  },
  viva: {
    id: 'viva',
    label: 'Strict Viva Examiner',
    tagline: 'Rapid-fire oral viva, edge cases, and performance grading',
    iconName: 'ShieldAlert',
    badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    accentColor: 'text-rose-400',
    bgGradient: 'from-rose-950/40 via-slate-900 to-slate-900',
    description: 'Simulates strict laboratory and semester oral viva exams. Interrogates assumptions, asks follow-up counter questions, and grades precision.',
    systemInstruction:
      'You are a strict, no-nonsense external viva examiner for an engineering university. Demand concise, razor-sharp technical answers. If the student is vague, immediately counter-question them on edge cases, formula limits, or physical units. Grade their answer out of 10 with direct feedback.',
  },
  beginner: {
    id: 'beginner',
    label: 'Beginner-Friendly Teacher',
    tagline: 'Everyday analogies, zero jargon, and visual intuition',
    iconName: 'Sparkles',
    badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    accentColor: 'text-purple-400',
    bgGradient: 'from-purple-950/40 via-slate-900 to-slate-900',
    description: 'Translates intimidating engineering jargon into intuitive real-life metaphors (water pipes, postal systems, traffic lights).',
    systemInstruction:
      'You are a teacher specializing in making complex engineering concepts crystal clear for absolute beginners. Ban raw jargon without an immediate everyday analogy. Use visual metaphors (water in pipes for current/voltage, kitchen recipe for algorithms, traffic cops for OS schedulers).',
  },
};

export const ENGINEERING_BRANCHES: Record<EngineeringBranch, BranchMeta> = {
  cse: {
    id: 'cse',
    name: 'Computer Science & Engineering',
    shortCode: 'CSE',
    icon: 'Terminal',
    coreSubjectsBySemester: {
      1: ['Engineering Mathematics I', 'Problem Solving with C', 'Digital Logic Basics'],
      2: ['Discrete Mathematics', 'Data Structures & Algorithms', 'Object-Oriented Programming (Java/C++)'],
      3: ['Computer Organization & Architecture', 'Design & Analysis of Algorithms', 'Database Management Systems (DBMS)'],
      4: ['Operating Systems', 'Theory of Computation (Automata)', 'Software Engineering'],
      5: ['Computer Networks', 'Compiler Design', 'Web Technologies & Cloud'],
      6: ['Distributed Systems', 'Cryptography & Network Security', 'Machine Learning Foundations'],
      7: ['Artificial Intelligence', 'Parallel & High-Performance Computing', 'DevOps & Microservices'],
      8: ['Cloud-Native Architecture', 'Advanced Cyber Security', 'Capstone Project & System Design'],
    },
  },
  ece: {
    id: 'ece',
    name: 'Electronics & Communication',
    shortCode: 'ECE',
    icon: 'Radio',
    coreSubjectsBySemester: {
      1: ['Calculus & Linear Algebra', 'Basic Electrical Engineering', 'Physics for Electronics'],
      2: ['Electronic Devices & Circuits (EDC)', 'Network Analysis', 'Digital Electronics'],
      3: ['Analog Circuits & Op-Amps', 'Signals & Systems', 'Electromagnetic Field Theory'],
      4: ['Analog & Digital Communication', 'Linear Integrated Circuits', 'Microprocessors (8086/ARM)'],
      5: ['Digital Signal Processing (DSP)', 'Control Systems', 'Antennas & Wave Propagation'],
      6: ['VLSI Design & CMOS Logic', 'Embedded Systems & RTOS', 'Microwave Engineering'],
      7: ['Wireless & Cellular Communications (5G)', 'Optical Fiber Communication', 'Satellite Systems'],
      8: ['Radar Systems & Deep Tech Hardware', 'IoT Architecture', 'Final Year Industry Project'],
    },
  },
  eee: {
    id: 'eee',
    name: 'Electrical & Electronics',
    shortCode: 'EEE',
    icon: 'Zap',
    coreSubjectsBySemester: {
      1: ['Calculus & Differential Equations', 'Engineering Physics', 'Fundamentals of Electrical Circuits'],
      2: ['Circuit Theory & Network Theorems', 'Electric Circuit Analysis', 'Electronic Devices'],
      3: ['DC Machines & Transformers', 'Electrical & Electronic Measurements', 'Analog Electronics'],
      4: ['AC Induction & Synchronous Machines', 'Power Systems I (Generation & Transmission)', 'Linear Control Systems'],
      5: ['Power Electronics (Thyristors, Inverters)', 'Microcontrollers & Embedded Applications', 'Electromagnetic Fields'],
      6: ['Power Systems II (Protection & Switchgear)', 'Electric Drives & Traction', 'Digital Signal Processing'],
      7: ['Renewable Energy Systems (Solar/Wind)', 'High Voltage Engineering', 'Smart Grid & Power Quality'],
      8: ['Electric Vehicle (EV) Powertrains', 'Power System Dynamics & Control', 'Capstone Project'],
    },
  },
  mech: {
    id: 'mech',
    name: 'Mechanical Engineering',
    shortCode: 'MECH',
    icon: 'Cog',
    coreSubjectsBySemester: {
      1: ['Engineering Mathematics I', 'Engineering Mechanics', 'Basic Mechanical Engineering'],
      2: ['Material Science & Metallurgy', 'Manufacturing Processes I', 'Computer-Aided Drafting (CAD)'],
      3: ['Engineering Thermodynamics', 'Mechanics of Solids (Strength of Materials)', 'Fluid Mechanics & Machinery'],
      4: ['Kinematics & Dynamics of Machinery', 'Applied Thermal Engineering', 'Manufacturing Technology II'],
      5: ['Design of Machine Elements I', 'Heat & Mass Transfer', 'Metrology & Quality Control'],
      6: ['Design of Machine Elements II', 'Finite Element Analysis (FEA)', 'Internal Combustion Engines & Gas Turbines'],
      7: ['Refrigeration & Air Conditioning (HVAC)', 'Operations Research & Industrial Management', 'Robotics & Automation'],
      8: ['Automobile Engineering & Aerodynamics', 'Additive Manufacturing (3D Printing)', 'Industry Capstone Design'],
    },
  },
  civil: {
    id: 'civil',
    name: 'Civil Engineering',
    shortCode: 'CIVIL',
    icon: 'Building2',
    coreSubjectsBySemester: {
      1: ['Engineering Mathematics I', 'Engineering Geology', 'Basic Civil Engineering & Mechanics'],
      2: ['Surveying & Geomatics I', 'Building Materials & Construction', 'Fluid Mechanics'],
      3: ['Strength of Materials (Mechanics of Solids)', 'Surveying II & GPS', 'Engineering Hydrology'],
      4: ['Structural Analysis I', 'Concrete Technology', 'Soil Mechanics & Geotechnical Engineering I'],
      5: ['Design of Reinforced Concrete Structures (RCC)', 'Structural Analysis II', 'Environmental Engineering (Water Treatment)'],
      6: ['Design of Steel Structures', 'Foundation Engineering', 'Transportation Engineering (Highways & Pavements)'],
      7: ['Hydraulic Engineering & Irrigation Design', 'Estimation, Costing & Valuation', 'Earthquake Resistant Design'],
      8: ['Construction Project Management (CPM/PERT)', 'Bridge & Tunnel Engineering', 'Final Year Capstone Project'],
    },
  },
  aids: {
    id: 'aids',
    name: 'Artificial Intelligence & Data Science',
    shortCode: 'AI/DS',
    icon: 'BrainCircuit',
    coreSubjectsBySemester: {
      1: ['Linear Algebra & Matrices', 'Python for Computational Science', 'Discrete Structures'],
      2: ['Probability & Statistics for Data Science', 'Data Structures in Python/C++', 'Object-Oriented Design'],
      3: ['Foundations of Machine Learning', 'Database Systems & SQL/NoSQL', 'Design & Analysis of Algorithms'],
      4: ['Deep Learning Architectures', 'Operating Systems & Concurrency', 'Data Wrangling & Visualization'],
      5: ['Natural Language Processing (NLP)', 'Big Data Technologies (Hadoop, Spark)', 'Computer Vision Foundations'],
      6: ['Reinforcement Learning & LLMs', 'Information Retrieval & Vector Databases', 'Cloud AI & MLOps'],
      7: ['Generative AI & Multimodal Models', 'AI Ethics & Algorithmic Fairness', 'Graph Neural Networks'],
      8: ['Autonomous AI Systems', 'Distributed Training & High-Scale Inference', 'Capstone Research Project'],
    },
  },
};
