COURSE.push({
  id: "wireless",
  title: "Wireless, RF and Radar",
  tagline: "Antennas, link budgets, Wi-Fi to 5G, satellites, navigation and radar.",
  icon: "🛰️",
  level: "Advanced",
  lessons: [
    {
      id: "antennas",
      title: "Antennas and how radio travels",
      minutes: 8,
      body: `
<p class="lead">An <strong>antenna</strong> converts electrical current into radio waves and back again. Every wireless device, from a car key to a satellite, has one.</p>
<h2>Wavelength sets the size</h2>
${H.formula("λ = c ÷ f", "c = 3 × 10⁸ m/s")}
<p>2.4 GHz Wi-Fi has λ ≈ 12.5 cm, so a quarter-wave antenna is about 3 cm — small enough to print on a circuit board.</p>
${H.table(["Antenna", "Pattern", "Typical use"], [
  ["Dipole / monopole", "All around (omnidirectional)", "FM radio, walkie-talkies, Wi-Fi routers"],
  ["PCB trace / chip antenna", "Roughly omni", "ESP32 boards, phones, IoT"],
  ["Yagi", "One direction", "TV reception, long links"],
  ["Parabolic dish", "Very narrow beam, high gain", "Satellite TV, ground stations, radar"],
  ["Phased array", "Beam steered electronically", "5G base stations, modern military radar"],
])}
<p><b>Gain</b> (in dBi) says how much an antenna concentrates power in one direction compared with an ideal antenna radiating equally everywhere. It doesn't create power; it focuses it, like a torch reflector.</p>
<h2>How waves travel</h2>
<ul>
  <li><b>Ground wave</b> (below ~2 MHz): follows the Earth's curve — AM radio.</li>
  <li><b>Sky wave</b> (3–30 MHz): bounces off the ionosphere, crossing continents — shortwave and amateur radio.</li>
  <li><b>Line of sight</b> (above ~30 MHz): travels straight, blocked by hills and buildings — FM, mobile, Wi-Fi, satellites.</li>
</ul>
${H.fact(`<p>Higher frequencies carry more data but are blocked more easily: 5G mm-wave signals can be stopped by a hand or a window. That's why 5G uses many small cells as well as large towers.</p>`)}
`,
    },
    {
      id: "link-budget",
      title: "Link budget: will the signal get there?",
      minutes: 9,
      body: `
<p class="lead">Before building any radio link — Wi-Fi, a drone controller, a satellite — engineers add up every gain and loss in decibels. This is the <strong>link budget</strong>.</p>
${H.formula("P<sub>rx</sub> = P<sub>tx</sub> + G<sub>tx</sub> + G<sub>rx</sub> − L<sub>path</sub> − L<sub>other</sub>", "all in dB / dBm")}
<h2>Free-space path loss</h2>
<p>Radio power spreads out like ripples, so it falls with the square of distance. In free space:</p>
${H.formula("FSPL (dB) = 20 log<sub>10</sub>(d<sub>km</sub>) + 20 log<sub>10</sub>(f<sub>MHz</sub>) + 32.44")}
<h2>Worked example: a 1 km drone link at 2.4 GHz</h2>
${H.steps([
  "Transmit power: 20 dBm (100 mW). Antenna gains: 2 dBi each.",
  "FSPL = 20 log(1) + 20 log(2400) + 32.44 = 0 + 67.6 + 32.44 ≈ 100 dB.",
  "Received power = 20 + 2 + 2 − 100 = −76 dBm.",
  "Receiver sensitivity: −90 dBm. <b>Margin = −76 − (−90) = 14 dB.</b> The link works, with room for trees and rain fade.",
])}
${H.key(`<p>Doubling the distance adds 6 dB of path loss. So to go twice as far you need 4× the power — or better antennas. Engineers usually want at least 10 dB of margin.</p>`)}
${H.gate(`<p>Friis transmission equation and link budget calculations appear in GATE Communications and Electromagnetics.</p>`)}
`,
    },
    {
      id: "standards",
      title: "Wireless standards: Bluetooth to 5G",
      minutes: 8,
      body: `
<p class="lead">Each wireless technology makes a different trade-off between range, data rate and power. Picking the right one is a key embedded/IoT design decision.</p>
${H.table(["Technology", "Range", "Data rate", "Power", "Good for"], [
  ["NFC", "A few cm", "424 kbit/s", "Tiny", "Contactless payments, pairing"],
  ["Bluetooth LE", "10–50 m", "1–2 Mbit/s", "Very low", "Wearables, sensors, phones"],
  ["Zigbee / Thread", "10–100 m (mesh)", "250 kbit/s", "Low", "Smart homes"],
  ["Wi-Fi 6", "30–50 m", "Up to Gbit/s", "High", "Internet, video"],
  ["LoRa / LoRaWAN", "2–15 km", "0.3–50 kbit/s", "Very low", "Farm sensors, city meters"],
  ["NB-IoT / LTE-M", "Cellular coverage", "Tens to hundreds of kbit/s", "Low", "Smart meters, trackers"],
  ["4G LTE / 5G", "Cellular coverage", "10s of Mbit/s to Gbit/s", "High", "Phones, broadband, industry"],
])}
<h2>How a cellular network is built</h2>
<p>An area is divided into <b>cells</b>, each served by a base station (in 5G, a gNodeB). Neighbouring cells reuse frequencies far enough apart not to interfere. Your phone hands over from cell to cell as you move, and everything connects to the operator's <b>core network</b> and then the internet.</p>
${H.fact(`<p>5G has three "flavours": enhanced mobile broadband (fast phones), massive machine-type communication (billions of IoT devices) and ultra-reliable low-latency communication (factory robots, remote surgery, defence). India launched 5G services in 2022.</p>`)}
`,
    },
    {
      id: "sat-radar",
      title: "Satellites, navigation and radar",
      minutes: 9,
      body: `
<p class="lead">Some of the most advanced electronics in the world fly in space or guard borders. They all build on what you've learned.</p>
<h2>Satellite communication</h2>
${H.table(["Orbit", "Height", "Round-trip delay", "Examples"], [
  ["LEO (low Earth orbit)", "500–2000 km", "~20–40 ms", "Starlink, OneWeb, Earth observation"],
  ["MEO", "~20,000 km", "~130 ms", "GPS, Galileo"],
  ["GEO (geostationary)", "35,786 km", "~500 ms+", "DTH TV, INSAT/GSAT, weather"],
])}
<p>A satellite is basically a relay: it receives on an <b>uplink</b> frequency, amplifies, shifts to a <b>downlink</b> frequency, and transmits back — a job done by devices called <b>transponders</b>.</p>
<h2>Satellite navigation</h2>
<p>A GPS or <b>NavIC</b> (India's own regional system, run by ISRO) receiver measures how long signals take to arrive from at least four satellites. Each time gives a distance; the receiver solves for its position (x, y, z) and its own clock error.</p>
<h2>Radar</h2>
<p><b>RADAR</b> (Radio Detection And Ranging) sends a pulse and times the echo — just like your ultrasonic distance meter, but with radio waves.</p>
${H.formula("Range = c × t ÷ 2", "An echo after 100 µs → 15 km away")}
<ul>
  <li><b>Doppler shift</b> in the echo gives the target's speed (police speed guns, weather radar).</li>
  <li><b>FMCW radar</b> sweeps its frequency continuously: used in cars at 77 GHz for collision warning.</li>
  <li><b>Phased-array (AESA) radars</b> steer thousands of tiny antenna elements electronically, with no moving parts. Modern fighter jets and air-defence systems rely on them.</li>
</ul>
${H.key(`<p>Radar, electronic warfare, satellite links and secure communication are core areas of <b>defence electronics</b>. In India, organisations such as DRDO labs (e.g. LRDE for radar), BEL and ISRO, plus a fast-growing set of private defence and space start-ups, work on exactly these systems.</p>`)}
`,
    },
  ],
  quiz: [
    { q: "What is the wavelength of a 300 MHz signal?", options: ["1 cm", "10 cm", "1 m", "10 m"], answer: 2, why: "λ = c/f = 3×10⁸ / 3×10⁸ = 1 m." },
    { q: "Doubling the distance in free space adds how much path loss?", options: ["3 dB", "6 dB", "10 dB", "20 dB"], answer: 1, why: "Loss grows with d², i.e. 20 log(2) ≈ 6 dB." },
    { q: "Tx 20 dBm, antenna gains 3 dBi each, path loss 110 dB. Received power?", options: ["−84 dBm", "−90 dBm", "−87 dBm", "−110 dBm"], answer: 0, why: "20 + 3 + 3 − 110 = −84 dBm." },
    { q: "Which technology best suits a battery sensor sending small readings 10 km across farmland?", options: ["Wi-Fi", "Bluetooth LE", "LoRa", "NFC"], answer: 2, why: "LoRa offers long range at very low power and low data rates." },
    { q: "A radar echo returns after 20 µs. How far is the target?", options: ["3 km", "6 km", "600 m", "30 km"], answer: 0, why: "Range = c·t/2 = 3×10⁸ × 20×10⁻⁶ / 2 = 3000 m." },
  ],
});
