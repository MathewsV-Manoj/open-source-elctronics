COURSE.push({
  id: "digital",
  title: "Digital Electronics",
  tagline: "Binary, logic gates, adders and memory — how circuits start to think.",
  icon: "🔢",
  level: "Intermediate",
  lessons: [
    {
      id: "binary",
      title: "Analog vs digital, and binary",
      minutes: 8,
      body: `
<p class="lead">The real world is <strong>analog</strong>: temperature, sound and light change smoothly. Computers are <strong>digital</strong>: they only understand <b>0</b> and <b>1</b>. Understanding this split is the first step into computing.</p>
<div class="compare">
  <div><h3>Analog</h3><svg viewBox="0 0 200 80" aria-hidden="true"><path d="M0 60 C30 10 60 70 90 30 S150 10 200 50" fill="none" class="stroke-accent2" stroke-width="3"/></svg><p>Any value in a range — like a <b>dimmer knob</b>.</p></div>
  <div><h3>Digital</h3><svg viewBox="0 0 200 80" aria-hidden="true"><polyline points="0,60 30,60 30,20 70,20 70,60 100,60 100,20 170,20 170,60 200,60" fill="none" class="stroke-accent" stroke-width="3"/></svg><p>Only HIGH (1) or LOW (0) — like a <b>light switch</b>.</p></div>
</div>
<p>Why digital? Because it's <b>noise-proof</b>. If a 5 V "1" gets a little noise and becomes 4.6 V, it's still clearly a 1. An analog signal would be permanently corrupted.</p>
<h2>Counting in binary</h2>
<p>We count in base 10 because we have ten fingers. Computers count in <b>base 2</b> because a transistor has two states. Each position is worth double the one to its right:</p>
${H.table(["128", "64", "32", "16", "8", "4", "2", "1"], [["0", "0", "1", "0", "1", "1", "0", "1"]])}
<p>32 + 8 + 4 + 1 = <b>45</b>. So 00101101 in binary = 45 in decimal.</p>
<ul>
  <li>1 <b>bit</b> = one 0 or 1</li>
  <li>1 <b>byte</b> = 8 bits (0 to 255)</li>
  <li><b>Hexadecimal</b> groups 4 bits into one symbol (0–9, A–F). 0x2D = 0010 1101 = 45.</li>
</ul>
${H.widget("binary", "Bit flipper: click the bits")}
${H.fact(`<p>An Arduino Uno's processor is <b>8-bit</b>: it handles one byte at a time. Your laptop is 64-bit. The ESP32 is 32-bit. More bits means bigger numbers in one step and more memory it can address.</p>`)}
`,
    },
    {
      id: "gates",
      title: "Logic gates",
      minutes: 9,
      body: `
<p class="lead">Logic gates are tiny decision makers. They take one or more bits as input and produce one bit as output. <strong>Every digital device — from calculators to supercomputers — is built from them.</strong></p>
${H.table(["Gate", "Rule in plain words", "Expression"], [
  ["NOT", "Flips the input", "Y = A̅"],
  ["AND", "1 only if <b>all</b> inputs are 1", "Y = A · B"],
  ["OR", "1 if <b>any</b> input is 1", "Y = A + B"],
  ["NAND", "Opposite of AND", "Y = (A · B)̅"],
  ["NOR", "Opposite of OR", "Y = (A + B)̅"],
  ["XOR", "1 if inputs are <b>different</b>", "Y = A ⊕ B"],
  ["XNOR", "1 if inputs are the <b>same</b>", "Y = (A ⊕ B)̅"],
])}
${H.analogy(`<p><b>AND</b>: a bank locker that needs <i>both</i> the manager's key AND your key. <b>OR</b>: a room with two doors — either one gets you in. <b>XOR</b>: a staircase light with two switches — flipping either one changes the light.</p>`)}
${H.widget("gates", "Logic gate playground")}
${H.key(`<p><b>NAND</b> and <b>NOR</b> are called <b>universal gates</b>: you can build every other gate using only NANDs (or only NORs). Chip factories love this — one repeated building block.</p>`)}
`,
    },
    {
      id: "combinational",
      title: "Building with gates: the adder",
      minutes: 7,
      body: `
<p class="lead">Let's make gates <em>do maths</em>. Adding two single bits gives a <strong>Sum</strong> and a <strong>Carry</strong> — exactly like adding digits in school.</p>
${H.table(["A", "B", "Carry", "Sum"], [["0", "0", "0", "0"], ["0", "1", "0", "1"], ["1", "0", "0", "1"], ["1", "1", "1", "0"]])}
<p>Look closely at the columns:</p>
<ul>
  <li><b>Sum</b> is 1 when the inputs differ → that's <b>XOR</b>!</li>
  <li><b>Carry</b> is 1 only when both are 1 → that's <b>AND</b>!</li>
</ul>
<p>So one XOR and one AND gate make a <b>half adder</b>. Chain these (as <b>full adders</b>, which also accept a carry in) and you can add 8, 16, 32 or 64-bit numbers. That's the heart of a CPU's <b>ALU</b> (Arithmetic Logic Unit).</p>
${H.widget("adder", "Half adder")}
<h2>Other combinational circuits</h2>
${H.table(["Circuit", "What it does", "Real use"], [
  ["Multiplexer (MUX)", "Picks one of many inputs using select lines", "Choosing which sensor to read"],
  ["Demultiplexer", "Sends one input to one of many outputs", "Routing data"],
  ["Decoder", "n inputs → turns on one of 2ⁿ outputs", "Selecting memory chips, 7-segment displays"],
  ["Encoder", "Opposite of decoder", "Keyboards"],
  ["Comparator", "Is A > B, A = B or A < B?", "Sorting, control logic"],
])}
${H.gate(`<p>Digital Circuits is roughly 10% of GATE ECE. K-maps, MUX-based function implementation and number systems (2's complement!) are frequent favourites.</p>`)}
`,
    },
    {
      id: "sequential",
      title: "Memory, flip-flops & clocks",
      minutes: 7,
      body: `
<p class="lead">So far, outputs depended only on current inputs. But a computer must <strong>remember</strong>. Enter <strong>sequential circuits</strong>, whose output depends on the past too.</p>
<h2>The flip-flop: a 1-bit memory</h2>
<p>By feeding a gate's output back into its input, a circuit can "latch" a value and hold it. The most common is the <b>D flip-flop</b>: on each clock tick, it copies input D to output Q and holds it until the next tick.</p>
${H.analogy(`<p>A D flip-flop is like a <b>camera</b>. The clock is the shutter button. Whatever is in front of the lens (D) at the moment of the click becomes the photo (Q), and the photo doesn't change until you click again.</p>`)}
<h2>The clock: the heartbeat</h2>
<p>A clock is a square wave that ticks steadily. Every flip-flop in a chip updates in step with it. The Arduino Uno ticks at <b>16 MHz</b> — 16 million times a second. A modern laptop CPU runs at 3–5 GHz.</p>
<div class="figure">
<svg viewBox="0 0 320 70" aria-label="Clock square wave"><polyline points="0,55 20,55 20,15 50,15 50,55 80,55 80,15 110,15 110,55 140,55 140,15 170,15 170,55 200,55 200,15 230,15 230,55 260,55 260,15 290,15 290,55 320,55" fill="none" class="stroke-accent" stroke-width="3"/></svg>
</div>
<h2>From flip-flops to computers</h2>
<ul>
  <li>8 flip-flops side by side = an 8-bit <b>register</b></li>
  <li>Flip-flops chained together = a <b>counter</b> or <b>shift register</b></li>
  <li>Millions of memory cells = <b>RAM</b></li>
  <li>Registers + ALU + control logic + clock = a <b>CPU</b></li>
</ul>
${H.key(`<p>Combinational = <b>no memory</b> (output depends only on inputs now). Sequential = <b>has memory</b> (output depends on inputs and past state). Everything digital is a mix of the two.</p>`)}
`,
    },
  ],
  quiz: [
    { q: "What is binary 1010 in decimal?", options: ["8", "10", "12", "1010"], answer: 1, why: "8 + 0 + 2 + 0 = 10." },
    { q: "Which gate outputs 1 only when its inputs are different?", options: ["AND", "OR", "XOR", "NAND"], answer: 2, why: "XOR = exclusive OR: 1 when exactly one input is 1." },
    { q: "Which gates are called universal gates?", options: ["AND and OR", "NAND and NOR", "XOR and XNOR", "NOT and buffer"], answer: 1, why: "Any logic function can be built using only NAND or only NOR gates." },
    { q: "A half adder is built from…", options: ["Two AND gates", "XOR + AND", "OR + NOT", "Two NOR gates"], answer: 1, why: "Sum = A XOR B, Carry = A AND B." },
    { q: "A D flip-flop updates its output…", options: ["Continuously", "On the clock edge", "Only at power-on", "When D changes"], answer: 1, why: "It samples D on each clock edge and holds it until the next." },
  ],
});
