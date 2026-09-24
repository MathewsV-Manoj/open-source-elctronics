COURSE.push({
  id: "power",
  title: "Power Electronics",
  tagline: "Switching regulators, inverters, motor drives, batteries, EVs and solar.",
  icon: "🔋",
  level: "Intermediate → Advanced",
  lessons: [
    {
      id: "why-switch",
      title: "Why switch? Linear vs switching power",
      minutes: 7,
      body: `
<p class="lead"><strong>Power electronics</strong> is about converting electrical energy efficiently: AC to DC, DC to AC, one voltage to another. It's in every charger, EV, solar plant and data centre.</p>
<h2>The problem with linear regulators</h2>
<p>A linear regulator (like the 7805) behaves like a variable resistor, burning the extra voltage as heat.</p>
${H.formula("Efficiency ≈ V<sub>out</sub> ÷ V<sub>in</sub>", "12 V → 5 V: only about 42% efficient")}
<h2>The switching trick</h2>
<p>A <b>switching converter</b> uses a transistor (usually a MOSFET) as a fast on/off switch, tens of kHz to several MHz. A perfect switch wastes no power: when it's on, there's no voltage across it; when it's off, no current through it. Inductors and capacitors then smooth the chopped waveform into clean DC.</p>
${H.table(["", "Linear regulator", "Switching regulator (SMPS)"], [
  ["Efficiency", "Low when Vin ≫ Vout", "85–97%"],
  ["Heat", "High", "Low"],
  ["Noise", "Very quiet", "Switching noise — needs careful layout"],
  ["Can step up voltage?", "No", "Yes (boost)"],
  ["Size and cost", "Tiny and cheap for small currents", "More parts, but smaller for high power"],
])}
${H.analogy(`<p>A linear regulator controls water flow by half-closing a tap and wasting pressure. A switching converter fills a bucket in quick full-open bursts, then pours steadily from the bucket. Much less energy is wasted.</p>`)}
${H.fact(`<p>Your phone charger is a switching power supply. That's why a 65 W laptop charger today is the size of a matchbox instead of a brick — and new GaN (gallium nitride) transistors switch even faster, shrinking chargers further.</p>`)}
`,
    },
    {
      id: "buck-boost",
      title: "Buck and boost converters",
      minutes: 9,
      body: `
<p class="lead">Two circuits cover most DC-DC conversion. Both use the same four parts: a switch, a diode (or second switch), an inductor and a capacitor.</p>
<h2>Buck: step down</h2>
<p>When the switch is on, current flows from the input through the inductor to the load, storing energy in the inductor. When it's off, the inductor keeps the current flowing through the diode. The output is the average of the chopped input:</p>
${H.formula("V<sub>out</sub> = D × V<sub>in</sub>", "D = duty cycle, the fraction of time the switch is on")}
${H.widget("buck", "Buck and boost converters: change the duty cycle")}
<h2>Boost: step up</h2>
<p>When the switch is on, the inductor charges from the input. When it turns off, the inductor's stored energy adds to the input voltage and pushes it into the output capacitor — giving a <b>higher</b> voltage than the input.</p>
${H.formula("V<sub>out</sub> = V<sub>in</sub> ÷ (1 − D)", "D = 0.5 doubles the voltage")}
${H.key(`<p>This is PWM from Module 6 doing real work. The control chip constantly measures V<sub>out</sub> and adjusts the duty cycle to hold it steady — a feedback control loop.</p>`)}
${H.table(["Converter", "Output", "Example"], [
  ["Buck", "Lower than input", "12 V → 3.3 V for a processor"],
  ["Boost", "Higher than input", "3.7 V Li-ion → 5 V USB power bank"],
  ["Buck-boost / SEPIC", "Higher or lower", "Battery devices across the full charge range"],
  ["Flyback (with transformer)", "Isolated, any ratio", "Phone and laptop chargers"],
])}
${H.gate(`<p>Buck/boost output voltage, inductor ripple current and duty-cycle calculations are standard in GATE Electrical and increasingly in ECE analog questions.</p>`)}
`,
    },
    {
      id: "inverters-motors",
      title: "Inverters and motor drives",
      minutes: 8,
      body: `
<p class="lead">An <strong>inverter</strong> does the reverse of a rectifier: it turns DC into AC. Home UPS systems, solar plants, EVs and every modern fan and AC compressor use one.</p>
<h2>The H-bridge again</h2>
<p>You met the H-bridge driving a motor in the line-follower project. Switch its four transistors in pairs, alternately, and the load sees current flowing one way, then the other: that's AC.</p>
<h2>Making a clean sine wave</h2>
<p>A simple inverter gives a square wave, which makes motors hum and heat up. <b>Sinusoidal PWM (SPWM)</b> varies the duty cycle in the shape of a sine wave; the load's inductance smooths it into a near-perfect sine.</p>
<h2>Motors and their drives</h2>
${H.table(["Motor", "How it's driven", "Where"], [
  ["Brushed DC", "PWM through an H-bridge", "Toys, small robots"],
  ["BLDC (brushless DC)", "3-phase inverter with electronic commutation", "Drones, ceiling fans (BLDC fans), e-bikes"],
  ["Induction motor", "Variable-frequency drive (VFD)", "Pumps, factories, older EVs"],
  ["PMSM", "3-phase inverter with field-oriented control", "Most modern EVs, industrial servos"],
  ["Stepper", "Step-by-step current pulses", "3D printers, CNC machines"],
])}
${H.fact(`<p>BLDC ceiling fans use about half the power of the old type, because an efficient inverter and control chip replace the lossy regulator. It's a direct example of power electronics saving energy at national scale.</p>`)}
`,
    },
    {
      id: "ev-solar",
      title: "Batteries, EVs and solar",
      minutes: 8,
      body: `
<p class="lead">The energy transition runs on power electronics. Here's how the pieces fit together in the two biggest growth areas.</p>
<h2>Inside an electric vehicle</h2>
<div class="flow-diagram">
  <div class="node">Charger<small>AC → DC (on-board or fast charger)</small></div><div class="arrow">→</div>
  <div class="node hl">Battery pack + BMS<small>hundreds of cells</small></div><div class="arrow">→</div>
  <div class="node">Traction inverter<small>DC → 3-phase AC</small></div><div class="arrow">→</div>
  <div class="node">Motor<small>PMSM / induction</small></div>
</div>
<ul>
  <li><b>BMS (battery management system)</b>: measures every cell's voltage and temperature, balances them, and protects against over-charge, over-discharge and short circuits. It's an embedded system with serious safety requirements.</li>
  <li><b>Regenerative braking</b>: when you brake, the motor becomes a generator and the inverter sends energy back into the battery.</li>
  <li>A DC-DC converter supplies the 12 V system (lights, infotainment) from the high-voltage pack.</li>
</ul>
<h2>Solar power</h2>
<p>Solar panels produce DC whose best operating point changes with sunlight and temperature. An <b>MPPT</b> (maximum power point tracking) controller — a smart buck or boost converter — keeps adjusting to extract the most power. A grid-tie inverter then synchronises with the grid's 50 Hz and feeds power in.</p>
${H.mistake(`<p>Lithium cells store a lot of energy. Short-circuited or punctured, they can catch fire. Never build or charge a lithium pack without a proper protection circuit, and never experiment with EV high-voltage systems or mains-connected inverters without supervision.</p>`)}
${H.key(`<p>Power electronics careers span EVs, charging infrastructure, solar and wind, railways, defence power systems and data centres — and India's EV and renewable targets are creating strong demand.</p>`)}
`,
    },
  ],
  quiz: [
    { q: "A linear regulator drops 12 V to 3 V. Its efficiency is roughly…", options: ["25%", "50%", "75%", "95%"], answer: 0, why: "Efficiency ≈ Vout/Vin = 3/12 = 25%." },
    { q: "An ideal buck converter with Vin = 12 V and D = 0.25 gives…", options: ["3 V", "9 V", "16 V", "48 V"], answer: 0, why: "Vout = D × Vin = 0.25 × 12 = 3 V." },
    { q: "An ideal boost converter with Vin = 5 V and D = 0.5 gives…", options: ["2.5 V", "5 V", "10 V", "15 V"], answer: 2, why: "Vout = Vin/(1 − D) = 5/0.5 = 10 V." },
    { q: "What does an inverter do?", options: ["AC → DC", "DC → AC", "Steps DC down", "Stores energy"], answer: 1, why: "An inverter converts DC to AC." },
    { q: "What is the job of an MPPT controller in a solar system?", options: ["Store energy", "Keep the panel at its maximum power point", "Convert AC to DC", "Measure sunlight"], answer: 1, why: "MPPT adjusts the converter so the panel always delivers maximum power." },
  ],
});
