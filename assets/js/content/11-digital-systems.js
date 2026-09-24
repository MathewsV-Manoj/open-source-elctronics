COURSE.push({
  id: "digital2",
  title: "Digital Systems Design",
  tagline: "Counters, state machines, memory, ADCs/DACs and FPGAs — how logic becomes real products.",
  icon: "🧮",
  level: "Intermediate",
  lessons: [
    {
      id: "counters",
      title: "Counters and shift registers",
      minutes: 8,
      body: `
<p class="lead">Chain flip-flops together (Module 5) and they start doing useful jobs: counting events, dividing clocks and moving data one bit at a time.</p>
<h2>Counters</h2>
<p>An <b>n-bit counter</b> steps through 2<sup>n</sup> states: a 4-bit counter goes 0000 → 0001 → … → 1111 and wraps to 0000.</p>
<ul>
  <li><b>Ripple (asynchronous)</b>: each flip-flop is clocked by the previous one. Simple, but the delays add up, so outputs briefly glitch.</li>
  <li><b>Synchronous</b>: every flip-flop shares one clock and changes together. This is what real designs use.</li>
  <li><b>Mod-N counter</b>: resets after N states. A mod-10 (decade) counter drives each digit of a digital clock.</li>
</ul>
${H.key(`<p>Each flip-flop in a ripple counter toggles at half the rate of the one before it. So a counter is also a <b>frequency divider</b>: a 16 MHz clock through 4 stages gives 1 MHz.</p>`)}
<h2>Shift registers</h2>
<p>Flip-flops in a line, each passing its bit to the next on every clock edge.</p>
${H.table(["Type", "What it does", "Real use"], [
  ["SIPO (serial in, parallel out)", "Receives bits one by one, outputs them all at once", "74HC595: drive 8 LEDs from 3 Arduino pins"],
  ["PISO (parallel in, serial out)", "Loads 8 bits at once, sends them one by one", "74HC165: read 8 buttons with 3 pins"],
  ["Ring / Johnson counter", "Circulates a pattern", "Sequencers, LED chasers"],
])}
${H.fact(`<p>UART and SPI (Module 7) are built on shift registers. The transmitter is PISO; the receiver is SIPO.</p>`)}
`,
    },
    {
      id: "fsm",
      title: "Finite state machines",
      minutes: 9,
      body: `
<p class="lead">A <strong>finite state machine (FSM)</strong> is a circuit that remembers which "state" it is in and moves to the next one based on its inputs. Traffic lights, vending machines, lifts and communication protocols are all FSMs.</p>
<h2>Three ingredients</h2>
${H.steps([
  "<b>States</b> — the situations the system can be in (e.g. RED, GREEN, YELLOW).",
  "<b>Transitions</b> — rules for moving between states (e.g. after 30 s in GREEN, go to YELLOW).",
  "<b>Outputs</b> — what the system does in each state (e.g. turn on the green lamp).",
])}
<div class="figure">
<svg viewBox="0 0 420 150" role="img" aria-label="State diagram: RED to GREEN to YELLOW and back to RED">
  <circle cx="70" cy="75" r="42" fill="none" class="stroke-fg" stroke-width="2"/><text x="70" y="80" text-anchor="middle" class="svg-label">RED</text>
  <circle cx="210" cy="75" r="42" fill="none" class="stroke-fg" stroke-width="2"/><text x="210" y="80" text-anchor="middle" class="svg-label">GREEN</text>
  <circle cx="350" cy="75" r="42" fill="none" class="stroke-fg" stroke-width="2"/><text x="350" y="80" text-anchor="middle" class="svg-label">YELLOW</text>
  <line x1="112" y1="65" x2="168" y2="65" class="stroke-accent" stroke-width="2"/><polygon points="168,60 178,65 168,70" class="fill-accent"/>
  <line x1="252" y1="65" x2="308" y2="65" class="stroke-accent" stroke-width="2"/><polygon points="308,60 318,65 308,70" class="fill-accent"/>
  <path d="M350 117 Q210 175 70 117" fill="none" class="stroke-accent" stroke-width="2"/><polygon points="76,112 66,114 72,122" class="fill-accent"/>
  <text x="140" y="55" text-anchor="middle" class="svg-small">timer</text><text x="280" y="55" text-anchor="middle" class="svg-small">timer</text><text x="210" y="145" text-anchor="middle" class="svg-small">timer</text>
</svg>
<figcaption>A state diagram: circles are states, arrows are transitions.</figcaption>
</div>
<h2>Moore vs Mealy</h2>
${H.table(["", "Moore machine", "Mealy machine"], [
  ["Outputs depend on", "Current state only", "Current state and current inputs"],
  ["Response", "One clock later, but glitch-free", "Immediate, but can glitch"],
  ["Typical use", "Traffic lights, sequencers", "Protocol detectors, fast control"],
])}
<p>In hardware, an FSM is a <b>state register</b> (flip-flops holding the current state) plus <b>combinational logic</b> that computes the next state and the outputs. You'll write one in Verilog in the VLSI projects.</p>
${H.gate(`<p>"Sequence detector" FSMs (e.g. detect 1011 in a bit stream) and counting the minimum number of states are classic GATE Digital questions.</p>`)}
`,
    },
    {
      id: "memory",
      title: "Memory: where data lives",
      minutes: 7,
      body: `
<p class="lead">Every digital system needs to store data. Different memories trade off speed, size, cost and whether they forget when the power goes off.</p>
${H.table(["Memory", "Volatile?", "Speed", "Where you find it"], [
  ["Registers / flip-flops", "Yes", "Fastest", "Inside the CPU"],
  ["SRAM (6 transistors per bit)", "Yes", "Very fast", "CPU caches, microcontroller RAM"],
  ["DRAM (1 transistor + 1 capacitor per bit)", "Yes, must be refreshed", "Fast", "Laptop and phone main memory"],
  ["Flash (NOR / NAND)", "No", "Slower to write", "Program storage, SSDs, pen drives"],
  ["EEPROM", "No", "Slow", "Small settings in microcontrollers"],
])}
${H.analogy(`<p>Registers are what you hold in your hand, cache is your desk, RAM is the bookshelf in your room, and flash is the library across town. The closer it is, the faster you reach it, and the less space there is.</p>`)}
<h2>How a memory chip is organised</h2>
<p>A memory is a grid of cells. An <b>address decoder</b> (Module 5) turns the address bits into one selected row. With n address lines you can select 2<sup>n</sup> locations: 16 address lines → 65,536 locations.</p>
${H.formula("Size = 2<sup>address lines</sup> × data width", "16 address lines, 8-bit data → 64 KB")}
${H.fact(`<p>DRAM capacitors leak their charge in milliseconds, so the memory controller silently re-reads and rewrites every row about every 64 ms. That's what "dynamic" means.</p>`)}
`,
    },
    {
      id: "adc-fpga",
      title: "ADCs, DACs and FPGAs",
      minutes: 9,
      body: `
<p class="lead">Two final bridges: converters connect the digital world to the analog one, and FPGAs let you build your own digital hardware without making a chip.</p>
<h2>ADC: analog → digital</h2>
<p>You used a 10-bit ADC on the Arduino (Module 6). Two numbers describe any ADC:</p>
<ul>
  <li><b>Resolution</b> (bits): how finely it splits the range. Step size = V<sub>ref</sub> ÷ 2<sup>n</sup>.</li>
  <li><b>Sampling rate</b>: how many conversions per second. It must be more than twice the highest frequency in the signal (the <b>Nyquist rate</b> — see the Communication branch).</li>
</ul>
${H.table(["ADC type", "Speed", "Resolution", "Used in"], [
  ["Flash", "Fastest (GHz)", "Low (6–8 bit)", "Oscilloscopes, radar"],
  ["SAR (successive approximation)", "Medium", "10–18 bit", "Microcontrollers, data acquisition"],
  ["Sigma-delta (ΣΔ)", "Slow", "Very high (24 bit)", "Audio, weighing scales, precision sensors"],
])}
<h2>DAC: digital → analog</h2>
<p>A DAC turns numbers back into voltages: the sound from your phone passes through one. The classic design is the <b>R-2R ladder</b>, which uses only two resistor values.</p>
<h2>FPGA: hardware you can reprogram</h2>
<p>An <b>FPGA</b> (Field-Programmable Gate Array) is a chip full of small lookup tables, flip-flops and wiring switches. You write Verilog, and the tools configure those blocks into <i>your</i> circuit.</p>
${H.table(["", "Microcontroller", "FPGA", "ASIC (custom chip)"], [
  ["You write", "Software (C)", "Hardware (Verilog/VHDL)", "Hardware (Verilog/VHDL)"],
  ["Runs", "One instruction at a time", "Everything in parallel", "Everything in parallel"],
  ["Change it later?", "Yes", "Yes, reconfigure anytime", "No — fixed at the factory"],
  ["Cost for 1 unit", "Low", "Medium", "Crores (masks), cheap only in huge volume"],
])}
${H.key(`<p>Chip companies prototype new designs on FPGAs before paying for fabrication. Radar, 5G base stations and defence systems ship FPGAs directly, because the design can be updated in the field.</p>`)}
`,
    },
  ],
  quiz: [
    { q: "A 4-bit ripple counter clocked at 16 MHz. What frequency comes out of the last flip-flop?", options: ["4 MHz", "1 MHz", "64 MHz", "16 MHz"], answer: 1, why: "Each stage divides by 2: 16 → 8 → 4 → 2 → 1 MHz." },
    { q: "In a Moore machine, outputs depend on…", options: ["Inputs only", "The current state only", "State and inputs", "The clock frequency"], answer: 1, why: "Moore outputs depend only on the current state; Mealy outputs also use the inputs." },
    { q: "Which memory needs regular refreshing?", options: ["SRAM", "Flash", "DRAM", "EEPROM"], answer: 2, why: "DRAM stores bits on tiny capacitors that leak, so it must be refreshed." },
    { q: "How many locations can 12 address lines select?", options: ["12", "144", "1024", "4096"], answer: 3, why: "2^12 = 4096." },
    { q: "Why prototype a new chip design on an FPGA first?", options: ["FPGAs are faster than ASICs", "It can be reconfigured, so bugs can be fixed before paying for fabrication", "FPGAs don't need Verilog", "FPGAs use less power"], answer: 1, why: "Fabricating an ASIC is very expensive and permanent; an FPGA can be reprogrammed." },
  ],
});
