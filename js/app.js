// @ts-nocheck
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
  LAB_SPECIES,
  PH_SAMPLES,
  FUNCTIONAL_PAIRS,
  ISOMER_CHALLENGES,
  NA,
  allBoxes,
  buildQuiz,
  describeIsomer,
  differentiatingElectron,
  fillAufbau,
  formatCondensed,
  formatFull,
  formulaMass,
  getElement,
  hFromPh,
  ionOccupancy,
  isomerMatches,
  lName,
  msLabel,
  neighbors,
  occupancyTotal,
  orbitalCapacity,
  orbitalL,
  orbitalN,
  phColorCss,
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
  ["Mole", "n = m/M = N/NA = c·V · NA = 6,022×10²³ mol⁻¹"],
  ["Molarità", "c = n/V in mol/L · diluizione c₁V₁ = c₂V₂"],
  ["pH", "−log[H₃O⁺] · pH + pOH = 14 a 25 °C"],
  ["Isomeri di struttura", "Stessa formula, connettività diversa (catena, posizione, funzione)"],
  ["Stereoisomeri", "Stessa connettività, spazio diverso: conformeri, cis/trans, enantiomeri"],
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

const PAL = {
  fg: "#ecece8",
  muted: "#9a9b96",
  subtle: "#8a8b86",
  elevated: "#1c1e22",
  surface: "#141518",
  electron: "#4f8f7b",
  core: "#7a8494",
  valence: "#c5cdd6",
  warn: "#c4a574",
  danger: "#c45c4a",
  accent: "#c5cdd6",
  accentFg: "#0b0c0e",
  ring: "#a8adb3",
};

function hexMix(a, b, t) {
  const p = Math.max(0, Math.min(1, Number(t) || 0));
  const parse = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const A = parse(a);
  const B = parse(b);
  const ch = (i) => Math.round(A[i] + (B[i] - A[i]) * p).toString(16).padStart(2, "0");
  return `#${ch(0)}${ch(1)}${ch(2)}`;
}

function rgba(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

let svgUid = 0;
function uid(prefix) {
  svgUid += 1;
  return `${prefix}${svgUid}`;
}

const state = {
  view: "tavola",
  symbol: null,
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
  labCmp: "h2o",
  labMass: 18,
  labVol: 0.25,
  phValue: 7,
  isoSkel: "n",
  isoGroup: "oh",
  isoPos: 1,
  isoChallenge: 0,
  isoFeedback: null,
  isoDepth: 1,
  funPair: "c2h6o",
  stereoMode: "conform",
  newmanAngle: 60,
  geoIsomer: "cis",
  opticalFace: "R",
  showMirror: true,
  stereoDepth: 1,
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
        const fill = i === shells.length - 1 ? PAL.valence : PAL.electron;
        return `<circle cx="${x}" cy="${y}" r="${rad}" fill="${fill}"/>`;
      }).join("");
      const extra =
        count > electrons
          ? `<text x="${cx + r + 6}" y="${cy - 4}" fill="${PAL.muted}" font-size="9" font-family="var(--font-mono)">+${count - electrons}</text>`
          : "";
      const spin = i % 2 === 0 ? "orbit-spin" : "orbit-spin-rev";
      return `<g>
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${PAL.ring}" stroke-width="1.85" opacity="0.95"/>
        <g class="${spin}" style="animation-duration:${duration}s;transform-origin:${cx}px ${cy}px;-webkit-transform-origin:${cx}px ${cy}px">${dots}</g>
        ${extra}
      </g>`;
    })
    .join("");
  const nr = Math.max(14, gap * 0.42);
  const fs = el.symbol.length > 2 ? 11 : 14;
  return `<div class="bohr"><svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Modello di Bohr di ${esc(el.name)}"><circle cx="${cx}" cy="${cy}" r="${size / 2 - 2}" fill="${PAL.elevated}"/>${rings}<circle cx="${cx}" cy="${cy}" r="${nr}" fill="${PAL.accentFg}"/><circle cx="${cx}" cy="${cy}" r="${nr}" fill="none" stroke="${PAL.accent}" stroke-width="1.5"/><text x="${cx}" y="${cy + 1}" text-anchor="middle" dominant-baseline="middle" fill="${PAL.fg}" font-size="${fs}" font-family="var(--font-sans)" font-weight="500">${esc(el.symbol)}</text></svg><ul class="shell-pills">${shells
    .map((c, i) => `<li><span>${SHELL_NAMES[i]}</span> ${c}</li>`)
    .join("")}</ul></div>`;
}

function idleAtomSvg() {
  const size = 220;
  const cx = 110;
  const cy = 110;
  const rings = [28, 52, 76, 96]
    .map((r, i) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${PAL.ring}" stroke-width="${i === 3 ? 1.6 : 1.35}" opacity="${0.35 + i * 0.12}" stroke-dasharray="${i === 3 ? "0" : "4 5"}"/>`)
    .join("");
  return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-hidden="true"><circle cx="${cx}" cy="${cy}" r="108" fill="${PAL.elevated}"/>${rings}<circle cx="${cx}" cy="${cy}" r="12" fill="${PAL.accentFg}" stroke="${PAL.accent}" stroke-width="1.4"/></svg>`;
}

function heatRange(mode) {
  if (mode === "none") return null;
  const vals = ELEMENTS.map(HEAT_GET[mode]).filter((v) => v != null && v > 0);
  return { min: Math.min(...vals), max: Math.max(...vals) };
}

function heatMix(el, mode, range) {
  if (mode === "none" || !range) return "";
  const v = HEAT_GET[mode](el);
  if (v == null) return `background:${PAL.elevated};color:${PAL.muted}`;
  const t = (v - range.min) / (range.max - range.min || 1);
  const bg = hexMix(PAL.elevated, PAL.electron, 0.2 + t * 0.8);
  return `background:${bg}`;
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

function fmtMass(v) {
  if (!Number.isFinite(v)) return "—";
  if (v >= 100) return v.toFixed(1);
  if (v >= 10) return v.toFixed(2);
  return v.toFixed(3);
}

function fmtSci(n) {
  if (!Number.isFinite(n) || n === 0) return "0";
  const exp = Math.floor(Math.log10(Math.abs(n)));
  const m = n / 10 ** exp;
  const expStr = String(exp).replace("-", "−");
  return `${m.toFixed(2)} × 10${[...expStr].map((ch) => ({ "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "−": "⁻" }[ch] ?? ch)).join("")}`;
}

function beakerSvg(fillCss, label, opts = {}) {
  const level = Math.max(0.16, Math.min(0.84, opts.level ?? 0.55));
  const y = 44 + (1 - level) * 148;
  const foam = opts.bubbles
    ? Array.from({ length: 7 }, (_, i) => {
        const bx = 92 + ((i * 17) % 56);
        const by = Math.min(186, y + 12 + (i % 3) * 11);
        return `<circle cx="${bx}" cy="${by}" r="${1.6 + (i % 3) * 0.5}" fill="${rgba(PAL.fg, 0.38)}"/>`;
      }).join("")
    : "";
  return `<svg viewBox="0 0 240 230" class="lab-svg" role="img" aria-label="${esc(label)}">
    <defs>
      <linearGradient id="beak-shine" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity="0.08"/>
        <stop offset="0.35" stop-color="#fff" stop-opacity="0"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0.05"/>
      </linearGradient>
    </defs>
    <path d="M82 ${y} H158 V168 C158 192 142 202 120 202 C98 202 82 192 82 168 Z" fill="${fillCss}"/>
    <path d="M82 ${y} Q120 ${y - 5} 158 ${y}" fill="none" stroke="${rgba(PAL.fg, 0.28)}" stroke-width="1.8"/>
    ${foam}
    <path d="M64 14 h112 v14 h-14 v140 c0 32-20 46-46 46 s-46-14-46-46 V28 H64 Z" fill="url(#beak-shine)" stroke="var(--color-border-strong)" stroke-width="1.7"/>
    ${[0, 1, 2, 3, 4].map((i) => {
      const gy = 52 + i * 28;
      return `<line x1="162" y1="${gy}" x2="172" y2="${gy}" stroke="var(--color-subtle)" stroke-width="1"/><text x="178" y="${gy + 3}" fill="var(--color-subtle)" font-size="8" font-family="var(--font-mono)">${250 - i * 50}</text>`;
    }).join("")}
    <rect x="82" y="6" width="76" height="12" rx="2" fill="var(--color-surface)" stroke="var(--color-border)"/>
  </svg>`;
}

function flaskSvg(conc, fillCss) {
  const opacity = Math.max(0.22, Math.min(0.92, 0.22 + conc * 0.5));
  return `<svg viewBox="0 0 220 240" class="lab-svg" role="img" aria-label="Matraccio tarato">
    <path d="M96 12 h28 v70 l46 92 c8 16 8 38-18 48 h-84 c-26-10-26-32-18-48 L96 82 V12 Z" fill="var(--color-elevated)" stroke="var(--color-border-strong)" stroke-width="1.6"/>
    <path d="M102 90 l36 74 c5 11 5 24-10 31 h-50 c-15-7-15-20-10-31 Z" fill="${fillCss}" fill-opacity="${opacity}"/>
    <line x1="68" y1="168" x2="152" y2="168" stroke="var(--color-warn)" stroke-width="1.4" stroke-dasharray="3 3"/>
    <text x="110" y="162" text-anchor="middle" fill="var(--color-warn)" font-size="9" font-family="var(--font-mono)">tratto</text>
    <rect x="92" y="4" width="36" height="12" rx="2" fill="var(--color-surface)" stroke="var(--color-border)"/>
  </svg>`;
}

function electrodeSvg(pH) {
  const css = phColorCss(pH);
  return `<svg viewBox="0 0 80 230" class="lab-svg electrode" role="img" aria-label="Elettrodo di vetro">
    <rect x="34" y="8" width="12" height="110" rx="3" fill="var(--color-core)"/>
    <rect x="28" y="112" width="24" height="58" rx="8" fill="${hexMix(PAL.accent, PAL.elevated, 0.55)}" stroke="${PAL.ring}"/>
    <path d="M28 168 h24 l-6 28 h-12 Z" fill="${css}" stroke="var(--color-border-strong)"/>
    <circle cx="40" cy="202" r="10" fill="${css}" stroke="var(--color-fg)" stroke-width="1.2"/>
  </svg>`;
}

function stripSvg(pH) {
  const stops = [1, 3, 5, 7, 9, 11, 13];
  const xMark = 16 + (pH / 14) * 248;
  return `<svg viewBox="0 0 280 56" class="ph-strip" role="img" aria-label="Cartina universale">
    ${stops.map((v, i) => `<rect x="${16 + i * 36}" y="14" width="32" height="18" rx="3" fill="${phColorCss(v)}"/>`).join("")}
    <polygon points="${xMark},8 ${xMark - 5},0 ${xMark + 5},0" fill="var(--color-fg)"/>
    <text x="16" y="48" fill="var(--color-subtle)" font-size="9" font-family="var(--font-mono)">1</text>
    <text x="136" y="48" fill="var(--color-subtle)" font-size="9" font-family="var(--font-mono)">7</text>
    <text x="248" y="48" fill="var(--color-subtle)" font-size="9" font-family="var(--font-mono)">13</text>
  </svg>`;
}

function bondStroke(p, q, order, color) {
  const dx = q.x - p.x;
  const dy = q.y - p.y;
  const len = Math.hypot(dx, dy) || 1;
  const px = (-dy / len) * 3.5;
  const py = (dx / len) * 3.5;
  const sw = 2.6;
  if (order === 2) {
    return `<line x1="${p.x + px}" y1="${p.y + py}" x2="${q.x + px}" y2="${q.y + py}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/><line x1="${p.x - px}" y1="${p.y - py}" x2="${q.x - px}" y2="${q.y - py}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>`;
  }
  return `<line x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>`;
}

function molLayout(skel, group, pos, geo) {
  const p = Number(pos);
  if (skel === "iso") {
    return {
      pts: [
        { id: 1, x: 88, y: 162 },
        { id: 2, x: 170, y: 108 },
        { id: 3, x: 252, y: 162 },
        { id: 4, x: 170, y: 36 },
      ],
      bonds: [
        [1, 2],
        [2, 3],
        [2, 4],
      ],
      double: group === "=" ? [2, 4] : null,
      hydrogens:
        group === "="
          ? [
              { x: 122, y: 28, from: 4, label: "H" },
              { x: 218, y: 28, from: 4, label: "H" },
            ]
          : [],
    };
  }
  if (group === "=" && (p === 2 || p === 3)) {
    const cis = geo !== "trans";
    return {
      pts: [
        { id: 1, x: 68, y: 46 },
        { id: 2, x: 128, y: 108 },
        { id: 3, x: 212, y: 108 },
        { id: 4, x: 272, y: cis ? 46 : 170 },
      ],
      bonds: [
        [1, 2],
        [2, 3],
        [3, 4],
      ],
      double: [2, 3],
      hydrogens: [
        { x: 86, y: 170, from: 2, label: "H" },
        { x: 254, y: cis ? 170 : 46, from: 3, label: "H" },
      ],
    };
  }
  if (group === "=" && p === 1) {
    return {
      pts: [
        { id: 1, x: 56, y: 108 },
        { id: 2, x: 140, y: 108 },
        { id: 3, x: 208, y: 158 },
        { id: 4, x: 276, y: 108 },
      ],
      bonds: [
        [1, 2],
        [2, 3],
        [3, 4],
      ],
      double: [1, 2],
      hydrogens: [
        { x: 28, y: 58, from: 1, label: "H" },
        { x: 28, y: 158, from: 1, label: "H" },
      ],
    };
  }
  if (group === "=" && p === 4) {
    return {
      pts: [
        { id: 1, x: 56, y: 108 },
        { id: 2, x: 124, y: 158 },
        { id: 3, x: 192, y: 108 },
        { id: 4, x: 276, y: 108 },
      ],
      bonds: [
        [1, 2],
        [2, 3],
        [3, 4],
      ],
      double: [3, 4],
      hydrogens: [
        { x: 304, y: 58, from: 4, label: "H" },
        { x: 304, y: 158, from: 4, label: "H" },
      ],
    };
  }
  return {
    pts: [
      { id: 1, x: 56, y: 142 },
      { id: 2, x: 124, y: 78 },
      { id: 3, x: 192, y: 142 },
      { id: 4, x: 260, y: 78 },
    ],
    bonds: [
      [1, 2],
      [2, 3],
      [3, 4],
    ],
    double: null,
    hydrogens: [],
  };
}

function groupTip(skel, pos, attach) {
  const p = Number(pos);
  if (skel === "iso") {
    if (p === 2) return { x: attach.x, y: attach.y + 54, tx: attach.x + 18, ty: attach.y + 68 };
    if (p === 4) return { x: attach.x + 4, y: attach.y - 50, tx: attach.x + 22, ty: attach.y - 54 };
    if (p === 1) return { x: attach.x - 50, y: attach.y + 16, tx: attach.x - 74, ty: attach.y + 22 };
    return { x: attach.x + 50, y: attach.y + 16, tx: attach.x + 74, ty: attach.y + 22 };
  }
  if (p === 1) return { x: attach.x - 50, y: attach.y + 38, tx: attach.x - 76, ty: attach.y + 44 };
  if (p === 2) return { x: attach.x, y: attach.y - 52, tx: attach.x + 18, ty: attach.y - 56 };
  if (p === 3) return { x: attach.x, y: attach.y + 52, tx: attach.x + 18, ty: attach.y + 60 };
  return { x: attach.x + 50, y: attach.y - 38, tx: attach.x + 76, ty: attach.y - 44 };
}

function skeletalSvg(skel, group, pos, geo = "cis", opts = {}) {
  const mini = Boolean(opts.mini);
  const layout = molLayout(skel, group, pos, geo);
  const byId = Object.fromEntries(layout.pts.map((pt) => [pt.id, pt]));
  const ink = "var(--color-fg)";
  const bonds = layout.bonds
    .map(([a, b]) => {
      const isD = layout.double && ((layout.double[0] === a && layout.double[1] === b) || (layout.double[0] === b && layout.double[1] === a));
      return bondStroke(byId[a], byId[b], isD ? 2 : 1, isD ? "var(--color-electron)" : ink);
    })
    .join("");
  const hydrogens = layout.hydrogens
    .map((h) => {
      const from = byId[h.from];
      return `<line x1="${from.x}" y1="${from.y}" x2="${h.x}" y2="${h.y}" stroke="${ink}" stroke-width="1.7" stroke-linecap="round"/><text x="${h.x + (h.x - from.x) * 0.22}" y="${h.y + (h.y - from.y) * 0.22 + 4}" text-anchor="middle" fill="var(--color-muted)" font-size="${mini ? 10 : 12}" font-family="var(--font-sans)">${h.label}</text>`;
    })
    .join("");
  let groupMark = "";
  if (group === "oh" || group === "cl") {
    const attach = byId[Number(pos)] ?? layout.pts[0];
    const tip = groupTip(skel, pos, attach);
    const col = group === "oh" ? "var(--color-electron)" : "var(--color-warn)";
    const label = group === "oh" ? "OH" : "Cl";
    groupMark = `<line x1="${attach.x}" y1="${attach.y}" x2="${tip.x}" y2="${tip.y}" stroke="${col}" stroke-width="2.6" stroke-linecap="round"/><text x="${tip.tx}" y="${tip.ty}" fill="${col}" font-size="${mini ? 12 : 15}" font-family="var(--font-sans)" font-weight="500">${label}</text>`;
  }
  const verts = layout.pts
    .map((pt) => {
      const on = !mini && pt.id === Number(pos) && group !== "h";
      const nOff = skel === "iso"
        ? pt.id === 2
          ? { x: 14, y: -6 }
          : pt.id === 4
            ? { x: 16, y: 6 }
            : pt.id === 1
              ? { x: -12, y: 16 }
              : { x: 12, y: 16 }
        : pt.id % 2 === 1
          ? { x: 0, y: 18 }
          : { x: 0, y: -16 };
      const num = mini
        ? ""
        : `<text x="${pt.x + nOff.x}" y="${pt.y + nOff.y}" text-anchor="middle" fill="var(--color-subtle)" font-size="10" font-family="var(--font-mono)">${pt.id}</text>`;
      const hit = mini
        ? ""
        : `<circle class="iso-hit" cx="${pt.x}" cy="${pt.y}" r="22" fill="transparent" data-act="iso-pos:${pt.id}"/>`;
      return `<circle cx="${pt.x}" cy="${pt.y}" r="${on ? 5 : 3.1}" fill="${on ? "var(--color-electron)" : ink}"/>${num}${hit}`;
    })
    .join("");
  return `<svg viewBox="0 0 340 210" class="mol-svg${mini ? " is-mini" : ""}" role="img" aria-label="Formula di struttura">${bonds}${hydrogens}${groupMark}${verts}</svg>`;
}

function molCoords3d(skel, group, pos, geo) {
  const p = Number(pos);
  let carbons;
  if (skel === "iso") {
    carbons = [
      { id: 1, el: "C", x: -1.35, y: 0.55, z: 0.75 },
      { id: 2, el: "C", x: 0, y: 0, z: 0 },
      { id: 3, el: "C", x: 1.35, y: 0.55, z: 0.75 },
      { id: 4, el: "C", x: 0, y: -0.4, z: -1.32 },
    ];
  } else if (group === "=" && (p === 2 || p === 3)) {
    const cis = geo !== "trans";
    carbons = [
      { id: 1, el: "C", x: -1.9, y: 0.9, z: 0.25 },
      { id: 2, el: "C", x: -0.55, y: 0, z: 0 },
      { id: 3, el: "C", x: 0.55, y: 0, z: 0 },
      { id: 4, el: "C", x: 1.9, y: cis ? 0.9 : -0.9, z: 0.25 },
    ];
  } else if (group === "=" && p === 1) {
    carbons = [
      { id: 1, el: "C", x: -1.75, y: 0, z: 0 },
      { id: 2, el: "C", x: -0.4, y: 0, z: 0 },
      { id: 3, el: "C", x: 0.85, y: 0.72, z: 0.4 },
      { id: 4, el: "C", x: 2.0, y: 0.38, z: -0.45 },
    ];
  } else if (group === "=" && p === 4) {
    carbons = [
      { id: 1, el: "C", x: -2.0, y: 0.38, z: -0.45 },
      { id: 2, el: "C", x: -0.85, y: 0.72, z: 0.4 },
      { id: 3, el: "C", x: 0.4, y: 0, z: 0 },
      { id: 4, el: "C", x: 1.75, y: 0, z: 0 },
    ];
  } else {
    carbons = [
      { id: 1, el: "C", x: -1.92, y: 0.48, z: 0.55 },
      { id: 2, el: "C", x: -0.64, y: 0, z: -0.18 },
      { id: 3, el: "C", x: 0.64, y: 0, z: 0.18 },
      { id: 4, el: "C", x: 1.92, y: 0.48, z: -0.55 },
    ];
  }
  const double =
    group === "="
      ? skel === "iso"
        ? [2, 4]
        : p === 1
          ? [1, 2]
          : p === 4
            ? [3, 4]
            : [2, 3]
      : null;
  const bonds =
    skel === "iso"
      ? [
          [1, 2, 1],
          [2, 3, 1],
          [2, 4, double ? 2 : 1],
        ]
      : [
          [1, 2, double && double[0] === 1 ? 2 : 1],
          [2, 3, double && double[0] === 2 ? 2 : 1],
          [3, 4, double && double[0] === 3 ? 2 : 1],
        ];
  const extra = [];
  if (group === "oh" || group === "cl") {
    const c = carbons.find((a) => a.id === p) || carbons[0];
    let ox = 0;
    let oy = 1.15;
    let oz = 0.2;
    if (skel === "iso") {
      if (p === 2) {
        ox = 0;
        oy = 1.2;
        oz = 0.15;
      } else if (p === 4) {
        ox = 0.15;
        oy = -1.05;
        oz = -0.45;
      } else if (p === 1) {
        ox = -0.95;
        oy = 0.25;
        oz = 1.05;
      } else {
        ox = 0.95;
        oy = 0.25;
        oz = 1.05;
      }
    } else if (p === 1) {
      ox = -0.75;
      oy = -1.0;
      oz = 0.45;
    } else if (p === 2) {
      ox = 0;
      oy = 1.18;
      oz = -0.2;
    } else if (p === 3) {
      ox = 0;
      oy = -1.18;
      oz = 0.2;
    } else {
      ox = 0.75;
      oy = 1.0;
      oz = 0.35;
    }
    extra.push({
      id: 10,
      el: group === "oh" ? "O" : "Cl",
      x: c.x + ox,
      y: c.y + oy,
      z: c.z + oz,
      label: group === "oh" ? "OH" : "Cl",
    });
    bonds.push([p, 10, 1]);
  }
  return { atoms: carbons.concat(extra), bonds, double };
}

function project3d(x, y, z, depth) {
  const d = Math.max(0, Math.min(1, depth));
  const yaw = -0.7 * d;
  const pitch = 0.4 * d;
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  let X = x * cy + z * sy;
  let Z = -x * sy + z * cy;
  let Y = y * cp - Z * sp;
  Z = y * sp + Z * cp;
  const s = 1 / Math.max(0.55, 1 - Z * 0.16);
  return { x: 170 + X * 56 * s, y: 108 - Y * 56 * s, z: Z, s };
}

function atomColor(el) {
  if (el === "O") return PAL.electron;
  if (el === "Cl") return PAL.warn;
  if (el === "H") return PAL.muted;
  if (el === "N") return "#4a78a8";
  return PAL.valence;
}

function isoMoleculeSvg(skel, group, pos, geo = "cis", depth = 1, opts = {}) {
  const d = Math.max(0, Math.min(1, Number(depth) || 0));
  const layout = molLayout(skel, group, pos, geo);
  const space = molCoords3d(skel, group, pos, geo);
  const byFlat = Object.fromEntries(layout.pts.map((pt) => [pt.id, pt]));
  const gid = uid("g");
  const projected = space.atoms.map((a) => {
    const p3 = project3d(a.x, a.y, a.z, d);
    const f = byFlat[a.id];
    const fx = f ? f.x : p3.x;
    const fy = f ? f.y : p3.y;
    return {
      ...a,
      px: fx * (1 - d) + p3.x * d,
      py: fy * (1 - d) + p3.y * d,
      pz: p3.z,
      s: p3.s,
    };
  });
  const byId = Object.fromEntries(projected.map((a) => [a.id, a]));
  const bondDraw = space.bonds
    .map(([a, b, order]) => {
      const p = byId[a];
      const q = byId[b];
      if (!p || !q) return null;
      const z = (p.pz + q.pz) / 2;
      const col = order === 2 ? PAL.electron : hexMix(PAL.fg, PAL.core, d * 0.35);
      const sw = 2.3 + d * 4.2 * ((p.s + q.s) / 2);
      let mark = `<line x1="${p.px}" y1="${p.py}" x2="${q.px}" y2="${q.py}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round"/>`;
      if (order === 2 && d < 0.55) {
        mark = bondStroke({ x: p.px, y: p.py }, { x: q.px, y: q.py }, 2, PAL.electron);
      }
      return { z, html: mark };
    })
    .filter(Boolean);
  const atomDraw = projected.map((a) => {
    const on = a.id === Number(pos) && group !== "h" && a.el === "C";
    const r2 = on ? 5 : 3.1;
    const r3 = (a.el === "Cl" ? 16 : a.el === "O" ? 15 : 13) * a.s;
    const r = r2 * (1 - d) + r3 * d;
    const col = a.el === "C" ? (on ? PAL.electron : PAL.fg) : atomColor(a.el);
    const grad = `${gid}-${a.id}`;
    const highlight = hexMix("#ffffff", col, 0.55);
    const defs = `<radialGradient id="${grad}" cx="32%" cy="28%" r="70%"><stop offset="0" stop-color="${highlight}"/><stop offset="1" stop-color="${col}"/></radialGradient>`;
    const fill = d > 0.25 ? `url(#${grad})` : col;
    const label3 =
      d > 0.42
        ? `<text x="${a.px}" y="${a.py + 1}" text-anchor="middle" dominant-baseline="middle" fill="${PAL.accentFg}" font-size="${Math.max(9, r * 0.7)}" font-family="var(--font-sans)" font-weight="600">${a.label || a.el}</text>`
        : "";
    const nOff =
      skel === "iso"
        ? a.id === 2
          ? { x: 14, y: -6 }
          : a.id === 4
            ? { x: 16, y: 6 }
            : a.id === 1
              ? { x: -12, y: 16 }
              : { x: 12, y: 16 }
        : a.id % 2 === 1
          ? { x: 0, y: 18 }
          : { x: 0, y: -16 };
    const num =
      !opts.mini && a.el === "C" && d < 0.72
        ? `<text x="${a.px + nOff.x * (1 - d)}" y="${a.py + nOff.y * (1 - d)}" text-anchor="middle" fill="${PAL.subtle}" font-size="10" font-family="var(--font-mono)" opacity="${1 - d}">${a.id}</text>`
        : "";
    const hit = opts.mini || a.el !== "C" ? "" : `<circle class="iso-hit" cx="${a.px}" cy="${a.py}" r="22" fill="transparent" data-act="iso-pos:${a.id}"/>`;
    return { z: a.pz, defs, html: `<circle cx="${a.px}" cy="${a.py}" r="${r}" fill="${fill}" stroke="${hexMix(col, PAL.accentFg, 0.35)}" stroke-width="${d > 0.4 ? 1.1 : 0}"/>${label3}${num}${hit}` };
  });
  const hydrogens =
    d < 0.55
      ? layout.hydrogens
          .map((h) => {
            const from = byFlat[h.from];
            if (!from) return "";
            const op = 1 - d * 1.4;
            if (op <= 0) return "";
            return `<line x1="${from.x}" y1="${from.y}" x2="${h.x}" y2="${h.y}" stroke="${PAL.fg}" stroke-width="1.7" stroke-linecap="round" opacity="${op}"/><text x="${h.x}" y="${h.y + 4}" text-anchor="middle" fill="${PAL.muted}" font-size="12" opacity="${op}">${h.label}</text>`;
          })
          .join("")
      : "";
  const group2d =
    d < 0.5 && (group === "oh" || group === "cl")
      ? (() => {
          const attach = byFlat[Number(pos)] ?? layout.pts[0];
          const tip = groupTip(skel, pos, attach);
          const col = group === "oh" ? PAL.electron : PAL.warn;
          const op = 1 - d * 1.6;
          if (op <= 0) return "";
          return `<line x1="${attach.x}" y1="${attach.y}" x2="${tip.x}" y2="${tip.y}" stroke="${col}" stroke-width="2.6" opacity="${op}"/><text x="${tip.tx}" y="${tip.ty}" fill="${col}" font-size="15" opacity="${op}">${group === "oh" ? "OH" : "Cl"}</text>`;
        })()
      : "";
  const layers = bondDraw.concat(atomDraw).sort((a, b) => a.z - b.z);
  const defs = atomDraw.map((a) => a.defs).join("");
  const caption = d > 0.65 ? "modello 3D a sfere" : d < 0.35 ? "formula di struttura 2D" : "proiezione intermedia";
  return `<svg viewBox="0 0 340 210" class="mol-svg" role="img" aria-label="Molecola, ${caption}">
    <defs>${defs}</defs>
    ${hydrogens}${group2d}${layers.map((x) => x.html).join("")}
  </svg>`;
}

function depthControl(act, value, left, right) {
  const pct = Math.round(value * 100);
  return `<div class="iso-depth">
    <div class="iso-view-scale"><span>${esc(left)}</span><span data-live="${act}-lab">${pct < 35 ? right : pct > 65 ? left : "proiezione"}</span><span>${esc(right)}</span></div>
    <input type="range" min="0" max="100" step="1" value="${pct}" data-act="${act}" aria-label="Proiezione 3D verso 2D"/>
  </div>`;
}

function tetra3dSvg(face, mirror, depth) {
  const d = Math.max(0, Math.min(1, Number(depth) || 0));
  const flip = mirror ? -1 : 1;
  const isR = face === "R";
  const groups = [
    { id: "COOH", x: 0, y: 1.25, z: 0.05, col: PAL.warn },
    { id: "OH", x: flip * (isR ? 1.1 : -1.1), y: -0.28, z: 0.78, col: PAL.electron },
    { id: "H", x: flip * (isR ? -1.1 : 1.1), y: -0.32, z: 0.7, col: PAL.muted },
    { id: "CH₃", x: 0, y: -0.55, z: -1.15, col: PAL.core },
  ];
  const C = project3d(0, 0, 0, d);
  const cx2 = 140;
  const cy2 = 96;
  const mapped = groups.map((g) => {
    const p = project3d(g.x, g.y, g.z, d);
    const flat = {
      COOH: { x: cx2, y: 22 },
      "CH₃": { x: cx2 + flip * 86, y: 154 },
      OH: { x: cx2 + flip * 92, y: 52 },
      H: { x: cx2 - flip * 90, y: 136 },
    }[g.id];
    return {
      ...g,
      px: (flat?.x ?? p.x) * (1 - d) + (140 + (p.x - 170)) * d,
      py: (flat?.y ?? p.y) * (1 - d) + (96 + (p.y - 108)) * d,
      pz: p.z,
      s: p.s,
    };
  });
  const gid = uid("t");
  const center = { px: cx2 * (1 - d) + (140 + (C.x - 170)) * d, py: cy2 * (1 - d) + (96 + (C.y - 108)) * d, pz: C.z, s: C.s };
  const bonds = mapped
    .map((g) => {
      const col = g.col;
      const sw = 2.2 + d * 3;
      return { z: (g.pz + center.pz) / 2, html: `<line x1="${center.px}" y1="${center.py}" x2="${g.px}" y2="${g.py}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round"/>` };
    });
  const atomHtml = mapped.map((g) => {
    const r = 4 + d * 12 * g.s;
    const grad = `${gid}-${g.id}`;
    const defs = `<radialGradient id="${grad}" cx="32%" cy="28%" r="70%"><stop offset="0" stop-color="${hexMix("#fff", g.col, 0.5)}"/><stop offset="1" stop-color="${g.col}"/></radialGradient>`;
    const label = `<text x="${g.px}" y="${g.py - r - 6}" text-anchor="middle" fill="${g.col}" font-size="12">${g.id}</text>`;
    return { z: g.pz, defs, html: `<circle cx="${g.px}" cy="${g.py}" r="${r}" fill="${d > 0.3 ? `url(#${grad})` : g.col}"/>${label}` };
  });
  const core = {
    z: center.pz + 0.2,
    defs: "",
    html: `<circle cx="${center.px}" cy="${center.py}" r="${12 + d * 4}" fill="${PAL.elevated}" stroke="${PAL.warn}" stroke-width="1.8"/><text x="${center.px}" y="${center.py + 1}" text-anchor="middle" dominant-baseline="middle" fill="${PAL.warn}" font-size="11" font-family="var(--font-mono)">C*</text>`,
  };
  const layers = bonds.concat(atomHtml).concat([core]).sort((a, b) => a.z - b.z);
  return `<svg viewBox="0 0 280 186" class="mol-svg" role="img" aria-label="Acido lattico ${face}">
    <defs>${atomHtml.map((a) => a.defs).join("")}</defs>
    ${layers.map((x) => x.html).join("")}
    <text x="140" y="182" text-anchor="middle" fill="${PAL.subtle}" font-size="11">${mirror ? "immagine speculare" : `configurazione ${face}`}</text>
  </svg>`;
}

function isomerFamily(skel, group) {
  if (group === "h") {
    return [
      { skel: "n", group: "h", pos: 1, geo: "cis", name: "butano" },
      { skel: "iso", group: "h", pos: 2, geo: "cis", name: "2-metilpropano" },
    ];
  }
  if (group === "oh") {
    return [
      { skel: "n", group: "oh", pos: 1, geo: "cis", name: "butan-1-olo" },
      { skel: "n", group: "oh", pos: 2, geo: "cis", name: "butan-2-olo" },
      { skel: "iso", group: "oh", pos: 1, geo: "cis", name: "2-metilpropan-1-olo" },
      { skel: "iso", group: "oh", pos: 2, geo: "cis", name: "2-metilpropan-2-olo" },
    ];
  }
  if (group === "cl") {
    return [
      { skel: "n", group: "cl", pos: 1, geo: "cis", name: "1-clorobutano" },
      { skel: "n", group: "cl", pos: 2, geo: "cis", name: "2-clorobutano" },
      { skel: "iso", group: "cl", pos: 1, geo: "cis", name: "1-cloro-2-metilpropano" },
      { skel: "iso", group: "cl", pos: 2, geo: "cis", name: "2-cloro-2-metilpropano" },
    ];
  }
  return [
    { skel: "n", group: "=", pos: 1, geo: "cis", name: "but-1-ene" },
    { skel: "n", group: "=", pos: 2, geo: "cis", name: "but-2-ene" },
    { skel: "iso", group: "=", pos: 2, geo: "cis", name: "2-metilpropene" },
  ];
}

function familyStrip(skel, group, pos, geo) {
  const info = describeIsomer({ skel, group, pos });
  return `<div class="iso-family">${isomerFamily(skel, group)
    .map((m) => {
      const other = describeIsomer(m);
      let active = other.name === info.name;
      if (info.name === "but-2-ene") {
        active = m.skel === "n" && m.group === "=" && m.pos === 2;
      }
      return `<button type="button" class="iso-mini${active ? " is-on" : ""}" data-act="iso-set:${m.skel}:${m.group}:${m.pos}:${m.geo}">
        ${skeletalSvg(m.skel, m.group, m.pos, m.geo, { mini: true })}
        <span>${esc(m.name)}</span>
      </button>`;
    })
    .join("")}</div>`;
}

function functionalSvg(id) {
  const map = {
    etoh: `<svg viewBox="0 0 260 120" class="mol-svg"><line x1="36" y1="78" x2="108" y2="42" stroke="var(--color-fg)" stroke-width="2.5" stroke-linecap="round"/><line x1="108" y1="42" x2="176" y2="78" stroke="var(--color-electron)" stroke-width="2.5" stroke-linecap="round"/><circle cx="36" cy="78" r="3" fill="var(--color-fg)"/><circle cx="108" cy="42" r="3" fill="var(--color-fg)"/><text x="196" y="84" fill="var(--color-electron)" font-size="16" font-family="var(--font-sans)" font-weight="500">OH</text></svg>`,
    dme: `<svg viewBox="0 0 260 120" class="mol-svg"><line x1="36" y1="64" x2="104" y2="64" stroke="var(--color-fg)" stroke-width="2.5" stroke-linecap="round"/><line x1="156" y1="64" x2="224" y2="64" stroke="var(--color-fg)" stroke-width="2.5" stroke-linecap="round"/><circle cx="130" cy="64" r="13" fill="var(--color-elevated)" stroke="var(--color-electron)" stroke-width="1.6"/><text x="130" y="68" text-anchor="middle" fill="var(--color-electron)" font-size="14" font-family="var(--font-sans)">O</text><text x="18" y="54" fill="var(--color-muted)" font-size="12">H₃C</text><text x="228" y="54" fill="var(--color-muted)" font-size="12">CH₃</text></svg>`,
    propanal: `<svg viewBox="0 0 280 120" class="mol-svg"><line x1="36" y1="78" x2="100" y2="44" stroke="var(--color-fg)" stroke-width="2.5" stroke-linecap="round"/><line x1="100" y1="44" x2="168" y2="78" stroke="var(--color-fg)" stroke-width="2.5" stroke-linecap="round"/><line x1="168" y1="78" x2="224" y2="40" stroke="var(--color-warn)" stroke-width="2.5"/><line x1="164" y1="74" x2="220" y2="36" stroke="var(--color-warn)" stroke-width="2"/><circle cx="36" cy="78" r="3" fill="var(--color-fg)"/><circle cx="100" cy="44" r="3" fill="var(--color-fg)"/><circle cx="168" cy="78" r="3" fill="var(--color-fg)"/><text x="232" y="36" fill="var(--color-warn)" font-size="14">O</text><text x="176" y="102" fill="var(--color-muted)" font-size="12">H</text></svg>`,
    acetone: `<svg viewBox="0 0 280 130" class="mol-svg"><line x1="40" y1="86" x2="116" y2="86" stroke="var(--color-fg)" stroke-width="2.5" stroke-linecap="round"/><line x1="144" y1="86" x2="220" y2="86" stroke="var(--color-fg)" stroke-width="2.5" stroke-linecap="round"/><line x1="130" y1="86" x2="130" y2="32" stroke="var(--color-warn)" stroke-width="2.5"/><line x1="136" y1="86" x2="136" y2="32" stroke="var(--color-warn)" stroke-width="2"/><circle cx="130" cy="86" r="12" fill="var(--color-elevated)" stroke="var(--color-border-strong)"/><text x="130" y="90" text-anchor="middle" fill="var(--color-fg)" font-size="13">C</text><text x="140" y="24" fill="var(--color-warn)" font-size="14">O</text><text x="24" y="76" fill="var(--color-muted)" font-size="12">H₃C</text><text x="226" y="76" fill="var(--color-muted)" font-size="12">CH₃</text></svg>`,
    propoh: `<svg viewBox="0 0 280 120" class="mol-svg"><line x1="36" y1="78" x2="104" y2="42" stroke="var(--color-fg)" stroke-width="2.5" stroke-linecap="round"/><line x1="104" y1="42" x2="172" y2="78" stroke="var(--color-fg)" stroke-width="2.5" stroke-linecap="round"/><line x1="172" y1="78" x2="230" y2="46" stroke="var(--color-electron)" stroke-width="2.5" stroke-linecap="round"/><circle cx="36" cy="78" r="3" fill="var(--color-fg)"/><circle cx="104" cy="42" r="3" fill="var(--color-fg)"/><circle cx="172" cy="78" r="3" fill="var(--color-fg)"/><text x="240" y="44" fill="var(--color-electron)" font-size="15" font-family="var(--font-sans)" font-weight="500">OH</text></svg>`,
    eme: `<svg viewBox="0 0 280 120" class="mol-svg"><line x1="28" y1="64" x2="90" y2="64" stroke="var(--color-fg)" stroke-width="2.5"/><circle cx="112" cy="64" r="13" fill="var(--color-elevated)" stroke="var(--color-electron)" stroke-width="1.6"/><text x="112" y="68" text-anchor="middle" fill="var(--color-electron)" font-size="14">O</text><line x1="134" y1="64" x2="188" y2="38" stroke="var(--color-fg)" stroke-width="2.5" stroke-linecap="round"/><line x1="188" y1="38" x2="244" y2="64" stroke="var(--color-fg)" stroke-width="2.5" stroke-linecap="round"/><circle cx="188" cy="38" r="3" fill="var(--color-fg)"/><circle cx="244" cy="64" r="3" fill="var(--color-fg)"/><text x="16" y="54" fill="var(--color-muted)" font-size="12">H₃C</text></svg>`,
  };
  return map[id] ?? "";
}

function newmanSvg(angle) {
  const rad = (d) => (d * Math.PI) / 180;
  const cx = 120;
  const cy = 118;
  const rf = 58;
  const rb = 74;
  const ecl = Math.min(...[0, 120, 240].map((k) => Math.abs(((angle - k + 180) % 360) - 180)));
  const isEcl = ecl < 12;
  const drawAngle = isEcl ? angle + 8 : angle;
  const front = [0, 120, 240].map((base) => {
    const a = rad(base + drawAngle);
    return { x: cx + rf * Math.sin(a), y: cy - rf * Math.cos(a) };
  });
  const back = [0, 120, 240].map((base) => {
    const a = rad(base);
    return { x: cx + rb * Math.sin(a), y: cy - rb * Math.cos(a) };
  });
  const isStag = Math.abs(((angle % 120) - 60)) < 12;
  return `<svg viewBox="0 0 240 240" class="mol-svg newman" role="img" aria-label="Proiezione di Newman dell’etano">
    <defs>
      <radialGradient id="newman-disk" cx="42%" cy="38%" r="62%">
        <stop offset="0" stop-color="${hexMix(PAL.elevated, PAL.fg, 0.28)}"/>
        <stop offset="1" stop-color="var(--color-elevated)"/>
      </radialGradient>
    </defs>
    ${back
      .map(
        (p) =>
          `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="var(--color-core)" stroke-width="2.3" stroke-linecap="round"/><circle cx="${p.x}" cy="${p.y}" r="8" fill="var(--color-core)"/><text x="${p.x + (p.x - cx) * 0.16}" y="${p.y + (p.y - cy) * 0.16 + 1}" text-anchor="middle" dominant-baseline="middle" fill="var(--color-muted)" font-size="11">H</text>`,
      )
      .join("")}
    <circle cx="${cx}" cy="${cy}" r="36" fill="url(#newman-disk)" stroke="var(--color-border-strong)" stroke-width="3"/>
    ${front
      .map(
        (p) =>
          `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="var(--color-valence)" stroke-width="2.8" stroke-linecap="round"/><circle cx="${p.x}" cy="${p.y}" r="8" fill="var(--color-valence)"/><text x="${p.x + (p.x - cx) * 0.18}" y="${p.y + (p.y - cy) * 0.18 + 1}" text-anchor="middle" dominant-baseline="middle" fill="var(--color-fg)" font-size="11">H</text>`,
      )
      .join("")}
    <circle cx="${cx}" cy="${cy}" r="5" fill="var(--color-fg)"/>
    <text x="120" y="228" text-anchor="middle" fill="var(--color-subtle)" font-size="11" font-family="var(--font-mono)">${isEcl ? "eclissato" : isStag ? "sfalsato" : `ω = ${Math.round(angle)}°`}</text>
  </svg>`;
}

function energyCurve(angle) {
  const w = 280;
  const h = 92;
  const pts = [];
  for (let i = 0; i <= 72; i += 1) {
    const deg = (i / 72) * 360;
    const e = 0.5 * (1 + Math.cos((3 * deg * Math.PI) / 180));
    pts.push(`${(i / 72) * w},${h - 10 - e * (h - 28)}`);
  }
  const t = angle / 360;
  const eNow = 0.5 * (1 + Math.cos((3 * angle * Math.PI) / 180));
  const x = t * w;
  const y = h - 10 - eNow * (h - 28);
  const ticks = [0, 60, 120, 180, 240, 300].map((d) => {
    const tx = (d / 360) * w;
    return `<line x1="${tx}" y1="${h - 8}" x2="${tx}" y2="${h - 4}" stroke="var(--color-subtle)"/><text x="${tx}" y="${h}" text-anchor="middle" fill="var(--color-subtle)" font-size="8">${d}°</text>`;
  }).join("");
  return `<svg viewBox="0 0 ${w} ${h}" class="energy-svg" role="img" aria-label="Energia di torsione">
    <polygon points="0,${h - 10} ${pts.join(" ")} ${w},${h - 10}" fill="${rgba(PAL.electron, 0.16)}"/>
    <polyline points="${pts.join(" ")}" fill="none" stroke="var(--color-electron)" stroke-width="1.8"/>
    <circle cx="${x}" cy="${y}" r="4.5" fill="var(--color-fg)"/>
    <text x="6" y="12" fill="var(--color-subtle)" font-size="9">E</text>
    ${ticks}
  </svg>`;
}

function buteneSvg(geo) {
  const cis = geo === "cis";
  return `<svg viewBox="0 0 320 190" class="mol-svg" role="img" aria-label="But-2-ene ${geo}">
    <line x1="112" y1="88" x2="208" y2="88" stroke="var(--color-electron)" stroke-width="2.8" stroke-linecap="round"/>
    <line x1="112" y1="98" x2="208" y2="98" stroke="var(--color-electron)" stroke-width="2.8" stroke-linecap="round"/>
    <circle cx="110" cy="93" r="4" fill="var(--color-fg)"/>
    <circle cx="210" cy="93" r="4" fill="var(--color-fg)"/>
    <line x1="110" y1="93" x2="52" y2="40" stroke="var(--color-fg)" stroke-width="2.4" stroke-linecap="round"/>
    <line x1="110" y1="93" x2="52" y2="146" stroke="var(--color-fg)" stroke-width="2.4" stroke-linecap="round"/>
    <line x1="210" y1="93" x2="268" y2="${cis ? 40 : 146}" stroke="var(--color-fg)" stroke-width="2.4" stroke-linecap="round"/>
    <line x1="210" y1="93" x2="268" y2="${cis ? 146 : 40}" stroke="var(--color-fg)" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="52" cy="40" r="3" fill="var(--color-fg)"/>
    <circle cx="268" cy="${cis ? 40 : 146}" r="3" fill="var(--color-fg)"/>
    <text x="28" y="36" fill="var(--color-electron)" font-size="13">CH₃</text>
    <text x="36" y="158" fill="var(--color-muted)" font-size="13">H</text>
    <text x="276" y="${cis ? 36 : 158}" fill="var(--color-electron)" font-size="13">CH₃</text>
    <text x="280" y="${cis ? 158 : 36}" fill="var(--color-muted)" font-size="13">H</text>
    <text x="160" y="182" text-anchor="middle" fill="var(--color-subtle)" font-size="12">${cis ? "cis · Z  ·  i due CH₃ dalla stessa parte" : "trans · E  ·  i due CH₃ opposti"}</text>
  </svg>`;
}

function tetraSvg(face, mirror) {
  const flip = mirror ? -1 : 1;
  const cx = 140;
  const cy = 96;
  const cooh = { x: cx, y: 22 };
  const ch3 = { x: cx + flip * 86, y: 154 };
  const oh = { x: cx + flip * 92, y: 52 };
  const h = { x: cx - flip * 90, y: 136 };
  const isR = face === "R";
  const wedge = isR ? oh : h;
  const dash = isR ? h : oh;
  const dashPts = Array.from({ length: 8 }, (_, i) => {
    const t = i / 7;
    const x = cx + (dash.x - cx) * t;
    const y = cy + (dash.y - cy) * t;
    const w = 0.5 + t * 6;
    return `<line x1="${x}" y1="${y - w}" x2="${x}" y2="${y + w}" stroke="var(--color-fg)" stroke-width="1.35"/>`;
  }).join("");
  return `<svg viewBox="0 0 280 186" class="mol-svg" role="img" aria-label="Acido lattico ${face}">
    <line x1="${cx}" y1="${cy}" x2="${cooh.x}" y2="${cooh.y}" stroke="var(--color-fg)" stroke-width="2.3"/>
    <line x1="${cx}" y1="${cy}" x2="${ch3.x}" y2="${ch3.y}" stroke="var(--color-fg)" stroke-width="2.3"/>
    <polygon points="${cx},${cy} ${wedge.x - 8},${wedge.y} ${wedge.x + 8},${wedge.y}" fill="var(--color-electron)"/>
    ${dashPts}
    <circle cx="${cx}" cy="${cy}" r="12" fill="var(--color-elevated)" stroke="var(--color-warn)" stroke-width="1.8"/>
    <text x="${cx}" y="${cy + 1}" text-anchor="middle" dominant-baseline="middle" fill="var(--color-warn)" font-size="11" font-family="var(--font-mono)">C*</text>
    <text x="${cooh.x}" y="${cooh.y - 6}" text-anchor="middle" fill="var(--color-fg)" font-size="13">COOH</text>
    <text x="${ch3.x + flip * 10}" y="${ch3.y + 16}" text-anchor="middle" fill="var(--color-muted)" font-size="13">CH₃</text>
    <text x="${oh.x + flip * 16}" y="${oh.y + 4}" fill="var(--color-electron)" font-size="14">OH</text>
    <text x="${h.x - flip * 12}" y="${h.y + 4}" fill="var(--color-muted)" font-size="14">H</text>
    <text x="140" y="182" text-anchor="middle" fill="var(--color-subtle)" font-size="11">${mirror ? "immagine speculare" : `configurazione ${face}`}</text>
  </svg>`;
}

function polarimeter(face) {
  const dir = face === "R" ? 32 : -32;
  return `<svg viewBox="0 0 280 96" class="polarimeter" role="img" aria-label="Luce polarizzata">
    <rect x="10" y="40" width="72" height="12" rx="2" fill="var(--color-valence)" opacity="0.9"/>
    <text x="12" y="28" fill="var(--color-subtle)" font-size="9">polarizzatore</text>
    <rect x="100" y="26" width="72" height="42" rx="8" fill="var(--color-elevated)" stroke="var(--color-border-strong)"/>
    <text x="136" y="50" text-anchor="middle" fill="var(--color-fg)" font-size="12">${face}</text>
    <g transform="translate(226 46) rotate(${dir})">
      <rect x="-42" y="-3" width="84" height="6" rx="2" fill="var(--color-electron)"/>
      <polygon points="42,0 30,-8 30,8" fill="var(--color-electron)"/>
    </g>
    <text x="176" y="88" fill="var(--color-subtle)" font-size="9">${face === "R" ? "destrogiro (+)" : "levogiro (−)"} · schema didattico (R/S ≠ segno ottico)</text>
  </svg>`;
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
  const el = state.symbol ? getElement(state.symbol) : null;
  const layers = el ? splitCoreValence(el.occupancy, el.block) : null;
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
      : `<p class="scroll-hint">Scorri la tavola in orizzontale.</p>${tableHtml(el ? el.symbol : null, state.cat, state.heat)}`;
  const peek = el
    ? `<section class="peek">
      ${bohrSvg(el, 260)}
      <div>
        <div class="peek-meta"><span class="mono subtle">${el.z}</span> ${badge(CATEGORY_LABEL[el.category])}${el.exception ? badge("Eccezione Aufbau") : ""}</div>
        <h2>${esc(el.symbol)} <span class="muted">${esc(el.name)}</span></h2>
        <p class="mono cfg">${esc(formatCondensed(el.occupancy, el.z))}</p>
        <p class="muted">Core ${layers.coreCount} · valenza ${layers.valenceCount} · ${layers.unpaired} spaiati · ${layers.magnetic}</p>
        <a class="btn" href="#/elemento/${el.symbol}" data-act="go" data-hash="/elemento/${el.symbol}">Scheda completa</a>
      </div>
    </section>`
    : `<section class="peek peek-idle">
      <div class="bohr-idle">${idleAtomSvg()}</div>
      <div>
        <p class="kicker">Scheda elemento</p>
        <h2>Nessuna selezione</h2>
        <p class="lede">Tocca una casella della tavola per vedere gusci, configurazione e scheda. All’avvio non c’è nessun elemento pre-selezionato.</p>
      </div>
    </section>`;
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
    ${peek}
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
          <span data-live="z-label">Z = <b class="mono">${z}</b> · ${esc(element.name)} <span class="mono">${esc(element.symbol)}</span></span>
          <input type="range" min="1" max="118" value="${z}" data-act="z" aria-label="Numero atomico"/>
        </label>
        <div class="aufbau-map" data-live="z-map">${DIAGRAM.map((row) => {
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
        <p class="mono cfg mt" data-live="z-cfg">${esc(formatCondensed(occ, z))}</p>
        <p class="tiny ${element.exception ? "warn" : "muted"}" data-live="z-note">${
          element.exception
            ? "Eccezione: la configurazione reale differisce dall’ordine Madelung puro."
            : "Segue l’ordine n+ℓ (Madelung). Diagonale: 4s prima di 3d, 5s prima di 4d, 6s prima di 4f."
        }</p>
      </div>
      <aside class="stack">
        <div class="card">
          <p class="kicker">Sequenza Madelung</p>
          <ol class="madelung" data-live="z-madelung">${AUFBAU_ORDER.map((id, i) => `<li class="${(occ[id] ?? 0) > 0 ? "is-fill" : ""}${state.focusOrb === id ? " is-on" : ""}"><span class="subtle">${i + 1}.</span> ${id}</li>`).join("")}</ol>
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
          <svg viewBox="0 0 160 160" class="shape"><circle cx="80" cy="80" r="48" fill="${rgba(PAL.electron, 0.35)}" stroke="${PAL.electron}"/><circle cx="80" cy="80" r="4" fill="${PAL.fg}"/></svg>
          <p class="muted tiny">Sfera centrata sul nucleo. 1 orbitale, 2 e⁻.</p>
        </div>
        <div class="card">
          <p class="kicker">Orbitali p</p>
          <svg viewBox="0 0 200 120" class="shape"><ellipse cx="55" cy="60" rx="28" ry="18" fill="${rgba(PAL.valence, 0.35)}" stroke="${PAL.valence}"/><ellipse cx="145" cy="60" rx="28" ry="18" fill="${rgba(PAL.valence, 0.35)}" stroke="${PAL.valence}"/><circle cx="100" cy="60" r="4" fill="${PAL.fg}"/></svg>
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
  if (id === "quantita") {
    const spec = LAB_SPECIES.find((s) => s.id === state.labCmp) ?? LAB_SPECIES[0];
    const M = formulaMass(spec.parts);
    const mass = Number(state.labMass) || 0;
    const vol = Math.max(0.01, Number(state.labVol) || 0.25);
    const n = M > 0 ? mass / M : 0;
    const N = n * NA;
    const c = n / vol;
    const fill = spec.id === "fe" ? rgba(PAL.core, 0.55) : rgba(PAL.electron, 0.45);
    const partsLine = spec.parts.map(([sym, k]) => `${k > 1 ? k : ""}${sym}`).join(" + ");
    return `<div class="stack">
      <p class="lede">La mole è un conteggio. La bilancia legge grammi; M (g/mol) li converte in n. Poi n entra nel matraccio: c = n / V.</p>
      <div class="chips">${LAB_SPECIES.map((s) => chip(s.id === spec.id, `labcmp:${s.id}`, s.formula)).join("")}</div>
      <div class="split">
        <div class="card lab-stage">
          <p class="kicker">Banco · ${esc(spec.name)}</p>
          <div data-live="lab-beaker">${beakerSvg(fill, spec.name, { level: Math.min(0.82, 0.25 + n * 0.12), bubbles: n > 0.4 })}</div>
          <div class="stats-3" data-live="lab-stats">
            <div class="stat"><p class="kicker">M</p><p class="stat-v">${fmtMass(M)}</p><p class="muted">g/mol</p></div>
            <div class="stat is-on"><p class="kicker">n</p><p class="stat-v">${n < 0.1 ? n.toFixed(3) : n.toFixed(2)}</p><p class="muted">mol</p></div>
            <div class="stat"><p class="kicker">N</p><p class="stat-v tiny-stat">${fmtSci(N)}</p><p class="muted">entità</p></div>
          </div>
        </div>
        <div class="stack">
          <div class="card">
            <p class="kicker">Massa pesata</p>
            <label class="range">
              <span data-live="lab-mass-lab">${fmtMass(mass)} g · n = m / M</span>
              <input type="range" min="0.5" max="${Math.max(40, Math.round(M * 4))}" step="0.5" value="${mass}" data-act="lab-mass" aria-label="Massa in grammi"/>
            </label>
            <p class="mono cfg-sm">${esc(partsLine)} → ${fmtMass(M)} g/mol</p>
            <p class="lede">${esc(spec.hint)}</p>
          </div>
          <div class="card">
            <p class="kicker">Matraccio · molarità</p>
            <div class="lab-row">
              <div data-live="lab-flask">${flaskSvg(c, fill)}</div>
              <div>
                <label class="range">
                  <span data-live="lab-vol-lab">V = ${vol.toFixed(2)} L</span>
                  <input type="range" min="0.05" max="2" step="0.05" value="${vol}" data-act="lab-vol" aria-label="Volume in litri"/>
                </label>
                <div data-live="lab-conc">
                <p class="display">${c >= 10 ? c.toFixed(1) : c.toFixed(2)} <span class="muted">mol/L</span></p>
                <p class="muted tiny">c = n / V = ${n.toFixed(3)} / ${vol.toFixed(2)}</p>
                </div>
                <p class="muted tiny">Per diluire: c₁V₁ = c₂V₂. Il soluto (moli) resta, cambia solo V.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="props">
        <div class="prop"><p class="kicker">n = m / M</p><p>Grammi → moli</p></div>
        <div class="prop"><p class="kicker">N = n · NA</p><p>Moli → particelle</p></div>
        <div class="prop"><p class="kicker">c = n / V</p><p>Moli → mol/L</p></div>
        <div class="prop"><p class="kicker">NA</p><p>6,022×10²³ mol⁻¹</p></div>
      </div>
    </div>`;
  }
  if (id === "phlab") {
    const pH = Number(state.phValue);
    const h = hFromPh(pH);
    const oh = 1e-14 / h;
    const pOH = 14 - pH;
    const css = phColorCss(pH);
    const kind = pH < 3 ? "acido forte" : pH < 6.5 ? "acido" : pH <= 7.5 ? "neutro" : pH < 11 ? "basico" : "base forte";
    const sample = PH_SAMPLES.reduce((best, s) => (Math.abs(s.pH - pH) < Math.abs(best.pH - pH) ? s : best), PH_SAMPLES[0]);
    return `<div class="stack">
      <p class="lede">pH = −log₁₀ [H₃O⁺]. Ogni unità è un fattore dieci. L’acqua pura a 25 °C sta a 7 perché Kw = 10⁻¹⁴. La cartina e il pHmetro raccontano la stessa [H⁺] in due linguaggi.</p>
      <div class="split">
        <div class="card lab-stage">
          <p class="kicker" data-live="ph-kind">pHmetro · ${esc(kind)}</p>
          <div class="ph-bench" data-live="ph-bench">
            ${electrodeSvg(pH)}
            ${beakerSvg(css, `soluzione pH ${pH.toFixed(1)}`, { level: 0.62, bubbles: pH < 2 || pH > 12 })}
          </div>
          <p class="ph-readout" data-live="ph-readout" style="color:${css}">${pH.toFixed(2)}</p>
          <div data-live="ph-strip">${stripSvg(pH)}</div>
        </div>
        <div class="stack">
          <div class="card">
            <label class="range">
              <span data-live="ph-lab">pH = <b class="mono">${pH.toFixed(2)}</b></span>
              <input type="range" min="0" max="14" step="0.1" value="${pH}" data-act="ph" aria-label="Valore di pH"/>
            </label>
            <div class="props two mt" data-live="ph-props">
              <div class="prop"><p class="kicker">[H₃O⁺]</p><p class="mono">${fmtSci(h)} M</p></div>
              <div class="prop"><p class="kicker">[OH⁻]</p><p class="mono">${fmtSci(oh)} M</p></div>
              <div class="prop"><p class="kicker">pOH</p><p class="mono">${pOH.toFixed(2)}</p></div>
              <div class="prop"><p class="kicker">Kw</p><p class="mono">1,0×10⁻¹⁴</p></div>
            </div>
            <p class="lede mt">Vicino a: <b>${esc(sample.name)}</b> (${esc(sample.kind)}). Acido forte 0,10 M → pH 1; base forte 0,10 M → pH 13. Un acido debole della stessa c sta più in alto.</p>
          </div>
          <div class="chips">${PH_SAMPLES.map((s) => chip(Math.abs(s.pH - pH) < 0.15, `phset:${s.pH}`, s.name)).join("")}</div>
        </div>
      </div>
      <ul class="teach">
        <li>Acido forte: [H⁺] = c. HCl 0,010 M → pH 2,00 esatto.</li>
        <li>Base forte: [OH⁻] = c, pH = 14 + log c. NaOH 0,010 M → pH 12,00.</li>
        <li>Acido debole: [H⁺] ≈ √(Ka·c). L’aceto (~0,8 M CH₃COOH) sta intorno a pH 2,4, non a 0,1.</li>
        <li>Il tampone del sangue tiene 7,35–7,45: una deriva di 0,4 unità è già patologia.</li>
      </ul>
    </div>`;
  }
  if (id === "isomeri") {
    const info = describeIsomer({ skel: state.isoSkel, group: state.isoGroup, pos: state.isoPos });
    const ch = ISOMER_CHALLENGES[state.isoChallenge] ?? ISOMER_CHALLENGES[0];
    const ok = state.isoFeedback;
    const pair = FUNCTIONAL_PAIRS.find((p) => p.id === state.funPair) ?? FUNCTIONAL_PAIRS[0];
    const geo = info.name === "but-2-ene" ? state.geoIsomer : "cis";
    return `<div class="stack">
      <p class="lede">Isomeri costituzionali: stessa formula, atomi legati in un altro ordine. Tre leve — catena, posizione del gruppo, funzione. Tocca i carboni (1–4) per spostare OH, Cl o il doppio: la formula di struttura si ridisegna.</p>
      <div class="card">
        <div class="row-between wrap">
          <div>
            <p class="kicker">Banco di montaggio</p>
            <h3>${esc(info.iupac)}</h3>
            <p class="mono electron">${esc(info.formula)} · ${esc(info.line)}</p>
            <p class="muted tiny">${esc(info.role)}</p>
          </div>
          <span class="badge">${esc(info.kind)}</span>
        </div>
        <div class="iso-stage mt" data-live="iso-stage">${isoMoleculeSvg(state.isoSkel, state.isoGroup, state.isoPos, geo, state.isoDepth)}</div>
        ${depthControl("iso-depth", state.isoDepth, "3D a sfere", "formula 2D")}
        <p class="lede">${esc(info.vs)}</p>
        <p class="tiny muted">Trascina la vista da 3D (atomi come sfere) alla formula di struttura. Tocca un carbonio numerato per attaccare il gruppo.</p>
        <div class="chips mt">
          ${chip(state.isoSkel === "n", "iso-skel:n", "Catena lineare")}
          ${chip(state.isoSkel === "iso", "iso-skel:iso", "Ramificata")}
        </div>
        <div class="chips">
          ${[
            ["h", "Solo C–H"],
            ["oh", "–OH"],
            ["cl", "–Cl"],
            ["=", "C=C"],
          ]
            .map(([g, lab]) => chip(state.isoGroup === g, `iso-group:${g}`, lab))
            .join("")}
        </div>
        ${
          info.name === "but-2-ene"
            ? `<div class="chips">${chip(state.geoIsomer === "cis", "geo:cis", "cis · Z")} ${chip(state.geoIsomer === "trans", "geo:trans", "trans · E")}<span class="tiny muted">Il π non ruota: cis e trans sono stereoisomeri, non costituzionali.</span></div>`
            : ""
        }
        <p class="kicker mt">Famiglia · stessa formula, connettività diversa</p>
        ${familyStrip(state.isoSkel, state.isoGroup, state.isoPos, geo)}
      </div>
      <div class="card challenge">
        <p class="kicker">Prova ${state.isoChallenge + 1} / ${ISOMER_CHALLENGES.length}</p>
        <h3>${esc(ch.prompt)}</h3>
        <p class="lede">${esc(ch.hint)}</p>
        <div class="row gap wrap">
          <button type="button" class="btn sm" data-act="iso-check">Verifica</button>
          <button type="button" class="btn btn-ghost sm" data-act="iso-next">Prova successiva</button>
        </div>
        ${
          ok === "ok"
            ? `<div class="note mt"><p><b>Esatto.</b></p><p class="muted">${esc(ch.explain)}</p></div>`
            : ok === "bad"
              ? `<div class="note mt"><p class="danger"><b>Non ancora.</b></p><p class="muted">${esc(ch.hint)} Ora hai ${esc(info.iupac)}.</p></div>`
              : ""
        }
      </div>
      <div class="card">
        <p class="kicker">Isomeria funzionale</p>
        <h3>${esc(pair.formula)}</h3>
        <p class="lede">Stesso conteggio atomico, gruppi diversi. Le proprietà divergono di più che nella sola posizione.</p>
        <div class="chips">${FUNCTIONAL_PAIRS.map((p) => chip(p.id === pair.id, `fun:${p.id}`, p.formula)).join("")}</div>
        <div class="split mt">
          <article class="card inner">
            ${functionalSvg(pair.left.id)}
            <p class="kicker">${esc(pair.left.group)}</p>
            <h4>${esc(pair.left.name)}</h4>
            <p class="muted tiny">p.eb. ${esc(pair.left.bp)}</p>
            <p class="lede">${esc(pair.left.note)}</p>
          </article>
          <article class="card inner">
            ${functionalSvg(pair.right.id)}
            <p class="kicker">${esc(pair.right.group)}</p>
            <h4>${esc(pair.right.name)}</h4>
            <p class="muted tiny">p.eb. ${esc(pair.right.bp)}</p>
            <p class="lede">${esc(pair.right.note)}</p>
          </article>
        </div>
      </div>
    </div>`;
  }
  if (id === "stereo") {
    const mode = state.stereoMode;
    const tabs = [
      ["conform", "Conformazioni"],
      ["geo", "Cis / trans"],
      ["optical", "Enantiomeri"],
    ];
    let body = "";
    if (mode === "conform") {
      const ang = Number(state.newmanAngle);
      const ecl = Math.min(...[0, 120, 240].map((k) => Math.abs(((ang - k + 180) % 360) - 180))) < 12;
      const stag = Math.abs(((ang % 120) - 60)) < 12;
      body = `<div class="split">
        <div class="card center">
          <div data-live="newman-draw">${newmanSvg(ang)}${energyCurve(ang)}</div>
        </div>
        <div>
          <p class="lede">Si guarda lungo un C–C. Il carbonio anteriore è il punto, il posteriore il cerchio. Ruota l’angolo diedro ω.</p>
          <label class="range">
            <span data-live="newman-lab">ω = ${Math.round(ang)}° · ${ecl ? "eclissato · massimo" : stag ? "sfalsato · minimo" : "intermedio"}</span>
            <input type="range" min="0" max="360" step="1" value="${ang}" data-act="newman" aria-label="Angolo diedro"/>
          </label>
          <div class="chips">
            ${chip(ecl, "newman-set:0", "Eclissato 0°")}
            ${chip(stag && ang >= 50 && ang <= 70, "newman-set:60", "Sfalsato 60°")}
            ${chip(Math.abs(ang - 180) < 8, "newman-set:180", "Anti 180°")}
          </div>
          <ul class="teach">
            <li>Etano: barriera ≈ 12 kJ/mol. A 25 °C ruota miliardi di volte al secondo: i conformeri non si isolano.</li>
            <li>Nel butano l’anti (180°) batte il gauche (±60°) di ~3,5 kJ/mol: i due metili si evitano.</li>
            <li>Non sono isomeri isolabili. Diventano «configurazionali» solo se la rotazione è bloccata (doppio, anello).</li>
          </ul>
        </div>
      </div>`;
    } else if (mode === "geo") {
      body = `<div class="split">
        <div class="card center">
          <div data-live="geo-draw">${isoMoleculeSvg("n", "=", 2, state.geoIsomer, state.stereoDepth)}</div>
          ${depthControl("stereo-depth", state.stereoDepth, "3D a sfere", "formula 2D")}
        </div>
        <div>
          <p class="lede">Il π vieta la rotazione intorno al C=C. Se ciascun carbonio sp² ha due sostituenti diversi, esistono due configurazioni.</p>
          <div class="chips">${chip(state.geoIsomer === "cis", "geo:cis", "cis · Z")} ${chip(state.geoIsomer === "trans", "geo:trans", "trans · E")}</div>
          <ul class="teach">
            <li>Cis: i due CH₃ dalla stessa parte. Più ingombro, di solito meno stabile, p.eb. un po’ più alto.</li>
            <li>Trans: CH₃ opposti. È l’isomero prevalente all’equilibrio.</li>
            <li>Il but-1-ene non ha cis/trans: il CH₂ ha due idrogeni identici. Serve un C=C «interno» con quattro gruppi non tutti uguali a coppie.</li>
            <li>E/Z usa le priorità CIP, non l’uguaglianza dei gruppi. Su but-2-ene coincidono con cis/trans.</li>
          </ul>
        </div>
      </div>`;
    } else {
      body = `<div class="stack">
        <div class="split">
          <div class="card center">
            <p class="kicker">${state.opticalFace === "R" ? "Enantiomero R" : "Enantiomero S"}</p>
            <div data-live="opt-draw">${tetra3dSvg(state.opticalFace, false, state.stereoDepth)}</div>
          </div>
          ${
            state.showMirror
              ? `<div class="card center">
                  <p class="kicker">Immagine speculare</p>
                  <div data-live="opt-mirror">${tetra3dSvg(state.opticalFace === "R" ? "S" : "R", true, state.stereoDepth)}</div>
                </div>`
              : `<div class="card"><p class="lede">Nascondi lo specchio e prova a sovrapporre ruotando: non si può, senza spezzare un legame.</p></div>`
          }
        </div>
        ${depthControl("stereo-depth", state.stereoDepth, "tetraedro 3D", "cunei 2D")}
        ${polarimeter(state.opticalFace)}
        <div class="chips">
          ${chip(state.opticalFace === "R", "opt:R", "R")}
          ${chip(state.opticalFace === "S", "opt:S", "S")}
          ${chip(state.showMirror, "opt-mirror", state.showMirror ? "Specchio on" : "Specchio off")}
        </div>
        <ul class="teach">
          <li>Acido lattico: C* con COOH, OH, CH₃, H — quattro sostituenti diversi → due enantiomeri.</li>
          <li>CIP: priorità OH > COOH > CH₃ > H. H lontano: giro 1→2→3 orario = R.</li>
          <li>Stesso p.f., stesso p.eb., stessa solubilità. Differiscono per il verso in cui ruotano la luce polarizzata e per i recettori chirali (naso, enzimi).</li>
          <li>1:1 R+S = racemo, [α] = 0. I diastereoisomeri (cis/trans, o RR vs RS) non sono speculari e si separano più facilmente.</li>
        </ul>
      </div>`;
    }
    return `<div class="stack">
      <p class="lede">Stereoisomeri: stessa connettività, spazio diverso. Conformazioni (rotazione del singolo), geometria sul doppio, enantiomeri su un tetraedro.</p>
      <div class="chips">${tabs.map(([k, lab]) => chip(mode === k, `stereo:${k}`, lab)).join("")}</div>
      ${body}
    </div>`;
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
        <p class="lede">Dall’atomo alle forze tra molecole, poi orbitali, Lewis, il banco di laboratorio e l’isomeria.</p>
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
    body = `<header class="page-head"><div><p class="kicker">Lessico</p><h2>Glossario</h2><p class="lede">Regole, grandezze di laboratorio e isomeria: il lessico per leggere una struttura senza indovinare.</p></div></header>
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
    state.ionCharge = 0;
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
  if (act.startsWith("labcmp:")) {
    state.labCmp = act.slice(7);
    const spec = LAB_SPECIES.find((s) => s.id === state.labCmp);
    if (spec) state.labMass = Math.round(formulaMass(spec.parts) * 10) / 10;
    render();
    return;
  }
  if (act.startsWith("phset:")) {
    state.phValue = Number(act.slice(6));
    render();
    return;
  }
  if (act.startsWith("iso-skel:")) {
    state.isoSkel = act.slice(9);
    state.isoFeedback = null;
    render();
    return;
  }
  if (act.startsWith("iso-group:")) {
    state.isoGroup = act.slice(10);
    state.isoFeedback = null;
    render();
    return;
  }
  if (act.startsWith("iso-pos:")) {
    state.isoPos = Number(act.slice(8));
    state.isoFeedback = null;
    render();
    return;
  }
  if (act.startsWith("iso-set:")) {
    const [, skel, group, pos, geo] = act.split(":");
    state.isoSkel = skel;
    state.isoGroup = group;
    state.isoPos = Number(pos);
    if (geo === "cis" || geo === "trans") state.geoIsomer = geo;
    state.isoFeedback = null;
    render();
    return;
  }
  if (act === "iso-check") {
    const ch = ISOMER_CHALLENGES[state.isoChallenge];
    state.isoFeedback = ch && isomerMatches({ skel: state.isoSkel, group: state.isoGroup, pos: state.isoPos }, ch.check) ? "ok" : "bad";
    render();
    return;
  }
  if (act === "iso-next") {
    state.isoChallenge = (state.isoChallenge + 1) % ISOMER_CHALLENGES.length;
    state.isoFeedback = null;
    render();
    return;
  }
  if (act.startsWith("fun:")) {
    state.funPair = act.slice(4);
    render();
    return;
  }
  if (act.startsWith("stereo:")) {
    state.stereoMode = act.slice(7);
    render();
    return;
  }
  if (act.startsWith("geo:")) {
    state.geoIsomer = act.slice(4);
    render();
    return;
  }
  if (act.startsWith("newman-set:")) {
    state.newmanAngle = Number(act.slice(11));
    render();
    return;
  }
  if (act === "opt-mirror") {
    state.showMirror = !state.showMirror;
    render();
    return;
  }
  if (act.startsWith("opt:")) {
    state.opticalFace = act.slice(4);
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
    const slider = root.querySelector('input[data-act="z"]');
    if (slider) slider.value = String(state.aufbauZ);
    if (root.querySelector("[data-live=z-label]")) patchLive("z");
    else render();
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
    } else if (act === "lab-mass") {
      state.labMass = Number(el.value);
      renderKeepFocus(el);
    } else if (act === "lab-vol") {
      state.labVol = Number(el.value);
      renderKeepFocus(el);
    } else if (act === "ph") {
      state.phValue = Number(el.value);
      renderKeepFocus(el);
    } else if (act === "newman") {
      state.newmanAngle = Number(el.value);
      renderKeepFocus(el);
    } else if (act === "iso-depth") {
      state.isoDepth = Number(el.value) / 100;
      renderKeepFocus(el);
    } else if (act === "stereo-depth") {
      state.stereoDepth = Number(el.value) / 100;
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

function labNow() {
  const spec = LAB_SPECIES.find((s) => s.id === state.labCmp) ?? LAB_SPECIES[0];
  const M = formulaMass(spec.parts);
  const mass = Number(state.labMass) || 0;
  const vol = Math.max(0.01, Number(state.labVol) || 0.25);
  const n = M > 0 ? mass / M : 0;
  const N = n * NA;
  const c = n / vol;
  const fill = spec.id === "fe" ? rgba(PAL.core, 0.55) : rgba(PAL.electron, 0.45);
  return { spec, M, mass, vol, n, N, c, fill };
}

function setLive(id, html) {
  const node = root?.querySelector(`[data-live="${id}"]`);
  if (node) node.innerHTML = html;
}

function patchLive(act) {
  if (!root) return;
  if (act === "z") {
    const z = state.aufbauZ;
    const element = BY_Z.get(z) ?? ELEMENTS[0];
    const occ = element.occupancy;
    const predicted = fillAufbau(z);
    setLive("z-label", `Z = <b class="mono">${z}</b> · ${esc(element.name)} <span class="mono">${esc(element.symbol)}</span>`);
    const map = root.querySelector("[data-live=z-map]");
    if (map) {
      map.querySelectorAll(".orb[data-act^='orb:']").forEach((btn) => {
        const id = btn.getAttribute("data-act").slice(4);
        const filled = occ[id] ?? 0;
        const cap = orbitalCapacity(id);
        const pred = predicted[id] ?? 0;
        const pct = (filled / cap) * 100;
        btn.classList.toggle("is-fill", filled > 0);
        const bar = btn.querySelector(".orb-bar");
        if (bar) bar.style.width = `${pct}%`;
        const txt = btn.querySelector(".orb-txt");
        if (txt) txt.innerHTML = `${id} <small>${filled}/${cap}</small>${filled !== pred ? " <em>≠</em>" : ""}`;
      });
    }
    const cfg = root.querySelector("[data-live=z-cfg]");
    if (cfg) cfg.textContent = formatCondensed(occ, z);
    const note = root.querySelector("[data-live=z-note]");
    if (note) {
      note.className = `tiny ${element.exception ? "warn" : "muted"}`;
      note.textContent = element.exception
        ? "Eccezione: la configurazione reale differisce dall’ordine Madelung puro."
        : "Segue l’ordine n+ℓ (Madelung). Diagonale: 4s prima di 3d, 5s prima di 4d, 6s prima di 4f.";
    }
    const mad = root.querySelector("[data-live=z-madelung]");
    if (mad) {
      mad.querySelectorAll("li").forEach((li, i) => {
        const id = AUFBAU_ORDER[i];
        li.classList.toggle("is-fill", (occ[id] ?? 0) > 0);
      });
    }
    return;
  }
  if (act === "lab-mass" || act === "lab-vol") {
    const { spec, M, mass, vol, n, N, c, fill } = labNow();
    setLive("lab-beaker", beakerSvg(fill, spec.name, { level: Math.min(0.82, 0.25 + n * 0.12), bubbles: n > 0.4 }));
    setLive(
      "lab-stats",
      `<div class="stat"><p class="kicker">M</p><p class="stat-v">${fmtMass(M)}</p><p class="muted">g/mol</p></div>
       <div class="stat is-on"><p class="kicker">n</p><p class="stat-v">${n < 0.1 ? n.toFixed(3) : n.toFixed(2)}</p><p class="muted">mol</p></div>
       <div class="stat"><p class="kicker">N</p><p class="stat-v tiny-stat">${fmtSci(N)}</p><p class="muted">entità</p></div>`,
    );
    setLive("lab-mass-lab", `${fmtMass(mass)} g · n = m / M`);
    setLive("lab-flask", flaskSvg(c, fill));
    setLive("lab-vol-lab", `V = ${vol.toFixed(2)} L`);
    setLive(
      "lab-conc",
      `<p class="display">${c >= 10 ? c.toFixed(1) : c.toFixed(2)} <span class="muted">mol/L</span></p><p class="muted tiny">c = n / V = ${n.toFixed(3)} / ${vol.toFixed(2)}</p>`,
    );
    return;
  }
  if (act === "ph") {
    const pH = Number(state.phValue);
    const h = hFromPh(pH);
    const oh = 1e-14 / h;
    const pOH = 14 - pH;
    const css = phColorCss(pH);
    const kind = pH < 3 ? "acido forte" : pH < 6.5 ? "acido" : pH <= 7.5 ? "neutro" : pH < 11 ? "basico" : "base forte";
    const sample = PH_SAMPLES.reduce((best, s) => (Math.abs(s.pH - pH) < Math.abs(best.pH - pH) ? s : best), PH_SAMPLES[0]);
    const kindEl = root.querySelector("[data-live=ph-kind]");
    if (kindEl) kindEl.textContent = `pHmetro · ${kind}`;
    setLive(
      "ph-bench",
      `${electrodeSvg(pH)}${beakerSvg(css, `soluzione pH ${pH.toFixed(1)}`, { level: 0.62, bubbles: pH < 2 || pH > 12 })}`,
    );
    const read = root.querySelector("[data-live=ph-readout]");
    if (read) {
      read.style.color = css;
      read.textContent = pH.toFixed(2);
    }
    setLive("ph-strip", stripSvg(pH));
    setLive("ph-lab", `pH = <b class="mono">${pH.toFixed(2)}</b>`);
    setLive(
      "ph-props",
      `<div class="prop"><p class="kicker">[H₃O⁺]</p><p class="mono">${fmtSci(h)} M</p></div>
       <div class="prop"><p class="kicker">[OH⁻]</p><p class="mono">${fmtSci(oh)} M</p></div>
       <div class="prop"><p class="kicker">pOH</p><p class="mono">${pOH.toFixed(2)}</p></div>
       <div class="prop"><p class="kicker">Kw</p><p class="mono">1,0×10⁻¹⁴</p></div>`,
    );
    const near = root.querySelector(".lede.mt");
    if (near && near.textContent && near.textContent.indexOf("Vicino a") !== -1) {
      near.innerHTML = `Vicino a: <b>${esc(sample.name)}</b> (${esc(sample.kind)}). Acido forte 0,10 M → pH 1; base forte 0,10 M → pH 13. Un acido debole della stessa c sta più in alto.`;
    }
    return;
  }
  if (act === "newman") {
    const ang = Number(state.newmanAngle);
    const ecl = Math.min(...[0, 120, 240].map((k) => Math.abs(((ang - k + 180) % 360) - 180))) < 12;
    const stag = Math.abs(ang % 120 - 60) < 12;
    setLive("newman-draw", `${newmanSvg(ang)}${energyCurve(ang)}`);
    setLive("newman-lab", `ω = ${Math.round(ang)}° · ${ecl ? "eclissato · massimo" : stag ? "sfalsato · minimo" : "intermedio"}`);
    return;
  }
  if (act === "iso-depth") {
    const info = describeIsomer({ skel: state.isoSkel, group: state.isoGroup, pos: state.isoPos });
    const geo = info.name === "but-2-ene" ? state.geoIsomer : "cis";
    setLive("iso-stage", isoMoleculeSvg(state.isoSkel, state.isoGroup, state.isoPos, geo, state.isoDepth));
    const pct = Math.round(state.isoDepth * 100);
    setLive("iso-depth-lab", pct < 35 ? "formula 2D" : pct > 65 ? "3D a sfere" : "proiezione");
    return;
  }
  if (act === "stereo-depth") {
    const pct = Math.round(state.stereoDepth * 100);
    setLive("geo-draw", isoMoleculeSvg("n", "=", 2, state.geoIsomer, state.stereoDepth));
    setLive("opt-draw", tetra3dSvg(state.opticalFace, false, state.stereoDepth));
    if (state.showMirror) setLive("opt-mirror", tetra3dSvg(state.opticalFace === "R" ? "S" : "R", true, state.stereoDepth));
    root.querySelectorAll("[data-live='stereo-depth-lab']").forEach((n) => {
      n.textContent = pct < 35 ? "formula 2D" : pct > 65 ? "3D a sfere" : "proiezione";
    });
    return;
  }
}

function renderKeepFocus(el) {
  const act = el.getAttribute("data-act");
  if (el.type === "range") {
    patchLive(act);
    return;
  }
  const start = el.selectionStart;
  const end = el.selectionEnd;
  render();
  const next = root.querySelector(`[data-act="${act}"]`);
  if (next) {
    next.focus();
    if (typeof start === "number" && next.setSelectionRange) next.setSelectionRange(start, end);
  }
}

function detectInstall() {
  if (typeof navigator === "undefined") return;
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

export function mountElectronHub(el) {
  if (!el) return;
  root = el;
  applyRoute(parseRoute());
  if (state.view === "studio" && state.studio === "quiz") ensureQuiz();
  if (!el.dataset.ehBound) {
    el.dataset.ehBound = "1";
    bind();
  }
  if (!window.__EH_HASH) {
    window.__EH_HASH = true;
    detectInstall();
    window.addEventListener("hashchange", () => {
      applyRoute(parseRoute());
      window.scrollTo(0, 0);
      render();
    });
  }
  render();
  if (!location.hash) {
    const r = parseRoute();
    if (r.view !== "tavola" || r.symbol || r.lesson || r.studio) setHashFromState();
  }
}

const __ehRoot = document.getElementById("app");
if (__ehRoot) mountElectronHub(__ehRoot);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(new URL("../sw.js", import.meta.url)).catch(() => {});
  });
}
