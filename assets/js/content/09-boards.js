COURSE.push({
  id: "boards",
  title: "Beyond Arduino: ESP32 & Raspberry Pi",
  tagline: "Wi-Fi microcontrollers, MicroPython on the Pico, and a full Linux computer on the Raspberry Pi.",
  icon: "📶",
  level: "Intermediate",
  lessons: [
    {
      id: "choose",
      title: "Choosing the right board",
      minutes: 7,
      body: `
<p class="lead">Arduino Uno is a great teacher, but real products need more: Wi-Fi, more memory, a camera, or a full operating system. Three boards cover almost every student and startup project: the <strong>ESP32</strong>, the <strong>Raspberry Pi Pico</strong> and the <strong>Raspberry Pi</strong>.</p>
${H.table(["", "Arduino Uno", "ESP32", "Raspberry Pi Pico", "Raspberry Pi 4 / 5"], [
  ["Type", "Microcontroller", "Microcontroller", "Microcontroller", "Single-board computer"],
  ["Brain", "ATmega328P, 8-bit, 16 MHz", "Xtensa dual-core 32-bit, 240 MHz", "RP2040 dual-core ARM Cortex-M0+, 133 MHz", "Quad-core ARM Cortex-A72/A76, 1.5–2.4 GHz"],
  ["RAM", "2 KB", "520 KB", "264 KB", "2–8 GB"],
  ["Wireless", "None", "Wi-Fi + Bluetooth", "None (Pico W adds Wi-Fi)", "Wi-Fi + Bluetooth + Ethernet"],
  ["Logic voltage", "5 V", "3.3 V", "3.3 V", "3.3 V"],
  ["Language", "C/C++ (Arduino)", "C/C++ (Arduino, ESP-IDF), MicroPython", "MicroPython, C/C++", "Python, C, anything Linux runs"],
  ["Boots in", "Instantly", "Under 1 s", "Instantly", "20–40 s (Linux)"],
  ["Approx. price", "₹400–700", "₹350–600", "₹350–600", "₹4,000–8,000"],
])}
${H.analogy(`<p>A <b>microcontroller</b> (Uno, ESP32, Pico) is a <b>calculator</b>: switch it on and it does its one job instantly and reliably. A <b>Raspberry Pi</b> is a <b>laptop</b>: it can do almost anything, but it needs an operating system, takes time to boot, and must be shut down properly.</p>`)}
<h2>A simple rule of thumb</h2>
<ul>
  <li>Need <b>Wi-Fi or Bluetooth</b> on a budget? → <b>ESP32</b>.</li>
  <li>Want to learn <b>Python on hardware</b>, or need precise timing and low cost? → <b>Pico</b>.</li>
  <li>Need a <b>camera, AI, a screen, a database or a web app</b>? → <b>Raspberry Pi</b>.</li>
  <li>Need hard real-time control <i>and</i> vision? Use <b>both</b>: a Pi for thinking, a microcontroller for the motors.</li>
</ul>
${H.widget("boardpicker", "Board picker: tick what your project needs")}
${H.mistake(`<p>ESP32, Pico and Raspberry Pi pins are <b>3.3 V only</b>. Connecting a 5 V sensor output straight to them can permanently damage the pin. Use a voltage divider (Module 3) or a logic-level shifter.</p>`)}
`,
    },
    {
      id: "esp32",
      title: "ESP32: your first Wi-Fi microcontroller",
      minutes: 9,
      body: `
<p class="lead">The ESP32, made by the Chinese company Espressif, is the most popular chip in the world for <strong>IoT (Internet of Things)</strong>. Smart plugs, smart bulbs and many industrial sensors run on it.</p>
<h2>Set it up in the Arduino IDE</h2>
${H.steps([
  "Open <b>File → Preferences</b> and paste this into <i>Additional boards manager URLs</i>: <code>https://espressif.github.io/arduino-esp32/package_esp32_index.json</code>",
  "Open <b>Tools → Board → Boards Manager</b>, search <b>esp32</b> and install <i>esp32 by Espressif Systems</i>.",
  "Choose <b>Tools → Board → ESP32 Dev Module</b> and the right port.",
  "If upload fails with \"Connecting…\", hold the <b>BOOT</b> button on the board until the upload starts.",
])}
<p>Your Arduino knowledge carries over directly: <code>pinMode</code>, <code>digitalWrite</code>, <code>analogRead</code> and <code>Serial</code> all work. The built-in LED on most DevKit boards is on <b>GPIO 2</b>.</p>
<h2>Scan for Wi-Fi networks</h2>
${H.code(`
#include <WiFi.h>

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);          // Station mode: join networks, like a phone
}

void loop() {
  int n = WiFi.scanNetworks();
  Serial.printf("Found %d networks\\n", n);
  for (int i = 0; i < n; i++) {
    Serial.printf("%2d  %-24s  %d dBm\\n", i + 1, WiFi.SSID(i).c_str(), WiFi.RSSI(i));
  }
  delay(5000);
}
`)}
<p><b>RSSI</b> is signal strength in dBm. −40 dBm is excellent, −70 dBm is usable, and −90 dBm is barely there. It's a logarithmic scale: every 3 dB means half (or double) the power.</p>
<h2>What's special about ESP32 pins</h2>
${H.table(["Feature", "Detail"], [
  ["ADC", "12-bit (0–4095) on 3.3 V. ADC2 pins stop working while Wi-Fi is on, so use ADC1 pins (GPIO 32–39) for sensors."],
  ["Touch pins", "10 capacitive touch inputs: touch a bare wire and <code>touchRead()</code> changes."],
  ["DAC", "Two true analog outputs (GPIO 25, 26)."],
  ["PWM", "Almost any pin, with frequency and resolution you choose."],
  ["Input-only", "GPIO 34–39 can't be outputs."],
  ["Deep sleep", "About 10 µA. Wakes on a timer, a pin, or touch."],
])}
${H.fact(`<p>The ESP32 contains a third, tiny <b>ULP (Ultra Low Power) co-processor</b> that can keep reading sensors while the main cores sleep, which is how battery sensors last for months.</p>`)}
`,
    },
    {
      id: "webserver",
      title: "ESP32 web server: control from your phone",
      minutes: 9,
      body: `
<p class="lead">Now for the magic moment: the ESP32 hosts its own <strong>web page</strong>. Open it on any phone on the same Wi-Fi, tap a button, and an LED switches on across the room.</p>
<h2>How it works</h2>
<div class="flow-diagram">
  <div class="node">Phone browser<small>asks for /on</small></div><div class="arrow">→</div>
  <div class="node hl">ESP32 web server<small>runs the handler</small></div><div class="arrow">→</div>
  <div class="node">GPIO 2<small>LED switches</small></div>
</div>
<p>Your phone sends an <b>HTTP request</b>, the same kind it sends to any website. The ESP32 reads the path (<code>/on</code> or <code>/off</code>), switches the pin, and replies with a small HTML page.</p>
${H.code(`
#include <WiFi.h>
#include <WebServer.h>

const char* SSID = "YourWiFi";       // change these
const char* PASS = "YourPassword";
const int LED = 2;

WebServer server(80);                // port 80 = normal web traffic
bool ledOn = false;

String page() {
  return String("<!doctype html><meta name=viewport content='width=device-width'>"
    "<h1>ESP32 LED</h1><p>LED is ") + (ledOn ? "ON" : "OFF") +
    "</p><a href='/on'><button>ON</button></a> <a href='/off'><button>OFF</button></a>";
}

void setup() {
  Serial.begin(115200);
  pinMode(LED, OUTPUT);
  WiFi.begin(SSID, PASS);
  while (WiFi.status() != WL_CONNECTED) { delay(300); Serial.print("."); }
  Serial.print("\\nOpen http://");
  Serial.println(WiFi.localIP());    // type this address into your phone

  server.on("/",    []() { server.send(200, "text/html", page()); });
  server.on("/on",  []() { ledOn = true;  digitalWrite(LED, HIGH); server.send(200, "text/html", page()); });
  server.on("/off", []() { ledOn = false; digitalWrite(LED, LOW);  server.send(200, "text/html", page()); });
  server.begin();
}

void loop() {
  server.handleClient();             // check for new requests
}
`)}
${H.analogy(`<p>The ESP32 is now a tiny <b>shopkeeper</b>. <code>server.on()</code> is its price list: "if someone asks for <i>/on</i>, do this". <code>handleClient()</code> is the shopkeeper looking up from the counter to see if a customer has arrived.</p>`)}
${H.mistake(`<p>The ESP32 only supports <b>2.4 GHz Wi-Fi</b>, not 5 GHz. If it never connects, check your router band. Also never commit real Wi-Fi passwords to a public GitHub repo.</p>`)}
${H.key(`<p>Anything reachable over a network can be attacked. For real products add authentication, use HTTPS or MQTT over TLS, and never expose a device directly to the internet. Security is a core embedded skill, and critical in defence systems.</p>`)}
`,
    },
    {
      id: "pico",
      title: "Raspberry Pi Pico & MicroPython",
      minutes: 8,
      body: `
<p class="lead">The <strong>Raspberry Pi Pico</strong> is a ₹400 microcontroller built on Raspberry Pi's own RP2040 chip. Its superpower for beginners: you can program it in <strong>Python</strong>, typing commands and seeing results instantly.</p>
<h2>Set up in 3 minutes</h2>
${H.steps([
  "Download the MicroPython <b>.uf2</b> file for Pico (or Pico W) from micropython.org.",
  "Hold the <b>BOOTSEL</b> button while plugging in USB. The Pico appears as a USB drive called RPI-RP2.",
  "Drag the .uf2 file onto it. The Pico reboots into MicroPython.",
  "Install <b>Thonny</b> (thonny.org), choose <i>Run → Configure interpreter → MicroPython (Raspberry Pi Pico)</i>.",
])}
<h2>Blink, in Python</h2>
${H.code(`
from machine import Pin
import time

led = Pin("LED", Pin.OUT)     # On a plain Pico you can also use Pin(25, Pin.OUT)

while True:
    led.toggle()
    time.sleep(0.5)
`, "micropython")}
<p>Compare this with the Arduino version: same idea, fewer symbols. The <b>REPL</b> (the prompt at the bottom of Thonny) lets you type <code>led.on()</code> and see the LED react immediately. That's brilliant for experimenting.</p>
<h2>Reading analog and using PWM</h2>
${H.code(`
from machine import Pin, ADC, PWM
import time

pot = ADC(26)                 # GP26 = ADC0
led = PWM(Pin(15))
led.freq(1000)

while True:
    value = pot.read_u16()    # 0–65535 (scaled from the 12-bit ADC)
    led.duty_u16(value)       # brightness follows the knob
    print(value)
    time.sleep(0.05)
`, "micropython")}
${H.table(["Feature", "Pico"], [
  ["GPIO", "26 usable pins, 3.3 V"],
  ["ADC", "3 external channels (GP26–28) + internal temperature sensor"],
  ["PIO", "8 programmable I/O state machines: build your own protocols in hardware"],
  ["Pico W", "Adds Wi-Fi and Bluetooth for about ₹150 more"],
])}
${H.fact(`<p>The RP2040's <b>PIO</b> blocks are so flexible that people use them to generate VGA video, drive thousands of addressable LEDs, and even emulate old game-console controllers — all without loading the main CPU.</p>`)}
`,
    },
    {
      id: "raspi",
      title: "Raspberry Pi: a computer for your projects",
      minutes: 9,
      body: `
<p class="lead">A <strong>Raspberry Pi 4 or 5</strong> is a full Linux computer the size of a credit card. Connect a keyboard and screen and it's a desktop; add a camera and it can recognise faces; add a GPIO header and it controls hardware.</p>
<h2>Getting started</h2>
${H.steps([
  "Install <b>Raspberry Pi Imager</b> on your laptop and flash <i>Raspberry Pi OS</i> to a microSD card (16 GB or more).",
  "In the Imager settings, set a username, password and your Wi-Fi, and <b>enable SSH</b>.",
  "Boot the Pi and connect from your laptop: <code>ssh pi@raspberrypi.local</code>.",
  "Update once: <code>sudo apt update && sudo apt full-upgrade</code>.",
])}
<h2>The 40-pin GPIO header</h2>
<p>The header gives you 3.3 V and 5 V power, ground, 26 GPIO pins, plus I²C, SPI and UART — everything from Module 7. There is <b>no ADC</b> on a Raspberry Pi, so for analog sensors add an ADC chip such as the MCP3008 (SPI) or ADS1115 (I²C), or pair it with a Pico.</p>
<h2>Blink with Python and gpiozero</h2>
${H.code(`
from gpiozero import LED, Button
from signal import pause

led = LED(17)         # GPIO17, physical pin 11
button = Button(2)    # GPIO2, with the internal pull-up

button.when_pressed = led.on
button.when_released = led.off

pause()               # keep the program running, waiting for events
`, "python")}
<p>Notice the style: instead of checking the button in a loop, we attach <b>event handlers</b>. It's the interrupt idea from Module 7, written in friendly Python.</p>
${H.table(["Use a Raspberry Pi when you need…", "Example"], [
  ["A camera and computer vision", "Face or object detection with OpenCV"],
  ["A web app or database", "Home dashboard with Flask + SQLite"],
  ["Heavy maths or AI", "Running a TensorFlow Lite model"],
  ["Networking", "Gateway that collects data from many ESP32 nodes"],
  ["A display or GUI", "Kiosk screen, ground-control station"],
])}
${H.mistake(`<p>Don't just pull the power cable: that can corrupt the SD card. Shut down properly with <code>sudo shutdown now</code>. And use a good power supply (5 V 3 A for Pi 4, 5 V 5 A for Pi 5): low voltage causes random crashes.</p>`)}
${H.key(`<p>Linux is <b>not real-time</b>: the OS can pause your program for milliseconds at any moment. For precise motor or pulse timing, let a microcontroller do it and have the Pi send it commands over UART or I²C.</p>`)}
`,
    },
  ],
  quiz: [
    { q: "You need a cheap board with built-in Wi-Fi for a sensor. Best choice?", options: ["Arduino Uno", "ESP32", "Raspberry Pi 5", "A 555 timer"], answer: 1, why: "The ESP32 has Wi-Fi and Bluetooth built in, at a microcontroller price." },
    { q: "What logic voltage do ESP32, Pico and Raspberry Pi GPIO pins use?", options: ["5 V", "3.3 V", "12 V", "1.8 V"], answer: 1, why: "All three are 3.3 V devices. 5 V signals need level shifting." },
    { q: "In the ESP32 web server, what does server.handleClient() do?", options: ["Connects to Wi-Fi", "Checks for and answers incoming requests", "Turns on the LED", "Resets the chip"], answer: 1, why: "It must be called often in loop() so the server can answer requests." },
    { q: "Which language runs directly on the Pico after flashing the .uf2 file?", options: ["Java", "MicroPython", "MATLAB", "Verilog"], answer: 1, why: "The .uf2 file installs the MicroPython interpreter on the Pico." },
    { q: "Why pair a Raspberry Pi with a microcontroller for motor control?", options: ["The Pi has no GPIO", "Linux is not real-time, so timing can jitter", "Microcontrollers are faster at AI", "The Pi can't run Python"], answer: 1, why: "The OS may pause the program; a microcontroller gives precise, predictable timing." },
  ],
});
