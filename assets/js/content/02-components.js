COURSE.push({
  id: "components",
  title: "Meet the Components",
  tagline: "Resistors, capacitors, inductors, diodes and LEDs — the cast of every circuit.",
  icon: "🧩",
  level: "Beginner",
  lessons: [
    {
      id: "resistors",
      title: "Resistors & the colour code",
      minutes: 8,
      body: `
<p class="lead">The resistor is the humblest and most common component. Its only job is to <strong>limit current</strong>. You'll find dozens on almost every circuit board.</p>

<div class="figure">
<svg viewBox="0 0 360 90" role="img" aria-label="A resistor with four colour bands">
  <line x1="0" y1="45" x2="80" y2="45" class="stroke-muted" stroke-width="4"/>
  <line x1="280" y1="45" x2="360" y2="45" class="stroke-muted" stroke-width="4"/>
  <rect x="80" y="22" width="200" height="46" rx="20" fill="#e6c79c"/>
  <rect x="110" y="22" width="14" height="46" fill="#8b4513"/>
  <rect x="140" y="22" width="14" height="46" fill="#000"/>
  <rect x="170" y="22" width="14" height="46" fill="#ff0000"/>
  <rect x="240" y="22" width="14" height="46" fill="#d4af37"/>
</svg>
<figcaption>Brown–Black–Red–Gold = 1, 0, ×100 = 1000 Ω (1 kΩ), ±5%</figcaption>
</div>

<h2>Why do we need them?</h2>
<ul>
  <li><b>Protect parts</b> — an LED connected straight to 5 V would burn out in a flash. A resistor limits the current to a safe level.</li>
  <li><b>Divide voltages</b> — two resistors can turn 5 V into 3.3 V (you'll build this in the next module).</li>
  <li><b>Pull-up / pull-down</b> — set a default logic level on a microcontroller pin.</li>
</ul>

<h2>Reading the colour code</h2>
<p>Resistors are too small to print numbers on, so we use coloured bands. Learn this mnemonic:</p>
<p class="mnemonic"><b>B</b>. <b>B</b>. <b>R</b>. <b>O</b>. <b>Y</b>. of <b>G</b>reat <b>B</b>ritain has a <b>V</b>ery <b>G</b>ood <b>W</b>ife</p>
<div class="colorcode">
  ${[["Black", "#000", 0], ["Brown", "#8b4513", 1], ["Red", "#e10600", 2], ["Orange", "#ff8c00", 3], ["Yellow", "#ffd700", 4], ["Green", "#2e8b57", 5], ["Blue", "#1e6fd9", 6], ["Violet", "#8a2be2", 7], ["Grey", "#888", 8], ["White", "#fff", 9]]
    .map(([n, c, v]) => `<div class="cc"><span style="background:${c}"></span><b>${v}</b><small>${n}</small></div>`)
    .join("")}
</div>
${H.steps([
  "Hold the resistor with the <b>gold/silver band on the right</b>.",
  "Band 1 and band 2 are the <b>first two digits</b>.",
  "Band 3 is the <b>multiplier</b> — how many zeros to add.",
  "Band 4 is the <b>tolerance</b>: gold = ±5%, silver = ±10%.",
])}
${H.widget("colorcode", "Resistor colour code decoder")}
${H.mistake(`<p>Resistors have <b>no polarity</b> — they work either way round. But many other parts (LEDs, diodes, electrolytic capacitors) do have polarity. Don't assume!</p>`)}
`,
    },
    {
      id: "capacitors",
      title: "Capacitors: tiny rechargeable tanks",
      minutes: 8,
      body: `
<p class="lead">A capacitor <strong>stores electric charge</strong> and releases it quickly. It's like a very small, very fast battery.</p>

<h2>What's inside?</h2>
<p>Two metal plates separated by an insulator (called the <b>dielectric</b>). When you apply voltage, electrons pile up on one plate and leave the other. The charge stays there even after you disconnect — until something gives it a path to flow.</p>
<div class="figure">
<svg viewBox="0 0 300 120" role="img" aria-label="A capacitor: two plates separated by a gap">
  <line x1="0" y1="60" x2="130" y2="60" class="stroke-muted" stroke-width="4"/>
  <line x1="170" y1="60" x2="300" y2="60" class="stroke-muted" stroke-width="4"/>
  <line x1="130" y1="20" x2="130" y2="100" class="stroke-accent" stroke-width="6"/>
  <line x1="170" y1="20" x2="170" y2="100" class="stroke-accent2" stroke-width="6"/>
  <text x="112" y="30" class="svg-label">+</text><text x="180" y="30" class="svg-label">−</text>
  <text x="150" y="116" text-anchor="middle" class="svg-small">dielectric (gap)</text>
</svg>
</div>
${H.analogy(`<p>A capacitor is a <b>water balloon</b> attached to the pipe. When pressure rises it fills up; when pressure drops it squeezes water back out. That's why it <b>smooths out bumps</b> in voltage.</p>`)}

<h2>Capacitance</h2>
<p>Measured in <strong>farads (F)</strong>. One farad is huge, so real capacitors are in µF (micro, 10⁻⁶), nF (nano, 10⁻⁹) and pF (pico, 10⁻¹²).</p>
${H.formula(`Q = C × V`, "Charge stored = Capacitance × Voltage")}

<h2>Charging takes time: the RC time constant</h2>
<p>When you charge a capacitor through a resistor, it doesn't fill instantly. It follows a curve. The time constant <b>τ = R × C</b> tells you how fast:</p>
<ul><li>After 1τ → 63% charged</li><li>After 5τ → ~99% charged (considered "full")</li></ul>
${H.widget("rc", "RC charging curve")}

<h2>Where are capacitors used?</h2>
${H.table(["Use", "What it does"], [
  ["Power supply filter", "Smooths bumpy DC after rectification"],
  ["Decoupling (0.1 µF)", "Placed next to every chip to absorb tiny noise spikes"],
  ["Timing", "RC circuits set delays — 555 timers, blinking circuits"],
  ["Coupling", "Lets AC signals (audio) pass while blocking DC"],
  ["Camera flash", "Dumps stored energy in a split second"],
])}
${H.mistake(`<p><b>Electrolytic capacitors have polarity.</b> The stripe marks the − leg (the shorter one). Connect it backwards and it can bulge or even pop. Ceramic capacitors (small, yellow/brown discs) have no polarity.</p>`)}
`,
    },
    {
      id: "inductors",
      title: "Inductors: the flywheel of electronics",
      minutes: 5,
      body: `
<p class="lead">An inductor is just <strong>a coil of wire</strong>. But when current flows through it, it creates a magnetic field — and that field <em>resists changes</em> in current.</p>
${H.analogy(`<p>A capacitor resists changes in <b>voltage</b>. An inductor resists changes in <b>current</b>. Think of a heavy <b>flywheel</b> in a pipe: hard to get spinning, and once spinning, hard to stop.</p>`)}
<ul>
  <li>Measured in <strong>henries (H)</strong>; common values are µH and mH.</li>
  <li>Used in <b>DC-DC converters</b> (buck/boost), <b>radio tuning circuits</b>, <b>filters</b> and <b>transformers</b> (two coils sharing a magnetic core).</li>
  <li>When you suddenly switch off current in a coil (like a relay or motor), it produces a big voltage spike. That's why we put a <b>flyback diode</b> across motors and relays.</li>
</ul>
${H.table(["", "Resistor", "Capacitor", "Inductor"], [
  ["Stores energy?", "No (turns it into heat)", "Yes, in electric field", "Yes, in magnetic field"],
  ["Opposes change in…", "—", "Voltage", "Current"],
  ["At DC (steady)", "Resists", "Open circuit (blocks)", "Short circuit (just a wire)"],
  ["At very high frequency", "Resists", "Short (passes)", "Open (blocks)"],
])}
${H.gate(`<p>This table is gold for GATE. Capacitor = open at DC, short at high frequency. Inductor = short at DC, open at high frequency. Questions on "steady state" and "t = 0⁺" in RL/RC circuits come almost every year.</p>`)}
`,
    },
    {
      id: "diodes",
      title: "Diodes & LEDs: one-way streets",
      minutes: 8,
      body: `
<p class="lead">A diode lets current flow in <strong>only one direction</strong>. It's the electronic version of a one-way valve.</p>
<div class="figure">
<svg viewBox="0 0 320 110" role="img" aria-label="Diode symbol with anode on the left and cathode on the right">
  <line x1="0" y1="55" x2="120" y2="55" class="stroke-muted" stroke-width="4"/>
  <polygon points="120,25 120,85 180,55" class="fill-accent"/>
  <line x1="180" y1="25" x2="180" y2="85" class="stroke-accent" stroke-width="6"/>
  <line x1="180" y1="55" x2="320" y2="55" class="stroke-muted" stroke-width="4"/>
  <text x="60" y="40" text-anchor="middle" class="svg-small">Anode (+)</text>
  <text x="250" y="40" text-anchor="middle" class="svg-small">Cathode (−)</text>
  <text x="150" y="105" text-anchor="middle" class="svg-small">current flows in the direction of the arrow →</text>
</svg>
</div>
<ul>
  <li><b>Forward biased</b> (anode more positive): conducts, with a small drop of about <b>0.7 V</b> for silicon.</li>
  <li><b>Reverse biased</b>: blocks current (almost none flows).</li>
</ul>
<p>Uses: converting AC to DC (<b>rectifiers</b>), protecting circuits from reversed batteries, and flyback protection.</p>

<h2>LEDs — diodes that glow</h2>
<p>A <strong>Light Emitting Diode</strong> gives off light when current flows forward. The colour depends on the semiconductor material, and so does the forward voltage:</p>
${H.table(["Colour", "Typical forward voltage (Vf)"], [["Red", "1.8 – 2.2 V"], ["Yellow / Green", "2.0 – 2.4 V"], ["Blue / White", "3.0 – 3.4 V"]])}
<p>The <b>longer leg</b> is the anode (+). The flat edge on the rim marks the cathode (−).</p>

<h2>Every LED needs a resistor</h2>
<p>An LED has almost no resistance once it turns on. Without a resistor, current shoots up and the LED dies. Calculate the resistor like this:</p>
${H.formula(`R = (V<sub>supply</sub> − V<sub>f</sub>) ÷ I<sub>LED</sub>`)}
<p>Example: 5 V supply, red LED (2 V), want 15 mA → R = (5 − 2) / 0.015 = <b>200 Ω</b>. Nearest standard value: 220 Ω.</p>
${H.widget("led", "LED resistor calculator")}
${H.fact(`<p>Blue LEDs were so hard to make that the three scientists who cracked it — Akasaki, Amano and Nakamura — won the 2014 Nobel Prize in Physics. Without blue, there'd be no white LEDs, and no LED screens.</p>`)}
`,
    },
    {
      id: "tools",
      title: "Your toolkit: breadboard & multimeter",
      minutes: 6,
      body: `
<p class="lead">Before you build anything, meet the two tools you'll use every single day.</p>
<h2>The breadboard</h2>
<p>A breadboard lets you build circuits <strong>without soldering</strong>. Just push the component legs into the holes.</p>
<div class="figure">
<svg viewBox="0 0 360 170" role="img" aria-label="Breadboard: power rails run horizontally, terminal strips of five holes run vertically">
  <rect x="5" y="5" width="350" height="160" rx="8" class="fill-soft stroke-muted"/>
  <line x1="20" y1="20" x2="340" y2="20" stroke="#e10600" stroke-width="2"/><line x1="20" y1="34" x2="340" y2="34" stroke="#1e6fd9" stroke-width="2"/>
  <line x1="20" y1="136" x2="340" y2="136" stroke="#e10600" stroke-width="2"/><line x1="20" y1="150" x2="340" y2="150" stroke="#1e6fd9" stroke-width="2"/>
  <rect x="20" y="82" width="320" height="6" class="fill-muted"/>
  ${Array.from({ length: 14 }, (_, i) => `<rect x="${28 + i * 22}" y="44" width="8" height="34" rx="3" class="fill-accent" opacity=".5"/><rect x="${28 + i * 22}" y="92" width="8" height="34" rx="3" class="fill-accent" opacity=".5"/>`).join("")}
  <text x="345" y="30" class="svg-small" text-anchor="end">power rails</text>
</svg>
<figcaption>Each vertical strip of 5 holes (highlighted) is connected inside. The long red/blue rails carry power along the edges.</figcaption>
</div>
${H.mistake(`<p>Putting both legs of a component in the <b>same connected strip</b> shorts it out — current bypasses it. Always straddle parts across different strips, and ICs across the centre gap.</p>`)}

<h2>The multimeter</h2>
<p>Your eyes for electricity. It measures:</p>
<ul>
  <li><b>Voltage (V)</b> — probes placed <em>across</em> the part (in parallel).</li>
  <li><b>Current (A)</b> — the meter must be placed <em>in the path</em> (in series). Move the red probe to the "A" or "mA" socket!</li>
  <li><b>Resistance (Ω)</b> — only with the power <b>off</b>.</li>
  <li><b>Continuity</b> — beeps if two points are connected. Brilliant for finding broken wires.</li>
</ul>
${H.key(`<p>Voltage: across. Current: in series. Resistance: power off. Remember these three and you'll never blow a meter fuse.</p>`)}
<h2>Starter kit shopping list</h2>
${H.table(["Item", "Approx. price (₹)"], [
  ["Arduino Uno (or compatible clone)", "400 – 700"],
  ["830-point breadboard + jumper wires", "150 – 250"],
  ["Resistor kit, LEDs, push buttons", "150 – 200"],
  ["Basic digital multimeter", "300 – 500"],
  ["Sensors: LDR, DHT11, HC-SR04 ultrasonic", "250 – 350"],
])}
`,
    },
  ],
  quiz: [
    { q: "What value is a resistor with bands Yellow–Violet–Red–Gold?", options: ["47 Ω", "470 Ω", "4.7 kΩ", "47 kΩ"], answer: 2, why: "Yellow=4, Violet=7, Red=×100 → 4700 Ω = 4.7 kΩ." },
    { q: "An RC circuit has R = 10 kΩ and C = 100 µF. What is the time constant τ?", options: ["0.1 s", "1 s", "10 s", "1 ms"], answer: 1, why: "τ = RC = 10,000 × 0.0001 = 1 second." },
    { q: "At steady DC, an ideal capacitor behaves like…", options: ["A short circuit", "An open circuit", "A resistor", "A diode"], answer: 1, why: "Once fully charged, no more current flows — it's an open circuit at DC." },
    { q: "You want 10 mA through a blue LED (Vf = 3 V) from a 5 V supply. Which resistor?", options: ["50 Ω", "200 Ω", "500 Ω", "2 kΩ"], answer: 1, why: "R = (5 − 3) / 0.01 = 200 Ω." },
    { q: "How should an ammeter be connected to measure current?", options: ["In parallel across the part", "In series in the current path", "Across the battery", "With the power off"], answer: 1, why: "Current must flow through the meter, so it goes in series." },
  ],
});
