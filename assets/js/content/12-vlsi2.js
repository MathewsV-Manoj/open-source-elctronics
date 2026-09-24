COURSE.push({
  id: "vlsi2",
  title: "VLSI Design in Industry",
  tagline: "Timing, verification, physical design and the tools real chip teams use every day.",
  icon: "🔬",
  level: "Advanced",
  lessons: [
    {
      id: "rtl",
      title: "Writing good RTL",
      minutes: 9,
      body: `
<p class="lead">In Module 8 you wrote your first Verilog. Industry RTL (Register Transfer Level) code follows a few firm rules so that what you simulate is exactly what gets built.</p>
<h2>Combinational vs sequential blocks</h2>
${H.code(`
// Combinational: output depends only on inputs right now.
// Use always @(*) and BLOCKING assignments (=).
always @(*) begin
  case (sel)
    2'b00: y = a;
    2'b01: y = b;
    2'b10: y = c;
    default: y = d;     // default avoids an accidental latch
  endcase
end

// Sequential: flip-flops that update on the clock edge.
// Use always @(posedge clk) and NON-BLOCKING assignments (<=).
always @(posedge clk or negedge rst_n) begin
  if (!rst_n) q <= 8'd0;
  else        q <= d;
end
`, "verilog")}
<h2>The golden rules</h2>
${H.steps([
  "Clocked blocks use <code>&lt;=</code>; combinational blocks use <code>=</code>. Mixing them causes simulation/hardware mismatches.",
  "In combinational blocks, assign every output in every branch (or give a default). Otherwise synthesis infers a <b>latch</b> — a common, hard-to-find bug.",
  "Use one clock where possible, and a clear reset for every register.",
  "Never use <code>#delays</code> in design code; they're ignored by synthesis. They belong only in testbenches.",
])}
${H.analogy(`<p>Non-blocking <code>&lt;=</code> is like everyone in a class writing their answer on paper and revealing it together when the bell rings. Blocking <code>=</code> is people answering one by one, each hearing the previous answer first. Flip-flops all update together on the clock, so they need the first style.</p>`)}
`,
    },
    {
      id: "timing",
      title: "Timing: setup, hold and clock speed",
      minutes: 9,
      body: `
<p class="lead">Why can't a chip run at infinite GHz? Because signals take time to travel through gates and wires. <strong>Static timing analysis (STA)</strong> checks every path so that data always arrives on time.</p>
<h2>Setup and hold</h2>
<ul>
  <li><b>Setup time</b>: the data must be stable for a short time <em>before</em> the clock edge.</li>
  <li><b>Hold time</b>: the data must stay stable for a short time <em>after</em> the clock edge.</li>
</ul>
${H.analogy(`<p>Taking a group photo: people must be in position <b>before</b> the shutter (setup) and stay still for a moment <b>after</b> it clicks (hold). Move too late or too early and the photo is blurred — in a chip, that's a wrong bit or metastability.</p>`)}
<h2>How fast can it go?</h2>
<p>Between two flip-flops the data must: leave the first flip-flop, pass through the logic, and arrive before the next edge with setup time to spare.</p>
${H.formula("T<sub>clk</sub> ≥ t<sub>clk→q</sub> + t<sub>logic</sub> + t<sub>setup</sub>", "f<sub>max</sub> = 1 ÷ T<sub>clk,min</sub>")}
<p>Example: 0.1 ns + 0.7 ns + 0.05 ns = 0.85 ns → f<sub>max</sub> ≈ 1.18 GHz. The slowest such path is the <b>critical path</b>. <b>Slack</b> is how much time is left over; negative slack means the design fails at that speed.</p>
<h2>Fixing timing</h2>
<ul>
  <li><b>Pipelining</b>: split long logic with extra flip-flops, so each stage is shorter (more latency, higher clock).</li>
  <li>Faster cells, better placement, shorter wires.</li>
  <li>Fixing hold violations: add small delay buffers.</li>
</ul>
${H.gate(`<p>Maximum clock frequency from setup/hold/propagation delays is a favourite GATE Digital numerical question.</p>`)}
`,
    },
    {
      id: "verification",
      title: "Verification: proving the chip works",
      minutes: 8,
      body: `
<p class="lead">A bug found after manufacturing can cost crores and months. That's why <strong>design verification (DV)</strong> often takes more engineers and time than design itself.</p>
<h2>From simple to industrial</h2>
${H.table(["Level", "What it is", "When"], [
  ["Directed testbench", "You write specific input cases and check outputs", "Small blocks, learning"],
  ["Self-checking testbench", "The testbench computes the expected answer and flags mismatches automatically", "Every serious block"],
  ["Constrained-random (SystemVerilog)", "Thousands of random but legal inputs find corner cases humans miss", "Industry standard"],
  ["UVM", "A standard framework of reusable verification components", "Large SoC teams"],
  ["Coverage", "Measures which features and values were actually tested", "Signing off 'done'"],
  ["Formal verification", "Mathematically proves a property for all inputs", "Critical logic (arbiters, security)"],
])}
<h2>A self-checking testbench idea</h2>
${H.code(`
// For every a and b, compare the design's sum with the expected value.
integer i, j, errors = 0;
initial begin
  for (i = 0; i < 16; i = i + 1)
    for (j = 0; j < 16; j = j + 1) begin
      a = i; b = j; #1;
      if ({cout, sum} !== i + j) begin
        errors = errors + 1;
        $display("FAIL a=%0d b=%0d got=%0d", i, j, {cout, sum});
      end
    end
  if (errors == 0) $display("PASS: all 256 cases");
  $finish;
end
`, "verilog")}
${H.key(`<p>Many freshers enter the VLSI industry through <b>verification</b> roles. SystemVerilog and UVM skills, plus solid digital fundamentals, are what these teams hire for.</p>`)}
`,
    },
    {
      id: "physical",
      title: "Physical design and the chip business",
      minutes: 8,
      body: `
<p class="lead">After synthesis, the netlist is just a list of gates. <strong>Physical design</strong> turns it into real geometry: where every transistor and wire goes on the silicon.</p>
${H.steps([
  "<b>Floorplanning</b>: decide where big blocks (CPU, memory, I/O) sit, and plan power delivery.",
  "<b>Placement</b>: position millions of standard cells.",
  "<b>Clock tree synthesis (CTS)</b>: build a balanced network so the clock reaches every flip-flop at nearly the same time.",
  "<b>Routing</b>: connect everything with metal layers (10–15+ layers in modern chips).",
  "<b>Sign-off</b>: timing (STA), power and IR drop, DRC (design rules) and LVS (layout vs schematic).",
])}
<h2>Tools the industry uses</h2>
${H.table(["Job", "Commercial tools", "Free / open-source"], [
  ["Simulation", "Synopsys VCS, Cadence Xcelium, Siemens Questa", "Icarus Verilog, Verilator"],
  ["Synthesis", "Synopsys Design Compiler, Cadence Genus", "Yosys"],
  ["Place & route", "Cadence Innovus, Synopsys ICC2", "OpenROAD (inside OpenLane)"],
  ["Timing", "Synopsys PrimeTime", "OpenSTA"],
  ["FPGA", "AMD Vivado, Intel Quartus", "Yosys + nextpnr (some FPGAs)"],
])}
<h2>Who does what in the chip world</h2>
${H.table(["Type of company", "What they do", "Examples"], [
  ["Fabless design houses", "Design chips, outsource manufacturing", "Qualcomm, NVIDIA, AMD, MediaTek"],
  ["Foundries", "Manufacture other companies' chips", "TSMC, Samsung Foundry, GlobalFoundries"],
  ["IDMs", "Design and manufacture their own", "Intel, Texas Instruments, Infineon"],
  ["EDA companies", "Make the design software", "Synopsys, Cadence, Siemens EDA"],
  ["OSAT", "Assemble, package and test chips", "ASE, Amkor; new plants coming up in India"],
  ["Design services", "Do design/verification work for clients", "Many firms in Bengaluru, Hyderabad, Noida"],
])}
${H.fact(`<p>Most of the world's big chip companies have large design centres in India, and the India Semiconductor Mission is funding new fabs and packaging plants. Chip design is one of the strongest career paths for ECE graduates here.</p>`)}
`,
    },
  ],
  quiz: [
    { q: "Which assignment should you use inside always @(posedge clk)?", options: ["= (blocking)", "<= (non-blocking)", "assign", "Either, it doesn't matter"], answer: 1, why: "Flip-flops update together on the edge, which non-blocking assignments model correctly." },
    { q: "A combinational always block doesn't assign an output in one branch. What does synthesis create?", options: ["A flip-flop", "A latch", "A multiplexer", "Nothing"], answer: 1, why: "The output must 'remember' its value in that branch, so a latch is inferred." },
    { q: "tclk→q = 0.2 ns, tlogic = 1.6 ns, tsetup = 0.2 ns. What's the maximum clock frequency?", options: ["250 MHz", "500 MHz", "1 GHz", "2 GHz"], answer: 1, why: "Tmin = 2.0 ns → fmax = 1/2 ns = 500 MHz." },
    { q: "What does LVS check?", options: ["Timing", "That the layout matches the schematic/netlist", "Power consumption", "Logic functionality"], answer: 1, why: "Layout vs Schematic confirms the drawn layout implements the intended circuit." },
    { q: "TSMC is best described as a…", options: ["Fabless design house", "Foundry", "EDA company", "OSAT"], answer: 1, why: "TSMC manufactures chips designed by other companies." },
  ],
});
