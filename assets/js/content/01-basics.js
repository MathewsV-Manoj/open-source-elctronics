COURSE.push({
  id: "basics",
  title: "The Spark: What Is Electricity?",
  tagline: "Charge, voltage, current and resistance — explained with water, not jargon.",
  icon: "⚡",
  level: "Beginner",
  lessons: [
    {
      id: "atoms",
      title: "Everything starts with the electron",
      minutes: 6,
      body: `
<p class="lead">Your phone, a satellite and a missile guidance system all run on the same idea: <strong>tiny charged particles moving where we want them to go.</strong> Once you understand that one idea, electronics stops being magic.</p>

<h2>Atoms: the tiny solar systems</h2>
<p>Everything around you is made of atoms. Picture an atom as a tiny solar system:</p>
<ul>
  <li>In the centre is the <strong>nucleus</strong>, made of <strong>protons</strong> (positive charge <b>+</b>) and <strong>neutrons</strong> (no charge).</li>
  <li>Around it fly <strong>electrons</strong> (negative charge <b>−</b>). They are very light and, in some materials, very easy to push around.</li>
</ul>
<div class="figure">
<svg viewBox="0 0 320 200" role="img" aria-label="An atom with a nucleus in the centre and electrons orbiting">
  <circle cx="160" cy="95" r="50" class="stroke-muted" fill="none" stroke-dasharray="4 4"/>
  <circle cx="160" cy="95" r="80" class="stroke-muted" fill="none" stroke-dasharray="4 4"/>
  <circle cx="160" cy="95" r="20" class="fill-accent2"/>
  <text x="160" y="101" text-anchor="middle" class="svg-label-inv">+</text>
  <g class="spin" style="transform-origin:160px 95px"><circle cx="210" cy="95" r="7" class="fill-accent"/></g>
  <g class="spin slow" style="transform-origin:160px 95px"><circle cx="80" cy="95" r="7" class="fill-accent"/><circle cx="240" cy="95" r="7" class="fill-accent"/></g>
  <text x="160" y="194" text-anchor="middle" class="svg-small">Nucleus (+) in the middle, electrons (−) orbiting</text>
</svg>
</div>

<h2>Conductors and insulators</h2>
<p>In metals like <strong>copper</strong> and <strong>aluminium</strong>, the outermost electrons are loosely held. They drift from atom to atom freely, like people wandering around a crowded market. These are called <strong>free electrons</strong>, and materials full of them are <strong>conductors</strong>.</p>
<p>In <strong>plastic, rubber, glass and dry wood</strong>, electrons are held tightly. They cannot move around, so these materials are <strong>insulators</strong>. That is why wires are copper on the inside and plastic on the outside.</p>
${H.analogy(`<p>A conductor is like a <b>highway with no traffic lights</b>: electrons zoom through. An insulator is a <b>locked gate</b>: nobody gets through. Later you will meet <b>semiconductors</b> — gates that we can open and close on command. That single trick powers every computer ever made.</p>`)}

<h2>Charge</h2>
<p>We measure charge in <strong>coulombs (C)</strong>. One electron carries a tiny charge of about 1.6 × 10<sup>−19</sup> C. So one coulomb is roughly <strong>6.24 × 10<sup>18</sup> electrons</strong> — a six followed by eighteen zeros!</p>
${H.key(`<p>Like charges <b>repel</b>, opposite charges <b>attract</b>. Electrons (−) are always trying to move towards places with more positive charge. Everything in electronics is about giving them a path to do so — and making them do useful work along the way.</p>`)}
${H.fact(`<p>Electrons in a wire actually move very slowly — about a millimetre per second! But the <i>push</i> travels along the wire at nearly the speed of light, which is why a bulb lights up instantly when you flip the switch. Think of a pipe already full of marbles: push one in at one end and one pops out at the other immediately.</p>`)}
`,
    },
    {
      id: "vir",
      title: "Voltage, current & resistance",
      minutes: 8,
      body: `
<p class="lead">These three words appear in every datasheet, every circuit and every GATE paper. The best way to understand them is with a <strong>water tank</strong>.</p>

<div class="trio">
  <div class="trio-card"><div class="trio-sym">V</div><h4>Voltage</h4><p>The <b>push</b>. Like water pressure from a tank placed high up.</p><span class="unit">volts (V)</span></div>
  <div class="trio-card"><div class="trio-sym">I</div><h4>Current</h4><p>The <b>flow</b>. How much water passes a point every second.</p><span class="unit">amperes (A)</span></div>
  <div class="trio-card"><div class="trio-sym">R</div><h4>Resistance</h4><p>The <b>narrowness</b> of the pipe. A thin pipe resists flow.</p><span class="unit">ohms (Ω)</span></div>
</div>

<h2>Voltage — the push</h2>
<p>Voltage is the <strong>difference in electrical pressure</strong> between two points. A 9 V battery has a 9 V difference between its + and − terminals. Voltage is always measured <em>between two points</em> — saying "this wire is at 5 V" really means "5 V higher than ground (0 V)".</p>
${H.analogy(`<p>A water tank on a rooftop pushes water harder than one kept at ground level. The <b>height</b> of the tank is the voltage. More height = more push.</p>`)}

<h2>Current — the flow</h2>
<p>Current is <strong>how many charges pass a point each second</strong>. 1 ampere = 1 coulomb per second. An LED needs about 0.02 A (20 mA); a phone charger gives 1–3 A; a car starter motor pulls 200 A!</p>
${H.mistake(`<p><b>Conventional current</b> is drawn flowing from + to −. Real electrons move the other way (− to +). This is a historical accident — Benjamin Franklin guessed the direction before electrons were discovered. Every circuit diagram uses conventional current, so just follow the arrows and don't worry.</p>`)}

<h2>Resistance — the narrow pipe</h2>
<p>Resistance <strong>opposes the flow of current</strong>. It turns electrical energy into heat. That's not always bad: a toaster, a kettle and an old filament bulb work <em>because</em> of resistance.</p>

${H.widget("flow", "Water-tank circuit: see voltage and resistance change the flow")}
<p>Move the sliders above. Notice: <b>more voltage → faster flow</b>, <b>more resistance → slower flow</b>. That observation is exactly Ohm's law, which is next.</p>

${H.table(["Quantity", "Symbol", "Unit", "Water analogy", "Measured with"], [
  ["Voltage", "V", "volt (V)", "Pressure / tank height", "Voltmeter (across)"],
  ["Current", "I", "ampere (A)", "Flow rate", "Ammeter (in series)"],
  ["Resistance", "R", "ohm (Ω)", "Pipe narrowness", "Ohmmeter (power off)"],
])}
`,
    },
    {
      id: "ohm",
      title: "Ohm's law & power",
      minutes: 8,
      body: `
<p class="lead">In 1827 Georg Ohm found a beautifully simple rule. It is the most used formula in all of electronics — you will use it daily.</p>
${H.formula(`V = I × R`, "Voltage = Current × Resistance")}

<h2>The magic triangle</h2>
<p>Cover the quantity you want to find, and the triangle tells you the formula:</p>
<div class="figure">
<svg viewBox="0 0 240 190" role="img" aria-label="Ohm's law triangle with V on top and I and R at the bottom">
  <polygon points="120,10 230,180 10,180" class="fill-soft stroke-accent" stroke-width="3"/>
  <line x1="55" y1="110" x2="185" y2="110" class="stroke-accent" stroke-width="3"/>
  <line x1="120" y1="110" x2="120" y2="180" class="stroke-accent" stroke-width="3"/>
  <text x="120" y="88" text-anchor="middle" class="svg-big">V</text>
  <text x="80" y="160" text-anchor="middle" class="svg-big">I</text>
  <text x="160" y="160" text-anchor="middle" class="svg-big">R</text>
</svg>
</div>
<ul>
  <li>Want <b>V</b>? Cover V → I × R</li>
  <li>Want <b>I</b>? Cover I → V ÷ R</li>
  <li>Want <b>R</b>? Cover R → V ÷ I</li>
</ul>

<h2>Worked example</h2>
<p>A 9 V battery is connected to a 450 Ω resistor. What current flows?</p>
${H.steps([
  "Write what you know: V = 9 V, R = 450 Ω",
  "Pick the formula: I = V ÷ R",
  "Calculate: I = 9 ÷ 450 = 0.02 A",
  "Convert to friendly units: 0.02 A = <b>20 mA</b> — perfect for an LED!",
])}

${H.widget("ohm", "Ohm's law calculator")}

<h2>Power — how hard it's working</h2>
<p>Power is the <strong>rate of using energy</strong>, measured in <strong>watts (W)</strong>.</p>
${H.formula(`P = V × I = I² × R = V² ÷ R`)}
<p>In our example: P = 9 V × 0.02 A = 0.18 W. A normal small resistor is rated ¼ W (0.25 W), so it's safe. If you ask a ¼ W resistor to handle 1 W, it gets hot, smells, and may burn. <b>Always check power ratings.</b></p>
${H.key(`<p>V = IR tells you the current. P = VI tells you whether your parts will survive it.</p>`)}
${H.gate(`<p>Ohm's law and power are the foundation of the <b>Networks</b> section of GATE ECE (usually 8–10 marks). Get lightning-fast at rearranging V = IR and P = VI = I²R = V²/R — speed matters in the exam.</p>`)}
`,
    },
    {
      id: "acdc",
      title: "AC vs DC, and staying safe",
      minutes: 6,
      body: `
<p class="lead">There are two flavours of electricity: one flows steadily in one direction, the other swings back and forth. Both are everywhere in your life.</p>

<div class="compare">
  <div>
    <h3>DC — Direct Current</h3>
    <svg viewBox="0 0 200 80" aria-hidden="true"><line x1="0" y1="40" x2="200" y2="40" class="stroke-muted" stroke-dasharray="3 3"/><line x1="0" y1="20" x2="200" y2="20" class="stroke-accent" stroke-width="3"/></svg>
    <p>Flows in <b>one direction</b> at a steady level. From batteries, USB, solar cells. Almost all electronics (Arduino, phones, laptops) run on DC.</p>
  </div>
  <div>
    <h3>AC — Alternating Current</h3>
    <svg viewBox="0 0 200 80" aria-hidden="true"><line x1="0" y1="40" x2="200" y2="40" class="stroke-muted" stroke-dasharray="3 3"/><path d="M0 40 Q25 0 50 40 T100 40 T150 40 T200 40" class="stroke-accent2" stroke-width="3" fill="none"/></svg>
    <p>Keeps <b>reversing direction</b>. In India the wall socket gives 230 V AC at 50 Hz — it reverses 100 times per second. Easy to transmit over long distances.</p>
  </div>
</div>

<p>Your phone charger is a small box that converts <b>230 V AC → 5 V DC</b>. Inside it: a transformer (or switching circuit), a rectifier (diodes) and a filter (capacitors). By the end of the next module you'll know what every one of those parts does.</p>

<h2>Safety first — always</h2>
${H.mistake(`<p><b>Never experiment with mains (230 V AC) as a beginner.</b> It can kill. Everything in this course uses safe low voltages: 5 V from USB, 9 V batteries, or 3.3 V boards.</p>`)}
<ul>
  <li><b>Short circuits:</b> connecting + directly to − with a wire lets huge current flow. Batteries heat up and can burst.</li>
  <li><b>Lithium batteries:</b> never puncture, short or overcharge them.</li>
  <li><b>Capacitors:</b> big ones can store charge after power is off. Discharge before touching.</li>
  <li><b>Soldering iron:</b> 350 °C. Always return it to its stand.</li>
</ul>
${H.key(`<p>It's current through your body that hurts, and voltage is what pushes it. Low voltage (≤ 12 V) can't push enough current through dry skin to harm you — that's why we learn with it.</p>`)}
`,
    },
  ],
  quiz: [
    { q: "Which particle moves to create current in a copper wire?", options: ["Proton", "Neutron", "Electron", "Nucleus"], answer: 2, why: "Free electrons drift through the metal; protons stay locked in the nucleus." },
    { q: "In the water analogy, voltage is like…", options: ["The width of the pipe", "The water pressure / tank height", "The amount of water flowing", "The colour of the water"], answer: 1, why: "Voltage is the push, like pressure from a raised tank." },
    { q: "A 12 V supply drives current through a 600 Ω resistor. What is the current?", options: ["20 mA", "72 A", "0.5 A", "50 mA"], answer: 0, why: "I = V/R = 12/600 = 0.02 A = 20 mA." },
    { q: "A resistor has 5 V across it and 0.1 A through it. What power does it dissipate?", options: ["50 W", "0.5 W", "0.02 W", "5 W"], answer: 1, why: "P = V × I = 5 × 0.1 = 0.5 W — a ¼ W resistor would overheat!" },
    { q: "Which of these supplies DC?", options: ["The wall socket in India", "A 9 V battery", "A power station generator", "A transformer output"], answer: 1, why: "Batteries give steady one-direction current. The wall socket is AC." },
  ],
});
