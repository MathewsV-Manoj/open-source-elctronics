/* The big idea (one sentence shown at the top of a lesson) and a
   three-point recap (shown at the end), keyed by "module/lesson". */
window.RECAPS = {
  "basics/atoms": {
    idea: "Electronics is the art of moving tiny negative particles, electrons, exactly where we want them.",
    recap: ["Atoms have a positive nucleus and negative electrons.", "Conductors have free electrons; insulators hold theirs tightly.", "Opposite charges attract — that pull is what drives every circuit."],
  },
  "basics/vir": {
    idea: "Voltage pushes, current flows, and resistance slows the flow — like pressure, water flow and a narrow pipe.",
    recap: ["Voltage (V) is the difference in electrical pressure between two points.", "Current (A) is the amount of charge flowing per second.", "Resistance (Ω) opposes current and turns energy into heat."],
  },
  "basics/ohm": {
    idea: "One tiny formula, V = I × R, predicts how every resistor in every circuit behaves.",
    recap: ["V = I × R; rearrange with the triangle to find any one of the three.", "Power P = V × I tells you how hard a part is working.", "Always check that a part's power rating is above what it will dissipate."],
  },
  "basics/acdc": {
    idea: "DC flows one way steadily; AC keeps reversing — and low-voltage DC is what we safely learn with.",
    recap: ["Batteries and USB give DC; the wall socket gives 230 V, 50 Hz AC.", "Chargers convert AC to low-voltage DC.", "Never experiment with mains as a beginner, and avoid short circuits."],
  },
  "components/resistors": {
    idea: "A resistor's only job is to limit current, and its colour bands tell you how much it resists.",
    recap: ["Bands 1–2 are digits, band 3 is the multiplier, band 4 the tolerance.", "Resistors protect parts, divide voltages and set default logic levels.", "Resistors have no polarity."],
  },
  "components/capacitors": {
    idea: "A capacitor is a tiny, fast rechargeable tank that smooths out bumps in voltage.",
    recap: ["Q = C × V; capacitance is measured in farads (usually µF, nF, pF).", "Through a resistor it charges with time constant τ = RC; about 5τ is full.", "Electrolytic capacitors have polarity — the stripe marks the − leg."],
  },
  "components/inductors": {
    idea: "An inductor is a coil that resists changes in current, like a heavy flywheel.",
    recap: ["Inductors store energy in a magnetic field, measured in henries.", "At DC an inductor is a wire; a capacitor is an open circuit.", "Switching off a coil makes a voltage spike — use a flyback diode."],
  },
  "components/diodes": {
    idea: "A diode is a one-way street for current, and an LED is a diode that glows.",
    recap: ["Silicon diodes drop about 0.7 V when conducting forward.", "LED forward voltage depends on colour (red ≈ 2 V, blue ≈ 3.2 V).", "Every LED needs a series resistor: R = (Vsupply − Vf) ÷ I."],
  },
  "components/tools": {
    idea: "A breadboard lets you build without solder, and a multimeter lets you see what electricity is doing.",
    recap: ["Each 5-hole strip on a breadboard is connected inside.", "Measure voltage across, current in series, resistance with power off.", "A basic starter kit costs under ₹2,000."],
  },
  "circuits/series-parallel": {
    idea: "Every circuit is built from two patterns: one after another (series) or side by side (parallel).",
    recap: ["Series: same current, voltages add, R = R1 + R2.", "Parallel: same voltage, currents add, 1/R = 1/R1 + 1/R2.", "Two equal resistors in parallel give half the value."],
  },
  "circuits/divider": {
    idea: "Two resistors in series split a voltage in proportion to their sizes.",
    recap: ["Vout = Vin × R2 ÷ (R1 + R2).", "Swap a resistor for a sensor (like an LDR) to read the real world.", "Dividers are for signals, not for powering loads."],
  },
  "circuits/kirchhoff": {
    idea: "What flows into a point must flow out, and the voltages around any loop add up to zero.",
    recap: ["KCL: currents entering a node = currents leaving.", "KVL: sum of voltages around a closed loop = 0.", "These two laws power nodal and mesh analysis."],
  },
  "circuits/schematics": {
    idea: "A schematic is a map of connections, written in a universal language of symbols.",
    recap: ["Learn the symbols for R, C, L, diode, LED, battery, ground and switch.", "A dot means connected; crossing without a dot means not connected.", "All ground symbols are joined together."],
  },
  "semiconductors/semis": {
    idea: "Semiconductors let us control conductivity, and that control is the root of all modern electronics.",
    recap: ["Doping with phosphorus makes N-type; boron makes P-type.", "A PN junction has a depletion region of about 0.7 V.", "Forward bias conducts; reverse bias blocks."],
  },
  "semiconductors/bjt": {
    idea: "A transistor lets a small current control a much bigger one.",
    recap: ["BJT terminals: base, collector, emitter.", "In the active region IC = β × IB; in saturation it acts as a closed switch.", "Always use a base resistor between a pin and the base."],
  },
  "semiconductors/mosfet": {
    idea: "A MOSFET is a switch opened by voltage alone — almost no input current needed.",
    recap: ["Terminals: gate, drain, source.", "A gate voltage above Vth creates a conducting channel.", "Pick a logic-level MOSFET for 5 V or 3.3 V microcontrollers."],
  },
  "semiconductors/opamp": {
    idea: "An op-amp amplifies the difference between its inputs and can be configured to do almost anything.",
    recap: ["With feedback: no current into the inputs, and V+ = V−.", "Non-inverting gain = 1 + Rf/R1; inverting gain = −Rf/R1.", "Without feedback it acts as a comparator."],
  },
  "digital/binary": {
    idea: "Digital systems use only 0 and 1, which makes them immune to small amounts of noise.",
    recap: ["Each binary place is worth double the one to its right.", "8 bits = 1 byte = 0 to 255.", "Hexadecimal packs 4 bits into one symbol."],
  },
  "digital/gates": {
    idea: "Logic gates are tiny decision makers, and everything digital is built from them.",
    recap: ["AND needs all inputs 1; OR needs any; XOR needs them different.", "NAND and NOR are universal gates.", "A truth table lists the output for every input combination."],
  },
  "digital/combinational": {
    idea: "Combine gates cleverly and they can do arithmetic.",
    recap: ["Half adder: Sum = A XOR B, Carry = A AND B.", "Chained full adders add multi-bit numbers — the heart of an ALU.", "MUX, decoder and encoder are other key combinational blocks."],
  },
  "digital/sequential": {
    idea: "Feeding outputs back into inputs lets circuits remember, and a clock keeps them in step.",
    recap: ["A D flip-flop copies D to Q on each clock edge.", "Registers, counters and RAM are built from flip-flops.", "Combinational = no memory; sequential = has memory."],
  },
  "arduino/mcu": {
    idea: "A microcontroller is a complete tiny computer on one chip, built to do one job reliably.",
    recap: ["MCUs have CPU, memory and I/O on a single chip.", "They're cheap, low power and hidden in almost every device.", "Arduino wraps an MCU in an easy board and free software."],
  },
  "arduino/board": {
    idea: "Know your board: where power comes in, which pins do what, and how much current they can give.",
    recap: ["ATmega328P: 32 KB flash, 2 KB RAM, 16 MHz.", "Pins 0–13 are digital; ~ pins do PWM; A0–A5 read analog.", "About 20 mA per pin — use transistors for bigger loads."],
  },
  "arduino/blink": {
    idea: "Every Arduino program has two parts: setup() runs once, loop() runs forever.",
    recap: ["pinMode sets a pin as input or output.", "digitalWrite drives a pin HIGH (5 V) or LOW (0 V).", "delay(ms) pauses the program."],
  },
  "arduino/input": {
    idea: "Inputs let the Arduino sense the world — and pull-ups stop them from floating.",
    recap: ["digitalRead returns HIGH or LOW.", "INPUT_PULLUP makes a pressed button read LOW.", "Mechanical buttons bounce; debounce if you count presses."],
  },
  "arduino/analog": {
    idea: "An ADC turns a smooth voltage into a number the code can use.",
    recap: ["The Uno's ADC is 10-bit: 0–1023 for 0–5 V.", "Each step is about 4.9 mV.", "A potentiometer on A0 is a perfect first analog test."],
  },
  "arduino/pwm": {
    idea: "Switch a pin on and off fast enough, and the average looks like an analog level.",
    recap: ["Duty cycle = fraction of time the signal is HIGH.", "analogWrite(pin, 0–255) sets the duty cycle on ~ pins.", "PWM dims LEDs, controls motor speed and positions servos."],
  },
  "arduino/serial": {
    idea: "The Serial Monitor is your window into what the chip is thinking.",
    recap: ["Serial.begin sets the baud rate; both sides must match.", "Serial.print sends text; Serial.read receives it.", "When stuck, print values to see what the code sees."],
  },
  "embedded/what": {
    idea: "An embedded system is a computer hidden inside a product, running sense → think → act forever.",
    recap: ["Sensors feed a microcontroller, which drives actuators.", "Memory, deadlines, power, reliability and cost are the key constraints.", "Cars, drones, satellites and defence systems all depend on them."],
  },
  "embedded/registers": {
    idea: "Underneath every Arduino function is a single bit flipped in a hardware register.",
    recap: ["Flash holds the program, SRAM the variables, EEPROM the settings.", "Set with |=, clear with &= ~, toggle with ^=.", "Register-level code is faster and is how professional firmware is written."],
  },
  "embedded/interrupts": {
    idea: "Interrupts let hardware grab the CPU's attention the moment something important happens.",
    recap: ["Keep ISRs short: set a flag, do the work in loop().", "Share variables with ISRs as volatile.", "Use millis() instead of delay() so the system stays responsive."],
  },
  "embedded/protocols": {
    idea: "UART, I²C and SPI are the three languages chips use to talk to each other.",
    recap: ["UART: 2 wires, no clock, start/data/stop bits.", "I²C: 2 shared wires, devices chosen by address.", "SPI: 4+ wires, fastest, one chip-select per device."],
  },
  "embedded/beyond": {
    idea: "Professional embedded work adds real-time scheduling, power management and more capable chips.",
    recap: ["An RTOS schedules prioritised tasks to meet deadlines.", "Battery devices sleep most of the time.", "Next steps: ESP32, then STM32 and your own PCB."],
  },
  "vlsi/intro": {
    idea: "VLSI puts billions of transistors on one chip, and it's one of the most important careers in ECE.",
    recap: ["Integration grew from ~10 transistors to over 100 billion.", "Moore's law: transistor counts doubled about every two years.", "India is investing heavily in chip design and fabrication."],
  },
  "vlsi/cmos": {
    idea: "CMOS pairs opposite transistors so one is always off — which is why chips use so little idle power.",
    recap: ["NMOS turns on with HIGH; PMOS with LOW.", "A CMOS inverter uses one of each, sharing the input.", "Dynamic power P = α·C·V²·f."],
  },
  "vlsi/flow": {
    idea: "A chip goes from idea to silicon through specification, RTL, verification, synthesis, layout and fabrication.",
    recap: ["Front-end: RTL design and verification.", "Back-end: synthesis, place & route, timing signoff.", "Fabrication builds the chip layer by layer with photolithography."],
  },
  "vlsi/verilog": {
    idea: "In Verilog you describe hardware that all exists at once — you're drawing circuits with code.",
    recap: ["assign describes continuous wires and gates.", "always @(posedge clk) describes flip-flops.", "Simulate for free on EDA Playground or with Icarus Verilog."],
  },
  "boards/choose": {
    idea: "Pick the board that fits the job: ESP32 for wireless, Pico for Python and timing, Raspberry Pi for vision and apps.",
    recap: ["Microcontrollers boot instantly and are real-time; a Pi runs Linux.", "ESP32, Pico and Pi GPIO are 3.3 V only.", "Big projects often pair a Pi with a microcontroller."],
  },
  "boards/esp32": {
    idea: "The ESP32 is an Arduino-compatible chip with Wi-Fi and Bluetooth built in.",
    recap: ["Install the esp32 board package in the Arduino IDE.", "Use ADC1 pins (GPIO 32–39) for sensors while Wi-Fi is on.", "RSSI in dBm tells you Wi-Fi signal strength."],
  },
  "boards/webserver": {
    idea: "An ESP32 can host a web page, so any phone becomes its remote control.",
    recap: ["server.on() maps a web address to a function.", "Call server.handleClient() constantly in loop().", "ESP32 only joins 2.4 GHz Wi-Fi; secure real products."],
  },
  "boards/pico": {
    idea: "With MicroPython, the Pico lets you control hardware by typing Python.",
    recap: ["Flash the MicroPython .uf2 by holding BOOTSEL.", "Program it with Thonny; the REPL runs commands instantly.", "read_u16() and duty_u16() use a 0–65535 range."],
  },
  "boards/raspi": {
    idea: "The Raspberry Pi is a full Linux computer with GPIO pins, perfect for cameras, AI and web apps.",
    recap: ["Flash Raspberry Pi OS with Raspberry Pi Imager and enable SSH.", "gpiozero makes GPIO simple and event-driven.", "The Pi has no ADC and isn't real-time — pair it with a microcontroller."],
  },
};
