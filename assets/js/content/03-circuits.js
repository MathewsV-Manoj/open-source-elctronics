COURSE.push({
  id: "circuits",
  title: "Building Circuits",
  tagline: "Series, parallel, voltage dividers, Kirchhoff's laws and reading schematics.",
  icon: "🔌",
  level: "Beginner",
  lessons: [
    {
      id: "series-parallel",
      title: "Series & parallel",
      minutes: 8,
      body: `
<p class="lead">There are only two basic ways to connect two components: <strong>one after the other</strong> (series) or <strong>side by side</strong> (parallel). Every circuit, however complex, is built from these.</p>
<div class="compare">
  <div>
    <h3>Series — single lane</h3>
    <svg viewBox="0 0 220 110" aria-hidden="true">
      <rect x="10" y="20" width="200" height="70" rx="6" fill="none" class="stroke-muted" stroke-width="3"/>
      <rect x="50" y="10" width="40" height="20" class="fill-accent"/><rect x="130" y="10" width="40" height="20" class="fill-accent"/>
      <text x="70" y="50" text-anchor="middle" class="svg-small">R1</text><text x="150" y="50" text-anchor="middle" class="svg-small">R2</text>
    </svg>
    <ul><li>Same <b>current</b> through every part</li><li>Voltages <b>add up</b></li><li>R<sub>total</sub> = R1 + R2 + …</li><li>One breaks → everything stops (old festival lights!)</li></ul>
  </div>
  <div>
    <h3>Parallel — multi lane</h3>
    <svg viewBox="0 0 220 110" aria-hidden="true">
      <line x1="20" y1="15" x2="200" y2="15" class="stroke-muted" stroke-width="3"/><line x1="20" y1="95" x2="200" y2="95" class="stroke-muted" stroke-width="3"/>
      <line x1="70" y1="15" x2="70" y2="95" class="stroke-muted" stroke-width="3"/><line x1="150" y1="15" x2="150" y2="95" class="stroke-muted" stroke-width="3"/>
      <rect x="60" y="35" width="20" height="40" class="fill-accent2"/><rect x="140" y="35" width="20" height="40" class="fill-accent2"/>
      <text x="95" y="60" class="svg-small">R1</text><text x="175" y="60" class="svg-small">R2</text>
    </svg>
    <ul><li>Same <b>voltage</b> across every part</li><li>Currents <b>add up</b></li><li>1/R<sub>total</sub> = 1/R1 + 1/R2 + …</li><li>One breaks → others keep working (your home wiring)</li></ul>
  </div>
</div>
${H.analogy(`<p>Series is a <b>single-lane road with two toll booths</b>: every car goes through both, and each slows you down more. Parallel is <b>two toll booths side by side</b>: traffic splits, so total resistance goes <i>down</i>.</p>`)}
${H.key(`<p>Shortcut for two resistors in parallel: <b>R = (R1 × R2) / (R1 + R2)</b> — "product over sum". Two equal resistors in parallel give exactly half.</p>`)}
${H.widget("seriesparallel", "Series vs parallel calculator")}
`,
    },
    {
      id: "divider",
      title: "The voltage divider",
      minutes: 7,
      body: `
<p class="lead">Two resistors in series <strong>split a voltage</strong> into a smaller one. This tiny circuit is everywhere: reading sensors, level-shifting 5 V to 3.3 V, and setting reference voltages.</p>
${H.formula(`V<sub>out</sub> = V<sub>in</sub> × R2 ÷ (R1 + R2)`)}
<div class="figure">
<svg viewBox="0 0 220 220" role="img" aria-label="Voltage divider: Vin, then R1, a tap for Vout, then R2 to ground">
  <text x="100" y="18" class="svg-label">Vin</text>
  <line x1="90" y1="24" x2="90" y2="50" class="stroke-muted" stroke-width="3"/>
  <rect x="78" y="50" width="24" height="50" class="fill-accent"/><text x="112" y="80" class="svg-small">R1</text>
  <line x1="90" y1="100" x2="90" y2="130" class="stroke-muted" stroke-width="3"/>
  <line x1="90" y1="115" x2="170" y2="115" class="stroke-muted" stroke-width="3"/><circle cx="170" cy="115" r="4" class="fill-accent2"/><text x="178" y="120" class="svg-label">Vout</text>
  <rect x="78" y="130" width="24" height="50" class="fill-accent"/><text x="112" y="160" class="svg-small">R2</text>
  <line x1="90" y1="180" x2="90" y2="200" class="stroke-muted" stroke-width="3"/>
  <line x1="70" y1="200" x2="110" y2="200" class="stroke-muted" stroke-width="3"/><line x1="78" y1="207" x2="102" y2="207" class="stroke-muted" stroke-width="3"/><line x1="86" y1="214" x2="94" y2="214" class="stroke-muted" stroke-width="3"/>
</svg>
</div>
<p>Why does it work? The same current flows through both resistors (they're in series), so each gets a share of the voltage <b>in proportion to its resistance</b>. Bigger resistor → bigger share.</p>
${H.widget("divider", "Voltage divider playground")}
<h2>Real example: a light sensor</h2>
<p>Replace R2 with an <b>LDR</b> (light-dependent resistor). In darkness its resistance rises to ~1 MΩ; in bright light it drops to ~1 kΩ. So V<sub>out</sub> changes with light — and an Arduino can read that voltage. You'll build exactly this in the projects section.</p>
${H.mistake(`<p>A voltage divider is for <b>signals</b>, not for powering things. If you connect a motor to V<sub>out</sub>, it draws current and the voltage collapses. Use a regulator for power.</p>`)}
`,
    },
    {
      id: "kirchhoff",
      title: "Kirchhoff's two laws",
      minutes: 7,
      body: `
<p class="lead">Ohm's law handles one resistor. <strong>Kirchhoff's laws</strong> handle whole circuits. Both are simply common sense written as equations.</p>
<h2>KCL — Kirchhoff's Current Law</h2>
<p><b>What goes into a junction must come out.</b> Current can't pile up at a point.</p>
${H.formula(`Σ I<sub>in</sub> = Σ I<sub>out</sub>`)}
${H.analogy(`<p>At a road junction, the number of cars entering per minute equals the number leaving. Cars don't vanish or appear out of nowhere.</p>`)}
<div class="figure">
<svg viewBox="0 0 260 150" role="img" aria-label="Junction: 5 A in, 3 A and 2 A out">
  <circle cx="130" cy="75" r="7" class="fill-accent2"/>
  <line x1="10" y1="75" x2="123" y2="75" class="stroke-accent" stroke-width="4"/>
  <line x1="137" y1="70" x2="240" y2="20" class="stroke-accent" stroke-width="4"/>
  <line x1="137" y1="80" x2="240" y2="130" class="stroke-accent" stroke-width="4"/>
  <text x="50" y="65" class="svg-label">5 A</text><text x="200" y="25" class="svg-label">3 A</text><text x="200" y="140" class="svg-label">2 A</text>
</svg>
</div>

<h2>KVL — Kirchhoff's Voltage Law</h2>
<p><b>Around any closed loop, the voltages add up to zero.</b> The energy the battery gives is exactly the energy the parts use.</p>
${H.formula(`Σ V around a loop = 0`)}
${H.analogy(`<p>Walk around a hilly park and return to where you started. However many ups and downs, your total change in height is zero. Battery = climbing up the hill; resistors = walking down.</p>`)}
<h2>Worked example</h2>
<p>A 12 V battery drives R1 = 2 kΩ and R2 = 4 kΩ in series. Find the voltage across each.</p>
${H.steps([
  "Total resistance: 2k + 4k = 6 kΩ",
  "Current (Ohm's law): I = 12 / 6000 = 2 mA",
  "V<sub>R1</sub> = 2 mA × 2 kΩ = 4 V; V<sub>R2</sub> = 2 mA × 4 kΩ = 8 V",
  "Check with KVL: 12 − 4 − 8 = 0 ✓",
])}
${H.gate(`<p>KCL leads to <b>nodal analysis</b> and KVL to <b>mesh analysis</b> — the two main tools in GATE Networks. Then come Thevenin, Norton and superposition, which are all built on these two laws.</p>`)}
`,
    },
    {
      id: "schematics",
      title: "Reading schematics",
      minutes: 6,
      body: `
<p class="lead">A schematic is the <strong>map of a circuit</strong>. It shows what connects to what — not where parts physically sit. Learn these symbols and you can read circuits from anywhere in the world.</p>
<div class="symbols">
  <figure><svg viewBox="0 0 120 50"><line x1="0" y1="25" x2="30" y2="25" class="stroke-fg" stroke-width="2"/><polyline points="30,25 36,12 48,38 60,12 72,38 84,12 90,25" fill="none" class="stroke-fg" stroke-width="2"/><line x1="90" y1="25" x2="120" y2="25" class="stroke-fg" stroke-width="2"/></svg><figcaption>Resistor</figcaption></figure>
  <figure><svg viewBox="0 0 120 50"><line x1="0" y1="25" x2="54" y2="25" class="stroke-fg" stroke-width="2"/><line x1="54" y1="8" x2="54" y2="42" class="stroke-fg" stroke-width="3"/><line x1="66" y1="8" x2="66" y2="42" class="stroke-fg" stroke-width="3"/><line x1="66" y1="25" x2="120" y2="25" class="stroke-fg" stroke-width="2"/></svg><figcaption>Capacitor</figcaption></figure>
  <figure><svg viewBox="0 0 120 50"><line x1="0" y1="25" x2="20" y2="25" class="stroke-fg" stroke-width="2"/><path d="M20 25 a10 10 0 0 1 20 0 a10 10 0 0 1 20 0 a10 10 0 0 1 20 0 a10 10 0 0 1 20 0" fill="none" class="stroke-fg" stroke-width="2"/><line x1="100" y1="25" x2="120" y2="25" class="stroke-fg" stroke-width="2"/></svg><figcaption>Inductor</figcaption></figure>
  <figure><svg viewBox="0 0 120 50"><line x1="0" y1="25" x2="45" y2="25" class="stroke-fg" stroke-width="2"/><polygon points="45,10 45,40 70,25" class="fill-fg"/><line x1="70" y1="10" x2="70" y2="40" class="stroke-fg" stroke-width="3"/><line x1="70" y1="25" x2="120" y2="25" class="stroke-fg" stroke-width="2"/></svg><figcaption>Diode</figcaption></figure>
  <figure><svg viewBox="0 0 120 50"><line x1="0" y1="25" x2="45" y2="25" class="stroke-fg" stroke-width="2"/><polygon points="45,10 45,40 70,25" class="fill-fg"/><line x1="70" y1="10" x2="70" y2="40" class="stroke-fg" stroke-width="3"/><line x1="70" y1="25" x2="120" y2="25" class="stroke-fg" stroke-width="2"/><line x1="62" y1="6" x2="76" y2="-4" class="stroke-accent" stroke-width="2"/><line x1="72" y1="10" x2="86" y2="0" class="stroke-accent" stroke-width="2"/></svg><figcaption>LED</figcaption></figure>
  <figure><svg viewBox="0 0 120 50"><line x1="0" y1="25" x2="50" y2="25" class="stroke-fg" stroke-width="2"/><line x1="50" y1="5" x2="50" y2="45" class="stroke-fg" stroke-width="3"/><line x1="62" y1="15" x2="62" y2="35" class="stroke-fg" stroke-width="5"/><line x1="62" y1="25" x2="120" y2="25" class="stroke-fg" stroke-width="2"/></svg><figcaption>Battery</figcaption></figure>
  <figure><svg viewBox="0 0 120 50"><line x1="60" y1="0" x2="60" y2="22" class="stroke-fg" stroke-width="2"/><line x1="36" y1="22" x2="84" y2="22" class="stroke-fg" stroke-width="3"/><line x1="44" y1="31" x2="76" y2="31" class="stroke-fg" stroke-width="3"/><line x1="52" y1="40" x2="68" y2="40" class="stroke-fg" stroke-width="3"/></svg><figcaption>Ground (0 V)</figcaption></figure>
  <figure><svg viewBox="0 0 120 50"><line x1="0" y1="32" x2="40" y2="32" class="stroke-fg" stroke-width="2"/><line x1="40" y1="32" x2="78" y2="12" class="stroke-fg" stroke-width="2"/><line x1="80" y1="32" x2="120" y2="32" class="stroke-fg" stroke-width="2"/><circle cx="40" cy="32" r="3" class="fill-fg"/><circle cx="80" cy="32" r="3" class="fill-fg"/></svg><figcaption>Switch</figcaption></figure>
</div>
<h2>Reading tips</h2>
<ul>
  <li>A <b>dot</b> where lines cross means they're connected. No dot = they just pass over each other.</li>
  <li>All <b>ground symbols</b> are connected together, even when drawn far apart.</li>
  <li>Labels like <b>VCC</b>, <b>+5V</b> or <b>3V3</b> mean "connect to that supply".</li>
  <li>Read from <b>left (input) to right (output)</b>, power at the top, ground at the bottom.</li>
</ul>
${H.fact(`<p>Free tools like <b>KiCad</b> (for schematics and PCB design), <b>Falstad</b> (circuit simulation in your browser) and <b>Tinkercad Circuits</b> (a virtual Arduino) let you practise without buying anything.</p>`)}
`,
    },
  ],
  quiz: [
    { q: "Two 1 kΩ resistors in parallel give…", options: ["2 kΩ", "1 kΩ", "500 Ω", "250 Ω"], answer: 2, why: "Equal resistors in parallel give half: (1k × 1k)/(1k + 1k) = 500 Ω." },
    { q: "In a series circuit, which quantity is the same through every part?", options: ["Voltage", "Current", "Power", "Resistance"], answer: 1, why: "There's only one path, so the same current flows through every part." },
    { q: "Vin = 9 V, R1 = 2 kΩ, R2 = 1 kΩ. What is Vout across R2?", options: ["3 V", "6 V", "4.5 V", "1 V"], answer: 0, why: "9 × 1/(2 + 1) = 3 V." },
    { q: "Currents of 2 A and 3 A enter a node. One wire leaves. How much current is in it?", options: ["1 A", "5 A", "6 A", "0 A"], answer: 1, why: "KCL: what comes in must go out → 2 + 3 = 5 A." },
    { q: "On a schematic, two crossing wires with NO dot are…", options: ["Connected", "Not connected", "Shorted to ground", "An error"], answer: 1, why: "A dot means a junction; without one, the wires simply cross over." },
  ],
});
