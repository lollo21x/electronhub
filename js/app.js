import {
  AUFBAU_ORDER,
  BLOCK_LABEL,
  BY_Z,
  CATEGORY_LABEL,
  DEMO_MOLECULES,
  ELEMENTS,
  GLOSSARY,
  GROUPS,
  LEWIS_SPECIES,
  LESSONS,
  PHASE_LABEL,
  SHELL_NAMES,
  TEACHING_Z,
  allBoxes,
  buildQuiz,
  differentiatingElectron,
  fillAufbau,
  formatCondensed,
  formatFull,
  getElement,
  ionOccupancy,
  lName,
  msLabel,
  neighbors,
  occupancyTotal,
  orbitalCapacity,
  orbitalL,
  orbitalN,
  searchElements,
  splitCoreValence,
  tablePosition,
} from "./chemistry.js";

const CATS = Object.keys(CATEGORY_LABEL);
const DIAGRAM = [
  { n: 1, orbs: ["1s"] },
  { n: 2, orbs: ["2s", "2p"] },
  { n: 3, orbs: ["3s", "3p", "3d"] },
  { n: 4, orbs: ["4s", "4p", "4d", "4f"] },
  { n: 5, orbs: ["5s", "5p", "5d", "5f"] },
  { n: 6, orbs: ["6s", "6p", "6d"] },
  { n: 7, orbs: ["7s", "7p"] },
];
const HEAT_GET = {
  en: (el) => el.electronegativity,
  ie: (el) => el.ionization,
  radius: (el) => el.radius,
  density: (el) => el.density,
};
const TRENDS = [
  { id: "en", title: "Elettronegatività", body: "Cresce verso F. I gas nobili sono esclusi o deboli. Misura l’attrazione degli elettroni di legame (Pauling)." },
  { id: "ie", title: "Energia di ionizzazione", body: "Massima in alto a destra. Cala scendendo nel gruppo perché l’elettrone è più lontano e schermato." },
  { id: "radius", title: "Raggio atomico", body: "Cala lungo il periodo (Zeff) e cresce nel gruppo (n). La contrazione lantanoide comprime Hf e i 5d." },
  { id: "density", title: "Densità", body: "Picco intorno a Os e Ir. I gas sono rarefatti; i metalli del blocco d sono i più compatti." },
];
const ION_PAIRS = [
  { metal: "Na", nonmetal: "Cl", give: 1, take: 1, salt: "NaCl", story: "Il sodio ha 1 e⁻ di valenza, il cloro 7. Trasferimento 1:1." },
  { metal: "Mg", nonmetal: "O", give: 2, take: 2, salt: "MgO", story: "Il magnesio cede 2 e⁻ all’ossigeno: entrambi chiudono l’ottetto." },
  { metal: "Al", nonmetal: "F", give: 3, take: 1, salt: "AlF₃", story: "Tre fluoro per un alluminio: 3 e⁻ ceduti, tre F⁻." },
  { metal: "Ca", nonmetal: "Cl", give: 2, take: 1, salt: "CaCl₂", story: "Calcio 2+, due cloruri: formula CaCl₂." },
];
const RECAP = [
  ["Atomo", "Unità base: nucleo (p⁺, n) + elettroni"],
  ["Elettroni di valenza", "Ultimo livello, protagonisti dei legami"],
  ["Regola dell’ottetto", "8 elettroni esterni (2 se c’è un solo guscio)"],
  ["Ione", "Atomo che ha perso (catione, +) o guadagnato (anione, −) e⁻"],
  ["Molecola", "Atomi legati da covalenti, unità neutra"],
  ["Legame ionico", "Trasferimento, metallo + non metallo, reticolo"],
  ["Legame covalente", "Condivisione tra non metalli (puro / polare / dativo)"],
  ["Forze intermolecolari", "London, dipolo–dipolo, idrogeno"],
  ["Orbitale", "Casella quantistica, max 2 e⁻, forma s/p/d/f"],
  ["Risonanza", "Ibrido di più Lewis: cariche e doppi delocalizzati"],
];
const OCTET_ATOMS = ["H", "He", "C", "N", "O", "F", "Ne", "Na", "Mg", "Cl", "Ar", "K"];
const NAV = [
  { id: "tavola", href: "#/", label: "Tavola", short: "Tavola", icon: "grid" },
  { id: "atomo", href: "#/atomo", label: "Atomo", short: "Atomo", icon: "orbit" },
  { id: "lab", href: "#/lab", label: "Laboratorio", short: "Lab", icon: "beaker" },
  { id: "studio", href: "#/studio", label: "Studio", short: "Studio", icon: "book" },
];
const ICONS = {
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
  orbit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>',
  beaker: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12M9 3v4.2L4.8 18.4A2 2 0 0 0 6.6 21h10.8a2 2 0 0 0 1.8-2.6L15 7.2V3"/><path d="M8.5 14h7"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
};

const state = {
  view: "tavola",
  symbol: "Fe",
  cat: "all",
  heat: "none",
  list: false,
  query: "",
  aufbauZ: 26,
  playing: false,
  focusOrb: null,
  lesson: "atomo",
  studio: "tendenze",
  ionCharge: 0,
  lewisForm: { no3: 0, no2: 0, no2rad: 0 },
  quiz: null,
  compareA: "F",
  compareB: "Cl",
  glossQ: "",
  anatomy: "O",
  anatomyFocus: "nucleus",
  octet: "O",
  ionPair: 0,
  ionMoved: false,
  mol: "h2o",
  covKind: "puro",
  forceKind: "london",
  trendHeat: "en",
  installHide: localStorage.getItem("electronhub-install-dismissed") === "1",
  deferredPrompt: null,
  ios: false,
  standalone: false,
};

let playTimer = 0;
let root = null;

function esc(v) {
  const amp = String.fromCharCode(38);
  return String(v ?? "")
    .replace(/&/g, amp + "amp;")
    .replace(/</g, amp + "lt;")
    .replace(/>/g, amp + "gt;")
    .replace(/"/g, amp + "quot;");
}

function chip(active, action, label, extra = "") {
  return `<button type="button" class="chip${active ? " is-on" : ""}" data-act="${esc(action)}" ${extra}>${label}</button>`;
}

function badge(text) {
  return `<span class="badge">${esc(text)}</span>`;
}

function arrow(dir) {
  return dir === "up"
    ? '<svg viewBox="0 0 12 14" class="arr"><path d="M6 1 L6 13 M6 1 L2.5 5.2 M6 1 L9.5 5.2"/></svg>'
    : '<svg viewBox="0 0 12 14" class="arr"><path d="M6 13 L6 1 M6 13 L2.5 8.8 M6 13 L9.5 8.8"/></svg>';
}

function boxesHtml(occ, highlight) {
  const set = highlight instanceof Set ? highlight : null;
  return `<div class="obox-wrap">${allBoxes(occ)
    .map((sh) => {
      const dim = set && !set.has(sh.orbital) ? " is-dim" : "";
      const cells = sh.boxes
        .map(
          (box) =>
            `<span class="obox">${box.up ? `<span class="arr-up">${arrow("up")}</span>` : "<span class='arr-gap'></span>"}${
              box.down ? `<span class="arr-dn">${arrow("down")}</span>` : "<span class='arr-gap'></span>"
            }</span>`,
        )
        .join("");
      return `<div class="obox-group${dim}"><p class="obox-lab">${esc(sh.orbital)}<sup>${sh.electrons}</sup></p><div class="obox-row">${cells}</div></div>`;
    })
    .join("")}</div>`;
}

function bohrSvg(el, size = 280) {
  const shells = el.shells;
  const maxShells = Math.max(shells.length, 1);
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2 - 14;
  const gap = maxR / (maxShells + 0.6);
  const rings = shells
    .map((count, i) => {
      const r = gap * (i + 1.15);
      const duration = 10 + i * 4;
      const electrons = Math.min(count, 24);
      const dots = Array.from({ length: electrons }, (_, k) => {
        const angle = (k / electrons) * Math.PI * 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        const rad = i === shells.length - 1 ? 3.2 : 2.6;
        const fill = i === shells.length - 1 ? "var(--color-valence)" : "var(--color-electron)";
        return `<circle cx="${x}" cy="${y}" r="${rad}" fill="${fill}"/>`;
      }).join("");
      const extra =
        count > electrons
          ? `<text x="${cx + r + 6}" y="${cy - 4}" fill="var(--color-muted)" font-size="9" font-family="var(--font-mono)">+${count - electrons}</text>`
          : "";
      const spin = i % 2 === 0 ? "orbit-spin" : "orbit-spin-rev";
      return `<g><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--color-border-strong)" stroke-width="1"/><g class="${spin}" style="animation-duration:${duration}s;transform-origin:${cx}px ${cy}px">${dots}</g>${extra}</g>`;
    })
    .join("");
  const nr = Math.max(14, gap * 0.42);
  const fs = el.symbol.length > 2 ? 11 : 14;
  return `<div class="bohr"><svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Modello di Bohr di ${esc(el.name)}"><circle cx="${cx}" cy="${cy}" r="${size / 2 - 2}" fill="var(--color-elevated)"/>${rings}<circle cx="${cx}" cy="${cy}" r="${nr}" fill="var(--color-accent-fg)"/><circle cx="${cx}" cy="${cy}" r="${nr}" fill="none" stroke="var(--color-accent)" stroke-width="1.5"/><text x="${cx}" y="${cy + 1}" text-anchor="middle" dominant-baseline="middle" fill="var(--color-fg)" font-size="${fs}" font-family="var(--font-sans)" font-weight="500">${esc(el.symbol)}</text></svg><ul class="shell-pills">${shells
    .map((c, i) => `<li><span>${SHELL_NAMES[i]}</span> ${c}</li>`)
    .join("")}</ul></div>`;
}

function heatRange(mode) {
  if (mode === "none") return null;
  const vals = ELEMENTS.map(HEAT_GET[mode]).filter((v) => v != null && v > 0);
  return { min: Math.min(...vals), max: Math.max(...vals) };
}

function heatMix(el, mode, range) {
  if (mode === "none" || !range) return "";
  const v = HEAT_GET[mode](el);
  if (v == null) return "background:color-mix(in oklab, var(--color-elevated) 80%, transparent)";
  const t = (v - range.min) / (range.max - range.min || 1);
  const pct = Math.round(18 + t * 72);
  return `background:color-mix(in oklab, var(--color-electron) ${pct}%, var(--color-elevated))`;
}

function tableHtml(selected, filter, heat, onPickAttr = "pick") {
  const byPos = new Map();
  for (const el of ELEMENTS) {
    const { col, row } = tablePosition(el);
    byPos.set(`${col}-${row}`, el);
  }
  const range = heatRange(heat);
  const cell = (el) => {
    if (!el) return "<div></div>";
    const dim = filter && filter !== "all" && el.category !== filter ? " is-dim" : "";
    const on = selected === el.symbol ? " is-on" : "";
    const bg = heatMix(el, heat, range);
    const cat = heat === "none" ? ` cat-${el.category}` : "";
    return `<button type="button" class="pcell${cat}${dim}${on}" style="${bg}" data-act="${onPickAttr}" data-sym="${el.symbol}" title="${esc(el.name)} · ${el.symbol} · Z ${el.z}" aria-label="${esc(el.name)}, numero ${el.z}"><span class="pz">${el.z}</span><span class="ps">${esc(el.symbol)}</span></button>`;
  };
  const periodRow = (period) => {
    const cells = GROUPS.map((g) => {
      if ((period === 6 && g === 3) || (period === 7 && g === 3)) {
        return `<div class="pstar">${period === 6 ? "*" : "**"}</div>`;
      }
      return cell(byPos.get(`${g}-${period}`));
    }).join("");
    return `<div class="plab">${period}</div>${cells}`;
  };
  const fRow = (row, label) => {
    const cells = GROUPS.map((g) => {
      if (g < 3) return "<div></div>";
      return cell(byPos.get(`${g}-${row}`));
    }).join("");
    return `<div class="plab">${label}</div>${cells}`;
  };
  return `<div class="table-scroll"><div class="ptable"><div></div>${GROUPS.map((g) => `<div class="plab">${g}</div>`).join("")}${[1, 2, 3, 4, 5, 6, 7].map(periodRow).join("")}<div class="pgap"></div>${fRow(9, "*")}${fRow(10, "**")}</div></div>`;
}

function legendHtml(active) {
  return `<div class="legend">${chip(active === "all", "cat:all", "Tutti")}${CATS.map(
    (c) =>
      `<button type="button" class="chip${active === c ? " is-on" : ""}" data-act="cat:${c}"><span class="dot cat-${c}"></span>${esc(CATEGORY_LABEL[c])}</button>`,
  ).join("")}</div>`;
}

function lewisSvg(form) {
  const byId = Object.fromEntries(form.atoms.map((a) => [a.id, a]));
  const slots = [
    { dx: 0, dy: -22, ax: 1, ay: 0 },
    { dx: 22, dy: 0, ax: 0, ay: 1 },
    { dx: 0, dy: 22, ax: 1, ay: 0 },
    { dx: -22, dy: 0, ax: 0, ay: 1 },
  ];
  const bonds = form.bonds
    .map((b) => {
      const a = byId[b.a];
      const c = byId[b.b];
      if (!a || !c) return "";
      const dx = c.x - a.x;
      const dy = c.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len;
      const uy = dy / len;
      const px = -uy;
      const py = ux;
      const start = 28;
      const end = len - 28;
      const lines = b.order === 1 ? [0] : b.order === 2 ? [-4, 4] : [-7, 0, 7];
      return lines
        .map(
          (off) =>
            `<line x1="${a.x + ux * start + px * off}" y1="${a.y + uy * start + py * off}" x2="${a.x + ux * end + px * off}" y2="${a.y + uy * end + py * off}" stroke="var(--color-valence)" stroke-width="2.2" stroke-linecap="round"/>`,
        )
        .join("");
    })
    .join("");
  const atoms = form.atoms
    .map((atom) => {
      const pairs = Array.from({ length: atom.lone }, (_, i) => {
        const p = slots[i % 4];
        return `<circle cx="${p.dx - 3.2 * (p.ax || 1)}" cy="${p.dy - 3.2 * (p.ay || 0)}" r="2.4" fill="var(--color-electron)"/><circle cx="${p.dx + 3.2 * (p.ax || 1)}" cy="${p.dy + 3.2 * (p.ay || 0)}" r="2.4" fill="var(--color-electron)"/>`;
      }).join("");
      const unpaired = atom.unpaired
        ? Array.from({ length: atom.unpaired }, (_, i) => `<circle cx="-22" cy="${-8 + i * 10}" r="2.6" fill="var(--color-warn)"/>`).join("")
        : "";
      const charge = atom.charge
        ? `<text x="18" y="-16" text-anchor="middle" fill="var(--color-warn)" font-size="11" font-family="var(--font-mono)">${atom.charge > 0 ? `+${atom.charge}` : atom.charge}</text>`
        : "";
      return `<g transform="translate(${atom.x} ${atom.y})"><circle r="22" fill="var(--color-elevated)" stroke="var(--color-border-strong)"/><text text-anchor="middle" dominant-baseline="central" fill="var(--color-fg)" font-size="16" font-family="var(--font-display)">${esc(atom.symbol)}</text>${pairs}${unpaired}${charge}</g>`;
    })
    .join("");
  return `<svg viewBox="0 0 320 260" class="lewis-svg" role="img" aria-label="${esc(form.label)}">${bonds}${atoms}</svg>`;
}

function parseRoute() {
  const hash = (location.hash || "").replace(/^#\/?/, "");
  const parts = hash.split("/").filter(Boolean);
  const path = location.pathname.replace(/\/$/, "") || "/";
  if (path.startsWith("/elemento/")) {
    return { view: "elemento", symbol: path.split("/")[2] };
  }
  const aliases = {
    "/aufbau": { view: "atomo" },
    "/basi": { view: "lab" },
    "/lewis": { view: "lab", lesson: "lewis" },
    "/studio": { view: "studio" },
    "/tendenze": { view: "studio", studio: "tendenze" },
    "/confronta": { view: "studio", studio: "confronta" },
    "/quiz": { view: "studio", studio: "quiz" },
    "/glossario": { view: "studio", studio: "glossario" },
  };
  if (!parts.length && aliases[path]) return aliases[path];
  if (!parts.length) return { view: "tavola" };
  const a = parts[0];
  if (a === "atomo" || a === "aufbau") return { view: "atomo" };
  if (a === "lab" || a === "basi") return { view: "lab", lesson: parts[1] };
  if (a === "studio") return { view: "studio", studio: parts[1] };
  if (a === "elemento" && parts[1]) return { view: "elemento", symbol: parts[1] };
  if (["quiz", "glossario", "confronta", "tendenze"].includes(a)) return { view: "studio", studio: a };
  return { view: "tavola" };
}

function applyRoute(route) {
  state.view = route.view || "tavola";
  if (route.symbol) state.symbol = route.symbol;
  if (route.lesson && LESSONS.some((l) => l.id === route.lesson)) state.lesson = route.lesson;
  if (route.studio && ["tendenze", "confronta", "quiz", "glossario"].includes(route.studio)) {
    state.studio = route.studio;
  }
}

function go(hash) {
  const next = hash.startsWith("#") ? hash : `#/${hash}`.replace("#//", "#/");
  if (location.hash === next) {
    applyRoute(parseRoute());
    render();
    return;
  }
  location.hash = next.replace(/^#/, "");
  if (!location.hash) location.hash = "#/";
}

function currentNav() {
  if (state.view === "elemento") return "tavola";
  return state.view;
}

function installHtml() {
  if (state.installHide || state.standalone) return "";
  if (!state.deferredPrompt && !state.ios) return "";
  const cta = state.deferredPrompt
    ? `<button type="button" class="btn btn-ghost" data-act="install">Installa</button>`
    : `<p class="install-hint">Su iPhone: Condividi → Aggiungi a Home</p>`;
  return `<div class="install-row">${cta}<button type="button" class="txt-btn" data-act="hide-install">Nascondi</button></div>`;
}

function shell(inner) {
  const nav = currentNav();
  return `
    <a class="skip" href="#contenuto">Salta al contenuto</a>
    <header class="topbar">
      <div class="topbar-inner">
        <a class="brand" href="#/" data-act="go" data-hash="/">
          <p class="brand-name">ElectronHub</p>
          <p class="brand-sub">Hub chimico</p>
        </a>
        <nav class="topnav" aria-label="Sezioni">
          ${NAV.map(
            (n) =>
              `<a class="topnav-link${nav === n.id ? " is-on" : ""}" href="${n.href}" data-act="go" data-hash="${n.href}">${ICONS[n.icon]} ${esc(n.label)}</a>`,
          ).join("")}
        </nav>
        ${installHtml()}
      </div>
    </header>
    <main id="contenuto" class="main">${inner}</main>
    <nav class="eh-dock" aria-label="Navigazione principale">
      <ul class="eh-dock-bar">
        ${NAV.map(
          (n) =>
            `<li><a class="eh-dock-item${nav === n.id ? " is-active" : ""}" href="${n.href}" data-act="go" data-hash="${n.href}" ${nav === n.id ? 'aria-current="page"' : ""}>${ICONS[n.icon]}<span class="eh-dock-label">${esc(n.short)}</span></a></li>`,
        ).join("")}
      </ul>
    </nav>`;
}

function viewTavola() {
  const el = getElement(state.symbol) ?? ELEMENTS[25];
  const layers = splitCoreValence(el.occupancy, el.block);
  const results = state.query ? searchElements(state.query) : null;
  const heatBtns = [
    ["none", "Famiglie"],
    ["en", "Elettroneg."],
    ["ie", "Ionizzazione"],
    ["radius", "Raggio"],
    ["density", "Densità"],
  ]
    .map(([m, l]) => chip(state.heat === m, `heat:${m}`, l))
    .join("");
  const body = results
    ? results.length
      ? `<ul class="search-list">${results
          .map(
            (e) =>
              `<li><button type="button" class="search-row" data-act="pick" data-sym="${e.symbol}"><span class="ps">${esc(e.symbol)}</span><span><b>${esc(e.name)}</b><small>Z ${e.z}</small></span></button></li>`,
          )
          .join("")}</ul>`
      : `<p class="muted">Nessun elemento corrisponde alla ricerca.</p>`
    : state.list
      ? `<ul class="search-list">${ELEMENTS.map(
          (e) =>
            `<li><button type="button" class="search-row" data-act="pick" data-sym="${e.symbol}"><span class="ps">${esc(e.symbol)}</span><span><b>${esc(e.name)}</b><small>Z ${e.z}</small></span></button></li>`,
        ).join("")}</ul>`
      : `<p class="scroll-hint">Scorri la tavola in orizzontale.</p>${tableHtml(el.symbol, state.cat, state.heat)}`;
  return `<div class="stagger page">
    <header class="page-head">
      <div>
        <p class="kicker">Tavola periodica</p>
        <h1>Hub chimico</h1>
        <p class="lede">Tocca un elemento per leggere spin, core, valenza e configurazione. La mappa Aufbau è in Atomo.</p>
      </div>
      <label class="search">
        <span class="sr">Cerca elemento</span>
        <input type="search" value="${esc(state.query)}" data-act="query" placeholder="Cerca nome, simbolo o Z" aria-label="Cerca elemento"/>
      </label>
    </header>
    <div class="toolbar">${legendHtml(state.cat)}<div class="heat-row">${heatBtns}${chip(state.list, "toggle-list", state.list ? "Griglia" : "Lista", 'data-mobile="1"')}</div></div>
    ${body}
    <section class="peek">
      ${bohrSvg(el, 260)}
      <div>
        <div class="peek-meta"><span class="mono subtle">${el.z}</span> ${badge(CATEGORY_LABEL[el.category])}${el.exception ? badge("Eccezione Aufbau") : ""}</div>
        <h2>${esc(el.symbol)} <span class="muted">${esc(el.name)}</span></h2>
        <p class="mono cfg">${esc(formatCondensed(el.occupancy, el.z))}</p>
        <p class="muted">Core ${layers.coreCount} · valenza ${layers.valenceCount} · ${layers.unpaired} spaiati · ${layers.magnetic}</p>
        <a class="btn" href="#/elemento/${el.symbol}" data-act="go" data-hash="/elemento/${el.symbol}">Scheda completa</a>
      </div>
    </section>
  </div>`;
}

function configPanel(el) {
  const condensed = formatCondensed(el.occupancy, el.z);
  const full = formatFull(el.occupancy);
  const layers = splitCoreValence(el.occupancy, el.block);
  const qn = differentiatingElectron(el.occupancy);
  const valenceKeys = new Set(Object.keys(layers.valence));
  return `<div class="stack">
    <div>
      <p class="kicker">Configurazione</p>
      <p class="mono cfg-lg">${esc(condensed)}</p>
      <p class="mono cfg-sm">${esc(full)}</p>
      ${el.exception ? badge("Eccezione all’Aufbau") : ""}
    </div>
    <div class="stats">
      <div class="stat"><p class="kicker">Core</p><p class="stat-v">${layers.coreCount}</p><p class="muted">elettroni interni</p></div>
      <div class="stat"><p class="kicker">Valenza</p><p class="stat-v">${layers.valenceCount}</p><p class="muted">elettroni esterni</p></div>
      <div class="stat"><p class="kicker">Spaiati</p><p class="stat-v">${layers.unpaired}</p><p class="muted">${layers.magnetic}</p></div>
      <div class="stat"><p class="kicker">Blocco</p><p class="stat-v">${esc(el.block)}</p><p class="muted">periodo ${el.period}</p></div>
    </div>
    <div>
      <p class="kicker">Spin · Hund</p>
      ${boxesHtml(el.occupancy, valenceKeys)}
      <p class="muted tiny">Frecce chiare: valenza. Hund: prima spin paralleli, poi accoppiamento.</p>
    </div>
    ${
      qn
        ? `<div><p class="kicker">Elettrone differenziante</p><div class="qn">${[
            ["n", qn.n],
            ["ℓ", `${qn.l} (${lName(qn.l)})`],
            ["mℓ", qn.ml],
            ["ms", msLabel(qn.ms)],
            ["orb.", qn.orbital],
          ]
            .map(([k, v]) => `<div class="qn-cell"><p class="mono subtle">${esc(k)}</p><p class="mono">${esc(v)}</p></div>`)
            .join("")}</div></div>`
        : ""
    }
    <div class="note">
      <p class="kicker">Gusci</p>
      <p class="mono">${el.shells.join(" · ")}</p>
      <p class="muted tiny">Valenza condensata: ${esc(formatFull(layers.valence) || "—")}. Core: ${esc(formatFull(layers.core) || "nessuno")}.</p>
    </div>
  </div>`;
}

function ionPanel(el) {
  const maxPlus = Math.min(8, el.z);
  const maxMinus = Math.min(3, 118 - el.z);
  const charge = Math.max(-maxMinus, Math.min(maxPlus, state.ionCharge));
  const occ = ionOccupancy(el.occupancy, charge);
  const electrons = occupancyTotal(occ);
  const layers = splitCoreValence(occ, el.block);
  const label = charge === 0 ? el.symbol : charge > 0 ? `${el.symbol}${charge === 1 ? "" : charge}⁺` : `${el.symbol}${-charge === 1 ? "" : -charge}⁻`;
  return `<section class="card">
    <div class="row-between">
      <div>
        <p class="kicker">Ione</p>
        <p class="display">${esc(label)}</p>
        <p class="muted tiny">${electrons} e⁻ · carica ${charge > 0 ? `+${charge}` : charge}</p>
      </div>
      <div class="icon-btns">
        <button type="button" class="btn btn-ghost icon" data-act="ion:-1" aria-label="Riduci carica">−</button>
        <button type="button" class="btn btn-ghost icon" data-act="ion:+1" aria-label="Aumenta carica">+</button>
      </div>
    </div>
    <p class="mono cfg">${esc(formatCondensed(occ, el.z))}</p>
    <p class="muted tiny">Valenza ${layers.valenceCount} · core ${layers.coreCount} · spaiati ${layers.unpaired} (${layers.magnetic})</p>
    <div class="mt">${boxesHtml(occ)}</div>
    <p class="muted tiny mt">I cationi dei metalli d perdono prima gli ns. Gli anioni riempiono secondo Aufbau.</p>
  </section>`;
}

function viewElemento() {
  const el = getElement(state.symbol);
  if (!el) {
    return `<div class="page center"><h1>Elemento non trovato</h1><p class="muted">Nessun atomo corrisponde a «${esc(state.symbol)}».</p><a href="#/" data-act="go" data-hash="/">Torna alla tavola</a></div>`;
  }
  const { prev, next } = neighbors(el);
  const props = [
    ["Massa atomica", `${el.mass} u`],
    ["Elettronegatività", el.electronegativity?.toFixed(2) ?? "—"],
    ["1ª ionizzazione", el.ionization ? `${el.ionization} kJ/mol` : "—"],
    ["Raggio covalente", el.radius ? `${el.radius} pm` : "—"],
    ["Affinità e⁻", el.affinity != null ? `${el.affinity} kJ/mol` : "—"],
    ["Fusione", el.melting != null ? `${el.melting} K` : "—"],
    ["Ebollizione", el.boiling != null ? `${el.boiling} K` : "—"],
    ["Densità", el.density != null ? `${el.density} g/cm³` : "—"],
    ["Stati di ossidazione", el.oxidation],
    ["Gusci", el.shells.join(" / ")],
  ];
  return `<div class="stagger page">
    <div class="row-between wrap">
      <a class="txt-btn" href="#/" data-act="go" data-hash="/">← Tavola</a>
      <div class="row gap">
        ${prev ? `<a class="btn btn-ghost sm" href="#/elemento/${prev.symbol}" data-act="go" data-hash="/elemento/${prev.symbol}">‹ ${prev.symbol}</a>` : ""}
        ${next ? `<a class="btn btn-ghost sm" href="#/elemento/${next.symbol}" data-act="go" data-hash="/elemento/${next.symbol}">${next.symbol} ›</a>` : ""}
      </div>
    </div>
    <header class="page-head">
      <div>
        <p class="mono subtle">Z ${el.z}</p>
        <h1>${esc(el.symbol)}</h1>
        <p class="lede">${esc(el.name)}</p>
        <div class="badges">${badge(CATEGORY_LABEL[el.category])}${badge(BLOCK_LABEL[el.block])}${badge(PHASE_LABEL[el.phase])}${el.group ? badge(`Gruppo ${el.group}`) : ""}${badge(`Periodo ${el.period}`)}</div>
      </div>
      <p class="mono muted">${el.mass} u${el.year ? ` · ${el.year}` : " · noto dall’antichità"}</p>
    </header>
    <div class="split">
      <div class="card">${bohrSvg(el, 300)}</div>
      <div class="card">${configPanel(el)}</div>
    </div>
    ${ionPanel(el)}
    <section class="card">
      <p class="kicker">Proprietà</p>
      <div class="props">${props.map(([k, v]) => `<div class="prop"><p class="kicker">${esc(k)}</p><p>${esc(v)}</p></div>`).join("")}</div>
    </section>
  </div>`;
}

function viewAtomo() {
  const z = state.aufbauZ;
  const element = BY_Z.get(z) ?? ELEMENTS[0];
  const occ = element.occupancy;
  const predicted = fillAufbau(z);
  const firstAt = (orbital) => ELEMENTS.find((el) => (el.occupancy[orbital] ?? 0) > 0);
  return `<div class="stagger page">
    <header class="page-head">
      <div>
        <p class="kicker">Mappa isolata</p>
        <h1>Configurazione elettronica</h1>
        <p class="lede">L’ordine Madelung, i tre principi (Aufbau, Pauli, Hund) e il riempimento dal protio all’oganesson. Trascina Z o avvia l’animazione.</p>
      </div>
    </header>
    <div class="split-aufbau">
      <div class="card">
        <div class="row-between wrap">
          <div>
            <p class="kicker">Mappa Aufbau</p>
            <h2>Ordine di riempimento</h2>
          </div>
          <button type="button" class="btn btn-ghost sm" data-act="play">${state.playing ? "Pausa" : "Riempi 1–118"}</button>
        </div>
        <label class="range">
          <span>Z = <b class="mono">${z}</b> · ${esc(element.name)} <span class="mono">${esc(element.symbol)}</span></span>
          <input type="range" min="1" max="118" value="${z}" data-act="z" aria-label="Numero atomico"/>
        </label>
        <div class="aufbau-map">${DIAGRAM.map((row) => {
          const orbs = row.orbs
            .map((id) => {
              const filled = occ[id] ?? 0;
              const cap = orbitalCapacity(id);
              const pred = predicted[id] ?? 0;
              const mismatch = filled !== pred;
              const active = state.focusOrb === id ? " is-on" : "";
              const pct = (filled / cap) * 100;
              return `<button type="button" class="orb${filled > 0 ? " is-fill" : ""}${active}" data-act="orb:${id}"><span class="orb-bar" style="width:${pct}%"></span><span class="orb-txt mono">${id} <small>${filled}/${cap}</small>${mismatch ? " <em>≠</em>" : ""}</span></button>`;
            })
            .join("");
          return `<div class="aufbau-row"><span class="plab">n=${row.n}</span><div class="orb-row">${orbs}</div></div>`;
        }).join("")}</div>
        <p class="mono cfg mt">${esc(formatCondensed(occ, z))}</p>
        <p class="tiny ${element.exception ? "warn" : "muted"}">${
          element.exception
            ? "Eccezione: la configurazione reale differisce dall’ordine Madelung puro."
            : "Segue l’ordine n+ℓ (Madelung). Diagonale: 4s prima di 3d, 5s prima di 4d, 6s prima di 4f."
        }</p>
      </div>
      <aside class="stack">
        <div class="card">
          <p class="kicker">Sequenza Madelung</p>
          <ol class="madelung">${AUFBAU_ORDER.map((id, i) => `<li class="${(occ[id] ?? 0) > 0 ? "is-fill" : ""}${state.focusOrb === id ? " is-on" : ""}"><span class="subtle">${i + 1}.</span> ${id}</li>`).join("")}</ol>
        </div>
        <div class="card">
          <p class="kicker">Tre regole</p>
          <ul class="rules">
            <li><b>Aufbau.</b> Prima gli orbitali a energia più bassa (n+ℓ crescente).</li>
            <li><b>Pauli.</b> Al massimo due elettroni per orbitale, spin opposti.</li>
            <li><b>Hund.</b> Negli orbitali degeneri, spin paralleli prima dell’accoppiamento.</li>
          </ul>
        </div>
        ${
          state.focusOrb
            ? `<div class="card"><p class="kicker">Orbitale ${esc(state.focusOrb)}</p><p>n = ${orbitalN(state.focusOrb)}, ℓ = ${orbitalL(state.focusOrb)}, capacità ${orbitalCapacity(state.focusOrb)}.</p>${
                firstAt(state.focusOrb)
                  ? `<p class="muted">Compare per la prima volta in ${esc(firstAt(state.focusOrb).name)} (Z = ${firstAt(state.focusOrb).z}).</p>`
                  : ""
              }</div>`
            : ""
        }
      </aside>
    </div>
  </div>`;
}

function lewisBoard() {
  return `<div class="lewis-grid">${LEWIS_SPECIES.map((s) => {
    const i = state.lewisForm[s.id] ?? 0;
    const form = s.forms[i] ?? s.forms[0];
    return `<article class="card">
      <div class="row-between wrap">
        <div>
          <p class="kicker">${esc(s.name)}</p>
          <h3>${esc(s.formula)}</h3>
          <p class="mono tiny muted">${s.valenceElectrons} e⁻ di valenza · ${esc(s.geometry)}</p>
        </div>
        <div class="row gap">${s.forms
          .map((f, idx) => chip(idx === i, `lewis:${s.id}:${idx}`, f.label))
          .join("")}</div>
      </div>
      <div class="center mt">${lewisSvg(form)}</div>
      <p class="muted">${esc(form.note)}</p>
      <p>${esc(s.hybrid)}</p>
      <ol class="teach">${s.teaching.map((t) => `<li>${esc(t)}</li>`).join("")}</ol>
      ${s.forms.length > 1 ? `<button type="button" class="btn btn-ghost sm" data-act="lewis-rot:${s.id}">Ruota la risonanza</button>` : ""}
    </article>`;
  }).join("")}</div>`;
}

function lessonBody(id) {
  if (id === "atomo") {
    const el = getElement(state.anatomy) ?? ELEMENTS[7];
    const neutrons = Math.max(0, Math.round(el.mass) - el.z);
    const copy = {
      proton: `I protoni (p⁺) sono ${el.z}. Il loro numero è Z: definisce l’elemento. ${el.name} esiste solo con ${el.z} protoni.`,
      neutron: `I neutroni (n) sono circa ${neutrons} nell’isotopo più comune (massa ≈ ${el.mass} u). Non hanno carica; tengono insieme il nucleo.`,
      electron: `Gli elettroni (e⁻) in un atomo neutro sono ${el.z}, pari ai protoni. Occupano gusci: ${el.shells.join(" · ")}.`,
      nucleus: `Il nucleo è al centro: carica ${el.z}+, raggio ~10⁵ volte più piccolo dell’atomo. Quasi tutta la massa sta lì.`,
    }[state.anatomyFocus];
    const picks = TEACHING_Z.map((z) => ELEMENTS[z - 1]).filter(Boolean);
    return `<div class="split">
      <div class="card">
        ${bohrSvg(el, 280)}
        <div class="stats-3">
          ${[
            ["proton", "p⁺", el.z, "danger"],
            ["neutron", "n", neutrons, "muted"],
            ["electron", "e⁻", el.z, "electron"],
          ]
            .map(
              ([fid, lab, n, color]) =>
                `<button type="button" class="stat${state.anatomyFocus === fid ? " is-on" : ""}" data-act="afocus:${fid}"><p class="${color} mono lg">${n}</p><p class="tiny subtle">${lab}</p></button>`,
            )
            .join("")}
        </div>
      </div>
      <div>
        <p class="kicker">Anatomia</p>
        <h3>${esc(el.symbol)} <span class="muted">${esc(el.name)}</span></h3>
        <p class="lede">${esc(copy)}</p>
        <p class="lede">In un atomo neutro le cariche si bilanciano: ${el.z} protoni e ${el.z} elettroni. Gli elettroni dell’ultimo guscio — di valenza — fanno la chimica.</p>
        <div class="chips">${picks.map((p) => chip(p.symbol === el.symbol, `anatomy:${p.symbol}`, p.symbol)).join("")}</div>
      </div>
    </div>`;
  }
  if (id === "ottetto") {
    const el = getElement(state.octet) ?? ELEMENTS[7];
    const layers = splitCoreValence(el.occupancy, el.block);
    const valence = layers.valenceCount;
    const target = el.z <= 2 ? 2 : 8;
    const need = Math.max(0, target - valence);
    const give = valence <= 3 && el.block === "s" ? valence : 0;
    const path =
      el.category === "noble"
        ? "Già stabile: ottetto (o duetto) chiuso."
        : give
          ? `Cede ${give} e⁻ e diventa catione ${el.symbol}${give > 1 ? give + "+" : "⁺"}.`
          : need
            ? `Acquista ${need} e⁻ (ione) oppure condivide ${need} coppie (covalente).`
            : "Configurazione di valenza piena.";
    const dots = Array.from({ length: target }, (_, i) => {
      const ang = -Math.PI / 2 + (i / target) * Math.PI * 2;
      const r = 78;
      return `<circle cx="${100 + r * Math.cos(ang)}" cy="${100 + r * Math.sin(ang)}" r="5" fill="${i < valence ? "var(--color-electron)" : "var(--color-elevated)"}" stroke="var(--color-border-strong)"/>`;
    }).join("");
    return `<div class="split">
      <div class="card center">
        <svg viewBox="0 0 200 200" class="octet-svg" role="img" aria-label="Simbolo di Lewis di ${esc(el.symbol)}">
          <circle cx="100" cy="100" r="78" fill="none" stroke="var(--color-border)"/>${dots}
          <circle cx="100" cy="100" r="36" fill="var(--color-elevated)"/>
          <text x="100" y="100" text-anchor="middle" dominant-baseline="central" fill="var(--color-fg)" font-size="28" font-family="var(--font-display)">${esc(el.symbol)}</text>
        </svg>
      </div>
      <div>
        <p class="lede">Due vie all’ottetto: cessione/acquisto (ionico) o condivisione (covalente). H e He puntano al duetto.</p>
        <p class="mono cfg">${esc(el.symbol)} · valenza ${valence} / ${target}</p>
        <p class="lede">${esc(path)}</p>
        <div class="chips">${OCTET_ATOMS.map((s) => chip(s === el.symbol, `octet:${s}`, s)).join("")}</div>
      </div>
    </div>`;
  }
  if (id === "ioni") {
    const p = ION_PAIRS[state.ionPair];
    const moved = state.ionMoved;
    const atom = (symbol, role, charge, electrons, kind) => {
      const label = charge === 0 ? "neutro" : charge > 0 ? `catione ${charge}+` : `anione ${Math.abs(charge)}−`;
      const n = Math.max(electrons, 1);
      return `<div class="card center">
        <p class="kicker">${role}</p>
        <p class="display huge">${esc(symbol)}${charge !== 0 ? `<sup class="warn">${charge > 0 ? `${charge}+` : `${Math.abs(charge)}−`}</sup>` : ""}</p>
        <p class="muted">${label}</p>
        <div class="e-row">${Array.from({ length: n }, (_, k) => `<span class="edot ${electrons === 0 ? "empty" : kind}"></span>`).join("")}</div>
      </div>`;
    };
    return `<div class="stack">
      <div class="chips">${ION_PAIRS.map((pair, idx) => chip(idx === state.ionPair, `pair:${idx}`, pair.salt)).join("")}</div>
      <div class="ion-grid">
        ${atom(p.metal, "Metallo", moved ? p.give : 0, moved ? 0 : p.give, "cation")}
        <button type="button" class="btn btn-ghost" data-act="transfer">${moved ? "Ripristina atomi" : "Trasferisci e⁻"}</button>
        ${atom(p.nonmetal, "Non metallo", moved ? -p.take : 0, moved ? p.take : 0, "anion")}
      </div>
      <div class="card">
        <p class="display">${moved ? `${p.metal}${p.give > 1 ? `${p.give}+` : "⁺"}  +  ${p.nonmetal}⁻  →  ${p.salt}` : `${p.metal}  +  ${p.nonmetal}`}</p>
        <p class="lede">${esc(p.story)}</p>
        <p class="lede">Catione: perde elettroni, carica positiva — tipico dei metalli. Anione: li acquista — tipico dei non metalli.</p>
      </div>
    </div>`;
  }
  if (id === "molecole") {
    const m = DEMO_MOLECULES.find((x) => x.id === state.mol) ?? DEMO_MOLECULES[3];
    const map = { h2: "H — H", n2: "N ≡ N", o2: "O = O", h2o: "H — O — H", co2: "O = C = O", ch4: "CH₄ tetraedro", nh4: "H₃N→H⁺" };
    const glyph =
      m.id === "nacl"
        ? `<div class="nacl">${Array.from({ length: 9 }, (_, i) => {
            const na = i % 2 === 0 === (Math.floor(i / 3) % 2 === 0);
            return `<div class="${na ? "na" : "cl"}">${na ? "Na⁺" : "Cl⁻"}</div>`;
          }).join("")}</div>`
        : `<p class="mono display">${map[m.id] ?? m.id}</p>`;
    const kind = m.kind === "ionic" ? "Reticolo ionico" : m.kind === "element" ? "Molecola elementare" : "Composto molecolare";
    return `<div class="stack">
      <div class="chips">${DEMO_MOLECULES.map((mol) => chip(mol.id === m.id, `mol:${mol.id}`, mol.formula)).join("")}</div>
      <div class="card">
        <p class="kicker">${kind}</p>
        <h3>${esc(m.formula)} <span class="muted">${esc(m.name)}</span></h3>
        <p class="lede">${esc(m.blurb)}</p>
        ${glyph}
      </div>
    </div>`;
  }
  if (id === "ionico") {
    return `<div class="split">
      <div class="card">
        <p class="kicker">Trasferimento</p>
        <h3>Na + Cl → Na⁺Cl⁻</h3>
        <p class="lede">Grande differenza di elettronegatività: il metallo cede definitivamente uno o più elettroni al non metallo. Non è condivisione, è trasferimento. Poi le cariche opposte si attraggono.</p>
        <p class="lede">Il risultato non è una molecola, ma un reticolo cristallino: ogni catione è circondato da più anioni, all’infinito.</p>
      </div>
      <div class="card">
        <p class="kicker">Proprietà</p>
        <ul class="rules">
          <li>Solidi cristallini a temperatura ambiente</li>
          <li>Alto punto di fusione (forze coulombiane)</li>
          <li>Conducono solo fusi o in soluzione: servono ioni liberi</li>
        </ul>
        <div class="nacl mt">${Array.from({ length: 9 }, (_, i) => {
          const na = i % 2 === 0 === (Math.floor(i / 3) % 2 === 0);
          return `<div class="${na ? "na" : "cl"}">${na ? "Na⁺" : "Cl⁻"}</div>`;
        }).join("")}</div>
      </div>
    </div>`;
  }
  if (id === "covalente") {
    const kinds = [
      { id: "puro", t: "Puro / apolare", b: "Stessa EN, coppia condivisa in modo uguale. H₂, O₂, Cl₂: nessun polo." },
      { id: "polare", t: "Polare", b: "ΔEN moderato. L’atomo più EN attira la coppia: δ+ e δ−. H₂O, HCl." },
      { id: "dativo", t: "Dativo", b: "La coppia arriva da un solo atomo (donatore). In NH₄⁺ l’azoto dona il doppietto a H⁺." },
    ];
    const k = kinds.find((x) => x.id === state.covKind) ?? kinds[0];
    return `<div class="stack">
      <div class="chips">${kinds.map((x) => chip(x.id === k.id, `cov:${x.id}`, x.t)).join("")}</div>
      <div class="card">
        <h3>${esc(k.t)}</h3>
        <p class="lede">${esc(k.b)}</p>
        <div class="props mt">
          <div class="prop"><p class="kicker">Semplice</p><p>un σ · H–H</p></div>
          <div class="prop"><p class="kicker">Doppio</p><p>σ + π · O=O</p></div>
          <div class="prop"><p class="kicker">Triplo</p><p>σ + 2π · N≡N</p></div>
        </div>
      </div>
    </div>`;
  }
  if (id === "intermolecolari") {
    const kinds = [
      { id: "london", t: "London / Van der Waals", b: "Le più deboli, in tutte le molecole. Dipoli istantanei da fluttuazioni della nuvola elettronica." },
      { id: "dipole", t: "Dipolo–dipolo", b: "Tra molecole polari: δ+ di una punta verso δ− di un’altra. Più forti di London a parità di massa." },
      { id: "hbond", t: "Legame a idrogeno", b: "H legato a O, N o F attratto dal doppietto di un O/N/F vicino. Per questo l’acqua è liquida a T ambiente." },
    ];
    const k = kinds.find((x) => x.id === state.forceKind) ?? kinds[0];
    return `<div class="stack">
      <p class="lede">Oltre ai legami veri, forze più deboli tra molecole diverse decidono ebollizione e tensione superficiale. Intensità crescente:</p>
      <div class="chips">${kinds.map((x) => chip(x.id === k.id, `force:${x.id}`, x.t)).join("")}</div>
      <div class="card"><h3>${esc(k.t)}</h3><p class="lede">${esc(k.b)}</p></div>
    </div>`;
  }
  if (id === "orbitali") {
    return `<div class="stack">
      <div class="split">
        <div class="card">
          <p class="kicker">Orbitale s</p>
          <svg viewBox="0 0 160 160" class="shape"><circle cx="80" cy="80" r="48" fill="color-mix(in oklab, var(--color-electron) 35%, transparent)" stroke="var(--color-electron)"/><circle cx="80" cy="80" r="4" fill="var(--color-fg)"/></svg>
          <p class="muted tiny">Sfera centrata sul nucleo. 1 orbitale, 2 e⁻.</p>
        </div>
        <div class="card">
          <p class="kicker">Orbitali p</p>
          <svg viewBox="0 0 200 120" class="shape"><ellipse cx="55" cy="60" rx="28" ry="18" fill="color-mix(in oklab, var(--color-valence) 35%, transparent)" stroke="var(--color-valence)"/><ellipse cx="145" cy="60" rx="28" ry="18" fill="color-mix(in oklab, var(--color-valence) 35%, transparent)" stroke="var(--color-valence)"/><circle cx="100" cy="60" r="4" fill="var(--color-fg)"/></svg>
          <p class="muted tiny">Tre manubri px, py, pz. 6 e⁻ in tutto.</p>
        </div>
      </div>
      <div class="card">
        <p class="kicker">Quattro numeri quantici</p>
        <div class="props">
          <div class="prop"><p class="kicker">n</p><p>livello, distanza, energia</p></div>
          <div class="prop"><p class="kicker">ℓ</p><p>forma: s p d f</p></div>
          <div class="prop"><p class="kicker">mℓ</p><p>orientamento nello spazio</p></div>
          <div class="prop"><p class="kicker">ms</p><p>spin +½ o −½</p></div>
        </div>
      </div>
      <p class="lede">L’ossigeno (Z=8) è 1s² 2s² 2p⁴: due spaiati, due legami covalenti per chiudere l’ottetto. La mappa diagonale completa è in Atomo.</p>
    </div>`;
  }
  if (id === "lewis") {
    return `<div class="stack"><p class="lede">Nitrato e nitrito: ottetto, cariche formali e risonanza. NO₂ neutro è il caso dispari.</p>${lewisBoard()}</div>`;
  }
  return "";
}

function viewLab() {
  const chapter = LESSONS.find((l) => l.id === state.lesson) ?? LESSONS[0];
  return `<div class="stagger page">
    <header class="page-head">
      <div>
        <p class="kicker">Laboratorio</p>
        <h1>Basi della chimica</h1>
        <p class="lede">Dall’atomo alle forze tra molecole, poi orbitali e Lewis.</p>
      </div>
    </header>
    <nav class="sticky-chips">${LESSONS.map((l) => `<button type="button" class="chip${l.id === chapter.id ? " is-on" : ""}" data-act="lesson:${l.id}"><span class="mono tiny">${l.n}</span> ${esc(l.title)}</button>`).join("")}</nav>
    <section class="card">
      <p class="kicker">${esc(chapter.kicker)}</p>
      <h2>${esc(chapter.title)}</h2>
      <p class="lede">${esc(chapter.summary)}</p>
      <div class="mt">${lessonBody(chapter.id)}</div>
    </section>
    <section>
      <h2>Riepilogo</h2>
      <div class="table-wrap"><table><thead><tr><th>Concetto</th><th>Cos’è</th></tr></thead><tbody>${RECAP.map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join("")}</tbody></table></div>
    </section>
  </div>`;
}

function ensureQuiz() {
  if (!state.quiz) {
    const seed = Date.now();
    state.quiz = { seed, questions: buildQuiz(seed, 8), step: 0, picked: null, score: 0 };
  }
  return state.quiz;
}

function viewStudio() {
  const tabs = [
    ["tendenze", "Tendenze"],
    ["confronta", "Confronta"],
    ["quiz", "Quiz"],
    ["glossario", "Glossario"],
  ];
  let body = "";
  if (state.studio === "tendenze") {
    const heat = state.trendHeat;
    const active = TRENDS.find((m) => m.id === heat) ?? TRENDS[0];
    body = `<header class="page-head"><div><p class="kicker">Periodicità</p><h2>Tendenze</h2><p class="lede">${esc(active.body)}</p></div></header>
      <div class="chips">${TRENDS.map((m) => chip(heat === m.id, `trend:${m.id}`, m.title)).join("")}</div>
      ${tableHtml(null, "all", heat, "open")}
      <p class="tiny muted">Intensità del colore = valore relativo. Celle spente: dato non disponibile.</p>`;
  } else if (state.studio === "confronta") {
    const a = getElement(state.compareA) ?? ELEMENTS[8];
    const b = getElement(state.compareB) ?? ELEMENTS[16];
    const card = (el, key) => {
      const layers = splitCoreValence(el.occupancy, el.block);
      return `<article class="card">
        <div class="row-between"><h3>${esc(el.symbol)}</h3><a class="txt-btn" href="#/elemento/${el.symbol}" data-act="go" data-hash="/elemento/${el.symbol}">scheda</a></div>
        <p class="muted">${esc(el.name)}</p>
        ${bohrSvg(el, 220)}
        <p class="mono cfg">${esc(formatCondensed(el.occupancy, el.z))}</p>
        <dl class="props two">${[
          ["Valenza", layers.valenceCount],
          ["Core", layers.coreCount],
          ["Spaiati", layers.unpaired],
          ["EN", el.electronegativity?.toFixed(2) ?? "—"],
          ["IE", el.ionization ?? "—"],
          ["Raggio", el.radius ? `${el.radius} pm` : "—"],
        ]
          .map(([k, v]) => `<div class="prop"><dt class="kicker">${k}</dt><dd>${esc(v)}</dd></div>`)
          .join("")}</dl>
      </article>`;
    };
    const picker = (cur, key, exclude) =>
      `<label class="search"><span class="sr">Cerca (ora ${esc(cur.symbol)})</span><input type="search" data-act="cmpq:${key}" placeholder="Cerca (ora ${esc(cur.symbol)})" aria-label="Cerca elemento da confrontare"/></label>`;
    body = `<header class="page-head"><div><p class="kicker">Affianca</p><h2>Confronta</h2><p class="lede">Due atomi, due configurazioni. Utile per isoelettronici, vicini di gruppo o coppie classiche (F/Cl, Na/K, Fe/Ru).</p></div></header>
      <div class="split">${picker(a, "A", b.symbol)}${picker(b, "B", a.symbol)}</div>
      <div id="cmp-results"></div>
      <div class="split">${card(a, "A")}${card(b, "B")}</div>`;
  } else if (state.studio === "quiz") {
    const qz = ensureQuiz();
    const best = Number(localStorage.getItem("orbitalia-quiz-best") || 0);
    if (qz.step >= qz.questions.length) {
      body = `<div class="narrow"><h2>Sessione finita</h2><p class="lede">Punteggio ${qz.score}/${qz.questions.length}. Record locale: ${best}/${qz.questions.length}.</p>
        <div class="row gap"><button type="button" class="btn" data-act="quiz-new">Nuovo quiz</button><a class="btn btn-ghost" href="#/" data-act="go" data-hash="/">Torna alla tavola</a></div></div>`;
    } else {
      const q = qz.questions[qz.step];
      const picked = qz.picked;
      const correct = picked === q.answer;
      body = `<div class="narrow">
        <p class="kicker">Domanda ${qz.step + 1} / ${qz.questions.length}</p>
        <h2>${esc(q.prompt)}</h2>
        ${q.detail ? `<p class="mono electron lg">${esc(q.detail)}</p>` : ""}
        <ul class="quiz-opts">${q.options
          .map((opt) => {
            let cls = "quiz-opt";
            if (picked) {
              if (opt === q.answer) cls += " is-ok";
              else if (opt === picked) cls += " is-bad";
              else cls += " is-dim";
            }
            return `<li><button type="button" class="${cls}" data-act="quiz-pick" data-opt="${esc(opt)}">${esc(opt)}</button></li>`;
          })
          .join("")}</ul>
        ${
          picked
            ? `<div class="note"><p><b>${correct ? "Corretto." : "Non proprio."}</b></p><p class="muted">${esc(q.explain)}</p><button type="button" class="btn mt" data-act="quiz-next">${qz.step + 1 === qz.questions.length ? "Risultato" : "Avanti"}</button></div>`
            : `<p class="tiny subtle">Punteggio ${qz.score} · record ${best}</p>`
        }
      </div>`;
    }
  } else {
    const s = state.glossQ.trim().toLowerCase();
    const items = s
      ? GLOSSARY.filter((t) => t.term.toLowerCase().includes(s) || t.body.toLowerCase().includes(s) || t.group.toLowerCase().includes(s))
      : GLOSSARY;
    const groups = [...new Set(items.map((t) => t.group))];
    body = `<header class="page-head"><div><p class="kicker">Lessico</p><h2>Glossario</h2><p class="lede">Le regole e le grandezze che servono per leggere una configurazione senza indovinare.</p></div></header>
      <label class="search max"><span class="sr">Cerca nel glossario</span><input type="search" value="${esc(state.glossQ)}" data-act="gloss" placeholder="Cerca un termine" aria-label="Cerca nel glossario"/></label>
      ${groups
        .map(
          (g) =>
            `<section><h3>${esc(g)}</h3><div class="gloss-grid">${items
              .filter((t) => t.group === g)
              .map((t) => `<article class="card"><h4>${esc(t.term)}</h4><p class="lede">${esc(t.body)}</p></article>`)
              .join("")}</div></section>`,
        )
        .join("")}
      ${items.length === 0 ? `<p class="muted">Nessun lemma.</p>` : ""}`;
  }
  return `<div class="stagger page">
    <header class="page-head">
      <div>
        <p class="kicker">Strumenti</p>
        <h1>Studio</h1>
        <p class="lede">Tendenze periodiche, confronto tra atomi, quiz e glossario — nello stesso posto.</p>
      </div>
    </header>
    <div class="sticky-chips"><div class="eh-seg" role="tablist" aria-label="Sezioni studio">${tabs
      .map(([id, lab]) => `<button type="button" role="tab" class="eh-seg-item${state.studio === id ? " is-active" : ""}" aria-selected="${state.studio === id}" data-act="studio:${id}">${lab}</button>`)
      .join("")}</div></div>
    ${body}
  </div>`;
}

function view() {
  if (state.view === "atomo") return viewAtomo();
  if (state.view === "lab") return viewLab();
  if (state.view === "studio") return viewStudio();
  if (state.view === "elemento") return viewElemento();
  return viewTavola();
}

function render() {
  if (!root) return;
  const y = window.scrollY;
  root.innerHTML = shell(view());
  if (state.view === "tavola" || state.view === "lab") {
    /* keep */
  }
  const keep = root.querySelector("[data-keep-scroll]");
  if (!keep) {
    /* don't jump on small widget updates if same view - still reset on route change handled by go() */
  }
  window.scrollTo(0, Math.min(y, document.body.scrollHeight));
}

function setHashFromState() {
  let h = "/";
  if (state.view === "atomo") h = "/atomo";
  else if (state.view === "lab") h = `/lab/${state.lesson}`;
  else if (state.view === "studio") h = `/studio/${state.studio}`;
  else if (state.view === "elemento") h = `/elemento/${state.symbol}`;
  const next = `#${h}`.replace("#//", "#/");
  if (location.hash !== next && location.hash !== next.replace(/^#/, "#")) {
    history.replaceState(null, "", next === "#/" ? "#/" : next);
  }
}

function onAct(act, el, ev) {
  if (act === "go") {
    ev.preventDefault();
    const hash = el.getAttribute("data-hash") || "/";
    const clean = hash.replace(/^#/, "");
    location.hash = clean.startsWith("/") ? clean : `/${clean}`;
    return;
  }
  if (act === "pick" || act === "open") {
    const sym = el.getAttribute("data-sym");
    if (!sym) return;
    if (act === "open" || state.view !== "tavola") {
      location.hash = `/elemento/${sym}`;
      return;
    }
    state.symbol = sym;
    state.query = "";
    render();
    document.querySelector(".peek")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return;
  }
  if (act === "query") return;
  if (act.startsWith("cat:")) {
    state.cat = act.slice(4);
    render();
    return;
  }
  if (act.startsWith("heat:")) {
    state.heat = act.slice(5);
    render();
    return;
  }
  if (act === "toggle-list") {
    state.list = !state.list;
    render();
    return;
  }
  if (act === "play") {
    if (state.playing) {
      state.playing = false;
      window.clearTimeout(playTimer);
    } else {
      if (state.aufbauZ >= 118) state.aufbauZ = 1;
      state.playing = true;
      tickPlay();
    }
    render();
    return;
  }
  if (act.startsWith("orb:")) {
    const id = act.slice(4);
    state.focusOrb = state.focusOrb === id ? null : id;
    render();
    return;
  }
  if (act.startsWith("lesson:")) {
    state.lesson = act.slice(7);
    setHashFromState();
    render();
    window.scrollTo(0, 0);
    return;
  }
  if (act.startsWith("studio:")) {
    state.studio = act.slice(7);
    if (state.studio === "quiz" && !state.quiz) ensureQuiz();
    setHashFromState();
    render();
    return;
  }
  if (act.startsWith("anatomy:")) {
    state.anatomy = act.slice(8);
    render();
    return;
  }
  if (act.startsWith("afocus:")) {
    state.anatomyFocus = act.slice(7);
    render();
    return;
  }
  if (act.startsWith("octet:")) {
    state.octet = act.slice(6);
    render();
    return;
  }
  if (act.startsWith("pair:")) {
    state.ionPair = Number(act.slice(5));
    state.ionMoved = false;
    render();
    return;
  }
  if (act === "transfer") {
    state.ionMoved = !state.ionMoved;
    render();
    return;
  }
  if (act.startsWith("mol:")) {
    state.mol = act.slice(4);
    render();
    return;
  }
  if (act.startsWith("cov:")) {
    state.covKind = act.slice(4);
    render();
    return;
  }
  if (act.startsWith("force:")) {
    state.forceKind = act.slice(6);
    render();
    return;
  }
  if (act.startsWith("lewis-rot:")) {
    const id = act.slice(10);
    const s = LEWIS_SPECIES.find((x) => x.id === id);
    if (!s) return;
    state.lewisForm[id] = ((state.lewisForm[id] ?? 0) + 1) % s.forms.length;
    render();
    return;
  }
  if (act.startsWith("lewis:")) {
    const [, id, idx] = act.split(":");
    state.lewisForm[id] = Number(idx);
    render();
    return;
  }
  if (act.startsWith("trend:")) {
    state.trendHeat = act.slice(6);
    render();
    return;
  }
  if (act === "ion:+1" || act === "ion:-1") {
    const elmt = getElement(state.symbol);
    if (!elmt) return;
    const maxPlus = Math.min(8, elmt.z);
    const maxMinus = Math.min(3, 118 - elmt.z);
    state.ionCharge = Math.max(-maxMinus, Math.min(maxPlus, state.ionCharge + (act === "ion:+1" ? 1 : -1)));
    render();
    return;
  }
  if (act === "quiz-new") {
    state.quiz = null;
    ensureQuiz();
    render();
    return;
  }
  if (act === "quiz-pick") {
    const qz = state.quiz;
    if (!qz || qz.picked) return;
    const opt = el.getAttribute("data-opt");
    qz.picked = opt;
    const q = qz.questions[qz.step];
    if (opt === q.answer) qz.score += 1;
    render();
    return;
  }
  if (act === "quiz-next") {
    const qz = state.quiz;
    if (!qz || !qz.picked) return;
    qz.picked = null;
    qz.step += 1;
    if (qz.step >= qz.questions.length) {
      const best = Number(localStorage.getItem("orbitalia-quiz-best") || 0);
      localStorage.setItem("orbitalia-quiz-best", String(Math.max(best, qz.score)));
    }
    render();
    return;
  }
  if (act === "hide-install") {
    state.installHide = true;
    localStorage.setItem("electronhub-install-dismissed", "1");
    render();
    return;
  }
  if (act === "install") {
    if (state.deferredPrompt) {
      state.deferredPrompt.prompt();
      state.deferredPrompt = null;
      state.installHide = true;
      localStorage.setItem("electronhub-install-dismissed", "1");
      render();
    }
  }
}

function tickPlay() {
  window.clearTimeout(playTimer);
  if (!state.playing) return;
  if (state.aufbauZ >= 118) {
    state.playing = false;
    render();
    return;
  }
  playTimer = window.setTimeout(() => {
    state.aufbauZ = Math.min(118, state.aufbauZ + 1);
    render();
    tickPlay();
  }, 140);
}

function bind() {
  root.addEventListener("click", (ev) => {
    const el = ev.target.closest("[data-act]");
    if (!el || !root.contains(el)) return;
    onAct(el.getAttribute("data-act"), el, ev);
  });
  root.addEventListener("input", (ev) => {
    const el = ev.target;
    const act = el.getAttribute("data-act");
    if (act === "query") {
      state.query = el.value;
      renderKeepFocus(el);
    } else if (act === "z") {
      state.playing = false;
      window.clearTimeout(playTimer);
      state.aufbauZ = Number(el.value);
      renderKeepFocus(el);
    } else if (act === "gloss") {
      state.glossQ = el.value;
      renderKeepFocus(el);
    } else if (act === "cmpq:A" || act === "cmpq:B") {
      const key = act.endsWith("A") ? "A" : "B";
      const q = el.value;
      const exclude = key === "A" ? state.compareB : state.compareA;
      const box = document.getElementById("cmp-results");
      if (!box) return;
      if (!q.trim()) {
        box.innerHTML = "";
        return;
      }
      const hits = searchElements(q)
        .filter((e) => e.symbol !== exclude)
        .slice(0, 8);
      box.innerHTML = `<ul class="search-list">${hits
        .map(
          (e) =>
            `<li><button type="button" class="search-row" data-act="cmpset:${key}:${e.symbol}"><span class="ps">${esc(e.symbol)}</span><span>${esc(e.name)}</span></button></li>`,
        )
        .join("")}</ul>`;
    }
  });
  root.addEventListener("click", (ev) => {
    const el = ev.target.closest("[data-act^='cmpset:']");
    if (!el) return;
    const [, key, sym] = el.getAttribute("data-act").split(":");
    if (key === "A") state.compareA = sym;
    else state.compareB = sym;
    render();
  });
}

function renderKeepFocus(el) {
  const act = el.getAttribute("data-act");
  const start = el.selectionStart;
  const end = el.selectionEnd;
  render();
  const next = root.querySelector(`[data-act="${act}"]`);
  if (next) {
    next.focus();
    if (typeof start === "number") next.setSelectionRange(start, end);
  }
}

function detectInstall() {
  const ua = navigator.userAgent;
  state.ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  state.standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    Boolean(navigator.standalone);
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    state.deferredPrompt = e;
    render();
  });
}

function boot() {
  if (window.__EH_BOOTED) return;
  window.__EH_BOOTED = true;
  root = document.getElementById("app");
  if (!root) {
    root = document.createElement("div");
    root.id = "app";
    document.body.prepend(root);
  }
  applyRoute(parseRoute());
  if (state.view === "studio" && state.studio === "quiz") ensureQuiz();
  detectInstall();
  bind();
  render();
  window.addEventListener("hashchange", () => {
    applyRoute(parseRoute());
    window.scrollTo(0, 0);
    render();
  });
  if (!location.hash) {
    const r = parseRoute();
    if (r.view !== "tavola" || r.symbol || r.lesson || r.studio) setHashFromState();
  }
  if ("serviceWorker" in navigator && !["localhost", "127.0.0.1"].includes(location.hostname) === false) {
    /* register in production only: hostname check inverted below */
  }
  const isLocal = /localhost|127\.0\.0\.1/.test(location.hostname);
  if ("serviceWorker" in navigator && !isLocal) {
    navigator.serviceWorker.register("./sw.js").catch(() => undefined);
  }
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
