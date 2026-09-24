COURSE.push({
  id: "dcomm",
  title: "Digital Communication",
  tagline: "Sampling, PCM, digital modulation, errors and multiplexing — the maths behind every phone and Wi-Fi link.",
  icon: "📶",
  level: "Intermediate → Advanced",
  lessons: [
    {
      id: "sampling",
      title: "Sampling and the Nyquist theorem",
      minutes: 9,
      body: `
<p class="lead">To send a voice or a sensor reading digitally, we first take <strong>samples</strong>: measure the signal at regular instants. But how often is often enough?</p>
<h2>The Nyquist–Shannon sampling theorem</h2>
${H.formula("f<sub>s</sub> > 2 × f<sub>max</sub>", "Sample at more than twice the highest frequency in the signal")}
<p>Meet that condition and the original signal can be rebuilt perfectly from its samples. Break it, and you get <b>aliasing</b>: a high frequency disguises itself as a false, lower one.</p>
${H.widget("sampling", "Sampling and aliasing")}
${H.analogy(`<p>In films, car wheels sometimes seem to spin slowly backwards. The camera samples at 24 frames per second — too slow for the fast-spinning spokes — so your eye sees a false, slower motion. That's aliasing.</p>`)}
${H.table(["Application", "Highest frequency", "Sampling rate used"], [
  ["Telephone voice", "3.4 kHz", "8 kHz"],
  ["CD audio", "20 kHz", "44.1 kHz"],
  ["Studio audio", "20 kHz+", "48 or 96 kHz"],
])}
${H.key(`<p>Real systems put an <b>anti-aliasing low-pass filter</b> before the ADC to remove anything above f<sub>s</sub>/2. Once a signal has been aliased, no software can undo it.</p>`)}
`,
    },
    {
      id: "pcm",
      title: "PCM: turning samples into bits",
      minutes: 8,
      body: `
<p class="lead"><strong>Pulse Code Modulation (PCM)</strong> is the standard way to digitise analog signals. It has three steps.</p>
${H.steps([
  "<b>Sample</b> at a rate above the Nyquist rate.",
  "<b>Quantise</b>: round each sample to the nearest of 2<sup>n</sup> levels.",
  "<b>Encode</b>: write each level as an n-bit binary number.",
])}
${H.formula("Bit rate = n × f<sub>s</sub>", "Telephone: 8 bits × 8000 samples/s = 64 kbit/s")}
<h2>Quantisation noise</h2>
<p>Rounding introduces a small error in every sample, heard as a faint hiss. Each extra bit halves the step size and improves the signal-to-quantisation-noise ratio by about <b>6 dB</b>.</p>
${H.formula("SQNR ≈ 6.02 n + 1.76 dB", "16-bit CD audio → about 98 dB")}
<h2>Companding</h2>
<p>Quiet sounds suffer most from quantisation noise. Telephone systems use <b>μ-law</b> (North America, Japan) or <b>A-law</b> (India, Europe) companding: small signals get finer steps, loud ones coarser steps.</p>
${H.fact(`<p>64 kbit/s — one PCM voice channel — is the basic building block of the entire telephone network. The E1 lines used in India carry 32 such time slots at 2.048 Mbit/s.</p>`)}
${H.gate(`<p>PCM bit rate, quantisation step size and SQNR calculations appear almost every year in GATE Communications.</p>`)}
`,
    },
    {
      id: "digital-mod",
      title: "Digital modulation: ASK, FSK, PSK, QAM",
      minutes: 10,
      body: `
<p class="lead">To send bits over a radio carrier, we change the carrier in a way the receiver can detect: its amplitude, frequency or phase.</p>
${H.table(["Scheme", "What changes for 0 vs 1", "Strengths", "Used in"], [
  ["ASK / OOK", "Amplitude (on/off)", "Very simple", "433 MHz remotes, RFID"],
  ["FSK / GFSK", "Frequency", "Robust, simple receivers", "Bluetooth, pagers, LoRa-like"],
  ["BPSK", "Phase: 0° or 180°", "Very noise-resistant", "GPS, deep-space links"],
  ["QPSK", "Phase: 4 values → 2 bits/symbol", "Twice BPSK's data rate", "Satellite TV, 4G/5G control"],
  ["16/64/256-QAM", "Amplitude and phase together", "Many bits per symbol", "Wi-Fi, 4G/5G data, cable modems"],
])}
<h2>Constellation diagrams</h2>
<p>Each allowed amplitude/phase combination is a dot on a 2-D plot (in-phase I on one axis, quadrature Q on the other). QPSK has 4 dots; 16-QAM has 16.</p>
<div class="figure">
<svg viewBox="0 0 360 170" role="img" aria-label="QPSK has 4 constellation points; 16-QAM has a 4 by 4 grid">
  <g transform="translate(90 85)"><line x1="-70" y1="0" x2="70" y2="0" class="stroke-muted"/><line x1="0" y1="-70" x2="0" y2="70" class="stroke-muted"/>
    ${[[-35, -35], [35, -35], [-35, 35], [35, 35]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" class="fill-accent"/>`).join("")}
    <text x="0" y="82" text-anchor="middle" class="svg-small">QPSK: 2 bits/symbol</text></g>
  <g transform="translate(270 85)"><line x1="-70" y1="0" x2="70" y2="0" class="stroke-muted"/><line x1="0" y1="-70" x2="0" y2="70" class="stroke-muted"/>
    ${[-45, -15, 15, 45].flatMap((x) => [-45, -15, 15, 45].map((y) => `<circle cx="${x}" cy="${y}" r="5" class="fill-accent2"/>`)).join("")}
    <text x="0" y="82" text-anchor="middle" class="svg-small">16-QAM: 4 bits/symbol</text></g>
</svg>
</div>
${H.key(`<p>More dots = more bits per symbol = faster, but the dots sit closer together, so noise pushes them into the wrong place more easily. Your phone constantly switches between QPSK and 256-QAM depending on signal quality. That's why speed drops when the signal gets weak.</p>`)}
<h2>Bit error rate</h2>
<p><b>BER</b> is the fraction of bits received wrongly, e.g. 10<sup>−6</sup> = one error per million bits. It falls rapidly as E<sub>b</sub>/N<sub>0</sub> (energy per bit ÷ noise density) improves. You'll plot this yourself in the BPSK simulation project.</p>
`,
    },
    {
      id: "coding-mux",
      title: "Error correction and sharing the channel",
      minutes: 8,
      body: `
<p class="lead">Even with good modulation, some bits arrive wrong. And many users must share the same air. Two final ideas solve these problems.</p>
<h2>Error detection and correction</h2>
${H.table(["Technique", "What it does", "Where"], [
  ["Parity bit", "Detects a single flipped bit", "UART, simple memory"],
  ["CRC (cyclic redundancy check)", "Detects burst errors reliably", "Ethernet, Wi-Fi, USB, CAN bus"],
  ["Hamming code", "Corrects any single-bit error", "ECC memory, teaching"],
  ["Convolutional, Turbo, LDPC, Polar codes", "Correct many errors at a cost of extra bits", "4G (Turbo), Wi-Fi & 5G data (LDPC), 5G control (Polar)"],
])}
${H.analogy(`<p>Spelling a name on the phone as "M for Mumbai, A for Agra…" adds redundancy. Even if a word is garbled, the listener can work out the letter. Error-correcting codes add carefully designed redundancy to bits in the same way.</p>`)}
<h2>Multiple access: sharing the channel</h2>
${H.table(["Method", "How users are separated", "Example"], [
  ["FDMA", "Different frequencies", "FM radio stations, 1G phones"],
  ["TDMA", "Different time slots", "GSM (2G)"],
  ["CDMA", "Different codes on the same frequency", "3G, GPS"],
  ["OFDMA", "Many narrow sub-carriers shared out in time and frequency", "4G LTE, 5G, Wi-Fi 6"],
])}
${H.fact(`<p><b>OFDM</b> splits a fast data stream across hundreds or thousands of slow, closely spaced sub-carriers, computed with an FFT. It copes well with echoes from buildings, which is why nearly every modern wireless standard uses it.</p>`)}
`,
    },
  ],
  quiz: [
    { q: "A signal has frequencies up to 4 kHz. What is the minimum (Nyquist) sampling rate?", options: ["4 kHz", "8 kHz", "2 kHz", "16 kHz"], answer: 1, why: "fs must exceed 2 × fmax = 8 kHz." },
    { q: "8-bit PCM sampled at 8 kHz gives a bit rate of…", options: ["8 kbit/s", "16 kbit/s", "64 kbit/s", "256 kbit/s"], answer: 2, why: "8 bits × 8000 samples/s = 64 kbit/s." },
    { q: "Adding one bit to a PCM quantiser improves SQNR by about…", options: ["1 dB", "3 dB", "6 dB", "10 dB"], answer: 2, why: "Each extra bit halves the step size: about 6 dB better." },
    { q: "How many bits does each 16-QAM symbol carry?", options: ["2", "4", "8", "16"], answer: 1, why: "log2(16) = 4 bits per symbol." },
    { q: "Which technique only detects errors (does not correct them)?", options: ["LDPC", "Hamming code", "CRC", "Turbo code"], answer: 2, why: "A CRC detects errors; the frame is then discarded or re-sent." },
  ],
});
