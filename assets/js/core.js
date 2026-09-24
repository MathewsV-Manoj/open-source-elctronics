/* Core helpers shared by every content file.
   Content files call these to build lesson HTML without repeating markup. */
window.COURSE = [];

const KW = {
  c: new Set("#include #define void int float long bool char const unsigned return if else for while do break true false HIGH LOW INPUT OUTPUT INPUT_PULLUP static volatile String int16_t uint8_t nullptr auto".split(" ")),
  py: new Set("from import def return if else elif while for in True False None try except with as and or not break class lambda".split(" ")),
  v: new Set("module endmodule input output wire reg assign always begin end if else posedge negedge initial".split(" ")),
};

window.H = {
  esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  },

  // Code block with a copy button and light syntax colouring.
  code(src, lang = "cpp") {
    const trimmed = src.replace(/^\n+|\s+$/g, "");
    return `<div class="code"><div class="code-head"><span>${lang}</span><button class="copy" type="button">Copy</button></div><pre><code>${H.highlight(trimmed, lang)}</code></pre></div>`;
  },

  // Tokenise the raw source and wrap comments, strings, numbers and keywords.
  highlight(src, lang) {
    const py = lang === "python" || lang === "micropython";
    const kw = py ? KW.py : lang === "verilog" ? KW.v : KW.c;
    const comment = py ? "#[^\\n]*" : "\\/\\/[^\\n]*";
    const re = new RegExp(`(${comment})|("""[\\s\\S]*?"""|"(?:\\\\.|[^"\\\\\\n])*"|'(?:\\\\.|[^'\\\\\\n])*')|(\\b\\d+(?:\\.\\d+)?\\b)|(#?[A-Za-z_]\\w*)`, "g");
    let out = "", last = 0, m;
    while ((m = re.exec(src))) {
      out += H.esc(src.slice(last, m.index));
      const t = H.esc(m[0]);
      if (m[1]) out += `<span class="c-com">${t}</span>`;
      else if (m[2]) out += `<span class="c-str">${t}</span>`;
      else if (m[3]) out += `<span class="c-num">${t}</span>`;
      else out += kw.has(m[0]) ? `<span class="c-kw">${t}</span>` : t;
      last = re.lastIndex;
    }
    return out + H.esc(src.slice(last));
  },

  // Everyday comparison that makes an idea click.
  analogy(html) {
    return `<aside class="callout analogy"><div class="callout-title"><span class="lbl">Analogy</span>Think of it like this</div>${html}</aside>`;
  },

  // The one thing to remember.
  key(html) {
    return `<aside class="callout key"><div class="callout-title"><span class="lbl">Key idea</span>Remember this</div>${html}</aside>`;
  },

  // A beginner trap.
  mistake(html) {
    return `<aside class="callout mistake"><div class="callout-title"><span class="lbl">Watch out</span>Common beginner mistake</div>${html}</aside>`;
  },

  // Link to the GATE ECE syllabus for students preparing for it.
  gate(html) {
    return `<aside class="callout gate"><div class="callout-title"><span class="lbl">GATE</span>Exam corner</div>${html}</aside>`;
  },

  // Fun fact to keep curiosity going.
  fact(html) {
    return `<aside class="callout fact"><div class="callout-title"><span class="lbl">Fact</span>Did you know?</div>${html}</aside>`;
  },

  // Placeholder that widgets.js turns into an interactive simulator.
  widget(name, title) {
    return `<section class="lab"><div class="lab-head"><span class="lab-badge">Live lab</span><h3>${title}</h3></div><div class="widget" data-widget="${name}"></div></section>`;
  },

  // Small formula display.
  formula(html, caption = "") {
    return `<div class="formula"><div class="formula-main">${html}</div>${caption ? `<div class="formula-cap">${caption}</div>` : ""}</div>`;
  },

  // Numbered step list.
  steps(items) {
    return `<ol class="steps">${items.map((s) => `<li>${s}</li>`).join("")}</ol>`;
  },

  table(head, rows) {
    return `<div class="table-wrap"><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
      .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
      .join("")}</tbody></table></div>`;
  },
};
