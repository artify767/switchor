/* ==========================================================================
   SWITCHOR EDITORIAL — HUMAN-FIRST COMMERCIAL DATA
   ========================================================================== */
window.SW_ED = (() => {
  'use strict';

  const EMAIL = 'info@switchor.com';
  const ORDER = ['A416', 'A420', 'A425', 'C122', 'C125'];
  const sku = m => `SW${m}YG61KG`;

  /* Commercial Calculation Engine Constants (800 AED per 1 kg sealed YG6 box) */
  const PRICING = {
    AED_PER_KG: 800,
    AED_PER_USD: 3.6725,
    TIPS_PER_KG: 28,
    FAIL_RATE: 0.105,
    HOURS_PER_FAIL: 0.35,
    SCRAP_RISK_AED: 180,
    SHOP_RATE_AED_HR: 260
  };

  /* Live Google Map Hubs (update query/coords below to customize your exact pin) */
  const LOCATIONS = [
    {
      id: 'dubai',
      label: 'Dubai · UAE',
      role: 'MENA & Global Trade Hub',
      title: 'Switchor Commercial & Dispatch Desk',
      address: 'Jebel Ali Free Zone (JAFZA), Dubai, United Arab Emirates',
      coords: '25.0069° N, 55.0609° E',
      hours: 'Mon – Fri · 08:30 – 18:00 GST (UTC+4)',
      mapQuery: 'Jebel Ali Free Zone, Dubai, United Arab Emirates',
      zoom: 12
    },
    {
      id: 'europe',
      label: 'Stuttgart · DE',
      role: 'European Specification & QA Desk',
      title: 'Switchor Engineering Governance',
      address: 'Stuttgart Precision Corridor, Baden-Württemberg, Germany',
      coords: '48.7758° N, 9.1829° E',
      hours: 'Mon – Fri · 08:30 – 17:30 CET',
      mapQuery: 'Stuttgart, Germany',
      zoom: 11
    },
    {
      id: 'zhuzhou',
      label: 'Zhuzhou · CN',
      role: 'Tungsten-Belt Sintering Origin',
      title: 'Direct Carbide Sintering & Lot Release',
      address: 'Zhuzhou High-Tech Industrial Zone, Hunan, China',
      coords: '27.8274° N, 113.1339° E',
      hours: '6-Point Vacuum Sintering QA & Export Consolidation',
      mapQuery: 'Zhuzhou, Hunan, China',
      zoom: 11
    }
  ];

  /* Hero Visual Backdrop Switcher */
  const HERO_SCENES = {
    shear: {
      caption: '<strong>Live Shear Performance</strong> — Brazed Switchor YG6 cutting abrasive grey cast iron with clean chip shear and stable thermal integrity.',
      specs: [
        { k: 'Composition', v: '94WC / 6Co' },
        { k: 'Hardness', v: '≥ 89.5 HRA' },
        { k: 'Density', v: '14.6 g/cm³' }
      ]
    },
    alloy: {
      caption: '<strong>Vacuum-Sintered Geometry</strong> — Five precision-ground A4 & C1 profiles verified for pocket fit, zero porosity, and clean silver-alloy braze wetting.',
      specs: [
        { k: 'Stock Line', v: '5 Core SKUs' },
        { k: 'Net Pack', v: '1.00 kg Box' },
        { k: 'Release QA', v: '6-Point Lot' }
      ]
    }
  };

  const TIPS = {
    A416: {
      series: 'A4', len: 16,
      persona: 'Compact Precision',
      headline: 'Tight spaces, clean finishes.',
      use: 'Turning, boring & facing on compact shanks (12–16 mm)',
      story: 'Built for lighter lathes, internal boring bars, and crisp aluminium or copper busbar work where nimble control matters most.'
    },
    A420: {
      series: 'A4', len: 20, star: true,
      persona: 'The Everyday Hero',
      headline: 'The single box every shop keeps on hand.',
      use: 'General turning & facing on standard shanks (16–20 mm)',
      story: 'Our bestselling anchor profile. Handles daily cast-iron flanges, bronze bushings, and mixed workshop jobs shift after shift.'
    },
    A425: {
      series: 'A4', len: 25,
      persona: 'Heavy Roughing Powerhouse',
      headline: 'Deep cuts through rough cast skin.',
      use: 'Heavy roughing & facing on big shanks (20–32 mm)',
      story: 'Thick, reassuring mass engineered for pump housings, brake drums, and abrasive sand-cast iron that chews up ordinary tips.'
    },
    C122: {
      series: 'C1', len: 22,
      persona: 'Precision Threading',
      headline: 'Sharp forms, clean threads.',
      use: 'Thread cutting on standard shanks (16–20 mm)',
      story: 'Cleanly ground to metric, Whitworth, or custom thread profiles for brass manifolds, bronze valves, and cast fittings.'
    },
    C125: {
      series: 'C1', len: 25,
      persona: 'Extended Regrind Master',
      headline: 'Braze once. Regrind again and again.',
      use: 'Heavy threading & multi-regrind toolrooms (20–25 mm)',
      story: 'Extra carbide length gives dedicated toolrooms and regrinding shops significantly more working life from every single braze.'
    }
  };

  const KITS = {
    discovery: {
      name: '5 kg Discovery Box (All 5 Profiles)',
      totalKg: 5,
      items: { A416: 1, A420: 1, A425: 1, C122: 1, C125: 1 }
    },
    workshop: {
      name: '8 kg Machine Shop Core Pack',
      totalKg: 8,
      items: { A416: 2, A420: 4, A425: 2 }
    },
    partner: {
      name: '25 kg Distributor Launch Assortment',
      totalKg: 25,
      items: { A416: 5, A420: 10, A425: 5, C122: 3, C125: 2 }
    }
  };

  /* "Choose Your World" Personalizer Content */
  const WORLDS = {
    shop: {
      eyebrow: 'For Workshops & Toolrooms',
      title: 'Stop losing hours to <em>mystery carbide.</em>',
      body: 'Every Switchor box delivers the exact same reliable YG6 cut you tuned your lathe for last month — so castings finish cleanly, joints don’t crack in cooling, and your bench team never wastes a shift chasing bad metal.',
      points: [
        'Start small with our 5 kg Discovery Box — one sealed box of every profile',
        'Tear off the top reorder strip and pin it to your board for zero-hassle restocking',
        'Includes free plain-English lathe speed guide & crack-free brazing advice'
      ],
      primaryLabel: 'Add 5 kg Discovery Box',
      primaryAction: { type: 'kit', value: 'discovery' },
      secondaryLabel: 'See Your Annual Savings',
      secondaryHref: '#profit-story'
    },
    partner: {
      eyebrow: 'For Tooling Wholesalers & Distributors',
      title: 'Turn a forgotten commodity into a <em>repeat-margin</em> hero.',
      body: 'Unbranded bags force you to compete on pennies. Switchor gives your counter unmistakable European shelf presence, built-in GHS08 compliance, ready-to-import ERP barcodes, and a tear-off reorder stub that pulls customers right back to you.',
      points: [
        'Direct tungsten-belt manufacturing preserves strong distributor trade margins',
        'Zero warehouse relabelling — sealed 1 kg weight, Code 128 barcode & EU GHS08 printed',
        'First-mover priority allocation on upcoming YG8, Steel P-Series & CNC launches'
      ],
      primaryLabel: 'Explore Partner Program',
      primaryAction: { type: 'href', value: 'partners.html' },
      secondaryLabel: 'Download ERP SKU CSV',
      secondaryAction: 'csv'
    },
    oem: {
      eyebrow: 'For Industrial Buyers & Custom Projects',
      title: 'Need specialized profiles or <em>container-scale</em> supply?',
      body: 'Beyond our five ready-to-ship YG6 stock shapes, our European specification desk works directly with tungsten-belt sintering lines to produce custom blanks, wear parts, and private-forecast OEM volumes under strict release governance.',
      points: [
        'Submit your CAD drawing or target blank geometry directly to our engineering desk',
        'Every lot verified against density, hardness, and dimensional tolerances before dispatch',
        'Flexible FOB, CIF, or DDP logistics scaled from export master cases to full pallets'
      ],
      primaryLabel: 'Open Custom OEM Brief',
      primaryAction: { type: 'href', value: 'contact.html?tab=oem#studio-forms' },
      secondaryLabel: 'View Product Horizon',
      secondaryHref: 'roadmap.html'
    }
  };

  /* Interactive Crisp 3D Packaging Showcase Story Cards (synced camera angles) */
  const PKG_STORIES = [
    {
      num: '01',
      title: 'Recognized Across the Warehouse',
      view: { rx: -54, ry: -18 },
      desc: 'No more squinting at handwritten stickers. Our oversized top dial puts Grade YG6, model code, and 1.0 kg net weight front and centre on every shelf.'
    },
    {
      num: '02',
      title: 'Built-In Reorder Habit',
      view: { rx: -14, ry: -8 },
      desc: 'The top edge tears cleanly off along a precision cut line so machinists pin the exact barcode to their reorder board — turning every empty box into a repeat sale.'
    },
    {
      num: '03',
      title: 'European Safety Without Relabelling',
      view: { rx: -8, ry: 16 },
      desc: 'Distributors and European workshops stay effortlessly compliant from day one. Every required hazard disclosure, storage rule, and disposal notice ships printed cleanly on the carton.'
    },
    {
      num: '04',
      title: 'Verified 1.0 kg Sealed Trust',
      view: { rx: -24, ry: -34 },
      desc: 'No loose plastic bags or mystery weight shortfalls. Every box is check-weighed to a true 1.0 kg net and barcode-verified before leaving the line.'
    }
  ];

  /* Co-Create What's Next Interactive Roadmap (used on roadmap.html) */
  const HORIZON = [
    {
      id: 'yg8',
      stage: 'Next Launch · Pilot Testing',
      title: 'Heavy-Shock Grade YG8 & Grooving Shapes',
      desc: 'A tougher 8% cobalt grade built for interrupted roughing and rough foundry castings — paired with dedicated parting-off and grooving profiles.',
      baseVotes: 78,
      pct: 84
    },
    {
      id: 'pseries',
      stage: 'Metallurgical Validation',
      title: 'Steel-Cutting P-Series (YT5 & YT15)',
      desc: 'Engineered specifically for hot, fast continuous steel turning — eliminating crater wear so Switchor covers every metal in the shop.',
      baseVotes: 94,
      pct: 91
    },
    {
      id: 'shims',
      stage: 'System Ecosystem',
      title: 'Cadmium-Free Silver Shims & Matched Flux',
      desc: 'Ready-to-braze Ag49 silver shims, stress-absorbing copper trimetal shims for long tips, and clean fluoride flux — one trusted supplier for the entire joint.',
      baseVotes: 56,
      pct: 66
    },
    {
      id: 'cnc',
      stage: 'Precision CNC Horizon',
      title: 'ISO Indexable CNC Inserts (CNMG / CCMT)',
      desc: 'Bringing Switchor’s transparent specs, clean packaging, and direct tungsten-belt value into modern high-speed CNC turning and milling.',
      baseVotes: 68,
      pct: 74
    }
  ];

  /* Human-Friendly Material Guide (Workshop Page) */
  const SHOP_MATS = {
    'cast-iron': { name: 'Grey & Ductile Cast Iron', ok: true, badge: 'Perfect Match', vc: [75, 115], tip: 'A420 or A425', advice: 'Switchor YG6’s home turf. Short, crumbly cast-iron chips clear cleanly while the hard edge laughs off abrasive sand-cast skin.' },
    'aluminium': { name: 'Aluminium Alloys', ok: true, badge: 'Excellent Match', vc: [180, 360], tip: 'A416 or A420', advice: 'Polish a keen positive edge and run generous coolant so soft aluminium slices cleanly without sticking to the tip.' },
    'brass':     { name: 'Brass & Bronze', ok: true, badge: 'Excellent Match', vc: [120, 230], tip: 'A420 / C122 (threads)', advice: 'Free-cutting brass machines effortlessly. For tougher industrial bronze bushings, stay in the calmer lower half of the speed window.' },
    'copper':    { name: 'Copper & Busbars', ok: true, badge: 'Great Match', vc: [110, 190], tip: 'A416 or A420', advice: 'Keep the cutting edge razor-sharp and well lubricated to shear ductile electrical copper without smearing.' },
    'composites':{ name: 'Plastics & Fibreglass', ok: true, badge: 'Great Match', vc: [120, 260], tip: 'A416', advice: 'Outlasts high-speed steel tools by 10–25× in abrasive glass-filled nylon, PTFE, and composite housings.' },
    'steel':     { name: 'Carbon & Alloy Steel', ok: false, badge: 'Wait for P-Series', vc: [0, 0], tip: 'Upcoming Series 03', advice: 'We’ll always be honest with you: hot continuous steel chips wear straight tungsten-cobalt tips quickly. Reserve early access to our upcoming Steel P-Series instead.' }
  };

  const FAQS = [
    { q: 'Why does Switchor start with one grade (YG6) instead of fifty?', a: 'Because trust is built on consistency, not catalog bloat. We chose to perfect the single most versatile brazed carbide grade first — holding strict European specs, shelf-ready packaging, and GHS compliance on every box — before rolling out YG8, Steel P-Series, and brazing shims with our founding partners.' },
    { q: 'Can we test Switchor before placing a large commercial order?', a: 'Yes — that’s exactly why we created the 5 kg Discovery Box. It includes one sealed 1 kg box of every ready model (A416, A420, A425, C122, C125) so your workshop or key distributor customers can test brazeability, edge life, and packaging firsthand.' },
    { q: 'How does the tear-off reorder stub help distributors grow sales?', a: 'When a machinist opens a Switchor box, they tear the perforated top strip carrying the exact model, grade, weight, and Code 128 barcode and pin it to their reorder board. Instead of shopping around for anonymous loose bags next month, they reorder your exact Switchor SKU.' },
    { q: 'Are your boxes ready for European customs, warehouses, and retail shelves?', a: 'Completely. Every box ships under HS Code 8209.00 at verified 1.0 kg net weight with scannable Code 128 barcodes, an ERP-ready CSV import file, and printed European GHS08 safety, PPE, first-aid, and recycling disclosures.' },
    { q: 'What does “Engineered in Europe, Made in China” actually mean?', a: 'China produces roughly 80% of the world’s tungsten and hosts the planet’s deepest carbide sintering expertise. Switchor pairs direct tungsten-belt production with European engineering specifications, 6-point lot release checks, and European packaging & safety standards.' },
    { q: 'Can Switchor quote custom sintered profiles or private OEM volumes?', a: 'Yes. Through our Custom & OEM Studio, manufacturers and large distributors can submit drawings or target volumes for specialized brazed shapes and wear blanks produced under Switchor QA governance.' }
  ];

  return { EMAIL, ORDER, sku, PRICING, LOCATIONS, HERO_SCENES, TIPS, KITS, WORLDS, PKG_STORIES, HORIZON, SHOP_MATS, FAQS };
})();
