/* Lab experiments, VLSI designs and simulation projects.
   Extra fields used here:
   - category: mcu | vlsi | sim | lab
   - observe: what to measure / expected results (HTML)
   - codes: [{ title, lang, src }] for designs that ship more than one file */
Object.assign(window.PLATFORMS, {
  lab: { name: "ECE lab bench", short: "Lab" },
  verilog: { name: "Verilog (EDA Playground or FPGA)", short: "Verilog" },
  python: { name: "Python (NumPy, SciPy, Matplotlib)", short: "Python" },
  spice: { name: "SPICE (ngspice)", short: "SPICE" },
});
window.PLATFORMS.analog.name = "Hobby circuit (no code)";

window.CATEGORIES = {
  mcu: { name: "Microcontroller", desc: "Arduino, ESP32, Raspberry Pi Pico and Raspberry Pi projects with wiring and code." },
  vlsi: { name: "VLSI", desc: "Verilog designs with self-checking testbenches. Simulate free online, or load onto an FPGA." },
  sim: { name: "Simulation", desc: "Electronics and communication experiments in Python and SPICE. No hardware needed." },
  lab: { name: "Lab", desc: "Classic ECE lab experiments and hobby circuits, with connections, procedure and expected readings." },
};

const PY_SETUP = "Install Python 3, then run <code>pip install numpy scipy matplotlib</code>. Or use Google Colab in your browser — nothing to install.";
const EDA_STEPS = [
  "Open <b>edaplayground.com</b> and log in (free).",
  "Paste the design into the right-hand <b>design.sv</b> pane and the testbench into the left-hand <b>testbench.sv</b> pane.",
  "Under <i>Tools &amp; Simulators</i>, choose <b>Icarus Verilog</b>. Tick <b>Open EPWave after run</b> to see waveforms.",
  "Click <b>Run</b> and read the PASS/FAIL messages in the log.",
  "Offline alternative: <code>iverilog -o sim design.v tb.v &amp;&amp; vvp sim</code>, then <code>gtkwave *.vcd</code>.",
];

window.PROJECTS.push(
  /* ======================= LAB ======================= */
  {
    id: "lab-rectifier",
    category: "lab",
    platform: "lab",
    title: "Half-wave and Full-wave Rectifiers with Filter",
    difficulty: "Easy",
    time: "1 lab session",
    cost: "₹60 + lab equipment",
    learn: ["How diodes rectify AC", "DC output and ripple, with and without a capacitor", "Peak inverse voltage (PIV)"],
    parts: ["Function generator (or a lab step-down transformer, only under supervision)", "4 × 1N4007 diodes", "Load resistor RL = 1 kΩ", "Capacitors: 10 µF and 100 µF (electrolytic)", "Dual-channel oscilloscope (CRO/DSO)", "Breadboard and probes"],
    how: `<p>A rectifier lets current through in only one direction. A <b>half-wave</b> rectifier keeps only the positive half-cycles. A <b>bridge</b> of four diodes also flips the negative half-cycles up, so twice as many humps reach the load. A capacitor across the load fills the gaps between humps.</p>
      ${H.table(["", "Half-wave", "Full-wave bridge"], [
        ["DC output (no filter)", "V<sub>m</sub> ÷ π", "2V<sub>m</sub> ÷ π"],
        ["Ripple factor (no filter)", "1.21", "0.482"],
        ["Ripple frequency", "f (50 Hz)", "2f (100 Hz)"],
        ["Ripple with capacitor", "≈ V<sub>m</sub> ÷ (f R C)", "≈ V<sub>m</sub> ÷ (2 f R C)"],
      ])}`,
    steps: [
      "<b>Safety:</b> use a function generator set to a sine wave, 10 V peak (20 Vpp), 50 Hz. Never connect anything to mains yourself.",
      "<b>Half-wave:</b> generator + → D1 anode; D1 cathode → top of RL; bottom of RL → generator ground.",
      "Probe CH1 across the generator and CH2 across RL. Note the peak V<sub>m</sub> and the shape.",
      "Add the 10 µF capacitor across RL (+ to the diode side). Observe, then repeat with 100 µF.",
      "<b>Full-wave bridge:</b> generator leads to the two AC corners of the bridge; the DC + corner (joined cathodes) → top of RL; the DC − corner (joined anodes) → bottom of RL.",
      "Because the generator's ground is not the load's ground in a bridge, measure across RL with a <b>floating</b> (battery-powered) DSO or use the maths channel CH1 − CH2. Ask your lab instructor.",
      "Repeat the measurements with and without the capacitors.",
    ],
    observe: `${H.table(["Circuit", "V<sub>m</sub> (V)", "V<sub>dc</sub> measured (V)", "V<sub>dc</sub> theory (V)", "Ripple p-p (V)"], [
      ["Half-wave, no C", "", "", "V<sub>m</sub>/π ≈ 2.96 (for 10 V − 0.7)", "—"],
      ["Half-wave, 100 µF", "", "", "", "≈ 1.9"],
      ["Full-wave, no C", "", "", "2V<sub>m</sub>/π ≈ 5.47 (for 10 V − 1.4)", "—"],
      ["Full-wave, 100 µF", "", "", "", "≈ 0.9"],
    ])}<p class="muted small">Theory values subtract one diode drop (0.7 V) for half-wave and two (1.4 V) for the bridge.</p>`,
    challenge: "Add a 7805 regulator after the filter capacitor (with a 12 V peak input) and measure how much the ripple drops.",
  },
  {
    id: "lab-zener",
    category: "lab",
    platform: "lab",
    title: "Zener Diode Voltage Regulator",
    difficulty: "Easy",
    time: "1 lab session",
    cost: "₹40 + lab equipment",
    learn: ["Reverse breakdown in a Zener diode", "Line regulation and load regulation", "Choosing the series resistor"],
    parts: ["1N4733A Zener diode (5.1 V, 1 W)", "Series resistor RS = 330 Ω (½ W)", "Load: 1 kΩ fixed + 10 kΩ potentiometer, or a decade resistance box", "Variable DC power supply 0–15 V", "2 digital multimeters"],
    how: `<p>A Zener diode is designed to conduct in reverse at a fixed <b>breakdown voltage</b> V<sub>Z</sub>. Once in breakdown, its voltage barely changes even as its current varies. A series resistor absorbs the difference between the input and V<sub>Z</sub>, so the load sees a steady voltage.</p>
      ${H.formula("R<sub>S</sub> = (V<sub>in</sub> − V<sub>Z</sub>) ÷ (I<sub>Z</sub> + I<sub>L</sub>)", "12 V in, 5.1 V out, 330 Ω → about 21 mA shared between Zener and load")}`,
    steps: [
      "Supply + → RS (330 Ω) → node X.",
      "Zener from node X to ground, <b>cathode (band) to node X</b> — it must be reverse-biased.",
      "Load resistor from node X to ground. Voltmeter across the load; ammeter in series with the load.",
      "<b>Line regulation:</b> with RL = 1 kΩ, raise V<sub>in</sub> from 0 to 15 V in 1 V steps and record V<sub>out</sub>.",
      "<b>Load regulation:</b> fix V<sub>in</sub> = 12 V, vary RL from 10 kΩ down to about 300 Ω, recording V<sub>out</sub> and I<sub>L</sub>.",
    ],
    observe: `<p>Expect V<sub>out</sub> to follow V<sub>in</sub> up to about 5 V, then stay near 5.1 V however high V<sub>in</sub> goes. With a very small RL, the load takes all the current, the Zener drops out of breakdown and V<sub>out</sub> falls.</p>
      ${H.formula("% Load regulation = (V<sub>NL</sub> − V<sub>FL</sub>) ÷ V<sub>FL</sub> × 100")}`,
    challenge: "Work out the smallest load resistance this circuit can regulate at V_in = 12 V, then confirm it experimentally.",
  },
  {
    id: "lab-clipper",
    category: "lab",
    platform: "lab",
    title: "Clipper and Clamper Circuits",
    difficulty: "Easy",
    time: "1 lab session",
    cost: "₹50 + lab equipment",
    learn: ["Shaping waveforms with diodes", "Clipping at a chosen level with a DC reference", "Shifting a waveform's DC level (clamping)"],
    parts: ["1N4148 diodes", "Resistors: 1 kΩ, 100 kΩ", "Capacitor 1 µF (non-polarised or electrolytic)", "DC supply for the reference voltage (0–5 V)", "Function generator (1 kHz, 10 Vpp sine)", "Dual-channel oscilloscope"],
    how: `<p>A <b>clipper</b> cuts off the part of a waveform above (or below) a chosen level: the diode switches on and holds the output at V<sub>ref</sub> + 0.7 V. A <b>clamper</b> uses a capacitor that charges to the peak, shifting the whole waveform up or down without changing its shape — used, for example, to restore the DC level of video signals.</p>`,
    steps: [
      "<b>Shunt positive clipper:</b> generator → 1 kΩ → output node. Diode anode at the output node, cathode to the + of the DC reference; reference − to ground.",
      "Set V<sub>ref</sub> = 0 V, then 2 V and 4 V. CH1 on the input, CH2 on the output. Sketch both.",
      "Reverse the diode (and reference polarity) to make a <b>negative clipper</b>.",
      "<b>Positive clamper:</b> generator → 1 µF capacitor → output node. Diode from output node to ground with the <b>anode to ground</b>. 100 kΩ from output node to ground.",
      "Set the oscilloscope to <b>DC coupling</b> (AC coupling hides the shift) and compare input and output.",
    ],
    observe: `${H.table(["Circuit", "Expected output"], [
      ["Positive clipper, V<sub>ref</sub> = 2 V", "Positive peaks flattened at about 2.7 V; negative half unchanged"],
      ["Negative clipper, V<sub>ref</sub> = 2 V", "Negative peaks flattened at about −2.7 V"],
      ["Positive clamper", "Same shape, shifted up: swings from about −0.7 V to about +9.3 V"],
    ])}`,
    challenge: "Combine two diodes and two references to build a double-ended clipper that limits the signal between −3 V and +3 V.",
  },
  {
    id: "lab-ce-amp",
    category: "lab",
    platform: "lab",
    title: "Common-Emitter Amplifier: Frequency Response",
    difficulty: "Medium",
    time: "1–2 lab sessions",
    cost: "₹60 + lab equipment",
    learn: ["Voltage-divider biasing", "Measuring gain in dB", "Finding bandwidth from a frequency response"],
    parts: ["BC547 NPN transistor", "R1 = 47 kΩ, R2 = 10 kΩ, RC = 2.2 kΩ, RE = 470 Ω, RL = 10 kΩ", "Cin = Cout = 10 µF, CE = 100 µF", "12 V DC supply", "Function generator, dual-channel oscilloscope"],
    how: `<p>The divider (R1, R2) sets the base at about 2.1 V, so V<sub>E</sub> ≈ 1.4 V and I<sub>E</sub> ≈ 3 mA; the collector then sits near 5.4 V — comfortably in the active region. CE bypasses RE for AC, so the gain is high. The coupling capacitors cut low frequencies; internal capacitances cut high ones.</p>
      ${H.formula("Gain (dB) = 20 log<sub>10</sub>(V<sub>out</sub> ÷ V<sub>in</sub>)", "Bandwidth = f<sub>H</sub> − f<sub>L</sub>, where gain is 3 dB below maximum")}`,
    steps: [
      "BC547 pins (flat face towards you, legs down): <b>C–B–E</b> from left to right. Check your datasheet; some variants differ.",
      "12 V → R1 → base; base → R2 → ground.",
      "12 V → RC → collector. Emitter → RE → ground, with CE (+ to emitter) across RE.",
      "Input: generator → Cin (+ to base) → base. Output: collector → Cout (+ to collector) → RL → ground.",
      "<b>DC check first:</b> with no input, measure V<sub>B</sub>, V<sub>E</sub>, V<sub>C</sub>. Expect about 2.1 V, 1.4 V and 5–6 V.",
      "Apply a 20 mVpp, 1 kHz sine. Watch the output on CH2; reduce the input if the output is clipped.",
      "Keep V<sub>in</sub> constant and vary frequency: 10, 20, 50, 100, 200, 500 Hz, 1, 2, 5, 10, 20, 50, 100, 200, 500 kHz, 1 MHz. Record V<sub>out</sub> each time.",
      "Plot gain (dB) against frequency on semi-log graph paper (log scale for frequency).",
    ],
    observe: `${H.table(["Frequency", "V<sub>in</sub> (mVpp)", "V<sub>out</sub> (Vpp)", "Gain = V<sub>out</sub>/V<sub>in</sub>", "Gain (dB)"], [["10 Hz", "20", "", "", ""], ["…", "20", "", "", ""], ["1 kHz", "20", "", "", ""], ["…", "20", "", "", ""], ["1 MHz", "20", "", "", ""]])}
      <p>Expect a flat mid-band (gain of roughly 40–46 dB), falling at both ends. Mark f<sub>L</sub> and f<sub>H</sub> where the gain is 3 dB below the mid-band value.</p>`,
    challenge: "Remove CE and measure again. The gain falls to about RC‖RL ÷ RE, but the bandwidth widens: that's negative feedback in action.",
  },
  {
    id: "lab-opamp",
    category: "lab",
    platform: "lab",
    title: "Op-Amp Inverting and Non-Inverting Amplifiers",
    difficulty: "Easy",
    time: "1 lab session",
    cost: "₹50 + lab equipment",
    learn: ["Op-amp pinout and dual power supply", "Gain set by two resistors", "Saturation limits"],
    parts: ["µA741 (or TL071) op-amp", "Resistors: R1 = 1 kΩ, Rf = 10 kΩ", "Dual supply ±12 V", "Function generator (1 kHz sine), dual-channel oscilloscope"],
    how: `<p>With negative feedback, the op-amp adjusts its output until both inputs are at the same voltage (Module 4). That single rule gives the gain formulas:</p>
      ${H.table(["Configuration", "Gain", "With R1 = 1 kΩ, Rf = 10 kΩ"], [["Inverting", "−R<sub>f</sub> ÷ R<sub>1</sub>", "−10 (output inverted)"], ["Non-inverting", "1 + R<sub>f</sub> ÷ R<sub>1</sub>", "+11"]])}`,
    steps: [
      "741 pins: 2 = inverting input (−), 3 = non-inverting input (+), 4 = −12 V, 6 = output, 7 = +12 V. Pin 1 is next to the dot.",
      "<b>Inverting:</b> input → R1 → pin 2; Rf from pin 2 to pin 6; pin 3 → ground.",
      "Apply 1 Vpp at 1 kHz. CH1 on input, CH2 on output. Expect 10 Vpp, inverted.",
      "<b>Non-inverting:</b> input → pin 3; R1 from pin 2 to ground; Rf from pin 2 to pin 6.",
      "Apply 1 Vpp. Expect 11 Vpp, in phase.",
      "Increase the input until the output flattens. Note the saturation voltage (about ±10.5 V on ±12 V for a 741).",
    ],
    observe: `${H.table(["Configuration", "V<sub>in</sub> (Vpp)", "V<sub>out</sub> (Vpp)", "Measured gain", "Theory gain", "Phase"], [["Inverting", "1", "", "", "−10", "180°"], ["Non-inverting", "1", "", "", "11", "0°"]])}`,
    challenge: "Build a summing amplifier (two inputs, each through 10 kΩ into pin 2, Rf = 10 kΩ) and show that Vout = −(V1 + V2).",
  },
  {
    id: "lab-rc-osc",
    category: "lab",
    platform: "lab",
    title: "RC Phase-Shift Oscillator",
    difficulty: "Medium",
    time: "1 lab session",
    cost: "₹60 + lab equipment",
    learn: ["Barkhausen criterion in practice", "Three RC sections giving 180° shift", "Measuring frequency on an oscilloscope"],
    parts: ["µA741 or TL071 op-amp, ±12 V supply", "3 × R = 10 kΩ, 3 × C = 10 nF", "Rf = 270 kΩ + 50 kΩ potentiometer in series", "Oscilloscope"],
    how: `<p>The inverting amplifier gives 180° of phase shift; three RC sections add another 180°, making 360° around the loop. At exactly one frequency the ladder's attenuation is 1/29, so the amplifier needs a gain of at least 29.</p>
      ${H.formula("f = 1 ÷ (2π R C √6)", "10 kΩ and 10 nF → about 650 Hz")}`,
    steps: [
      "Build an inverting amplifier: pin 3 → ground; Rf (270 kΩ + 50 kΩ pot) from pin 2 to pin 6.",
      "From the output (pin 6): C1 → node A; R from node A to ground.",
      "Node A → C2 → node B; R from node B to ground.",
      "Node B → C3 → pin 2. The third R is the amplifier's input resistor, so connect it between C3 and pin 2 in series — pin 2 is a virtual ground.",
      "Power up and slowly adjust the pot until a steady sine wave appears. Too much gain gives a clipped wave; too little and it dies out.",
      "Measure the period T on the oscilloscope and calculate f = 1/T.",
    ],
    observe: `${H.table(["", "Value"], [["Theoretical f", "≈ 650 Hz"], ["Measured period T", ""], ["Measured f = 1/T", ""], ["R<sub>f</sub> needed to start", "about 290 kΩ (gain 29)"]])}`,
    challenge: "Change all three capacitors to 4.7 nF and predict the new frequency before measuring it.",
  },
  {
    id: "lab-logic-ics",
    category: "lab",
    platform: "lab",
    title: "Logic Gates and a Half Adder with 74-Series ICs",
    difficulty: "Easy",
    time: "1 lab session",
    cost: "₹120 + trainer kit",
    learn: ["Reading IC pinouts", "Verifying truth tables in hardware", "Building a half adder from XOR and AND"],
    parts: ["7408 (AND), 7432 (OR), 7404 (NOT), 7400 (NAND), 7486 (XOR)", "5 V DC supply (or a digital trainer kit)", "2 switches with 1 kΩ pull-down resistors", "LEDs with 330 Ω resistors"],
    how: `<p>Each 74-series IC packs several gates. The quad 2-input chips (7400, 7408, 7432, 7486) share one pinout: gate inputs on pins 1–2, 4–5, 9–10 and 12–13, outputs on pins 3, 6, 8 and 11. <b>Pin 14 is +5 V and pin 7 is ground</b> on all of them.</p>`,
    steps: [
      "Place the IC across the breadboard's centre gap. Pin 1 is next to the notch or dot.",
      "Connect pin 14 → +5 V and pin 7 → ground. Forgetting this is the most common lab mistake.",
      "Inputs: each switch connects its input pin to +5 V; a 1 kΩ resistor from the pin to ground holds it LOW when the switch is open.",
      "Output pin → 330 Ω → LED → ground.",
      "Test gate 1 (inputs pins 1, 2, output pin 3) of the 7408, 7432, 7400 and 7486 through all four input combinations.",
      "7404 NOT: input pin 1, output pin 2.",
      "<b>Half adder:</b> send switches A and B to both 7486 gate 1 (pins 1, 2) and 7408 gate 1 (pins 1, 2). 7486 pin 3 = Sum, 7408 pin 3 = Carry.",
    ],
    observe: `${H.table(["A", "B", "AND", "OR", "NAND", "XOR = Sum", "Carry"], [["0", "0", "0", "0", "1", "0", "0"], ["0", "1", "0", "1", "1", "1", "0"], ["1", "0", "0", "1", "1", "1", "0"], ["1", "1", "1", "1", "0", "0", "1"]])}`,
    challenge: "Build a full adder with two half adders and a 7432 OR gate, then chain two for 2-bit addition.",
  },
  {
    id: "lab-counter",
    category: "lab",
    platform: "lab",
    title: "Decade Counter with 7-Segment Display",
    difficulty: "Medium",
    time: "1–2 lab sessions",
    cost: "₹200",
    learn: ["BCD counting with the 7490", "Decoding BCD to seven segments with the 7447", "Generating a 1 Hz clock with a 555"],
    parts: ["NE555 timer, R1 = 10 kΩ, R2 = 68 kΩ, C = 10 µF, 10 nF", "7490 decade counter", "7447 BCD-to-7-segment decoder", "Common-anode 7-segment display", "7 × 330 Ω resistors", "5 V supply"],
    how: `<p>The 555 produces about 1 pulse per second. The 7490 counts pulses in binary-coded decimal (0000 to 1001, then back to 0000). The 7447 turns each 4-bit code into the right pattern of segments, pulling segment pins LOW to light them on a common-anode display.</p>
      ${H.formula("f = 1.44 ÷ ((R1 + 2·R2) × C)", "10 kΩ, 68 kΩ, 10 µF → about 1 Hz")}`,
    steps: [
      "<b>555 at 1 Hz</b>, as in the 555 flasher project: pin 8 and 4 → +5 V, pin 1 → GND, R1 from +5 V to pin 7, R2 from pin 7 to pin 6, pins 6 and 2 joined, 10 µF from pin 2 to GND, 10 nF from pin 5 to GND. Pin 3 is the clock.",
      "<b>7490</b>: pin 5 → +5 V, pin 10 → GND. Reset pins 2, 3, 6, 7 → GND (all resets inactive).",
      "555 pin 3 → 7490 pin 14 (clock A). Join 7490 pin 12 (Q<sub>A</sub>) to pin 1 (clock B) for BCD counting.",
      "<b>7447</b>: pin 16 → +5 V, pin 8 → GND. Pins 3, 4, 5 (LT, BI/RBO, RBI) → +5 V.",
      "7490 outputs to 7447 inputs: Q<sub>A</sub> pin 12 → A pin 7; Q<sub>B</sub> pin 9 → B pin 1; Q<sub>C</sub> pin 8 → C pin 2; Q<sub>D</sub> pin 11 → D pin 6.",
      "7447 outputs through 330 Ω to the display: a = pin 13, b = 12, c = 11, d = 10, e = 9, f = 15, g = 14. Display common anode → +5 V.",
      "Power up. The display should count 0 → 9 once per second and repeat.",
    ],
    observe: `${H.table(["Clock pulses", "Q<sub>D</sub> Q<sub>C</sub> Q<sub>B</sub> Q<sub>A</sub>", "Display"], [["0", "0000", "0"], ["1", "0001", "1"], ["2", "0010", "2"], ["…", "…", "…"], ["9", "1001", "9"], ["10", "0000", "0"]])}`,
    challenge: "Add a second 7490/7447/display stage clocked from the first stage's Q_D to count 00–99.",
  },

  /* ======================= VLSI ======================= */
  {
    id: "vlsi-alu",
    category: "vlsi",
    platform: "verilog",
    title: "4-bit ALU with a Self-Checking Testbench",
    difficulty: "Easy",
    time: "1–2 hours",
    cost: "Free",
    learn: ["Combinational design with case statements", "Carry and borrow with concatenation", "Random, self-checking verification"],
    parts: ["A web browser (EDA Playground) — or Icarus Verilog and GTKWave installed locally"],
    how: `<p>An ALU (Arithmetic Logic Unit) is the calculator at the heart of every processor. The 3-bit <code>op</code> input selects one of eight operations. The testbench throws 2000 random inputs at it and checks every answer against its own model, reporting any mismatch.</p>`,
    steps: EDA_STEPS,
    codes: [
      { title: "design.sv — the ALU", lang: "verilog", src: `
module alu4 (
  input  wire [3:0] a, b,
  input  wire [2:0] op,
  output reg  [3:0] y,
  output reg        carry,
  output wire       zero
);
  always @(*) begin
    carry = 1'b0;
    case (op)
      3'b000: {carry, y} = a + b;   // ADD (carry out)
      3'b001: {carry, y} = a - b;   // SUB (carry = borrow)
      3'b010: y = a & b;            // AND
      3'b011: y = a | b;            // OR
      3'b100: y = a ^ b;            // XOR
      3'b101: y = ~a;               // NOT
      3'b110: y = a << 1;           // shift left
      default: y = a >> 1;          // shift right
    endcase
  end

  assign zero = (y == 4'b0000);
endmodule` },
      { title: "testbench.sv — 2000 random checks", lang: "verilog", src: `
module tb;
  reg  [3:0] a, b;
  reg  [2:0] op;
  wire [3:0] y;
  wire       carry, zero;
  reg  [4:0] expected;
  integer i, errors;

  alu4 dut (.a(a), .b(b), .op(op), .y(y), .carry(carry), .zero(zero));

  initial begin
    $dumpfile("alu.vcd");
    $dumpvars(0, tb);
    errors = 0;
    for (i = 0; i < 2000; i = i + 1) begin
      a = $random; b = $random; op = $random;
      #1;
      case (op)
        3'd0: expected = a + b;
        3'd1: expected = a - b;
        3'd2: expected = {1'b0, a & b};
        3'd3: expected = {1'b0, a | b};
        3'd4: expected = {1'b0, a ^ b};
        3'd5: expected = {1'b0, ~a};
        3'd6: expected = {1'b0, a << 1};
        default: expected = {1'b0, a >> 1};
      endcase
      if ({carry, y} !== expected) begin
        errors = errors + 1;
        $display("FAIL op=%0d a=%0d b=%0d got=%b expected=%b", op, a, b, {carry, y}, expected);
      end
    end
    if (errors == 0) $display("PASS: 2000 random tests");
    else             $display("%0d errors", errors);
    $finish;
  end
endmodule` },
    ],
    challenge: "Add overflow detection for signed addition, and extend the testbench to check it.",
  },
  {
    id: "vlsi-traffic",
    category: "vlsi",
    platform: "verilog",
    title: "Traffic Light Controller (FSM)",
    difficulty: "Easy",
    time: "1–2 hours",
    cost: "Free",
    learn: ["Writing a Moore state machine", "Parameterised timing", "Reading waveforms in EPWave or GTKWave"],
    parts: ["A web browser (EDA Playground) — optional FPGA board with 3 LEDs"],
    how: `<p>This is the Module 5 state diagram turned into hardware. A state register holds RED, GREEN or YELLOW; a counter measures how long we've been in the current state; when it reaches the limit, the FSM moves to the next state. The outputs depend only on the state, making it a <b>Moore</b> machine.</p>`,
    steps: [...EDA_STEPS, "On an FPGA: set the parameters for your clock (e.g. RED_T = 10 × 50,000,000 for 10 s at 50 MHz, and widen <code>count</code> to 32 bits), then map red, yellow and green to LED pins in the board's constraints file."],
    codes: [
      { title: "design.sv", lang: "verilog", src: `
module traffic_light #(
  parameter RED_T = 10, GREEN_T = 8, YELLOW_T = 3   // durations in clock ticks
)(
  input  wire clk, rst_n,
  output reg  red, yellow, green
);
  localparam S_RED = 2'd0, S_GREEN = 2'd1, S_YELLOW = 2'd2;
  reg [1:0] state;
  reg [7:0] count;

  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      state <= S_RED;
      count <= 0;
    end else begin
      count <= count + 1;
      case (state)
        S_RED:    if (count == RED_T - 1)    begin state <= S_GREEN;  count <= 0; end
        S_GREEN:  if (count == GREEN_T - 1)  begin state <= S_YELLOW; count <= 0; end
        S_YELLOW: if (count == YELLOW_T - 1) begin state <= S_RED;    count <= 0; end
        default:  begin state <= S_RED; count <= 0; end
      endcase
    end
  end

  // Moore outputs: depend on the state only
  always @(*) begin
    red    = (state == S_RED);
    yellow = (state == S_YELLOW);
    green  = (state == S_GREEN);
  end
endmodule` },
      { title: "testbench.sv", lang: "verilog", src: `
module tb;
  reg clk = 0, rst_n = 0;
  wire red, yellow, green;

  traffic_light #(.RED_T(10), .GREEN_T(8), .YELLOW_T(3)) dut (
    .clk(clk), .rst_n(rst_n), .red(red), .yellow(yellow), .green(green));

  always #5 clk = ~clk;            // 10 time-unit clock period

  initial begin
    $dumpfile("traffic.vcd");
    $dumpvars(0, tb);
    $monitor("t=%0t  R=%b Y=%b G=%b", $time, red, yellow, green);
    #12 rst_n = 1;
    #500 $finish;                  // about two full cycles
  end

  // Safety check: never more than one light on at once
  always @(posedge clk)
    if (red + yellow + green != 1) $display("FAIL at t=%0t: invalid light combination", $time);
endmodule` },
    ],
    challenge: "Add a pedestrian request input that shortens GREEN, and a second set of lights for the crossing road.",
  },
  {
    id: "vlsi-uart",
    category: "vlsi",
    platform: "verilog",
    title: "UART Transmitter",
    difficulty: "Medium",
    time: "2–3 hours",
    cost: "Free",
    learn: ["Baud-rate generation from a system clock", "Serialising a frame: start, 8 data bits (LSB first), stop", "Checking a serial output in a testbench"],
    parts: ["A web browser (EDA Playground) — optional FPGA board plus a USB-serial adapter to see the bytes on your PC"],
    how: `<p>This is the hardware version of the UART frame you explored in Module 7. The transmitter loads <code>{stop, data, start}</code> into a 10-bit frame, then holds each bit on the line for <code>CLKS_PER_BIT</code> clock cycles. At 50 MHz and 9600 baud that's 50,000,000 ÷ 9600 ≈ 5208 cycles per bit.</p>`,
    steps: [...EDA_STEPS, "On an FPGA: set CLKS_PER_BIT = clock frequency ÷ baud rate, connect <code>tx</code> to a pin wired to a USB-serial adapter's RX (share GND), and open a serial terminal at 9600 baud."],
    codes: [
      { title: "design.sv", lang: "verilog", src: `
module uart_tx #(
  parameter CLKS_PER_BIT = 5208        // 50 MHz / 9600 baud
)(
  input  wire       clk, rst_n,
  input  wire       start,             // pulse high for one clock to send 'data'
  input  wire [7:0] data,
  output reg        tx,
  output reg        busy
);
  reg [12:0] clk_cnt;
  reg [3:0]  bit_idx;                  // 0 = start bit, 1..8 = data, 9 = stop bit
  reg [9:0]  frame;

  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      tx <= 1'b1; busy <= 1'b0; clk_cnt <= 0; bit_idx <= 0; frame <= 10'h3FF;
    end else if (!busy) begin
      tx <= 1'b1;                      // line idles high
      if (start) begin
        frame   <= {1'b1, data, 1'b0}; // stop, data, start (LSB of data sent first)
        busy    <= 1'b1;
        clk_cnt <= 0;
        bit_idx <= 0;
      end
    end else begin
      tx <= frame[bit_idx];
      if (clk_cnt == CLKS_PER_BIT - 1) begin
        clk_cnt <= 0;
        if (bit_idx == 9) busy <= 1'b0;
        else              bit_idx <= bit_idx + 1;
      end else begin
        clk_cnt <= clk_cnt + 1;
      end
    end
  end
endmodule` },
      { title: "testbench.sv — sends 'A' and decodes it", lang: "verilog", src: `
module tb;
  localparam CPB = 4;                  // short bits so the simulation is quick
  reg clk = 0, rst_n = 0, start = 0;
  reg [7:0] data;
  wire tx, busy;
  reg [7:0] got;
  integer k;

  uart_tx #(.CLKS_PER_BIT(CPB)) dut (
    .clk(clk), .rst_n(rst_n), .start(start), .data(data), .tx(tx), .busy(busy));

  always #5 clk = ~clk;                // 10 time-unit clock period

  initial begin
    $dumpfile("uart.vcd");
    $dumpvars(0, tb);
    #20 rst_n = 1;
    @(negedge clk); data = 8'h41; start = 1;   // 'A'
    @(negedge clk); start = 0;

    @(negedge tx);                     // start bit begins
    #(CPB * 10 / 2);                   // move to the middle of the start bit
    for (k = 0; k < 8; k = k + 1) begin
      #(CPB * 10);                     // middle of each data bit
      got[k] = tx;
    end
    #(CPB * 10);
    if (tx !== 1'b1) $display("FAIL: stop bit missing");
    if (got === 8'h41) $display("PASS: received 0x%h", got);
    else               $display("FAIL: received 0x%h", got);
    #100 $finish;
  end
endmodule` },
    ],
    challenge: "Write the matching UART receiver (sample each bit in its middle) and loop the transmitter into it.",
  },
  {
    id: "vlsi-pwm",
    category: "vlsi",
    platform: "verilog",
    title: "PWM Generator",
    difficulty: "Easy",
    time: "1 hour",
    cost: "Free",
    learn: ["Counter-compare PWM, as used inside every microcontroller timer", "Parameterised width", "Measuring duty cycle in a testbench"],
    parts: ["A web browser (EDA Playground) — optional FPGA board with an LED"],
    how: `<p>A free-running counter goes 0, 1, 2 … 255 and wraps. The output is HIGH whenever the counter is below <code>duty</code>. So <code>duty = 64</code> gives 64/256 = 25% duty cycle. This is exactly how <code>analogWrite()</code> works inside the Arduino's timer hardware (Module 6).</p>`,
    steps: [...EDA_STEPS, "On an FPGA: drive <code>duty</code> from 8 slide switches and connect <code>out</code> to an LED. Change the switches and watch the brightness."],
    codes: [
      { title: "design.sv", lang: "verilog", src: `
module pwm #(
  parameter WIDTH = 8
)(
  input  wire             clk, rst_n,
  input  wire [WIDTH-1:0] duty,        // 0 = always off
  output reg              out
);
  reg [WIDTH-1:0] cnt;

  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      cnt <= 0;
      out <= 1'b0;
    end else begin
      cnt <= cnt + 1'b1;
      out <= (cnt < duty);
    end
  end
endmodule` },
      { title: "testbench.sv — measures the duty cycle", lang: "verilog", src: `
module tb;
  reg clk = 0, rst_n = 0;
  reg [7:0] duty;
  wire out;
  integer high, n, d;

  pwm #(.WIDTH(8)) dut (.clk(clk), .rst_n(rst_n), .duty(duty), .out(out));
  always #5 clk = ~clk;

  initial begin
    $dumpfile("pwm.vcd");
    $dumpvars(0, tb);
    #12 rst_n = 1;
    for (d = 0; d < 256; d = d + 64) begin
      duty = d;
      repeat (256) @(posedge clk);     // let one period pass
      high = 0;
      for (n = 0; n < 1024; n = n + 1) begin
        @(posedge clk);
        if (out) high = high + 1;
      end
      $display("duty=%0d -> measured %0d%% (expected %0d%%)", d, high * 100 / 1024, d * 100 / 256);
    end
    $finish;
  end
endmodule` },
    ],
    challenge: "Add a 'breathing' mode: a slow counter that ramps duty up and down automatically.",
  },
  {
    id: "vlsi-7seg",
    category: "vlsi",
    platform: "verilog",
    title: "Up/Down Counter on a 7-Segment Display (FPGA)",
    difficulty: "Medium",
    time: "2–3 hours",
    cost: "Free (simulation) / FPGA board",
    learn: ["Clock division", "BCD up/down counting", "A 7-segment decoder and FPGA pin constraints"],
    parts: ["EDA Playground for simulation", "Optional: an FPGA board such as Basys 3 (100 MHz clock) or a low-cost Tang Nano"],
    how: `<p>An FPGA clock is far too fast to watch, so a divider produces one <code>tick</code> per second. Each tick moves a BCD digit up or down, and a decoder lights the right segments. It's the Verilog version of the 7490 + 7447 lab experiment.</p>`,
    steps: [
      ...EDA_STEPS,
      "<b>On a Basys 3:</b> set DIV = 100_000_000. In the .xdc constraints file map <code>clk</code> to W5, <code>rst_n</code> to a push button, <code>up</code> to a slide switch, <code>seg[0]</code>…<code>seg[6]</code> to CA…CG, and <code>an[3:0]</code> to the four digit anodes.",
      "Other boards: set DIV to your clock frequency and check whether your display is active-low (common anode) or active-high.",
    ],
    codes: [
      { title: "design.sv", lang: "verilog", src: `
module counter_7seg #(
  parameter DIV = 100_000_000          // clock ticks per count (1 s at 100 MHz)
)(
  input  wire       clk, rst_n,
  input  wire       up,                // 1 = count up, 0 = count down
  output reg  [3:0] digit,
  output reg  [6:0] seg,               // {g,f,e,d,c,b,a}, active LOW
  output wire [3:0] an                 // digit enables, active LOW
);
  reg [31:0] div_cnt;
  wire tick = (div_cnt == DIV - 1);

  assign an = 4'b1110;                 // use the rightmost digit only

  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      div_cnt <= 0;
      digit   <= 0;
    end else begin
      div_cnt <= tick ? 0 : div_cnt + 1;
      if (tick) begin
        if (up) digit <= (digit == 9) ? 4'd0 : digit + 1'b1;
        else    digit <= (digit == 0) ? 4'd9 : digit - 1'b1;
      end
    end
  end

  always @(*) begin
    case (digit)           //  gfedcba
      4'd0: seg = 7'b1000000;
      4'd1: seg = 7'b1111001;
      4'd2: seg = 7'b0100100;
      4'd3: seg = 7'b0110000;
      4'd4: seg = 7'b0011001;
      4'd5: seg = 7'b0010010;
      4'd6: seg = 7'b0000010;
      4'd7: seg = 7'b1111000;
      4'd8: seg = 7'b0000000;
      4'd9: seg = 7'b0010000;
      default: seg = 7'b1111111;
    endcase
  end
endmodule` },
      { title: "testbench.sv", lang: "verilog", src: `
module tb;
  reg clk = 0, rst_n = 0, up = 1;
  wire [3:0] digit, an;
  wire [6:0] seg;

  counter_7seg #(.DIV(2)) dut (.clk(clk), .rst_n(rst_n), .up(up),
                               .digit(digit), .seg(seg), .an(an));
  always #5 clk = ~clk;

  initial begin
    $dumpfile("counter.vcd");
    $dumpvars(0, tb);
    $monitor("t=%0t up=%b digit=%0d seg=%b", $time, up, digit, seg);
    #12 rst_n = 1;
    #240 up = 0;                       // count up, then down
    #240 $finish;
  end
endmodule` },
    ],
    challenge: "Drive all four digits by multiplexing: switch the active anode every 1 ms and show a 4-digit count.",
  },

  /* ======================= SIMULATION ======================= */
  {
    id: "sim-am",
    category: "sim",
    platform: "python",
    title: "AM Modulation and Demodulation",
    difficulty: "Easy",
    time: "1 hour",
    cost: "Free",
    learn: ["Generating an AM signal", "Seeing the carrier and sidebands in the spectrum", "Recovering the message with an envelope detector"],
    parts: ["Python 3 with NumPy, SciPy and Matplotlib — or Google Colab"],
    how: `<p>This script builds the AM signal from Module 13, plots its spectrum (carrier at 10 kHz, sidebands at 9.5 and 10.5 kHz), then demodulates it the way a real envelope detector does: rectify, then low-pass filter.</p>`,
    steps: [PY_SETUP, "Save the code as <code>am.py</code> and run <code>python am.py</code>, or paste it into a Colab cell.", "Change <code>mu</code> to 1.3 and look at the recovered message: that's over-modulation distortion."],
    code: `
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import butter, filtfilt

fs = 100_000                          # simulation sample rate (Hz)
t = np.arange(0, 0.01, 1 / fs)        # 10 ms
fm, fc, mu = 500, 10_000, 0.6         # message freq, carrier freq, modulation index

m = np.sin(2 * np.pi * fm * t)                    # message
s = (1 + mu * m) * np.cos(2 * np.pi * fc * t)     # AM signal

# Envelope detector: rectify, then low-pass filter (cut-off 1 kHz)
b, a = butter(4, 2 * fm / (fs / 2))
envelope = filtfilt(b, a, np.abs(s))
recovered = envelope - envelope.mean()
recovered /= np.max(np.abs(recovered))

# Spectrum
S = np.abs(np.fft.rfft(s)) / len(s)
f = np.fft.rfftfreq(len(s), 1 / fs)

fig, ax = plt.subplots(3, 1, figsize=(9, 8))
ax[0].plot(t * 1e3, s, lw=0.8)
ax[0].plot(t * 1e3, 1 + mu * m, "--")
ax[0].set(title="AM signal and its envelope", xlabel="time (ms)")
ax[1].plot(f / 1e3, S)
ax[1].set(title="Spectrum: carrier + two sidebands", xlabel="frequency (kHz)", xlim=(8, 12))
ax[2].plot(t * 1e3, m, label="original message")
ax[2].plot(t * 1e3, recovered, "--", label="recovered")
ax[2].set(title="Demodulated output", xlabel="time (ms)")
ax[2].legend()
plt.tight_layout()
plt.show()`,
    lang: "python",
    challenge: "Implement DSB-SC (drop the '1 +') and show why an envelope detector no longer works — you need coherent demodulation.",
  },
  {
    id: "sim-fft",
    category: "sim",
    platform: "python",
    title: "Build a Spectrum Analyser with the FFT",
    difficulty: "Easy",
    time: "1 hour",
    cost: "Free",
    learn: ["What the FFT computes", "Frequency resolution and windowing", "Finding tones buried in noise"],
    parts: ["Python 3 with NumPy, SciPy and Matplotlib — or Google Colab"],
    how: `<p>A signal made of a 50 Hz tone and a weaker 120 Hz tone is buried in random noise. In the time plot you can't see the tones; in the spectrum they stand out clearly. This is exactly what a spectrum analyser and your phone's radio chip do.</p>`,
    steps: [PY_SETUP, "Run the script and read the detected peak frequencies printed at the end.", "Try N = 250 samples: the peaks get wider because frequency resolution = fs/N."],
    code: `
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import find_peaks

fs, N = 1000, 1000                        # 1 kHz sampling, 1 second of data
t = np.arange(N) / fs
x = (1.0 * np.sin(2 * np.pi * 50 * t)
     + 0.5 * np.sin(2 * np.pi * 120 * t)
     + 0.8 * np.random.randn(N))          # noise

window = np.hanning(N)                    # reduces spectral leakage
X = np.fft.rfft(x * window)
f = np.fft.rfftfreq(N, 1 / fs)
amplitude = 2 * np.abs(X) / window.sum()

peaks, _ = find_peaks(amplitude, height=0.3)
for p in peaks:
    print(f"Tone at {f[p]:.1f} Hz, amplitude about {amplitude[p]:.2f}")

fig, ax = plt.subplots(2, 1, figsize=(9, 6))
ax[0].plot(t, x, lw=0.7)
ax[0].set(title="Time domain: tones hidden in noise", xlabel="time (s)", xlim=(0, 0.2))
ax[1].plot(f, amplitude)
ax[1].plot(f[peaks], amplitude[peaks], "o")
ax[1].set(title="Frequency domain: the tones stand out", xlabel="frequency (Hz)")
plt.tight_layout()
plt.show()`,
    lang: "python",
    challenge: "Record 3 seconds of your voice with the sounddevice library and plot its spectrum.",
  },
  {
    id: "sim-bpsk",
    category: "sim",
    platform: "python",
    title: "BPSK Bit Error Rate over a Noisy Channel",
    difficulty: "Medium",
    time: "1–2 hours",
    cost: "Free",
    learn: ["Monte Carlo simulation of a digital link", "Additive white Gaussian noise (AWGN)", "Comparing simulated BER with theory"],
    parts: ["Python 3 with NumPy, SciPy and Matplotlib — or Google Colab"],
    how: `<p>One million random bits are mapped to +1/−1 (BPSK), noise is added at different E<sub>b</sub>/N<sub>0</sub> levels, and the receiver decides by sign. Counting wrong bits gives the BER, which you then compare with the textbook formula:</p>
      ${H.formula("BER = ½ erfc(√(E<sub>b</sub>/N<sub>0</sub>))")}`,
    steps: [PY_SETUP, "Run it: the dots (simulation) should sit on the curve (theory).", "At 10 dB only a few errors per million bits occur, so those points are noisier — increase N to 10 million if your computer allows."],
    code: `
import numpy as np
import matplotlib.pyplot as plt
from scipy.special import erfc

N = 1_000_000
bits = np.random.randint(0, 2, N)
symbols = 2 * bits - 1                    # 0 -> -1, 1 -> +1  (energy per bit = 1)

ebn0_db = np.arange(0, 11)
ber_sim = []
for e in ebn0_db:
    ebn0 = 10 ** (e / 10)
    noise = np.random.randn(N) * np.sqrt(1 / (2 * ebn0))   # variance N0/2
    received = symbols + noise
    decided = (received > 0).astype(int)
    ber_sim.append(np.mean(decided != bits))

ber_theory = 0.5 * erfc(np.sqrt(10 ** (ebn0_db / 10)))

for e, s, th in zip(ebn0_db, ber_sim, ber_theory):
    print(f"Eb/N0 = {e:2d} dB   simulated {s:.2e}   theory {th:.2e}")

plt.semilogy(ebn0_db, ber_sim, "o", label="simulated")
plt.semilogy(ebn0_db, ber_theory, "-", label="theory")
plt.xlabel("Eb/N0 (dB)")
plt.ylabel("Bit error rate")
plt.title("BPSK over AWGN")
plt.grid(True, which="both", alpha=0.3)
plt.legend()
plt.show()`,
    lang: "python",
    challenge: "Add QPSK on the same plot. Its BER per bit is the same as BPSK's — explain why, given it sends twice the bits.",
  },
  {
    id: "sim-qam",
    category: "sim",
    platform: "python",
    title: "16-QAM Constellation and Symbol Errors",
    difficulty: "Medium",
    time: "1–2 hours",
    cost: "Free",
    learn: ["Building a QAM constellation", "How noise spreads received symbols", "Nearest-point decisions and symbol error rate"],
    parts: ["Python 3 with NumPy and Matplotlib — or Google Colab"],
    how: `<p>Each 16-QAM symbol carries 4 bits using 4 amplitude levels on each of two axes (I and Q). As the SNR drops, the received clouds spread and overlap, and the receiver starts picking the wrong point — this is why your phone falls back to QPSK in weak signal.</p>`,
    steps: [PY_SETUP, "Run the script to see three constellations at 25, 15 and 10 dB SNR, each with its symbol error rate."],
    code: `
import numpy as np
import matplotlib.pyplot as plt

levels = np.array([-3, -1, 1, 3])
ideal = (levels[:, None] + 1j * levels[None, :]).ravel() / np.sqrt(10)   # average power 1

N = 5000
tx = ideal[np.random.randint(0, 16, N)]

fig, axes = plt.subplots(1, 3, figsize=(12, 4))
for ax, snr_db in zip(axes, [25, 15, 10]):
    noise_power = 10 ** (-snr_db / 10)
    noise = (np.random.randn(N) + 1j * np.random.randn(N)) * np.sqrt(noise_power / 2)
    rx = tx + noise
    decided = ideal[np.argmin(np.abs(rx[:, None] - ideal[None, :]), axis=1)]
    ser = np.mean(~np.isclose(decided, tx))

    ax.scatter(rx.real, rx.imag, s=2, alpha=0.4)
    ax.scatter(ideal.real, ideal.imag, c="red", marker="x")
    ax.set_title(f"SNR {snr_db} dB, symbol error rate {ser:.3f}")
    ax.set_xlabel("I (in-phase)")
    ax.set_ylabel("Q (quadrature)")
    ax.set_aspect("equal")
plt.tight_layout()
plt.show()`,
    lang: "python",
    challenge: "Add Gray coding and compute the bit error rate as well as the symbol error rate.",
  },
  {
    id: "sim-fir",
    category: "sim",
    platform: "python",
    title: "Design a Digital FIR Filter",
    difficulty: "Medium",
    time: "1 hour",
    cost: "Free",
    learn: ["Designing a low-pass FIR filter with the window method", "Plotting frequency response", "Filter delay (group delay)"],
    parts: ["Python 3 with NumPy, SciPy and Matplotlib — or Google Colab"],
    how: `<p>A 300 Hz tone is mixed with 2.5 kHz interference. A 101-tap FIR low-pass filter with a 1 kHz cut-off removes the interference. It's the digital version of the RC filter from the Analog branch, but with a far sharper edge. A symmetric FIR filter delays every frequency by the same amount: (taps − 1)/2 = 50 samples.</p>`,
    steps: [PY_SETUP, "Run it and compare the before/after plots and the frequency response.", "Try numtaps = 21: the edge gets softer and the 2.5 kHz tone leaks through more."],
    code: `
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import firwin, lfilter, freqz

fs = 8000
t = np.arange(0, 0.05, 1 / fs)
x = np.sin(2 * np.pi * 300 * t) + 0.5 * np.sin(2 * np.pi * 2500 * t)

taps = firwin(numtaps=101, cutoff=1000, fs=fs)     # low-pass, 1 kHz cut-off
y = lfilter(taps, 1.0, x)

w, h = freqz(taps, worN=2048, fs=fs)

fig, ax = plt.subplots(2, 1, figsize=(9, 7))
ax[0].plot(w, 20 * np.log10(np.maximum(np.abs(h), 1e-8)))
ax[0].axvline(1000, ls="--", c="gray")
ax[0].set(title="FIR frequency response", xlabel="frequency (Hz)", ylabel="gain (dB)", ylim=(-100, 5))
ax[1].plot(t * 1e3, x, alpha=0.5, label="input: 300 Hz + 2.5 kHz")
ax[1].plot(t * 1e3, y, label="filtered (delayed 50 samples)")
ax[1].set(title="Time domain", xlabel="time (ms)")
ax[1].legend()
plt.tight_layout()
plt.show()`,
    lang: "python",
    challenge: "Design a band-stop filter that removes 50 Hz mains hum from a simulated ECG-like signal.",
  },
  {
    id: "sim-spice-rc",
    category: "sim",
    platform: "spice",
    title: "RC Low-Pass Filter: SPICE AC Analysis",
    difficulty: "Easy",
    time: "45 min",
    cost: "Free",
    learn: ["Writing a SPICE netlist", "AC (frequency sweep) analysis", "Measuring the −3 dB cut-off automatically"],
    parts: ["ngspice (free, Windows/Linux/macOS) — or LTspice, drawing the same circuit"],
    how: `<p>SPICE is the circuit simulator used across the industry. A <b>netlist</b> is a text description of the circuit: each line names a component, the two nodes it connects, and its value. An AC analysis sweeps frequency and shows the gain, which should fall by 3 dB at f<sub>c</sub> = 1/(2πRC) ≈ 1 kHz.</p>`,
    steps: [
      "Install ngspice from ngspice.sourceforge.io (Linux: <code>sudo apt install ngspice</code>).",
      "Save the netlist as <code>rc.cir</code> and run <code>ngspice rc.cir</code>. A plot opens and the cut-off frequency is printed.",
      "LTspice users: draw V1 (AC 1), R1 = 1k, C1 = 159n, add the directive <code>.ac dec 50 10 100k</code>, run, and click the <i>out</i> node.",
    ],
    code: `
* RC low-pass filter: AC analysis
V1 in 0 AC 1
R1 in out 1k
C1 out 0 159n

.control
ac dec 50 10 100k
plot vdb(out)
meas ac fc WHEN vdb(out)=-3
.endc
.end`,
    lang: "spice",
    challenge: "Add a second identical RC stage and measure the new −3 dB point and the roll-off per decade.",
  },
  {
    id: "sim-spice-rect",
    category: "sim",
    platform: "spice",
    title: "Full-Wave Bridge Rectifier: SPICE Transient",
    difficulty: "Medium",
    time: "1 hour",
    cost: "Free",
    learn: ["Transient (time-domain) simulation", "Diode models", "Measuring ripple automatically"],
    parts: ["ngspice (free) — or LTspice"],
    how: `<p>This simulates the lab rectifier safely on your computer: a 12 V RMS (17 V peak) 50 Hz source, a four-diode bridge, a 2200 µF filter and a 100 Ω load. Expect an output of about 15 V with roughly 0.6 V of ripple, close to the estimate V<sub>r</sub> ≈ I ÷ (2 f C) ≈ 0.7 V.</p>`,
    steps: [
      "Save as <code>bridge.cir</code> and run <code>ngspice bridge.cir</code>.",
      "The plot shows the AC input and the smoothed DC output; the maximum, minimum and ripple are printed.",
      "Change C1 to 470u and run again: the ripple grows by about 4.7×.",
    ],
    code: `
* Full-wave bridge rectifier with capacitor filter
* 12 V RMS (17 V peak), 50 Hz source floating between nodes a and b
V1 a b SIN(0 17 50)
D1 a out DMOD
D2 b out DMOD
D3 0 a DMOD
D4 0 b DMOD
C1 out 0 2200u
RL out 0 100
.model DMOD D(IS=76.9p RS=42m N=1.45 BV=1000 IBV=5u CJO=26.5p M=0.333 TT=4.32u)

.control
tran 0.1m 100m
plot v(out) v(a)-v(b)
meas tran vmax MAX v(out) from=60m to=100m
meas tran vmin MIN v(out) from=60m to=100m
let ripple = vmax - vmin
print ripple
.endc
.end`,
    lang: "spice",
    challenge: "Add a 7805 regulator model (or an ideal 5 V Zener regulator) and show the ripple disappearing.",
  },
);

// Every earlier project is a microcontroller project, apart from the two hobby circuits.
window.PROJECTS.forEach((p) => { if (!p.category) p.category = p.platform === "analog" ? "lab" : "mcu"; });
