COURSE.push({
  id: "industry",
  title: "How the Electronics Industry Works",
  tagline: "From idea to product: PCB design, manufacturing, testing, certification and careers.",
  icon: "🏭",
  level: "All levels",
  lessons: [
    {
      id: "lifecycle",
      title: "From idea to product",
      minutes: 8,
      body: `
<p class="lead">A breadboard prototype is maybe 10% of the way to a real product. Here is what happens between "it works on my desk" and "it's on the shelf".</p>
${H.steps([
  "<b>Requirements</b>: what must it do, for whom, at what cost, power, size and operating temperature?",
  "<b>Architecture</b>: choose the main chips (microcontroller, sensors, radio, power), and split hardware and firmware work.",
  "<b>Proof of concept</b>: breadboards and development boards, like the projects on this site.",
  "<b>Schematic and PCB design</b>: the real circuit, drawn in a tool such as KiCad or Altium.",
  "<b>Prototype builds (EVT)</b>: first boards made and brought up; firmware developed alongside.",
  "<b>Design and production validation (DVT, PVT)</b>: stress testing, certification, and trial manufacturing runs.",
  "<b>Mass production</b>: factories assemble thousands of units with automated testing.",
  "<b>Support</b>: firmware updates, repairs, and eventually the next version.",
])}
${H.key(`<p>Real products are built by teams: hardware engineers, firmware engineers, PCB layout designers, test engineers, mechanical designers, supply-chain and quality specialists. Knowing how your part fits into the whole makes you far more valuable.</p>`)}
${H.fact(`<p>Component choice is also a business decision. A chip that's cheap today but has a long delivery time or might be discontinued can stop an entire production line, as the 2020–2022 global chip shortage showed.</p>`)}
`,
    },
    {
      id: "pcb",
      title: "PCB design and manufacturing",
      minutes: 9,
      body: `
<p class="lead">The <strong>printed circuit board (PCB)</strong> replaces breadboard wires with copper tracks on a fibreglass board. Almost every electronic product is built on one.</p>
<h2>The design flow</h2>
${H.steps([
  "<b>Schematic capture</b>: draw the circuit using component symbols (Module 3).",
  "<b>Footprints</b>: assign each part its physical pad pattern (e.g. a 0603 resistor, a QFN-32 chip).",
  "<b>Layout</b>: place parts and route copper tracks on 2, 4, 6 or more layers.",
  "<b>Design rule check (DRC)</b>: make sure track widths and gaps meet the factory's limits.",
  "<b>Gerber files + BOM</b>: export the manufacturing files and the bill of materials.",
])}
<h2>Layout rules that matter</h2>
<ul>
  <li>Put a 100 nF <b>decoupling capacitor</b> right next to every chip's power pin.</li>
  <li>Use a solid <b>ground plane</b>; keep high-current and switching loops small.</li>
  <li>Make power tracks wide enough for their current.</li>
  <li>Keep sensitive analog and RF parts away from noisy switching regulators and clocks.</li>
</ul>
<h2>How boards are made and assembled</h2>
<p>The fabricator etches copper, drills holes, plates them, and adds solder mask (usually green) and silkscreen labels. Then in <b>assembly</b>, a machine prints solder paste, a <b>pick-and-place</b> robot places surface-mount parts, and a <b>reflow oven</b> melts the solder. Automated optical inspection (AOI) and X-ray check the joints.</p>
${H.fact(`<p>You can learn all of this for free with <b>KiCad</b>, and order five small prototype boards for a few hundred rupees from online PCB services. Designing one real board for a project on this site is one of the best things you can add to a resume.</p>`)}
`,
    },
    {
      id: "testing",
      title: "Testing, standards and certification",
      minutes: 7,
      body: `
<p class="lead">Before a product can be sold, it must be proven safe, reliable and legal. This is a large part of engineering work that students rarely hear about.</p>
${H.table(["Test", "What it checks"], [
  ["Functional test", "Every unit does what it should — often automated on a test jig in the factory"],
  ["Environmental", "Heat, cold, humidity, vibration and drops"],
  ["EMC / EMI", "The device doesn't emit too much radio noise, and survives others' noise"],
  ["ESD", "It survives static discharges from human fingers"],
  ["Safety", "No shock or fire risk, especially for mains-powered products"],
  ["Reliability / burn-in", "Running units hot for long periods to catch early failures"],
])}
<h2>Certifications you'll hear about</h2>
<ul>
  <li><b>BIS</b> (Bureau of Indian Standards): compulsory registration for many electronic products sold in India.</li>
  <li><b>WPC / TEC</b>: approvals for wireless and telecom equipment in India.</li>
  <li><b>CE</b> (Europe) and <b>FCC</b> (USA): needed to sell in those markets.</li>
  <li><b>ISO 26262</b> (automotive functional safety), <b>DO-254 / DO-178C</b> (aircraft hardware/software), <b>MIL-STD</b> and <b>JSS 55555</b> (military environmental testing in the US and India): much stricter standards for safety-critical and defence systems.</li>
</ul>
${H.key(`<p>In defence and aerospace, documentation and traceability — proving exactly how every part was designed, built and tested — are as important as the circuit itself.</p>`)}
`,
    },
    {
      id: "careers",
      title: "Careers and your roadmap",
      minutes: 9,
      body: `
<p class="lead">Electronics offers many different careers. Here's a map of the main ones and a realistic plan to get into them from your first year.</p>
${H.table(["Role", "What you do", "Key skills"], [
  ["Embedded / firmware engineer", "Write the code inside devices", "C, microcontrollers, RTOS, protocols, debugging"],
  ["Hardware / board design engineer", "Design circuits and PCBs", "Analog + digital, KiCad/Altium, power, signal integrity"],
  ["VLSI design / verification engineer", "Design or verify chips", "Digital design, Verilog, SystemVerilog/UVM, STA"],
  ["Analog / RF IC designer", "Design amplifiers, ADCs, PLLs, radios on chips", "Analog circuits, device physics, SPICE (usually M.Tech/PhD)"],
  ["RF / communication engineer", "Design wireless links and systems", "Communication theory, RF, antennas, MATLAB/Python"],
  ["Power electronics engineer", "Design converters, EV and solar systems", "Power circuits, control, magnetics"],
  ["Test / validation engineer", "Prove products work and meet standards", "Instruments, automation (Python), documentation"],
  ["Field application engineer (FAE)", "Help customers use a company's chips", "Broad knowledge + communication skills"],
])}
<h2>Where the jobs are in India</h2>
<ul>
  <li><b>Public sector and research</b>: ISRO, DRDO, BEL, HAL, BARC and others. Many PSUs and some research organisations recruit through <b>GATE</b> scores or their own exams.</li>
  <li><b>Semiconductor and design companies</b>: large design centres in Bengaluru, Hyderabad, Noida, Chennai and Pune.</li>
  <li><b>Product companies and start-ups</b>: IoT, EVs, drones, defence and space technology.</li>
  <li><b>Higher studies</b>: GATE also opens M.Tech admissions at IITs, NITs and IISc, especially valuable for VLSI and RF roles.</li>
</ul>
<h2>A four-year roadmap</h2>
${H.table(["Year", "Focus"], [
  ["1st", "Foundations and Analog branches on this site; basic C programming; build 5 Arduino projects"],
  ["2nd", "Digital and Embedded branches; register-level coding; ESP32/Pico; first KiCad PCB; start GATE basics"],
  ["3rd", "Pick a direction (VLSI, embedded, communication or power); do projects in it; seek an internship"],
  ["4th", "Final-year project in your direction, GATE, placements; a portfolio on GitHub and LinkedIn"],
])}
${H.key(`<p>Projects you can explain in depth beat certificates. For every project, be able to answer: why this part, how you tested it, what failed, and what you'd improve.</p>`)}
`,
    },
  ],
  quiz: [
    { q: "What does a pick-and-place machine do?", options: ["Tests boards", "Places surface-mount components on PCBs", "Etches copper", "Writes firmware"], answer: 1, why: "It picks components from reels and places them onto solder paste." },
    { q: "Why place a 100 nF capacitor next to each chip's power pin?", options: ["To store program data", "To decouple: supply short current bursts and absorb noise", "To slow the clock", "It's only for looks"], answer: 1, why: "Decoupling capacitors keep the local supply clean during fast switching." },
    { q: "Which certification is compulsory for many electronic products sold in India?", options: ["FCC", "BIS registration", "CE", "UL"], answer: 1, why: "The Bureau of Indian Standards runs compulsory registration for many electronics." },
    { q: "EMC testing checks that a device…", options: ["Is waterproof", "Doesn't emit too much interference and tolerates others' interference", "Has enough memory", "Charges quickly"], answer: 1, why: "Electromagnetic compatibility covers both emissions and immunity." },
    { q: "Which exam do many Indian PSUs use for recruiting engineers?", options: ["JEE Main", "GATE", "CAT", "GRE"], answer: 1, why: "Many PSUs recruit engineering graduates based on GATE scores." },
  ],
});
