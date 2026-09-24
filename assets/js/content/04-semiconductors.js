COURSE.push({
  id: "semiconductors",
  title: "Semiconductors & Transistors",
  tagline: "The switch that changed the world — PN junctions, BJTs, MOSFETs and op-amps.",
  icon: "🔬",
  level: "Intermediate",
  lessons: [
    {
      id: "semis",
      title: "What makes a semiconductor special?",
      minutes: 7,
      body: `
<p class="lead">Conductors always conduct. Insulators never do. <strong>Semiconductors</strong> sit in between — and we can <em>control</em> how well they conduct. That control is the foundation of all modern electronics.</p>
<h2>Silicon: the star material</h2>
<p>Silicon has 4 outer electrons. In a pure crystal, every atom shares those electrons with its neighbours, so there are very few free to move. Pure silicon is a poor conductor.</p>
<h2>Doping: adding a pinch of impurity</h2>
<p>We deliberately add tiny amounts of other elements — about 1 atom in a million:</p>
<div class="compare">
  <div><h3>N-type</h3><p>Add <b>phosphorus</b> (5 outer electrons). One electron is left over and free to roam. Extra <b>N</b>egative carriers.</p></div>
  <div><h3>P-type</h3><p>Add <b>boron</b> (3 outer electrons). One bond is missing an electron, leaving a <b>"hole"</b> that acts like a <b>P</b>ositive carrier.</p></div>
</div>
${H.analogy(`<p>A <b>hole</b> is like an empty seat in a full cinema row. When the person next to it shifts over, the empty seat seems to move the other way. Holes "move" when electrons hop into them.</p>`)}
<h2>The PN junction</h2>
<p>Put P-type and N-type silicon together. Near the boundary, electrons and holes cancel out, creating a thin <b>depletion region</b> with no free carriers — a barrier of about 0.7 V.</p>
<ul>
  <li><b>Forward bias</b> (P to +, N to −): the barrier shrinks, current flows. This is the diode's "on" direction.</li>
  <li><b>Reverse bias</b>: the barrier widens, and almost no current flows.</li>
</ul>
<p>So now you know <em>why</em> a diode is a one-way street, and why it drops about 0.7 V.</p>
${H.gate(`<p>PN junction physics (depletion width, built-in potential, drift vs diffusion current) is a regular part of GATE's <b>Electronic Devices</b> section. The intuition from this lesson is exactly what those equations describe.</p>`)}
`,
    },
    {
      id: "bjt",
      title: "The BJT: a current-controlled switch",
      minutes: 9,
      body: `
<p class="lead">The transistor is the most important invention of the 20th century. At heart, it lets a <strong>small signal control a big one</strong>.</p>
<p>A <b>Bipolar Junction Transistor (BJT)</b> has three legs:</p>
<ul>
  <li><b>Base (B)</b> — the control input</li>
  <li><b>Collector (C)</b> — where the big current comes in</li>
  <li><b>Emitter (E)</b> — where it leaves (to ground, in an NPN)</li>
</ul>
<div class="figure">
<svg viewBox="0 0 220 180" role="img" aria-label="NPN transistor symbol with base, collector and emitter">
  <circle cx="120" cy="90" r="50" fill="none" class="stroke-muted" stroke-width="2"/>
  <line x1="20" y1="90" x2="100" y2="90" class="stroke-fg" stroke-width="3"/><text x="30" y="80" class="svg-label">B</text>
  <line x1="100" y1="55" x2="100" y2="125" class="stroke-fg" stroke-width="5"/>
  <line x1="100" y1="75" x2="150" y2="45" class="stroke-fg" stroke-width="3"/><line x1="150" y1="45" x2="150" y2="10" class="stroke-fg" stroke-width="3"/><text x="160" y="25" class="svg-label">C</text>
  <line x1="100" y1="105" x2="150" y2="135" class="stroke-fg" stroke-width="3"/><line x1="150" y1="135" x2="150" y2="170" class="stroke-fg" stroke-width="3"/><text x="160" y="165" class="svg-label">E</text>
  <polygon points="150,135 134,134 142,122" class="fill-fg"/>
</svg>
<figcaption>NPN transistor. The arrow on the emitter points <b>N</b>ot <b>P</b>ointing i<b>N</b>.</figcaption>
</div>
${H.analogy(`<p>Imagine a big water pipe with a gate, and a tiny side pipe that pushes the gate open. A trickle in the small pipe (base current) controls a gush in the big pipe (collector current). That's <b>amplification</b>.</p>`)}
${H.formula(`I<sub>C</sub> = β × I<sub>B</sub>`, "β (beta, also called hFE) is typically 100–300")}
<h2>Transistor as a switch</h2>
<p>An Arduino pin can only give about 20 mA. A motor needs 500 mA. Solution: let the pin drive the transistor's base, and let the transistor switch the motor.</p>
<ul>
  <li><b>Cut-off</b> (base at 0 V): transistor OFF, no collector current.</li>
  <li><b>Active</b>: collector current = β × base current. Used for amplifiers.</li>
  <li><b>Saturation</b> (enough base current): transistor fully ON, like a closed switch.</li>
</ul>
${H.widget("transistor", "Transistor switch simulator")}
${H.mistake(`<p>Never connect the base straight to an Arduino pin. Always use a <b>base resistor</b> (1 kΩ is typical), otherwise you'll draw too much current and damage the pin or transistor.</p>`)}
`,
    },
    {
      id: "mosfet",
      title: "MOSFETs: voltage-controlled switches",
      minutes: 7,
      body: `
<p class="lead">The <strong>MOSFET</strong> is the transistor that runs the modern world. Your phone's processor contains over <b>15 billion</b> of them.</p>
<p>Three terminals: <b>Gate (G)</b>, <b>Drain (D)</b>, <b>Source (S)</b>. The big difference from a BJT:</p>
${H.table(["", "BJT", "MOSFET"], [
  ["Controlled by", "Current into the base", "Voltage on the gate"],
  ["Input current", "Needs some base current", "Almost zero (gate is insulated)"],
  ["Best for", "Analog amplifiers, simple switching", "Power switching, digital chips"],
  ["Losses when ON", "V<sub>CE(sat)</sub> ≈ 0.2 V", "R<sub>DS(on)</sub> can be milliohms"],
])}
${H.analogy(`<p>A BJT is a gate you hold open by <b>continuously pushing</b> it. A MOSFET is a gate you open with a <b>magnet</b> — once the field is there, no effort is needed to keep it open.</p>`)}
<h2>How it works (the simple version)</h2>
<p>The gate is a metal plate separated from the silicon by a very thin layer of glass (silicon dioxide). Put a positive voltage on the gate, and it attracts electrons to the surface underneath, forming a <b>channel</b> that connects drain and source. Remove the voltage and the channel vanishes.</p>
<p>The voltage at which the channel forms is the <b>threshold voltage V<sub>th</sub></b>. For Arduino projects, pick a <b>"logic-level" MOSFET</b> (like IRLZ44N) that turns fully on with just 5 V.</p>
${H.fact(`<p>MOSFET = <b>M</b>etal–<b>O</b>xide–<b>S</b>emiconductor <b>F</b>ield-<b>E</b>ffect <b>T</b>ransistor. The name literally describes its layers, top to bottom. You'll meet them again in the VLSI module, where pairs of them form CMOS logic.</p>`)}
`,
    },
    {
      id: "opamp",
      title: "Op-amps: the Swiss army knife",
      minutes: 7,
      body: `
<p class="lead">An <strong>operational amplifier (op-amp)</strong> is a tiny chip with dozens of transistors inside. It amplifies the <em>difference</em> between its two inputs — and it can be configured to add, subtract, compare, filter and more.</p>
<div class="figure">
<svg viewBox="0 0 240 150" role="img" aria-label="Op-amp triangle with inverting and non-inverting inputs">
  <polygon points="70,20 70,130 190,75" fill="none" class="stroke-fg" stroke-width="3"/>
  <line x1="10" y1="50" x2="70" y2="50" class="stroke-fg" stroke-width="2"/><text x="78" y="56" class="svg-label">−</text>
  <line x1="10" y1="100" x2="70" y2="100" class="stroke-fg" stroke-width="2"/><text x="78" y="106" class="svg-label">+</text>
  <line x1="190" y1="75" x2="235" y2="75" class="stroke-fg" stroke-width="2"/><text x="200" y="68" class="svg-small">Vout</text>
</svg>
</div>
<h2>Two golden rules (with negative feedback)</h2>
${H.steps([
  "<b>No current</b> flows into the inputs.",
  "The op-amp adjusts its output until <b>V+ = V−</b>.",
])}
<p>With just these two rules you can solve almost every op-amp circuit.</p>
${H.table(["Circuit", "Gain", "Use"], [
  ["Non-inverting amplifier", "1 + Rf/R1", "Boost a sensor's small signal"],
  ["Inverting amplifier", "−Rf/R1", "Amplify and flip the sign"],
  ["Voltage follower (buffer)", "1", "Isolate a weak source from a heavy load"],
  ["Comparator (no feedback)", "Very large", "Is input above a threshold? → HIGH/LOW"],
])}
${H.gate(`<p>Op-amps are among the highest-scoring topics in GATE <b>Analog Circuits</b>. Practise virtual ground, the inverting/non-inverting gain formulas, integrators and differentiators.</p>`)}
`,
    },
  ],
  quiz: [
    { q: "Adding phosphorus to silicon creates…", options: ["P-type, extra holes", "N-type, extra electrons", "An insulator", "A conductor like copper"], answer: 1, why: "Phosphorus has 5 outer electrons — one is left free, giving N-type." },
    { q: "A BJT has β = 100 and base current 0.1 mA. Collector current in the active region is…", options: ["1 mA", "10 mA", "100 mA", "0.001 mA"], answer: 1, why: "IC = β × IB = 100 × 0.1 mA = 10 mA." },
    { q: "A MOSFET is controlled by…", options: ["Gate current", "Gate voltage", "Drain current", "Temperature"], answer: 1, why: "The insulated gate draws almost no current; its voltage creates the channel." },
    { q: "In saturation, a transistor behaves like…", options: ["An open switch", "A closed switch", "A capacitor", "An amplifier"], answer: 1, why: "Fully on — current flows freely, like a closed switch." },
    { q: "With negative feedback, an ideal op-amp makes…", options: ["V+ = V−", "Vout = 0", "Input current large", "Gain equal to 1 always"], answer: 0, why: "It drives its output so the two inputs are equal (virtual short)." },
  ],
});
