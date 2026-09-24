COURSE.push({
  id: "vlsi",
  title: "VLSI: Electronics on a Chip",
  tagline: "How billions of transistors are designed, verified and built into silicon.",
  icon: "💎",
  level: "Intermediate → Advanced",
  lessons: [
    {
      id: "intro",
      title: "What is VLSI?",
      minutes: 6,
      body: `
<p class="lead"><strong>VLSI — Very Large Scale Integration</strong> — is the art of putting millions to billions of transistors on a single chip. Every processor, phone SoC, GPU and AI accelerator is a VLSI chip.</p>
${H.table(["Era", "Transistors per chip", "Example"], [
  ["SSI (1960s)", "~10", "A few logic gates"],
  ["MSI", "~100s", "Counters, adders"],
  ["LSI (1970s)", "~10,000s", "Intel 4004 CPU (2,300)"],
  ["VLSI (1980s →)", "Millions +", "Pentium, ARM cores"],
  ["Today", "10–100+ billion", "Apple M-series, NVIDIA GPUs"],
])}
<h2>Moore's law</h2>
<p>In 1965 Gordon Moore observed that the number of transistors on a chip <b>doubles roughly every two years</b>. This held for over 50 years, and it's why a phone today outperforms a 1990s supercomputer.</p>
${H.fact(`<p>Modern transistors are made at "3 nm" process nodes. A human hair is about 80,000 nm wide. Transistor features are now only a few dozen atoms across!</p>`)}
<h2>Why VLSI matters for India</h2>
<p>India is building semiconductor fabs and design centres under the <b>India Semiconductor Mission</b>, and most major chip companies already have large design teams in Bengaluru, Hyderabad and Noida. VLSI design is one of the most sought-after career paths for ECE graduates, and it's critical for defence self-reliance: secure, domestically designed chips for radar, communication and guidance systems.</p>
`,
    },
    {
      id: "cmos",
      title: "CMOS: the building block of every chip",
      minutes: 9,
      body: `
<p class="lead">Nearly every digital chip uses <strong>CMOS — Complementary MOS</strong>. It pairs two types of MOSFET that behave as opposites.</p>
<div class="compare">
  <div><h3>NMOS</h3><p>Turns <b>ON</b> when the gate is <b>HIGH</b>. Good at pulling the output down to 0 (GND).</p></div>
  <div><h3>PMOS</h3><p>Turns <b>ON</b> when the gate is <b>LOW</b>. Good at pulling the output up to 1 (VDD).</p></div>
</div>
<h2>The CMOS inverter (NOT gate)</h2>
<p>Put a PMOS on top (connected to VDD) and an NMOS below (connected to GND), with their gates tied together as the input:</p>
<ul>
  <li>Input = 0 → PMOS ON, NMOS OFF → output pulled up to <b>1</b></li>
  <li>Input = 1 → PMOS OFF, NMOS ON → output pulled down to <b>0</b></li>
</ul>
${H.widget("cmos", "CMOS inverter: toggle the input")}
${H.key(`<p>In either steady state, <b>one transistor is always OFF</b>, so there's no direct path from VDD to GND. That's why CMOS uses almost zero power when idle — and why your phone battery lasts all day with billions of transistors.</p>`)}
<h2>Building other gates</h2>
<p>A <b>CMOS NAND</b> gate has 2 PMOS in <b>parallel</b> on top and 2 NMOS in <b>series</b> below (4 transistors). NOR is the opposite: PMOS in series, NMOS in parallel. Complex chips are just billions of these arrangements.</p>
${H.table(["Power type", "Cause", "Formula"], [
  ["Dynamic (switching)", "Charging and discharging capacitances", "P = α·C·V²·f"],
  ["Static (leakage)", "Tiny currents through OFF transistors", "Grows as transistors shrink"],
])}
${H.gate(`<p>The CMOS inverter (VTC curve, noise margins, NMOS/PMOS operating regions) is a classic GATE topic under Electronic Devices and Digital Circuits.</p>`)}
`,
    },
    {
      id: "flow",
      title: "How a chip is designed",
      minutes: 8,
      body: `
<p class="lead">Designing a chip is like constructing a city: first the plan, then the detailed design, then construction. It takes teams of hundreds of engineers 1–3 years.</p>
<div class="timeline">
  <div class="t-item"><b>1. Specification</b><p>What should the chip do? Speed, power, area, cost.</p></div>
  <div class="t-item"><b>2. Architecture</b><p>Block diagram: CPU cores, memory, interfaces.</p></div>
  <div class="t-item"><b>3. RTL design</b><p>Describe the hardware in <b>Verilog / VHDL</b>.</p></div>
  <div class="t-item"><b>4. Verification</b><p>Simulate millions of test cases (SystemVerilog, UVM). Often 60–70% of the total effort!</p></div>
  <div class="t-item"><b>5. Synthesis</b><p>Tools convert RTL into a <b>netlist</b> of real logic gates.</p></div>
  <div class="t-item"><b>6. Physical design</b><p>Floorplan, place and route: position every gate and wire on silicon.</p></div>
  <div class="t-item"><b>7. Signoff</b><p>Check timing (STA), power, and design rules (DRC/LVS).</p></div>
  <div class="t-item"><b>8. Tape-out & fabrication</b><p>Send the design to a fab (TSMC, Samsung, Intel…). Wafers take ~3 months.</p></div>
  <div class="t-item"><b>9. Test & packaging</b><p>Cut the wafer into dies, package them, test every chip.</p></div>
</div>
${H.table(["Stage", "Called", "Job roles"], [
  ["Steps 1–4", "Front-end", "RTL design engineer, design verification (DV) engineer"],
  ["Steps 5–7", "Back-end", "Physical design engineer, STA engineer"],
  ["Analog side", "Analog / mixed-signal", "Analog layout, circuit design (ADCs, PLLs)"],
])}
<h2>How chips are made (fabrication)</h2>
<p>Pure silicon is grown into cylinders and sliced into thin <b>wafers</b>. Then, layer by layer: coat with light-sensitive <b>photoresist</b> → shine UV light through a mask (<b>photolithography</b>) → etch away the exposed parts → add dopants or metal. Repeat 50–100+ times. The result: dozens of layers of transistors and copper wiring.</p>
`,
    },
    {
      id: "verilog",
      title: "Your first Verilog",
      minutes: 8,
      body: `
<p class="lead">Chip designers don't draw billions of transistors. They <strong>describe hardware in code</strong> using a Hardware Description Language (HDL). The most popular is <b>Verilog</b>.</p>
${H.mistake(`<p>Verilog looks like C, but it is <b>not a program that runs line by line</b>. It describes <b>hardware that exists all at once</b>. Every <code>assign</code> is a physical wire; every <code>always</code> block is circuitry working in parallel.</p>`)}
<h2>A half adder — the one you built from gates in Module 5</h2>
${H.code(`
module half_adder (
  input  wire a,
  input  wire b,
  output wire sum,
  output wire carry
);
  assign sum   = a ^ b;   // XOR gate
  assign carry = a & b;   // AND gate
endmodule
`, "verilog")}
<h2>A D flip-flop and a 4-bit counter</h2>
${H.code(`
module counter4 (
  input  wire       clk,
  input  wire       reset,
  output reg  [3:0] count
);
  always @(posedge clk) begin   // On every rising clock edge...
    if (reset)
      count <= 4'b0000;         // ...clear to zero
    else
      count <= count + 1;       // ...or count up (wraps 15 -> 0)
  end
endmodule
`, "verilog")}
<h2>A testbench to simulate it</h2>
${H.code(`
module tb;
  reg clk = 0, reset = 1;
  wire [3:0] count;

  counter4 dut (.clk(clk), .reset(reset), .count(count));

  always #5 clk = ~clk;           // Toggle clock every 5 time units

  initial begin
    $monitor("t=%0t count=%d", $time, count);
    #12 reset = 0;                // Release reset
    #200 $finish;
  end
endmodule
`, "verilog")}
<h2>Try it free, today</h2>
<ul>
  <li><b>EDA Playground</b> (edaplayground.com) — write and simulate Verilog in your browser.</li>
  <li><b>Icarus Verilog + GTKWave</b> — free desktop simulator and waveform viewer.</li>
  <li><b>FPGA boards</b> (e.g. Basys 3, Tang Nano) — put your Verilog onto real reconfigurable hardware.</li>
</ul>
${H.fact(`<p>With open-source tools (<b>OpenLane</b>, <b>SkyWater 130 nm PDK</b>) and shuttle programs like Tiny Tapeout, students can now get their own designs manufactured as real chips for a small fee.</p>`)}
`,
    },
  ],
  quiz: [
    { q: "What does VLSI stand for?", options: ["Very Low Silicon Integration", "Very Large Scale Integration", "Variable Logic System Interface", "Voltage Level Signal Input"], answer: 1, why: "Very Large Scale Integration: millions to billions of transistors on one chip." },
    { q: "In a CMOS inverter with input = 1, which transistor is ON?", options: ["PMOS", "NMOS", "Both", "Neither"], answer: 1, why: "NMOS turns on with a HIGH gate and pulls the output to 0." },
    { q: "Why does CMOS consume very little static power?", options: ["It runs at low voltage", "One transistor is always off, so no DC path exists", "It has no capacitance", "It uses BJTs"], answer: 1, why: "In steady state, there's no direct path between VDD and GND." },
    { q: "Which step converts RTL code into a gate-level netlist?", options: ["Verification", "Synthesis", "Place & route", "Tape-out"], answer: 1, why: "Synthesis maps RTL onto real logic cells." },
    { q: "In Verilog, 'assign sum = a ^ b;' describes…", options: ["An AND gate", "An XOR gate", "A flip-flop", "A loop"], answer: 1, why: "^ is the XOR operator — a continuous hardware connection." },
  ],
});
