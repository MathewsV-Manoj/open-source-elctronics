# ⚡ OpenCircuit Academy

A free, open-source, interactive electronics course for students — from **"what is an electron?"** to **Arduino, embedded systems and VLSI**.

Every concept is explained with everyday analogies. There are hands-on simulators, a quiz at the end of each module, and a certificate that is generated automatically once you finish.

## What's inside

| # | Module | Highlights |
|---|--------|-----------|
| 1 | The Spark: What Is Electricity? | Water-tank analogy, Ohm's law, power, AC/DC, safety |
| 2 | Meet the Components | Resistor colour code, capacitors & RC, inductors, diodes/LEDs, breadboard & multimeter |
| 3 | Building Circuits | Series/parallel, voltage divider, Kirchhoff's laws, schematic symbols |
| 4 | Semiconductors & Transistors | Doping, PN junction, BJT switch, MOSFET, op-amps |
| 5 | Digital Electronics | Binary/hex, logic gates, half adder, flip-flops & clocks |
| 6 | Arduino | Board tour, Blink, buttons, ADC, PWM, Serial |
| 7 | Embedded Systems | Registers & bit manipulation, interrupts, timers, UART/I²C/SPI, RTOS |
| 8 | VLSI | CMOS, chip design flow, fabrication, first Verilog |

The course also includes:

- **17 interactive simulators**: current flow, Ohm's law, colour code, RC curve, LED resistor, series/parallel, voltage divider, transistor switch, bit flipper, logic gates, half adder, Blink, ADC, PWM, register bits, UART frame, CMOS inverter.
- **6 Arduino projects** with parts, wiring, code and a stretch challenge: traffic light, night lamp, distance meter, weather monitor, plant watering, mini radar.
- **GATE corner** notes linking topics to the GATE ECE syllabus.
- **Glossary** with search.
- **Automatic certificate**: pass every module quiz (80%+) to generate a PNG/PDF certificate with a unique ID. The certificate page also has a verify form, which recomputes the ID from the name and date.

Progress is saved in the browser's local storage. No account or server is needed.

## Run it

It's a static site with no build step:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

### Publish on GitHub Pages

Go to **Settings → Pages → Deploy from a branch**, then select the branch and the `/ (root)` folder.

## Add or edit content

- Lessons live in `assets/js/content/NN-*.js`. Each file pushes one module (lessons + quiz) onto `COURSE`.
- Helpers in `assets/js/core.js` (`H.analogy`, `H.key`, `H.mistake`, `H.gate`, `H.fact`, `H.code`, `H.widget`, `H.formula`, `H.table`, `H.steps`) keep the lesson markup short.
- Simulators are in `assets/js/widgets.js`. Place one in a lesson with `H.widget("name", "Title")`.
- Projects and glossary terms are in `assets/js/content/projects.js`.

## Author

Created by **Mathews V Manoj** — Electronics & Communication Engineering, Muthoot Institute of Technology and Science (KTU).
