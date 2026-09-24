COURSE.push({
  id: "analog",
  title: "Analog Circuits in Practice",
  tagline: "Power supplies, amplifiers, filters and oscillators — the circuits inside every real product.",
  icon: "〰️",
  level: "Intermediate",
  lessons: [
    {
      id: "psu",
      title: "From wall socket to 5 V: the power supply",
      minutes: 9,
      body: `
<p class="lead">Almost every electronic device starts with the same job: turn 230 V AC from the wall into a small, steady DC voltage. Four blocks do it, and you already know the parts inside each one.</p>
<div class="flow-diagram">
  <div class="node">Transformer<small>230 V AC → 12 V AC</small></div><div class="arrow">→</div>
  <div class="node">Rectifier<small>AC → bumpy DC</small></div><div class="arrow">→</div>
  <div class="node">Filter<small>smooths the bumps</small></div><div class="arrow">→</div>
  <div class="node hl">Regulator<small>rock-steady 5 V</small></div>
</div>
<h2>1. Transformer: step the voltage down</h2>
<p>Two coils share an iron core. AC in the first coil creates a changing magnetic field, which induces a voltage in the second. The voltage ratio equals the turns ratio.</p>
${H.formula("V<sub>s</sub> ÷ V<sub>p</sub> = N<sub>s</sub> ÷ N<sub>p</sub>", "230 V with a 20:1 turns ratio gives about 11.5 V")}
<h2>2. Rectifier: make it flow one way</h2>
<p>Diodes only conduct one way (Module 2), so they chop off the negative half of the AC wave.</p>
<ul>
  <li><b>Half-wave</b> (1 diode): keeps only the positive halves. Simple, but wastes half the energy.</li>
  <li><b>Full-wave bridge</b> (4 diodes): flips the negative halves up, so every half-cycle is used. Output ripples at 100 Hz in India (twice the 50 Hz mains).</li>
</ul>
<h2>3. Filter capacitor: fill the gaps</h2>
<p>A big capacitor charges at each peak and discharges slowly between them, smoothing the humps into nearly flat DC with a small <b>ripple</b>.</p>
${H.formula("V<sub>ripple</sub> ≈ I<sub>load</sub> ÷ (f × C)", "f = 100 Hz for a full-wave rectifier")}
<p>Example: 500 mA load, 2200 µF capacitor → 0.5 ÷ (100 × 0.0022) ≈ 2.3 V ripple. Double the capacitor to halve it.</p>
<h2>4. Regulator: hold it steady</h2>
<p>A regulator IC such as the <b>7805</b> outputs exactly 5 V as long as its input stays at least about 2 V higher. It soaks up the ripple and any change in load.</p>
${H.analogy(`<p>The filter capacitor is a <b>water tank</b> that keeps flow going between deliveries. The regulator is a <b>pressure valve</b> on the tap: however full the tank is, the tap always gives the same pressure.</p>`)}
${H.mistake(`<p>A linear regulator burns the extra voltage as heat: P = (V<sub>in</sub> − V<sub>out</sub>) × I. From 12 V to 5 V at 1 A, that's 7 W — it needs a heatsink. For efficiency, industry uses switching regulators (see Power Electronics).</p>`)}
${H.gate(`<p>Rectifier questions (peak inverse voltage, ripple factor, efficiency of half-wave vs full-wave) and Zener regulators appear regularly in GATE Analog Circuits.</p>`)}
`,
    },
    {
      id: "amplifiers",
      title: "Amplifiers: making small signals big",
      minutes: 9,
      body: `
<p class="lead">A microphone produces a few millivolts. A speaker needs volts. An antenna picks up microvolts. <strong>Amplifiers</strong> bridge that gap without changing the signal's shape.</p>
<h2>Gain, in plain words</h2>
<p><b>Gain</b> is how many times bigger the output is than the input. Engineers usually express it in <b>decibels (dB)</b>, a logarithmic scale that turns huge ratios into small, easy numbers.</p>
${H.formula("Gain (dB) = 20 × log<sub>10</sub>(V<sub>out</sub> ÷ V<sub>in</sub>)")}
${H.table(["Voltage gain", "In dB"], [["×1", "0 dB"], ["×2", "≈ 6 dB"], ["×10", "20 dB"], ["×100", "40 dB"], ["×1000", "60 dB"]])}
<h2>The common-emitter amplifier</h2>
<p>This single-transistor circuit is the "hello world" of analog design and a standard college lab experiment.</p>
<ul>
  <li><b>Biasing resistors</b> hold the transistor in its active region (Module 4), halfway between off and fully on, so the signal can swing both up and down.</li>
  <li><b>Coupling capacitors</b> let the AC signal in and out while blocking DC.</li>
  <li>The gain is roughly <b>−R<sub>C</sub> ÷ R<sub>E</sub></b>. The minus sign means the output is inverted.</li>
</ul>
${H.analogy(`<p>Biasing is like parking a swing halfway up before pushing it: now it can move forwards <i>and</i> backwards. A transistor biased at the edge would clip half of every wave.</p>`)}
<h2>Frequency response and bandwidth</h2>
<p>No amplifier works at every frequency. Coupling capacitors cut the low end; tiny internal capacitances cut the high end. The range in between, where gain stays within 3 dB of maximum, is the <b>bandwidth</b>.</p>
${H.key(`<p>Gain × bandwidth is roughly constant for a given device. Ask for more gain and you get less bandwidth. This trade-off shows up everywhere, from op-amps to RF design.</p>`)}
${H.gate(`<p>Small-signal models (h-parameters, hybrid-π), CE/CB/CC comparisons and frequency response are core GATE topics. Learn the intuition here, then practise the equations.</p>`)}
`,
    },
    {
      id: "filters",
      title: "Filters: keeping the frequencies you want",
      minutes: 9,
      body: `
<p class="lead">Every real signal is a mix of frequencies: the voice you want, plus hum, hiss and interference. <strong>Filters</strong> let some frequencies through and block others.</p>
${H.table(["Filter", "Passes", "Blocks", "Example use"], [
  ["Low-pass", "Low frequencies", "High frequencies", "Remove hiss; smooth PWM into DC"],
  ["High-pass", "High frequencies", "Low frequencies and DC", "Block DC offset; remove rumble"],
  ["Band-pass", "A chosen band", "Everything else", "Tune a radio station"],
  ["Band-stop (notch)", "Everything else", "A narrow band", "Kill 50 Hz mains hum"],
])}
<h2>The simplest filter: one resistor, one capacitor</h2>
<p>Put a resistor in series and a capacitor to ground. At low frequency the capacitor is nearly an open circuit, so the signal passes. At high frequency it's nearly a short, so the signal is drained to ground. The changeover happens at the <b>cut-off frequency</b>:</p>
${H.formula("f<sub>c</sub> = 1 ÷ (2π × R × C)", "At f<sub>c</sub> the output is 70.7% of the input (−3 dB)")}
${H.widget("rcfilter", "RC low-pass filter: frequency response")}
<p>Above f<sub>c</sub>, a first-order filter drops by <b>20 dB per decade</b> (10× in frequency → 10× smaller). Need a sharper edge? Stack more stages, or use an <b>active filter</b> with an op-amp (Butterworth, Chebyshev designs).</p>
${H.fact(`<p>The same idea runs in software. <b>Digital filters</b> (FIR and IIR) do the same job with maths on sampled data inside DSP chips, phones and radios. You'll meet them in the Communication branch.</p>`)}
`,
    },
    {
      id: "oscillators",
      title: "Oscillators: circuits that create signals",
      minutes: 7,
      body: `
<p class="lead">Amplifiers make signals bigger. <strong>Oscillators</strong> make signals from nothing — every clock, radio carrier and timer starts with one.</p>
<h2>The secret: positive feedback</h2>
<p>Feed part of an amplifier's output back into its input, <em>in phase</em>. A tiny bit of noise gets amplified, fed back, amplified again, and grows into a steady wave. For it to keep going:</p>
${H.steps([
  "Total loop gain must be at least 1 (the signal doesn't die out).",
  "Total phase shift around the loop must be 0° or 360° (the feedback adds up rather than cancels).",
])}
<p>This is the <b>Barkhausen criterion</b>.</p>
${H.analogy(`<p>Hold a microphone near its own speaker and you get a loud howl. That howl is an accidental oscillator: sound goes round the loop, gets amplified each time, and settles at one frequency.</p>`)}
${H.table(["Oscillator", "How the frequency is set", "Typical use"], [
  ["RC phase-shift / Wien bridge", "Resistors and capacitors", "Audio tones, test signals"],
  ["LC (Colpitts, Hartley)", "Inductor and capacitor resonance", "Radio frequencies"],
  ["Crystal", "Vibrating quartz crystal", "Microcontroller clocks, watches — very accurate"],
  ["555 timer (relaxation)", "RC charging/discharging", "Blinkers, PWM, simple timers"],
])}
${H.fact(`<p>A quartz watch crystal vibrates at exactly 32,768 Hz. That's 2<sup>15</sup>, so a chain of 15 flip-flops (dividing by 2 each time) turns it into precisely one tick per second.</p>`)}
`,
    },
  ],
  quiz: [
    { q: "What is the ripple frequency after a full-wave rectifier on Indian mains (50 Hz)?", options: ["25 Hz", "50 Hz", "100 Hz", "230 Hz"], answer: 2, why: "Full-wave rectification uses both half-cycles, so the humps come at twice the mains frequency." },
    { q: "A voltage gain of 100 is how many decibels?", options: ["20 dB", "40 dB", "100 dB", "10 dB"], answer: 1, why: "20 × log10(100) = 20 × 2 = 40 dB." },
    { q: "An RC low-pass filter has R = 1 kΩ and C = 1 µF. Its cut-off frequency is about…", options: ["16 Hz", "159 Hz", "1 kHz", "6.3 kHz"], answer: 1, why: "fc = 1/(2π × 1000 × 0.000001) ≈ 159 Hz." },
    { q: "For an oscillator to keep running, the loop phase shift must be…", options: ["90°", "180°", "0° or 360°", "Any value"], answer: 2, why: "Barkhausen: the feedback must add in phase (0°/360°) with loop gain ≥ 1." },
    { q: "Why does a 7805 regulator get hot when fed from 12 V?", options: ["It stores charge", "It dissipates (Vin − Vout) × I as heat", "It oscillates", "It's faulty"], answer: 1, why: "Linear regulators burn the extra voltage as heat: (12 − 5) × I." },
  ],
});
