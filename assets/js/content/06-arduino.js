COURSE.push({
  id: "arduino",
  title: "Arduino: Your First Microcontroller",
  tagline: "Write code that blinks, senses and controls the physical world.",
  icon: "🤖",
  level: "Beginner → Intermediate",
  lessons: [
    {
      id: "mcu",
      title: "What is a microcontroller?",
      minutes: 6,
      body: `
<p class="lead">Everything you've learned so far — resistors, transistors, logic gates, flip-flops — gets packed into one small chip called a <strong>microcontroller (MCU)</strong>. It's a complete tiny computer that you program to control things.</p>
${H.table(["", "Microprocessor (your laptop CPU)", "Microcontroller (Arduino)"], [
  ["Memory & I/O", "External (separate RAM chips)", "All on one chip"],
  ["Speed", "GHz", "MHz"],
  ["Power", "Tens of watts", "Milliwatts"],
  ["Cost", "₹10,000+", "₹100–300"],
  ["Job", "Run many programs", "Do one job forever, reliably"],
])}
<p>Microcontrollers are hidden inside washing machines, TV remotes, car engines, drones, pacemakers and missile seekers. There are more MCUs on Earth than people!</p>
<h2>Why Arduino?</h2>
<p>Arduino is a board built around the <b>ATmega328P</b> microcontroller, plus everything needed to use it easily: USB, a voltage regulator and labelled pins. Its free software (the <b>Arduino IDE</b>) hides the complicated parts so you can blink an LED in 5 minutes. Perfect for learning, prototyping — and later, for moving on to professional chips.</p>
${H.fact(`<p>Arduino was created in 2005 at a design school in Ivrea, Italy, so that <b>art students</b> with no electronics background could build interactive projects. If they could do it, so can you.</p>`)}
`,
    },
    {
      id: "board",
      title: "Tour of the Arduino Uno",
      minutes: 6,
      body: `
<p class="lead">Let's walk around the board and meet every important part.</p>
<div class="figure">
<svg viewBox="0 0 420 280" role="img" aria-label="Labelled diagram of an Arduino Uno board">
  <rect x="20" y="20" width="380" height="240" rx="14" fill="#0f7c8a"/>
  <rect x="0" y="50" width="60" height="50" rx="4" fill="#c0c0c0"/><text x="30" y="80" text-anchor="middle" font-size="11" fill="#222">USB</text>
  <rect x="0" y="175" width="55" height="45" rx="4" fill="#222"/><text x="28" y="202" text-anchor="middle" font-size="10" fill="#fff">DC jack</text>
  <rect x="180" y="150" width="170" height="40" rx="3" fill="#222"/><text x="265" y="175" text-anchor="middle" font-size="11" fill="#fff">ATmega328P</text>
  <rect x="120" y="30" width="270" height="18" rx="2" fill="#111"/>
  <rect x="150" y="232" width="240" height="18" rx="2" fill="#111"/>
  <circle cx="95" cy="60" r="10" fill="#ddd"/><text x="95" y="64" text-anchor="middle" font-size="8" fill="#222">RST</text>
  <circle cx="115" cy="100" r="5" fill="#ffd400"/><text x="126" y="104" font-size="10" fill="#fff">L (pin 13 LED)</text>
  <rect x="110" y="130" width="40" height="18" rx="3" fill="#bbb"/><text x="130" y="143" text-anchor="middle" font-size="8" fill="#222">16 MHz</text>
  <text x="255" y="64" text-anchor="middle" font-size="11" fill="#fff">Digital pins 0–13 (~ = PWM)</text>
  <text x="200" y="226" text-anchor="middle" font-size="11" fill="#fff">Power: 5V 3.3V GND</text>
  <text x="330" y="226" text-anchor="middle" font-size="11" fill="#fff">Analog A0–A5</text>
</svg>
</div>
${H.table(["Part", "What it does"], [
  ["USB port", "Powers the board and uploads your code"],
  ["DC jack (7–12 V)", "Power from a battery or adapter"],
  ["ATmega328P", "The brain: 32 KB flash (program), 2 KB RAM, 16 MHz"],
  ["Digital pins 0–13", "Read or write HIGH (5 V) / LOW (0 V). Pins marked ~ (3, 5, 6, 9, 10, 11) can do PWM"],
  ["Analog pins A0–A5", "Read voltages from 0–5 V as numbers 0–1023"],
  ["5V, 3.3V, GND", "Power outputs for your sensors"],
  ["Pin 13 LED 'L'", "Built-in LED — great for the first test"],
  ["Reset button", "Restarts your program from the beginning"],
])}
${H.mistake(`<p>Each I/O pin can safely supply about <b>20 mA</b> (40 mA absolute max). Never power a motor or a long LED strip directly from a pin — use a transistor or MOSFET, as you learned in Module 4.</p>`)}
`,
    },
    {
      id: "blink",
      title: "Your first sketch: Blink",
      minutes: 8,
      body: `
<p class="lead">An Arduino program is called a <strong>sketch</strong>. Every sketch has two parts: <code>setup()</code> runs once, and <code>loop()</code> runs forever.</p>
${H.code(`
// Runs once when the board powers up or resets
void setup() {
  pinMode(13, OUTPUT);      // Pin 13 will send out voltage
}

// Runs again and again, forever
void loop() {
  digitalWrite(13, HIGH);   // Turn LED on (5 V)
  delay(1000);              // Wait 1000 ms = 1 second
  digitalWrite(13, LOW);    // Turn LED off (0 V)
  delay(1000);              // Wait 1 second
}
`)}
<h2>Line by line</h2>
<ul>
  <li><code>pinMode(13, OUTPUT)</code> — tells the chip pin 13 will <em>drive</em> something (not read it).</li>
  <li><code>digitalWrite(13, HIGH)</code> — connects pin 13 to 5 V internally. The LED lights up.</li>
  <li><code>delay(1000)</code> — pauses for 1000 milliseconds.</li>
  <li><code>//</code> — a comment. Ignored by the computer, written for humans.</li>
</ul>
<h2>Upload it</h2>
${H.steps([
  "Install the free <b>Arduino IDE</b> from arduino.cc (or use <b>Tinkercad Circuits</b> in your browser — no hardware needed).",
  "Plug in the board with a USB cable.",
  "Choose <b>Tools → Board → Arduino Uno</b> and the right <b>Port</b>.",
  "Paste the code and click <b>Upload</b> (→).",
  "Watch the 'L' LED blink. 🎉 You're now an embedded programmer!",
])}
${H.widget("blink", "Blink simulator: change the delays")}
${H.mistake(`<p>Missing semicolons <code>;</code> and mismatched <code>{ }</code> braces cause most beginner compile errors. Also, Arduino is <b>case-sensitive</b>: <code>digitalwrite</code> won't work, it must be <code>digitalWrite</code>.</p>`)}
`,
    },
    {
      id: "input",
      title: "Reading buttons (digital input)",
      minutes: 7,
      body: `
<p class="lead">Outputs let the Arduino act. <strong>Inputs</strong> let it sense. The simplest input is a push button.</p>
${H.code(`
const int BUTTON = 2;
const int LED = 13;

void setup() {
  pinMode(BUTTON, INPUT_PULLUP);  // Built-in pull-up: reads HIGH when not pressed
  pinMode(LED, OUTPUT);
}

void loop() {
  if (digitalRead(BUTTON) == LOW) {  // Pressed connects pin to GND
    digitalWrite(LED, HIGH);
  } else {
    digitalWrite(LED, LOW);
  }
}
`)}
<h2>Why the pull-up?</h2>
<p>If an input pin isn't connected to anything, it's <b>floating</b> — it picks up random noise and flickers between HIGH and LOW. A <b>pull-up resistor</b> gently holds the pin at HIGH by default. Pressing the button connects it firmly to GND, giving LOW.</p>
${H.analogy(`<p>A pull-up resistor is like a <b>spring on a door</b>: it keeps the door closed (HIGH) unless someone pushes it open (button press → LOW). Without the spring, the door flaps around in the wind (floating).</p>`)}
${H.key(`<p>With <code>INPUT_PULLUP</code>, the logic is <b>inverted</b>: pressed = LOW, released = HIGH. Wire the button between the pin and GND — no external resistor needed.</p>`)}
${H.fact(`<p>Mechanical buttons <b>bounce</b>: the metal contacts vibrate and make/break the connection several times in a few milliseconds. For counting presses, add "debouncing" — ignore changes for about 50 ms after the first one.</p>`)}
`,
    },
    {
      id: "analog",
      title: "Reading sensors (analog input & ADC)",
      minutes: 7,
      body: `
<p class="lead">Temperature, light and sound are analog. To read them, the Arduino uses an <strong>ADC — Analog-to-Digital Converter</strong>.</p>
<p>The Uno's ADC is <b>10-bit</b>: it splits 0–5 V into 2¹⁰ = <b>1024 steps</b> (0 to 1023). Each step is about 5 / 1024 ≈ <b>4.9 mV</b>.</p>
${H.formula(`value = V<sub>in</sub> ÷ 5 V × 1023`)}
${H.code(`
void setup() {
  Serial.begin(9600);              // Open a channel to the PC
}

void loop() {
  int raw = analogRead(A0);        // 0 to 1023
  float volts = raw * 5.0 / 1023.0;
  Serial.print("Raw: ");
  Serial.print(raw);
  Serial.print("   Voltage: ");
  Serial.println(volts);
  delay(200);
}
`)}
${H.widget("adc", "ADC simulator: turn the knob")}
<p>Connect a <b>potentiometer</b> (a variable resistor — it's the voltage divider from Module 3!) with its middle pin to A0 and its ends to 5V and GND. Turn the knob and watch the numbers change in <b>Tools → Serial Monitor</b>.</p>
${H.gate(`<p>ADC resolution, quantization step (Δ = V<sub>range</sub>/2ⁿ) and quantization noise come up in GATE's Communications and Digital sections.</p>`)}
`,
    },
    {
      id: "pwm",
      title: "Faking analog output with PWM",
      minutes: 7,
      body: `
<p class="lead">An Arduino pin can only be fully ON (5 V) or fully OFF (0 V). So how do we dim an LED or control a motor's speed? By switching it <strong>on and off very fast</strong>.</p>
<p>This is <strong>Pulse Width Modulation (PWM)</strong>. The fraction of time the signal is ON is called the <b>duty cycle</b>.</p>
${H.formula(`V<sub>average</sub> = duty cycle × 5 V`)}
${H.widget("pwm", "PWM visualiser")}
${H.code(`
const int LED = 9;   // Must be a ~ pin

void setup() {
  pinMode(LED, OUTPUT);
}

void loop() {
  for (int b = 0; b <= 255; b++) {   // Fade in
    analogWrite(LED, b);             // 0 = 0%, 255 = 100% duty
    delay(5);
  }
  for (int b = 255; b >= 0; b--) {   // Fade out
    analogWrite(LED, b);
    delay(5);
  }
}
`)}
${H.analogy(`<p>Flick a room's light switch on and off faster than your eye can see. If it's on half the time, the room looks half as bright. That's PWM — your eyes (or a motor's inertia) do the averaging.</p>`)}
<p>PWM controls LED brightness, motor speed, servo angle, and even generates audio. The Uno's PWM runs at about 490 Hz (980 Hz on pins 5 and 6).</p>
`,
    },
    {
      id: "serial",
      title: "Talking to your PC: Serial",
      minutes: 5,
      body: `
<p class="lead">The Serial Monitor is your <strong>window into the chip</strong>. It's the #1 debugging tool for embedded developers.</p>
${H.code(`
void setup() {
  Serial.begin(9600);                 // Baud rate: 9600 bits per second
  Serial.println("Hello from Arduino!");
}

void loop() {
  if (Serial.available() > 0) {       // Did the PC send something?
    char c = Serial.read();
    if (c == '1') digitalWrite(13, HIGH);
    if (c == '0') digitalWrite(13, LOW);
    Serial.print("Got: ");
    Serial.println(c);
  }
}
`)}
<p>Open <b>Tools → Serial Monitor</b>, set the baud rate to 9600, and type 1 or 0. You just controlled hardware from your keyboard!</p>
${H.key(`<p>When something doesn't work, <b>print it</b>. Print sensor values, print "reached here", print variables. Seeing what the chip sees solves most bugs.</p>`)}
<p>Under the hood, Serial uses <b>UART</b> — a communication protocol you'll explore properly in the next module.</p>
`,
    },
  ],
  quiz: [
    { q: "Which function runs only once, when the Arduino starts?", options: ["loop()", "setup()", "main()", "start()"], answer: 1, why: "setup() runs once; loop() then repeats forever." },
    { q: "What does analogRead() return on an Uno when the input is 2.5 V?", options: ["About 255", "About 512", "About 1023", "2.5"], answer: 1, why: "10-bit ADC: 2.5/5 × 1023 ≈ 511." },
    { q: "analogWrite(9, 64) gives roughly what duty cycle?", options: ["25%", "50%", "64%", "6.4%"], answer: 0, why: "64/255 ≈ 25% duty cycle." },
    { q: "With INPUT_PULLUP and a button to GND, a pressed button reads…", options: ["HIGH", "LOW", "Floating", "1023"], answer: 1, why: "Pressing connects the pin to GND → LOW." },
    { q: "Safe maximum current from a single Uno I/O pin is about…", options: ["2 A", "500 mA", "20 mA", "1 µA"], answer: 2, why: "About 20 mA recommended (40 mA absolute max). Use a transistor for more." },
  ],
});
