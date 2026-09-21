export const GLOSSARY = [
  {
    id: "aufbau",
    term: "Principio di Aufbau",
    group: "Regole di riempimento",
    body: "Gli elettroni occupano prima gli orbitali a energia più bassa. L’ordine Madelung è 1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p e così via. Alcuni metalli (Cr, Cu, Nb, Mo, Pd, Ag, Au…) fanno eccezione per guadagnare sottogusci semipieni o pieni.",
  },
  {
    id: "pauli",
    term: "Principio di esclusione di Pauli",
    group: "Regole di riempimento",
    body: "Nessun elettrone in un atomo può avere lo stesso insieme di quattro numeri quantici. Un orbitale (n, ℓ, mℓ) ospita al massimo due elettroni, con spin opposti.",
  },
  {
    id: "hund",
    term: "Regola di Hund",
    group: "Regole di riempimento",
    body: "In un sottoguscio degenerato gli elettroni occupano prima orbitali distinti con spin paralleli, poi si accoppiano. Massimizzare gli spin spaiati riduce la repulsione e spiega il paramagnetismo.",
  },
  {
    id: "n",
    term: "Numero quantico principale n",
    group: "Numeri quantici",
    body: "n = 1, 2, 3… indica il guscio e l’energia approssimata. Corrisponde al periodo nella tavola per i blocchi s e p. Il raggio atomico cresce con n.",
  },
  {
    id: "l",
    term: "Numero quantico secondario ℓ",
    group: "Numeri quantici",
    body: "ℓ va da 0 a n−1 e definisce la forma: 0 = s, 1 = p, 2 = d, 3 = f. Determina il blocco della tavola periodica.",
  },
  {
    id: "ml",
    term: "Numero quantico magnetico mℓ",
    group: "Numeri quantici",
    body: "mℓ va da −ℓ a +ℓ e orienta l’orbitale nello spazio. Un sottoguscio p ha tre orbitali, d cinque, f sette.",
  },
  {
    id: "ms",
    term: "Numero quantico di spin ms",
    group: "Numeri quantici",
    body: "ms = +½ o −½. Due elettroni nello stesso orbitale devono avere spin opposti. Lo spin netto degli elettroni spaiati determina il magnetismo.",
  },
  {
    id: "valence",
    term: "Elettroni di valenza",
    group: "Struttura",
    body: "Sono gli elettroni più esterni, responsabili del legame. Nel blocco s/p coincidono con il guscio n più alto. Nei metalli di transizione includono ns e (n−1)d; nei lantanoidi e attinoidi anche (n−2)f.",
  },
  {
    id: "core",
    term: "Elettroni di core",
    group: "Struttura",
    body: "Elettroni dei gusci interni, equivalenti alla configurazione del gas nobile precedente. Non partecipano di solito al legame, ma schermano la carica nucleare.",
  },
  {
    id: "condensed",
    term: "Notazione dei gas nobili",
    group: "Struttura",
    body: "Si scrive il gas nobile precedente fra parentesi quadre, poi solo gli elettroni di valenza. Esempio: Fe = [Ar] 3d6 4s2. Riduce il rumore visivo e evidenzia la chimica.",
  },
  {
    id: "shell",
    term: "Gusci K, L, M…",
    group: "Struttura",
    body: "Nomi spettroscopici dei livelli n: K (n=1), L (2), M (3), N (4), O (5), P (6), Q (7). La capacità è 2n²: 2, 8, 18, 32…",
  },
  {
    id: "ie",
    term: "Energia di ionizzazione",
    group: "Proprietà",
    body: "Energia per togliere un elettrone all’atomo gassoso. Cresce lungo il periodo (carica efficace) e diminuisce scendendo nel gruppo (raggio). Picchi sui gas nobili, cali su B e O rispetto ai vicini.",
  },
  {
    id: "en",
    term: "Elettronegatività",
    group: "Proprietà",
    body: "Tendenza a attrarre gli elettroni di un legame. Scala di Pauling: F = 3,98, Cs ≈ 0,79. Aumenta verso l’angolo in alto a destra della tavola (esclusi i gas nobili).",
  },
  {
    id: "radius",
    term: "Raggio atomico",
    group: "Proprietà",
    body: "Diminuisce lungo il periodo per l’aumento della carica efficace, aumenta scendendo nel gruppo. La contrazione lantanoide rende Hf simile a Zr.",
  },
  {
    id: "ea",
    term: "Affinità elettronica",
    group: "Proprietà",
    body: "Variazione di energia quando un atomo gassoso cattura un elettrone. Massima per Cl e gli alogeni; spesso bassa o negativa per gusci pieni o semipieni.",
  },
  {
    id: "ox",
    term: "Numeri di ossidazione",
    group: "Proprietà",
    body: "Carica formale dell’atomo in un composto. I gruppi principali seguono la valenza; i metalli di transizione hanno stati multipli perché il d è vicino in energia al s.",
  },
  {
    id: "exception",
    term: "Eccezioni Cr e Cu",
    group: "Regole di riempimento",
    body: "Cr è [Ar] 3d5 4s1 (d semipieno) e Cu [Ar] 3d10 4s1 (d pieno). La stabilità extra di sottogusci d5 e d10 vince sul 4s2. Pattern analoghi in Mo, Ag, Au, Pd.",
  },
  {
    id: "ion",
    term: "Ioni e configurazione",
    group: "Struttura",
    body: "I cationi dei metalli di transizione perdono prima gli elettroni ns, poi i (n−1)d. Fe²⁺ è [Ar] 3d6, non 3d4 4s2. Gli anioni riempiono seguendo Aufbau fino al gas nobile.",
  },
  {
    id: "magnetism",
    term: "Para- e diamagnetismo",
    group: "Proprietà",
    body: "Elettroni spaiati → paramagnetico (attratto dal campo). Tutti accoppiati → diamagnetico (debolmente respinto). O2 è paramagnetico: la MO spiega due elettroni spaiati.",
  },
  {
    id: "madelung",
    term: "Regola di Madelung",
    group: "Regole di riempimento",
    body: "Si riempie in ordine crescente di n+ℓ; a parità di n+ℓ vince n minore. Disegna le diagonali sulla mappa degli orbitali.",
  },
  {
    id: "effective",
    term: "Carica nucleare efficace",
    group: "Proprietà",
    body: "Zeff ≈ Z − S, dove S è lo schermo dei core. Zeff cresce lungo il periodo e contrae il raggio, alza IE e EN.",
  },
  {
    id: "iso",
    term: "Configurazioni isoelettroniche",
    group: "Struttura",
    body: "Specie con lo stesso numero di elettroni (O²⁻, F⁻, Ne, Na⁺, Mg²⁺). La carica nucleare diversa cambia raggio e IE, non il conteggio elettronico.",
  },
  {
    id: "atom",
    term: "Atomo",
    group: "Basi",
    body: "Particella più piccola di un elemento che ne conserva le proprietà chimiche. Nucleo (protoni e neutroni) più elettroni in gusci. In un atomo neutro e⁻ = p⁺ = Z.",
  },
  {
    id: "nucleus",
    term: "Nucleo",
    group: "Basi",
    body: "Centro dell’atomo: protoni (+1) e neutroni (0). Contiene quasi tutta la massa. Il numero di protoni è Z e definisce l’elemento.",
  },
  {
    id: "octet",
    term: "Regola dell’ottetto",
    group: "Basi",
    body: "Ogni atomo cerca 8 elettroni nel livello più esterno (2 se ha un solo guscio, come H e He): è la stabilità dei gas nobili. Si raggiunge cedendo, acquistando o condividendo elettroni.",
  },
  {
    id: "cation",
    term: "Catione",
    group: "Basi",
    body: "Atomo che ha perso elettroni e ha carica positiva. Tipico dei metalli, che hanno pochi elettroni di valenza e li cedono facilmente (Na⁺, Mg²⁺, Al³⁺).",
  },
  {
    id: "anion",
    term: "Anione",
    group: "Basi",
    body: "Atomo che ha acquistato elettroni e ha carica negativa. Tipico dei non metalli vicini all’ottetto (F⁻, O²⁻, Cl⁻).",
  },
  {
    id: "molecule",
    term: "Molecola",
    group: "Legami",
    body: "Gruppo di due o più atomi tenuti da legami covalenti, unità stabile e neutra. Può essere elementare (O₂, N₂) o un composto (H₂O, CH₄). I sali come NaCl non sono molecole: sono reticoli di ioni.",
  },
  {
    id: "ionic-bond",
    term: "Legame ionico",
    group: "Legami",
    body: "Trasferimento completo di elettroni da un metallo a un non metallo, se ΔEN è grande. Catione e anione si attraggono. Il solido è un reticolo, non una molecola isolata. Alti punti di fusione; conducono solo fusi o in soluzione.",
  },
  {
    id: "covalent-bond",
    term: "Legame covalente",
    group: "Legami",
    body: "Condivisione di una o più coppie tra non metalli. Puro (stessa EN, H₂), polare (ΔEN moderato, HCl, H₂O) o dativo (la coppia arriva da un solo atomo, NH₄⁺).",
  },
  {
    id: "sigma-pi",
    term: "Legami σ e π",
    group: "Legami",
    body: "Semplice = un σ (H–H). Doppio = σ + π (O=O). Triplo = σ + due π (N≡N). I π nascono dalla sovrapposizione laterale dei p.",
  },
  {
    id: "dative",
    term: "Legame dativo",
    group: "Legami",
    body: "Covalente in cui entrambi gli elettroni della coppia vengono dal donatore. In NH₄⁺ l’azoto dona il doppietto a H⁺.",
  },
  {
    id: "london",
    term: "Forze di London (Van der Waals)",
    group: "Legami",
    body: "Le più deboli, presenti in tutte le molecole. Dipoli istantanei da fluttuazioni della nuvola elettronica. Spiegano perché i gas nobili liquefanno a T molto basse.",
  },
  {
    id: "dipole",
    term: "Forze dipolo–dipolo",
    group: "Legami",
    body: "Attrazione tra molecole polari: il δ+ di una punta verso il δ− di un’altra. Più forti di London a parità di massa.",
  },
  {
    id: "hbond",
    term: "Legame a idrogeno",
    group: "Legami",
    body: "Il più forte tra i legami intermolecolari. H legato a O, N o F è attratto dal doppietto di un O/N/F vicino. Per questo l’acqua è liquida a temperatura ambiente.",
  },
  {
    id: "orbital",
    term: "Orbitale",
    group: "Struttura",
    body: "Regione di spazio con alta probabilità di trovare l’elettrone. Non è un’orbita planetaria. Ogni orbitale ospita al massimo 2 elettroni. s sferico, p a manubrio, d quadrilobati, f ancora più nodali.",
  },
  {
    id: "subshell",
    term: "Sottolivello s, p, d, f",
    group: "Struttura",
    body: "Suddivisione del guscio n. Capacità: s 2, p 6, d 10, f 14 (1, 3, 5, 7 orbitali). Il livello n ha n sottolivelli.",
  },
  {
    id: "lewis",
    term: "Struttura di Lewis",
    group: "Legami",
    body: "Disegno dei legami e dei doppietti liberi. Si contano gli e⁻ di valenza, si chiude l’ottetto, si calcolano le cariche formali. Per ioni poliatomici spesso servono più forme di risonanza.",
  },
  {
    id: "resonance",
    term: "Risonanza",
    group: "Legami",
    body: "Quando più Lewis equivalenti descrivono la stessa specie, la realtà è l’ibrido: cariche e doppi delocalizzati. In NO₃⁻ i tre N–O sono identici.",
  },
  {
    id: "formal-charge",
    term: "Carica formale",
    group: "Legami",
    body: "FC = e⁻ di valenza − e⁻ non condivisi − ½ e⁻ di legame. Utile per scegliere le Lewis migliori. In una forma del nitrato: N +1, O del doppio 0, O dei singoli −1.",
  },
  {
    id: "nitrate",
    term: "Ione nitrato NO₃⁻",
    group: "Legami",
    body: "24 e⁻ di valenza, N centrale, trigonale planare. Tre forme di risonanza con un doppio che ruota. Ibrido con tre legami equivalenti.",
  },
  {
    id: "nitrite",
    term: "Ione nitrito NO₂⁻",
    group: "Legami",
    body: "18 e⁻, N con un doppietto libero: geometria piegata. Due forme di risonanza (doppio su un O o sull’altro).",
  },
  {
    id: "no2-rad",
    term: "Biossido di azoto NO₂",
    group: "Legami",
    body: "17 e⁻: radicale con ottetto incompleto su N. Bruno, paramagnetico, dimerizza a N₂O₄. Eccezione istruttiva all’ottetto.",
  },
];

export const LESSONS = [
  {
    id: "atomo",
    n: 1,
    title: "L’atomo",
    kicker: "Il mattoncino",
    summary: "Nucleo (protoni e neutroni) ed elettroni organizzati in gusci. Z definisce l’elemento.",
  },
  {
    id: "ottetto",
    n: 2,
    title: "Ottetto e valenza",
    kicker: "La stabilità",
    summary: "Gli elettroni esterni guidano la chimica. Ogni atomo cerca 8 elettroni nel guscio esterno (2 per H e He).",
  },
  {
    id: "ioni",
    n: 3,
    title: "Gli ioni",
    kicker: "Cariche",
    summary: "Cationi (metalli che cedono) e anioni (non metalli che acquistano) per raggiungere l’ottetto.",
  },
  {
    id: "molecole",
    n: 4,
    title: "Le molecole",
    kicker: "Unità neutre",
    summary: "Due o più atomi tenuti da legami covalenti. I sali non sono molecole: sono reticoli di ioni.",
  },
  {
    id: "ionico",
    n: 5,
    title: "Legame ionico",
    kicker: "Trasferimento",
    summary: "Metallo + non metallo, grande ΔEN. Trasferimento completo, poi attrazione elettrostatica nel cristallo.",
  },
  {
    id: "covalente",
    n: 6,
    title: "Legame covalente",
    kicker: "Condivisione",
    summary: "Non metalli che condividono coppie. Puro, polare o dativo; semplice, doppio o triplo (σ e π).",
  },
  {
    id: "intermolecolari",
    n: 7,
    title: "Forze deboli",
    kicker: "Tra molecole",
    summary: "London, dipolo-dipolo e legame a idrogeno: decidono ebollizione, tensione superficiale, fase dell’acqua.",
  },
  {
    id: "orbitali",
    n: 8,
    title: "Orbitali e n, ℓ, m, s",
    kicker: "La mappa fine",
    summary: "Gusci, sottolivelli s p d f, forme nello spazio e i quattro numeri quantici. Aufbau, Pauli, Hund.",
  },
  {
    id: "lewis",
    n: 9,
    title: "Lewis e risonanza",
    kicker: "NO₃⁻ e NO₂⁻",
    summary: "Conteggio degli elettroni, ottetto, cariche formali e ibridi di risonanza degli ioni dell’azoto.",
  },
];

export const OCTET_CAP = { 1: 2, 2: 8, 3: 8 };

export const TEACHING_Z = [1, 2, 3, 6, 7, 8, 9, 10, 11, 12, 13, 16, 17, 18, 19, 20];



const O_LONE_DOUBLE = 2;
const O_LONE_SINGLE = 3;

export const LEWIS_SPECIES = [
  {
    id: "no3",
    formula: "NO₃⁻",
    name: "Ione nitrato",
    charge: -1,
    valenceElectrons: 24,
    geometry: "Trigonale planare",
    hybrid:
      "Ibrido di tre forme: i tre N–O sono equivalenti, lunghezza intermedia tra singolo e doppio.",
    teaching: [
      "Valenza totale: N (5) + 3×O (18) + 1 e⁻ della carica = 24 e⁻, cioè 12 coppie.",
      "N al centro, tre ossigeni. Una forma di Lewis ha un doppio e due singoli.",
      "Cariche formali: N = +1, O del doppio = 0, O dei singoli = −1. Somma = −1.",
      "La risonanza distribuisce la carica negativa in parti uguali sui tre ossigeni.",
    ],
    forms: ["A", "B", "C"].map((label, i) => {
      const doubleId = ["o1", "o2", "o3"][i];
      const oxygens = [
        { id: "o1", symbol: "O", x: 160, y: 36, lone: 0, charge: 0 },
        { id: "o2", symbol: "O", x: 48, y: 210, lone: 0, charge: 0 },
        { id: "o3", symbol: "O", x: 272, y: 210, lone: 0, charge: 0 },
      ].map((o) => ({
        ...o,
        lone: o.id === doubleId ? O_LONE_DOUBLE : O_LONE_SINGLE,
        charge: o.id === doubleId ? 0 : -1,
      }));
      return {
        id: `no3-${label}`,
        label: `Forma ${label}`,
        note: `Doppio legame su ${doubleId.replace("o", "O")}. Le altre due forme ruotano il doppio.`,
        atoms: [{ id: "n", symbol: "N", x: 160, y: 132, lone: 0, charge: 1 }, ...oxygens],
        bonds: [
          { a: "n", b: "o1", order: (doubleId === "o1" ? 2 : 1) },
          { a: "n", b: "o2", order: (doubleId === "o2" ? 2 : 1) },
          { a: "n", b: "o3", order: (doubleId === "o3" ? 2 : 1) },
        ],
      };
    }),
  },
  {
    id: "no2",
    formula: "NO₂⁻",
    name: "Ione nitrito",
    charge: -1,
    valenceElectrons: 18,
    geometry: "Angolata (piegata)",
    hybrid:
      "Ibrido di due forme: i due N–O equivalenti. Il doppietto su N piega la molecola (~115°).",
    teaching: [
      "Valenza totale: N (5) + 2×O (12) + 1 e⁻ = 18 e⁻, 9 coppie.",
      "N centrale con un doppietto libero: 2 legami + 1 coppia → geometria piegata, non lineare.",
      "Una forma: N=O e N–O⁻. L’altra scambia i ruoli. Ottetto completo su tutti gli atomi.",
      "Cariche formali: N = 0, O del doppio = 0, O del singolo = −1.",
    ],
    forms: [
      {
        id: "no2-a",
        label: "Forma A",
        note: "Doppio verso sinistra, carica −1 sull’ossigeno di destra.",
        atoms: [
          { id: "n", symbol: "N", x: 160, y: 118, lone: 1, charge: 0 },
          { id: "o1", symbol: "O", x: 52, y: 196, lone: 2, charge: 0 },
          { id: "o2", symbol: "O", x: 268, y: 196, lone: 3, charge: -1 },
        ],
        bonds: [
          { a: "n", b: "o1", order: 2 },
          { a: "n", b: "o2", order: 1 },
        ],
      },
      {
        id: "no2-b",
        label: "Forma B",
        note: "Doppio verso destra, carica −1 sull’ossigeno di sinistra.",
        atoms: [
          { id: "n", symbol: "N", x: 160, y: 118, lone: 1, charge: 0 },
          { id: "o1", symbol: "O", x: 52, y: 196, lone: 3, charge: -1 },
          { id: "o2", symbol: "O", x: 268, y: 196, lone: 2, charge: 0 },
        ],
        bonds: [
          { a: "n", b: "o1", order: 1 },
          { a: "n", b: "o2", order: 2 },
        ],
      },
    ],
  },
  {
    id: "no2rad",
    formula: "NO₂",
    name: "Biossido di azoto",
    charge: 0,
    valenceElectrons: 17,
    geometry: "Angolata, radicale",
    hybrid:
      "Molecola dispari: 17 elettroni. L’azoto non completa l’ottetto. È un radicale, bruno, dimerizza a N₂O₄.",
    teaching: [
      "Valenza: N (5) + 2×O (12) = 17 e⁻. Numero dispari → un elettrone spaiato.",
      "N ha 7 elettroni attorno a sé in una forma limite: eccezione all’ottetto.",
      "Due forme di risonanza con il doppio su un ossigeno o sull’altro.",
      "Lo spaiato rende NO₂ paramagnetico e reattivo: 2 NO₂ ⇌ N₂O₄.",
    ],
    forms: [
      {
        id: "no2r-a",
        label: "Forma A",
        note: "Elettrone spaiato su N. Ottetto violato di proposito.",
        atoms: [
          { id: "n", symbol: "N", x: 160, y: 118, lone: 0, unpaired: 1, charge: 0 },
          { id: "o1", symbol: "O", x: 52, y: 196, lone: 2, charge: 0 },
          { id: "o2", symbol: "O", x: 268, y: 196, lone: 2, charge: 0 },
        ],
        bonds: [
          { a: "n", b: "o1", order: 2 },
          { a: "n", b: "o2", order: 1 },
        ],
      },
      {
        id: "no2r-b",
        label: "Forma B",
        note: "Il doppio è sull’altro ossigeno; lo spaiato resta su N.",
        atoms: [
          { id: "n", symbol: "N", x: 160, y: 118, lone: 0, unpaired: 1, charge: 0 },
          { id: "o1", symbol: "O", x: 52, y: 196, lone: 2, charge: 0 },
          { id: "o2", symbol: "O", x: 268, y: 196, lone: 2, charge: 0 },
        ],
        bonds: [
          { a: "n", b: "o1", order: 1 },
          { a: "n", b: "o2", order: 2 },
        ],
      },
    ],
  },
];

export const DEMO_MOLECULES = [
  { id: "h2", formula: "H₂", name: "Idrogeno", kind: "element", blurb: "Due H condividono una coppia: covalente puro, legame σ semplice." },
  { id: "n2", formula: "N₂", name: "Azoto", kind: "element", blurb: "Triplo legame (σ + 2π). Molecola cortissima e inertissima." },
  { id: "o2", formula: "O₂", name: "Ossigeno", kind: "element", blurb: "Doppio legame. I diagrammi MO spiegano i due elettroni spaiati." },
  { id: "h2o", formula: "H₂O", name: "Acqua", kind: "compound", blurb: "Due covalenti polari + due doppietti su O: molecola piegata, dipolo netto." },
  { id: "co2", formula: "CO₂", name: "Anidride carbonica", kind: "compound", blurb: "O=C=O lineare. I due dipoli si annullano: molecola apolare." },
  { id: "ch4", formula: "CH₄", name: "Metano", kind: "compound", blurb: "Quattro covalenti C–H, tetraedro. Apolare." },
  { id: "nacl", formula: "NaCl", name: "Cloruro di sodio", kind: "ionic", blurb: "Non è una molecola: ogni Na⁺ è circondato da 6 Cl⁻ nel cubo del sale." },
  { id: "nh4", formula: "NH₄⁺", name: "Ione ammonio", kind: "compound", blurb: "Tre N–H covalenti + un dativo N→H⁺. Tetraedro, carica +1." },
];

