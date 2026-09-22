// @ts-nocheck
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
  {
    id: "mole",
    term: "Mole",
    group: "Laboratorio",
    body: "Unità SI della quantità di sostanza. 1 mol contiene NA = 6,022×10²³ entità (atomi, molecole, ioni). Relazione madre: n = m / M = N / NA = c · V. La mole non è una massa: è un conteggio, come una «dozzina» enorme.",
  },
  {
    id: "molar-mass",
    term: "Massa molare M",
    group: "Laboratorio",
    body: "Massa di una mole di sostanza, in g/mol. Numericamente coincide con la massa formula in u. Si ottiene sommando le masse atomiche: H₂O = 2×1,008 + 15,999 = 18,015 g/mol. Ponte tra bilancia (grammi) e conteggio (moli).",
  },
  {
    id: "avogadro",
    term: "Costante di Avogadro NA",
    group: "Laboratorio",
    body: "NA = 6,02214076×10²³ mol⁻¹, esatta per definizione SI. N = n · NA. Un bicchiere d’acqua (~10 mol) contiene ~6×10²⁴ molecole: per questo in lab si pesa, non si contano gli atomi.",
  },
  {
    id: "concentration",
    term: "Concentrazione molare (molarità)",
    group: "Laboratorio",
    body: "c = n / V, in mol/L (simbolo M). V è il volume della soluzione, non del solvente puro. Una soluzione 0,100 M di NaCl contiene 0,100 mol (5,844 g) in 1,00 L. Diluizione: c₁V₁ = c₂V₂.",
  },
  {
    id: "molality",
    term: "Molalità, % e ppm",
    group: "Laboratorio",
    body: "Molalità b = n(soluto) / kg(solvente): indipendente dalla T. Percento in massa: g soluto / 100 g soluzione. ppm = mg/kg. In chimica generale la molarità è lo standard per titolazioni e pH.",
  },
  {
    id: "solution",
    term: "Soluzione, soluto, solvente",
    group: "Laboratorio",
    body: "Miscela omogenea. Il solvente è il componente in eccesso (di solito H₂O); il soluto è ciò che si dissolve. Preparazione: si pesa il soluto, si porta a volume in un matraccio tarato — non si aggiunge il volume d’acqua a parte, perché i volumi non sono additivi.",
  },
  {
    id: "ph",
    term: "pH",
    group: "Laboratorio",
    body: "pH = −log₁₀ a(H₃O⁺) ≈ −log₁₀ [H₃O⁺] (in mol/L, soluzioni diluite). Scala 0–14 a 25 °C. Acido < 7, neutro = 7, basico > 7. Ogni unità di pH è un fattore 10 sulla [H⁺]. pOH = −log[OH⁻]; pH + pOH = 14 (Kw = 1,0×10⁻¹⁴).",
  },
  {
    id: "kw",
    term: "Prodotto ionico dell’acqua Kw",
    group: "Laboratorio",
    body: "H₂O ⇌ H₃O⁺ + OH⁻. Kw = [H₃O⁺][OH⁻] = 1,0×10⁻¹⁴ a 25 °C. In acqua pura [H⁺] = [OH⁻] = 1,0×10⁻⁷ → pH 7. Kw cresce con T: a 50 °C l’acqua pura ha pH < 7 ma resta neutra ([H⁺]=[OH⁻]).",
  },
  {
    id: "strong-acid",
    term: "Acidi e basi forti / deboli",
    group: "Laboratorio",
    body: "Forti: dissociazione completa. HCl, HNO₃, H₂SO₄ (1ª), NaOH, KOH. [H⁺] = c dell’acido forte. Deboli: equilibrio. CH₃COOH (Ka ≈ 1,8×10⁻⁵), NH₃. Per un acido debole [H⁺] ≈ √(Ka·c), pH più alto di quello «da concentrazione nominale».",
  },
  {
    id: "indicator",
    term: "Indicatori e cartina universale",
    group: "Laboratorio",
    body: "Coloranti il cui equilibrio acido-base cambia tintura in un intervallo di pH. La cartina universale mescola più indicatori: rosso (acido forte) → arancio → giallo → verde (neutro) → blu (basico). Il pHmetro misura un potenziale di elettrodo di vetro, più preciso.",
  },
  {
    id: "stoich",
    term: "Stechiometria in soluzione",
    group: "Laboratorio",
    body: "Le moli collegano la bilancia alla buretta: n = m/M = cV. In una titolazione HCl + NaOH, n(H⁺) = n(OH⁻) al punto equivalente. Sempre convertire in moli prima di confrontare i coefficienti della reazione.",
  },
  {
    id: "isomer",
    term: "Isomeri",
    group: "Isomeria",
    body: "Composti con la stessa formula molecolare ma struttura diversa, quindi proprietà diverse. Due famiglie: isomeri costituzionali (connettività diversa) e stereoisomeri (stessa connettività, disposizione spaziale diversa). Non sono risonanze: le risonanze sono lo stesso ibrido, gli isomeri sono sostanze distinte.",
  },
  {
    id: "constitutional",
    term: "Isomeria costituzionale (di struttura)",
    group: "Isomeria",
    body: "Stessa formula, atomi legati in ordine diverso. Tre tipi didattici: di catena (scheletro carbonioso), di posizione (stesso gruppo in un altro carbonio), funzionale (gruppi funzionali diversi). Esempio: C₄H₁₀ è butano o 2-metilpropano.",
  },
  {
    id: "chain-iso",
    term: "Isomeria di catena",
    group: "Isomeria",
    body: "Cambia solo lo scheletro: lineare contro ramificato. n-butano (p.eb. −0,5 °C) e isobutano / 2-metilpropano (p.eb. −11,7 °C) sono C₄H₁₀. Più ramificazioni → di solito punto di ebollizione più basso (superficie di contatto minore, London più deboli).",
  },
  {
    id: "position-iso",
    term: "Isomeria di posizione",
    group: "Isomeria",
    body: "Stesso scheletro e stesso gruppo funzionale, ma il gruppo (o il doppio) sta su un carbonio diverso. Butan-1-olo vs butan-2-olo; 1-clorobutano vs 2-clorobutano; but-1-ene vs but-2-ene. La formula è identica, la reattività no.",
  },
  {
    id: "functional-iso",
    term: "Isomeria funzionale",
    group: "Isomeria",
    body: "Stessa formula, gruppi funzionali diversi. C₂H₆O: etanolo (alcol, p.eb. 78 °C, H-bond) vs metossimetano (etere, p.eb. −24 °C, solo London). C₃H₆O: propanale (aldeide) vs propanone (chetone). È il caso in cui le proprietà divergono di più.",
  },
  {
    id: "stereo",
    term: "Stereoisomeri",
    group: "Isomeria",
    body: "Stessa connettività, geometria diversa. Conformazionali: si interconvertono ruotando un singolo (etano eclissato/sfalsato). Configurazionali: per interconvertirli bisogna rompere un legame — isomeri geometrici (cis/trans, E/Z) e ottici (enantiomeri).",
  },
  {
    id: "conformer",
    term: "Isomeri conformazionali",
    group: "Isomeria",
    body: "Rotameri intorno a un C–C singolo. Nell’etano lo sfalsato (staggered, 60°) è un minimo, l’eclissato (0°) un massimo (~12 kJ/mol). Nel butano: anti (180°, più stabile) e gauche (±60°). A T ambiente ruotano in continuazione: non si isolano, ma l’energia conta.",
  },
  {
    id: "newman",
    term: "Proiezione di Newman",
    group: "Isomeria",
    body: "Si guarda lungo un legame C–C: il carbonio anteriore è un punto con tre legami, il posteriore un cerchio con tre legami. L’angolo diedro ω misura la rotazione. È il disegno standard per confrontare eclissato, sfalsato, anti e gauche.",
  },
  {
    id: "configurational",
    term: "Isomeri configurazionali",
    group: "Isomeria",
    body: "Stereoisomeri che non si interconvertono per rotazione di un singolo. Due sottofamiglie: geometrici (cis/trans su C=C o ciclo) e ottici (enantiomeri su un stereocentro). Per passarvi da uno all’altro si rompe un σ o un π.",
  },
  {
    id: "geometric",
    term: "Isomeria geometrica (cis/trans, E/Z)",
    group: "Isomeria",
    body: "Il doppio C=C non ruota (il π si romperebbe). Se ogni carbonio sp² ha due sostituenti diversi, esistono due isomeri: cis (Z, gruppi uguali/prioritari dalla stessa parte) e trans (E, opposti). Il but-2-ene ha cis e trans; il but-1-ene no. Il trans è di solito più stabile (meno ingombro).",
  },
  {
    id: "enantiomer",
    term: "Enantiomeri (isomeri ottici)",
    group: "Isomeria",
    body: "Immagini speculari non sovrapponibili, come le mani. Condizione: stereocentro — di solito un C con quattro sostituenti diversi (C*). Stesse proprietà fisiche, ruotano il piano della luce polarizzata in versi opposti (+/−). Un 1:1 è il racemo, otticamente inattivo.",
  },
  {
    id: "chiral",
    term: "Chiralità e stereocentro",
    group: "Isomeria",
    body: "Una molecola è chirale se non è sovrapponibile alla sua immagine speculare (niente piano o centro di simmetria). Il carbonio tetraedrico CABCD è il caso più comune. L’acido lattico (CH₃C*HOHCOOH) ha due enantiomeri; un C con due H no.",
  },
  {
    id: "rs",
    term: "Configurazione R e S",
    group: "Isomeria",
    body: "Regole CIP: si assegnano priorità per Z atomico ai quattro sostituenti, si mette il meno prioritario (spesso H) lontano, e si legge 1→2→3. Orario = R (rectus), antiorario = S (sinister). R/S è una etichetta, non coincide automaticamente con +/− ottico.",
  },
  {
    id: "diastereomer",
    term: "Diastereoisomeri",
    group: "Isomeria",
    body: "Stereoisomeri che non sono enantiomeri. Cis e trans del but-2-ene lo sono. Con due stereocentri: RS e SR sono una coppia di enantiomeri; RR e RS sono diastereoisomeri (proprietà diverse, si separano più facilmente).",
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
  {
    id: "quantita",
    n: 10,
    title: "Moli e soluzioni",
    kicker: "Il banco di lab",
    summary: "Mole, massa molare, concentrazione. Dalla bilancia al matraccio: n = m/M = c·V.",
  },
  {
    id: "phlab",
    n: 11,
    title: "pH in laboratorio",
    kicker: "Acidi e basi",
    summary: "pH = −log[H₃O⁺], Kw, indicatori e pHmetro. Si vede il colore cambiare con la concentrazione.",
  },
  {
    id: "isomeri",
    n: 12,
    title: "Isomeria di struttura",
    kicker: "Catena, posizione, funzione",
    summary: "Stessa formula, connettività diversa. Monta la molecola e sposta il gruppo funzionale.",
  },
  {
    id: "stereo",
    n: 13,
    title: "Stereoisomeri",
    kicker: "Spazio e specchio",
    summary: "Conformazioni (Newman), cis/trans sul doppio, enantiomeri su un carbonio tetraedrico.",
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

export const LAB_SPECIES = [
  { id: "h2o", formula: "H₂O", name: "Acqua", parts: [["H", 2], ["O", 1]], hint: "Il solvente universale. 18 g ≈ 1 mol ≈ 18 mL." },
  { id: "nacl", formula: "NaCl", name: "Cloruro di sodio", parts: [["Na", 1], ["Cl", 1]], hint: "Sale da cucina. 58,4 g in 1 L → soluzione 1,00 M." },
  { id: "hcl", formula: "HCl", name: "Acido cloridrico", parts: [["H", 1], ["Cl", 1]], hint: "Acido forte. 0,100 M ha pH 1,00." },
  { id: "naoh", formula: "NaOH", name: "Idrossido di sodio", parts: [["Na", 1], ["O", 1], ["H", 1]], hint: "Base forte. 0,100 M ha pH 13,00." },
  { id: "glc", formula: "C₆H₁₂O₆", name: "Glucosio", parts: [["C", 6], ["H", 12], ["O", 6]], hint: "Zucchero. 180 g/mol: una mole pesa quasi un bicchiere." },
  { id: "co2", formula: "CO₂", name: "Anidride carbonica", parts: [["C", 1], ["O", 2]], hint: "44 g/mol. Un mol occupa 22,4 L come gas STP." },
  { id: "ch4", formula: "CH₄", name: "Metano", parts: [["C", 1], ["H", 4]], hint: "16 g/mol. Quattro idrogeni su un carbonio." },
  { id: "caco3", formula: "CaCO₃", name: "Carbonato di calcio", parts: [["Ca", 1], ["C", 1], ["O", 3]], hint: "Calcare. 100 g/mol: comodo per i conti a mente." },
  { id: "fe", formula: "Fe", name: "Ferro", parts: [["Fe", 1]], hint: "Elemento. 55,8 g sono una mole di atomi, non di molecole." },
  { id: "etoh", formula: "C₂H₆O", name: "Etanolo", parts: [["C", 2], ["H", 6], ["O", 1]], hint: "Alcol. Stessa formula dell’etere dimetilico: isomeri funzionali." },
];

export const PH_SAMPLES = [
  { id: "hcl1", name: "HCl 0,10 M", pH: 1, kind: "acido forte" },
  { id: "stomach", name: "Succo gastrico", pH: 2, kind: "acido" },
  { id: "vinegar", name: "Aceto", pH: 2.4, kind: "acido debole" },
  { id: "cola", name: "Bevanda gassata", pH: 3.2, kind: "acido" },
  { id: "rain", name: "Pioggia", pH: 5.6, kind: "leggermente acido" },
  { id: "milk", name: "Latte", pH: 6.5, kind: "quasi neutro" },
  { id: "water", name: "Acqua pura, 25 °C", pH: 7, kind: "neutro" },
  { id: "blood", name: "Sangue", pH: 7.4, kind: "tampone fisiologico" },
  { id: "nahco3", name: "NaHCO₃ (aq)", pH: 8.3, kind: "basico debole" },
  { id: "soap", name: "Sapone", pH: 10, kind: "basico" },
  { id: "nh3", name: "NH₃ 0,10 M", pH: 11.1, kind: "base debole" },
  { id: "naoh", name: "NaOH 0,10 M", pH: 13, kind: "base forte" },
];

export const FUNCTIONAL_PAIRS = [
  {
    id: "c2h6o",
    formula: "C₂H₆O",
    left: {
      id: "etoh",
      name: "Etanolo",
      iupac: "etanolo",
      group: "alcol",
      bp: "78 °C",
      note: "OH su catena C2. Legami a idrogeno: alto p.eb., miscibile con acqua.",
    },
    right: {
      id: "dme",
      name: "Metossimetano",
      iupac: "metossimetano",
      group: "etere",
      bp: "−24 °C",
      note: "Ossigeno a ponte tra due metili. Solo London: gas a T ambiente.",
    },
  },
  {
    id: "c3h6o",
    formula: "C₃H₆O",
    left: {
      id: "propanal",
      name: "Propanale",
      iupac: "propanale",
      group: "aldeide",
      bp: "49 °C",
      note: "Carbonile in cima alla catena (–CHO). Riduce il reattivo di Tollens.",
    },
    right: {
      id: "acetone",
      name: "Propanone",
      iupac: "propanone",
      group: "chetone",
      bp: "56 °C",
      note: "Carbonile interno. Non riduce Tollens. Solvente comune (acetone).",
    },
  },
  {
    id: "c3h8o",
    formula: "C₃H₈O",
    left: {
      id: "propoh",
      name: "Propan-1-olo",
      iupac: "propan-1-olo",
      group: "alcol",
      bp: "97 °C",
      note: "Alcol primario. Isomero di posizione del propan-2-olo, funzionale degli eteri C₃.",
    },
    right: {
      id: "eme",
      name: "Metossietano",
      iupac: "metossietano",
      group: "etere",
      bp: "7 °C",
      note: "Etere. Stessa formula, funzione diversa: niente H-bond donore.",
    },
  },
];

export const ISOMER_CHALLENGES = [
  {
    id: "nbutane",
    prompt: "Monta il n-butano",
    hint: "Catena lineare di quattro carboni, nessun gruppo funzionale.",
    check: { skel: "n", group: "h", pos: 1 },
    explain: "Butano: C₄H₁₀ lineare. L’isomero di catena è il 2-metilpropano.",
  },
  {
    id: "isobutane",
    prompt: "Trova l’isomero di catena del n-butano",
    hint: "Stessa C₄H₁₀, scheletro ramificato.",
    check: { skel: "iso", group: "h", pos: 2 },
    explain: "2-metilpropano (isobutano): tre metili su un CH. Formula identica, p.eb. più basso.",
  },
  {
    id: "but1ol",
    prompt: "Costruisci il butan-1-olo",
    hint: "Catena C4 lineare, OH sul carbonio terminale.",
    check: { skel: "n", group: "oh", pos: 1 },
    explain: "Butan-1-olo: alcol primario. Spostando l’OH sul C2 ottieni l’isomero di posizione.",
  },
  {
    id: "but2ol",
    prompt: "Sposta l’OH: ottieni l’isomero di posizione",
    hint: "Stessa catena lineare, OH sul carbonio 2.",
    check: { skel: "n", group: "oh", pos: 2 },
    explain: "Butan-2-olo. Stesso scheletro, stesso gruppo, posizione diversa. Il C2 è anche stereocentro.",
  },
  {
    id: "tbutanol",
    prompt: "Ramifica: 2-metilpropan-2-olo",
    hint: "Scheletro iso, OH sul carbonio centrale (terziario).",
    check: { skel: "iso", group: "oh", pos: 2 },
    explain: "Alcol terziario, isomero di catena (e in parte di posizione) dei butanoli lineari. Tutti C₄H₁₀O.",
  },
  {
    id: "but2ene",
    prompt: "Metti il doppio al centro: but-2-ene",
    hint: "Catena lineare, doppio tra C2 e C3 — qui nascono cis e trans.",
    check: { skel: "n", group: "=", pos: 2 },
    explain: "But-2-ene. Il π blocca la rotazione: stereoisomeri geometrici. Il but-1-ene (doppio in punta) non li ha.",
  },
  {
    id: "cl1",
    prompt: "Costruisci l’1-clorobutano",
    hint: "Catena lineare C4, cloro sul carbonio 1.",
    check: { skel: "n", group: "cl", pos: 1 },
    explain: "1-clorobutano: alogenuro primario. Spostando il Cl sul C2 ottieni l’isomero di posizione.",
  },
  {
    id: "but1ene",
    prompt: "Doppio in punta: but-1-ene",
    hint: "Catena lineare, C=C tra C1 e C2. Il CH₂ ha due H uguali: niente cis/trans.",
    check: { skel: "n", group: "=", pos: 1 },
    explain: "But-1-ene, alchene terminale. L’isomero di posizione è il but-2-ene, che invece ha cis e trans.",
  },
];

