/* Summaries and recaps for the branch modules added later. */
Object.assign(window.RECAPS, {
  "analog/psu": {
    idea: "A power supply turns 230 V AC into steady DC in four steps: transformer, rectifier, filter and regulator.",
    recap: ["A transformer's voltage ratio equals its turns ratio.", "A full-wave bridge rectifier uses 4 diodes; ripple is at 100 Hz on Indian mains.", "A filter capacitor smooths the ripple; a regulator holds the output steady."],
  },
  "analog/amplifiers": {
    idea: "An amplifier makes a small signal bigger without changing its shape.",
    recap: ["Voltage gain in dB = 20 log10(Vout/Vin).", "Biasing keeps the transistor in its active region so the signal can swing both ways.", "Bandwidth is the frequency range where gain stays within 3 dB of maximum."],
  },
  "analog/filters": {
    idea: "Filters keep the frequencies you want and block the rest.",
    recap: ["Low-pass, high-pass, band-pass and notch filters each pass a different range.", "An RC filter's cut-off frequency is 1/(2πRC).", "A first-order filter falls by 20 dB per decade beyond cut-off."],
  },
  "analog/oscillators": {
    idea: "An oscillator is an amplifier that feeds itself, creating a steady signal from nothing.",
    recap: ["Barkhausen: loop gain ≥ 1 and loop phase 0° or 360°.", "RC oscillators for audio, LC for radio, crystals for precise clocks.", "A 32,768 Hz crystal divided 15 times gives 1 tick per second."],
  },
  "digital2/counters": {
    idea: "Chained flip-flops count events, divide clocks and move data one bit at a time.",
    recap: ["An n-bit counter has 2ⁿ states; synchronous counters avoid glitches.", "Each counter stage divides the frequency by 2.", "Shift registers convert between serial and parallel data."],
  },
  "digital2/fsm": {
    idea: "A finite state machine remembers where it is and moves to the next state based on its inputs.",
    recap: ["An FSM has states, transitions and outputs.", "Moore outputs depend on state only; Mealy outputs also depend on inputs.", "In hardware: a state register plus next-state and output logic."],
  },
  "digital2/memory": {
    idea: "Different memories trade speed, size, cost and whether they keep data without power.",
    recap: ["SRAM is fast and used for caches; DRAM is dense but needs refreshing.", "Flash keeps data without power.", "n address lines select 2ⁿ locations."],
  },
  "digital2/adc-fpga": {
    idea: "ADCs and DACs bridge analog and digital, and FPGAs let you build your own digital hardware.",
    recap: ["ADC step size = Vref/2ⁿ; sample above the Nyquist rate.", "Flash ADCs are fastest, SAR is balanced, sigma-delta is most precise.", "FPGAs are reconfigurable hardware, used for prototyping and in the field."],
  },
  "vlsi2/rtl": {
    idea: "Good RTL follows strict rules so the hardware that gets built matches what you simulated.",
    recap: ["Use <= in clocked blocks and = in combinational blocks.", "Assign every output in every branch, or synthesis infers a latch.", "No # delays in design code — only in testbenches."],
  },
  "vlsi2/timing": {
    idea: "A chip's maximum speed is set by how long the slowest path takes between two flip-flops.",
    recap: ["Data must be stable before (setup) and after (hold) the clock edge.", "Tclk ≥ tclk→q + tlogic + tsetup.", "Pipelining shortens paths to allow a faster clock."],
  },
  "vlsi2/verification": {
    idea: "Verification proves the design works before it's manufactured, and often takes more effort than design.",
    recap: ["Self-checking testbenches compare results automatically.", "Constrained-random tests, UVM and coverage are the industry standard.", "Verification roles are a common entry point into VLSI."],
  },
  "vlsi2/physical": {
    idea: "Physical design turns a gate netlist into real geometry on silicon, and a whole industry supports it.",
    recap: ["Floorplan → placement → clock tree → routing → sign-off.", "Sign-off checks timing, power, DRC and LVS.", "Fabless companies design; foundries manufacture; EDA companies make the tools."],
  },
  "comm/signals": {
    idea: "Communication moves information through a noisy channel, and frequency is the key to understanding it.",
    recap: ["Transmitter → channel → receiver; noise is added in the channel.", "The Fourier transform shows a signal's spectrum.", "The radio spectrum is shared and divided into bands."],
  },
  "comm/noise": {
    idea: "Whether a link works depends on how strong the signal is compared with the noise.",
    recap: ["0 dBm = 1 mW; +3 dB doubles power; dB values add.", "Thermal noise is always present.", "Shannon: C = B log2(1 + SNR) is the ultimate speed limit."],
  },
  "comm/am": {
    idea: "Modulation loads a message onto a high-frequency carrier; AM varies the carrier's amplitude.",
    recap: ["Modulation makes antennas practical and lets stations share the spectrum.", "Keep μ ≤ 1 to avoid over-modulation.", "AM bandwidth = 2 × fm; an envelope detector demodulates it."],
  },
  "comm/fm-radio": {
    idea: "FM varies the carrier's frequency, which makes it far more resistant to noise than AM.",
    recap: ["Carson's rule: FM bandwidth ≈ 2(Δf + fm).", "A superheterodyne receiver converts every station to a fixed IF.", "Modern radios do most of this digitally."],
  },
  "dcomm/sampling": {
    idea: "Sample at more than twice the highest frequency, or high frequencies will masquerade as low ones.",
    recap: ["Nyquist: fs > 2 fmax.", "Sampling too slowly causes aliasing, which can't be undone.", "An anti-aliasing filter goes before every ADC."],
  },
  "dcomm/pcm": {
    idea: "PCM turns an analog signal into bits by sampling, quantising and encoding.",
    recap: ["Bit rate = bits per sample × sampling rate.", "Each extra bit improves SQNR by about 6 dB.", "Telephony uses 64 kbit/s with A-law or μ-law companding."],
  },
  "dcomm/digital-mod": {
    idea: "Digital modulation sends bits by changing a carrier's amplitude, frequency or phase.",
    recap: ["ASK, FSK, PSK and QAM change amplitude, frequency, phase, or both.", "More constellation points = more bits per symbol, but less noise tolerance.", "Bit error rate falls as Eb/N0 improves."],
  },
  "dcomm/coding-mux": {
    idea: "Error-correcting codes fix mistakes, and multiple-access methods let many users share one channel.",
    recap: ["CRC detects errors; Hamming, Turbo, LDPC and Polar codes correct them.", "FDMA, TDMA, CDMA and OFDMA separate users in different ways.", "OFDM underpins 4G, 5G and Wi-Fi."],
  },
  "wireless/antennas": {
    idea: "Antennas turn currents into radio waves, and their size is set by the wavelength.",
    recap: ["λ = c/f; a quarter-wave antenna is λ/4 long.", "Gain focuses power in a direction; it doesn't create power.", "Above about 30 MHz, radio travels by line of sight."],
  },
  "wireless/link-budget": {
    idea: "A link budget adds up every gain and loss in dB to check the signal arrives strong enough.",
    recap: ["Prx = Ptx + Gtx + Grx − losses.", "Free-space path loss grows 6 dB each time the distance doubles.", "Aim for at least 10 dB of margin above receiver sensitivity."],
  },
  "wireless/standards": {
    idea: "Each wireless standard trades range, data rate and power differently.",
    recap: ["BLE for low-power short range; Wi-Fi for speed; LoRa for long range at low power.", "Cellular networks reuse frequencies across cells.", "5G serves broadband, massive IoT and ultra-reliable low-latency links."],
  },
  "wireless/sat-radar": {
    idea: "Satellites, navigation and radar apply the same communication ideas at space and defence scale.",
    recap: ["LEO, MEO and GEO orbits trade coverage against delay.", "GPS and NavIC find position from signal timing from 4+ satellites.", "Radar range = c·t/2; Doppler gives speed."],
  },
  "power/why-switch": {
    idea: "Switching converters waste far less energy than linear regulators by switching fully on and off.",
    recap: ["Linear efficiency ≈ Vout/Vin.", "An ideal switch dissipates no power.", "Switching supplies reach 85–97% efficiency."],
  },
  "power/buck-boost": {
    idea: "Buck converters step voltage down, boost converters step it up, both controlled by duty cycle.",
    recap: ["Buck: Vout = D × Vin.", "Boost: Vout = Vin / (1 − D).", "A feedback loop adjusts D to hold the output steady."],
  },
  "power/inverters-motors": {
    idea: "Inverters turn DC into AC, and drive every modern motor from ceiling fans to EVs.",
    recap: ["An H-bridge alternates current direction to make AC.", "Sinusoidal PWM produces a clean sine wave.", "BLDC and PMSM motors need electronic inverter drives."],
  },
  "power/ev-solar": {
    idea: "EVs and solar plants are built from chargers, batteries, BMS, inverters and MPPT converters.",
    recap: ["A BMS monitors and protects every cell in a pack.", "Regenerative braking returns energy to the battery.", "MPPT keeps solar panels at their maximum power point."],
  },
  "industry/lifecycle": {
    idea: "A working prototype is only the start; real products go through design, validation and manufacturing.",
    recap: ["Requirements → architecture → prototype → PCB → validation → production.", "Products are built by multi-disciplinary teams.", "Component availability is a business risk."],
  },
  "industry/pcb": {
    idea: "PCBs replace breadboard wires with copper tracks, and good layout is a skill of its own.",
    recap: ["Schematic → footprints → layout → DRC → Gerbers and BOM.", "Decouple every chip and use a solid ground plane.", "Assembly uses solder paste, pick-and-place and reflow."],
  },
  "industry/testing": {
    idea: "Products must be proven safe, reliable and legal before they can be sold.",
    recap: ["Functional, environmental, EMC, ESD and safety tests.", "India requires BIS registration for many electronics; wireless needs WPC/TEC approval.", "Defence and aerospace add strict standards and traceability."],
  },
  "industry/careers": {
    idea: "Electronics offers many careers; choose a direction by your third year and build projects in it.",
    recap: ["Embedded, hardware, VLSI, RF, power, test and FAE roles each need different skills.", "GATE opens PSU jobs and M.Tech admissions.", "Projects you can explain in depth matter more than certificates."],
  },
});
