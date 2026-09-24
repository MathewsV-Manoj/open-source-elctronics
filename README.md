# OpenCircuit Academy

**A free, interactive electronics course: from the electron to the industry, across analog, digital, embedded, VLSI, communication and power electronics.**

**[Open the course →](https://mathewsv-manoj.github.io/open-source-electronics-try-/)**

![OpenCircuit Academy home page](docs/screenshots/home.png)

Every idea is explained in plain words with an everyday comparison. Small simulators run right on the page, so you learn by trying things. When you finish, you get a certificate you can add to LinkedIn. No sign-up, no install, no cost.

## What's inside

The course is organised into **8 branches of electronics**. Each one goes from beginner to advanced and ends with how that field works in industry: typical roles and the tools engineers use.

| # | Branch | Modules |
|---|--------|---------|
| 1 | Foundations | What is electricity? · Components · Building circuits |
| 2 | Analog Electronics | Semiconductors & transistors · Power supplies, amplifiers, filters, oscillators |
| 3 | Digital Electronics | Binary & logic · Counters, state machines, memory, ADC/DAC, FPGAs |
| 4 | Embedded Systems | Arduino · Registers, interrupts, UART/I²C/SPI, RTOS · ESP32 & Raspberry Pi |
| 5 | VLSI & Chip Design | CMOS & first Verilog · RTL rules, timing, verification, physical design |
| 6 | Communication Systems | Signals, noise, AM/FM · Sampling, PCM, digital modulation, coding · Antennas, link budgets, 5G, satellites, radar |
| 7 | Power Electronics | Switching converters, inverters, motor drives, EVs, solar |
| 8 | Industry & Careers | Product lifecycle, PCB design, testing & certification, careers roadmap |

17 modules and 74 lessons in all, with 22 simulators, a summary and recap for every lesson, a quiz for every module, "For GATE" notes, and a searchable glossary.

![A logic gate simulator inside a lesson](docs/screenshots/simulator.png)

## 43 projects in four categories

Every project includes the parts, connections and code (or the lab procedure), plus a challenge.

- **Microcontroller (21):** Arduino, ESP32, Raspberry Pi Pico and Raspberry Pi — from a traffic light to face detection
- **VLSI (5):** Verilog ALU, traffic-light FSM, UART transmitter, PWM generator, 7-segment counter — each with a self-checking testbench
- **Simulation (7):** AM, FFT spectrum analyser, BPSK bit error rate, 16-QAM, FIR filter (Python); RC filter and bridge rectifier (SPICE)
- **Lab (10):** rectifiers, Zener regulator, clippers and clampers, CE amplifier, op-amp amplifiers, RC oscillator, logic ICs, decade counter, 555 flasher, dark sensor

![The projects page](docs/screenshots/projects.png)

## Certificate

Pass every module quiz (80% or more) and a certificate with a unique ID is generated in the browser. From there you can:

- download it as an image,
- add it to your LinkedIn profile's *Licenses & certifications* in one click,
- share a ready-written post on LinkedIn or WhatsApp,
- copy a verify link (`#/verify/<id>/<date>/<name>`) that anyone can open to check it.

![Sample certificate](docs/screenshots/certificate.png)

Progress is saved in your browser. There are no accounts and no server.

## Run it locally

It's a static site with no build step:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

### Publish on GitHub Pages

In **Settings → Pages**, choose **Deploy from a branch**, select the branch and the `/ (root)` folder, and save.

## Add or edit content

- Lessons live in `assets/js/content/NN-*.js`. Each file adds one module (lessons + quiz) to `COURSE`.
- Helpers in `assets/js/core.js` (`H.analogy`, `H.key`, `H.mistake`, `H.gate`, `H.fact`, `H.code`, `H.widget`, `H.formula`, `H.table`, `H.steps`) keep lesson markup short.
- Simulators are in `assets/js/widgets.js`. Place one in a lesson with `H.widget("name", "Title")`.
- Branches (and their industry notes) are in `assets/js/content/tracks.js`.
- Lesson summaries and recaps are in `assets/js/content/recaps.js` and `recaps-more.js`.
- Projects are in `assets/js/content/projects.js` (microcontroller) and `projects-more.js` (lab, VLSI, simulation); the glossary is in `projects.js`.
- The link-preview image is `assets/og-image.png` (1200 × 630).

Found a mistake or want to add a lesson or project? Open an issue or a pull request.

## Author

Created by **Mathews V Manoj**, Electronics & Communication Engineering student at Muthoot Institute of Technology and Science (KTU), Kerala. Aspiring GATE candidate and defence-tech entrepreneur.

- LinkedIn: [linkedin.com/in/mathews-v-manoj](https://www.linkedin.com/in/mathews-v-manoj)
- Email: mathewvmanoj8@gmail.com
