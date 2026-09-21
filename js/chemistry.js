import { RAW, EXCEPTIONS } from "./raw-data.js";
import { GLOSSARY, LESSONS, LEWIS_SPECIES, DEMO_MOLECULES, OCTET_CAP, TEACHING_Z } from "./content.js";

export const AUFBAU_ORDER = [
  "1s","2s","2p","3s","3p","4s","3d","4p","5s","4d","5p","6s","4f","5d","6p","7s","5f","6d","7p",
];

const CAPACITY = { s: 2, p: 6, d: 10, f: 14 };
const BOX_COUNT = { s: 1, p: 3, d: 5, f: 7 };
const L_VALUE = { s: 0, p: 1, d: 2, f: 3 };

export const NOBLE_GASES = [
  { z: 2, symbol: "He" },
  { z: 10, symbol: "Ne" },
  { z: 18, symbol: "Ar" },
  { z: 36, symbol: "Kr" },
  { z: 54, symbol: "Xe" },
  { z: 86, symbol: "Rn" },
  { z: 118, symbol: "Og" },
];

export const CATEGORY_LABEL = {
  alkali: "Metalli alcalini",
  alkaline: "Alcalino-terrosi",
  transition: "Metalli di transizione",
  post: "Metalli del blocco p",
  metalloid: "Metalloidi",
  nonmetal: "Non metalli",
  halogen: "Alogeni",
  noble: "Gas nobili",
  lanthanide: "Lantanoidi",
  actinide: "Attinoidi",
  unknown: "Proprietà incerte",
};

export const PHASE_LABEL = {
  solid: "Solido",
  liquid: "Liquido",
  gas: "Gas",
  unknown: "Sconosciuto",
};

export const BLOCK_LABEL = { s: "blocco s", p: "blocco p", d: "blocco d", f: "blocco f" };
export const GROUPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
export const SHELL_NAMES = ["K", "L", "M", "N", "O", "P", "Q"];

export function orbitalN(id) {
  return Number.parseInt(id, 10);
}
export function orbitalL(id) {
  return id.replace(/[0-9]/g, "");
}
export function orbitalCapacity(id) {
  return CAPACITY[orbitalL(id)] ?? 2;
}

export function fillAufbau(z) {
  let remaining = Math.max(0, z);
  const occ = {};
  for (const orb of AUFBAU_ORDER) {
    if (remaining <= 0) break;
    const take = Math.min(orbitalCapacity(orb), remaining);
    if (take > 0) occ[orb] = take;
    remaining -= take;
  }
  return occ;
}

export function occupancyFromTokens(tokens) {
  const occ = {};
  for (const token of tokens) {
    const match = token.trim().match(/^(\d+[spdf])(\d+)$/);
    if (!match) continue;
    occ[match[1]] = Number(match[2]);
  }
  return occ;
}

export function parseCondensed(config, nobleOccupancy) {
  const trimmed = config.trim();
  const noble = trimmed.match(/^\[([A-Z][a-z]?)\]\s*(.*)$/);
  if (!noble) return occupancyFromTokens(trimmed.split(/\s+/));
  const gas = NOBLE_GASES.find((g) => g.symbol === noble[1]);
  const base = gas ? { ...nobleOccupancy(gas.z) } : {};
  const rest = occupancyFromTokens(noble[2].split(/\s+/).filter(Boolean));
  return { ...base, ...rest };
}

export function occupancyTotal(occ) {
  return Object.values(occ).reduce((s, n) => s + n, 0);
}

export function shellsFrom(occ) {
  const shells = [0, 0, 0, 0, 0, 0, 0];
  for (const [id, n] of Object.entries(occ)) {
    const period = orbitalN(id);
    if (period >= 1 && period <= 7) shells[period - 1] += n;
  }
  while (shells.length > 1 && shells[shells.length - 1] === 0) shells.pop();
  return shells;
}

export function lastOccupied(occ) {
  let last = null;
  for (const id of AUFBAU_ORDER) {
    if ((occ[id] ?? 0) > 0) last = id;
  }
  return last;
}

export function blockFrom(occ) {
  const last = lastOccupied(occ);
  if (!last) return "s";
  return orbitalL(last);
}

export function formatFull(occ) {
  return AUFBAU_ORDER.filter((id) => (occ[id] ?? 0) > 0)
    .map((id) => `${id}${occ[id]}`)
    .join(" ");
}

export function formatCondensed(occ, z) {
  const previous = [...NOBLE_GASES].reverse().find((g) => g.z < z);
  if (!previous) return formatFull(occ);
  const core = fillAufbau(previous.z);
  const rest = [];
  for (const id of AUFBAU_ORDER) {
    const extra = (occ[id] ?? 0) - (core[id] ?? 0);
    if (extra > 0) rest.push(`${id}${extra}`);
  }
  if (rest.length === 0) return `[${previous.symbol}]`;
  return `[${previous.symbol}] ${rest.join(" ")}`;
}

export function subshellBoxes(orbital, electrons) {
  const l = orbitalL(orbital);
  const n = orbitalN(orbital);
  const count = BOX_COUNT[l] ?? 1;
  const cap = CAPACITY[l] ?? 2;
  const boxed = Array.from({ length: count }, (_, i) => ({
    orbital,
    index: i,
    up: false,
    down: false,
  }));
  const singles = Math.min(electrons, count);
  for (let i = 0; i < singles; i += 1) boxed[i].up = true;
  const pairs = Math.max(0, electrons - count);
  for (let i = 0; i < pairs && i < count; i += 1) boxed[i].down = true;
  const unpaired = boxed.filter((b) => b.up !== b.down).length;
  return { orbital, n, l, electrons, capacity: cap, boxes: boxed, unpaired };
}

export function allBoxes(occ) {
  return AUFBAU_ORDER.filter((id) => (occ[id] ?? 0) > 0).map((id) =>
    subshellBoxes(id, occ[id] ?? 0),
  );
}

export function unpairedCount(occ) {
  return allBoxes(occ).reduce((s, sh) => s + sh.unpaired, 0);
}

export function splitCoreValence(occ, block) {
  const ns = Object.keys(occ).map(orbitalN);
  const highest = ns.length ? Math.max(...ns) : 1;
  const valence = {};
  const core = {};
  for (const [id, n] of Object.entries(occ)) {
    if (n <= 0) continue;
    const p = orbitalN(id);
    const l = orbitalL(id);
    let isValence = false;
    if (block === "s" || block === "p") isValence = p === highest;
    else if (block === "d") isValence = (p === highest && l === "s") || (p === highest - 1 && l === "d");
    else {
      isValence =
        (p === highest && l === "s") ||
        (p === highest - 1 && (l === "d" || l === "p")) ||
        (p === highest - 2 && l === "f");
    }
    if (isValence) valence[id] = n;
    else core[id] = n;
  }
  const valenceCount = occupancyTotal(valence);
  const coreCount = occupancyTotal(core);
  const unpaired = unpairedCount(occ);
  return {
    core,
    valence,
    coreCount,
    valenceCount,
    unpaired,
    magnetic: unpaired > 0 ? "paramagnetico" : "diamagnetico",
  };
}

export function differentiatingElectron(occ) {
  const last = lastOccupied(occ);
  if (!last) return null;
  const electrons = occ[last] ?? 0;
  const boxes = subshellBoxes(last, electrons);
  const l = L_VALUE[orbitalL(last)] ?? 0;
  const filled = boxes.boxes;
  let ml = 0;
  let ms = 0.5;
  for (let i = filled.length - 1; i >= 0; i -= 1) {
    const box = filled[i];
    if (box.down) {
      ml = i - l;
      ms = -0.5;
      break;
    }
    if (box.up) {
      ml = i - l;
      ms = 0.5;
      break;
    }
  }
  return { n: orbitalN(last), l, ml, ms, orbital: last };
}

export function ionOccupancy(neutral, charge) {
  const occ = { ...neutral };
  if (charge === 0) return occ;
  if (charge > 0) {
    let remove = charge;
    const order = [...AUFBAU_ORDER].reverse().sort((a, b) => {
      const na = orbitalN(a);
      const nb = orbitalN(b);
      if (na !== nb) return nb - na;
      return (L_VALUE[orbitalL(b)] ?? 0) - (L_VALUE[orbitalL(a)] ?? 0);
    });
    for (const id of order) {
      if (remove <= 0) break;
      const have = occ[id] ?? 0;
      if (have <= 0) continue;
      const take = Math.min(have, remove);
      occ[id] = have - take;
      if (occ[id] === 0) delete occ[id];
      remove -= take;
    }
    return occ;
  }
  let add = -charge;
  for (const id of AUFBAU_ORDER) {
    if (add <= 0) break;
    const cap = orbitalCapacity(id);
    const have = occ[id] ?? 0;
    const room = cap - have;
    if (room <= 0) continue;
    const take = Math.min(room, add);
    occ[id] = have + take;
    add -= take;
  }
  return occ;
}

export function lName(l) {
  return ["s", "p", "d", "f", "g"][l] ?? String(l);
}
export function msLabel(ms) {
  return ms > 0 ? "+½" : "−½";
}

function occupancyOf(z) {
  const exception = EXCEPTIONS[z];
  if (exception) return parseCondensed(exception, fillAufbau);
  return fillAufbau(z);
}

export const ELEMENTS = RAW.map((row) => {
  const [
    z, symbol, name, mass, group, period, category, phase, oxidation,
    en, ie, radius, ea, melting, boiling, density, year,
  ] = row;
  const occupancy = occupancyOf(z);
  return {
    z, symbol, name, mass, group, period, category,
    block: blockFrom(occupancy),
    phase,
    oxidation: oxidation || "—",
    electronegativity: en,
    ionization: ie,
    radius,
    affinity: ea,
    melting, boiling, density, year, occupancy,
    exception: Boolean(EXCEPTIONS[z]),
    shells: shellsFrom(occupancy),
  };
});

export const BY_Z = new Map(ELEMENTS.map((el) => [el.z, el]));
export const BY_SYMBOL = new Map(ELEMENTS.map((el) => [el.symbol.toLowerCase(), el]));

export function getElement(id) {
  if (typeof id === "number") return BY_Z.get(id);
  const asNum = Number(id);
  if (Number.isInteger(asNum) && asNum >= 1 && asNum <= 118) return BY_Z.get(asNum);
  return BY_SYMBOL.get(String(id).toLowerCase());
}

export function neighbors(el) {
  return { prev: BY_Z.get(el.z - 1), next: BY_Z.get(el.z + 1) };
}

export function searchElements(query) {
  const q = query.trim().toLowerCase();
  if (!q) return ELEMENTS;
  return ELEMENTS.filter((el) =>
    el.symbol.toLowerCase() === q ||
    el.symbol.toLowerCase().startsWith(q) ||
    el.name.toLowerCase().includes(q) ||
    String(el.z) === q ||
    String(el.mass).startsWith(q),
  );
}

export function tablePosition(el) {
  if (el.category === "lanthanide") return { col: 3 + (el.z - 57), row: 9 };
  if (el.category === "actinide") return { col: 3 + (el.z - 89), row: 10 };
  const col = el.symbol === "He" ? 18 : (el.group ?? 3);
  return { col, row: el.period };
}

function pick(arr, n, rng) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function mulberry32(seed) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TEACHABLE = ELEMENTS.filter((el) => el.z <= 86);

function distractors(correct, pool, rng) {
  const unique = [...new Set(pool.filter((p) => p && p !== correct))];
  return pick(unique, 3, rng);
}

export function buildQuiz(seed = Date.now(), count = 8) {
  const rng = mulberry32(seed);
  const kinds = ["config", "element", "valence", "block", "exception"];
  const questions = [];
  const used = new Set();
  while (questions.length < count) {
    const kind = kinds[questions.length % kinds.length];
    const pool = kind === "exception" ? TEACHABLE.filter((el) => el.exception) : TEACHABLE;
    const el = pool[Math.floor(rng() * pool.length)];
    if (!el) break;
    if (used.has(el.z) && used.size < 40) continue;
    used.add(el.z);
    const condensed = formatCondensed(el.occupancy, el.z);
    const full = formatFull(el.occupancy);
    const layers = splitCoreValence(el.occupancy, el.block);
    if (kind === "config") {
      const opts = [
        condensed,
        ...distractors(condensed, pick(TEACHABLE, 12, rng).map((e) => formatCondensed(e.occupancy, e.z)), rng),
      ];
      questions.push({
        id: `${kind}-${el.z}-${questions.length}`,
        kind, prompt: `Qual è la configurazione condensata di ${el.name} (${el.symbol})?`,
        options: pick(opts, 4, rng), answer: condensed,
        explain: `${el.name} ha Z = ${el.z}. ${el.exception ? "È un’eccezione all’Aufbau. " : ""}Configurazione: ${condensed} (estesa: ${full}).`,
        element: el,
      });
    } else if (kind === "element") {
      const opts = [
        `${el.symbol} — ${el.name}`,
        ...distractors(`${el.symbol} — ${el.name}`, pick(TEACHABLE, 12, rng).map((e) => `${e.symbol} — ${e.name}`), rng),
      ];
      questions.push({
        id: `${kind}-${el.z}-${questions.length}`,
        kind, prompt: "Quale elemento ha questa configurazione?", detail: condensed,
        options: pick(opts, 4, rng), answer: `${el.symbol} — ${el.name}`,
        explain: `${condensed} corrisponde a ${el.name} (Z = ${el.z}), ${CATEGORY_LABEL[el.category].toLowerCase()}.`,
        element: el,
      });
    } else if (kind === "valence") {
      const answer = String(layers.valenceCount);
      const nearby = ["1","2","3","4","5","6","7","8","9","10","11","12"].filter((n) => n !== answer);
      questions.push({
        id: `${kind}-${el.z}-${questions.length}`,
        kind, prompt: `Quanti elettroni di valenza ha ${el.name}?`,
        options: pick([answer, ...pick(nearby, 3, rng)], 4, rng), answer,
        explain: `${el.name} è del blocco ${el.block}: valenza = ${layers.valenceCount}, core = ${layers.coreCount}.`,
        element: el,
      });
    } else if (kind === "block") {
      const answer = el.block;
      const opts = pick([answer, ...["s","p","d","f"].filter((b) => b !== answer)], 4, rng).map((b) => `blocco ${b}`);
      questions.push({
        id: `${kind}-${el.z}-${questions.length}`,
        kind, prompt: `In quale blocco si trova ${el.name}?`,
        options: opts, answer: `blocco ${answer}`,
        explain: `L’ultimo orbitale occupato determina il blocco ${el.block}. Periodo ${el.period}${el.group ? `, gruppo ${el.group}` : ""}.`,
        element: el,
      });
    } else {
      const answer = el.exception ? "Sì, è un’eccezione" : "No, segue l’Aufbau";
      questions.push({
        id: `${kind}-${el.z}-${questions.length}`,
        kind, prompt: `La configurazione di ${el.name} è un’eccezione all’ordine di Aufbau?`,
        detail: condensed,
        options: pick([answer, answer.startsWith("Sì") ? "No, segue l’Aufbau" : "Sì, è un’eccezione", "Solo nello stato eccitato", "Solo per lo ione +1"], 4, rng),
        answer,
        explain: el.exception
          ? `${el.name} preferisce un sottoguscio d semipieno o pieno. Configurazione reale: ${condensed}.`
          : `${el.name} segue l’ordine Madelung: ${condensed}.`,
        element: el,
      });
    }
  }
  return questions;
}

export { GLOSSARY, LESSONS, LEWIS_SPECIES, DEMO_MOLECULES, OCTET_CAP, TEACHING_Z };
