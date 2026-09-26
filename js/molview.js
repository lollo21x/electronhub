// @ts-nocheck
/**
 * ElectronHub — Builder (editor molecolare 2D + viewer 3D)
 * Copia questo file nella stessa cartella di app.js (es. src/eh/molview.js).
 * Richiede: three (npm i three) e chemistry.js con BY_SYMBOL / masse atomiche.
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { BY_SYMBOL } from "./chemistry.js";

const ELEMENTS = ["C", "H", "O", "N", "F", "Cl", "Br", "I", "S", "P"];
const VALENCE = { H: 1, C: 4, N: 3, O: 2, F: 1, Cl: 1, Br: 1, I: 1, S: 2, P: 3 };
const LONE = { H: 0, C: 0, N: 1, O: 2, F: 3, Cl: 3, Br: 3, I: 3, S: 2, P: 1 };
const CPK = {
  H: "#ecece8",
  C: "#b8c0c8",
  O: "#c45c4a",
  N: "#4a78a8",
  F: "#3d8a72",
  Cl: "#3a8494",
  Br: "#b45c4e",
  I: "#8a5a72",
  S: "#c4a574",
  P: "#b4844e",
};
const COV_R = { H: 0.31, C: 0.76, N: 0.71, O: 0.66, F: 0.57, Cl: 0.99, Br: 1.14, I: 1.33, S: 1.05, P: 1.07 };
const VDW_R = { H: 1.2, C: 1.7, N: 1.55, O: 1.52, F: 1.47, Cl: 1.75, Br: 1.85, I: 1.98, S: 1.8, P: 1.8 };
const SUB = "₀₁₂₃₄₅₆₇₈₉";
const STORAGE_KEY = "electronhub-molview";
const BOND_2D = 1.22;

const BOND_LEN = {
  "H-H": 0.74,
  "C-H": 1.09,
  "N-H": 1.01,
  "O-H": 0.96,
  "S-H": 1.34,
  "C-C": 1.54,
  "C=C": 1.34,
  "C#C": 1.2,
  "C-N": 1.47,
  "C=N": 1.29,
  "C#N": 1.16,
  "C-O": 1.43,
  "C=O": 1.21,
  "C#O": 1.13,
  "C-F": 1.35,
  "C-Cl": 1.77,
  "C-Br": 1.94,
  "C-I": 2.13,
  "C-S": 1.82,
  "C=S": 1.6,
  "C-P": 1.84,
  "N-N": 1.45,
  "N-O": 1.36,
  "O-O": 1.48,
  "S-S": 2.05,
};

function bondKey(a, b, order) {
  const pair = [a, b].sort().join("-");
  if (order >= 3) return pair.replace("-", "#");
  if (order === 2) return pair.replace("-", "=");
  return pair;
}

function idealLength(elA, elB, order) {
  const k = bondKey(elA, elB, order);
  if (BOND_LEN[k]) return BOND_LEN[k];
  const ra = COV_R[elA] ?? 0.77;
  const rb = COV_R[elB] ?? 0.77;
  const shrink = order >= 3 ? 0.78 : order === 2 ? 0.87 : 1;
  return (ra + rb) * shrink;
}

function subNum(n) {
  return String(n)
    .split("")
    .map((d) => (/[0-9]/.test(d) ? SUB[Number(d)] : d))
    .join("");
}

function uid() {
  return `a${Math.random().toString(36).slice(2, 9)}`;
}

function atomMass(sym) {
  const el = BY_SYMBOL.get(String(sym).toLowerCase());
  return el ? el.mass : 0;
}

function hillOrder(counts) {
  const keys = Object.keys(counts).filter((k) => counts[k] > 0);
  return keys.sort((a, b) => {
    if (a === "C") return -1;
    if (b === "C") return 1;
    if (a === "H" && counts.C) return -1;
    if (b === "H" && counts.C) return 1;
    return a.localeCompare(b);
  });
}

function hillFormula(counts) {
  const order = hillOrder(counts);
  if (!order.length) return "—";
  return order.map((k) => k + (counts[k] > 1 ? subNum(counts[k]) : "")).join("");
}

function hillPlain(counts) {
  const order = hillOrder(counts);
  return order.map((k) => k + (counts[k] > 1 ? String(counts[k]) : "")).join("") || "";
}

function v3(x, y, z) {
  return { x, y, z };
}
function add(a, b) {
  return v3(a.x + b.x, a.y + b.y, a.z + b.z);
}
function sub(a, b) {
  return v3(a.x - b.x, a.y - b.y, a.z - b.z);
}
function scale(a, s) {
  return v3(a.x * s, a.y * s, a.z * s);
}
function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}
function cross(a, b) {
  return v3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
}
function len(a) {
  return Math.hypot(a.x, a.y, a.z);
}
function norm(a) {
  const L = len(a) || 1e-9;
  return scale(a, 1 / L);
}

const ICONS = {
  pointer:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l7.5 16 1.8-6.7L20 11.5z"/></svg>',
  erase:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17.5L14.5 7l3.5 3.5L7.5 21H4z"/><path d="M13 8.5l3.5 3.5"/></svg>',
  trash:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V5h6v2"/><path d="M6 7l1 13h10l1-13"/></svg>',
  undo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 8H5V4"/><path d="M5 8a9 9 0 1 1-1.2 5"/></svg>',
  redo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M15 8h4V4"/><path d="M19 8a9 9 0 1 0 1.2 5"/></svg>',
  download:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v12"/><path d="M7 11l5 5 5-5"/><path d="M5 20h14"/></svg>',
  upload:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V8"/><path d="M7 13l5-5 5 5"/><path d="M5 20h14"/></svg>',
};

function b(a, c, order) {
  return { a: a.id, b: c.id, order };
}

function singleAtom(el) {
  return { atoms: [{ id: uid(), el, x: 0, y: 0 }], bonds: [] };
}

function chainAlkane(n) {
  const atoms = [];
  for (let i = 0; i < n; i += 1) {
    atoms.push({ id: uid(), el: "C", x: i * 1.35, y: (i % 2) * 0.78 });
  }
  const bonds = [];
  for (let i = 0; i < n - 1; i += 1) bonds.push(b(atoms[i], atoms[i + 1], 1));
  return { atoms, bonds };
}

function ringCarbons(n, doubleAlt) {
  const atoms = [];
  const bonds = [];
  for (let i = 0; i < n; i += 1) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    atoms.push({ id: uid(), el: "C", x: Math.cos(a) * 1.35, y: Math.sin(a) * 1.35 });
  }
  for (let i = 0; i < n; i += 1) {
    bonds.push(b(atoms[i], atoms[(i + 1) % n], doubleAlt && i % 2 === 0 ? 2 : 1));
  }
  return { atoms, bonds };
}

const PRESETS = {
  pentane: () => chainAlkane(5),
  methane: () => singleAtom("C"),
  ethane: () => chainAlkane(2),
  propane: () => chainAlkane(3),
  butane: () => chainAlkane(4),
  water: () => {
    const o = { id: uid(), el: "O", x: 0, y: 0 };
    const h1 = { id: uid(), el: "H", x: -1.05, y: 0.7 };
    const h2 = { id: uid(), el: "H", x: 1.05, y: 0.7 };
    return { atoms: [o, h1, h2], bonds: [b(o, h1, 1), b(o, h2, 1)] };
  },
  ammonia: () => {
    const n = { id: uid(), el: "N", x: 0, y: 0.2 };
    const h1 = { id: uid(), el: "H", x: -1.1, y: 0.9 };
    const h2 = { id: uid(), el: "H", x: 1.1, y: 0.9 };
    const h3 = { id: uid(), el: "H", x: 0, y: -1 };
    return { atoms: [n, h1, h2, h3], bonds: [b(n, h1, 1), b(n, h2, 1), b(n, h3, 1)] };
  },
  co2: () => {
    const c = { id: uid(), el: "C", x: 0, y: 0 };
    const o1 = { id: uid(), el: "O", x: -1.6, y: 0 };
    const o2 = { id: uid(), el: "O", x: 1.6, y: 0 };
    return { atoms: [c, o1, o2], bonds: [b(c, o1, 2), b(c, o2, 2)] };
  },
  ethanol: () => {
    const c1 = { id: uid(), el: "C", x: -1.2, y: 0 };
    const c2 = { id: uid(), el: "C", x: 0.3, y: 0.7 };
    const o = { id: uid(), el: "O", x: 1.7, y: 0 };
    const h = { id: uid(), el: "H", x: 2.6, y: 0.7 };
    return { atoms: [c1, c2, o, h], bonds: [b(c1, c2, 1), b(c2, o, 1), b(o, h, 1)] };
  },
  ethene: () => {
    const c1 = { id: uid(), el: "C", x: -0.8, y: 0 };
    const c2 = { id: uid(), el: "C", x: 0.8, y: 0 };
    return { atoms: [c1, c2], bonds: [b(c1, c2, 2)] };
  },
  ethyne: () => {
    const c1 = { id: uid(), el: "C", x: -0.8, y: 0 };
    const c2 = { id: uid(), el: "C", x: 0.8, y: 0 };
    return { atoms: [c1, c2], bonds: [b(c1, c2, 3)] };
  },
  benzene: () => ringCarbons(6, true),
  cyclohexane: () => ringCarbons(6, false),
  acetic: () => {
    const c1 = { id: uid(), el: "C", x: -1.3, y: 0 };
    const c2 = { id: uid(), el: "C", x: 0.2, y: 0 };
    const o1 = { id: uid(), el: "O", x: 1.1, y: 1.05 };
    const o2 = { id: uid(), el: "O", x: 1.15, y: -1.05 };
    const h = { id: uid(), el: "H", x: 2.15, y: -0.55 };
    return { atoms: [c1, c2, o1, o2, h], bonds: [b(c1, c2, 1), b(c2, o1, 2), b(c2, o2, 1), b(o2, h, 1)] };
  },
  acetone: () => {
    const c1 = { id: uid(), el: "C", x: -1.4, y: 0.8 };
    const c2 = { id: uid(), el: "C", x: 0, y: 0 };
    const c3 = { id: uid(), el: "C", x: -1.4, y: -0.8 };
    const o = { id: uid(), el: "O", x: 1.4, y: 0 };
    return { atoms: [c1, c2, c3, o], bonds: [b(c1, c2, 1), b(c3, c2, 1), b(c2, o, 2)] };
  },
  chloromethane: () => {
    const c = { id: uid(), el: "C", x: 0, y: 0 };
    const cl = { id: uid(), el: "Cl", x: 1.5, y: 0 };
    return { atoms: [c, cl], bonds: [b(c, cl, 1)] };
  },
  methanol: () => {
    const c = { id: uid(), el: "C", x: -0.8, y: 0 };
    const o = { id: uid(), el: "O", x: 0.7, y: 0.5 };
    const h = { id: uid(), el: "H", x: 1.6, y: -0.1 };
    return { atoms: [c, o, h], bonds: [b(c, o, 1), b(o, h, 1)] };
  },
};

const PRESET_META = [
  ["pentane", "Pentano", "C₅H₁₂"],
  ["methane", "Metano", "CH₄"],
  ["ethane", "Etano", "C₂H₆"],
  ["propane", "Propano", "C₃H₈"],
  ["butane", "Butano", "C₄H₁₀"],
  ["water", "Acqua", "H₂O"],
  ["ammonia", "Ammoniaca", "NH₃"],
  ["co2", "CO₂", "CO₂"],
  ["methanol", "Metanolo", "CH₄O"],
  ["ethanol", "Etanolo", "C₂H₆O"],
  ["ethene", "Etene", "C₂H₄"],
  ["ethyne", "Etino", "C₂H₂"],
  ["benzene", "Benzene", "C₆H₆"],
  ["cyclohexane", "Cicloesano", "C₆H₁₂"],
  ["acetic", "Acido acetico", "C₂H₄O₂"],
  ["acetone", "Acetone", "C₃H₆O"],
  ["chloromethane", "Clorometano", "CH₃Cl"],
];

function cloneMol(mol) {
  return {
    atoms: mol.atoms.map((a) => ({ ...a })),
    bonds: mol.bonds.map((bn) => ({ ...bn })),
  };
}

function bondOrderOf(mol, id) {
  return mol.bonds.filter((bn) => bn.a === id || bn.b === id).reduce((s, bn) => s + bn.order, 0);
}

function neighborsOf(mol, id) {
  const out = [];
  for (const bn of mol.bonds) {
    if (bn.a === id) out.push({ id: bn.b, order: bn.order });
    else if (bn.b === id) out.push({ id: bn.a, order: bn.order });
  }
  return out;
}

function implicitHCount(mol, atom) {
  const val = VALENCE[atom.el] ?? 0;
  return Math.max(0, val - bondOrderOf(mol, atom.id));
}

function countAtoms(mol, withImplicitH) {
  const counts = {};
  for (const a of mol.atoms) counts[a.el] = (counts[a.el] ?? 0) + 1;
  if (withImplicitH) {
    for (const a of mol.atoms) {
      const h = implicitHCount(mol, a);
      if (h) counts.H = (counts.H ?? 0) + h;
    }
  }
  return counts;
}

function molarMass(counts) {
  let m = 0;
  for (const [sym, n] of Object.entries(counts)) m += atomMass(sym) * n;
  return m;
}

function planarSlots(existing, total) {
  const n = Math.max(total, 2);
  const step = (Math.PI * 2) / n;
  let best = 0;
  if (existing.length) best = Math.atan2(existing[0].y, existing[0].x);
  const out = [];
  for (let i = 0; i < n; i += 1) {
    const ang = best + i * step;
    out.push(v3(Math.cos(ang), Math.sin(ang), 0));
  }
  return out;
}

function expandHydrogens(mol) {
  const atoms = mol.atoms.map((a) => ({ ...a, implicit: false }));
  const bonds = mol.bonds.map((bn) => ({ ...bn }));
  const byId = Object.fromEntries(atoms.map((a) => [a.id, a]));
  for (const a of [...atoms]) {
    const nH = implicitHCount({ atoms, bonds }, a);
    if (!nH) continue;
    const nbs = neighborsOf({ atoms, bonds }, a.id)
      .map((n) => byId[n.id])
      .filter(Boolean);
    const base = nbs.map((nb) => norm(v3(nb.x - a.x, nb.y - a.y, 0)));
    const slots = planarSlots(base, nH + nbs.length);
    let used = 0;
    for (const dir of slots) {
      if (used >= nH) break;
      const taken = base.some((v) => dot(v, dir) > 0.82);
      if (taken) continue;
      const h = { id: uid(), el: "H", x: a.x + dir.x * 0.95, y: a.y + dir.y * 0.95, implicit: true };
      atoms.push(h);
      bonds.push({ a: a.id, b: h.id, order: 1 });
      used += 1;
    }
    while (used < nH) {
      const ang = (used / nH) * Math.PI * 2 + 0.3;
      const h = { id: uid(), el: "H", x: a.x + Math.cos(ang) * 0.95, y: a.y + Math.sin(ang) * 0.95, implicit: true };
      atoms.push(h);
      bonds.push({ a: a.id, b: h.id, order: 1 });
      used += 1;
    }
  }
  return { atoms, bonds };
}

function stericNumber(atom, mol) {
  const bonded = neighborsOf(mol, atom.id).length;
  const lp = LONE[atom.el] ?? 0;
  return bonded + lp;
}

function geometryName(atom, mol) {
  const bonded = neighborsOf(mol, atom.id).length;
  const sn = stericNumber(atom, mol);
  if (bonded <= 1) return bonded === 0 ? "isolato" : "terminale";
  if (sn === 2) return "lineare";
  if (sn === 3) return bonded === 2 ? "piegata" : "trigonale planare";
  if (sn === 4) {
    if (bonded === 2) return "piegata";
    if (bonded === 3) return "piramidale trigonale";
    return "tetraedrica";
  }
  if (sn === 5) {
    if (bonded === 2) return "lineare";
    if (bonded === 3) return "a T";
    if (bonded === 4) return "a bilanciere";
    return "bipiramidale trigonale";
  }
  if (sn === 6) {
    if (bonded === 4) return "quadrata planare";
    return "ottaedrica";
  }
  return "—";
}

function idealAngle(atom, mol) {
  const bonded = neighborsOf(mol, atom.id).length;
  const sn = stericNumber(atom, mol);
  if (sn <= 2) return 180;
  if (sn === 3) return bonded === 2 ? 117 : 120;
  if (sn === 4) {
    if (bonded === 2) return 104.5;
    if (bonded === 3) return 107.3;
    return 109.47;
  }
  if (sn === 5) {
    if (bonded === 2) return 180;
    if (bonded === 3) return 90;
    return 120;
  }
  return 90;
}

function findRings(mol) {
  const heavy = new Set(mol.atoms.filter((a) => a.el !== "H").map((a) => a.id));
  const adj = {};
  for (const id of heavy) adj[id] = [];
  for (const bn of mol.bonds) {
    if (!heavy.has(bn.a) || !heavy.has(bn.b)) continue;
    adj[bn.a].push(bn.b);
    adj[bn.b].push(bn.a);
  }
  const rings = [];
  const seenKeys = new Set();
  function dfs(start, node, path, seen) {
    if (path.length > 7) return;
    for (const nxt of adj[node] || []) {
      if (nxt === start && path.length >= 3) {
        const key = [...path].sort().join("-");
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          rings.push({ key, ids: [...path] });
        }
        continue;
      }
      if (seen.has(nxt)) continue;
      seen.add(nxt);
      path.push(nxt);
      dfs(start, nxt, path, seen);
      path.pop();
      seen.delete(nxt);
    }
  }
  for (const id of heavy) dfs(id, id, [id], new Set([id]));
  rings.sort((a, b) => a.ids.length - b.ids.length);
  return rings;
}

function embed3D(mol2d) {
  const mol = expandHydrogens(mol2d);
  const n = mol.atoms.length;
  if (!n) return { atoms: [], bonds: [], pos: [] };
  const idx = Object.fromEntries(mol.atoms.map((a, i) => [a.id, i]));
  const pos = mol.atoms.map((a) => v3(a.x * 1.45, a.y * 1.45, (Math.random() - 0.5) * 0.12));
  const rings = findRings(mol).filter((r) => r.ids.length >= 5 && r.ids.length <= 7);
  if (rings[0]) {
    const r = rings[0];
    const m = r.ids.length;
    const R = idealLength("C", "C", 1.5) / (2 * Math.sin(Math.PI / m)) || 1.4;
    for (let i = 0; i < m; i += 1) {
      const ang = (i / m) * Math.PI * 2 - Math.PI / 2;
      pos[idx[r.ids[i]]] = v3(Math.cos(ang) * R, Math.sin(ang) * R, 0);
    }
  }

  const bonded = Array.from({ length: n }, () => []);
  for (const bn of mol.bonds) {
    const i = idx[bn.a];
    const j = idx[bn.b];
    if (i == null || j == null) continue;
    bonded[i].push({ j, order: bn.order });
    bonded[j].push({ j: i, order: bn.order });
  }

  const isH = mol.atoms.map((a) => a.el === "H");
  for (let i = 0; i < n; i += 1) {
    if (isH[i]) continue;
    const sn = stericNumber(mol.atoms[i], mol);
    if (sn >= 4 && bonded[i].length >= 3) {
      const k = bonded[i].find((e) => isH[e.j])?.j ?? bonded[i][0].j;
      pos[k].z += 0.95;
    }
  }

  for (let iter = 0; iter < 320; iter += 1) {
    const f = Array.from({ length: n }, () => v3(0, 0, 0));
    const dt = iter < 60 ? 0.018 : iter < 180 ? 0.012 : 0.007;

    for (const bn of mol.bonds) {
      const i = idx[bn.a];
      const j = idx[bn.b];
      if (i == null || j == null || !pos[i] || !pos[j]) continue;
      const L0 = idealLength(mol.atoms[i].el, mol.atoms[j].el, bn.order);
      const d = sub(pos[j], pos[i]);
      const L = len(d) || 1e-6;
      const mag = 90 * (L - L0);
      const dir = scale(d, mag / L);
      f[i] = add(f[i], dir);
      f[j] = sub(f[j], dir);
    }

    for (let i = 0; i < n; i += 1) {
      const nbs = bonded[i];
      if (nbs.length < 2) continue;
      const theta0 = (idealAngle(mol.atoms[i], mol) * Math.PI) / 180;
      for (let a = 0; a < nbs.length; a += 1) {
        for (let c = a + 1; c < nbs.length; c += 1) {
          const j = nbs[a].j;
          const k = nbs[c].j;
          if (pos[j] == null || pos[k] == null) continue;
          const vj = sub(pos[j], pos[i]);
          const vk = sub(pos[k], pos[i]);
          const lj = len(vj) || 1e-6;
          const lk = len(vk) || 1e-6;
          const uj = scale(vj, 1 / lj);
          const uk = scale(vk, 1 / lk);
          const cos = Math.max(-1, Math.min(1, dot(uj, uk)));
          const theta = Math.acos(cos);
          const dth = theta - theta0;
          const nrm = norm(cross(uj, uk));
          if (len(nrm) < 1e-6) continue;
          const fj = scale(cross(uj, nrm), -42 * dth);
          const fk = scale(cross(uk, nrm), 42 * dth);
          f[j] = add(f[j], fj);
          f[k] = add(f[k], fk);
          f[i] = sub(f[i], add(fj, fk));
        }
      }
    }

    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        if (bonded[i].some((e) => e.j === j)) continue;
        const d = sub(pos[j], pos[i]);
        const L = len(d) || 1e-6;
        const minD = ((VDW_R[mol.atoms[i].el] ?? 1.5) + (VDW_R[mol.atoms[j].el] ?? 1.5)) * 0.42;
        if (L >= minD) continue;
        const mag = 28 * (minD - L);
        const dir = scale(d, mag / L);
        f[i] = sub(f[i], dir);
        f[j] = add(f[j], dir);
      }
    }

    for (let i = 0; i < n; i += 1) {
      const nbs = bonded[i];
      if (nbs.length !== 4) continue;
      const vecs = nbs.map((e) => sub(pos[e.j], pos[i]));
      const vol = dot(vecs[0], cross(vecs[1], vecs[2]));
      if (Math.abs(vol) < 0.35) {
        const lift = scale(norm(cross(vecs[0], vecs[1])), 8);
        f[nbs[3].j] = add(f[nbs[3].j], lift);
        f[nbs[2].j] = sub(f[nbs[2].j], lift);
      }
    }

    for (let i = 0; i < n; i += 1) {
      const L = len(f[i]);
      const cap = 6;
      const ff = L > cap ? scale(f[i], cap / L) : f[i];
      pos[i] = add(pos[i], scale(ff, dt));
    }
  }

  let cx = 0;
  let cy = 0;
  let cz = 0;
  for (const p of pos) {
    cx += p.x;
    cy += p.y;
    cz += p.z;
  }
  cx /= n;
  cy /= n;
  cz /= n;
  for (const p of pos) {
    p.x -= cx;
    p.y -= cy;
    p.z -= cz;
  }
  return { atoms: mol.atoms, bonds: mol.bonds, pos };
}

function measure(embed) {
  const { atoms, bonds, pos } = embed;
  const idx = Object.fromEntries(atoms.map((a, i) => [a.id, i]));
  const lengths = bonds.map((bn) => {
    const i = idx[bn.a];
    const j = idx[bn.b];
    const L = len(sub(pos[i], pos[j]));
    return {
      a: atoms[i].el,
      b: atoms[j].el,
      order: bn.order,
      length: L,
      hide: atoms[i].el === "H" || atoms[j].el === "H",
    };
  });
  const angles = [];
  for (let i = 0; i < atoms.length; i += 1) {
    const nbs = [];
    for (const bn of bonds) {
      if (bn.a === atoms[i].id) nbs.push(idx[bn.b]);
      else if (bn.b === atoms[i].id) nbs.push(idx[bn.a]);
    }
    if (nbs.length < 2) continue;
    for (let a = 0; a < nbs.length; a += 1) {
      for (let c = a + 1; c < nbs.length; c += 1) {
        const v1 = sub(pos[nbs[a]], pos[i]);
        const v2 = sub(pos[nbs[c]], pos[i]);
        const cos = Math.max(-1, Math.min(1, dot(norm(v1), norm(v2))));
        const deg = (Math.acos(cos) * 180) / Math.PI;
        const hCount = [atoms[nbs[a]], atoms[i], atoms[nbs[c]]].filter((x) => x.el === "H").length;
        angles.push({
          left: atoms[nbs[a]].el,
          mid: atoms[i].el,
          right: atoms[nbs[c]].el,
          deg,
          hideH: hCount >= 2 && atoms[i].el !== "C",
        });
      }
    }
  }
  const geos = atoms
    .filter((a) => a.el !== "H")
    .map((a) => ({ el: a.el, name: geometryName(a, { atoms, bonds }) }));
  return { lengths, angles, geos };
}

function toMolFile(mol, embed) {
  const use = embed || { atoms: mol.atoms, bonds: mol.bonds, pos: mol.atoms.map((a) => v3(a.x, a.y, 0)) };
  const na = use.atoms.length;
  const nb = use.bonds.length;
  const idx = Object.fromEntries(use.atoms.map((a, i) => [a.id, i + 1]));
  const head = "ElectronHub\n  EH3D\n\n";
  const counts = `${String(na).padStart(3)}${String(nb).padStart(3)}  0  0  0  0  0  0  0  0999 V2000\n`;
  const atoms = use.atoms
    .map((a, i) => {
      const p = use.pos[i];
      const x = p.x.toFixed(4).padStart(10);
      const y = p.y.toFixed(4).padStart(10);
      const z = p.z.toFixed(4).padStart(10);
      return `${x}${y}${z} ${a.el.padEnd(3)} 0  0  0  0  0  0  0  0  0  0  0  0\n`;
    })
    .join("");
  const bonds = use.bonds
    .map((bn) => {
      const i = String(idx[bn.a]).padStart(3);
      const j = String(idx[bn.b]).padStart(3);
      const o = String(bn.order).padStart(3);
      return `${i}${j}${o}  0  0  0  0\n`;
    })
    .join("");
  return `${head}${counts}${atoms}${bonds}M  END\n`;
}

function toXyz(embed, name) {
  const lines = [String(embed.atoms.length), name || "ElectronHub"];
  for (let i = 0; i < embed.atoms.length; i += 1) {
    const p = embed.pos[i];
    lines.push(
      `${embed.atoms[i].el.padEnd(2)} ${p.x.toFixed(5).padStart(12)} ${p.y.toFixed(5).padStart(12)} ${p.z.toFixed(5).padStart(12)}`,
    );
  }
  return `${lines.join("\n")}\n`;
}

function parseMolFile(text) {
  const lines = text.replace(/\r/g, "").split("\n");
  let countsLine = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].includes("V2000") || lines[i].includes("V3000")) {
      countsLine = i;
      break;
    }
  }
  if (countsLine < 0) throw new Error("File MOL non riconosciuto");
  const na = Number.parseInt(lines[countsLine].slice(0, 3), 10);
  const nb = Number.parseInt(lines[countsLine].slice(3, 6), 10);
  const atoms = [];
  for (let i = 0; i < na; i += 1) {
    const ln = lines[countsLine + 1 + i] || "";
    const x = Number.parseFloat(ln.slice(0, 10));
    const y = Number.parseFloat(ln.slice(10, 20));
    const el = ln.slice(31, 34).trim() || "C";
    atoms.push({ id: uid(), el: ELEMENTS.includes(el) ? el : "C", x: Number.isFinite(x) ? x : 0, y: Number.isFinite(y) ? y : 0 });
  }
  const bonds = [];
  for (let i = 0; i < nb; i += 1) {
    const ln = lines[countsLine + 1 + na + i] || "";
    const a = Number.parseInt(ln.slice(0, 3), 10) - 1;
    const bIdx = Number.parseInt(ln.slice(3, 6), 10) - 1;
    const o = Number.parseInt(ln.slice(6, 9), 10) || 1;
    if (atoms[a] && atoms[bIdx]) bonds.push({ a: atoms[a].id, b: atoms[bIdx].id, order: Math.min(3, Math.max(1, o)) });
  }
  return { atoms, bonds };
}

function parseJsonMol(text) {
  const data = JSON.parse(text);
  if (!data || !Array.isArray(data.atoms) || !Array.isArray(data.bonds)) throw new Error("JSON non valido");
  const atoms = data.atoms.map((a) => ({
    id: a.id || uid(),
    el: ELEMENTS.includes(a.el) ? a.el : "C",
    x: Number(a.x) || 0,
    y: Number(a.y) || 0,
  }));
  const ids = new Set(atoms.map((a) => a.id));
  const bonds = data.bonds
    .filter((bn) => ids.has(bn.a) && ids.has(bn.b))
    .map((bn) => ({ a: bn.a, b: bn.b, order: Math.min(3, Math.max(1, Number(bn.order) || 1)) }));
  return { atoms, bonds };
}

function parseXyz(text) {
  const lines = text.replace(/\r/g, "").trim().split("\n");
  const n = Number.parseInt(lines[0], 10);
  if (!Number.isFinite(n) || n < 1) throw new Error("File XYZ non riconosciuto");
  const atoms = [];
  for (let i = 0; i < n; i += 1) {
    const parts = (lines[i + 2] || "").trim().split(/\s+/);
    const el = parts[0];
    const x = Number(parts[1]);
    const y = Number(parts[2]);
    atoms.push({
      id: uid(),
      el: ELEMENTS.includes(el) ? el : "C",
      x: Number.isFinite(x) ? x : 0,
      y: Number.isFinite(y) ? y : 0,
    });
  }
  const bonds = [];
  for (let i = 0; i < atoms.length; i += 1) {
    for (let j = i + 1; j < atoms.length; j += 1) {
      const d = Math.hypot(atoms[i].x - atoms[j].x, atoms[i].y - atoms[j].y);
      const max = ((COV_R[atoms[i].el] ?? 0.77) + (COV_R[atoms[j].el] ?? 0.77)) * 1.55;
      if (d > 0.35 && d < Math.max(1.2, max)) bonds.push({ a: atoms[i].id, b: atoms[j].id, order: 1 });
    }
  }
  return { atoms, bonds };
}

function download(filename, text, mime) {
  const blob = new Blob([text], { type: mime || "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function cylinderBetween(start, end, radius, material, segs = 12) {
  const dir = new THREE.Vector3().subVectors(end, start);
  const L = dir.length();
  const geo = new THREE.CylinderGeometry(radius, radius, L, segs);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  return mesh;
}

let live = null;

export function unmountMolView() {
  if (!live) return;
  live.dispose();
  live = null;
}

export function mountMolView(host) {
  if (!host) return;
  unmountMolView();

  const saved = loadSaved();
  const state = {
    mol: saved || PRESETS.pentane(),
    tool: "draw",
    element: "C",
    order: 1,
    showH: true,
    style: "ball",
    skeletal: true,
    showAngles: true,
    autoRotate: false,
    history: [],
    future: [],
    hoverAtom: null,
    hoverBond: null,
    selected: null,
    drag: null,
    pan: { x: 0, y: 0, scale: 42 },
    embed: null,
    measures: null,
    molSig: "",
  };
  pushHist(state, true);

  host.innerHTML = layoutHtml(state);
  const els = {
    host,
    draw: host.querySelector("[data-mv-draw]"),
    view: host.querySelector("[data-mv-view]"),
    formula: host.querySelector("[data-mv-formula]"),
    mass: host.querySelector("[data-mv-mass]"),
    counts: host.querySelector("[data-mv-counts]"),
    geo: host.querySelector("[data-mv-geo]"),
    angles: host.querySelector("[data-mv-angles]"),
    lengths: host.querySelector("[data-mv-lengths]"),
    hint: host.querySelector("[data-mv-hint]"),
    file: host.querySelector("[data-mv-file]"),
  };

  const canvas = document.createElement("canvas");
  canvas.className = "mv-canvas";
  canvas.setAttribute("aria-label", "Editor 2D della struttura");
  els.draw.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const three = createThree(els.view);

  function redraw(opts) {
    draw2D(canvas, ctx, state);
    if (opts?.hoverOnly) return;
    refreshStats(els, state);
    rebuild3D(three, state, els);
  }

  bindUi(host, state, els, redraw, three);
  const unbindCanvas = bindCanvas(canvas, state, redraw);
  redraw();
  requestAnimationFrame(() => {
    three.resize();
    three.framed = "";
    rebuild3D(three, state, els, false);
    draw2D(canvas, ctx, state);
  });

  const onKey = (ev) => handleKey(ev, state, redraw, host);
  live = {
    dispose() {
      window.removeEventListener("keydown", onKey);
      unbindCanvas();
      three.dispose();
      host.innerHTML = "";
    },
  };
  window.addEventListener("keydown", onKey);
}

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return parseJsonMol(raw);
  } catch {
    return null;
  }
}

function persist(mol) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, atoms: mol.atoms, bonds: mol.bonds }));
  } catch {
    /* ignore */
  }
}

function pushHist(state, silent) {
  const snap = JSON.stringify(cloneMol(state.mol));
  if (!silent) {
    const last = state.history[state.history.length - 1];
    if (last === snap) return;
  }
  state.history.push(snap);
  if (state.history.length > 60) state.history.shift();
  if (!silent) state.future = [];
}

function undo(state) {
  if (state.history.length < 2) return;
  const cur = state.history.pop();
  state.future.push(cur);
  state.mol = JSON.parse(state.history[state.history.length - 1]);
}

function redo(state) {
  if (!state.future.length) return;
  const snap = state.future.pop();
  state.history.push(snap);
  state.mol = JSON.parse(snap);
}

function layoutHtml(state) {
  const elBtns = ELEMENTS.map(
    (el) =>
      `<button type="button" class="mv-el${state.element === el ? " is-on" : ""}" data-mv-el="${el}" title="${el}" style="--el:${CPK[el]}"><span>${el}</span></button>`,
  ).join("");
  const presets = PRESET_META.map(([id, name, f]) => `<option value="${id}">${name} · ${f}</option>`).join("");
  return `
    <div class="mv-mobile">
      <p class="kicker">Builder</p>
      <h2>Uno schermo da tavolo</h2>
      <p class="lede">L’editor 2D e il visualizzatore 3D sono pensati per mouse, trackpad e uno schermo largo. Aprilo da un computer per disegnare atomi, ruotare la molecola e leggere angoli e geometria.</p>
    </div>
    <div class="mv-app">
      <div class="mv-bar">
        <div class="mv-tools">
          <button type="button" class="mv-tool${state.tool === "select" ? " is-on" : ""}" data-mv-tool="select" title="Seleziona / sposta">${ICONS.pointer}<span>Sposta</span></button>
          <button type="button" class="mv-tool${state.tool === "draw" ? " is-on" : ""}" data-mv-tool="draw" title="Disegna"><span class="mv-bond-ico"></span><span>Disegna</span></button>
          <button type="button" class="mv-tool${state.tool === "erase" ? " is-on" : ""}" data-mv-tool="erase" title="Cancella">${ICONS.erase}<span>Cancella</span></button>
        </div>
        <span class="mv-sep"></span>
        <div class="mv-els">${elBtns}</div>
        <span class="mv-sep"></span>
        <div class="mv-orders" role="group" aria-label="Ordine di legame">
          <button type="button" class="mv-order is-on" data-mv-order="1">singolo</button>
          <button type="button" class="mv-order" data-mv-order="2">doppio</button>
          <button type="button" class="mv-order" data-mv-order="3">triplo</button>
        </div>
        <span class="mv-sep"></span>
        <div class="mv-row">
          <button type="button" class="mv-icon-btn" data-mv-act="undo" title="Annulla">${ICONS.undo}</button>
          <button type="button" class="mv-icon-btn" data-mv-act="redo" title="Ripristina">${ICONS.redo}</button>
          <button type="button" class="mv-icon-btn" data-mv-act="clear" title="Svuota">${ICONS.trash}</button>
        </div>
        <span class="mv-sep"></span>
        <select class="mv-preset-sel" data-mv-preset-sel aria-label="Libreria molecole">
          <option value="">Libreria</option>
          ${presets}
        </select>
      </div>
      <div class="mv-stage">
        <section class="mv-panel mv-panel-2d">
          <header class="mv-panel-h">
            <div>
              <p class="kicker">Struttura 2D</p>
              <h2>Editor</h2>
            </div>
            <p class="mv-hint" data-mv-hint>Clicca per un atomo. Trascina per un legame. Angoli a 30°.</p>
          </header>
          <div class="mv-draw" data-mv-draw></div>
        </section>
        <section class="mv-panel mv-panel-3d">
          <header class="mv-panel-h">
            <div>
              <p class="kicker">Modello 3D</p>
              <h2>Visualizzatore</h2>
            </div>
            <div class="mv-3d-tools">
              <button type="button" class="chip is-on" data-mv-style="ball">sfere e bastoni</button>
              <button type="button" class="chip" data-mv-style="stick">bastoncini</button>
              <button type="button" class="chip" data-mv-style="space">ingombro</button>
              <button type="button" class="chip is-on" data-mv-toggle="showH">idrogeni</button>
              <button type="button" class="chip is-on" data-mv-toggle="showAngles">angoli</button>
              <button type="button" class="chip" data-mv-toggle="autoRotate">ruota</button>
            </div>
          </header>
          <div class="mv-view" data-mv-view></div>
        </section>
      </div>
      <aside class="mv-status">
        <div>
          <p class="kicker">Formula</p>
          <p class="mv-formula" data-mv-formula>C₅H₁₂</p>
          <p class="tiny muted" data-mv-counts></p>
        </div>
        <div>
          <p class="kicker">Massa molare</p>
          <p class="mv-mass"><span data-mv-mass>72.15</span> <small>g/mol</small></p>
        </div>
        <div class="mv-lists">
          <div>
            <p class="kicker">Geometria</p>
            <ul class="mv-list" data-mv-geo></ul>
          </div>
          <div>
            <p class="kicker">Angoli</p>
            <ul class="mv-list" data-mv-angles></ul>
          </div>
          <div>
            <p class="kicker">Lunghezze</p>
            <ul class="mv-list" data-mv-lengths></ul>
          </div>
        </div>
        <div>
          <p class="kicker">File</p>
          <div class="mv-files">
            <button type="button" class="btn sm" data-mv-act="export-json">${ICONS.download} JSON</button>
            <button type="button" class="btn sm btn-ghost" data-mv-act="export-mol">MOL</button>
            <button type="button" class="btn sm btn-ghost" data-mv-act="export-xyz">XYZ</button>
            <button type="button" class="btn sm btn-ghost" data-mv-act="import">${ICONS.upload} Importa</button>
          </div>
          <input type="file" accept=".json,.mol,.sdf,.xyz,application/json,chemical/x-mdl-molfile,chemical/x-xyz" data-mv-file hidden />
        </div>
      </aside>
    </div>`;
}

function refreshStats(els, state) {
  const counts = countAtoms(state.mol, true);
  els.formula.textContent = hillFormula(counts);
  const mass = molarMass(counts);
  els.mass.textContent = mass ? mass.toFixed(3).replace(".", ",") : "—";
  const bits = Object.entries(counts)
    .filter(([, n]) => n)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([k, n]) => `${n} ${k}`)
    .join(" · ");
  els.counts.textContent = bits || "Nessun atomo";
  persist(state.mol);
  if (!state.embed) return;
  const m = state.measures;
  if (!m) return;
  const geos = [];
  const seen = new Set();
  for (const g of m.geos) {
    const key = `${g.el}-${g.name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    geos.push(`<li><b>${g.el}</b> ${g.name}</li>`);
  }
  els.geo.innerHTML = geos.join("") || "<li class='muted'>Disegna un atomo</li>";
  const angHtml = m.angles
    .filter((a) => state.showH || !a.hideH)
    .sort((a, b) => a.deg - b.deg)
    .slice(0, 6)
    .map((a) => `<li>∠ ${a.left}–${a.mid}–${a.right} <b>${a.deg.toFixed(1).replace(".", ",")}°</b></li>`);
  els.angles.innerHTML = angHtml.join("") || "<li class='muted'>—</li>";
  const lens = m.lengths
    .filter((L) => state.showH || !L.hide)
    .slice(0, 6)
    .map(
      (L) =>
        `<li>${L.a}–${L.b}${L.order === 2 ? " =" : L.order === 3 ? " ≡" : ""} <b>${L.length.toFixed(2).replace(".", ",")} Å</b></li>`,
    );
  els.lengths.innerHTML = lens.join("") || "<li class='muted'>—</li>";
}

function worldFromEvent(canvas, state, ev) {
  const r = canvas.getBoundingClientRect();
  const x = ev.clientX - r.left;
  const y = ev.clientY - r.top;
  return {
    x: (x - r.width / 2 - state.pan.x) / state.pan.scale,
    y: (y - r.height / 2 - state.pan.y) / state.pan.scale,
  };
}

function snapFrom(from, cur) {
  const dx = cur.x - from.x;
  const dy = cur.y - from.y;
  const dist = Math.hypot(dx, dy);
  const ang = Math.atan2(dy, dx);
  const step = Math.PI / 6;
  const snapped = Math.round(ang / step) * step;
  const L = dist < 0.42 ? dist : BOND_2D;
  return { x: from.x + Math.cos(snapped) * L, y: from.y + Math.sin(snapped) * L, dist };
}

function hitAtom(state, w, rad = 0.42) {
  let best = null;
  let bestD = rad;
  for (const a of state.mol.atoms) {
    const d = Math.hypot(a.x - w.x, a.y - w.y);
    if (d < bestD) {
      bestD = d;
      best = a;
    }
  }
  return best;
}

function hitBond(state, w) {
  let best = null;
  let bestD = 0.22;
  const byId = Object.fromEntries(state.mol.atoms.map((a) => [a.id, a]));
  for (const bn of state.mol.bonds) {
    const a = byId[bn.a];
    const c = byId[bn.b];
    if (!a || !c) continue;
    const d = distToSeg(w, a, c);
    if (d < bestD) {
      bestD = d;
      best = bn;
    }
  }
  return best;
}

function distToSeg(p, a, c) {
  const vx = c.x - a.x;
  const vy = c.y - a.y;
  const L2 = vx * vx + vy * vy || 1e-9;
  let t = ((p.x - a.x) * vx + (p.y - a.y) * vy) / L2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (a.x + t * vx), p.y - (a.y + t * vy));
}

function addAtom(state, el, x, y) {
  const a = { id: uid(), el, x, y };
  state.mol.atoms.push(a);
  return a;
}

function connect(state, a, c, order) {
  if (a.id === c.id) return;
  const existing = state.mol.bonds.find((bn) => (bn.a === a.id && bn.b === c.id) || (bn.a === c.id && bn.b === a.id));
  if (existing) {
    existing.order = order || (existing.order % 3) + 1;
    return;
  }
  state.mol.bonds.push({ a: a.id, b: c.id, order: order || state.order });
}

function deleteAtom(state, atom) {
  state.mol.atoms = state.mol.atoms.filter((a) => a.id !== atom.id);
  state.mol.bonds = state.mol.bonds.filter((bn) => bn.a !== atom.id && bn.b !== atom.id);
}

function bindCanvas(canvas, state, redraw) {
  const ctx = canvas.getContext("2d");
  const onMove = (ev) => {
    const w = worldFromEvent(canvas, state, ev);
    if (state.drag?.kind === "pan") {
      state.pan.x += ev.movementX;
      state.pan.y += ev.movementY;
      redraw({ hoverOnly: true });
      return;
    }
    if (state.drag?.kind === "move" && state.drag.atom) {
      state.drag.atom.x = w.x;
      state.drag.atom.y = w.y;
      redraw({ hoverOnly: true });
      return;
    }
    if (state.drag?.kind === "bond") {
      state.drag.cur = snapFrom(state.drag.from, w);
      state.hoverAtom = hitAtom(state, w);
      redraw({ hoverOnly: true });
      return;
    }
    const nextAtom = hitAtom(state, w);
    const nextBond = nextAtom ? null : hitBond(state, w);
    canvas.style.cursor = state.tool === "erase" ? "cell" : nextAtom || nextBond ? "pointer" : "crosshair";
    if (nextAtom === state.hoverAtom && nextBond === state.hoverBond) return;
    state.hoverAtom = nextAtom;
    state.hoverBond = nextBond;
    redraw({ hoverOnly: true });
  };

  canvas.addEventListener("pointerdown", (ev) => {
    if (ev.button === 1 || ev.button === 2 || (ev.button === 0 && ev.altKey)) {
      state.drag = { kind: "pan" };
      canvas.setPointerCapture(ev.pointerId);
      return;
    }
    if (ev.button !== 0) return;
    const w = worldFromEvent(canvas, state, ev);
    const atom = hitAtom(state, w);
    const bond = atom ? null : hitBond(state, w);
    if (state.tool === "erase") {
      if (atom) deleteAtom(state, atom);
      else if (bond) state.mol.bonds = state.mol.bonds.filter((bn) => bn !== bond);
      pushHist(state);
      redraw();
      return;
    }
    if (state.tool === "select") {
      if (atom) {
        state.selected = atom.id;
        state.drag = { kind: "move", atom, x0: w.x, y0: w.y };
        canvas.setPointerCapture(ev.pointerId);
      } else {
        state.selected = null;
        state.drag = { kind: "pan" };
        canvas.setPointerCapture(ev.pointerId);
      }
      redraw({ hoverOnly: true });
      return;
    }
    if (atom) {
      state.drag = { kind: "bond", from: atom, cur: w };
      canvas.setPointerCapture(ev.pointerId);
      redraw({ hoverOnly: true });
      return;
    }
    if (bond) {
      bond.order = (bond.order % 3) + 1;
      pushHist(state);
      redraw();
      return;
    }
    const created = addAtom(state, state.element, w.x, w.y);
    state.drag = { kind: "bond", from: created, cur: w, born: true };
    canvas.setPointerCapture(ev.pointerId);
    redraw();
  });

  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", (ev) => {
    const drag = state.drag;
    state.drag = null;
    if (!drag) return;
    const w = worldFromEvent(canvas, state, ev);
    if (drag.kind === "pan") {
      redraw({ hoverOnly: true });
      return;
    }
    if (drag.kind === "move") {
      pushHist(state);
      redraw();
      return;
    }
    if (drag.kind === "bond" && drag.from) {
      const target = hitAtom(state, w);
      const snapped = snapFrom(drag.from, drag.cur || w);
      if (target && target.id !== drag.from.id) connect(state, drag.from, target, state.order);
      else if (snapped.dist > 0.55) {
        const created = addAtom(state, state.element, snapped.x, snapped.y);
        connect(state, drag.from, created, state.order);
      } else if (!drag.born && target && target.id === drag.from.id) {
        drag.from.el = state.element;
      }
      pushHist(state);
      redraw();
    }
  });
  canvas.addEventListener("pointerleave", () => {
    state.hoverAtom = null;
    state.hoverBond = null;
    redraw({ hoverOnly: true });
  });
  canvas.addEventListener("contextmenu", (ev) => ev.preventDefault());
  canvas.addEventListener(
    "wheel",
    (ev) => {
      ev.preventDefault();
      const factor = ev.deltaY > 0 ? 0.92 : 1.08;
      state.pan.scale = Math.max(22, Math.min(90, state.pan.scale * factor));
      redraw({ hoverOnly: true });
    },
    { passive: false },
  );

  const ro = new ResizeObserver(() => fitCanvas(canvas, ctx, state));
  if (canvas.parentElement) ro.observe(canvas.parentElement);
  fitCanvas(canvas, ctx, state);
  return () => ro.disconnect();
}

function fitCanvas(canvas, ctx, state) {
  const parent = canvas.parentElement;
  if (!parent) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = parent.clientWidth;
  const h = parent.clientHeight;
  canvas.width = Math.max(1, Math.round(w * dpr));
  canvas.height = Math.max(1, Math.round(h * dpr));
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  draw2D(canvas, ctx, state);
}

function draw2D(canvas, ctx, state) {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#141518";
  ctx.fillRect(0, 0, w, h);
  const step = state.pan.scale;
  ctx.fillStyle = "rgba(236,236,232,0.05)";
  const ox = (w / 2 + state.pan.x) % step;
  const oy = (h / 2 + state.pan.y) % step;
  for (let x = ox; x < w; x += step) {
    for (let y = oy; y < h; y += step) ctx.fillRect(x, y, 1.2, 1.2);
  }

  const toS = (a) => ({
    x: w / 2 + state.pan.x + a.x * state.pan.scale,
    y: h / 2 + state.pan.y + a.y * state.pan.scale,
  });
  const byId = Object.fromEntries(state.mol.atoms.map((a) => [a.id, a]));
  for (const bn of state.mol.bonds) {
    const a = byId[bn.a];
    const c = byId[bn.b];
    if (!a || !c) continue;
    drawBond2D(ctx, toS(a), toS(c), bn.order, state.hoverBond === bn, labelOf(a, state), labelOf(c, state));
  }
  if (state.drag?.kind === "bond" && state.drag.from && state.drag.cur) {
    const p = toS(state.drag.from);
    const q = toS(state.drag.cur);
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = "rgba(197,205,214,0.55)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(q.x, q.y);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  for (const a of state.mol.atoms) {
    const p = toS(a);
    const hide = state.skeletal && a.el === "C";
    const hover = state.hoverAtom === a;
    const sel = state.selected === a.id;
    if (hide) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, hover || sel ? 5 : 2.4, 0, Math.PI * 2);
      ctx.fillStyle = hover || sel ? "#ecece8" : "#b8c0c8";
      ctx.fill();
      continue;
    }
    const r = a.el === "H" ? 11 : 15;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = CPK[a.el] || "#b8c0c8";
    ctx.fill();
    if (hover || sel) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ecece8";
      ctx.stroke();
    }
    ctx.fillStyle = a.el === "N" || a.el === "O" || a.el === "Br" || a.el === "I" || a.el === "Cl" ? "#ecece8" : "#0b0c0e";
    ctx.font = `600 ${a.el.length > 1 ? 10 : 12}px "IBM Plex Sans", system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(a.el, p.x, p.y + 0.5);
  }
}

function labelOf(atom, state) {
  return !(state.skeletal && atom.el === "C");
}

function drawBond2D(ctx, p, q, order, hover, labelA, labelB) {
  const dx = q.x - p.x;
  const dy = q.y - p.y;
  const L = Math.hypot(dx, dy) || 1;
  const ux = dx / L;
  const uy = dy / L;
  const px = -uy;
  const py = ux;
  const sA = labelA ? 16 : 3;
  const sB = labelB ? 16 : 3;
  const x1 = p.x + ux * sA;
  const y1 = p.y + uy * sA;
  const x2 = q.x - ux * sB;
  const y2 = q.y - uy * sB;
  ctx.strokeStyle = hover ? "#ecece8" : "rgba(236,236,232,0.72)";
  ctx.lineCap = "round";
  const gap = 4;
  ctx.lineWidth = 2.2;
  for (let i = 0; i < order; i += 1) {
    const off = (i - (order - 1) / 2) * gap;
    ctx.beginPath();
    ctx.moveTo(x1 + px * off, y1 + py * off);
    ctx.lineTo(x2 + px * off, y2 + py * off);
    ctx.stroke();
  }
}

function bindUi(host, state, els, redraw, three) {
  host.addEventListener("click", (ev) => {
    const t = ev.target.closest("[data-mv-tool],[data-mv-el],[data-mv-order],[data-mv-act],[data-mv-style],[data-mv-toggle]");
    if (!t) return;
    if (t.dataset.mvTool) {
      state.tool = t.dataset.mvTool;
      host.querySelectorAll("[data-mv-tool]").forEach((b) => b.classList.toggle("is-on", b === t));
    } else if (t.dataset.mvEl) {
      state.element = t.dataset.mvEl;
      state.tool = "draw";
      host.querySelectorAll("[data-mv-el]").forEach((b) => b.classList.toggle("is-on", b.dataset.mvEl === state.element));
      host.querySelectorAll("[data-mv-tool]").forEach((b) => b.classList.toggle("is-on", b.dataset.mvTool === "draw"));
    } else if (t.dataset.mvOrder) {
      state.order = Number(t.dataset.mvOrder);
      host.querySelectorAll("[data-mv-order]").forEach((b) => b.classList.toggle("is-on", b === t));
    } else if (t.dataset.mvAct === "undo") {
      undo(state);
      redraw();
    } else if (t.dataset.mvAct === "redo") {
      redo(state);
      redraw();
    } else if (t.dataset.mvAct === "clear") {
      state.mol = { atoms: [], bonds: [] };
      pushHist(state);
      redraw();
    } else if (t.dataset.mvAct === "export-json") {
      download("molecola.json", JSON.stringify({ version: 1, atoms: state.mol.atoms, bonds: state.mol.bonds }, null, 2), "application/json");
    } else if (t.dataset.mvAct === "export-mol") {
      const embed = state.embed || embed3D(state.mol);
      download(`${hillPlain(countAtoms(state.mol, true)) || "molecola"}.mol`, toMolFile(state.mol, embed), "chemical/x-mdl-molfile");
    } else if (t.dataset.mvAct === "export-xyz") {
      const embed = state.embed || embed3D(state.mol);
      download(`${hillPlain(countAtoms(state.mol, true)) || "molecola"}.xyz`, toXyz(embed, hillPlain(countAtoms(state.mol, true))));
    } else if (t.dataset.mvAct === "import") {
      els.file.click();
    } else if (t.dataset.mvStyle) {
      state.style = t.dataset.mvStyle;
      host.querySelectorAll("[data-mv-style]").forEach((b) => b.classList.toggle("is-on", b === t));
      rebuild3D(three, state, els, true);
    } else if (t.dataset.mvToggle) {
      const key = t.dataset.mvToggle;
      state[key] = !state[key];
      t.classList.toggle("is-on", state[key]);
      if (key === "autoRotate") three.controls.autoRotate = state.autoRotate;
      else rebuild3D(three, state, els, true);
      refreshStats(els, state);
    }
  });
  const sel = host.querySelector("[data-mv-preset-sel]");
  sel?.addEventListener("change", () => {
    const make = PRESETS[sel.value];
    if (!make) return;
    state.mol = make();
    state.selected = null;
    pushHist(state);
    sel.value = "";
    redraw();
  });
  els.file.addEventListener("change", async () => {
    const file = els.file.files?.[0];
    els.file.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const name = file.name.toLowerCase();
      let mol;
      if (name.endsWith(".xyz")) mol = parseXyz(text);
      else if (name.endsWith(".json") || text.trim().startsWith("{")) mol = parseJsonMol(text);
      else mol = parseMolFile(text);
      state.mol = mol;
      pushHist(state);
      redraw();
    } catch (err) {
      if (els.hint) els.hint.textContent = err.message || "Importazione non riuscita";
    }
  });
}

function handleKey(ev, state, redraw, host) {
  const tag = ev.target?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
  const root = host || document;
  if (ev.metaKey || ev.ctrlKey) {
    if (ev.key === "z") {
      ev.preventDefault();
      if (ev.shiftKey) redo(state);
      else undo(state);
      redraw();
    }
    if (ev.key === "y") {
      ev.preventDefault();
      redo(state);
      redraw();
    }
    return;
  }
  if (ev.key === "Backspace" || ev.key === "Delete") {
    if (state.selected) {
      const atom = state.mol.atoms.find((a) => a.id === state.selected);
      if (atom) deleteAtom(state, atom);
      state.selected = null;
      pushHist(state);
      redraw();
    }
  }
  const map = { c: "C", h: "H", o: "O", n: "N", f: "F", s: "S", p: "P" };
  const lower = ev.key.toLowerCase();
  if (map[lower] && !ev.altKey) {
    state.element = map[lower];
    state.tool = "draw";
    root.querySelectorAll("[data-mv-el]").forEach((b) => b.classList.toggle("is-on", b.dataset.mvEl === state.element));
    root.querySelectorAll("[data-mv-tool]").forEach((b) => b.classList.toggle("is-on", b.dataset.mvTool === "draw"));
  }
  if (ev.key === "1" || ev.key === "2" || ev.key === "3") {
    state.order = Number(ev.key);
    root.querySelectorAll("[data-mv-order]").forEach((b) => b.classList.toggle("is-on", b.dataset.mvOrder === ev.key));
  }
  if (ev.key === "v") state.tool = "select";
  if (ev.key === "x" || ev.key === "e") state.tool = "erase";
  if (ev.key === "v" || ev.key === "x" || ev.key === "e") {
    root.querySelectorAll("[data-mv-tool]").forEach((b) => b.classList.toggle("is-on", b.dataset.mvTool === state.tool));
  }
}

function createThree(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#141518");
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
  camera.position.set(3.6, 2.4, 6.2);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);
  renderer.domElement.className = "mv-3d-canvas";
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.7;
  controls.zoomSpeed = 0.85;
  controls.panSpeed = 0.55;
  controls.enablePan = true;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 1.1;
  controls.minDistance = 2;
  controls.maxDistance = 28;
  const amb = new THREE.AmbientLight(0xd8dee6, 0.78);
  const key = new THREE.DirectionalLight(0xffffff, 1.15);
  key.position.set(4, 8, 6);
  const fill = new THREE.DirectionalLight(0xa8b4c4, 0.48);
  fill.position.set(-6, 2, -4);
  const rim = new THREE.DirectionalLight(0x4f8f7b, 0.22);
  rim.position.set(0, -4, 3);
  scene.add(amb, key, fill, rim);
  const group = new THREE.Group();
  scene.add(group);
  const grid = new THREE.GridHelper(14, 14, 0x32363c, 0x1c1e22);
  grid.position.y = -2.6;
  scene.add(grid);
  const angleGroup = new THREE.Group();
  scene.add(angleGroup);

  const ro = new ResizeObserver(() => resize());
  ro.observe(container);
  function resize() {
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  resize();
  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });
  return {
    scene,
    camera,
    renderer,
    controls,
    group,
    angleGroup,
    container,
    framed: "",
    resize,
    dispose() {
      ro.disconnect();
      renderer.setAnimationLoop(null);
      controls.dispose();
      clearGroup(group);
      clearGroup(angleGroup);
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

function clearGroup(group) {
  const kids = [...group.children];
  for (const ch of kids) {
    group.remove(ch);
    ch.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
    });
  }
}

const matCache = new Map();
function matFor(el, spec = 0.22) {
  const key = `${el}-${spec}`;
  if (matCache.has(key)) return matCache.get(key);
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(CPK[el] || "#b8c0c8"),
    roughness: 0.38,
    metalness: spec,
  });
  matCache.set(key, mat);
  return mat;
}
const bondMat = new THREE.MeshStandardMaterial({ color: 0x9aa3ad, roughness: 0.45, metalness: 0.12 });
const angleMat = new THREE.LineBasicMaterial({ color: 0x4f8f7b, transparent: true, opacity: 0.85 });

function rebuild3D(three, state, els, keepCam) {
  try {
    if (typeof window !== "undefined") window.__mv3d = "start";
    rebuild3DUnsafe(three, state, els, keepCam);
    if (typeof window !== "undefined") window.__mv3d = "ok";
  } catch (err) {
    if (typeof window !== "undefined") window.__mv3d = String(err && err.stack ? err.stack : err);
    console.error(err);
    refreshStats(els, state);
  }
}

function rebuild3DUnsafe(three, state, els, keepCam) {
  const sig = JSON.stringify(state.mol) + state.style + state.showH;
  const embed = embed3D(state.mol);
  state.embed = embed;
  state.measures = measure(embed);
  clearGroup(three.group);
  clearGroup(three.angleGroup);
  if (!embed.atoms.length) {
    refreshStats(els, state);
    return;
  }
  const space = state.style === "space";
  const stick = state.style === "stick";
  const showH = state.showH;
  const pos = embed.pos.map((p) => new THREE.Vector3(p.x, p.z, -p.y));
  const idx = Object.fromEntries(embed.atoms.map((a, i) => [a.id, i]));

  for (let i = 0; i < embed.atoms.length; i += 1) {
    const a = embed.atoms[i];
    if (a.el === "H" && !showH) continue;
    const r = space ? (VDW_R[a.el] ?? 1.5) * 0.95 : stick ? 0.16 : (COV_R[a.el] ?? 0.7) * 0.92 + 0.18;
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 20), matFor(a.el));
    mesh.position.copy(pos[i]);
    three.group.add(mesh);
  }

  if (!space) {
    for (const bn of embed.bonds) {
      const i = idx[bn.a];
      const j = idx[bn.b];
      const a = embed.atoms[i];
      const c = embed.atoms[j];
      if (!showH && (a.el === "H" || c.el === "H")) continue;
      const p = pos[i];
      const q = pos[j];
      const dir = new THREE.Vector3().subVectors(q, p);
      const nrm = new THREE.Vector3(0, 1, 0).cross(dir).normalize();
      if (nrm.lengthSq() < 0.01) nrm.set(1, 0, 0).cross(dir).normalize();
      const order = bn.order;
      const radius = stick ? 0.08 : order >= 3 ? 0.045 : 0.055;
      const spread = stick ? 0.12 : 0.09;
      for (let k = 0; k < order; k += 1) {
        const off = order === 1 ? 0 : (k - (order - 1) / 2) * spread;
        const s = p.clone().addScaledVector(nrm, off);
        const e = q.clone().addScaledVector(nrm, off);
        three.group.add(cylinderBetween(s, e, radius, bondMat, 10));
      }
    }
  }

  if (state.showAngles) drawAngles(three, embed, pos, showH);

  if (!keepCam && three.framed !== sig) {
    const box = new THREE.Box3().setFromObject(three.group);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());
    three.controls.target.copy(center);
    if (Number.isFinite(size) && size > 0.2) {
      const dist = Math.max(2.8, size * 1.05);
      const camDir = three.camera.position.clone().sub(three.controls.target).normalize();
      three.camera.position.copy(center).addScaledVector(camDir, dist);
    }
    three.framed = sig;
  }
  three.controls.update();
  refreshStats(els, state);
}

function drawAngles(three, embed, pos, showH) {
  const { atoms, bonds } = embed;
  const idx = Object.fromEntries(atoms.map((a, i) => [a.id, i]));
  let drawn = 0;
  for (let i = 0; i < atoms.length && drawn < 18; i += 1) {
    if (atoms[i].el === "H") continue;
    const nbs = [];
    for (const bn of bonds) {
      if (bn.a === atoms[i].id) nbs.push(idx[bn.b]);
      else if (bn.b === atoms[i].id) nbs.push(idx[bn.a]);
    }
    if (nbs.length < 2) continue;
    for (let a = 0; a < nbs.length && drawn < 18; a += 1) {
      for (let c = a + 1; c < nbs.length && drawn < 18; c += 1) {
        if (!showH && (atoms[nbs[a]].el === "H" || atoms[nbs[c]].el === "H")) continue;
        const origin = pos[i];
        const u = pos[nbs[a]].clone().sub(origin).normalize();
        const v = pos[nbs[c]].clone().sub(origin).normalize();
        const pts = [];
        const r = 0.55;
        for (let s = 0; s <= 10; s += 1) {
          const t = s / 10;
          const w = u
            .clone()
            .multiplyScalar(1 - t)
            .add(v.clone().multiplyScalar(t))
            .normalize();
          pts.push(origin.clone().addScaledVector(w, r));
        }
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        three.angleGroup.add(new THREE.Line(geo, angleMat));
        drawn += 1;
      }
    }
  }
}
