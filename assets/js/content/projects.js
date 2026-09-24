window.PROJECTS = [
  {
    id: "traffic",
    title: "Traffic Light Controller",
    icon: "🚦",
    difficulty: "Easy",
    time: "30 min",
    learn: ["Digital output", "Timing with delay()", "Using resistors with LEDs"],
    parts: ["Arduino Uno", "Red, yellow and green LEDs", "3 × 220 Ω resistors", "Breadboard & jumper wires"],
    wiring: "Pins 8, 9 and 10 → 220 Ω resistor → LED anode (long leg). Each LED cathode (short leg) → GND.",
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
    challenge: "Add a pedestrian button (with INPUT_PULLUP) that shortens the green phase when pressed.",
  },
  {
    id: "nightlamp",
    title: "Automatic Night Lamp",
    icon: "🌙",
    difficulty: "Easy",
    time: "40 min",
    learn: ["Voltage divider", "Analog input (ADC)", "Thresholds & decisions"],
    parts: ["Arduino Uno", "LDR (light-dependent resistor)", "10 kΩ resistor", "LED + 220 Ω resistor"],
    wiring: "5V → LDR → A0 → 10 kΩ → GND (a voltage divider). LED on pin 9 through 220 Ω.",
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
    challenge: "Use analogWrite() so the lamp gets gradually brighter as it gets darker, instead of just on/off.",
  },
  {
    id: "distance",
    title: "Ultrasonic Distance Meter",
    icon: "📏",
    difficulty: "Medium",
    time: "45 min",
    learn: ["Timing pulses with pulseIn()", "Speed of sound physics", "Serial output"],
    parts: ["Arduino Uno", "HC-SR04 ultrasonic sensor", "Buzzer (optional)"],
    wiring: "HC-SR04: VCC → 5V, GND → GND, TRIG → pin 9, ECHO → pin 10. Buzzer on pin 6.",
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
    challenge: "Make the buzzer beep faster as the object gets closer — like a car's parking sensor.",
  },
  {
    id: "weather",
    title: "Temperature & Humidity Monitor",
    icon: "🌡️",
    difficulty: "Medium",
    time: "45 min",
    learn: ["Using libraries", "Digital sensor protocols", "Formatting data"],
    parts: ["Arduino Uno", "DHT11 or DHT22 sensor", "10 kΩ pull-up (if the module doesn't have one)"],
    wiring: "DHT: VCC → 5V, GND → GND, DATA → pin 2. Install 'DHT sensor library' by Adafruit via Library Manager.",
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
    challenge: "Add a 16×2 I²C LCD or 0.96\" OLED display so it works without a PC.",
  },
  {
    id: "plant",
    title: "Smart Plant Watering System",
    icon: "🌱",
    difficulty: "Medium",
    time: "1–2 hours",
    learn: ["Analog sensors", "Transistor/relay switching", "Hysteresis in control"],
    parts: ["Arduino Uno", "Capacitive soil moisture sensor", "5 V mini water pump", "Logic-level MOSFET (IRLZ44N) or relay module", "1N4007 flyback diode", "Separate 5 V supply for the pump"],
    wiring: "Sensor AOUT → A0. Pin 7 → 220 Ω → MOSFET gate; pump between +5V (external) and drain; source → GND. Diode across the pump (stripe to +). Join all grounds.",
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
    challenge: "Move it to an ESP32 and send moisture readings to your phone over Wi-Fi.",
  },
  {
    id: "radar",
    title: "Mini Radar Scanner",
    icon: "📡",
    difficulty: "Advanced",
    time: "2–3 hours",
    learn: ["Servo control (PWM)", "Combining sensors & actuators", "Sending data to a PC for plotting"],
    parts: ["Arduino Uno", "SG90 servo motor", "HC-SR04 ultrasonic sensor", "Mount the sensor on the servo horn"],
    wiring: "Servo signal → pin 3, VCC → 5V, GND → GND. HC-SR04 TRIG → 9, ECHO → 10.",
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
    challenge: "Plot the angle,distance pairs as a radar screen using Processing or Python (matplotlib polar plot).",
  },
];

window.GLOSSARY = [
  ["ADC", "Analog-to-Digital Converter. Turns a voltage into a number (0–1023 on an Uno)."],
  ["Ampere (A)", "Unit of current: one coulomb of charge per second."],
  ["Anode", "The positive terminal of a diode or LED (the long leg)."],
  ["Baud rate", "Bits per second on a serial (UART) link, e.g. 9600."],
  ["BJT", "Bipolar Junction Transistor. Current-controlled; terminals base, collector, emitter."],
  ["Breadboard", "Solderless board for prototyping; strips of holes are connected inside."],
  ["Capacitor", "Stores charge between two plates. Blocks DC, passes AC."],
  ["Cathode", "The negative terminal of a diode or LED (short leg, flat side)."],
  ["CMOS", "Complementary MOS: logic built from paired NMOS and PMOS transistors."],
  ["Duty cycle", "Percentage of time a PWM signal is HIGH."],
  ["Embedded system", "A computer built into a product to perform one dedicated job."],
  ["Firmware", "Software stored in a device's flash that runs its hardware."],
  ["Flip-flop", "A 1-bit memory element that updates on a clock edge."],
  ["FPGA", "Field-Programmable Gate Array: a chip whose logic you can reconfigure with HDL."],
  ["GND", "Ground — the 0 V reference point of a circuit."],
  ["I²C", "Two-wire (SDA, SCL) bus where devices are selected by address."],
  ["Inductor", "A coil that stores energy in a magnetic field and resists changes in current."],
  ["Interrupt", "A hardware signal that pauses the main code to run an urgent routine (ISR)."],
  ["KCL / KVL", "Kirchhoff's laws: currents into a node sum to zero; voltages around a loop sum to zero."],
  ["LED", "Light Emitting Diode. Needs a series resistor to limit current."],
  ["Microcontroller", "CPU, memory and I/O peripherals on a single chip."],
  ["MOSFET", "Voltage-controlled transistor; terminals gate, drain, source."],
  ["Ohm (Ω)", "Unit of resistance. 1 Ω = 1 V per 1 A."],
  ["Op-amp", "High-gain differential amplifier used for amplifying, filtering and comparing."],
  ["Pull-up resistor", "Holds an input HIGH by default so it isn't floating."],
  ["PWM", "Pulse Width Modulation: fast on/off switching to simulate an analog level."],
  ["Register", "A small memory location inside a chip; its bits control hardware."],
  ["RTL", "Register Transfer Level: hardware described in Verilog/VHDL."],
  ["RTOS", "Real-Time Operating System — schedules tasks to meet deadlines (e.g. FreeRTOS)."],
  ["Semiconductor", "A material (like silicon) whose conductivity can be controlled by doping and voltage."],
  ["SPI", "Fast 4-wire bus: MOSI, MISO, SCK, CS."],
  ["Synthesis", "Converting RTL code into a netlist of logic gates."],
  ["UART", "Asynchronous serial link using TX and RX, with start and stop bits."],
  ["VLSI", "Very Large Scale Integration: millions to billions of transistors on one chip."],
  ["Volt (V)", "Unit of electrical potential difference — the 'push'."],
  ["Watt (W)", "Unit of power: P = V × I."],
];
