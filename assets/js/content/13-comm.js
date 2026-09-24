COURSE.push({
  id: "comm",
  title: "Communication Systems: The Basics",
  tagline: "Signals, spectrum, noise and modulation — how information travels from one place to another.",
  icon: "📡",
  level: "Intermediate",
  lessons: [
    {
      id: "signals",
      title: "Signals, frequency and spectrum",
      minutes: 9,
      body: `
<p class="lead">Every communication system — a phone call, a Wi-Fi link, a satellite TV feed — does one job: move <strong>information</strong> from a transmitter to a receiver through a <strong>channel</strong>, despite noise.</p>
<div class="flow-diagram">
  <div class="node">Source<small>voice, data</small></div><div class="arrow">→</div>
  <div class="node">Transmitter<small>encode, modulate</small></div><div class="arrow">→</div>
  <div class="node hl">Channel<small>wire, air, fibre + noise</small></div><div class="arrow">→</div>
  <div class="node">Receiver<small>demodulate, decode</small></div>
</div>
<h2>Frequency</h2>
<p>A signal that repeats has a <b>frequency</b> f (cycles per second, hertz) and a <b>period</b> T = 1/f. Audio is roughly 20 Hz to 20 kHz; FM radio is around 100 MHz; Wi-Fi uses 2.4 and 5 GHz.</p>
<h2>Spectrum: seeing frequencies</h2>
<p>A French mathematician, Joseph Fourier, showed that <b>any</b> signal can be built by adding sine waves of different frequencies. The <b>spectrum</b> shows how much of each frequency a signal contains. A pure tone is one spike; a voice is a spread of spikes; noise is spread everywhere.</p>
${H.analogy(`<p>A prism splits white light into its colours. The <b>Fourier transform</b> does the same to a signal: it splits it into its frequencies. Spectrum analysers and your phone's radio chip do this millions of times a second using the FFT algorithm.</p>`)}
<h2>Bandwidth</h2>
<p><b>Bandwidth</b> is the range of frequencies a signal occupies, or a channel can carry. A voice call needs about 3.4 kHz; an HD video stream needs megahertz. More bandwidth means more data per second.</p>
<h2>The radio spectrum is shared</h2>
${H.table(["Band", "Frequency", "Examples"], [
  ["MF", "300 kHz – 3 MHz", "AM radio"],
  ["VHF", "30 – 300 MHz", "FM radio (88–108 MHz), aircraft radio"],
  ["UHF", "300 MHz – 3 GHz", "Mobile phones, GPS, TV, Wi-Fi 2.4 GHz, Bluetooth"],
  ["SHF (microwave)", "3 – 30 GHz", "Wi-Fi 5 GHz, satellite TV, radar, 5G"],
  ["EHF (mm-wave)", "30 – 300 GHz", "5G mm-wave, automotive radar (77 GHz)"],
])}
${H.fact(`<p>Radio spectrum is a limited national resource. In India it's allocated by the Department of Telecommunications, and mobile operators pay tens of thousands of crores in auctions for the right to use a few tens of megahertz.</p>`)}
`,
    },
    {
      id: "noise",
      title: "Decibels, noise and SNR",
      minutes: 8,
      body: `
<p class="lead">The enemy of every receiver is <strong>noise</strong>. Whether a link works depends on how strong the signal is compared with the noise.</p>
<h2>Decibels for power</h2>
<p>Communication engineers measure power in decibels because signals range from watts at the transmitter to trillionths of a watt at the receiver.</p>
${H.formula("P (dB) = 10 × log<sub>10</sub>(P<sub>2</sub> ÷ P<sub>1</sub>)")}
<ul>
  <li><b>dBm</b> means decibels relative to 1 milliwatt: 0 dBm = 1 mW, 30 dBm = 1 W, −90 dBm = 1 picowatt.</li>
  <li>Every <b>+3 dB</b> doubles the power; every <b>+10 dB</b> multiplies it by 10.</li>
  <li>In dB, gains and losses simply <b>add</b>: +20 dB amplifier and −6 dB cable = +14 dB overall.</li>
</ul>
<h2>Where noise comes from</h2>
<ul>
  <li><b>Thermal noise</b>: electrons jiggling because of heat, in every resistor. It can never be removed, only minimised.</li>
  <li><b>Interference</b>: other transmitters, motors, switching power supplies.</li>
  <li><b>Atmospheric and cosmic noise</b>: lightning, the sun, even the Big Bang's afterglow.</li>
</ul>
<h2>Signal-to-noise ratio</h2>
${H.formula("SNR (dB) = P<sub>signal</sub> (dBm) − P<sub>noise</sub> (dBm)")}
<p>A clear phone call might need 20 dB SNR; high-speed Wi-Fi needs 25–35 dB.</p>
<h2>The ultimate speed limit</h2>
<p>Claude Shannon proved in 1948 that no system can carry more than:</p>
${H.formula("C = B × log<sub>2</sub>(1 + SNR)", "C in bits/s, B in Hz, SNR as a plain ratio (not dB)")}
<p>Example: 1 MHz bandwidth with SNR = 1000 (30 dB) → C ≈ 1 × 10⁶ × 10 ≈ 10 Mbit/s. To go faster you need more bandwidth or a better SNR.</p>
${H.gate(`<p>Shannon capacity, dB/dBm conversions and noise figure are standard GATE Communications questions.</p>`)}
`,
    },
    {
      id: "am",
      title: "Modulation and AM",
      minutes: 9,
      body: `
<p class="lead">You can't just send a voice through the air directly. <strong>Modulation</strong> loads the message onto a high-frequency <strong>carrier</strong> wave that can travel.</p>
<h2>Why modulate?</h2>
<ul>
  <li><b>Antenna size</b>: an efficient antenna is about a quarter wavelength long. For a 1 kHz tone that's 75 km! At 100 MHz it's 75 cm.</li>
  <li><b>Sharing</b>: different stations use different carrier frequencies, so they don't overlap (frequency-division multiplexing).</li>
  <li><b>Range</b>: higher frequencies propagate in ways better suited to the job.</li>
</ul>
<h2>Amplitude modulation (AM)</h2>
<p>The carrier's <b>amplitude</b> rises and falls with the message. The outline (envelope) of the modulated wave is the message itself.</p>
${H.formula("s(t) = A<sub>c</sub>[1 + μ·m(t)] cos(2π f<sub>c</sub> t)", "μ = modulation index, between 0 and 1")}
${H.widget("am", "AM modulator: change the modulation index")}
<ul>
  <li>μ < 1: the envelope is a clean copy of the message.</li>
  <li>μ = 1: 100% modulation, the envelope just touches zero.</li>
  <li>μ > 1: <b>over-modulation</b>. The envelope folds over, and the receiver hears distortion.</li>
</ul>
<p>In the spectrum, AM creates the carrier plus two <b>sidebands</b> at f<sub>c</sub> ± f<sub>m</sub>, so the bandwidth is <b>2 × f<sub>m</sub></b>.</p>
<h2>Demodulation: getting the message back</h2>
<p>The simplest AM receiver is an <b>envelope detector</b>: a diode (rectify) plus an RC low-pass filter (smooth). You already know both parts from earlier modules.</p>
${H.key(`<p>AM is simple, but noise adds directly to its amplitude, and most of its power is wasted in the carrier. That's why modern systems use FM and digital modulation.</p>`)}
`,
    },
    {
      id: "fm-radio",
      title: "FM and the radio receiver",
      minutes: 8,
      body: `
<p class="lead">In <strong>frequency modulation (FM)</strong>, the carrier's amplitude stays constant and its <em>frequency</em> shifts up and down with the message.</p>
${H.table(["", "AM", "FM"], [
  ["What changes", "Amplitude", "Frequency"],
  ["Noise immunity", "Poor (noise adds to amplitude)", "Good (receiver ignores amplitude)"],
  ["Bandwidth", "2 × f<sub>m</sub> (narrow)", "≈ 2(Δf + f<sub>m</sub>) — Carson's rule (wider)"],
  ["Used in", "AM broadcast, aircraft radio", "FM radio (88–108 MHz), walkie-talkies"],
])}
<p>For FM broadcast, frequency deviation Δf = 75 kHz and audio f<sub>m</sub> = 15 kHz, so Carson's rule gives 2 × (75 + 15) = 180 kHz — which is why FM stations are spaced 200 kHz apart.</p>
<h2>The superheterodyne receiver</h2>
<p>Almost every radio since the 1930s uses this clever design by Edwin Armstrong:</p>
${H.steps([
  "<b>RF amplifier</b>: boosts the weak signal from the antenna.",
  "<b>Mixer + local oscillator</b>: shifts the chosen station down to a fixed <b>intermediate frequency (IF)</b> — 10.7 MHz for FM radio, 455 kHz for AM.",
  "<b>IF filter and amplifier</b>: because the IF is fixed, these can be designed very precisely to reject neighbouring stations.",
  "<b>Demodulator</b>: recovers the audio.",
  "<b>Audio amplifier</b>: drives the speaker.",
])}
${H.analogy(`<p>Instead of building a perfect filter for every station, the superhet moves every station to the <b>same</b> frequency and builds one excellent filter there. Like bringing every customer to one expert counter instead of training a clerk for each door.</p>`)}
${H.fact(`<p>Your phone uses a modern cousin: a "zero-IF" or "low-IF" receiver that mixes straight down near 0 Hz, then does everything else digitally in software (software-defined radio).</p>`)}
`,
    },
  ],
  quiz: [
    { q: "What is the period of a 50 Hz signal?", options: ["50 ms", "20 ms", "5 ms", "0.02 ms"], answer: 1, why: "T = 1/f = 1/50 = 0.02 s = 20 ms." },
    { q: "30 dBm equals…", options: ["30 mW", "1 W", "3 W", "1 mW"], answer: 1, why: "0 dBm = 1 mW; +30 dB = ×1000 → 1000 mW = 1 W." },
    { q: "An AM signal carries a 5 kHz tone. What bandwidth does it occupy?", options: ["5 kHz", "10 kHz", "2.5 kHz", "Same as the carrier"], answer: 1, why: "AM bandwidth = 2 × fm = 10 kHz." },
    { q: "Modulation index μ = 1.3 in AM causes…", options: ["Better quality", "Over-modulation and distortion", "FM", "No signal"], answer: 1, why: "When μ > 1 the envelope folds over and an envelope detector distorts." },
    { q: "Why does a superheterodyne receiver convert to an intermediate frequency?", options: ["To increase transmit power", "So one fixed, high-quality filter can select any station", "To remove the antenna", "To convert AM into FM"], answer: 1, why: "A fixed IF allows sharp, well-designed filters and amplifiers." },
  ],
});
