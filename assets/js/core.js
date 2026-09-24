/* Core helpers shared by every content file.
   Content files call these to build lesson HTML without repeating markup. */
window.COURSE = [];

window.H = {
  esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  },

  // Code block with a copy button. `lang` is only a label.
  code(src, lang = "cpp") {
    const trimmed = src.replace(/^\n+|\s+$/g, "");
    return `<div class="code"><div class="code-head"><span>${lang}</span><button class="copy" type="button">Copy</button></div><pre><code>${H.esc(trimmed)}</code></pre></div>`;
  },

  // Everyday comparison that makes an idea click.
  analogy(html) {
    return `<aside class="callout analogy"><div class="callout-title"><span class="ico">💡</span>Think of it like this</div>${html}</aside>`;
  },

  // The one thing to remember.
  key(html) {
    return `<aside class="callout key"><div class="callout-title"><span class="ico">🎯</span>Remember this</div>${html}</aside>`;
  },

  // A beginner trap.
  mistake(html) {
    return `<aside class="callout mistake"><div class="callout-title"><span class="ico">⚠️</span>Common beginner mistake</div>${html}</aside>`;
  },

  // Link to the GATE ECE syllabus for students preparing for it.
  gate(html) {
    return `<aside class="callout gate"><div class="callout-title"><span class="ico">🎓</span>GATE corner</div>${html}</aside>`;
  },

  // Fun fact to keep curiosity going.
  fact(html) {
    return `<aside class="callout fact"><div class="callout-title"><span class="ico">✨</span>Did you know?</div>${html}</aside>`;
  },

  // Placeholder that widgets.js turns into an interactive simulator.
  widget(name, title) {
    return `<section class="lab"><div class="lab-head"><span class="lab-badge">Try it</span><h3>${title}</h3></div><div class="widget" data-widget="${name}"></div></section>`;
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
