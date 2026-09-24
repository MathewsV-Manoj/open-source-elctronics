COURSE.push({
  id: "embedded",
  title: "Embedded Systems",
  tagline: "Registers, interrupts, timers, UART/I²C/SPI and real-time thinking.",
  icon: "🛰️",
  level: "Intermediate",
  lessons: [
    {
      id: "what",
      title: "What is an embedded system?",
      minutes: 6,
      body: `
<p class="lead">An <strong>embedded system</strong> is a computer <em>built into</em> a bigger product to do one dedicated job. You don't "use" it like a laptop — you use the product, and it quietly does its work.</p>
<div class="chips">
  <span>🚗 Car ABS brakes</span><span>🫀 Pacemaker</span><span>🛩️ Drone flight controller</span><span>🚀 Satellite attitude control</span>
  <span>📡 Radar signal processor</span><span>🧺 Washing machine</span><span>⌚ Smartwatch</span><span>🎯 Missile guidance</span>
</div>
<h2>The universal structure</h2>
<div class="flow-diagram">
  <div class="node">Sensors<small>temperature, IMU, camera</small></div><div class="arrow">→</div>
  <div class="node hl">Microcontroller<small>reads, decides, controls</small></div><div class="arrow">→</div>
  <div class="node">Actuators<small>motors, LEDs, radio</small></div>
</div>
<p>Every embedded system is this loop: <b>sense → think → act</b>, repeated forever.</p>
<h2>What makes embedded different?</h2>
${H.table(["Constraint", "Why it matters"], [
  ["Limited memory", "An Uno has 2 KB of RAM. Every byte counts."],
  ["Real-time deadlines", "An airbag must fire within ~30 ms. Late = failure."],
  ["Low power", "A sensor node may run on a coin cell for 5 years."],
  ["Reliability", "No one can press 'restart' on a satellite or pacemaker."],
  ["Cost", "Saving ₹10 per unit × 1 million units = ₹1 crore."],
])}
${H.fact(`<p>A modern car contains 70–150 microcontrollers, communicating over a network called <b>CAN bus</b>. Defence systems are among the most demanding embedded environments: extreme temperatures, vibration, radiation and zero tolerance for failure.</p>`)}
`,
    },
    {
      id: "registers",
      title: "Inside the MCU: memory & registers",
      minutes: 9,
      body: `
<p class="lead">When you call <code>digitalWrite(13, HIGH)</code>, what really happens? The chip sets <strong>one bit in a special memory location called a register</strong>. Learning this is what separates a hobbyist from an embedded engineer.</p>
<h2>Three kinds of memory</h2>
${H.table(["Memory", "Uno size", "Holds", "Survives power-off?"], [
  ["Flash", "32 KB", "Your program", "Yes"],
  ["SRAM", "2 KB", "Variables while running", "No"],
  ["EEPROM", "1 KB", "Settings, calibration", "Yes"],
])}
<h2>Registers: switches controlled by bits</h2>
<p>Each I/O port is controlled by 8-bit registers. For Port B (Uno pins 8–13):</p>
<ul>
  <li><b>DDRB</b> — Data Direction: 1 = output, 0 = input</li>
  <li><b>PORTB</b> — Output value: 1 = HIGH, 0 = LOW</li>
  <li><b>PINB</b> — Read the input value</li>
</ul>
<p>Pin 13 is bit 5 of Port B. So the Blink sketch can be written with registers:</p>
${H.code(`
void setup() {
  DDRB |= (1 << 5);     // Set bit 5 → pin 13 is an output
}

void loop() {
  PORTB |= (1 << 5);    // Set bit 5   → LED on
  delay(1000);
  PORTB &= ~(1 << 5);   // Clear bit 5 → LED off
  delay(1000);
}
`)}
<h2>The four bit tricks every embedded engineer uses</h2>
${H.table(["Goal", "Code", "Why it works"], [
  ["Set bit n", "<code>reg |= (1 &lt;&lt; n)</code>", "OR with 1 forces that bit to 1"],
  ["Clear bit n", "<code>reg &amp;= ~(1 &lt;&lt; n)</code>", "AND with 0 forces that bit to 0"],
  ["Toggle bit n", "<code>reg ^= (1 &lt;&lt; n)</code>", "XOR with 1 flips it"],
  ["Read bit n", "<code>(reg &gt;&gt; n) &amp; 1</code>", "Shift it down, mask the rest"],
])}
${H.widget("register", "Register playground: set, clear and toggle bits")}
${H.key(`<p>Register-level code is about <b>50× faster</b> than <code>digitalWrite()</code> and is how professional firmware on STM32, PIC and ARM chips is written. Your logic-gate knowledge from Module 5 is exactly what's happening here.</p>`)}
`,
    },
    {
      id: "interrupts",
      title: "Interrupts & timers",
      minutes: 8,
      body: `
<p class="lead">So far our code <em>checks</em> things in a loop — called <strong>polling</strong>. But what if an event is urgent? <strong>Interrupts</strong> let hardware tap the CPU on the shoulder: "stop what you're doing, this is important!"</p>
${H.analogy(`<p><b>Polling</b> is checking your phone every 10 seconds to see if a message arrived. <b>Interrupts</b> are letting it ring — you get on with your work and respond only when needed.</p>`)}
${H.code(`
const int BUTTON = 2;              // Uno interrupt pins: 2 and 3
volatile bool pressed = false;     // 'volatile': changes outside normal flow

void onPress() {                   // ISR: Interrupt Service Routine
  pressed = true;                  // Keep ISRs short!
}

void setup() {
  Serial.begin(9600);
  pinMode(BUTTON, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(BUTTON), onPress, FALLING);
}

void loop() {
  if (pressed) {
    pressed = false;
    Serial.println("Button pressed!");
  }
  // ...the main loop is free to do other work
}
`)}
<h2>ISR golden rules</h2>
<ul>
  <li>Keep it <b>short</b> — set a flag, and do the real work in <code>loop()</code>.</li>
  <li>No <code>delay()</code> and no <code>Serial.print()</code> inside an ISR.</li>
  <li>Variables shared with the ISR must be declared <code>volatile</code>.</li>
</ul>
<h2>Timers: the chip's stopwatches</h2>
<p>Hardware timers count clock ticks independently of your code. They generate PWM, measure pulse widths and trigger interrupts at precise intervals. Even <code>millis()</code> uses Timer0.</p>
${H.code(`
// Non-blocking blink: the loop never freezes
unsigned long last = 0;
bool on = false;

void loop() {
  if (millis() - last >= 500) {
    last = millis();
    on = !on;
    digitalWrite(13, on);
  }
  // other tasks keep running here!
}
`)}
${H.mistake(`<p><code>delay()</code> freezes the whole chip. In real products, avoid it and use <code>millis()</code> timing like above, so the system can react to sensors while waiting.</p>`)}
`,
    },
    {
      id: "protocols",
      title: "Communication: UART, I²C & SPI",
      minutes: 10,
      body: `
<p class="lead">Chips need to talk — to sensors, displays, memory and each other. Three protocols cover almost everything you'll meet.</p>
<h2>UART — the phone call</h2>
<p>Two wires: <b>TX</b> (transmit) and <b>RX</b> (receive), crossed between devices. No shared clock — both sides agree on a speed (the <b>baud rate</b>) in advance. Each byte is sent as: <b>start bit (0) → 8 data bits (LSB first) → stop bit (1)</b>.</p>
${H.widget("uart", "UART frame visualiser: type a character")}
<h2>I²C — the classroom roll call</h2>
<p>Two wires shared by <b>many devices</b>: <b>SDA</b> (data) and <b>SCL</b> (clock). Each device has a unique 7-bit <b>address</b>. The controller calls an address, and only that device answers.</p>
${H.code(`
#include <Wire.h>

void setup() {
  Wire.begin();
  Serial.begin(9600);
  // Scan the bus and list every device found
  for (byte addr = 1; addr < 127; addr++) {
    Wire.beginTransmission(addr);
    if (Wire.endTransmission() == 0) {
      Serial.print("Found device at 0x");
      Serial.println(addr, HEX);
    }
  }
}

void loop() {}
`)}
<h2>SPI — the express highway</h2>
<p>Four wires: <b>MOSI</b>, <b>MISO</b>, <b>SCK</b> (clock) and <b>CS</b> (chip select, one per device). Full-duplex and fast (tens of MHz). Used for SD cards, TFT displays and fast ADCs.</p>
${H.table(["", "UART", "I²C", "SPI"], [
  ["Wires", "2 (TX, RX)", "2 (SDA, SCL)", "4 + 1 CS per device"],
  ["Clock", "None (agreed baud)", "Shared", "Shared"],
  ["Devices", "2 (point to point)", "Up to ~112 by address", "Many (one CS each)"],
  ["Speed", "~115 kbps typical", "100 k – 1 Mbps", "1 – 50+ Mbps"],
  ["Typical use", "GPS, Bluetooth, debug", "Sensors, OLED, RTC", "SD card, displays, flash"],
])}
${H.fact(`<p>Defence and aerospace also use rugged buses like <b>MIL-STD-1553</b> (aircraft), <b>CAN</b> (vehicles) and <b>RS-485</b> (industrial) — all built on the same ideas you just learned.</p>`)}
`,
    },
    {
      id: "beyond",
      title: "RTOS, low power & beyond Arduino",
      minutes: 7,
      body: `
<p class="lead">You've mastered the fundamentals. Here's the map of where professional embedded engineering goes next.</p>
<h2>Super-loop vs RTOS</h2>
<p>Arduino code is a <b>super-loop</b>: one big <code>loop()</code> doing everything in turn. It's fine for simple jobs. When a system has many tasks with strict deadlines (read the IMU every 1 ms, update the display every 100 ms, send telemetry every second), engineers use a <strong>Real-Time Operating System (RTOS)</strong> such as <b>FreeRTOS</b> or <b>Zephyr</b>.</p>
<ul>
  <li><b>Tasks</b> — independent functions, each with a priority</li>
  <li><b>Scheduler</b> — decides which task runs, and guarantees deadlines</li>
  <li><b>Queues, semaphores, mutexes</b> — safe communication between tasks</li>
</ul>
<h2>Low power</h2>
<p>Battery devices spend most of their life <b>asleep</b>. They wake on a timer or interrupt, do their job in milliseconds, then sleep again. That's how a sensor runs for years on one battery.</p>
<h2>Your next boards</h2>
${H.table(["Board", "Why learn it"], [
  ["ESP32", "Dual-core 240 MHz, Wi-Fi + Bluetooth, cheap (~₹400). IoT projects, and runs FreeRTOS by default."],
  ["STM32 (e.g. Blue Pill / Nucleo)", "32-bit ARM Cortex-M — the industry standard. Learn STM32CubeIDE and HAL/register programming."],
  ["Raspberry Pi Pico", "RP2040 chip, programmable in C or MicroPython, with unique PIO blocks."],
  ["Raspberry Pi 4/5", "Not an MCU — a full Linux computer. For camera, vision and AI at the edge."],
])}
<h2>Suggested learning path</h2>
${H.steps([
  "Build 5–10 Arduino projects (see the Projects page).",
  "Rewrite one project using registers and interrupts instead of Arduino functions.",
  "Move to ESP32: add Wi-Fi and try FreeRTOS tasks.",
  "Move to STM32: read the reference manual and write a UART driver yourself.",
  "Design your own PCB in KiCad for a project and get it manufactured.",
])}
${H.key(`<p>Great embedded engineers understand <b>both</b> the hardware (voltage, current, timing) and the software (C, memory, interrupts). This course is designed to give you both halves.</p>`)}
`,
    },
  ],
  quiz: [
    { q: "Which of these is NOT usually an embedded system?", options: ["Washing machine controller", "Drone flight controller", "General-purpose desktop PC", "Car ABS module"], answer: 2, why: "A desktop PC is general-purpose, not dedicated to a single job." },
    { q: "Which C expression clears bit 3 of register REG?", options: ["REG |= (1 << 3)", "REG &= ~(1 << 3)", "REG ^= (1 << 3)", "REG = 3"], answer: 1, why: "AND with a mask that has 0 at bit 3 forces it to 0." },
    { q: "Variables shared between an ISR and loop() should be declared…", options: ["static", "const", "volatile", "global only"], answer: 2, why: "volatile tells the compiler the value may change unexpectedly, so it always re-reads it." },
    { q: "Which protocol uses addresses to talk to many devices over 2 shared wires?", options: ["UART", "I²C", "SPI", "PWM"], answer: 1, why: "I²C uses SDA + SCL, and each device has its own address." },
    { q: "In a UART frame, what comes first?", options: ["Stop bit (1)", "Start bit (0)", "Parity bit", "The MSB"], answer: 1, why: "The line idles HIGH; a start bit (LOW) signals a byte is coming." },
  ],
});
