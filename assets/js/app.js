(function () {
  const app = document.getElementById("app");
  const PASS = 0.8; // 4 of 5 questions
  const STORE = "opencircuit-progress-v1";

  /* ---------------- Progress (per-browser) ---------------- */
  const store = {
    load() {
      try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch { return {}; }
    },
    save(d) {
      try { localStorage.setItem(STORE, JSON.stringify(d)); } catch { /* storage unavailable: progress lasts this visit only */ }
    },
  };
  let state = Object.assign({ lessons: {}, quiz: {}, name: "" }, store.load());
  const save = () => { store.save(state); updateHeader(); };

  const totalLessons = COURSE.reduce((n, m) => n + m.lessons.length, 0);
  const doneLessons = () => Object.keys(state.lessons).length;
  const modDone = (m) => m.lessons.filter((l) => state.lessons[m.id + "/" + l.id]).length;
  const quizPassed = (m) => state.quiz[m.id] && state.quiz[m.id].passed;
  const allPassed = () => COURSE.every(quizPassed);
  const pct = () => Math.round(((doneLessons() + COURSE.filter(quizPassed).length) / (totalLessons + COURSE.length)) * 100);

  function nextStop() {
    for (const m of COURSE) {
      for (const l of m.lessons) if (!state.lessons[m.id + "/" + l.id]) return `#/learn/${m.id}/${l.id}`;
      if (!quizPassed(m)) return `#/quiz/${m.id}`;
    }
    return "#/certificate";
  }

  /* ---------------- Header ---------------- */
  function updateHeader() {
    const p = pct();
    const ring = document.getElementById("ring");
    if (ring) {
      ring.style.setProperty("--p", p);
      ring.querySelector("span").textContent = p + "%";
      ring.title = `${p}% of the course complete`;
    }
  }

  function setActiveNav(route) {
    document.querySelectorAll(".nav a").forEach((a) => a.classList.toggle("active", route.startsWith(a.dataset.r)));
  }

  /* ---------------- Pages ---------------- */
  const des = (m) => "U" + (COURSE.indexOf(m) + 1);
  const labCount = new Set(COURSE.flatMap((m) => m.lessons.flatMap((l) => [...l.body.matchAll(/data-widget="(\w+)"/g)].map((x) => x[1])))).size;
  const hours = Math.round(COURSE.reduce((n, m) => n + m.lessons.reduce((a, l) => a + l.minutes, 0), 0) / 60);

  function home() {
    const started = doneLessons() > 0;
    const perPlat = (k) => PROJECTS.filter((p) => p.platform === k).length;
    return `
<section class="hero">
  <div class="hero-grid">
    <div>
      <span class="eyebrow">Free electronics course · Built by an ECE student</span>
      <h1>See the signal. <em>Understand the circuit.</em></h1>
      <p class="hero-sub">From your first electron to ESP32, Raspberry Pi and VLSI. Plain-language explanations, live simulators you can play with, real projects, and a certificate when you finish.</p>
      <div class="hero-cta">
        <a class="btn primary big" href="${started ? nextStop() : "#/learn/basics/atoms"}">${started ? "Continue where you left off" : "Start lesson 1"}</a>
        <a class="btn on-mask big" href="#/learn">View the syllabus</a>
      </div>
    </div>
    <div class="scope" aria-label="Oscilloscope showing example waveforms">
      <div class="scope-head"><span><b>CH1</b> · 1 V/div · 5 ms/div</span><span id="scope-name">SINE · 50 Hz</span></div>
      <canvas id="scope"></canvas>
      <div class="scope-tabs" role="tablist">
        <button class="on" data-w="sine">AC mains</button><button data-w="pwm">PWM 30%</button><button data-w="rc">RC charge</button><button data-w="uart">UART 'A'</button>
      </div>
      <p class="scope-cap" id="scope-cap"></p>
    </div>
  </div>
  <div class="spec-strip">
    <dl>
      <div><dt>Modules</dt><dd>${COURSE.length}</dd></div>
      <div><dt>Lessons</dt><dd>${totalLessons}</dd></div>
      <div><dt>Live labs</dt><dd>${labCount}</dd></div>
      <div><dt>Projects</dt><dd>${PROJECTS.length}</dd></div>
      <div><dt>Cost</dt><dd>₹0</dd></div>
    </dl>
  </div>
</section>

<section class="section">
  <div class="sec-head">
    <div><span class="eyebrow">The syllabus</span><h2>Nine chips, one path</h2></div>
    <p>Each module is one chip on the board, labelled U1 to U9 like parts on a real circuit. Go in order: every module builds on the last, from "what is voltage?" to writing Verilog and hosting a web server on an ESP32. About ${hours} hours in total.</p>
  </div>
  <div class="chips-grid">
    ${COURSE.map((m) => {
      const d = modDone(m), n = m.lessons.length;
      return `
      <a class="ic" href="#/learn/${m.id}">
        <div class="ic-body"><span class="ic-notch" aria-hidden="true"></span>
          <div class="ic-top"><span class="des">${des(m)}</span><span>${m.level}</span></div>
          <h3>${m.title}</h3>
          <p>${m.tagline}</p>
          <div class="ic-foot"><span class="led-dot ${quizPassed(m) ? "on" : ""}" title="${quizPassed(m) ? "Quiz passed" : "Quiz not passed yet"}"></span><span>${d}/${n} lessons</span><span class="meter"><i style="width:${(d / n) * 100}%"></i></span></div>
        </div>
      </a>`;
    }).join("")}
    <a class="ic cert" href="#/certificate">
      <div class="ic-body"><span class="ic-notch" aria-hidden="true"></span>
        <div class="ic-top"><span class="des">OUT</span><span>Final output</span></div>
        <h3>Your certificate</h3>
        <p>Pass all ${COURSE.length} module quizzes and a certificate with a unique, verifiable ID is generated for you instantly.</p>
        <div class="ic-foot"><span class="led-dot ${allPassed() ? "on" : ""}"></span><span>${COURSE.filter(quizPassed).length}/${COURSE.length} quizzes passed</span></div>
      </div>
    </a>
  </div>
</section>

<section class="section">
  <div class="sec-head">
    <div><span class="eyebrow">How you'll learn</span><h2>Idea first, maths second</h2></div>
    <p>Every lesson follows the same rhythm, so you always know where you are.</p>
  </div>
  <div class="method">
    <div><span class="eyebrow">01 · Big idea</span><h3>One sentence to hold on to</h3><p>Each lesson opens with the single idea that matters, before any detail.</p></div>
    <div><span class="eyebrow">02 · Analogy</span><h3>Water tanks, not jargon</h3><p>Voltage is pressure, a capacitor is a water balloon, an interrupt is your phone ringing.</p></div>
    <div><span class="eyebrow">03 · Live lab</span><h3>Change it and watch</h3><p>Drag sliders, flip bits and toggle gates in ${labCount} simulators that run right on the page.</p></div>
    <div><span class="eyebrow">04 · Watch out</span><h3>Mistakes, before you make them</h3><p>Reversed capacitors, floating pins, 5 V on a 3.3 V board: we flag the classic traps.</p></div>
    <div><span class="eyebrow">05 · GATE corner</span><h3>Exam-ready as you go</h3><p>Notes link each topic to the GATE ECE syllabus, so learning doubles as preparation.</p></div>
    <div><span class="eyebrow">06 · Recap & quiz</span><h3>Check it stuck</h3><p>Three-point recaps, and a quiz at the end of each module with every answer explained.</p></div>
  </div>
</section>

<section class="section">
  <div class="sec-head">
    <div><span class="eyebrow">Build something</span><h2>${PROJECTS.length} projects on five platforms</h2></div>
    <p>Each project has a parts list with prices, step-by-step wiring, working code and a stretch challenge. From a 555 flasher to face detection on a Raspberry Pi.</p>
  </div>
  <div class="platform-row">
    ${Object.entries(PLATFORMS).map(([k, v]) => `<a class="platform-tile" href="#/projects" data-plat="${k}"><span class="plat ${k}">${v.short}</span><b>${v.name}</b><span>${perPlat(k)} projects</span></a>`).join("")}
  </div>
</section>

<section class="cta-band">
  <div class="cta-inner">
    <div><h2>Every expert started with one LED.</h2><p>The engineers who design satellites, radars and phone chips all began exactly here.</p></div>
    <a class="btn primary big" href="${nextStop()}">${started ? "Pick up where you left off" : "Light up your first LED"}</a>
  </div>
</section>`;
  }

  // Oscilloscope on the home page: four real waveforms from the course.
  function startScope() {
    const cv = document.getElementById("scope");
    if (!cv) return;
    const waves = {
      sine: ["SINE · 50 Hz", "India's mains: 230 V RMS at 50 Hz, reversing direction 100 times a second (Module 1).", (x) => Math.sin(x * Math.PI * 2 * 2)],
      pwm: ["PWM · 30% DUTY", "analogWrite(9, 77): the pin is HIGH 30% of each cycle, so an LED looks 30% bright (Module 6).", (x) => ((x * 5) % 1 < 0.3 ? 0.8 : -0.8)],
      rc: ["RC · τ = 1 div", "A capacitor charging through a resistor: 63% after one time constant, full after five (Module 2).", (x) => { const t = (x * 2) % 1 * 8; return 1.6 * (1 - Math.exp(-t)) - 0.8; }],
      uart: ["UART · 'A' = 0x41", "Idle high, start bit, then 0x41 sent LSB first: 1 0 0 0 0 0 1 0, then the stop bit (Module 7).", (x) => { const bits = [1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1]; return bits[Math.min(bits.length - 1, Math.floor(x * bits.length))] ? 0.7 : -0.7; }],
    };
    let cur = "sine", phase = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const setWave = (k) => {
      cur = k;
      document.querySelectorAll(".scope-tabs button").forEach((b) => b.classList.toggle("on", b.dataset.w === k));
      document.getElementById("scope-name").textContent = waves[k][0];
      document.getElementById("scope-cap").textContent = waves[k][1];
      if (reduce) draw();
    };
    function draw() {
      const dpr = window.devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight;
      if (cv.width !== w * dpr) { cv.width = w * dpr; cv.height = h * dpr; }
      const ctx = cv.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#06140f"; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(143,184,164,.14)"; ctx.lineWidth = 1;
      for (let i = 1; i < 10; i++) { const x = (i / 10) * w; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let i = 1; i < 8; i++) { const y = (i / 8) * h; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      ctx.strokeStyle = "rgba(143,184,164,.35)";
      ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
      const f = waves[cur][2], scroll = cur === "uart" || cur === "rc" ? 0 : phase;
      ctx.shadowColor = "#3fd0bf"; ctx.shadowBlur = 8; ctx.strokeStyle = "#3fd0bf"; ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let px = 0; px <= w; px++) { const y = h / 2 - f((px / w + scroll) % 1) * (h * 0.38); px ? ctx.lineTo(px, y) : ctx.moveTo(px, y); }
      ctx.stroke(); ctx.shadowBlur = 0;
    }
    function tick() {
      if (!cv.isConnected) return;
      phase = (phase + 0.0025) % 1;
      draw();
      requestAnimationFrame(tick);
    }
    document.querySelectorAll(".scope-tabs button").forEach((b) => b.addEventListener("click", () => setWave(b.dataset.w)));
    setWave("sine");
    reduce ? draw() : requestAnimationFrame(tick);
    document.querySelectorAll(".platform-tile").forEach((a) => a.addEventListener("click", () => { projFilter.plat = a.dataset.plat; }));
  }

  function curriculum() {
    return `
<section class="page-head">
  <span class="eyebrow">Syllabus</span>
  <h1>The learning path</h1>
  <p>${COURSE.length} modules · ${totalLessons} lessons · about ${hours} hours. Go in order: each module builds on the last.</p>
  <div class="bar"><div style="width:${pct()}%"></div></div>
  <p class="muted small mono">${doneLessons()} / ${totalLessons} lessons done · ${COURSE.filter(quizPassed).length} / ${COURSE.length} quizzes passed</p>
</section>
<div class="modules">
  ${COURSE.map((m) => `
  <article class="module-card">
    <span class="m-num">${des(m)} · ${m.level}</span>
    <h2><a href="#/learn/${m.id}">${m.title}</a></h2>
    <p>${m.tagline}</p>
    <ol class="lesson-list">
      ${m.lessons.map((l) => `<li class="${state.lessons[m.id + "/" + l.id] ? "done" : ""}"><a href="#/learn/${m.id}/${l.id}"><span class="chk"></span>${l.title}<small>${l.minutes} min</small></a></li>`).join("")}
      <li class="quiz-li ${quizPassed(m) ? "done" : ""}"><a href="#/quiz/${m.id}"><span class="chk"></span>Module quiz${state.quiz[m.id] ? ` <small>best ${state.quiz[m.id].best}/${m.quiz.length}</small>` : ""}</a></li>
    </ol>
  </article>`).join("")}
</div>`;
  }

  function moduleOverview(m) {
    return `
<section class="page-head narrow">
  <a class="crumb" href="#/learn">← All modules</a>
  <div class="m-hero"><div class="des-badge">${des(m)}</div><div><span class="m-num">Module ${COURSE.indexOf(m) + 1} · ${m.level}</span><h1>${m.title}</h1><p>${m.tagline}</p></div></div>
  <div class="bar"><div style="width:${(modDone(m) / m.lessons.length) * 100}%"></div></div>
</section>
<ol class="lesson-list big">
  ${m.lessons.map((l, k) => `<li class="${state.lessons[m.id + "/" + l.id] ? "done" : ""}"><a href="#/learn/${m.id}/${l.id}"><span class="chk"></span><span class="ln">${k + 1}</span><span>${l.title}${RECAPS[m.id + "/" + l.id] ? `<br><small class="muted" style="margin:0;font-family:var(--font);white-space:normal">${RECAPS[m.id + "/" + l.id].idea}</small>` : ""}</span><small>${l.minutes} min</small></a></li>`).join("")}
  <li class="quiz-li ${quizPassed(m) ? "done" : ""}"><a href="#/quiz/${m.id}"><span class="chk"></span><span class="ln">Q</span>Module quiz: ${m.quiz.length} questions<small>${quizPassed(m) ? "passed" : "pass: 80%"}</small></a></li>
</ol>
<div class="center"><a class="btn primary big" href="#/learn/${m.id}/${(m.lessons.find((l) => !state.lessons[m.id + "/" + l.id]) || m.lessons[0]).id}">Start module</a></div>`;
  }

  function lesson(m, l) {
    const idx = m.lessons.indexOf(l);
    const mi = COURSE.indexOf(m);
    const prev = idx > 0 ? `#/learn/${m.id}/${m.lessons[idx - 1].id}` : mi > 0 ? `#/quiz/${COURSE[mi - 1].id}` : null;
    const next = idx < m.lessons.length - 1 ? `#/learn/${m.id}/${m.lessons[idx + 1].id}` : `#/quiz/${m.id}`;
    const nextLabel = idx < m.lessons.length - 1 ? m.lessons[idx + 1].title : "Module quiz";
    const rc = RECAPS[m.id + "/" + l.id];
    return `
<div class="lesson-layout">
  <aside class="side">
    <a class="crumb" href="#/learn/${m.id}">${des(m)} · Module ${mi + 1}</a>
    <h3>${m.title}</h3>
    <ol class="side-list">
      ${m.lessons.map((x) => `<li class="${x === l ? "cur" : ""} ${state.lessons[m.id + "/" + x.id] ? "done" : ""}"><a href="#/learn/${m.id}/${x.id}"><span class="chk"></span>${x.title}</a></li>`).join("")}
      <li class="${quizPassed(m) ? "done" : ""}"><a href="#/quiz/${m.id}"><span class="chk"></span>Module quiz</a></li>
    </ol>
  </aside>
  <article class="lesson">
    <div class="lesson-meta"><span>LESSON ${idx + 1}/${m.lessons.length}</span><span>${l.minutes} MIN READ</span><span>${m.level.toUpperCase()}</span></div>
    <h1>${l.title}</h1>
    ${rc ? `<div class="big-idea"><span class="eyebrow">The big idea</span><p>${rc.idea}</p></div>` : ""}
    ${l.body}
    ${rc ? `<section class="recap"><div class="recap-head"><span>Quick recap</span><span>${des(m)}.${idx + 1}</span></div><ol>${rc.recap.map((r) => `<li>${r}</li>`).join("")}</ol></section>` : ""}
    <div class="lesson-nav">
      ${prev ? `<a class="btn ghost" href="${prev}">← Previous</a>` : "<span></span>"}
      <a class="btn primary" href="${next}" data-complete="${m.id}/${l.id}">Mark complete & continue → <small>${nextLabel}</small></a>
    </div>
  </article>
  <nav class="toc" aria-label="On this page"><span class="eyebrow">On this page</span><div id="toc-links"></div></nav>
</div>`;
  }

  // Build the "On this page" list from the lesson's h2s and highlight the current one.
  function wireToc() {
    const links = document.getElementById("toc-links");
    const heads = [...document.querySelectorAll(".lesson h2")];
    if (heads.length < 2) { links.closest(".toc").style.visibility = "hidden"; return; }
    heads.forEach((h, i) => (h.id = "s" + i));
    links.innerHTML = heads.map((h) => `<a href="#" data-to="${h.id}">${h.textContent}</a>`).join("");
    links.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      e.preventDefault(); // keep the route in the hash
      document.getElementById(a.dataset.to).scrollIntoView({ behavior: "smooth" });
    });
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) links.querySelectorAll("a").forEach((a) => a.classList.toggle("on", a.dataset.to === en.target.id));
      });
    }, { rootMargin: "-10% 0px -75% 0px" });
    heads.forEach((h) => io.observe(h));
  }

  function quiz(m) {
    const prev = state.quiz[m.id];
    return `
<section class="page-head narrow">
  <a class="crumb" href="#/learn/${m.id}">← ${m.title}</a>
  <span class="eyebrow">${des(m)} · Module quiz</span>
  <h1>${m.title}</h1>
  <p>${m.quiz.length} questions. Get ${Math.ceil(m.quiz.length * PASS)} right to pass. Every answer is explained — wrong answers are how you learn!${prev ? ` <br><b>Your best so far: ${prev.best}/${m.quiz.length}</b>` : ""}</p>
</section>
<form class="quiz narrow" id="quiz">
  ${m.quiz.map((q, i) => `
  <fieldset class="q" data-i="${i}">
    <legend><span class="qn">Q${i + 1}</span>${q.q}</legend>
    <div class="opts">${q.options.map((o, k) => `<label class="opt"><input type="radio" name="q${i}" value="${k}"><span>${o}</span></label>`).join("")}</div>
    <div class="why" hidden></div>
  </fieldset>`).join("")}
  <div class="quiz-foot"><button class="btn primary big" type="submit">Check my answers</button></div>
  <div id="result"></div>
</form>`;
  }

  function wireQuiz(m) {
    const form = document.getElementById("quiz");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let score = 0, missing = 0;
      m.quiz.forEach((q, i) => {
        const fs = form.querySelector(`[data-i="${i}"]`);
        const picked = form.querySelector(`input[name="q${i}"]:checked`);
        fs.classList.remove("right", "wrong", "missing");
        fs.querySelectorAll(".opt").forEach((o) => o.classList.remove("is-answer", "is-wrong"));
        if (!picked) { missing++; fs.classList.add("missing"); return; }
        const ok = +picked.value === q.answer;
        if (ok) score++;
        fs.classList.add(ok ? "right" : "wrong");
        fs.querySelectorAll(".opt")[q.answer].classList.add("is-answer");
        if (!ok) picked.closest(".opt").classList.add("is-wrong");
        const why = fs.querySelector(".why");
        why.hidden = false;
        why.innerHTML = `${ok ? "✅ Correct!" : "❌ Not quite."} ${q.why}`;
      });
      const res = document.getElementById("result");
      if (missing) {
        res.innerHTML = `<div class="result warn">Please answer all questions — ${missing} left.</div>`;
        form.querySelector(".missing").scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      const passed = score / m.quiz.length >= PASS;
      const prev = state.quiz[m.id] || { best: 0, passed: false };
      state.quiz[m.id] = { best: Math.max(prev.best, score), passed: prev.passed || passed, date: prev.passed ? prev.date : passed ? new Date().toISOString().slice(0, 10) : null };
      m.lessons.forEach((l) => (state.lessons[m.id + "/" + l.id] = state.lessons[m.id + "/" + l.id] || passed));
      Object.keys(state.lessons).forEach((k) => { if (!state.lessons[k]) delete state.lessons[k]; });
      save();
      const mi = COURSE.indexOf(m);
      const nextMod = COURSE[mi + 1];
      res.innerHTML = passed
        ? `<div class="result pass"><div class="big-emoji">🎉</div><h2>You scored ${score}/${m.quiz.length} — module passed!</h2>
           <p>${allPassed() ? "That was the last one. Your certificate is ready!" : "Brilliant work. On to the next adventure."}</p>
           <a class="btn primary big" href="${allPassed() ? "#/certificate" : nextMod ? `#/learn/${nextMod.id}` : "#/learn"}">${allPassed() ? "Get my certificate 🏆" : `Next: ${nextMod ? nextMod.title : "Learning path"} →`}</a></div>`
        : `<div class="result fail"><div class="big-emoji">💪</div><h2>You scored ${score}/${m.quiz.length}</h2>
           <p>You need ${Math.ceil(m.quiz.length * PASS)} to pass. Read the explanations above, revisit the lessons, and try again. No limit on attempts!</p>
           <button class="btn primary" type="button" id="retry">Try again</button> <a class="btn ghost" href="#/learn/${m.id}">Review lessons</a></div>`;
      if (passed) confetti();
      const retry = document.getElementById("retry");
      if (retry) retry.addEventListener("click", () => { form.reset(); form.querySelectorAll(".q").forEach((f) => { f.classList.remove("right", "wrong"); f.querySelector(".why").hidden = true; f.querySelectorAll(".opt").forEach((o) => o.classList.remove("is-answer", "is-wrong")); }); res.innerHTML = ""; window.scrollTo({ top: 0, behavior: "smooth" }); });
      res.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  const projFilter = { plat: "all", diff: "all" };
  const DIFFS = ["Easy", "Medium", "Advanced"];
  const diffMeter = (d) => `<span class="diff-meter" title="${d}">${DIFFS.map((x, i) => `<i class="${i <= DIFFS.indexOf(d) ? "on" : ""}"></i>`).join("")}</span> ${d}`;

  function projects() {
    return `
<section class="page-head">
  <span class="eyebrow">Build something</span>
  <h1>Hands-on projects</h1>
  <p>Theory sticks when you build. Every project lists the parts with prices, step-by-step wiring, working code and a challenge to push further. No hardware yet? Try the Arduino and ESP32 ones free in Wokwi or Tinkercad Circuits.</p>
</section>
<div class="filters">
  <div class="filter-row" id="f-plat"><span>Platform</span>
    <button class="fchip" data-v="all">All<small>${PROJECTS.length}</small></button>
    ${Object.entries(PLATFORMS).map(([k, v]) => `<button class="fchip" data-v="${k}">${v.short}<small>${PROJECTS.filter((p) => p.platform === k).length}</small></button>`).join("")}
  </div>
  <div class="filter-row" id="f-diff"><span>Level</span>
    <button class="fchip" data-v="all">Any</button>
    ${DIFFS.map((d) => `<button class="fchip" data-v="${d}">${d}</button>`).join("")}
    <span class="proj-count" id="p-count"></span>
  </div>
</div>
<div class="proj-grid" id="p-grid"></div>`;
  }

  function wireProjects() {
    const grid = document.getElementById("p-grid");
    const paint = () => {
      document.querySelectorAll("#f-plat .fchip").forEach((b) => b.classList.toggle("on", b.dataset.v === projFilter.plat));
      document.querySelectorAll("#f-diff .fchip").forEach((b) => b.classList.toggle("on", b.dataset.v === projFilter.diff));
      const list = PROJECTS.filter((p) => (projFilter.plat === "all" || p.platform === projFilter.plat) && (projFilter.diff === "all" || p.difficulty === projFilter.diff));
      document.getElementById("p-count").textContent = `${list.length} shown`;
      grid.innerHTML = list.length ? list.map((p) => `
        <a class="proj-card" href="#/projects/${p.id}">
          <div><span class="plat ${p.platform}">${PLATFORMS[p.platform].short}</span></div>
          <h3>${p.title}</h3>
          <p>${p.learn.join(" · ")}</p>
          <div class="p-meta"><span>${diffMeter(p.difficulty)}</span><span>${p.time}</span><span>${p.cost}</span></div>
        </a>`).join("") : `<p class="muted">No projects match. Try another level.</p>`;
    };
    document.querySelectorAll("#f-plat .fchip").forEach((b) => b.addEventListener("click", () => { projFilter.plat = b.dataset.v; paint(); }));
    document.querySelectorAll("#f-diff .fchip").forEach((b) => b.addEventListener("click", () => { projFilter.diff = b.dataset.v; paint(); }));
    paint();
  }

  function project(p) {
    const plat = PLATFORMS[p.platform];
    const have = (state.parts && state.parts[p.id]) || [];
    return `
<div class="proj-layout">
  <article class="lesson">
    <a class="crumb" href="#/projects">← All projects</a>
    <div><span class="plat ${p.platform}">${plat.short}</span></div>
    <h1>${p.title}</h1>
    <h2>How it works</h2>
    ${p.how}
    <h2>You'll need</h2>
    <p class="muted small">Tick parts off as you collect them.</p>
    <ul class="parts-list">${p.parts.map((x, i) => `<li><label><input type="checkbox" data-part="${i}" ${have.includes(i) ? "checked" : ""}><span>${x}</span></label></li>`).join("")}</ul>
    <h2>Build it</h2>
    ${H.steps(p.steps)}
    <h2>${p.code ? "Code" : "Code"}</h2>
    ${p.code ? H.code(p.code, p.lang) : `<div class="no-code">No code needed. This circuit works with components alone, and that's the point: it shows what hardware can do before any software.</div>`}
    <div class="challenge"><span class="eyebrow">Next-level challenge</span><p>${p.challenge}</p></div>
    ${H.mistake(`<p>Double-check polarity (LEDs, electrolytic capacitors, diodes), connect all grounds together, and ${p.platform === "arduino" || p.platform === "analog" ? "power down before rewiring" : "remember these boards use 3.3 V logic — never feed 5 V into a GPIO pin"}.</p>`)}
  </article>
  <aside class="spec-card">
    <h4>Project spec</h4>
    <dl>
      <div><dt>Platform</dt><dd>${plat.name}</dd></div>
      <div><dt>Level</dt><dd>${diffMeter(p.difficulty)}</dd></div>
      <div><dt>Build time</dt><dd>${p.time}</dd></div>
      <div><dt>Parts cost</dt><dd>${p.cost}</dd></div>
      <div><dt>Language</dt><dd>${p.code ? { cpp: "C++ (Arduino)", python: "Python", micropython: "MicroPython" }[p.lang] : "None"}</dd></div>
    </dl>
    <div class="learn"><span class="eyebrow">You'll learn</span><ul>${p.learn.map((x) => `<li>${x}</li>`).join("")}</ul></div>
  </aside>
</div>`;
  }

  function wireProject(p) {
    document.querySelectorAll("[data-part]").forEach((cb) => cb.addEventListener("change", () => {
      state.parts = state.parts || {};
      state.parts[p.id] = [...document.querySelectorAll("[data-part]:checked")].map((x) => +x.dataset.part);
      save();
    }));
  }

  function glossary() {
    return `
<section class="page-head narrow">
  <h1>Glossary</h1>
  <p>Every key term from the course, in one line each.</p>
  <input class="search" id="gsearch" type="search" placeholder="Search terms… (e.g. PWM, MOSFET)" aria-label="Search glossary">
</section>
<dl class="glossary narrow" id="gl">
  ${GLOSSARY.map(([t, d]) => `<div class="g-item"><dt>${t}</dt><dd>${d}</dd></div>`).join("")}
</dl>`;
  }

  /* ---------------- Certificate ---------------- */
  // FNV-1a hash → short ID. Same name + date always gives the same ID,
  // which is what makes the verify form below work without a server.
  function certId(name, date) {
    let h = 0x811c9dc5;
    const s = name.trim().toUpperCase() + "|" + date + "|OPENCIRCUIT";
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    const a = h.toString(36).toUpperCase().padStart(7, "0");
    let h2 = h;
    for (let i = s.length - 1; i >= 0; i--) { h2 ^= s.charCodeAt(i); h2 = Math.imul(h2, 0x01000193) >>> 0; }
    return `OC-${a.slice(0, 4)}-${a.slice(4)}${h2.toString(36).toUpperCase().slice(0, 3)}`;
  }

  function completionDate() {
    return COURSE.map((m) => (state.quiz[m.id] && state.quiz[m.id].date) || "").sort().pop() || new Date().toISOString().slice(0, 10);
  }

  function certificate() {
    const ok = allPassed();
    return `
<section class="page-head narrow">
  <span class="eyebrow">Final output</span>
  <h1>Your certificate</h1>
  <p>Pass all ${COURSE.length} module quizzes (80% or more) and your certificate of completion is generated automatically, with a unique ID anyone can verify.</p>
</section>
<div class="narrow">
  ${ok ? `
  <div class="cert-form">
    <label class="ctl num"><span>Your full name, as it should appear</span><input id="cname" type="text" maxlength="48" value="${H.esc(state.name || "")}" placeholder="e.g. Mathews V Manoj"></label>
    <button class="btn primary" id="cgen">Generate certificate</button>
  </div>
  <div class="cert-view" id="cview" hidden><canvas id="cert" width="1600" height="1130"></canvas>
    <div class="btn-row center"><button class="btn primary" id="cdl">⬇ Download PNG</button><button class="btn ghost" id="cprint" ${window.claude ? "hidden" : ""}>🖨 Print / save as PDF</button></div>
    <p class="muted small center" id="cmsg"></p>
  </div>` : `
  <div class="locked">
    <span class="eyebrow">Locked</span>
    <h2>Pass these module quizzes to unlock it</h2>
    <ul class="unlock">${COURSE.map((m) => `<li class="${quizPassed(m) ? "done" : ""}"><span class="chk"></span><a href="#/quiz/${m.id}">${des(m)} · ${m.title}</a>${state.quiz[m.id] ? ` <small>best ${state.quiz[m.id].best}/${m.quiz.length}</small>` : ""}</li>`).join("")}</ul>
    <a class="btn primary" href="${nextStop()}">Continue learning →</a>
  </div>`}
  <div class="verify">
    <h3>Verify a certificate</h3>
    <p class="muted small">Enter the name and completion date printed on a certificate to check that its ID is genuine.</p>
    <div class="w-grid three">
      <label class="ctl num"><span>Name</span><input id="vname" type="text"></label>
      <label class="ctl num"><span>Date (YYYY-MM-DD)</span><input id="vdate" type="date"></label>
      <label class="ctl num"><span>Certificate ID</span><input id="vid" type="text" placeholder="OC-XXXX-XXXXXX"></label>
    </div>
    <button class="btn ghost" id="vbtn">Verify</button> <span id="vres" class="vres"></span>
  </div>
</div>`;
  }

  function drawCert(name) {
    const c = document.getElementById("cert");
    const ctx = c.getContext("2d");
    const W = c.width, Hh = c.height;
    const date = completionDate();
    const id = certId(name, date);
    const g = ctx.createLinearGradient(0, 0, W, Hh);
    g.addColorStop(0, "#07231a"); g.addColorStop(1, "#0d3326");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, Hh);
    // circuit traces
    ctx.strokeStyle = "rgba(63,208,191,0.10)"; ctx.lineWidth = 3;
    for (let i = 0; i < 26; i++) {
      const y = 60 + i * 40, x = (i * 137) % 500;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(x + 80, y); ctx.lineTo(x + 120, y + 30); ctx.lineTo(x + 260, y + 30); ctx.stroke();
      ctx.beginPath(); ctx.arc(x + 260, y + 30, 6, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W, y); ctx.lineTo(W - x - 80, y); ctx.lineTo(W - x - 120, y - 30); ctx.lineTo(W - x - 220, y - 30); ctx.stroke();
    }
    // borders
    ctx.strokeStyle = "#f0a36b"; ctx.lineWidth = 6; ctx.strokeRect(40, 40, W - 80, Hh - 80);
    ctx.strokeStyle = "rgba(240,163,107,.45)"; ctx.lineWidth = 2; ctx.strokeRect(58, 58, W - 116, Hh - 116);
    ctx.textAlign = "center";
    ctx.fillStyle = "#3fd0bf"; ctx.font = "600 34px 'IBM Plex Mono', monospace";
    ctx.fillText("OPENCIRCUIT ACADEMY", W / 2, 150);
    ctx.fillStyle = "#f0a36b"; ctx.font = "700 76px Georgia, 'Times New Roman', serif";
    ctx.fillText("Certificate of Completion", W / 2, 260);
    ctx.fillStyle = "#cbd5e1"; ctx.font = "28px system-ui, sans-serif";
    ctx.fillText("This is to certify that", W / 2, 340);
    let size = 84;
    ctx.font = `700 ${size}px Georgia, serif`;
    while (ctx.measureText(name).width > W - 320 && size > 40) { size -= 4; ctx.font = `700 ${size}px Georgia, serif`; }
    ctx.fillStyle = "#ffffff"; ctx.fillText(name, W / 2, 445);
    ctx.strokeStyle = "#f0a36b"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W / 2 - 360, 475); ctx.lineTo(W / 2 + 360, 475); ctx.stroke();
    ctx.fillStyle = "#cbd5e1"; ctx.font = "28px system-ui, sans-serif";
    ctx.fillText("has successfully completed all modules and assessments of", W / 2, 535);
    ctx.fillStyle = "#ffffff"; ctx.font = "600 38px system-ui, sans-serif";
    ctx.fillText("Foundations of Electronics, Embedded Systems & VLSI", W / 2, 590);
    ctx.fillStyle = "#94a3b8"; ctx.font = "22px system-ui, sans-serif";
    const titles = COURSE.map((m) => m.title.replace(/:.*/, ""));
    const half = Math.ceil(titles.length / 2);
    ctx.fillText(titles.slice(0, half).join("  •  "), W / 2, 660);
    ctx.fillText(titles.slice(half).join("  •  "), W / 2, 695);
    const avg = Math.round((COURSE.reduce((s, m) => s + state.quiz[m.id].best / m.quiz.length, 0) / COURSE.length) * 100);
    ctx.fillStyle = "#3fd0bf"; ctx.font = "600 26px system-ui, sans-serif";
    ctx.fillText(`${COURSE.length} modules · ${totalLessons} lessons · Average assessment score ${avg}%`, W / 2, 760);
    // footer
    ctx.textAlign = "left"; ctx.fillStyle = "#cbd5e1"; ctx.font = "22px system-ui";
    ctx.fillText("Date of completion", 140, 900);
    ctx.fillStyle = "#fff"; ctx.font = "600 30px system-ui"; ctx.fillText(new Date(date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }), 140, 945);
    ctx.textAlign = "right"; ctx.fillStyle = "#cbd5e1"; ctx.font = "22px system-ui";
    ctx.fillText("Certificate ID", W - 140, 900);
    ctx.fillStyle = "#fff"; ctx.font = "600 30px 'IBM Plex Mono', monospace"; ctx.fillText(id, W - 140, 945);
    // seal
    ctx.textAlign = "center";
    const sx = W / 2, sy = 915;
    ctx.fillStyle = "#f0a36b"; ctx.beginPath();
    for (let k = 0; k < 40; k++) { const r = k % 2 ? 78 : 90, a = (k / 40) * Math.PI * 2; ctx.lineTo(sx + r * Math.cos(a), sy + r * Math.sin(a)); }
    ctx.fill();
    ctx.fillStyle = "#07231a"; ctx.beginPath(); ctx.arc(sx, sy, 64, 0, 7); ctx.fill();
    ctx.fillStyle = "#f0a36b"; ctx.font = "700 44px system-ui"; ctx.fillText("⚡", sx, sy + 4);
    ctx.font = "700 16px system-ui"; ctx.fillText("VERIFIED", sx, sy + 34);
    ctx.fillStyle = "#64748b"; ctx.font = "18px system-ui";
    ctx.fillText("Verify this certificate on the OpenCircuit Academy certificate page using the name, date and ID above.", W / 2, Hh - 80);
    return id;
  }

  function wireCertificate() {
    const gen = document.getElementById("cgen");
    if (gen) {
      const run = () => {
        const name = document.getElementById("cname").value.trim().replace(/\s+/g, " ");
        if (name.length < 2) { document.getElementById("cname").focus(); return; }
        state.name = name; save();
        document.getElementById("cview").hidden = false;
        const id = drawCert(name);
        document.getElementById("cdl").onclick = async () => {
          const filename = `OpenCircuit-Certificate-${id}.png`;
          const canvas = document.getElementById("cert");
          const msg = document.getElementById("cmsg");
          // Inside the claude.ai viewer, files are offered through the downloads capability.
          const downloads = window.claude && window.claude.use ? await window.claude.use("downloads").catch(() => null) : null;
          if (downloads) {
            const blob = await new Promise((r) => canvas.toBlob(r, "image/png"));
            try { await downloads.save({ filename, data: blob }); msg.textContent = "Certificate saved."; }
            catch (err) { msg.textContent = err && err.code === "declined" ? "" : "Saving isn't available here. Right-click or long-press the certificate to save the image."; }
            return;
          }
          const a = document.createElement("a");
          a.download = filename;
          a.href = canvas.toDataURL("image/png");
          a.click();
        };
        document.getElementById("cprint").onclick = () => window.print();
        confetti();
      };
      gen.addEventListener("click", run);
      if (state.name) run();
    }
    document.getElementById("vbtn").addEventListener("click", () => {
      const n = document.getElementById("vname").value.trim().replace(/\s+/g, " ");
      const d = document.getElementById("vdate").value;
      const id = document.getElementById("vid").value.trim().toUpperCase();
      const res = document.getElementById("vres");
      if (!n || !d || !id) { res.textContent = "Fill in all three fields."; res.className = "vres"; return; }
      const good = certId(n, d) === id;
      res.textContent = good ? "✅ Genuine — this ID matches the name and date." : "❌ No match. Check the spelling of the name, the date and the ID.";
      res.className = "vres " + (good ? "ok" : "bad");
    });
  }

  /* ---------------- Effects ---------------- */
  function confetti() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = document.createElement("div");
    box.className = "confetti";
    const colors = ["#3fd0bf", "#f0a36b", "#5bd07a", "#e8c96a", "#b15a1e"];
    for (let i = 0; i < 80; i++) {
      const s = document.createElement("i");
      s.style.left = Math.random() * 100 + "vw";
      s.style.background = colors[i % colors.length];
      s.style.animationDelay = Math.random() * 0.6 + "s";
      s.style.animationDuration = 1.8 + Math.random() * 1.4 + "s";
      box.appendChild(s);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 3800);
  }

  /* ---------------- Router ---------------- */
  function notFound() {
    return `<section class="page-head narrow center"><h1>🔌 Page not found</h1><p>This wire doesn't connect anywhere.</p><a class="btn primary" href="#/">Go home</a></section>`;
  }

  function render() {
    const hash = location.hash.replace(/^#/, "") || "/";
    const parts = hash.split("/").filter(Boolean);
    let html, after, title = "OpenCircuit Academy";
    const mod = (id) => COURSE.find((m) => m.id === id);

    if (!parts.length) { html = home(); after = startScope; }
    else if (parts[0] === "learn" && !parts[1]) { html = curriculum(); title = "Learning path"; }
    else if (parts[0] === "learn" && mod(parts[1]) && !parts[2]) { const m = mod(parts[1]); html = moduleOverview(m); title = m.title; }
    else if (parts[0] === "learn" && mod(parts[1])) {
      const m = mod(parts[1]), l = m.lessons.find((x) => x.id === parts[2]);
      if (l) { html = lesson(m, l); title = l.title; after = wireToc; } else html = notFound();
    }
    else if (parts[0] === "quiz" && mod(parts[1])) { const m = mod(parts[1]); html = quiz(m); after = () => wireQuiz(m); title = "Quiz: " + m.title; }
    else if (parts[0] === "projects" && !parts[1]) { html = projects(); title = "Projects"; after = wireProjects; }
    else if (parts[0] === "projects") { const p = PROJECTS.find((x) => x.id === parts[1]); html = p ? project(p) : notFound(); if (p) { title = p.title; after = () => wireProject(p); } }
    else if (parts[0] === "glossary") {
      html = glossary(); title = "Glossary";
      after = () => document.getElementById("gsearch").addEventListener("input", (e) => {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll(".g-item").forEach((it) => (it.hidden = !it.textContent.toLowerCase().includes(q)));
      });
    }
    else if (parts[0] === "certificate") { html = certificate(); after = wireCertificate; title = "Certificate"; }
    else html = notFound();

    app.innerHTML = html;
    document.title = title === "OpenCircuit Academy" ? title : `${title} · OpenCircuit Academy`;
    setActiveNav("/" + (parts[0] || ""));
    window.mountWidgets(app);
    if (after) after();
    window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
    document.body.classList.remove("nav-open");
  }

  /* ---------------- Global events ---------------- */
  document.addEventListener("click", (e) => {
    const done = e.target.closest("[data-complete]");
    if (done) { state.lessons[done.dataset.complete] = true; save(); }
    const copy = e.target.closest(".copy");
    if (copy) {
      const txt = copy.closest(".code").querySelector("code").textContent;
      const ok = () => { copy.textContent = "Copied!"; setTimeout(() => (copy.textContent = "Copy"), 1400); };
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(ok, () => {});
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea, select")) return;
    const nav = document.querySelector(".lesson-nav");
    if (!nav) return;
    if (e.key === "ArrowRight") { const a = nav.querySelector(".btn.primary"); if (a) a.click(); }
    if (e.key === "ArrowLeft") { const a = nav.querySelector(".btn.ghost"); if (a) a.click(); }
  });

  // Reading progress bar
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const p = h.scrollHeight - h.clientHeight;
    document.getElementById("readbar").style.width = (p > 0 ? (h.scrollTop / p) * 100 : 0) + "%";
  }, { passive: true });

  // Theme toggle (remembered per browser)
  const root = document.documentElement;
  try { const t = localStorage.getItem("opencircuit-theme"); if (t) root.dataset.theme = t; } catch {}
  document.getElementById("theme").addEventListener("click", () => {
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("opencircuit-theme", root.dataset.theme); } catch {}
    window.dispatchEvent(new Event("resize")); // redraw canvases with new colours
  });
  document.getElementById("menu").addEventListener("click", () => document.body.classList.toggle("nav-open"));

  // Two-step reset: the first click asks, the second (within 4 s) confirms.
  const resetLink = document.getElementById("reset");
  let resetArmed = null;
  resetLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (!resetArmed) {
      resetLink.textContent = "Click again to erase all progress";
      resetArmed = setTimeout(() => { resetArmed = null; resetLink.textContent = "Reset my progress"; }, 4000);
      return;
    }
    clearTimeout(resetArmed); resetArmed = null;
    state = { lessons: {}, quiz: {}, name: "" }; save(); render();
    resetLink.textContent = "Progress reset";
    setTimeout(() => (resetLink.textContent = "Reset my progress"), 2000);
  });

  window.addEventListener("hashchange", render);
  updateHeader();
  render();
})();
