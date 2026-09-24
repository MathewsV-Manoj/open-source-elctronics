/* Hands-on projects. Fields:
   platform: arduino | esp32 | pico | raspi | analog
   how: plain-language explanation (HTML); steps: wiring/build steps;
   code + lang: omit code for circuits that need no programming. */
window.PLATFORMS = {
  analog: { name: "No microcontroller", short: "Circuit" },
  arduino: { name: "Arduino Uno", short: "Arduino" },
  esp32: { name: "ESP32", short: "ESP32" },
  pico: { name: "Raspberry Pi Pico", short: "Pico" },
  raspi: { name: "Raspberry Pi 4/5", short: "Raspberry Pi" },
};

window.PROJECTS = [
  /* ---------------- No microcontroller ---------------- */
  {
    id: "flasher555",
    title: "555 Timer LED Flasher",
    platform: "analog",
    difficulty: "Easy",
    time: "30 min",
    cost: "₹80",
    learn: ["The legendary 555 timer IC", "RC timing in a real circuit", "Astable (free-running) oscillators"],
    parts: ["NE555 timer IC", "R1 = 1 kΩ, R2 = 47 kΩ", "C = 10 µF electrolytic, 10 nF ceramic", "LED + 470 Ω resistor", "9 V battery or 5 V supply", "Breadboard"],
    how: `<p>The 555 charges a capacitor through R1 and R2, then discharges it through R2 alone. When the capacitor voltage reaches ⅔ of the supply, the output flips LOW; when it drops to ⅓, the output flips HIGH again. That endless charge–discharge cycle makes the LED blink with no code at all.</p>
      ${H.formula("f = 1.44 ÷ ((R1 + 2·R2) × C)", "With 1 kΩ, 47 kΩ and 10 µF: f ≈ 1.5 blinks per second")}`,
    steps: [
      "Place the 555 across the centre gap. Pin 1 is next to the dot/notch.",
      "Pin 1 → GND. Pin 8 and pin 4 (reset) → +V.",
      "R1 (1 kΩ) from +V to pin 7. R2 (47 kΩ) from pin 7 to pin 6.",
      "Join pin 6 to pin 2. Connect the 10 µF capacitor from pin 2 to GND (stripe to GND).",
      "10 nF capacitor from pin 5 to GND (keeps the timing stable).",
      "Pin 3 (output) → 470 Ω → LED anode; LED cathode → GND.",
    ],
    challenge: "Swap R2 for a 100 kΩ potentiometer to make the speed adjustable, then add a speaker instead of the LED (with C = 10 nF) to hear a tone.",
  },
  {
    id: "darksensor",
    title: "Automatic Dark-Activated Light",
    platform: "analog",
    difficulty: "Easy",
    time: "30 min",
    cost: "₹50",
    learn: ["Transistor as a switch", "Voltage divider with an LDR", "Designing without code"],
    parts: ["BC547 NPN transistor", "LDR", "10 kΩ resistor + 50 kΩ potentiometer", "1 kΩ resistor", "LED + 330 Ω resistor", "9 V battery"],
    how: `<p>The LDR and the resistor/potentiometer form a <b>voltage divider</b>. In daylight the LDR's resistance is low, so the divider point sits near 0 V and the transistor stays off. When it gets dark, the LDR's resistance shoots up, the divider voltage rises above ~0.7 V, base current flows, and the transistor switches the LED on.</p>`,
    steps: [
      "+9 V → 10 kΩ → potentiometer (use two outer legs + wiper) → divider point.",
      "LDR from the divider point to GND.",
      "Divider point → 1 kΩ → BC547 base (middle leg with the flat face towards you: E-B-C).",
      "Emitter → GND. Collector → LED cathode; LED anode → 330 Ω → +9 V.",
      "Cover the LDR with your hand and turn the potentiometer until the LED just switches on.",
    ],
    challenge: "Replace the LED with a 5 V relay module (plus a flyback diode) to switch a bigger lamp.",
  },

  /* ---------------- Arduino ---------------- */
  {
    id: "traffic",
    title: "Traffic Light Controller",
    platform: "arduino",
    difficulty: "Easy",
    time: "30 min",
    cost: "₹30 + Arduino",
    learn: ["Digital output", "Timing with delay()", "Writing your own function"],
    parts: ["Arduino Uno", "Red, yellow and green LEDs", "3 × 220 Ω resistors", "Breadboard & jumper wires"],
    how: `<p>A traffic light is a <b>state machine</b>: it moves through a fixed sequence of states (red → red+yellow → green → yellow), spending a set time in each. The <code>light()</code> function sets all three LEDs for one state and waits, so <code>loop()</code> reads like the real sequence.</p>`,
    steps: [
      "Pin 10 → 220 Ω → red LED anode (long leg). Cathode → GND.",
      "Pin 9 → 220 Ω → yellow LED → GND.",
      "Pin 8 → 220 Ω → green LED → GND.",
    ],
    code: `
const int RED = 10, YELLOW = 9, GREEN = 8;

void setup() {
  pinMode(RED, OUTPUT);
  pinMode(YELLOW, OUTPUT);
  pinMode(GREEN, OUTPUT);
}

void light(int r, int y, int g, int ms) {
  digitalWrite(RED, r);
  digitalWrite(YELLOW, y);
  digitalWrite(GREEN, g);
  delay(ms);
}

void loop() {
  light(1, 0, 0, 5000);   // Red: stop
  light(1, 1, 0, 1500);   // Red + yellow: get ready
  light(0, 0, 1, 5000);   // Green: go
  light(0, 1, 0, 2000);   // Yellow: slow down
}`,
    lang: "cpp",
    challenge: "Add a pedestrian button (with INPUT_PULLUP) that shortens the green phase when pressed.",
  },
  {
    id: "reaction",
    title: "Reaction Timer Game",
    platform: "arduino",
    difficulty: "Easy",
    time: "30 min",
    cost: "₹20 + Arduino",
    learn: ["millis() timing", "Random numbers", "Detecting cheating (early presses)"],
    parts: ["Arduino Uno", "LED + 220 Ω", "Push button"],
    how: `<p>The LED lights up after a random wait. The Arduino records <code>millis()</code> at that moment and again when you press the button; the difference is your reaction time. Pressing before the light is caught as a false start. Most people score 200–300 ms.</p>`,
    steps: [
      "Pin 8 → 220 Ω → LED → GND.",
      "Button between pin 2 and GND (the internal pull-up is used).",
      "Open the Serial Monitor at 9600 baud to play.",
    ],
    code: `
const int LED = 8, BUTTON = 2;
unsigned long best = 99999;

void setup() {
  pinMode(LED, OUTPUT);
  pinMode(BUTTON, INPUT_PULLUP);
  Serial.begin(9600);
  randomSeed(analogRead(A0));        // unconnected pin = random noise
  Serial.println("Press the button as soon as the LED lights up!");
}

void loop() {
  digitalWrite(LED, LOW);
  unsigned long wait = random(2000, 5000), start = millis();
  while (millis() - start < wait) {
    if (digitalRead(BUTTON) == LOW) {  // pressed too early
      Serial.println("False start! Wait for the light.");
      delay(1500);
      return;
    }
  }

  digitalWrite(LED, HIGH);
  unsigned long t0 = millis();
  while (digitalRead(BUTTON) == HIGH) {}   // wait for the press
  unsigned long reaction = millis() - t0;
  digitalWrite(LED, LOW);

  Serial.print("Reaction time: ");
  Serial.print(reaction);
  Serial.println(" ms");
  if (reaction < best) {
    best = reaction;
    Serial.println("New best!");
  }
  while (digitalRead(BUTTON) == LOW) {}    // wait for release
  delay(1500);
}`,
    lang: "cpp",
    challenge: "Make it a two-player game with two buttons, and show the winner with two different LEDs.",
  },
  {
    id: "nightlamp",
    title: "Automatic Night Lamp",
    platform: "arduino",
    difficulty: "Easy",
    time: "40 min",
    cost: "₹30 + Arduino",
    learn: ["Voltage divider", "Analog input (ADC)", "Thresholds & decisions"],
    parts: ["Arduino Uno", "LDR (light-dependent resistor)", "10 kΩ resistor", "LED + 220 Ω resistor"],
    how: `<p>The LDR and 10 kΩ resistor make a voltage divider. More light → lower LDR resistance → higher voltage at A0. The Arduino converts that voltage into a number from 0 to 1023 and switches the LED on when the number drops below a threshold you choose.</p>`,
    steps: [
      "5V → LDR → A0.",
      "A0 → 10 kΩ → GND (this completes the divider).",
      "Pin 9 → 220 Ω → LED → GND.",
      "Open the Serial Monitor, note the readings in light and dark, and set DARK between them.",
    ],
    code: `
const int LDR = A0, LED = 9;
const int DARK = 300;   // Tune this by watching the Serial Monitor

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int light = analogRead(LDR);
  Serial.println(light);
  digitalWrite(LED, light < DARK ? HIGH : LOW);
  delay(100);
}`,
    lang: "cpp",
    challenge: "Use analogWrite() so the lamp gets gradually brighter as it gets darker, instead of just on/off.",
  },
  {
    id: "morse",
    title: "Morse Code Transmitter",
    platform: "arduino",
    difficulty: "Medium",
    time: "45 min",
    cost: "₹40 + Arduino",
    learn: ["Arrays and lookup tables", "Strings and characters", "Timing-based communication (the ancestor of UART!)"],
    parts: ["Arduino Uno", "LED + 220 Ω", "Passive buzzer"],
    how: `<p>Type a message in the Serial Monitor and the Arduino flashes and beeps it in Morse code. A <b>dot</b> is 1 time unit, a <b>dash</b> is 3, the gap between symbols is 1, between letters 3, and between words 7. Each letter's pattern comes from a lookup table (an array of strings) indexed by <code>c - 'A'</code>.</p>`,
    steps: [
      "Pin 13 → 220 Ω → LED → GND (or use the built-in LED).",
      "Buzzer + → pin 8, buzzer − → GND.",
      "Serial Monitor at 9600 baud, type a message and press Enter.",
    ],
    code: `
const int LED = 13, BUZZ = 8;
const int UNIT = 150;   // ms per dot

const char* LETTERS[] = { ".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..", ".---",
  "-.-", ".-..", "--", "-.", "---", ".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--",
  "-..-", "-.--", "--.." };
const char* DIGITS[] = { "-----", ".----", "..---", "...--", "....-", ".....", "-....",
  "--...", "---..", "----." };

void beep(int units) {
  digitalWrite(LED, HIGH);
  tone(BUZZ, 700);
  delay(units * UNIT);
  digitalWrite(LED, LOW);
  noTone(BUZZ);
  delay(UNIT);                       // 1-unit gap between symbols
}

void sendChar(char c) {
  const char* code = nullptr;
  if (c >= 'a' && c <= 'z') c -= 32; // to upper case
  if (c >= 'A' && c <= 'Z') code = LETTERS[c - 'A'];
  else if (c >= '0' && c <= '9') code = DIGITS[c - '0'];
  else if (c == ' ') { delay(UNIT * 4); return; }   // word gap (3 + 4 = 7)
  if (!code) return;
  for (const char* p = code; *p; p++) beep(*p == '.' ? 1 : 3);
  delay(UNIT * 2);                   // letter gap (1 + 2 = 3)
}

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
  Serial.println("Type a message:");
}

void loop() {
  if (Serial.available()) {
    char c = Serial.read();
    Serial.print(c);
    sendChar(c);
  }
}`,
    lang: "cpp",
    challenge: "Build the receiver: a second Arduino with an LDR that decodes the flashes back into text.",
  },
  {
    id: "distance",
    title: "Ultrasonic Distance Meter",
    platform: "arduino",
    difficulty: "Medium",
    time: "45 min",
    cost: "₹120 + Arduino",
    learn: ["Timing pulses with pulseIn()", "Speed of sound physics", "Echo ranging — the principle behind sonar and radar"],
    parts: ["Arduino Uno", "HC-SR04 ultrasonic sensor", "Buzzer (optional)"],
    how: `<p>The HC-SR04 sends a 40 kHz ultrasonic ping and raises its ECHO pin until the echo returns. Sound travels about 343 m/s (0.0343 cm/µs), and it goes <i>there and back</i>, so distance = time × 0.0343 ÷ 2. Radar and sonar work on exactly this principle, with radio waves or underwater sound instead.</p>`,
    steps: [
      "HC-SR04 VCC → 5V, GND → GND.",
      "TRIG → pin 9, ECHO → pin 10.",
      "Buzzer + → pin 6, − → GND.",
    ],
    code: `
const int TRIG = 9, ECHO = 10, BUZZ = 6;

void setup() {
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  pinMode(BUZZ, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);   // 10 µs ping
  digitalWrite(TRIG, LOW);

  long us = pulseIn(ECHO, HIGH, 30000);   // Echo time in µs
  float cm = us * 0.0343 / 2;             // Sound: 343 m/s, there and back

  Serial.print(cm);
  Serial.println(" cm");
  digitalWrite(BUZZ, (cm > 0 && cm < 15) ? HIGH : LOW);   // Too close!
  delay(100);
}`,
    lang: "cpp",
    challenge: "Make the buzzer beep faster as the object gets closer — like a car's parking sensor.",
  },
  {
    id: "weather",
    title: "Temperature & Humidity Monitor",
    platform: "arduino",
    difficulty: "Medium",
    time: "45 min",
    cost: "₹150 + Arduino",
    learn: ["Using libraries", "Digital sensor protocols", "Handling sensor errors"],
    parts: ["Arduino Uno", "DHT11 or DHT22 sensor", "10 kΩ pull-up (if the module doesn't have one)"],
    how: `<p>The DHT sensor measures temperature and humidity itself and sends the result over a single data wire using its own timing-based protocol. The Adafruit library handles those microsecond timings for you. <code>isnan()</code> ("is not a number") catches failed reads, which happen when wiring is loose.</p>`,
    steps: [
      "DHT VCC → 5V, GND → GND, DATA → pin 2.",
      "In the Arduino IDE: Sketch → Include Library → Manage Libraries → install \"DHT sensor library\" by Adafruit (accept its dependencies).",
    ],
    code: `
#include <DHT.h>

DHT dht(2, DHT11);   // Pin 2, sensor type (use DHT22 if you have one)

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  if (isnan(h) || isnan(t)) {
    Serial.println("Sensor read failed - check wiring");
  } else {
    Serial.print("Temp: ");     Serial.print(t);
    Serial.print(" C   Humidity: "); Serial.print(h);
    Serial.println(" %");
  }
  delay(2000);   // DHT11 needs ~1–2 s between reads
}`,
    lang: "cpp",
    challenge: "Add a 16×2 I²C LCD or 0.96\" OLED display so it works without a PC.",
  },
  {
    id: "tripwire",
    title: "Laser Tripwire Security System",
    platform: "arduino",
    difficulty: "Medium",
    time: "1 hour",
    cost: "₹120 + Arduino",
    learn: ["Self-calibrating sensors", "Latching alarms (state)", "Perimeter security basics"],
    parts: ["Arduino Uno", "KY-008 laser module (or any 5 mW laser)", "LDR + 10 kΩ resistor", "Passive buzzer", "Push button (reset)"],
    how: `<p>A laser beam shines on an LDR across a doorway. At startup the Arduino <b>calibrates</b>: it measures the lit level and sets the alarm threshold at 60% of it. If anyone breaks the beam, the reading drops, the alarm <b>latches</b> on (it keeps sounding even after the beam is restored) until someone presses the reset button — just like a real intrusion alarm.</p>`,
    steps: [
      "Laser module: S → 5V, − → GND (it stays on permanently).",
      "5V → LDR → A0 → 10 kΩ → GND. Aim the laser at the LDR from across the doorway.",
      "Buzzer + → pin 8, − → GND. Reset button between pin 2 and GND.",
      "Tip: put the LDR inside a short black straw so room light doesn't affect it.",
    ],
    code: `
const int LDR = A0, BUZZ = 8, RESET_BTN = 2;
int threshold;
bool alarm = false;

void setup() {
  pinMode(BUZZ, OUTPUT);
  pinMode(RESET_BTN, INPUT_PULLUP);
  Serial.begin(9600);
  delay(500);
  int lit = analogRead(LDR);          // beam must be on the LDR at power-up
  threshold = lit * 0.6;
  Serial.print("Calibrated. Beam level = ");
  Serial.print(lit);
  Serial.print(", alarm below ");
  Serial.println(threshold);
}

void loop() {
  if (!alarm && analogRead(LDR) < threshold) {
    alarm = true;
    Serial.println("INTRUSION DETECTED");
  }
  if (alarm) {
    tone(BUZZ, (millis() / 250) % 2 ? 1800 : 1200);   // two-tone siren
  }
  if (digitalRead(RESET_BTN) == LOW) {
    alarm = false;
    noTone(BUZZ);
    Serial.println("Alarm reset");
    delay(300);
  }
}`,
    lang: "cpp",
    challenge: "Use mirrors to zig-zag one beam across a whole corridor, and log each intrusion with a timestamp.",
  },
  {
    id: "plant",
    title: "Smart Plant Watering System",
    platform: "arduino",
    difficulty: "Medium",
    time: "1–2 hours",
    cost: "₹350 + Arduino",
    learn: ["Analog sensors", "MOSFET switching of a motor", "Hysteresis in control systems"],
    parts: ["Arduino Uno", "Capacitive soil moisture sensor", "5 V mini water pump", "Logic-level MOSFET (IRLZ44N) or relay module", "1N4007 flyback diode", "Separate 5 V supply for the pump"],
    how: `<p>The soil sensor gives a higher reading when the soil is dry. The pump turns on above the DRY level and off below the WET level. Between the two, it keeps doing what it was doing — that gap is called <b>hysteresis</b>, and it stops the pump from rapidly clicking on and off around a single threshold. Your home AC thermostat works the same way.</p>`,
    steps: [
      "Sensor VCC → 5V, GND → GND, AOUT → A0.",
      "Pin 7 → 220 Ω → MOSFET gate. Also 100 kΩ from gate to GND (keeps it off during reset).",
      "Pump + → external +5 V; pump − → MOSFET drain; MOSFET source → GND.",
      "1N4007 diode across the pump, stripe towards +5 V.",
      "Connect the external supply's GND to the Arduino GND.",
    ],
    code: `
const int SENSOR = A0, PUMP = 7;
const int DRY = 600;   // Higher reading = drier (calibrate yours!)
const int WET = 450;

void setup() {
  pinMode(PUMP, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int m = analogRead(SENSOR);
  Serial.println(m);
  if (m > DRY) digitalWrite(PUMP, HIGH);        // Too dry: water
  else if (m < WET) digitalWrite(PUMP, LOW);    // Wet enough: stop
  // Between WET and DRY: keep doing whatever we were doing (hysteresis)
  delay(500);
}`,
    lang: "cpp",
    challenge: "Move it to an ESP32 and send moisture readings to your phone over Wi-Fi.",
  },
  {
    id: "imu",
    title: "Attitude Indicator with MPU6050",
    platform: "arduino",
    difficulty: "Advanced",
    time: "1–2 hours",
    cost: "₹150 + Arduino",
    learn: ["I²C register-level reading", "Accelerometer maths (pitch & roll)", "The sensor inside every drone and aircraft"],
    parts: ["Arduino Uno", "MPU6050 module (GY-521)", "Jumper wires"],
    how: `<p>The MPU6050 contains a 3-axis <b>accelerometer</b> and a 3-axis <b>gyroscope</b>. At rest, the accelerometer measures only gravity, so the direction of the gravity vector tells you how the board is tilted: <b>pitch</b> (nose up/down) and <b>roll</b> (wing up/down). We talk to the chip directly over I²C: write 0 to register 0x6B to wake it, then read six bytes starting at register 0x3B.</p>
      ${H.formula("roll = atan2(a<sub>y</sub>, a<sub>z</sub>) &nbsp; · &nbsp; pitch = atan2(−a<sub>x</sub>, √(a<sub>y</sub>² + a<sub>z</sub>²))")}`,
    steps: [
      "MPU6050 VCC → 5V (the GY-521 module has its own regulator), GND → GND.",
      "SDA → A4, SCL → A5 (the Uno's I²C pins).",
      "Open the Serial Plotter (Tools → Serial Plotter) at 115200 baud and tilt the board.",
    ],
    code: `
#include <Wire.h>

const int MPU = 0x68;             // I2C address (AD0 pin low)

int16_t read16() {
  int16_t hi = Wire.read();       // high byte arrives first
  return (hi << 8) | Wire.read();
}

void setup() {
  Serial.begin(115200);
  Wire.begin();
  Wire.beginTransmission(MPU);
  Wire.write(0x6B);               // PWR_MGMT_1 register
  Wire.write(0);                  // 0 = wake up
  Wire.endTransmission();
}

void loop() {
  Wire.beginTransmission(MPU);
  Wire.write(0x3B);               // ACCEL_XOUT_H: first accelerometer register
  Wire.endTransmission(false);    // keep the bus for a repeated start
  Wire.requestFrom(MPU, 6, true);

  float ax = read16(), ay = read16(), az = read16();
  float roll  = atan2(ay, az) * 180.0 / PI;
  float pitch = atan2(-ax, sqrt(ay * ay + az * az)) * 180.0 / PI;

  Serial.print("Pitch:");
  Serial.print(pitch);
  Serial.print(" Roll:");
  Serial.println(roll);
  delay(50);
}`,
    lang: "cpp",
    challenge: "Accelerometers are noisy when moving. Read the gyroscope too (registers 0x43–0x48) and combine both with a complementary filter: angle = 0.98 × (angle + gyro × dt) + 0.02 × accelAngle.",
  },
  {
    id: "linefollower",
    title: "Line-Following Robot",
    platform: "arduino",
    difficulty: "Advanced",
    time: "3–4 hours",
    cost: "₹900 + Arduino",
    learn: ["H-bridge motor drivers", "Sensor-based feedback control", "Building a complete robot"],
    parts: ["Arduino Uno", "2WD robot chassis with 2 DC gear motors", "L298N motor driver", "2 × IR line sensor modules (TCRT5000)", "7.4 V Li-ion pack or 6 × AA", "Black electrical tape for the track"],
    how: `<p>Two IR sensors look down at the floor, one on each side of a black line. Black absorbs infrared, white reflects it. If both sensors see white, the line is between them — drive straight. If the left sensor sees black, the line is drifting left — turn left. The <b>L298N H-bridge</b> lets the Arduino's weak signals control motor direction (IN pins) and speed (PWM on EN pins).</p>`,
    steps: [
      "L298N: motor A → OUT1/OUT2, motor B → OUT3/OUT4. Battery + → 12V terminal, battery − → GND.",
      "L298N GND → Arduino GND. Remove the ENA/ENB jumpers.",
      "ENA → pin 5, IN1 → 7, IN2 → 8, ENB → pin 6, IN3 → 9, IN4 → 10.",
      "IR sensors: VCC → 5V, GND → GND, left OUT → A0, right OUT → A1. Mount them ~1 cm above the floor, about 2 cm apart.",
      "Test first with the wheels in the air. If a motor spins backwards, swap its two wires.",
    ],
    code: `
const int L_IR = A0, R_IR = A1;
const int ENA = 5, IN1 = 7, IN2 = 8, ENB = 6, IN3 = 9, IN4 = 10;
const int SPEED = 150;

// Speeds from -255 (full reverse) to 255 (full forward)
void drive(int left, int right) {
  digitalWrite(IN1, left >= 0);  digitalWrite(IN2, left < 0);  analogWrite(ENA, abs(left));
  digitalWrite(IN3, right >= 0); digitalWrite(IN4, right < 0); analogWrite(ENB, abs(right));
}

void setup() {
  int outs[] = { ENA, IN1, IN2, ENB, IN3, IN4 };
  for (int p : outs) pinMode(p, OUTPUT);
  pinMode(L_IR, INPUT);
  pinMode(R_IR, INPUT);
}

void loop() {
  bool leftOnLine  = digitalRead(L_IR) == HIGH;   // most modules: HIGH = black
  bool rightOnLine = digitalRead(R_IR) == HIGH;   // flip if yours is opposite

  if (!leftOnLine && !rightOnLine) drive(SPEED, SPEED);   // straight
  else if (leftOnLine && !rightOnLine) drive(0, SPEED);   // turn left
  else if (!leftOnLine && rightOnLine) drive(SPEED, 0);   // turn right
  else drive(0, 0);                                       // both on black: stop
}`,
    lang: "cpp",
    challenge: "Use 5 sensors and a PID controller for smooth, fast line following — the same control theory used in missiles and autopilots.",
  },
  {
    id: "radar",
    title: "Mini Radar Scanner",
    platform: "arduino",
    difficulty: "Advanced",
    time: "2–3 hours",
    cost: "₹250 + Arduino",
    learn: ["Servo control (PWM)", "Combining sensors & actuators", "Sending data to a PC for plotting"],
    parts: ["Arduino Uno", "SG90 servo motor", "HC-SR04 ultrasonic sensor", "Mount the sensor on the servo horn"],
    how: `<p>A servo sweeps the ultrasonic sensor from 15° to 165° and back. At each angle the Arduino measures distance and prints <code>angle,distance</code>. A PC program turns those pairs into a radar-style polar plot. This is the basic idea of a real scanning radar: a rotating antenna plus range measurement.</p>`,
    steps: [
      "Servo signal (orange) → pin 3, red → 5V, brown → GND.",
      "HC-SR04 TRIG → 9, ECHO → 10, VCC → 5V, GND → GND.",
      "Glue or tape the sensor onto the servo horn.",
    ],
    code: `
#include <Servo.h>

const int TRIG = 9, ECHO = 10;
Servo scanner;

float readCm() {
  digitalWrite(TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  return pulseIn(ECHO, HIGH, 30000) * 0.0343 / 2;
}

void sweep(int from, int to, int step) {
  for (int a = from; a != to; a += step) {
    scanner.write(a);
    delay(25);
    Serial.print(a);
    Serial.print(",");
    Serial.println(readCm());   // "angle,distance" for plotting
  }
}

void setup() {
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  scanner.attach(3);
  Serial.begin(115200);
}

void loop() {
  sweep(15, 165, 1);
  sweep(165, 15, -1);
}`,
    lang: "cpp",
    challenge: "Plot the angle,distance pairs as a radar screen using Processing or Python (matplotlib polar plot).",
  },

  /* ---------------- ESP32 ---------------- */
  {
    id: "esp-dimmer",
    title: "Wi-Fi LED Dimmer from Your Phone",
    platform: "esp32",
    difficulty: "Easy",
    time: "40 min",
    cost: "₹450",
    learn: ["ESP32 web server", "HTML + JavaScript served from a microcontroller", "PWM over Wi-Fi"],
    parts: ["ESP32 DevKit", "LED + 220 Ω", "Phone on the same Wi-Fi"],
    how: `<p>The ESP32 serves a web page with a slider. Every time you move it, JavaScript in your phone's browser calls <code>/set?v=128</code>. The ESP32 reads the value and sets the LED's PWM duty cycle. The page is stored in the ESP32's flash as a C++ <b>raw string literal</b> — <code>R"html( … )html"</code> — so you can write normal HTML without escaping quotes.</p>`,
    steps: [
      "GPIO 18 → 220 Ω → LED → GND.",
      "Put your Wi-Fi name and password in the code (2.4 GHz network).",
      "Upload, open the Serial Monitor at 115200 and note the IP address.",
      "Type that IP into your phone's browser.",
    ],
    code: `
#include <WiFi.h>
#include <WebServer.h>

const char* SSID = "YourWiFi";
const char* PASS = "YourPassword";
const int LED = 18;
WebServer server(80);

const char PAGE[] = R"html(
<!doctype html><meta name="viewport" content="width=device-width">
<h2>ESP32 Dimmer</h2>
<input type="range" min="0" max="255" value="0" id="s" style="width:90%">
<p>Brightness: <span id="v">0</span></p>
<script>
  s.oninput = () => { v.textContent = s.value; fetch('/set?v=' + s.value); };
</script>
)html";

void setup() {
  Serial.begin(115200);
  pinMode(LED, OUTPUT);
  WiFi.begin(SSID, PASS);
  while (WiFi.status() != WL_CONNECTED) { delay(300); Serial.print("."); }
  Serial.print("\\nOpen http://");
  Serial.println(WiFi.localIP());

  server.on("/", []() { server.send(200, "text/html", PAGE); });
  server.on("/set", []() {
    int v = constrain(server.arg("v").toInt(), 0, 255);
    analogWrite(LED, v);
    server.send(200, "text/plain", "OK");
  });
  server.begin();
}

void loop() {
  server.handleClient();
}`,
    lang: "cpp",
    challenge: "Add three sliders for an RGB LED and build your own smart mood light.",
  },
  {
    id: "esp-bt",
    title: "Bluetooth Remote Control",
    platform: "esp32",
    difficulty: "Easy",
    time: "30 min",
    cost: "₹400",
    learn: ["Bluetooth Classic (SPP)", "Command parsing", "Phone-to-hardware control without Wi-Fi"],
    parts: ["ESP32 DevKit (original ESP32 — S3/C3 have no Bluetooth Classic)", "LED + 220 Ω or the built-in LED", "Android phone with the free \"Serial Bluetooth Terminal\" app"],
    how: `<p>Bluetooth Classic's <b>Serial Port Profile</b> behaves like a wireless UART: whatever you type in the phone app arrives at the ESP32 byte by byte, exactly like <code>Serial.read()</code>. The sketch treats single characters as commands and replies with the new state.</p>`,
    steps: [
      "Use the built-in LED on GPIO 2, or connect GPIO 2 → 220 Ω → LED → GND.",
      "Upload, then pair your phone with \"ESP32-Remote\" in Bluetooth settings.",
      "Open Serial Bluetooth Terminal → Devices → ESP32-Remote → connect. Send 1, 0 or ?.",
    ],
    code: `
#include "BluetoothSerial.h"

BluetoothSerial BT;
const int LED = 2;

void setup() {
  Serial.begin(115200);
  pinMode(LED, OUTPUT);
  BT.begin("ESP32-Remote");          // the name your phone will see
  Serial.println("Bluetooth ready - pair with ESP32-Remote");
}

void loop() {
  if (BT.available()) {
    char c = BT.read();
    if (c == '1') { digitalWrite(LED, HIGH); BT.println("LED ON"); }
    else if (c == '0') { digitalWrite(LED, LOW); BT.println("LED OFF"); }
    else if (c == '?') { BT.println(digitalRead(LED) ? "LED is ON" : "LED is OFF"); }
  }
}`,
    lang: "cpp",
    challenge: "Connect an L298N and two motors and turn this into a Bluetooth-controlled rover (F, B, L, R, S commands).",
  },
  {
    id: "esp-weather",
    title: "IoT Weather Dashboard",
    platform: "esp32",
    difficulty: "Medium",
    time: "1 hour",
    cost: "₹650",
    learn: ["JSON APIs", "Live-updating web pages with fetch()", "Separating data from presentation"],
    parts: ["ESP32 DevKit", "DHT22 sensor (or DHT11)", "Jumper wires"],
    how: `<p>This project uses the pattern of every modern IoT device. The ESP32 serves two things: a web page (<code>/</code>) and a small <b>JSON</b> data endpoint (<code>/data</code>) like <code>{"t":28.4,"h":61.0}</code>. The page's JavaScript fetches fresh data every 2 seconds and updates the numbers without reloading. Your phone does the drawing; the ESP32 just measures.</p>`,
    steps: [
      "DHT22: + → 3V3, − → GND, OUT → GPIO 4.",
      "Install \"DHT sensor library\" by Adafruit.",
      "Set your Wi-Fi details, upload, and open the IP address shown in the Serial Monitor.",
    ],
    code: `
#include <WiFi.h>
#include <WebServer.h>
#include <DHT.h>

const char* SSID = "YourWiFi";
const char* PASS = "YourPassword";
DHT dht(4, DHT22);
WebServer server(80);

const char PAGE[] = R"html(
<!doctype html><meta name="viewport" content="width=device-width">
<style>body{font-family:sans-serif;text-align:center}b{font-size:3em}</style>
<h2>Weather Station</h2>
<p>Temperature<br><b id="t">--</b> &deg;C</p>
<p>Humidity<br><b id="h">--</b> %</p>
<script>
  async function update() {
    try {
      const d = await (await fetch('/data')).json();
      t.textContent = d.t; h.textContent = d.h;
    } catch (e) { t.textContent = 'err'; }
  }
  update(); setInterval(update, 2000);
</script>
)html";

void setup() {
  Serial.begin(115200);
  dht.begin();
  WiFi.begin(SSID, PASS);
  while (WiFi.status() != WL_CONNECTED) { delay(300); Serial.print("."); }
  Serial.print("\\nOpen http://");
  Serial.println(WiFi.localIP());

  server.on("/", []() { server.send(200, "text/html", PAGE); });
  server.on("/data", []() {
    float t = dht.readTemperature(), h = dht.readHumidity();
    if (isnan(t) || isnan(h)) { server.send(500, "text/plain", "sensor error"); return; }
    String json = "{\\"t\\":" + String(t, 1) + ",\\"h\\":" + String(h, 1) + "}";
    server.send(200, "application/json", json);
  });
  server.begin();
}

void loop() {
  server.handleClient();
}`,
    lang: "cpp",
    challenge: "Store the last 60 readings in an array and draw a live graph on the page with a <canvas>.",
  },
  {
    id: "esp-gps",
    title: "GPS Tracker with Live Map Link",
    platform: "esp32",
    difficulty: "Medium",
    time: "1 hour",
    cost: "₹750",
    learn: ["UART with a second hardware serial port", "NMEA sentences and the TinyGPS++ library", "Satellite navigation basics"],
    parts: ["ESP32 DevKit", "NEO-6M GPS module with antenna", "Jumper wires", "Open sky or a window"],
    how: `<p>A GPS receiver listens to timing signals from at least 4 satellites and calculates its own position from the tiny differences in arrival time. The NEO-6M sends its results as text lines called <b>NMEA sentences</b> over UART at 9600 baud. TinyGPS++ parses them into latitude, longitude, speed and satellite count. India's own system, <b>NavIC</b>, works on the same principle.</p>`,
    steps: [
      "NEO-6M VCC → 3V3, GND → GND.",
      "NEO-6M TX → ESP32 GPIO 16 (RX2). NEO-6M RX → GPIO 17 (TX2).",
      "Install the \"TinyGPSPlus\" library by Mikal Hart.",
      "Place the antenna facing the sky. The first fix can take 1–5 minutes; the module's LED blinks once it has one.",
    ],
    code: `
#include <TinyGPSPlus.h>

TinyGPSPlus gps;
HardwareSerial GPS(2);          // ESP32's second hardware UART

void setup() {
  Serial.begin(115200);
  GPS.begin(9600, SERIAL_8N1, 16, 17);   // baud, frame, RX pin, TX pin
}

void loop() {
  while (GPS.available()) gps.encode(GPS.read());

  static unsigned long last = 0;
  if (millis() - last < 2000) return;
  last = millis();

  if (gps.location.isValid()) {
    Serial.printf("Lat %.6f  Lng %.6f  Sats %u  Speed %.1f km/h\\n",
                  gps.location.lat(), gps.location.lng(),
                  (unsigned)gps.satellites.value(), gps.speed.kmph());
    Serial.printf("Map: https://maps.google.com/?q=%.6f,%.6f\\n",
                  gps.location.lat(), gps.location.lng());
  } else {
    Serial.println("Waiting for satellite fix...");
  }
}`,
    lang: "cpp",
    challenge: "Combine it with the weather dashboard code so your phone shows a live position link over Wi-Fi.",
  },
  {
    id: "esp-sleep",
    title: "Battery Sensor Node with Deep Sleep",
    platform: "esp32",
    difficulty: "Advanced",
    time: "1 hour",
    cost: "₹500",
    learn: ["Deep sleep and wake-up timers", "RTC memory that survives sleep", "Battery-life calculations"],
    parts: ["ESP32 (a bare module or low-power board is best)", "Potentiometer or any analog sensor", "18650 Li-ion cell with a protection/regulator board (optional)"],
    how: `<p>A sensor that stays awake drains a battery in a day or two. This node wakes up, takes one reading, and goes back to <b>deep sleep</b>, where the ESP32 draws about 10 µA. Each wake-up is a fresh boot, so normal variables are lost. <code>RTC_DATA_ATTR</code> puts a variable in the small RTC memory, which stays powered during sleep.</p>
      <p><b>Battery maths:</b> awake 1 s at ~80 mA, asleep 59 s at 0.01 mA → average ≈ 80 × 1/60 + 0.01 ≈ <b>1.34 mA</b>. A 2000 mAh cell lasts about 2000 ÷ 1.34 ≈ <b>62 days</b>. A DevKit board's USB chip and power LED waste several mA, so use a bare module for real deployments.</p>`,
    steps: [
      "Potentiometer: ends to 3V3 and GND, wiper → GPIO 34.",
      "Upload and open the Serial Monitor at 115200. You'll see a new boot every minute.",
    ],
    code: `
#define US_PER_S 1000000ULL
#define SLEEP_SECONDS 60

RTC_DATA_ATTR int bootCount = 0;     // survives deep sleep

void setup() {
  Serial.begin(115200);
  delay(200);
  bootCount++;

  int raw = analogRead(34);
  Serial.printf("Boot #%d  sensor = %d\\n", bootCount, raw);
  // A real node would send this over Wi-Fi, ESP-NOW or LoRa here.

  esp_sleep_enable_timer_wakeup(SLEEP_SECONDS * US_PER_S);
  Serial.println("Sleeping...");
  Serial.flush();
  esp_deep_sleep_start();              // execution stops here
}

void loop() {
  // never reached
}`,
    lang: "cpp",
    challenge: "Send each reading to a second ESP32 using ESP-NOW (no router needed), and measure the real current with your multimeter in series.",
  },

  /* ---------------- Raspberry Pi Pico ---------------- */
  {
    id: "pico-breathe",
    title: "Breathing LED in MicroPython",
    platform: "pico",
    difficulty: "Easy",
    time: "20 min",
    cost: "₹450",
    learn: ["MicroPython setup with Thonny", "PWM with duty_u16()", "Why brightness looks non-linear to the eye"],
    parts: ["Raspberry Pi Pico", "LED + 220 Ω", "Breadboard"],
    how: `<p>A sine wave smoothly rises and falls between −1 and +1. We shift it to 0–1 and use it as the PWM duty cycle so the LED gently "breathes", like a sleeping laptop's light. We also <b>square</b> the value: your eye is far more sensitive to changes in dim light than in bright light, so a squared curve looks smoother and more natural.</p>`,
    steps: [
      "GP15 (physical pin 20) → 220 Ω → LED → GND (pin 18 or any GND).",
      "Open Thonny, paste the code, and click Run. To run it at power-up, save it on the Pico as main.py.",
    ],
    code: `
from machine import Pin, PWM
import math
import time

led = PWM(Pin(15))
led.freq(1000)

t = 0
while True:
    b = (math.sin(t) + 1) / 2          # 0.0 to 1.0
    led.duty_u16(int(b * b * 65535))  # squared: looks smoother to the eye
    t += 0.05
    time.sleep(0.02)`,
    lang: "micropython",
    challenge: "Add a potentiometer on GP26 that controls the breathing speed.",
  },
  {
    id: "pico-temp",
    title: "Temperature Logger with the Pico's Built-in Sensor",
    platform: "pico",
    difficulty: "Easy",
    time: "30 min",
    cost: "₹350",
    learn: ["Internal ADC channels", "Converting ADC counts to real units", "Writing CSV files to flash"],
    parts: ["Raspberry Pi Pico (nothing else!)"],
    how: `<p>The RP2040 chip has a temperature sensor built in, connected to ADC channel 4. It outputs about 0.706 V at 27 °C, and the voltage falls by 1.721 mV for every degree warmer. We convert ADC counts → volts → °C using the datasheet formula, then append each reading to a CSV file in the Pico's flash. Open the file later in Excel or Python to graph it.</p>
      ${H.formula("T = 27 − (V − 0.706) ÷ 0.001721", "From the RP2040 datasheet")}`,
    steps: [
      "Just plug in the Pico and open Thonny.",
      "Run the script, then warm the chip with your finger and watch the value rise.",
      "Stop the script, then open temps.csv from the Pico in Thonny's Files panel.",
    ],
    code: `
from machine import ADC
import time

sensor = ADC(4)                   # internal temperature sensor
TO_VOLTS = 3.3 / 65535

while True:
    volts = sensor.read_u16() * TO_VOLTS
    temp_c = 27 - (volts - 0.706) / 0.001721
    line = "{},{:.2f}\\n".format(time.ticks_ms() // 1000, temp_c)
    print(line, end="")
    with open("temps.csv", "a") as f:   # open, append, close each time
        f.write(line)
    time.sleep(10)`,
    lang: "micropython",
    challenge: "Flash memory wears out with constant writes. Buffer 30 readings in a list and write them in one go.",
  },

  /* ---------------- Raspberry Pi ---------------- */
  {
    id: "pi-dashboard",
    title: "Home Control Panel with Flask",
    platform: "raspi",
    difficulty: "Medium",
    time: "1 hour",
    cost: "₹30 + Raspberry Pi",
    learn: ["Python web apps with Flask", "gpiozero for GPIO control", "Reading system data (CPU temperature)"],
    parts: ["Raspberry Pi 4 or 5 with Raspberry Pi OS", "LED + 330 Ω (or a relay module)", "Jumper wires (female-to-male)"],
    how: `<p>Flask turns Python functions into web pages: <code>@app.route("/toggle")</code> means "run this function when someone visits /toggle". Because the Pi runs full Linux, the same program can control GPIO pins, read the CPU temperature, talk to databases, and serve pages to every device on your network.</p>`,
    steps: [
      "GPIO 17 (physical pin 11) → 330 Ω → LED → GND (pin 9).",
      "Install Flask: <code>sudo apt install python3-flask</code>.",
      "Save the code as panel.py and run <code>python3 panel.py</code>.",
      "On your phone, open <code>http://&lt;pi-ip-address&gt;:5000</code> (find it with <code>hostname -I</code>).",
    ],
    code: `
from flask import Flask, redirect
from gpiozero import LED, CPUTemperature

app = Flask(__name__)
led = LED(17)

@app.route("/")
def home():
    state = "ON" if led.is_lit else "OFF"
    temp = CPUTemperature().temperature
    return f"""<meta name=viewport content='width=device-width'>
<h1>Pi Control Panel</h1>
<p>CPU temperature: {temp:.1f} &deg;C</p>
<p>LED is {state}</p>
<a href='/toggle'><button>Toggle LED</button></a>"""

@app.route("/toggle")
def toggle():
    led.toggle()
    return redirect("/")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)`,
    lang: "python",
    challenge: "Make the Pi a hub: have ESP32 nodes send readings to a /report route, store them in SQLite, and show a table.",
  },
  {
    id: "pi-motioncam",
    title: "Motion-Activated Security Camera",
    platform: "raspi",
    difficulty: "Medium",
    time: "1 hour",
    cost: "₹2,000 + Raspberry Pi",
    learn: ["PIR motion sensors", "The Raspberry Pi camera with Picamera2", "Event-driven Python"],
    parts: ["Raspberry Pi 4 or 5", "Raspberry Pi Camera Module (v2 or v3)", "HC-SR501 PIR motion sensor"],
    how: `<p>A <b>PIR</b> (passive infrared) sensor detects the heat radiated by a moving body. Its output goes HIGH when it sees motion. The Python script sleeps until that happens (<code>wait_for_motion()</code>), snaps a photo named with the date and time, then waits for the motion to stop before re-arming. No CPU is wasted while nothing is happening.</p>`,
    steps: [
      "Connect the camera ribbon cable to the CAMERA port (contacts facing the right way — check the Pi's guide).",
      "PIR VCC → 5V (pin 2), GND → GND (pin 6), OUT → GPIO 4 (pin 7). The PIR's output is 3.3 V, so it's safe.",
      "Test the camera: <code>rpicam-hello</code>.",
      "Run the script and walk past the sensor. The PIR needs about 30 s to settle after power-up.",
    ],
    code: `
from gpiozero import MotionSensor
from picamera2 import Picamera2
from datetime import datetime
import time

pir = MotionSensor(4)
cam = Picamera2()
cam.configure(cam.create_still_configuration())
cam.start()
time.sleep(2)                     # let exposure settle

print("Armed. Waiting for motion...")
while True:
    pir.wait_for_motion()
    name = datetime.now().strftime("motion_%Y%m%d_%H%M%S.jpg")
    cam.capture_file(name)
    print("Captured", name)
    pir.wait_for_no_motion()`,
    lang: "python",
    challenge: "Record a 10-second video instead of a photo, and serve a gallery of captures with the Flask panel project.",
  },
  {
    id: "pi-face",
    title: "Face Detection with OpenCV",
    platform: "raspi",
    difficulty: "Advanced",
    time: "2 hours",
    cost: "₹2,000 + Raspberry Pi",
    learn: ["Computer vision with OpenCV", "Haar cascade classifiers", "Real-time image processing on embedded Linux"],
    parts: ["Raspberry Pi 4 or 5 with the desktop version of Raspberry Pi OS", "Raspberry Pi Camera Module", "Monitor (or VNC) to see the window"],
    how: `<p>Every frame from the camera is converted to greyscale, then scanned by a <b>Haar cascade</b> — a pre-trained classifier that looks for the light/dark patterns of a face (eyes darker than cheeks, the bridge of the nose lighter). Each detected face gets a green box. The same pipeline — capture, pre-process, detect, act — is the foundation of surveillance systems, drones and target tracking.</p>`,
    steps: [
      "Install OpenCV: <code>sudo apt install python3-opencv opencv-data</code>.",
      "Connect and test the camera (<code>rpicam-hello</code>).",
      "Run the script from the desktop terminal. Press <b>q</b> to quit.",
    ],
    code: `
import cv2
from picamera2 import Picamera2

try:
    base = cv2.data.haarcascades
except AttributeError:
    base = "/usr/share/opencv4/haarcascades/"   # from the opencv-data package
face = cv2.CascadeClassifier(base + "haarcascade_frontalface_default.xml")

cam = Picamera2()
cam.configure(cam.create_preview_configuration(main={"format": "RGB888", "size": (640, 480)}))
cam.start()

while True:
    frame = cam.capture_array()                      # BGR order, ready for OpenCV
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=5, minSize=(40, 40))
    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
    cv2.putText(frame, f"Faces: {len(faces)}", (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.imshow("Face detection", frame)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cv2.destroyAllWindows()`,
    lang: "python",
    challenge: "Mount the camera on two servos (pan and tilt) driven by a Pico, and send it commands over UART so it keeps the face centred.",
  },
];

window.GLOSSARY = [
  ["555 timer", "A classic IC that makes timers and oscillators using an external resistor and capacitor."],
  ["ADC", "Analog-to-Digital Converter. Turns a voltage into a number (0–1023 on an Uno)."],
  ["Ampere (A)", "Unit of current: one coulomb of charge per second."],
  ["Anode", "The positive terminal of a diode or LED (the long leg)."],
  ["Baud rate", "Bits per second on a serial (UART) link, e.g. 9600."],
  ["BJT", "Bipolar Junction Transistor. Current-controlled; terminals base, collector, emitter."],
  ["Breadboard", "Solderless board for prototyping; strips of holes are connected inside."],
  ["Capacitor", "Stores charge between two plates. Blocks DC, passes AC."],
  ["Cathode", "The negative terminal of a diode or LED (short leg, flat side)."],
  ["CMOS", "Complementary MOS: logic built from paired NMOS and PMOS transistors."],
  ["Deep sleep", "A microcontroller mode that switches off almost everything to save power (µA instead of mA)."],
  ["Duty cycle", "Percentage of time a PWM signal is HIGH."],
  ["Embedded system", "A computer built into a product to perform one dedicated job."],
  ["ESP32", "Low-cost 32-bit microcontroller from Espressif with built-in Wi-Fi and Bluetooth."],
  ["Firmware", "Software stored in a device's flash that runs its hardware."],
  ["Flip-flop", "A 1-bit memory element that updates on a clock edge."],
  ["FPGA", "Field-Programmable Gate Array: a chip whose logic you can reconfigure with HDL."],
  ["GND", "Ground — the 0 V reference point of a circuit."],
  ["GPIO", "General-Purpose Input/Output: a pin your code can read or drive."],
  ["GPS", "Global Positioning System: finds position from satellite signal timing. India's regional system is NavIC."],
  ["H-bridge", "Four switches arranged so a motor can be driven in both directions (e.g. the L298N)."],
  ["I²C", "Two-wire (SDA, SCL) bus where devices are selected by address."],
  ["IMU", "Inertial Measurement Unit: accelerometer + gyroscope (± magnetometer) that senses motion and tilt."],
  ["Inductor", "A coil that stores energy in a magnetic field and resists changes in current."],
  ["Interrupt", "A hardware signal that pauses the main code to run an urgent routine (ISR)."],
  ["IoT", "Internet of Things: everyday devices with sensors that connect to a network."],
  ["JSON", "A simple text format for data, e.g. {\"t\": 28.4}. The language of web APIs."],
  ["KCL / KVL", "Kirchhoff's laws: currents into a node sum to zero; voltages around a loop sum to zero."],
  ["LED", "Light Emitting Diode. Needs a series resistor to limit current."],
  ["Microcontroller", "CPU, memory and I/O peripherals on a single chip."],
  ["MicroPython", "A compact version of Python that runs directly on microcontrollers like the Pico and ESP32."],
  ["MOSFET", "Voltage-controlled transistor; terminals gate, drain, source."],
  ["NMEA", "Plain-text sentence format GPS receivers use to report position."],
  ["Ohm (Ω)", "Unit of resistance. 1 Ω = 1 V per 1 A."],
  ["Op-amp", "High-gain differential amplifier used for amplifying, filtering and comparing."],
  ["PIR sensor", "Passive infrared sensor that detects the body heat of moving people or animals."],
  ["Pull-up resistor", "Holds an input HIGH by default so it isn't floating."],
  ["PWM", "Pulse Width Modulation: fast on/off switching to simulate an analog level."],
  ["Raspberry Pi", "A credit-card-sized Linux computer with GPIO pins for hardware projects."],
  ["Raspberry Pi Pico", "Low-cost microcontroller board built on the RP2040 chip."],
  ["Register", "A small memory location inside a chip; its bits control hardware."],
  ["RSSI", "Received Signal Strength Indicator, in dBm: −40 is strong, −90 is very weak."],
  ["RTL", "Register Transfer Level: hardware described in Verilog/VHDL."],
  ["RTOS", "Real-Time Operating System — schedules tasks to meet deadlines (e.g. FreeRTOS)."],
  ["SBC", "Single-Board Computer: a complete computer on one board, like the Raspberry Pi."],
  ["Semiconductor", "A material (like silicon) whose conductivity can be controlled by doping and voltage."],
  ["SPI", "Fast 4-wire bus: MOSI, MISO, SCK, CS."],
  ["Synthesis", "Converting RTL code into a netlist of logic gates."],
  ["UART", "Asynchronous serial link using TX and RX, with start and stop bits."],
  ["VLSI", "Very Large Scale Integration: millions to billions of transistors on one chip."],
  ["Volt (V)", "Unit of electrical potential difference — the 'push'."],
  ["Watt (W)", "Unit of power: P = V × I."],
];
