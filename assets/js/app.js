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
  function home() {
    const started = doneLessons() > 0;
    return `
<section class="hero">
  <div class="hero-bg" aria-hidden="true">${circuitBg()}</div>
  <div class="hero-inner">
    <span class="pill">Free · Open source · Made by an ECE student for ECE students</span>
    <h1>Learn electronics <span class="grad">from zero to embedded & VLSI</span></h1>
    <p class="hero-sub">No boring theory dumps. Every concept is explained with everyday analogies, and you get interactive simulators to play with. Finish the path, pass the quizzes and earn your certificate.</p>
    <div class="hero-cta">
      <a class="btn primary big" href="${started ? nextStop() : "#/learn/basics/atoms"}">${started ? "Continue learning →" : "Start learning — it's free →"}</a>
      <a class="btn ghost big" href="#/learn">See the full path</a>
    </div>
    <div class="stats">
      <div><b>${COURSE.length}</b><span>modules</span></div>
      <div><b>${totalLessons}</b><span>lessons</span></div>
      <div><b>17</b><span>simulators</span></div>
      <div><b>${PROJECTS.length}</b><span>projects</span></div>
    </div>
  </div>
</section>

<section class="section">
  <h2 class="sec-title">Your journey, one step at a time</h2>
  <p class="sec-sub">Each module builds on the one before. You'll start with "what is an electron?" and end up writing Verilog and register-level firmware.</p>
  <div class="journey">
    ${COURSE.map((m, i) => `
      <a class="j-step ${quizPassed(m) ? "done" : ""}" href="#/learn/${m.id}">
        <div class="j-num">${quizPassed(m) ? "✓" : i + 1}</div>
        <div class="j-body"><div class="j-ico">${m.icon}</div><h3>${m.title}</h3><p>${m.tagline}</p><span class="tag">${m.level}</span></div>
      </a>`).join("")}
    <a class="j-step final" href="#/certificate"><div class="j-num">🏆</div><div class="j-body"><h3>Earn your certificate</h3><p>Pass every module quiz and your certificate is generated automatically.</p></div></a>
  </div>
</section>

<section class="section">
  <h2 class="sec-title">Why this way of learning works</h2>
  <div class="features">
    <div class="feature"><div class="f-ico">💡</div><h3>Analogies first</h3><p>Voltage is water pressure. A capacitor is a water balloon. Understand the idea before the equation.</p></div>
    <div class="feature"><div class="f-ico">🎛️</div><h3>Play, don't memorise</h3><p>Drag sliders, flip bits, toggle gates. See what changes, and build real intuition.</p></div>
    <div class="feature"><div class="f-ico">🛠️</div><h3>Build real things</h3><p>Guided Arduino projects with parts lists, wiring and working code — from a traffic light to a radar.</p></div>
    <div class="feature"><div class="f-ico">🎓</div><h3>GATE-aware</h3><p>"GATE corner" notes connect each concept to the GATE ECE syllabus, so learning doubles as exam prep.</p></div>
    <div class="feature"><div class="f-ico">✅</div><h3>Quizzes & feedback</h3><p>Every module ends with a short quiz, and every answer comes with an explanation.</p></div>
    <div class="feature"><div class="f-ico">🏅</div><h3>Automatic certificate</h3><p>Finish all modules and a verifiable certificate with a unique ID is generated for you instantly.</p></div>
  </div>
</section>

<section class="section cta-band">
  <h2>Every expert was once a beginner.</h2>
  <p>The engineers who design satellites, radars and smartphone chips all started by lighting up one LED. Start yours today.</p>
  <a class="btn primary big" href="${nextStop()}">${started ? "Pick up where you left off →" : "Light up your first LED →"}</a>
</section>`;
  }

  function curriculum() {
    return `
<section class="page-head">
  <h1>The learning path</h1>
  <p>${COURSE.length} modules · ${totalLessons} lessons · about ${Math.round(COURSE.reduce((n, m) => n + m.lessons.reduce((a, l) => a + l.minutes, 0), 0) / 60)} hours. Go in order — each module builds on the last.</p>
  <div class="bar"><div style="width:${pct()}%"></div></div>
  <p class="muted small">${doneLessons()} / ${totalLessons} lessons done · ${COURSE.filter(quizPassed).length} / ${COURSE.length} quizzes passed</p>
</section>
<div class="modules">
  ${COURSE.map((m, i) => `
  <article class="module-card">
    <header>
      <div class="m-ico">${m.icon}</div>
      <div><span class="m-num">Module ${i + 1} · ${m.level}</span><h2><a href="#/learn/${m.id}">${m.title}</a></h2><p>${m.tagline}</p></div>
    </header>
    <ol class="lesson-list">
      ${m.lessons.map((l) => `<li class="${state.lessons[m.id + "/" + l.id] ? "done" : ""}"><a href="#/learn/${m.id}/${l.id}"><span class="chk"></span>${l.title}<small>${l.minutes} min</small></a></li>`).join("")}
      <li class="quiz-li ${quizPassed(m) ? "done" : ""}"><a href="#/quiz/${m.id}"><span class="chk"></span>Module quiz${state.quiz[m.id] ? ` <small>best ${state.quiz[m.id].best}/${m.quiz.length}</small>` : ""}</a></li>
    </ol>
  </article>`).join("")}
</div>`;
  }

  function moduleOverview(m) {
    const i = COURSE.indexOf(m);
    return `
<section class="page-head">
  <a class="crumb" href="#/learn">← All modules</a>
  <div class="m-hero"><div class="m-ico big">${m.icon}</div><div><span class="m-num">Module ${i + 1} · ${m.level}</span><h1>${m.title}</h1><p>${m.tagline}</p></div></div>
  <div class="bar"><div style="width:${(modDone(m) / m.lessons.length) * 100}%"></div></div>
</section>
<ol class="lesson-list big">
  ${m.lessons.map((l, k) => `<li class="${state.lessons[m.id + "/" + l.id] ? "done" : ""}"><a href="#/learn/${m.id}/${l.id}"><span class="chk"></span><span class="ln">${k + 1}</span>${l.title}<small>${l.minutes} min</small></a></li>`).join("")}
  <li class="quiz-li ${quizPassed(m) ? "done" : ""}"><a href="#/quiz/${m.id}"><span class="chk"></span><span class="ln">★</span>Module quiz — ${m.quiz.length} questions<small>${quizPassed(m) ? "passed" : "pass with 80%"}</small></a></li>
</ol>
<div class="center"><a class="btn primary big" href="#/learn/${m.id}/${(m.lessons.find((l) => !state.lessons[m.id + "/" + l.id]) || m.lessons[0]).id}">Start module →</a></div>`;
  }

  function lesson(m, l) {
    const idx = m.lessons.indexOf(l);
    const mi = COURSE.indexOf(m);
    const prev = idx > 0 ? `#/learn/${m.id}/${m.lessons[idx - 1].id}` : mi > 0 ? `#/quiz/${COURSE[mi - 1].id}` : null;
    const next = idx < m.lessons.length - 1 ? `#/learn/${m.id}/${m.lessons[idx + 1].id}` : `#/quiz/${m.id}`;
    const nextLabel = idx < m.lessons.length - 1 ? m.lessons[idx + 1].title : "Module quiz";
    return `
<div class="lesson-layout">
  <aside class="side">
    <a class="crumb" href="#/learn/${m.id}">${m.icon} Module ${mi + 1}</a>
    <h3>${m.title}</h3>
    <ol class="side-list">
      ${m.lessons.map((x) => `<li class="${x === l ? "cur" : ""} ${state.lessons[m.id + "/" + x.id] ? "done" : ""}"><a href="#/learn/${m.id}/${x.id}"><span class="chk"></span>${x.title}</a></li>`).join("")}
      <li class="${quizPassed(m) ? "done" : ""}"><a href="#/quiz/${m.id}"><span class="chk"></span>Module quiz</a></li>
    </ol>
  </aside>
  <article class="lesson">
    <div class="lesson-meta">Lesson ${idx + 1} of ${m.lessons.length} · ⏱ ${l.minutes} min read</div>
    <h1>${l.title}</h1>
    ${l.body}
    <div class="lesson-nav">
      ${prev ? `<a class="btn ghost" href="${prev}">← Previous</a>` : "<span></span>"}
      <a class="btn primary" href="${next}" data-complete="${m.id}/${l.id}">Mark complete & continue → <small>${nextLabel}</small></a>
    </div>
  </article>
</div>`;
  }

  function quiz(m) {
    const prev = state.quiz[m.id];
    return `
<section class="page-head narrow">
  <a class="crumb" href="#/learn/${m.id}">← ${m.title}</a>
  <h1>${m.icon} Module quiz</h1>
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

  function projects() {
    return `
<section class="page-head">
  <h1>Hands-on projects</h1>
  <p>Theory sticks when you build. Each project lists the parts, the wiring, working code and a challenge to push further. No hardware yet? Build them all free in <b>Tinkercad Circuits</b>.</p>
</section>
<div class="proj-grid">
  ${PROJECTS.map((p) => `
  <a class="proj-card" href="#/projects/${p.id}">
    <div class="p-ico">${p.icon}</div>
    <h3>${p.title}</h3>
    <div class="p-meta"><span class="diff ${p.difficulty.toLowerCase()}">${p.difficulty}</span><span>⏱ ${p.time}</span></div>
    <p>You'll learn: ${p.learn.join(", ")}</p>
  </a>`).join("")}
</div>`;
  }

  function project(p) {
    return `
<article class="lesson solo">
  <a class="crumb" href="#/projects">← All projects</a>
  <div class="m-hero"><div class="m-ico big">${p.icon}</div><div><h1>${p.title}</h1><div class="p-meta"><span class="diff ${p.difficulty.toLowerCase()}">${p.difficulty}</span><span>⏱ ${p.time}</span></div></div></div>
  <h2>What you'll learn</h2><ul>${p.learn.map((x) => `<li>${x}</li>`).join("")}</ul>
  <h2>Parts needed</h2><ul class="parts">${p.parts.map((x) => `<li>${x}</li>`).join("")}</ul>
  <h2>Wiring</h2><p>${p.wiring}</p>
  <h2>Code</h2>${H.code(p.code)}
  ${H.key(`<p><b>Challenge:</b> ${p.challenge}</p>`)}
  ${H.mistake(`<p>Double-check LED polarity, make sure all grounds are connected together, and open the Serial Monitor at the right baud rate when debugging.</p>`)}
</article>`;
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
  <h1>🏆 Your certificate</h1>
  <p>Pass all ${COURSE.length} module quizzes (80% or more) and your certificate of completion is generated automatically, with a unique ID anyone can verify.</p>
</section>
<div class="narrow">
  ${ok ? `
  <div class="cert-form">
    <label class="ctl num"><span>Your full name, as it should appear</span><input id="cname" type="text" maxlength="48" value="${H.esc(state.name || "")}" placeholder="e.g. Mathews V Manoj"></label>
    <button class="btn primary" id="cgen">Generate certificate</button>
  </div>
  <div class="cert-view" id="cview" hidden><canvas id="cert" width="1600" height="1130"></canvas>
    <div class="btn-row center"><button class="btn primary" id="cdl">⬇ Download PNG</button><button class="btn ghost" id="cprint">🖨 Print / save as PDF</button></div>
  </div>` : `
  <div class="locked">
    <div class="big-emoji">🔒</div>
    <h2>Almost there — finish these to unlock:</h2>
    <ul class="unlock">${COURSE.map((m) => `<li class="${quizPassed(m) ? "done" : ""}"><span class="chk"></span><a href="#/quiz/${m.id}">${m.icon} ${m.title}</a>${state.quiz[m.id] ? ` <small>best ${state.quiz[m.id].best}/${m.quiz.length}</small>` : ""}</li>`).join("")}</ul>
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
    g.addColorStop(0, "#0b1220"); g.addColorStop(1, "#122238");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, Hh);
    // circuit traces
    ctx.strokeStyle = "rgba(56,189,248,0.10)"; ctx.lineWidth = 3;
    for (let i = 0; i < 26; i++) {
      const y = 60 + i * 40, x = (i * 137) % 500;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(x + 80, y); ctx.lineTo(x + 120, y + 30); ctx.lineTo(x + 260, y + 30); ctx.stroke();
      ctx.beginPath(); ctx.arc(x + 260, y + 30, 6, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W, y); ctx.lineTo(W - x - 80, y); ctx.lineTo(W - x - 120, y - 30); ctx.lineTo(W - x - 220, y - 30); ctx.stroke();
    }
    // borders
    ctx.strokeStyle = "#f5b83d"; ctx.lineWidth = 6; ctx.strokeRect(40, 40, W - 80, Hh - 80);
    ctx.strokeStyle = "rgba(245,184,61,.45)"; ctx.lineWidth = 2; ctx.strokeRect(58, 58, W - 116, Hh - 116);
    ctx.textAlign = "center";
    ctx.fillStyle = "#38bdf8"; ctx.font = "600 34px 'Space Grotesk', system-ui, sans-serif";
    ctx.fillText("⚡ OPENCIRCUIT ACADEMY", W / 2, 150);
    ctx.fillStyle = "#f5b83d"; ctx.font = "700 76px Georgia, 'Times New Roman', serif";
    ctx.fillText("Certificate of Completion", W / 2, 260);
    ctx.fillStyle = "#cbd5e1"; ctx.font = "28px system-ui, sans-serif";
    ctx.fillText("This is to certify that", W / 2, 340);
    let size = 84;
    ctx.font = `700 ${size}px Georgia, serif`;
    while (ctx.measureText(name).width > W - 320 && size > 40) { size -= 4; ctx.font = `700 ${size}px Georgia, serif`; }
    ctx.fillStyle = "#ffffff"; ctx.fillText(name, W / 2, 445);
    ctx.strokeStyle = "#f5b83d"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W / 2 - 360, 475); ctx.lineTo(W / 2 + 360, 475); ctx.stroke();
    ctx.fillStyle = "#cbd5e1"; ctx.font = "28px system-ui, sans-serif";
    ctx.fillText("has successfully completed all modules and assessments of", W / 2, 535);
    ctx.fillStyle = "#ffffff"; ctx.font = "600 38px system-ui, sans-serif";
    ctx.fillText("Foundations of Electronics, Embedded Systems & VLSI", W / 2, 590);
    ctx.fillStyle = "#94a3b8"; ctx.font = "22px system-ui, sans-serif";
    const titles = COURSE.map((m) => m.title.replace(/:.*/, ""));
    ctx.fillText(titles.slice(0, 4).join("  •  "), W / 2, 660);
    ctx.fillText(titles.slice(4).join("  •  "), W / 2, 695);
    const avg = Math.round((COURSE.reduce((s, m) => s + state.quiz[m.id].best / m.quiz.length, 0) / COURSE.length) * 100);
    ctx.fillStyle = "#38bdf8"; ctx.font = "600 26px system-ui, sans-serif";
    ctx.fillText(`${COURSE.length} modules · ${totalLessons} lessons · Average assessment score ${avg}%`, W / 2, 760);
    // footer
    ctx.textAlign = "left"; ctx.fillStyle = "#cbd5e1"; ctx.font = "22px system-ui";
    ctx.fillText("Date of completion", 140, 900);
    ctx.fillStyle = "#fff"; ctx.font = "600 30px system-ui"; ctx.fillText(new Date(date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }), 140, 945);
    ctx.textAlign = "right"; ctx.fillStyle = "#cbd5e1"; ctx.font = "22px system-ui";
    ctx.fillText("Certificate ID", W - 140, 900);
    ctx.fillStyle = "#fff"; ctx.font = "600 30px 'JetBrains Mono', monospace"; ctx.fillText(id, W - 140, 945);
    // seal
    ctx.textAlign = "center";
    const sx = W / 2, sy = 915;
    ctx.fillStyle = "#f5b83d"; ctx.beginPath();
    for (let k = 0; k < 40; k++) { const r = k % 2 ? 78 : 90, a = (k / 40) * Math.PI * 2; ctx.lineTo(sx + r * Math.cos(a), sy + r * Math.sin(a)); }
    ctx.fill();
    ctx.fillStyle = "#0b1220"; ctx.beginPath(); ctx.arc(sx, sy, 64, 0, 7); ctx.fill();
    ctx.fillStyle = "#f5b83d"; ctx.font = "700 44px system-ui"; ctx.fillText("⚡", sx, sy + 4);
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
        document.getElementById("cdl").onclick = () => {
          const a = document.createElement("a");
          a.download = `OpenCircuit-Certificate-${id}.png`;
          a.href = document.getElementById("cert").toDataURL("image/png");
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
    const colors = ["#38bdf8", "#f5b83d", "#22c55e", "#a78bfa", "#f472b6"];
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

  function circuitBg() {
    let s = `<svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">`;
    const rnd = (() => { let x = 7; return () => (x = (x * 16807) % 2147483647) / 2147483647; })();
    for (let i = 0; i < 28; i++) {
      const x = rnd() * 1200, y = rnd() * 600, dx = 60 + rnd() * 160, dy = (rnd() - 0.5) * 120;
      s += `<path class="trace" style="animation-delay:${(rnd() * 6).toFixed(2)}s" d="M${x} ${y} h${dx} l${Math.abs(dy) / 2} ${dy} h${dx / 2}"/><circle class="pad" cx="${x + dx * 1.5 + Math.abs(dy) / 2}" cy="${y + dy}" r="4"/>`;
    }
    return s + "</svg>";
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

    if (!parts.length) html = home();
    else if (parts[0] === "learn" && !parts[1]) { html = curriculum(); title = "Learning path"; }
    else if (parts[0] === "learn" && mod(parts[1]) && !parts[2]) { const m = mod(parts[1]); html = moduleOverview(m); title = m.title; }
    else if (parts[0] === "learn" && mod(parts[1])) {
      const m = mod(parts[1]), l = m.lessons.find((x) => x.id === parts[2]);
      if (l) { html = lesson(m, l); title = l.title; } else html = notFound();
    }
    else if (parts[0] === "quiz" && mod(parts[1])) { const m = mod(parts[1]); html = quiz(m); after = () => wireQuiz(m); title = "Quiz: " + m.title; }
    else if (parts[0] === "projects" && !parts[1]) { html = projects(); title = "Projects"; }
    else if (parts[0] === "projects") { const p = PROJECTS.find((x) => x.id === parts[1]); html = p ? project(p) : notFound(); if (p) title = p.title; }
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

  document.getElementById("reset").addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Reset all your progress, quiz scores and certificate name on this device?")) {
      state = { lessons: {}, quiz: {}, name: "" }; save(); render();
    }
  });

  window.addEventListener("hashchange", render);
  updateHeader();
  render();
})();
