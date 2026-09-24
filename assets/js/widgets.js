/* Interactive simulators. Each lesson places <div data-widget="name">;
   mountWidgets() finds them and calls the matching builder. */
(function () {
  const $ = (root, sel) => root.querySelector(sel);
  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  function fmt(v, unit) {
    const a = Math.abs(v);
    if (!isFinite(v)) return "∞ " + unit;
    if (a === 0) return "0 " + unit;
    if (a >= 1e6) return +(v / 1e6).toFixed(2) + " M" + unit;
    if (a >= 1e3) return +(v / 1e3).toFixed(2) + " k" + unit;
    if (a >= 1) return +v.toFixed(2) + " " + unit;
    if (a >= 1e-3) return +(v * 1e3).toFixed(2) + " m" + unit;
    if (a >= 1e-6) return +(v * 1e6).toFixed(2) + " µ" + unit;
    return +(v * 1e9).toFixed(2) + " n" + unit;
  }

  function slider(id, label, min, max, step, value) {
    return `<label class="ctl"><span>${label} <output id="${id}-o"></output></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${value}"></label>`;
  }

  function bind(el, ids, update) {
    ids.forEach((id) => $(el, "#" + id).addEventListener("input", update));
    update();
  }

  // Unique ids per widget instance so two widgets on one page never clash.
  let uid = 0;
  const idp = () => "w" + ++uid + "-";

  const W = {};

  /* ---------- Water-tank style flow ---------- */
  W.flow = (el) => {
    const p = idp();
    el.innerHTML = `
      <div class="w-grid">
        <div>
          ${slider(p + "v", "Voltage (push)", 1, 12, 0.5, 6)}
          ${slider(p + "r", "Resistance (narrow pipe)", 50, 1000, 10, 300)}
          <div class="readout"><div><small>Current (flow)</small><b id="${p}i"></b></div></div>
        </div>
        <svg viewBox="0 0 300 200" class="flow-svg" aria-label="Animated circuit showing current flow">
          <path id="${p}path" d="M40 40 H260 V160 H40 Z" fill="none" class="stroke-muted" stroke-width="8" stroke-linejoin="round"/>
          <rect x="18" y="80" width="44" height="40" rx="6" class="fill-accent2"/><text x="40" y="105" text-anchor="middle" class="svg-small-inv" id="${p}bl"></text>
          <rect id="${p}res" x="120" y="146" width="60" height="28" rx="4" class="fill-accent"/><text x="150" y="195" text-anchor="middle" class="svg-small">resistor</text>
          <g id="${p}dots"></g>
        </svg>
      </div>`;
    const path = $(el, "#" + p + "path");
    const g = $(el, "#" + p + "dots");
    const len = path.getTotalLength();
    const N = 18;
    const dots = [];
    for (let k = 0; k < N; k++) {
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("r", "4.5");
      c.setAttribute("class", "fill-electron");
      g.appendChild(c);
      dots.push(c);
    }
    let speed = 0, off = 0, last = performance.now();
    const update = () => {
      const v = +$(el, "#" + p + "v").value, r = +$(el, "#" + p + "r").value;
      $(el, "#" + p + "v-o").textContent = v + " V";
      $(el, "#" + p + "r-o").textContent = r + " Ω";
      const i = v / r;
      $(el, "#" + p + "i").textContent = fmt(i, "A");
      $(el, "#" + p + "bl").textContent = v + "V";
      $(el, "#" + p + "res").setAttribute("height", 10 + (r / 1000) * 26);
      $(el, "#" + p + "res").setAttribute("y", 160 - (10 + (r / 1000) * 26) / 2);
      speed = i * 2500; // px per second, scaled for visibility
    };
    bind(el, [p + "v", p + "r"], update);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function tick(now) {
      if (!el.isConnected) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduce) off = (off + speed * dt) % len;
      dots.forEach((d, k) => {
        const pt = path.getPointAtLength((off + (k * len) / N) % len);
        d.setAttribute("cx", pt.x);
        d.setAttribute("cy", pt.y);
      });
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };

  /* ---------- Ohm's law calculator ---------- */
  W.ohm = (el) => {
    const p = idp();
    el.innerHTML = `
      <div class="seg" role="tablist">
        <button data-f="V" class="on">Find V</button><button data-f="I">Find I</button><button data-f="R">Find R</button>
      </div>
      <div class="w-grid three">
        <label class="ctl num"><span>Voltage V (volts)</span><input type="number" id="${p}V" value="9" step="any"></label>
        <label class="ctl num"><span>Current I (mA)</span><input type="number" id="${p}I" value="20" step="any"></label>
        <label class="ctl num"><span>Resistance R (Ω)</span><input type="number" id="${p}R" value="450" step="any"></label>
      </div>
      <div class="readout big"><div><small>Answer</small><b id="${p}ans"></b></div><div><small>Power</small><b id="${p}pw"></b></div></div>
      <p class="w-note" id="${p}work"></p>`;
    let find = "I";
    const inputs = { V: $(el, "#" + p + "V"), I: $(el, "#" + p + "I"), R: $(el, "#" + p + "R") };
    const setFind = (f) => {
      find = f;
      el.querySelectorAll(".seg button").forEach((b) => b.classList.toggle("on", b.dataset.f === f));
      Object.entries(inputs).forEach(([k, inp]) => {
        inp.disabled = k === f;
        inp.parentElement.classList.toggle("solved", k === f);
      });
      calc();
    };
    const calc = () => {
      let V = +inputs.V.value, I = +inputs.I.value / 1000, R = +inputs.R.value;
      let work = "";
      if (find === "V") { V = I * R; inputs.V.value = +V.toFixed(4); work = `V = I × R = ${fmt(I, "A")} × ${fmt(R, "Ω")}`; }
      if (find === "I") { I = R ? V / R : Infinity; inputs.I.value = +(I * 1000).toFixed(4); work = `I = V ÷ R = ${V} V ÷ ${fmt(R, "Ω")}`; }
      if (find === "R") { R = I ? V / I : Infinity; inputs.R.value = +R.toFixed(2); work = `R = V ÷ I = ${V} V ÷ ${fmt(I, "A")}`; }
      const ans = find === "V" ? fmt(V, "V") : find === "I" ? fmt(I, "A") : fmt(R, "Ω");
      $(el, "#" + p + "ans").textContent = ans;
      $(el, "#" + p + "pw").textContent = fmt(V * I, "W");
      $(el, "#" + p + "work").textContent = work + " = " + ans;
    };
    el.querySelectorAll(".seg button").forEach((b) => b.addEventListener("click", () => setFind(b.dataset.f)));
    Object.values(inputs).forEach((inp) => inp.addEventListener("input", calc));
    setFind("I");
  };

  /* ---------- Resistor colour code ---------- */
  const COLORS = [
    ["Black", "#000000"], ["Brown", "#8b4513"], ["Red", "#e10600"], ["Orange", "#ff8c00"], ["Yellow", "#ffd700"],
    ["Green", "#2e8b57"], ["Blue", "#1e6fd9"], ["Violet", "#8a2be2"], ["Grey", "#888888"], ["White", "#ffffff"],
  ];
  W.colorcode = (el) => {
    const p = idp();
    const opts = (sel) => COLORS.map(([n], i) => `<option value="${i}" ${i === sel ? "selected" : ""}>${n} (${i})</option>`).join("");
    el.innerHTML = `
      <svg viewBox="0 0 360 90" class="cc-svg" aria-label="Resistor preview">
        <line x1="0" y1="45" x2="80" y2="45" class="stroke-muted" stroke-width="4"/><line x1="280" y1="45" x2="360" y2="45" class="stroke-muted" stroke-width="4"/>
        <rect x="80" y="22" width="200" height="46" rx="20" fill="#e6c79c"/>
        <rect id="${p}b1" x="110" y="22" width="14" height="46"/><rect id="${p}b2" x="140" y="22" width="14" height="46"/>
        <rect id="${p}b3" x="170" y="22" width="14" height="46"/><rect id="${p}b4" x="240" y="22" width="14" height="46"/>
      </svg>
      <div class="w-grid four">
        <label class="ctl"><span>Band 1 (digit)</span><select id="${p}s1">${opts(1)}</select></label>
        <label class="ctl"><span>Band 2 (digit)</span><select id="${p}s2">${opts(0)}</select></label>
        <label class="ctl"><span>Band 3 (multiplier)</span><select id="${p}s3">${opts(2)}</select></label>
        <label class="ctl"><span>Band 4 (tolerance)</span><select id="${p}s4"><option value="5">Gold ±5%</option><option value="10">Silver ±10%</option><option value="1">Brown ±1%</option></select></label>
      </div>
      <div class="readout big"><div><small>Resistance</small><b id="${p}val"></b></div><div><small>Range</small><b id="${p}rng"></b></div></div>`;
    const tolColor = { 5: "#d4af37", 10: "#c0c0c0", 1: "#8b4513" };
    const update = () => {
      const a = +$(el, "#" + p + "s1").value, b = +$(el, "#" + p + "s2").value, m = +$(el, "#" + p + "s3").value, t = +$(el, "#" + p + "s4").value;
      $(el, "#" + p + "b1").setAttribute("fill", COLORS[a][1]);
      $(el, "#" + p + "b2").setAttribute("fill", COLORS[b][1]);
      $(el, "#" + p + "b3").setAttribute("fill", COLORS[m][1]);
      $(el, "#" + p + "b4").setAttribute("fill", tolColor[t]);
      const r = (a * 10 + b) * Math.pow(10, m);
      $(el, "#" + p + "val").textContent = fmt(r, "Ω");
      $(el, "#" + p + "rng").textContent = `${fmt(r * (1 - t / 100), "Ω")} – ${fmt(r * (1 + t / 100), "Ω")}`;
    };
    ["s1", "s2", "s3", "s4"].forEach((s) => $(el, "#" + p + s).addEventListener("change", update));
    update();
  };

  /* ---------- Canvas helper ---------- */
  function setupCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h };
  }

  /* ---------- RC charging ---------- */
  W.rc = (el) => {
    const p = idp();
    el.innerHTML = `
      <div class="w-grid">
        ${slider(p + "r", "Resistance R", 1, 100, 1, 20)}
        ${slider(p + "c", "Capacitance C", 1, 470, 1, 100)}
      </div>
      <canvas class="plot" id="${p}cv" aria-label="Capacitor voltage against time"></canvas>
      <div class="readout"><div><small>τ = R × C</small><b id="${p}tau"></b></div><div><small>≈ Full (5τ)</small><b id="${p}full"></b></div></div>`;
    const cv = $(el, "#" + p + "cv");
    const draw = () => {
      const R = +$(el, "#" + p + "r").value * 1000, C = +$(el, "#" + p + "c").value * 1e-6;
      $(el, "#" + p + "r-o").textContent = fmt(R, "Ω");
      $(el, "#" + p + "c-o").textContent = fmt(C, "F");
      const tau = R * C, T = 10;
      $(el, "#" + p + "tau").textContent = fmt(tau, "s");
      $(el, "#" + p + "full").textContent = fmt(5 * tau, "s");
      const { ctx, w, h } = setupCanvas(cv);
      const pad = 34, pw = w - pad - 10, ph = h - pad - 10;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = css("--line"); ctx.lineWidth = 1; ctx.fillStyle = css("--muted"); ctx.font = "11px system-ui";
      for (let k = 0; k <= 10; k += 2) { const x = pad + (k / T) * pw; ctx.beginPath(); ctx.moveTo(x, 10); ctx.lineTo(x, 10 + ph); ctx.stroke(); ctx.fillText(k + "s", x - 6, h - 12); }
      [0, 0.63, 1].forEach((f) => { const y = 10 + ph - f * ph; ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(pad + pw, y); ctx.stroke(); ctx.fillText(Math.round(f * 100) + "%", 2, y + 4); });
      if (tau <= T) { const x = pad + (tau / T) * pw; ctx.setLineDash([4, 4]); ctx.strokeStyle = css("--accent2"); ctx.beginPath(); ctx.moveTo(x, 10); ctx.lineTo(x, 10 + ph); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = css("--accent2"); ctx.fillText("τ", x + 3, 22); }
      ctx.strokeStyle = css("--accent"); ctx.lineWidth = 3; ctx.beginPath();
      for (let px = 0; px <= pw; px++) { const t = (px / pw) * T; const v = 1 - Math.exp(-t / tau); const y = 10 + ph - v * ph; px ? ctx.lineTo(pad + px, y) : ctx.moveTo(pad + px, y); }
      ctx.stroke();
    };
    bind(el, [p + "r", p + "c"], draw);
    window.addEventListener("resize", () => el.isConnected && draw());
  };

  /* ---------- LED resistor ---------- */
  const E12 = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];
  const nextE12 = (r) => {
    for (let d = 1; d <= 1e6; d *= 10) for (const e of E12) if (e * d >= r - 1e-9) return e * d;
    return r;
  };
  W.led = (el) => {
    const p = idp();
    el.innerHTML = `
      <div class="w-grid">
        <div>
          <label class="ctl"><span>Supply voltage</span><select id="${p}vs"><option>3.3</option><option selected>5</option><option>9</option><option>12</option></select></label>
          <label class="ctl"><span>LED colour</span><select id="${p}col"><option value="2.0|#ff2a2a">Red (2.0 V)</option><option value="2.1|#ffd400">Yellow (2.1 V)</option><option value="2.2|#22dd55">Green (2.2 V)</option><option value="3.2|#3d7bff">Blue (3.2 V)</option><option value="3.2|#f4f4ff">White (3.2 V)</option></select></label>
          ${slider(p + "i", "LED current", 1, 30, 1, 15)}
        </div>
        <div class="led-stage"><div class="led-bulb" id="${p}bulb"></div></div>
      </div>
      <div class="readout big"><div><small>Exact resistor</small><b id="${p}r"></b></div><div><small>Use standard (E12)</small><b id="${p}std"></b></div><div><small>Resistor power</small><b id="${p}pw"></b></div></div>
      <p class="w-note" id="${p}note"></p>`;
    const update = () => {
      const vs = +$(el, "#" + p + "vs").value;
      const [vf, color] = $(el, "#" + p + "col").value.split("|");
      const i = +$(el, "#" + p + "i").value / 1000;
      $(el, "#" + p + "i-o").textContent = i * 1000 + " mA";
      const bulb = $(el, "#" + p + "bulb");
      bulb.style.setProperty("--led", color);
      if (vs <= +vf) {
        $(el, "#" + p + "r").textContent = "—";
        $(el, "#" + p + "std").textContent = "—";
        $(el, "#" + p + "pw").textContent = "—";
        $(el, "#" + p + "note").textContent = `The supply (${vs} V) is not higher than the LED's forward voltage (${vf} V), so it won't light. Use a higher supply.`;
        bulb.style.setProperty("--glow", 0);
        return;
      }
      const r = (vs - vf) / i, std = nextE12(r), realI = (vs - vf) / std;
      $(el, "#" + p + "r").textContent = fmt(r, "Ω");
      $(el, "#" + p + "std").textContent = fmt(std, "Ω");
      $(el, "#" + p + "pw").textContent = fmt(realI * realI * std, "W");
      $(el, "#" + p + "note").textContent = `With ${fmt(std, "Ω")} the real current is ${fmt(realI, "A")}. We round UP so the LED gets slightly less current, never more.`;
      bulb.style.setProperty("--glow", Math.min(1, realI / 0.02));
    };
    bind(el, [p + "i"], update);
    [p + "vs", p + "col"].forEach((id) => $(el, "#" + id).addEventListener("change", update));
  };

  /* ---------- Series / parallel ---------- */
  W.seriesparallel = (el) => {
    const p = idp();
    el.innerHTML = `
      <div class="w-grid four">
        <label class="ctl num"><span>R1 (Ω)</span><input type="number" id="${p}a" value="100" min="0"></label>
        <label class="ctl num"><span>R2 (Ω)</span><input type="number" id="${p}b" value="220" min="0"></label>
        <label class="ctl num"><span>R3 (Ω, 0 = none)</span><input type="number" id="${p}c" value="0" min="0"></label>
        <label class="ctl num"><span>Supply (V)</span><input type="number" id="${p}v" value="5" min="0"></label>
      </div>
      <div class="compare">
        <div><h4>Series</h4><div class="readout"><div><small>R total</small><b id="${p}rs"></b></div><div><small>Current</small><b id="${p}is"></b></div></div><p class="w-note" id="${p}ns"></p></div>
        <div><h4>Parallel</h4><div class="readout"><div><small>R total</small><b id="${p}rp"></b></div><div><small>Total current</small><b id="${p}ip"></b></div></div><p class="w-note" id="${p}np"></p></div>
      </div>`;
    const update = () => {
      const rs = [+$(el, "#" + p + "a").value, +$(el, "#" + p + "b").value, +$(el, "#" + p + "c").value].filter((x) => x > 0);
      const V = +$(el, "#" + p + "v").value;
      if (!rs.length) return;
      const Rs = rs.reduce((s, x) => s + x, 0);
      const Rp = 1 / rs.reduce((s, x) => s + 1 / x, 0);
      $(el, "#" + p + "rs").textContent = fmt(Rs, "Ω");
      $(el, "#" + p + "is").textContent = fmt(V / Rs, "A");
      $(el, "#" + p + "rp").textContent = fmt(Rp, "Ω");
      $(el, "#" + p + "ip").textContent = fmt(V / Rp, "A");
      $(el, "#" + p + "ns").innerHTML = "Voltage shares: " + rs.map((r, k) => `R${k + 1} = ${fmt((V * r) / Rs, "V")}`).join(", ");
      $(el, "#" + p + "np").innerHTML = "Current splits: " + rs.map((r, k) => `R${k + 1} = ${fmt(V / r, "A")}`).join(", ");
    };
    ["a", "b", "c", "v"].forEach((s) => $(el, "#" + p + s).addEventListener("input", update));
    update();
  };

  /* ---------- Voltage divider ---------- */
  W.divider = (el) => {
    const p = idp();
    el.innerHTML = `
      <div class="w-grid">
        <div>
          ${slider(p + "vin", "Vin", 1, 12, 0.1, 5)}
          ${slider(p + "r1", "R1", 100, 10000, 100, 1800)}
          ${slider(p + "r2", "R2", 100, 10000, 100, 3300)}
        </div>
        <div class="meter-col">
          <div class="vbar"><div class="vbar-fill" id="${p}fill"></div><span class="vbar-label" id="${p}lab"></span></div>
        </div>
      </div>
      <div class="readout big"><div><small>Vout</small><b id="${p}out"></b></div><div><small>Ratio R2/(R1+R2)</small><b id="${p}ratio"></b></div></div>`;
    const update = () => {
      const vin = +$(el, "#" + p + "vin").value, r1 = +$(el, "#" + p + "r1").value, r2 = +$(el, "#" + p + "r2").value;
      $(el, "#" + p + "vin-o").textContent = vin + " V";
      $(el, "#" + p + "r1-o").textContent = fmt(r1, "Ω");
      $(el, "#" + p + "r2-o").textContent = fmt(r2, "Ω");
      const ratio = r2 / (r1 + r2), out = vin * ratio;
      $(el, "#" + p + "out").textContent = fmt(out, "V");
      $(el, "#" + p + "ratio").textContent = ratio.toFixed(3);
      $(el, "#" + p + "fill").style.height = ratio * 100 + "%";
      $(el, "#" + p + "lab").textContent = out.toFixed(2) + " / " + vin + " V";
    };
    bind(el, [p + "vin", p + "r1", p + "r2"], update);
  };

  /* ---------- Transistor switch ---------- */
  W.transistor = (el) => {
    const p = idp();
    el.innerHTML = `
      <div class="w-grid">
        <div>
          ${slider(p + "vb", "Arduino pin voltage (to base via 1 kΩ)", 0, 5, 0.05, 0)}
          ${slider(p + "beta", "β (current gain)", 50, 300, 10, 100)}
          <p class="w-note">Load: a 12 V lamp drawing up to 200 mA (60 Ω) on the collector.</p>
        </div>
        <div class="led-stage"><div class="lamp" id="${p}lamp">💡</div><div class="region" id="${p}reg"></div></div>
      </div>
      <div class="readout"><div><small>Base current I<sub>B</sub></small><b id="${p}ib"></b></div><div><small>Collector current I<sub>C</sub></small><b id="${p}ic"></b></div></div>`;
    const update = () => {
      const vb = +$(el, "#" + p + "vb").value, beta = +$(el, "#" + p + "beta").value;
      $(el, "#" + p + "vb-o").textContent = vb.toFixed(2) + " V";
      $(el, "#" + p + "beta-o").textContent = beta;
      const ib = Math.max(0, (vb - 0.7) / 1000);
      const icMax = (12 - 0.2) / 60;
      const ic = Math.min(beta * ib, icMax);
      let region = "Cut-off (OFF)";
      if (ib > 0) region = beta * ib >= icMax ? "Saturation (fully ON)" : "Active (partly ON — amplifying)";
      $(el, "#" + p + "ib").textContent = fmt(ib, "A");
      $(el, "#" + p + "ic").textContent = fmt(ic, "A");
      const reg = $(el, "#" + p + "reg");
      reg.textContent = region;
      reg.dataset.state = ib === 0 ? "off" : beta * ib >= icMax ? "sat" : "act";
      $(el, "#" + p + "lamp").style.setProperty("--glow", ic / icMax);
    };
    bind(el, [p + "vb", p + "beta"], update);
  };

  /* ---------- Binary bit flipper ---------- */
  W.binary = (el) => {
    const p = idp();
    el.innerHTML = `
      <div class="bits" id="${p}bits">${[7, 6, 5, 4, 3, 2, 1, 0].map((b) => `<button class="bit" data-b="${b}" aria-pressed="false"><span>0</span><small>${1 << b}</small></button>`).join("")}</div>
      <div class="readout big"><div><small>Decimal</small><b id="${p}dec">0</b></div><div><small>Hex</small><b id="${p}hex">0x00</b></div><div><small>Binary</small><b id="${p}bin">00000000</b></div></div>
      <label class="ctl num inline"><span>Or type a number (0–255)</span><input type="number" id="${p}in" min="0" max="255" value="0"></label>`;
    let val = 0;
    const render = () => {
      el.querySelectorAll(".bit").forEach((btn) => {
        const on = (val >> +btn.dataset.b) & 1;
        btn.classList.toggle("on", !!on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
        btn.querySelector("span").textContent = on;
      });
      $(el, "#" + p + "dec").textContent = val;
      $(el, "#" + p + "hex").textContent = "0x" + val.toString(16).toUpperCase().padStart(2, "0");
      $(el, "#" + p + "bin").textContent = val.toString(2).padStart(8, "0");
    };
    el.querySelectorAll(".bit").forEach((btn) => btn.addEventListener("click", () => { val ^= 1 << +btn.dataset.b; $(el, "#" + p + "in").value = val; render(); }));
    $(el, "#" + p + "in").addEventListener("input", (e) => { val = Math.max(0, Math.min(255, parseInt(e.target.value, 10) || 0)); render(); });
    render();
  };

  /* ---------- Logic gates ---------- */
  const GATES = {
    AND: (a, b) => a & b, OR: (a, b) => a | b, NOT: (a) => 1 - a,
    NAND: (a, b) => 1 - (a & b), NOR: (a, b) => 1 - (a | b), XOR: (a, b) => a ^ b, XNOR: (a, b) => 1 - (a ^ b),
  };
  function gateSvg(name) {
    const bubble = ["NAND", "NOR", "NOT", "XNOR"].includes(name);
    let body;
    if (name === "AND" || name === "NAND") body = `<path d="M40 15 H75 A35 35 0 0 1 75 85 H40 Z"/>`;
    else if (name === "NOT") body = `<path d="M45 15 L45 85 L105 50 Z"/>`;
    else body = `<path d="M35 15 Q60 50 35 85 Q90 85 115 50 Q90 15 35 15 Z"/>${name.startsWith("X") ? `<path d="M25 15 Q50 50 25 85" fill="none"/>` : ""}`;
    const outX = name === "NOT" ? 105 : name === "AND" || name === "NAND" ? 110 : 115;
    const inputs = name === "NOT" ? `<line x1="0" y1="50" x2="45" y2="50"/>` : `<line x1="0" y1="32" x2="45" y2="32"/><line x1="0" y1="68" x2="45" y2="68"/>`;
    return `<svg viewBox="0 0 170 100" class="gate-svg"><g class="gate-shape">${inputs}${body}${bubble ? `<circle cx="${outX + 6}" cy="50" r="6"/>` : ""}<line x1="${outX + (bubble ? 12 : 0)}" y1="50" x2="170" y2="50"/></g></svg>`;
  }
  W.gates = (el) => {
    const p = idp();
    el.innerHTML = `
      <div class="seg wrap" id="${p}sel">${Object.keys(GATES).map((g) => `<button data-g="${g}" class="${g === "AND" ? "on" : ""}">${g}</button>`).join("")}</div>
      <div class="gate-stage">
        <div class="gate-inputs">
          <button class="toggle" id="${p}a" aria-pressed="false">A = <b>0</b></button>
          <button class="toggle" id="${p}b" aria-pressed="false">B = <b>0</b></button>
        </div>
        <div id="${p}svg"></div>
        <div class="gate-out"><div class="out-led" id="${p}led"></div><span id="${p}out">Y = 0</span></div>
      </div>
      <div id="${p}tt"></div>`;
    let gate = "AND", A = 0, B = 0;
    const render = () => {
      const f = GATES[gate], unary = gate === "NOT";
      $(el, "#" + p + "b").style.visibility = unary ? "hidden" : "visible";
      $(el, "#" + p + "svg").innerHTML = gateSvg(gate);
      const y = unary ? f(A) : f(A, B);
      [["a", A], ["b", B]].forEach(([id, v]) => { const t = $(el, "#" + p + id); t.classList.toggle("on", !!v); t.setAttribute("aria-pressed", v ? "true" : "false"); t.querySelector("b").textContent = v; });
      $(el, "#" + p + "led").classList.toggle("on", !!y);
      $(el, "#" + p + "out").textContent = "Y = " + y;
      const rows = unary ? [[0], [1]] : [[0, 0], [0, 1], [1, 0], [1, 1]];
      $(el, "#" + p + "tt").innerHTML = `<div class="table-wrap"><table class="tt"><thead><tr>${unary ? "<th>A</th>" : "<th>A</th><th>B</th>"}<th>Y</th></tr></thead><tbody>${rows
        .map((r) => { const cur = unary ? r[0] === A : r[0] === A && r[1] === B; return `<tr class="${cur ? "cur" : ""}">${r.map((v) => `<td>${v}</td>`).join("")}<td><b>${f(...r)}</b></td></tr>`; })
        .join("")}</tbody></table></div>`;
    };
    el.querySelectorAll("#" + p + "sel button").forEach((b) => b.addEventListener("click", () => { gate = b.dataset.g; el.querySelectorAll("#" + p + "sel button").forEach((x) => x.classList.toggle("on", x === b)); render(); }));
    $(el, "#" + p + "a").addEventListener("click", () => { A ^= 1; render(); });
    $(el, "#" + p + "b").addEventListener("click", () => { B ^= 1; render(); });
    render();
  };

  /* ---------- Half adder ---------- */
  W.adder = (el) => {
    const p = idp();
    el.innerHTML = `
      <div class="gate-stage">
        <div class="gate-inputs">
          <button class="toggle" id="${p}a">A = <b>0</b></button>
          <button class="toggle" id="${p}b">B = <b>0</b></button>
        </div>
        <div class="adder-mid"><div class="chip-box">XOR → Sum</div><div class="chip-box">AND → Carry</div></div>
        <div class="gate-out col">
          <div><div class="out-led" id="${p}s"></div><span>Sum</span></div>
          <div><div class="out-led alt" id="${p}c"></div><span>Carry</span></div>
        </div>
      </div>
      <p class="w-note center" id="${p}eq"></p>`;
    let A = 0, B = 0;
    const render = () => {
      [["a", A], ["b", B]].forEach(([id, v]) => { const t = $(el, "#" + p + id); t.classList.toggle("on", !!v); t.querySelector("b").textContent = v; });
      const s = A ^ B, c = A & B;
      $(el, "#" + p + "s").classList.toggle("on", !!s);
      $(el, "#" + p + "c").classList.toggle("on", !!c);
      $(el, "#" + p + "eq").innerHTML = `${A} + ${B} = <b>${c}${s}</b> in binary = ${A + B} in decimal`;
    };
    $(el, "#" + p + "a").addEventListener("click", () => { A ^= 1; render(); });
    $(el, "#" + p + "b").addEventListener("click", () => { B ^= 1; render(); });
    render();
  };

  /* ---------- Blink simulator ---------- */
  W.blink = (el) => {
    const p = idp();
    el.innerHTML = `
      <div class="w-grid">
        <div>
          ${slider(p + "on", "delay() after HIGH", 50, 2000, 50, 1000)}
          ${slider(p + "off", "delay() after LOW", 50, 2000, 50, 1000)}
          <button class="btn small" id="${p}run" type="button">⏸ Pause</button>
        </div>
        <div class="board-mini"><div class="pin13">13</div><div class="out-led big" id="${p}led"></div><small id="${p}hz"></small></div>
      </div>
      <div id="${p}code"></div>`;
    let on = false, running = true, timer = null;
    const led = $(el, "#" + p + "led");
    const step = () => {
      if (!el.isConnected) return;
      if (running) { on = !on; led.classList.toggle("on", on); }
      timer = setTimeout(step, +$(el, "#" + p + (on ? "on" : "off")).value);
    };
    const update = () => {
      const a = +$(el, "#" + p + "on").value, b = +$(el, "#" + p + "off").value;
      $(el, "#" + p + "on-o").textContent = a + " ms";
      $(el, "#" + p + "off-o").textContent = b + " ms";
      $(el, "#" + p + "hz").textContent = `${(1000 / (a + b)).toFixed(2)} blinks/s · ${Math.round((a / (a + b)) * 100)}% on`;
      $(el, "#" + p + "code").innerHTML = H.code(`void loop() {\n  digitalWrite(13, HIGH);\n  delay(${a});\n  digitalWrite(13, LOW);\n  delay(${b});\n}`);
    };
    bind(el, [p + "on", p + "off"], update);
    $(el, "#" + p + "run").addEventListener("click", (e) => { running = !running; e.target.textContent = running ? "⏸ Pause" : "▶ Run"; });
    step();
    void timer;
  };

  /* ---------- ADC ---------- */
  W.adc = (el) => {
    const p = idp();
    el.innerHTML = `
      ${slider(p + "v", "Voltage on A0", 0, 5, 0.01, 2.5)}
      <div class="adc-bar"><div id="${p}fill"></div>${Array.from({ length: 11 }, (_, k) => `<span style="left:${k * 10}%"></span>`).join("")}</div>
      <div class="readout big"><div><small>analogRead(A0)</small><b id="${p}raw"></b></div><div><small>10-bit binary</small><b id="${p}bin" class="mono"></b></div><div><small>Back to volts</small><b id="${p}back"></b></div></div>
      <p class="w-note">Each step is 5 V ÷ 1024 ≈ 4.88 mV. Anything smaller than one step can't be seen — that's <b>quantization error</b>.</p>`;
    const update = () => {
      const v = +$(el, "#" + p + "v").value;
      $(el, "#" + p + "v-o").textContent = v.toFixed(2) + " V";
      const raw = Math.min(1023, Math.floor((v / 5) * 1024));
      $(el, "#" + p + "raw").textContent = raw;
      $(el, "#" + p + "bin").textContent = raw.toString(2).padStart(10, "0");
      $(el, "#" + p + "back").textContent = ((raw * 5) / 1023).toFixed(3) + " V";
      $(el, "#" + p + "fill").style.width = (raw / 1023) * 100 + "%";
    };
    bind(el, [p + "v"], update);
  };

  /* ---------- PWM ---------- */
  W.pwm = (el) => {
    const p = idp();
    el.innerHTML = `
      <div class="w-grid">
        ${slider(p + "d", "analogWrite(pin, value)", 0, 255, 1, 128)}
        <div class="led-stage"><div class="led-bulb" id="${p}bulb" style="--led:#ff3b3b"></div></div>
      </div>
      <canvas class="plot short" id="${p}cv" aria-label="PWM waveform"></canvas>
      <div class="readout"><div><small>Duty cycle</small><b id="${p}duty"></b></div><div><small>Average voltage</small><b id="${p}avg"></b></div></div>`;
    const cv = $(el, "#" + p + "cv");
    const draw = () => {
      const v = +$(el, "#" + p + "d").value, d = v / 255;
      $(el, "#" + p + "d-o").textContent = v;
      $(el, "#" + p + "duty").textContent = Math.round(d * 100) + "%";
      $(el, "#" + p + "avg").textContent = (d * 5).toFixed(2) + " V";
      $(el, "#" + p + "bulb").style.setProperty("--glow", d);
      const { ctx, w, h } = setupCanvas(cv);
      ctx.clearRect(0, 0, w, h);
      const top = 14, bot = h - 18, periods = 4, pw = (w - 20) / periods;
      ctx.strokeStyle = css("--line"); ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
      const avgY = bot - d * (bot - top);
      ctx.beginPath(); ctx.moveTo(10, avgY); ctx.lineTo(w - 10, avgY); ctx.strokeStyle = css("--accent2"); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = css("--accent2"); ctx.font = "11px system-ui"; ctx.fillText("average", w - 60, avgY - 4);
      ctx.strokeStyle = css("--accent"); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(10, bot);
      for (let k = 0; k < periods; k++) {
        const x0 = 10 + k * pw, x1 = x0 + d * pw;
        if (d > 0) { ctx.lineTo(x0, top); ctx.lineTo(x1, top); }
        ctx.lineTo(x1, bot); ctx.lineTo(x0 + pw, bot);
      }
      ctx.stroke();
      ctx.fillStyle = css("--muted"); ctx.fillText("5V", 12, top - 2); ctx.fillText("0V", 12, h - 4);
    };
    bind(el, [p + "d"], draw);
    window.addEventListener("resize", () => el.isConnected && draw());
  };

  /* ---------- Register bit manipulation ---------- */
  W.register = (el) => {
    const p = idp();
    el.innerHTML = `
      <div class="reg-row"><span class="reg-name">PORTB</span><div class="bits small" id="${p}bits">${[7, 6, 5, 4, 3, 2, 1, 0].map((b) => `<div class="bit" data-b="${b}"><span>0</span><small>${b === 5 ? "bit5·D13" : "bit" + b}</small></div>`).join("")}</div></div>
      <div class="w-grid">
        <label class="ctl"><span>Bit number n</span><select id="${p}n">${[0, 1, 2, 3, 4, 5, 6, 7].map((n) => `<option ${n === 5 ? "selected" : ""}>${n}</option>`).join("")}</select></label>
        <div class="btn-row"><button class="btn small" data-op="set">Set</button><button class="btn small" data-op="clr">Clear</button><button class="btn small" data-op="tog">Toggle</button><button class="btn small ghost" data-op="rst">Reset</button></div>
      </div>
      <div class="code-line mono" id="${p}line">// click an operation</div>
      <div class="reg-led"><div class="out-led" id="${p}led"></div><span>LED on pin 13 (bit 5)</span></div>`;
    let reg = 0;
    const render = () => {
      el.querySelectorAll(".bit").forEach((b) => { const on = (reg >> +b.dataset.b) & 1; b.classList.toggle("on", !!on); b.querySelector("span").textContent = on; });
      $(el, "#" + p + "led").classList.toggle("on", !!((reg >> 5) & 1));
    };
    el.querySelectorAll("[data-op]").forEach((btn) => btn.addEventListener("click", () => {
      const n = +$(el, "#" + p + "n").value, op = btn.dataset.op;
      const before = reg;
      let code = "";
      if (op === "set") { reg |= 1 << n; code = `PORTB |= (1 << ${n});`; }
      if (op === "clr") { reg &= ~(1 << n) & 0xff; code = `PORTB &= ~(1 << ${n});`; }
      if (op === "tog") { reg ^= 1 << n; code = `PORTB ^= (1 << ${n});`; }
      if (op === "rst") { reg = 0; code = `PORTB = 0;`; }
      const b8 = (x) => x.toString(2).padStart(8, "0");
      $(el, "#" + p + "line").textContent = `${code}   // ${b8(before)} → ${b8(reg)}`;
      render();
    }));
    render();
  };

  /* ---------- UART frame ---------- */
  W.uart = (el) => {
    const p = idp();
    el.innerHTML = `
      <label class="ctl num inline"><span>Character to send</span><input type="text" id="${p}ch" maxlength="1" value="A"></label>
      <div class="readout"><div><small>ASCII code</small><b id="${p}asc"></b></div><div><small>Binary (MSB→LSB)</small><b id="${p}bin" class="mono"></b></div></div>
      <div class="uart-wrap"><svg id="${p}svg" viewBox="0 0 660 130" class="uart-svg" aria-label="UART waveform"></svg></div>
      <p class="w-note">The line idles HIGH. The <b>start bit</b> pulls it LOW, then 8 data bits are sent <b>LSB first</b>, then a HIGH <b>stop bit</b>.</p>`;
    const update = () => {
      const ch = $(el, "#" + p + "ch").value || " ";
      const code = ch.charCodeAt(0) & 0xff;
      $(el, "#" + p + "asc").textContent = code + " (0x" + code.toString(16).toUpperCase().padStart(2, "0") + ")";
      $(el, "#" + p + "bin").textContent = code.toString(2).padStart(8, "0");
      const bits = [{ v: 1, l: "idle" }, { v: 0, l: "start" }];
      for (let k = 0; k < 8; k++) bits.push({ v: (code >> k) & 1, l: "D" + k });
      bits.push({ v: 1, l: "stop" }, { v: 1, l: "idle" });
      const bw = 55, hi = 25, lo = 80;
      let d = `M0 ${bits[0].v ? hi : lo}`, labels = "";
      bits.forEach((b, k) => {
        const y = b.v ? hi : lo;
        d += ` V${y} H${(k + 1) * bw}`;
        const cls = b.l === "start" ? "fill-accent2" : b.l === "stop" ? "fill-accent2" : "fill-soft";
        labels += `<rect x="${k * bw + 1}" y="92" width="${bw - 2}" height="34" rx="4" class="${b.l === "idle" ? "fill-none" : cls}" opacity="${b.l === "idle" ? 0 : 0.9}"/>`;
        labels += `<text x="${k * bw + bw / 2}" y="106" text-anchor="middle" class="svg-small">${b.l}</text><text x="${k * bw + bw / 2}" y="121" text-anchor="middle" class="svg-label">${b.l === "idle" ? "" : b.v}</text>`;
      });
      $(el, "#" + p + "svg").innerHTML = `${labels}<path d="${d}" fill="none" class="stroke-accent" stroke-width="3"/>`;
    };
    $(el, "#" + p + "ch").addEventListener("input", update);
    update();
  };

  /* ---------- CMOS inverter ---------- */
  W.cmos = (el) => {
    const p = idp();
    el.innerHTML = `
      <div class="cmos-wrap">
        <button class="toggle big" id="${p}in">Input = <b>0</b></button>
        <svg viewBox="0 0 260 300" class="cmos-svg" aria-label="CMOS inverter">
          <text x="130" y="18" text-anchor="middle" class="svg-label">VDD (1)</text>
          <line x1="130" y1="24" x2="130" y2="60" class="stroke-fg" stroke-width="3"/>
          <rect id="${p}pm" x="75" y="60" width="110" height="60" rx="8"/><text x="130" y="95" text-anchor="middle" class="svg-label" id="${p}pt">PMOS</text>
          <line x1="130" y1="120" x2="130" y2="180" class="stroke-fg" stroke-width="3"/>
          <line x1="130" y1="150" x2="220" y2="150" class="stroke-fg" stroke-width="3"/>
          <circle id="${p}oc" cx="225" cy="150" r="10"/><text x="225" y="178" text-anchor="middle" class="svg-small">OUT</text>
          <rect id="${p}nm" x="75" y="180" width="110" height="60" rx="8"/><text x="130" y="215" text-anchor="middle" class="svg-label" id="${p}nt">NMOS</text>
          <line x1="130" y1="240" x2="130" y2="270" class="stroke-fg" stroke-width="3"/>
          <text x="130" y="290" text-anchor="middle" class="svg-label">GND (0)</text>
          <line x1="20" y1="150" x2="60" y2="150" class="stroke-fg" stroke-width="3"/>
          <line x1="60" y1="90" x2="60" y2="210" class="stroke-fg" stroke-width="3"/>
          <line x1="60" y1="90" x2="75" y2="90" class="stroke-fg" stroke-width="3"/><line x1="60" y1="210" x2="75" y2="210" class="stroke-fg" stroke-width="3"/>
          <text x="20" y="140" class="svg-small">IN</text>
        </svg>
        <div class="gate-out"><div class="out-led" id="${p}led"></div><span id="${p}out"></span></div>
      </div>
      <p class="w-note center" id="${p}exp"></p>`;
    let x = 0;
    const render = () => {
      const t = $(el, "#" + p + "in");
      t.classList.toggle("on", !!x); t.querySelector("b").textContent = x;
      const pOn = x === 0, nOn = x === 1;
      $(el, "#" + p + "pm").setAttribute("class", pOn ? "tr-on" : "tr-off");
      $(el, "#" + p + "nm").setAttribute("class", nOn ? "tr-on" : "tr-off");
      $(el, "#" + p + "pt").textContent = "PMOS " + (pOn ? "ON" : "OFF");
      $(el, "#" + p + "nt").textContent = "NMOS " + (nOn ? "ON" : "OFF");
      const out = 1 - x;
      $(el, "#" + p + "oc").setAttribute("class", out ? "fill-accent" : "fill-muted");
      $(el, "#" + p + "led").classList.toggle("on", !!out);
      $(el, "#" + p + "out").textContent = "Output = " + out;
      $(el, "#" + p + "exp").textContent = pOn ? "Input LOW → PMOS conducts and connects OUT to VDD. NMOS is off, so there's no path to GND." : "Input HIGH → NMOS conducts and connects OUT to GND. PMOS is off, so there's no path from VDD.";
    };
    $(el, "#" + p + "in").addEventListener("click", () => { x ^= 1; render(); });
    render();
  };

  /* ---------- Board picker ---------- */
  W.boardpicker = (el) => {
    const p = idp();
    // Score each need per board: 2 = great fit, 1 = possible, -2 = poor fit.
    const needs = [
      ["wifi", "Wi-Fi or Bluetooth", { uno: -2, esp: 2, pico: 1, pi: 2 }],
      ["camera", "Camera, vision or AI", { uno: -2, esp: -1, pico: -2, pi: 2 }],
      ["python", "I want to code in Python", { uno: -2, esp: 1, pico: 2, pi: 2 }],
      ["battery", "Runs for months on a battery", { uno: -1, esp: 2, pico: 1, pi: -2 }],
      ["realtime", "Precise real-time timing (motors, pulses)", { uno: 2, esp: 1, pico: 2, pi: -2 }],
      ["analog", "Several analog sensors", { uno: 2, esp: 1, pico: 1, pi: -2 }],
      ["gui", "Screen, web app or database", { uno: -2, esp: 0, pico: -1, pi: 2 }],
      ["cheap", "Lowest possible cost", { uno: 1, esp: 2, pico: 2, pi: -2 }],
      ["five", "5 V sensors and shields, beginner friendly", { uno: 2, esp: -1, pico: -1, pi: -1 }],
    ];
    const boards = { uno: "Arduino Uno", esp: "ESP32", pico: "Raspberry Pi Pico", pi: "Raspberry Pi 4/5" };
    const why = {
      uno: "Simple, 5 V tolerant, huge beginner community and shields.",
      esp: "Wi-Fi + Bluetooth, dual-core, deep sleep, and still very cheap.",
      pico: "MicroPython-friendly, precise PIO timing, lowest cost.",
      pi: "A full Linux computer: cameras, AI, web apps and databases.",
    };
    el.innerHTML = `
      <div class="checks">${needs.map(([k, label], i) => `<label class="check"><input type="checkbox" id="${p}${k}" ${i === 0 || i === 3 ? "checked" : ""}><span>${label}</span></label>`).join("")}</div>
      <div class="pick-results" id="${p}res"></div>`;
    const update = () => {
      const picked = needs.filter(([k]) => $(el, "#" + p + k).checked);
      const scores = Object.keys(boards).map((b) => ({ b, s: picked.reduce((t, [, , sc]) => t + sc[b], 0) }));
      scores.sort((a, b) => b.s - a.s);
      $(el, "#" + p + "res").innerHTML = picked.length
        ? scores.map((x, i) => `<div class="pick ${i === 0 ? "best" : ""}"><div class="pick-top"><b>${boards[x.b]}</b>${i === 0 ? '<span class="pill-best">Best match</span>' : ""}</div><div class="pick-bar"><i style="width:${Math.max(4, ((x.s + picked.length * 2) / (picked.length * 4)) * 100)}%"></i></div><small>${why[x.b]}</small></div>`).join("")
        : `<p class="w-note">Tick at least one need to see a recommendation.</p>`;
    };
    needs.forEach(([k]) => $(el, "#" + p + k).addEventListener("change", update));
    update();
  };

  window.mountWidgets = (root) => {
    root.querySelectorAll("[data-widget]").forEach((el) => {
      const fn = W[el.dataset.widget];
      if (fn) {
        try { fn(el); } catch (e) { el.textContent = "Simulator failed to load."; console.error(e); }
      }
    });
  };
})();
