import {
  EngineeringBranch,
  FormulaBreakdown,
  PracticalEngineeringExample,
  ProgressiveHintLadder,
  Semester,
  StepExplanation,
  TeacherMessage,
  TEACHING_STYLES,
  TeachingStyle,
  UnderstandingCheck,
} from '../types/teacher';

export interface GenerateTeacherResponseParams {
  studentQuery: string;
  style: TeachingStyle;
  branch: EngineeringBranch;
  semester: Semester;
  geminiApiKey?: string;
  actionType?: 'normal' | 'step_by_step' | 'practical_example' | 'formula_breakdown' | 'viva_challenge' | 'request_hint';
  activeHintLadder?: ProgressiveHintLadder;
}

// Curated Knowledge Base for rich engineering topics across branches
interface CuratedTopicData {
  topic: string;
  keywords: string[];
  branch: EngineeringBranch;
  steps: StepExplanation[];
  practicalExample: PracticalEngineeringExample;
  formula: FormulaBreakdown;
  understandingCheck: UnderstandingCheck;
  hintLadder: ProgressiveHintLadder;
  vivaQuestion: string;
}

const CURATED_ENGINEERING_KNOWLEDGE: CuratedTopicData[] = [
  // 1. CSE: Virtual Memory & Paging
  {
    topic: 'Virtual Memory & Paging',
    keywords: ['paging', 'virtual memory', 'page fault', 'tlb', 'mmu', 'page table'],
    branch: 'cse',
    steps: [
      {
        stepNumber: 1,
        title: 'Logical to Physical Address Translation',
        explanation: 'The CPU generates logical (virtual) addresses partitioned into a Page Number (p) and Page Offset (d). The hardware Memory Management Unit (MMU) uses the page table to translate the page number into a physical frame number (f).',
        keyRule: 'Page Size must always be a power of 2 (e.g. 4KB = 2^12 bytes, so offset d = 12 bits).',
      },
      {
        stepNumber: 2,
        title: 'TLB (Translation Lookaside Buffer) Caching',
        explanation: 'Before accessing main memory for page tables, the MMU checks the associative TLB hardware cache. A TLB hit resolves the physical frame address in ~1 clock cycle, bypassing 2+ bus cycles of memory latency.',
        keyRule: 'Effective Access Time (EAT) = (Hit_Ratio × (TLB_latency + Mem_access)) + ((1 - Hit_Ratio) × (TLB_latency + 2 × Mem_access)).',
      },
      {
        stepNumber: 3,
        title: 'Handling Page Fault Interrupts',
        explanation: 'If the valid/invalid bit in the page table entry is 0, the CPU raises an interrupt trap to the OS kernel. The OS locates the desired frame on disk swap space, brings it into physical RAM, updates the page table, and restarts the instruction.',
        keyRule: 'Thrashing occurs when processes spend more time paging in/out than executing CPU instructions.',
      },
      {
        stepNumber: 4,
        title: 'Frame Allocation & Page Replacement Algorithms',
        explanation: 'When physical memory is exhausted, the OS executes replacement algorithms (LRU, Clock/Second-Chance, or Optimal FIFO) to evict a victim page, marking its dirty bit if writes occurred.',
        keyRule: "Belady's Anomaly: FIFO page replacement can cause MORE page faults with increased allocated frames.",
      },
    ],
    practicalExample: {
      title: 'High-Throughput Web Servers (Node.js & NGINX Linux Kernel)',
      industryDomain: 'Cloud Infrastructure & High-Performance Computing',
      realWorldApplication: 'HugePages (2MB / 1GB page tables) in Linux to eliminate TLB misses when serving millions of concurrent TCP requests.',
      engineeringTradeoff: '4KB standard pages minimize internal fragmentation but blow up TLB miss rates. 2MB HugePages drastically boost TLB hits but waste RAM on small buffers.',
      fieldCaseStudy: 'Netflix cloud video encoding instances enabled Linux Transparent Huge Pages (THP), reducing CPU page table walk overhead from 18% down to 2.4%.',
    },
    formula: {
      equationName: 'Effective Memory Access Time (EAT) with TLB',
      equationLatex: 'EAT = \\alpha (t_{tlb} + t_m) + (1 - \\alpha)(t_{tlb} + 2t_m)',
      physicalMeaning: 'Computes average latency to access memory accounting for cache hits in the Translation Lookaside Buffer versus full multi-level page table walks.',
      variables: [
        { symbol: 'α', name: 'TLB Hit Ratio', unit: 'Dimensionless (0 to 1.0)', significance: 'Probability that page translation is cached in high-speed TLB registers.' },
        { symbol: 't_tlb', name: 'TLB Search Latency', unit: 'Nanoseconds (ns)', significance: 'Hardware associative lookup time (typically 1 to 2 ns).' },
        { symbol: 't_m', name: 'Main Memory Access Time', unit: 'Nanoseconds (ns)', significance: 'Standard DRAM latency (typically 50 to 100 ns).' },
      ],
      workedExample: {
        problemStatement: 'In an x86-64 server, TLB lookup takes 2 ns, main memory access takes 80 ns, and the TLB hit ratio is 95%. Calculate the Effective Memory Access Time (EAT).',
        givenValues: 'α = 0.95, t_tlb = 2 ns, t_m = 80 ns',
        stepByStepSolution: [
          'TLB Hit Path latency = t_tlb + t_m = 2 + 80 = 82 ns.',
          'TLB Miss Path latency = t_tlb + 2 × t_m = 2 + (2 × 80) = 162 ns.',
          'EAT = (0.95 × 82 ns) + (0.05 × 162 ns) = 77.9 ns + 8.1 ns = 86.0 ns.',
        ],
        finalResult: 'EAT = 86.0 ns (versus 160 ns un-cached memory walks).',
      },
    },
    understandingCheck: {
      question: 'Why does an instruction have to be restarted from scratch by the OS kernel after a page fault is serviced?',
      questionType: 'multiple_choice',
      options: [
        'Because the CPU register state was wiped during the interrupt.',
        'Because the CPU halted mid-execution when operand data was absent in physical RAM.',
        'Because the program counter needs to skip the failed instruction.',
        'To force the compiler to re-optimize memory access.',
      ],
      correctOptionIndex: 1,
      explanation: 'When the instruction attempted to fetch an operand from an unmapped page, the MMU raised an interrupt immediately. Once the page is brought into RAM, re-executing the instruction allows the memory access to succeed cleanly without data loss.',
    },
    hintLadder: {
      problemContext: 'A process experiences a sudden spike in execution time from 5 ms to 2200 ms, while CPU utilization drops below 8%. Diagnose the root cause.',
      hints: [
        'Hint 1 (Intuition): Look at the inverse relationship between high paging activity and low CPU utilization.',
        'Hint 2 (Formula/Mechanic): What happens to the OS scheduler when CPU utilization drops? It attempts to increase the degree of multiprogramming, allocating fewer frames per process.',
        'Hint 3 (Root Term): What is the specific operating system failure condition where processes constantly page fault and wait for disk I/O?',
      ],
      currentRevealedLevel: 0,
      fullSolution: 'Diagnosis: The system is suffering from Thrashing. The combined working sets of active processes exceed available physical RAM. The OS continuously swaps pages between RAM and disk swap space, saturating the storage bus while the CPU sits idle waiting for I/O completion. Remediation: Decrease the degree of multiprogramming, install working-set page allocation, or add physical RAM.',
    },
    vivaQuestion: 'Differentiate between Internal and External Fragmentation in Operating Systems. Does paging suffer from external fragmentation? Justify in 15 seconds.',
  },

  // 2. ECE: Nyquist-Shannon Sampling Theorem & Aliasing
  {
    topic: 'Nyquist-Shannon Sampling Theorem & Anti-Aliasing',
    keywords: ['sampling', 'nyquist', 'aliasing', 'dsp', 'filter', 'adc'],
    branch: 'ece',
    steps: [
      {
        stepNumber: 1,
        title: 'Continuous to Discrete Signal Conversion',
        explanation: 'To convert an analog continuous-time signal x(t) into discrete samples x[n], we multiply the signal with an impulse train p(t) with period Ts = 1/fs.',
        keyRule: 'In the frequency domain, sampling duplicates the signal spectrum periodically at integer multiples of the sampling frequency (fs, 2fs, 3fs...).',
      },
      {
        stepNumber: 2,
        title: 'The Nyquist Rate Condition',
        explanation: 'To reconstruct the continuous signal without distortion using an ideal sinc interpolation filter, the sampling frequency fs must be at least twice the maximum frequency component (B) of the signal.',
        keyRule: 'fs ≥ 2 × f_max (Nyquist Rate = 2B).',
      },
      {
        stepNumber: 3,
        title: 'Spectral Overlap (Aliasing Distortion)',
        explanation: 'When fs < 2B, adjacent spectral replicas overlap in the frequency domain. High-frequency components fold back and masquerade as false low-frequency components that cannot be removed digitally.',
        keyRule: 'Foldover frequency: f_alias = |fs - f_input|.',
      },
      {
        stepNumber: 4,
        title: 'Analog Anti-Aliasing Low-Pass Filter (AA-LPF)',
        explanation: 'Before feeding the signal into the Sample & Hold (ADC), an analog low-pass filter must band-limit the signal strictly below fs/2 to suppress noise and out-of-band harmonics.',
        keyRule: 'Anti-aliasing filtering must ALWAYS be performed in the continuous analog domain before ADC quantization.',
      },
    ],
    practicalExample: {
      title: 'Digital Audio CD Recording (44.1 kHz Sampling Standard)',
      industryDomain: 'Audio Engineering & Signal Processing Systems',
      realWorldApplication: 'Human hearing spans 20 Hz to 20,000 Hz. Audio CDs chose 44.1 kHz (2 × 20 kHz = 40 kHz + 10% transition band for analog Butterworth filters).',
      engineeringTradeoff: 'Steeper analog filters introduce phase distortion; gentler filters require higher sampling rates (oversampling / Sigma-Delta ADCs).',
      fieldCaseStudy: 'In automotive radar (77 GHz FMCW), under-sampling the intermediate frequency causes target vehicles to appear at mirror ghost distances.',
    },
    formula: {
      equationName: 'Nyquist-Shannon Criterion & Alias Foldover',
      equationLatex: 'f_s \\ge 2 f_{max} \\quad \\text{and} \\quad f_{alias} = |k f_s - f_{in}|',
      physicalMeaning: 'Guarantees that spectral replicas separated by fs do not overlap, preserving complete information for sinc reconstruction.',
      variables: [
        { symbol: 'f_s', name: 'Sampling Frequency', unit: 'Hertz (Hz or samples/sec)', significance: 'Rate at which continuous waveform is sampled by ADC.' },
        { symbol: 'f_max', name: 'Maximum Bandwidth (Band Limit)', unit: 'Hertz (Hz)', significance: 'Highest spectral frequency component present with non-negligible energy.' },
        { symbol: 'f_alias', name: 'Apparent Aliased Frequency', unit: 'Hertz (Hz)', significance: 'False baseband tone perceived after under-sampling.' },
      ],
      workedExample: {
        problemStatement: 'An analog seismic sensor outputs a pure 700 Hz sinusoidal signal. An engineer incorrectly samples it at fs = 1000 Hz without an analog filter. What apparent frequency will appear in the FFT?',
        givenValues: 'f_in = 700 Hz, f_s = 1000 Hz, Nyquist limit = f_s / 2 = 500 Hz',
        stepByStepSolution: [
          'Nyquist limit is 1000 / 2 = 500 Hz.',
          'Since 700 Hz > 500 Hz, the signal is severely under-sampled (aliasing occurs).',
          'Aliased frequency f_alias = |1000 - 700| = 300 Hz.',
        ],
        finalResult: 'f_alias = 300 Hz (the 700 Hz vibration falsely appears as a 300 Hz tone).',
      },
    },
    understandingCheck: {
      question: 'Can you eliminate aliasing distortion using a digital DSP software filter after the ADC conversion has already taken place?',
      questionType: 'multiple_choice',
      options: [
        'Yes, an FIR notch filter can selectively reject the aliased frequency.',
        'No, because the aliased frequencies have already folded into legitimate baseband bins and are mathematically indistinguishable.',
        'Yes, by increasing the digital interpolation factor.',
        'Only if the signal is audio and not RF.',
      ],
      correctOptionIndex: 1,
      explanation: 'Once aliasing occurs during continuous-to-discrete sampling, the folded high frequencies overlap identically with real baseband components. A digital filter cannot distinguish an aliased 300 Hz artifact from an authentic 300 Hz signal.',
    },
    hintLadder: {
      problemContext: 'You want to record speech signals up to 3.4 kHz for telephone transmission. What is the absolute theoretical minimum sampling rate, and why do telecom systems actually use 8 kHz?',
      hints: [
        'Hint 1 (Formula): What does the Nyquist criterion state for f_max = 3.4 kHz? Multiply by 2.',
        'Hint 2 (Physical Filter Limitation): Real-world analog filters cannot have brick-wall infinite roll-off slopes at exactly 6.8 kHz.',
        'Hint 3 (Practical Margin): Consider the transition band between passband cutoff (3.4 kHz) and stopband attenuation.',
      ],
      currentRevealedLevel: 0,
      fullSolution: 'Nyquist minimum is 2 × 3.4 kHz = 6.8 kHz. Telecom systems sample at 8 kHz (G.711 PCM standard) to provide a practical 1.2 kHz transition guard band (from 3.4 kHz to 4.6 kHz), allowing cost-effective 5th-order analog anti-aliasing filters to achieve 40+ dB attenuation before fs/2 = 4.0 kHz.',
    },
    vivaQuestion: 'Explain why a rotating helicopter blade or car wheel appears to spin backwards on camera under sunlight. Which fundamental theorem does this demonstrate?',
  },

  // 3. EEE: Power Systems & Three-Phase Synchronous Machines
  {
    topic: 'Three-Phase Transformers & Synchronous Alternators',
    keywords: ['transformer', 'synchronous', 'alternator', 'three phase', 'power factor', 'emf equation'],
    branch: 'eee',
    steps: [
      {
        stepNumber: 1,
        title: 'Rotating Magnetic Field (RMF) Generation',
        explanation: 'When balanced 3-phase currents displaced by 120° in time flow through balanced 3-phase windings displaced by 120° in space, they generate a resultant magnetic flux of constant magnitude (1.5 Φm) rotating at synchronous speed Ns.',
        keyRule: 'Synchronous speed: Ns = 120f / P (RPM).',
      },
      {
        stepNumber: 2,
        title: 'EMF Induced in Alternator Armature',
        explanation: 'As the DC-excited rotor poles sweep past stator slots, Faraday’s law induces sinusoidal alternating voltages. The induced EMF is modified by the distribution factor (Kd) and chording/pitch factor (Kp).',
        keyRule: 'E_phase = 4.44 × f × Φ × T_ph × Kp × Kd.',
      },
      {
        stepNumber: 3,
        title: 'Armature Reaction & Power Factor Effects',
        explanation: 'Armature current creates its own flux that distorts main field flux: Unity PF causes cross-magnetization; Lagging PF causes purely demagnetizing action (terminal voltage drops); Leading PF causes magnetizing action (terminal voltage rises, Ferranti effect).',
        keyRule: 'Synchronous Impedance: Zs = Ra + jXs = Ra + j(X_leakage + X_armature_reaction).',
      },
      {
        stepNumber: 4,
        title: 'Voltage Regulation in Power Grids',
        explanation: 'Voltage regulation represents percentage change in terminal voltage from full load to zero load at rated speed and excitation. Modern grids use Automatic Voltage Regulators (AVR) to modulate rotor field current.',
        keyRule: '% Regulation = ((|E_0| - |V_terminal|) / |V_terminal|) × 100.',
      },
    ],
    practicalExample: {
      title: 'Grid Synchronization of Thermal & Hydro Generators',
      industryDomain: 'Power Generation & Renewable Grid Integration',
      realWorldApplication: 'Synchronizing a 500 MW alternator onto the national grid using a synchroscope (matching voltage, frequency, phase sequence, and phase angle).',
      engineeringTradeoff: 'Under-excitation causes dynamic instability and pole slipping; over-excitation causes excessive rotor heating and insulation breakdown.',
      fieldCaseStudy: 'Wind farms use Doubly-Fed Induction Generators (DFIG) with 4-quadrant IGBT converters to inject reactive power and stabilize grid voltage during transmission line faults.',
    },
    formula: {
      equationName: 'Synchronous Machine Power-Angle Equation',
      equationLatex: 'P_{transferred} = \\frac{E_f V_t}{X_s} \\sin(\\delta)',
      physicalMeaning: 'Defines the electrical real power transferred from an alternator to an infinite bus as a function of the internal rotor angle delta.',
      variables: [
        { symbol: 'P', name: 'Real Electrical Power', unit: 'Megawatts (MW)', significance: 'Active power delivered to transmission line.' },
        { symbol: 'E_f', name: 'Excitation Back-EMF', unit: 'Volts (V)', significance: 'Internal generated voltage controlled by DC rotor current.' },
        { symbol: 'V_t', name: 'Terminal / Bus Voltage', unit: 'Volts (V)', significance: 'Grid voltage at generator terminals.' },
        { symbol: 'X_s', name: 'Synchronous Reactance', unit: 'Ohms (Ω)', significance: 'Combined armature reaction reactance and leakage reactance.' },
        { symbol: 'δ', name: 'Power / Rotor Angle', unit: 'Degrees or Radians', significance: 'Angular displacement between rotor magnetic axis and stator bus voltage.' },
      ],
      workedExample: {
        problemStatement: 'A 3-phase alternator with Xs = 8 Ω per phase has internal excitation Ef = 11 kV per phase and feeds an 11 kV grid bus. At maximum steady-state stability limit (δ = 90°), what is the peak power transferred per phase?',
        givenValues: 'Ef = 11,000 V, Vt = 11,000 V, Xs = 8 Ω, δ = 90°',
        stepByStepSolution: [
          'P_max = (Ef × Vt / Xs) × sin(90°).',
          'P_max = (11,000 × 11,000 / 8) × 1.0 = 121,000,000 / 8 = 15,125,000 Watts.',
          'Converting to MW: 15.125 MW per phase.',
          'Total 3-phase maximum power = 3 × 15.125 = 45.375 MW.',
        ],
        finalResult: 'Total 3-Phase P_max = 45.375 MW (Pull-out power limit).',
      },
    },
    understandingCheck: {
      question: 'What happens to the terminal voltage of an isolated alternator feeding a purely capacitive load (leading power factor)?',
      questionType: 'multiple_choice',
      options: [
        'Terminal voltage drops drastically due to demagnetizing armature reaction.',
        'Terminal voltage rises above the no-load EMF due to magnetizing armature reaction.',
        'Terminal voltage remains completely constant.',
        'The rotor immediately stalls.',
      ],
      correctOptionIndex: 1,
      explanation: 'With a leading power factor, armature current leads the induced EMF by 90°. This produces an MMF directly in phase with the main rotor field flux (magnetizing armature reaction), driving the terminal voltage higher than its open-circuit value.',
    },
    hintLadder: {
      problemContext: 'Why is short-circuit ratio (SCR) of an alternator an important stability parameter in power system design?',
      hints: [
        'Hint 1 (Definition): Recall that SCR is the ratio of field current for rated open-circuit voltage to field current for rated short-circuit armature current.',
        'Hint 2 (Reciprocal Relationship): SCR is roughly inversely proportional to the unsaturated synchronous reactance: SCR ≈ 1 / Xs.',
        'Hint 3 (Stability vs Cost): Does a high SCR mean a stiffer, more stable machine or a smaller, cheaper machine?',
      ],
      currentRevealedLevel: 0,
      fullSolution: 'SCR ≈ 1 / Xs(pu). A high SCR machine has a smaller synchronous reactance Xs, leading to a wider air gap, superior voltage regulation, higher steady-state power transfer capability (Pmax = Ef·Vt / Xs), and greater transient stability. However, it requires more copper, iron, and physical size, increasing manufacturing cost.',
    },
    vivaQuestion: 'What is the physical meaning of the dark lamp method during 3-phase alternator synchronization? What danger arises if phase sequence is reversed?',
  },

  // 4. MECH: Thermodynamics & Carnot / Rankine Power Cycles
  {
    topic: 'Second Law of Thermodynamics & Carnot / Rankine Cycles',
    keywords: ['carnot', 'rankine', 'thermodynamics', 'entropy', 'efficiency', 'steam turbine'],
    branch: 'mech',
    steps: [
      {
        stepNumber: 1,
        title: 'The Second Law & Heat Engines',
        explanation: 'Kelvin-Planck Statement: It is impossible for any device that operates on a thermodynamic cycle to receive heat from a single thermal reservoir and produce a net amount of work without rejecting heat to a low-temperature sink.',
        keyRule: 'Thermal Efficiency: η = W_net / Q_in = (Q_in - Q_out) / Q_in = 1 - (Q_out / Q_in).',
      },
      {
        stepNumber: 2,
        title: 'Carnot Reversible Cycle (Maximum Theoretical Limit)',
        explanation: 'Composed of 4 reversible processes: 1-2 Reversible Isothermal Heat Addition (TH), 2-3 Reversible Isentropic Expansion, 3-4 Reversible Isothermal Heat Rejection (TL), 4-1 Reversible Isentropic Compression.',
        keyRule: 'Carnot Efficiency: η_carnot = 1 - (T_L / T_H) [Temperatures MUST be in Kelvin!].',
      },
      {
        stepNumber: 3,
        title: 'The Practical Rankine Vapor Power Cycle',
        explanation: 'Real thermal power plants cannot execute Carnot compression on wet two-phase steam (damages compressor blades). The Rankine cycle condenses steam completely to liquid water at 3-4, pumping subcooled liquid with low work input into the boiler.',
        keyRule: 'Pump work: W_p = v_f × (P_boiler - P_condenser) is tiny compared to turbine expansion work W_t.',
      },
      {
        stepNumber: 4,
        title: 'Superheating & Reheat Modifications',
        explanation: 'Superheating steam before the high-pressure turbine and reheating between stages prevents moisture content from exceeding 10–12% at the turbine exhaust, protecting blades from droplet erosion while boosting cycle thermal efficiency.',
        keyRule: 'Exhaust steam quality (x) must strictly be maintained above 0.88 to prevent blade pitting.',
      },
    ],
    practicalExample: {
      title: 'Ultra-Supercritical Thermal Power Plant (600°C / 300 Bar)',
      industryDomain: 'Power Generation & Turbomachinery Engineering',
      realWorldApplication: 'Modern coal/gas Rankine plants operate above the thermodynamic critical point of water (22.06 MPa, 374°C) with no phase change transition interface.',
      engineeringTradeoff: 'Higher boiler temperature boosts Carnot efficiency but causes high-temperature creep and requires expensive nickel-chromium superalloys (Inconel 617).',
      fieldCaseStudy: 'Adani Mundra 4000 MW plant utilized supercritical reheat boilers, elevating thermal efficiency from typical 33% subcritical cycles up to 41.5%, saving 540,000 tonnes of coal annually.',
    },
    formula: {
      equationName: 'Rankine Cycle Thermal Efficiency & Net Specific Work',
      equationLatex: '\\eta_{th} = \\frac{W_{net}}{Q_{in}} = \\frac{(h_1 - h_2) - (h_4 - h_3)}{h_1 - h_4}',
      physicalMeaning: 'Computes net power plant cycle efficiency by subtracting feedwater pump work from turbine expansion work and dividing by boiler enthalpy addition.',
      variables: [
        { symbol: 'h_1', name: 'Turbine Inlet Enthalpy', unit: 'kJ / kg', significance: 'Superheated steam energy entering high-pressure turbine.' },
        { symbol: 'h_2', name: 'Turbine Exhaust Enthalpy', unit: 'kJ / kg', significance: 'Expanded steam energy leaving turbine into condenser.' },
        { symbol: 'h_3', name: 'Condenser Outlet Enthalpy (saturated liquid)', unit: 'kJ / kg', significance: 'Liquid water enthalpy at condenser saturation pressure.' },
        { symbol: 'h_4', name: 'Boiler Inlet Enthalpy', unit: 'kJ / kg', significance: 'Subcooled water energy after boiler feedwater pump compression.' },
      ],
      workedExample: {
        problemStatement: 'In a simple Rankine steam plant: h1 = 3200 kJ/kg, h2 = 2100 kJ/kg, h3 = 190 kJ/kg, and pump work (h4 - h3) is 5 kJ/kg (so h4 = 195 kJ/kg). Calculate the cycle thermal efficiency.',
        givenValues: 'h1 = 3200, h2 = 2100, h3 = 190, h4 = 195 (all in kJ/kg)',
        stepByStepSolution: [
          'Turbine Work W_t = h1 - h2 = 3200 - 2100 = 1100 kJ/kg.',
          'Pump Work W_p = h4 - h3 = 195 - 190 = 5 kJ/kg.',
          'Net Work W_net = W_t - W_p = 1100 - 5 = 1095 kJ/kg.',
          'Boiler Heat Input Q_in = h1 - h4 = 3200 - 195 = 3005 kJ/kg.',
          'Thermal Efficiency η = W_net / Q_in = 1095 / 3005 = 0.3644 (36.44%).',
        ],
        finalResult: 'Cycle Thermal Efficiency = 36.44%.',
      },
    },
    understandingCheck: {
      question: 'Why can the Carnot cycle never be practically realized in a real steam thermal power plant?',
      questionType: 'multiple_choice',
      options: [
        'Because water cannot evaporate into steam.',
        'Because isentropic compression of a two-phase wet mixture rapidly erodes and destroys the compressor.',
        'Because steam turbines cannot handle high pressures.',
        'Because Carnot cycles violate the First Law of Thermodynamics.',
      ],
      correctOptionIndex: 1,
      explanation: 'In the Carnot vapor cycle, state 4-1 requires compressing a low-quality two-phase mixture of water droplets and vapor to saturated liquid. Liquid droplet impingement mechanically damages compressor impellers, and controlling two-phase condensation is practically unfeasible.',
    },
    hintLadder: {
      problemContext: 'A proposed perpetual motion machine inventor claims an engine receives 100 kW heat at 600 K, produces 65 kW net mechanical work, and dumps remaining heat at 300 K. Disprove this claim rigorously.',
      hints: [
        'Hint 1 (Carnot Upper Bound): Calculate the maximum theoretical efficiency any heat engine could possibly achieve between 600 K and 300 K.',
        'Hint 2 (Claimed Efficiency): What is the claimed thermal efficiency? Divide 65 kW by 100 kW.',
        'Hint 3 (Comparison): Compare the claimed efficiency against the Carnot ceiling. Does it violate the Clausius Inequality or 2nd Law?',
      ],
      currentRevealedLevel: 0,
      fullSolution: 'Disproof: Maximum possible Carnot efficiency η_max = 1 - (TL / TH) = 1 - (300 / 600) = 50.0% (0.50). The inventor claims η_actual = W / Qin = 65 kW / 100 kW = 65.0%. Since 65% > 50%, the device claims to exceed reversible Carnot efficiency between the specified reservoirs, which violates the Second Law of Thermodynamics (Kelvin-Planck statement / Perpetual Motion Machine of the 2nd Kind, PMM-2). It is physically impossible.',
    },
    vivaQuestion: 'Define Entropy from a microscopic statistical mechanics perspective vs macroscopic classical thermodynamics. What is Clausius theorem?',
  },

  // 5. CIVIL: Structural Mechanics & Bending Stress in Beams
  {
    topic: 'Flexure Formula & Bending Moment in Beams',
    keywords: ['bending', 'flexure', 'beam', 'moment of inertia', 'shear force', 'neutral axis'],
    branch: 'civil',
    steps: [
      {
        stepNumber: 1,
        title: 'Euler-Bernoulli Beam Assumptions',
        explanation: 'Assumes transverse sections perpendicular to the longitudinal axis remain plane and perpendicular after bending (plane sections remain plane). Material is homogeneous, isotropic, and obeys Hooke’s law within proportional elastic limits.',
        keyRule: 'Strain varies linearly across depth, passing through zero at the Neutral Axis (NA).',
      },
      {
        stepNumber: 2,
        title: 'The Neutral Axis & Section Modulus',
        explanation: 'The neutral axis passes directly through the centroid of the cross-section. Fibers on one side of the NA undergo longitudinal compression; fibers on the opposite side undergo longitudinal tension.',
        keyRule: 'Section Modulus: Z = I / y_max, where I is area moment of inertia about the NA.',
      },
      {
        stepNumber: 3,
        title: 'The Universal Flexure Bending Equation',
        explanation: 'Relates bending moment (M), cross-sectional moment of inertia (I), normal bending stress (σ), distance from neutral axis (y), Young’s modulus of elasticity (E), and radius of curvature (R).',
        keyRule: 'M / I = σ / y = E / R.',
      },
      {
        stepNumber: 4,
        title: 'I-Section Efficiency & Flange vs Web Roles',
        explanation: 'In structural steel I-beams (Universal Beams / ISMB), the thick wide flanges located far from the neutral axis resist 85%+ of the bending moment (tension & compression), while the thin vertical web resists vertical transverse shear force.',
        keyRule: 'Maximizing Moment of Inertia (I) for minimum steel weight is why I-beams dominate structural framing.',
      },
    ],
    practicalExample: {
      title: 'High-Rise Steel Frame Girders & Highway Flyovers',
      industryDomain: 'Structural & Bridge Engineering',
      realWorldApplication: 'Sizing reinforced concrete (RCC) T-beams and structural steel girders for highway overpasses under heavy truck tandem axle loads.',
      engineeringTradeoff: 'Deeper beams increase Moment of Inertia (I ∝ d³) drastically reducing bending stress and deflection, but consume vertical architectural ceiling clearance.',
      fieldCaseStudy: 'Bandra-Worli Sea Link cable-stayed bridge utilizes pre-stressed concrete box girders whose hollow geometry provides immense torsional rigidity and section modulus Z against ocean gale winds.',
    },
    formula: {
      equationName: 'Euler-Bernoulli Beam Flexure Formula',
      equationLatex: '\\frac{M}{I} = \\frac{\\sigma}{y} = \\frac{E}{R} \\implies \\sigma_{max} = \\frac{M_{max}}{Z}',
      physicalMeaning: 'Computes maximum compressive or tensile flexural stress in a structural beam cross-section subjected to transverse bending loads.',
      variables: [
        { symbol: 'M', name: 'Bending Moment', unit: 'Newton-meters (N·m or kN·m)', significance: 'Resultant internal moment caused by external transverse loads.' },
        { symbol: 'I', name: 'Area Moment of Inertia', unit: 'm⁴ or mm⁴', significance: 'Second moment of area resisting bending about neutral centroidal axis.' },
        { symbol: 'σ', name: 'Bending Stress', unit: 'Pascals (N/m² or MPa)', significance: 'Normal stress induced in longitudinal beam fibers.' },
        { symbol: 'y', name: 'Distance from Neutral Axis', unit: 'Meters (m or mm)', significance: 'Distance from neutral axis centroid to extreme fiber.' },
        { symbol: 'Z', name: 'Section Modulus', unit: 'm³ or mm³', significance: 'Geometric ratio I / y_max indicating flexural strength capacity.' },
      ],
      workedExample: {
        problemStatement: 'A simply supported rectangular timber beam of width b = 150 mm and depth d = 300 mm carries a maximum bending moment M = 45 kN·m. Determine the maximum bending stress induced in the outer fibers.',
        givenValues: 'b = 150 mm, d = 300 mm, M = 45 kN·m = 45 × 10⁶ N·mm',
        stepByStepSolution: [
          'Moment of inertia I = (b × d³) / 12 = (150 × 300³) / 12 = 337,500,000 mm⁴.',
          'Distance to extreme fiber y_max = d / 2 = 300 / 2 = 150 mm.',
          'Section Modulus Z = I / y_max = 337,500,000 / 150 = 2,250,000 mm³.',
          'Maximum stress σ_max = M / Z = (45 × 10⁶ N·mm) / (2,250,000 mm³) = 20.0 N/mm² (20.0 MPa).',
        ],
        finalResult: 'σ_max = 20.0 MPa (Compression at top fiber, Tension at bottom fiber).',
      },
    },
    understandingCheck: {
      question: 'Where is the bending stress zero in a homogeneous symmetric beam subjected to pure positive bending?',
      questionType: 'multiple_choice',
      options: [
        'At the extreme top compressive fiber.',
        'At the extreme bottom tensile fiber.',
        'Along the central Neutral Axis (NA) passing through the centroid.',
        'At the point of maximum shear force.',
      ],
      correctOptionIndex: 2,
      explanation: 'At the neutral surface, fibers undergo zero longitudinal elongation and zero compression (strain ε = 0). Since stress σ = E · ε, the bending stress is identically zero along the neutral axis.',
    },
    hintLadder: {
      problemContext: 'Why is an I-beam significantly stronger in bending than a solid square steel bar of identical cross-sectional area and weight?',
      hints: [
        'Hint 1 (Flexure Formula): Remember that σ = M · y / I. To minimize stress, we must maximize I for a given area.',
        'Hint 2 (Moment of Inertia Definition): What is the mathematical definition of Area Moment of Inertia? I = ∫ y² dA.',
        'Hint 3 (Mass Distribution): Notice the y² term. Where is material placed in an I-beam compared to a solid bar?',
      ],
      currentRevealedLevel: 0,
      fullSolution: 'Area Moment of Inertia is defined as I = ∫ y² dA. Because distance y from the neutral axis is squared, material positioned far away from the centroid contributes exponentially more to resisting bending. In an I-beam, the bulk of the steel cross-sectional area is concentrated in the wide top and bottom flanges at maximum distance y. A square bar clusters mass near the neutral axis where y is small, resulting in a much lower moment of inertia for the exact same steel tonnage.',
    },
    vivaQuestion: 'Draw the shear stress distribution across the depth of a rectangular beam vs an I-beam. Where is shear stress maximum in both?',
  },

  // 6. AI/DS: Backpropagation & Gradient Descent in Neural Networks
  {
    topic: 'Backpropagation & Loss Optimization in Neural Networks',
    keywords: ['neural network', 'backpropagation', 'gradient descent', 'loss', 'activation', 'chain rule'],
    branch: 'aids',
    steps: [
      {
        stepNumber: 1,
        title: 'Forward Propagation & Loss Computation',
        explanation: 'Input vector x passes through hidden layers via linear matrix transformations z = Wx + b followed by non-linear activations a = σ(z). The scalar Loss L(y, ŷ) measures prediction divergence from ground truth.',
        keyRule: 'Non-linear activations (ReLU, GeLU, Sigmoid) are essential to prevent deep networks from collapsing into a single linear matrix.',
      },
      {
        stepNumber: 2,
        title: 'Multivariable Calculus Chain Rule',
        explanation: 'Backpropagation computes the partial derivative of the loss with respect to every individual weight (∂L/∂W) by propagating error gradients backwards from the final output layer using the calculus chain rule.',
        keyRule: '∂L/∂W = (∂L/∂ŷ) × (∂ŷ/∂z) × (∂z/∂W).',
      },
      {
        stepNumber: 3,
        title: 'Vanishing & Exploding Gradients',
        explanation: 'In deep networks using saturating activations (Sigmoid or Tanh), derivative outputs lie between 0 and 0.25. Repeated matrix chain multiplications cause gradients to exponentially decay toward zero in early layers.',
        keyRule: 'ReLU activation (derivative = 1 for z > 0) and Residual Skip Connections (ResNets) eliminate vanishing gradients.',
      },
      {
        stepNumber: 4,
        title: 'Gradient Descent & Adaptive Optimizers (Adam/SGD)',
        explanation: 'Weights update in the negative gradient direction scaled by learning rate η: W_new = W_old - η(∂L/∂W). Modern optimizers (Adam) maintain first (momentum) and second (RMSprop) moving moments of gradients.',
        keyRule: 'Weight update: W_t = W_{t-1} - (η / (sqrt(v_t) + ε)) × m_t.',
      },
    ],
    practicalExample: {
      title: 'Training Transformer LLMs (DeepSeek & GPT Architectures)',
      industryDomain: 'Generative AI & Large Language Models',
      realWorldApplication: 'Distributed FP16/BF16 mixed-precision backpropagation across clusters of 10,000+ NVIDIA H100 GPUs using Megatron-LM tensor parallelism.',
      engineeringTradeoff: 'Higher learning rate accelerates convergence but risks loss divergence and catastrophic numerical instability; lower rate gets trapped in saddle points.',
      fieldCaseStudy: 'PyTorch ZeRO-3 (DeepSpeed) partitions optimizer states, gradients, and model parameters across GPU memory nodes during backward passes, enabling 70B parameter models to fit on consumer hardware.',
    },
    formula: {
      equationName: 'Gradient Descent Weight Update with Calculus Chain Rule',
      equationLatex: 'W^{(l)} \\leftarrow W^{(l)} - \\eta \\frac{\\partial \\mathcal{L}}{\\partial W^{(l)}} \\quad \\text{where} \\quad \\frac{\\partial \\mathcal{L}}{\\partial W^{(l)}} = \\delta^{(l)} (a^{(l-1)})^T',
      physicalMeaning: 'Iteratively adjusts neural network parameters in direction of steepest descent to minimize empirical prediction error.',
      variables: [
        { symbol: 'W^(l)', name: 'Weight Tensor at Layer l', unit: 'Dimensionless parameter matrix', significance: 'Synaptic connection weights between neurons.' },
        { symbol: 'η', name: 'Learning Rate', unit: 'Dimensionless hyperparameter (e.g. 0.001)', significance: 'Step size taken in gradient landscape per iteration.' },
        { symbol: 'L', name: 'Loss Function', unit: 'Scalar error value', significance: 'Objective function (e.g. Cross-Entropy or Mean Squared Error).' },
        { symbol: 'δ^(l)', name: 'Backpropagated Error Signal', unit: 'Gradient vector', significance: 'Local error delta at layer l: ∂L / ∂z^(l).' },
        { symbol: 'a^(l-1)', name: 'Activation Vector', unit: 'Neuron output vector', significance: 'Activations feeding forward from preceding layer.' },
      ],
      workedExample: {
        problemStatement: 'In a single neuron with weight W = 2.0, input x = 3.0, target y = 1.0, and squared error loss L = 0.5(Wx - y)², with learning rate η = 0.01. Calculate the new weight after 1 step.',
        givenValues: 'W = 2.0, x = 3.0, y = 1.0, η = 0.01, z = W·x = 6.0',
        stepByStepSolution: [
          'Prediction ŷ = W × x = 2.0 × 3.0 = 6.0.',
          'Error = (ŷ - y) = 6.0 - 1.0 = 5.0.',
          'Gradient ∂L/∂W = (ŷ - y) × x = 5.0 × 3.0 = 15.0.',
          'Weight update ΔW = -η × (∂L/∂W) = -0.01 × 15.0 = -0.15.',
          'W_new = W_old + ΔW = 2.0 - 0.15 = 1.85.',
        ],
        finalResult: 'W_new = 1.85 (Weight lowered to bring prediction closer to target 1.0).',
      },
    },
    understandingCheck: {
      question: 'What happens if all weights in a deep neural network are initialized to exact zero before training begins?',
      questionType: 'multiple_choice',
      options: [
        'The network trains twice as fast because initial loss is zero.',
        'Symmetry cannot be broken: all neurons in a layer compute identical outputs and receive identical gradients.',
        'The loss immediately overflows to infinity.',
        'The learning rate automatically increases.',
      ],
      correctOptionIndex: 1,
      explanation: 'With zero initialization, every hidden neuron receives the exact same inputs and computes the exact same forward activation. During backpropagation, all hidden neurons receive identical gradient updates, acting as a single neuron regardless of layer width (the symmetry problem). He or Xavier random initialization is required to break symmetry.',
    },
    hintLadder: {
      problemContext: 'During training of an 80-layer neural network with Sigmoid activations, early layers stop learning completely while late layers still update. Diagnose and propose an architectural fix.',
      hints: [
        'Hint 1 (Derivative Value): What is the maximum value of the derivative of the Sigmoid function σ\'(z)? Recall σ(z)(1 - σ(z)).',
        'Hint 2 (Chain Multiplication): If you multiply 0.25 by itself 50 times across 50 layers, what does the gradient approach?',
        'Hint 3 (Modern Solution): Which piecewise linear activation function has a constant derivative of 1.0 for positive inputs?',
      ],
      currentRevealedLevel: 0,
      fullSolution: 'Diagnosis: The network is suffering from the Vanishing Gradient Problem. The derivative of the Sigmoid function peaks at 0.25. When 80 layers are chained together in backpropagation, the product (0.25)^80 ≈ 10^(-48) vanishes to floating-point zero before reaching the initial layers. Fix: Replace Sigmoid with ReLU (Rectified Linear Unit, whose derivative is 1.0 for all z > 0), introduce Batch Normalization layers, and add Residual Skip Connections (ResNet).' ,
    },
    vivaQuestion: 'Explain the mathematical difference between Stochastic Gradient Descent (SGD), Mini-batch Gradient Descent, and Adam optimizer with momentum and RMSprop moments.',
  },
];

// Helper to format text tailored to Teaching Style persona
function formatPersonaIntro(style: TeachingStyle, branch: EngineeringBranch, semester: Semester, topic: string): string {
  const branchName = branch.toUpperCase();
  switch (style) {
    case 'friendly':
      return `Hello! 😊 I'm so glad you're exploring **${topic}**. Engineering in Semester ${semester} (${branchName}) has some exciting concepts, and together we're going to break this down easily. No worries at all—you've got this! Let's take it one simple step at a time.`;
    case 'detailed':
      return `Welcome, Engineer. Today we conduct a rigorous first-principles analysis of **${topic}** tailored for Semester ${semester} ${branchName}. We will examine the underlying theoretical architecture, mathematical formulations, and critical boundary conditions.`;
    case 'exam':
      return `📌 **High-Yield Exam Alert!** **${topic}** is a staple question in Semester ${semester} ${branchName} university exams (frequently asked as a 10-mark essay or 5-mark short note with circuit/block diagram). Here is exactly how to structure your answer for maximum marks.`;
    case 'viva':
      return `⚠️ **Viva Voce Session Initialized.** You are facing the external viva panel for Semester ${semester} ${branchName} lab. I expect precise technical terminology, exact SI units, and zero hand-waving on **${topic}**. Listen carefully to the prompt and state your reasoning clearly.`;
    case 'beginner':
      return `Hey there! 🚀 Forget the scary engineering textbooks for a minute. Let's look at **${topic}** using everyday things you already know (like water pipes, traffic lights, and delivery trucks). Once you see the intuition, the math will feel like second nature!`;
  }
}

// Heuristic matching against curated database or dynamic generation
export function generateTeacherResponse(params: GenerateTeacherResponseParams): TeacherMessage {
  const { studentQuery, style, branch, semester, actionType, activeHintLadder } = params;

  // Handle Progressive Hint Action
  if (actionType === 'request_hint' && activeHintLadder) {
    const nextLevel = Math.min(activeHintLadder.currentRevealedLevel + 1, 4);
    const updatedLadder: ProgressiveHintLadder = {
      ...activeHintLadder,
      currentRevealedLevel: nextLevel,
    };

    let hintContent = '';
    if (nextLevel === 1) {
      hintContent = `💡 **Hint Level 1 (Intuition):**\n${activeHintLadder.hints[0]}\n\n*Try thinking about this first! If you need the next hint with the formula, click "Need Next Hint".*`;
    } else if (nextLevel === 2) {
      hintContent = `💡 **Hint Level 2 (Formula & Tool):**\n${activeHintLadder.hints[1]}\n\n*Now see if you can plug in the values. If you're still stuck, click "Need Next Hint" for the calculation step.*`;
    } else if (nextLevel === 3) {
      hintContent = `💡 **Hint Level 3 (Key Step):**\n${activeHintLadder.hints[2]}\n\n*You are right at the finish line! Try calculating the final answer, or click "Reveal Full Solution" if you want the complete walkthrough.*`;
    } else {
      hintContent = `✅ **Complete Worked Solution:**\n\n${activeHintLadder.fullSolution}`;
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'teacher',
      style,
      content: hintContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hintLadder: updatedLadder,
      speechText: hintContent.replace(/[*#`_]/g, ''),
    };
  }

  // Find best match in Curated Knowledge Base
  const lowerQuery = studentQuery.toLowerCase();
  const matched =
    CURATED_ENGINEERING_KNOWLEDGE.find(
      (k) =>
        k.branch === branch ||
        k.keywords.some((kw) => lowerQuery.includes(kw)) ||
        lowerQuery.includes(k.topic.toLowerCase())
    ) || CURATED_ENGINEERING_KNOWLEDGE[0];

  const intro = formatPersonaIntro(style, branch, semester, matched.topic);

  // If student asks for specific mode (Formula / Practical Example / Steps / Viva)
  let content = `${intro}\n\nHere is your comprehensive breakdown of **${matched.topic}**:`;
  let steps: StepExplanation[] | undefined = matched.steps;
  let practicalExample: PracticalEngineeringExample | undefined = matched.practicalExample;
  let formula: FormulaBreakdown | undefined = matched.formula;
  let understandingCheck: UnderstandingCheck | undefined = matched.understandingCheck;
  let hintLadder: ProgressiveHintLadder | undefined = { ...matched.hintLadder, currentRevealedLevel: 0 };
  let vivaScore = undefined;

  if (style === 'viva' || actionType === 'viva_challenge') {
    content = `${intro}\n\n🎯 **Your Viva Challenge:**\n"${matched.vivaQuestion}"\n\nTake a deep breath and answer concisely. I will evaluate your technical precision and assign your viva score!`;
  } else if (actionType === 'formula_breakdown') {
    content = `${intro}\n\n📐 **Formula Deep Dive:** Let's examine the mathematical foundation of **${matched.formula.equationName}** and work through an actual engineering numerical:`;
  } else if (actionType === 'practical_example') {
    content = `${intro}\n\n⚙️ **Real-World Engineering Application:** Here is how **${matched.practicalExample.title}** works in modern production industry:`;
  } else if (actionType === 'step_by_step') {
    content = `${intro}\n\n🪜 **Step-by-Step Architecture:** Let's trace each phase in precise chronological sequence:`;
  }

  // Voice speech text: natural reading version
  const speechText = `${intro.replace(/[*#`_]/g, '')} Let us examine ${matched.topic}. First, ${matched.steps[0].title}: ${matched.steps[0].explanation} Next, practical application: ${matched.practicalExample.title} in ${matched.practicalExample.industryDomain}.`;

  return {
    id: `msg-${Date.now()}`,
    sender: 'teacher',
    style,
    content,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    steps,
    practicalExample,
    formula,
    understandingCheck,
    hintLadder,
    vivaScore,
    speechText,
  };
}

export const QUICK_START_TOPICS: { title: string; branch: EngineeringBranch; semester: Semester; query: string }[] = [
  {
    title: 'Virtual Memory & Paging',
    branch: 'cse',
    semester: 4,
    query: 'Explain Virtual Memory, Paging, and how the TLB cache works step by step.',
  },
  {
    title: 'Nyquist Sampling & Aliasing',
    branch: 'ece',
    semester: 5,
    query: 'Explain the Nyquist Sampling Theorem, Aliasing foldover, and why we need analog anti-aliasing filters.',
  },
  {
    title: 'Synchronous Alternators & Power Angle',
    branch: 'eee',
    semester: 4,
    query: 'Explain 3-Phase Alternator rotating magnetic field and the power-angle equation P = (Ef*Vt/Xs)*sin(delta).',
  },
  {
    title: 'Carnot & Rankine Power Cycles',
    branch: 'mech',
    semester: 3,
    query: 'Compare the Carnot cycle with practical Rankine steam power cycle and explain cycle thermal efficiency.',
  },
  {
    title: 'Beam Flexure Formula & I-Section',
    branch: 'civil',
    semester: 3,
    query: 'Explain the Euler-Bernoulli beam flexure formula M/I = sigma/y and why I-beams resist bending so efficiently.',
  },
  {
    title: 'Neural Network Backpropagation',
    branch: 'aids',
    semester: 4,
    query: 'Explain how Backpropagation calculates gradients using the multivariable calculus chain rule.',
  },
];
