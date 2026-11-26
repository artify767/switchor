/* ==========================================================================
   SWITCHOR EDITORIAL — INTERACTIVE ENGINE
   Optical 360° Film, Tear-Off Stub Lab, Buyer Personalizer, Profit Meter,
   Co-Create Voting, Crisp Vector 3D Modal, Friendly Workshop Guide & Sample Tray
   ========================================================================== */
(() => {
  'use strict';

  const D = window.SW_ED;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const fmt = (n, d = 0) => Number(n).toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)');
  const LOGO_VB = '9.7 10.7 960.3 125.2';

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* noop */ } }
  };

  /* ---------- Toast & Email Helpers ---------- */
  let toastT = 0;
  function toast(msg, action) {
    const t = $('#toast'), b = $('#toastAct');
    if (!t) return;
    $('#toastMsg').textContent = msg;
    if (action) { b.hidden = false; b.textContent = action.label; b.onclick = () => { t.classList.remove('on'); action.fn(); }; }
    else { b.hidden = true; b.onclick = null; }
    t.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove('on'), action ? 5200 : 3200);
  }
  function openMail(subject, body) {
    const a = document.createElement('a');
    a.href = `mailto:${D.EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove();
  }
  async function copyText(t) {
    try { await navigator.clipboard.writeText(t); return true; } catch (e) {
      const ta = document.createElement('textarea'); ta.value = t; ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;left:-9999px;top:0'; document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
      ta.remove(); return ok;
    }
  }

  /* ---------- Real Code 128 Barcode + 2.5D Tip SVG ---------- */
  const C128 = ['11011001100','11001101100','11001100110','10010011000','10010001100','10001001100','10011001000','10011000100','10001100100','11001001000','11001000100','11000100100','10110011100','10011011100','10011001110','10111001100','10011101100','10011100110','11001110010','11001011100','11001001110','11011100100','11001110100','11101101110','11101001100','11100101100','11100100110','11101100100','11100110100','11100110010','11011011000','11011000110','11000110110','10100011000','10001011000','10001000110','10110001000','10001101000','10001100010','11010001000','11000101000','11000100010','10110111000','10110001110','10001101110','10111011000','10111000110','10001110110','11101110110','11010001110','11000101110','11011101000','11011100010','11011101110','11101011000','11101000110','11100010110','11101101000','11101100010','11100011010','11101111010','11001000010','11110001010','10100110000','10100001100','10010110000','10010000110','10000101100','10000100110','10110010000','10110000100','10011010000','10011000010','10000110100','10000110010','11000010010','11001010000','11110111010','11000010100','10001111010','10100111100','10010111100','10010011110','10111100100','10011110100','10011110010','11110100100','11110010100','11110010010','11011011110','11011110110','11110110110','10101111000','10100011110','10001011110','10111101000','10111100010','11110101000','11110100010','10111011110','10111101110','11101011110','11110101110','11010000100','11010010000','11010011100'];
  function barcodeSVG(text, h = 50, quiet = 8) {
    const codes = [104];
    for (const ch of text) { const v = ch.charCodeAt(0) - 32; if (v >= 0 && v < 95) codes.push(v); }
    let sum = 104; for (let i = 1; i < codes.length; i++) sum += codes[i] * i;
    codes.push(sum % 103);
    const bits = codes.map(c => C128[c]).join('') + '1100011101011';
    let r = '';
    for (let i = 0; i < bits.length;) {
      if (bits[i] === '1') { let j = i; while (j < bits.length && bits[j] === '1') j++; r += `<rect x="${i + quiet}" y="0" width="${j - i}" height="${h}"/>`; i = j; } else i++;
    }
    return `<svg viewBox="0 0 ${bits.length + quiet * 2} ${h}" preserveAspectRatio="none" fill="currentColor" role="img" aria-label="Code 128 ${esc(text)}">${r}</svg>`;
  }

  let tipUid = 0;
  function tipSVG(model, k = 6.2) {
    const d = D.TIPS[model], L = d.len;
    let B, T, pts;
    if (d.series === 'A4') { B = Math.round(L * 0.6 * 2) / 2; T = L * 0.3; pts = [[0, 0], [L, 0], [L, B], [B * 0.38, B]]; }
    else { B = Math.round(L * 0.36 * 2) / 2; T = L * 0.2; const hh = (B / 2) / Math.tan(Math.PI / 6); pts = [[hh, 0], [L, 0], [L, B], [hh, B], [0, B / 2]]; }
    const ty = 0.54, dz = T * k * 0.56;
    const P = pts.map(([x, y]) => [x * k, y * k * ty]);
    const w = L * k, hTop = B * k * ty, H = hTop + dz + 2, gid = `et${++tipUid}`;
    let sides = '';
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length], dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
      const nx = dy / len, ny = -dx / len;
      if (ny <= 0.01) continue;
      const pa = P[i], pb = P[(i + 1) % P.length], t = clamp(0.5 + 0.5 * (ny * 0.85 - nx * 0.4), 0, 1);
      const c = [Math.round(lerp(52, 114, t)), Math.round(lerp(60, 124, t)), Math.round(lerp(76, 146, t))];
      sides += `<path d="M${pa[0].toFixed(1)} ${pa[1].toFixed(1)}L${pb[0].toFixed(1)} ${pb[1].toFixed(1)}L${pb[0].toFixed(1)} ${(pb[1] + dz).toFixed(1)}L${pa[0].toFixed(1)} ${(pa[1] + dz).toFixed(1)}Z" fill="rgb(${c})" stroke="#1E2433" stroke-width="0.9" stroke-linejoin="round"/>`;
    }
    const top = P.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('') + 'Z';
    return `<svg width="${w.toFixed(0)}" height="${H.toFixed(0)}" viewBox="-1 -1 ${(w + 2).toFixed(1)} ${(H + 2).toFixed(1)}" aria-hidden="true">
      <defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6F7FA"/><stop offset=".52" stop-color="#C5CBD8"/><stop offset="1" stop-color="#8A94A8"/></linearGradient></defs>
      ${sides}<path d="${top}" fill="url(#${gid})" stroke="#1E2433" stroke-width="1" stroke-linejoin="round"/>
      <path d="${top}" fill="none" stroke="rgba(255,255,255,.78)" stroke-width="0.9" transform="translate(0.7 0.7)" stroke-linejoin="round"/></svg>`;
  }

  /* ---------- ERP CSV Download & Printable Summary ---------- */
  function downloadCSV() {
    const h = 'SKU,Model,Series,Persona,Grade,Nominal_Length_mm,Net_Weight_kg,Barcode_Type,HS_Code,Origin';
    const rows = D.ORDER.map(m => {
      const t = D.TIPS[m];
      return `${D.sku(m)},${m},${t.series} Series,"${t.persona}",YG6,${t.len},1.0,Code 128,8209.00,"Engineered in Europe / Made in China"`;
    });
    const blob = new Blob([[h, ...rows].join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = 'Switchor-YG6-ERP-Catalog.csv';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Downloaded Switchor-YG6-ERP-Catalog.csv');
  }

  /* ---------- Mobile Menu & Hero Pointer Glow ---------- */
  (() => {
    const btn = $('#menuBtn'), nav = $('#mnav');
    if (btn && nav) {
      const toggle = open => {
        nav.hidden = !open; btn.setAttribute('aria-expanded', String(open));
        $('use', btn).setAttribute('href', open ? '#i-close' : '#i-menu');
        document.documentElement.style.overflow = open ? 'hidden' : '';
      };
      btn.addEventListener('click', () => toggle(nav.hidden));
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && !nav.hidden) toggle(false); });
      window.addEventListener('resize', () => { if (window.innerWidth > 960) toggle(false); });
    }
    const hc = $('.hero-full') || $('.hero-canvas');
    if (hc && !RM.matches) {
      hc.addEventListener('pointermove', e => {
        const r = hc.getBoundingClientRect();
        hc.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
        hc.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
      });
    }

    /* Captivating Hero Scene Switcher & Live 5-Profile Telemetry Selector */
    const heroDeck = $('#heroDeck');
    if (heroDeck && D.HERO_SCENES) {
      const sceneImgs = $$('.hero-scene-img');
      const sceneBtns = $$('[data-hero-scene]', heroDeck);
      const captionEl = $('#heroSceneCaption');
      const specsEl = $('#heroSpecs');
      const chipsEl = $('#heroSkuChips');
      const skuReadout = $('#heroSkuReadout');

      function setScene(key) {
        const sc = D.HERO_SCENES[key] || D.HERO_SCENES.shear;
        sceneBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.heroScene === key)));
        sceneImgs.forEach(img => img.classList.toggle('active', img.dataset.scene === key));
        if (captionEl) captionEl.innerHTML = sc.caption;
        if (specsEl) {
          specsEl.innerHTML = sc.specs.map(s => `<div class="hero-spec"><span>${esc(s.k)}</span><strong>${esc(s.v)}</strong></div>`).join('');
        }
      }
      sceneBtns.forEach(b => b.addEventListener('click', () => setScene(b.dataset.heroScene)));
      setScene('shear');

      if (chipsEl && skuReadout) {
        chipsEl.innerHTML = D.ORDER.map(m => `<button type="button" class="hero-sku-chip" data-hsku="${m}" aria-pressed="${m === 'A420'}">${m}</button>`).join('');
        function selectSku(m) {
          const t = D.TIPS[m] || D.TIPS.A420;
          $$('[data-hsku]', chipsEl).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.hsku === m)));
          skuReadout.innerHTML = `<div><b>${m} · ${esc(t.persona)} (${t.len} mm)</b><span>${esc(t.use)}</span></div>
            <button type="button" class="btn btn-primary btn-xs" data-add="${m}">+ Add 1 kg</button>`;
        }
        chipsEl.addEventListener('click', e => {
          const b = e.target.closest('[data-hsku]');
          if (b) selectSku(b.dataset.hsku);
        });
        selectSku('A420');
      }
    }

    /* Live Interactive Google Map Hub Switcher (Last Section) */
    $$('[data-map-finale]').forEach(sec => {
      const tabsEl = $('[data-hub-tabs]', sec);
      const cardEl = $('[data-hub-card]', sec);
      const iframe = $('[data-gmap-frame]', sec);
      const badgeEl = $('[data-map-badge]', sec);
      if (!tabsEl || !iframe || !D.LOCATIONS) return;

      tabsEl.innerHTML = D.LOCATIONS.map((loc, i) => `<button type="button" class="hub-tab" data-hub="${loc.id}" aria-pressed="${i === 0}">${esc(loc.label)}</button>`).join('');

      function setHub(id) {
        const loc = D.LOCATIONS.find(l => l.id === id) || D.LOCATIONS[0];
        $$('[data-hub]', tabsEl).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.hub === loc.id)));
        const q = encodeURIComponent(loc.mapQuery);
        iframe.src = `https://maps.google.com/maps?q=${q}&t=&z=${loc.zoom || 12}&ie=UTF8&iwloc=&output=embed`;
        iframe.title = `Live Google Map — ${loc.title} (${loc.label})`;
        const extUrl = `https://www.google.com/maps/search/?api=1&query=${q}`;
        if (cardEl) {
          cardEl.innerHTML = `<div class="hub-card-top"><span class="hub-card-role">${esc(loc.role)}</span><span class="hub-card-coords">${esc(loc.coords)}</span></div>
            <strong>${esc(loc.title)}</strong>
            <p>${esc(loc.address)}</p>
            <div class="hub-meta-row"><span style="color:var(--on-dark-3)">${esc(loc.hours)}</span><a href="${extUrl}" target="_blank" rel="noopener">Open in Google Maps ↗</a></div>`;
        }
        if (badgeEl) {
          badgeEl.innerHTML = `<i class="hero-live-dot" aria-hidden="true"></i><span>LIVE GOOGLE MAP · ${esc(loc.label.toUpperCase())}</span><a href="${extUrl}" target="_blank" rel="noopener">Directions ↗</a>`;
        }
      }
      tabsEl.addEventListener('click', e => {
        const b = e.target.closest('[data-hub]');
        if (b) setHub(b.dataset.hub);
      });
      setHub(D.LOCATIONS[0].id);
    });
  })();

  /* ---------- Persistent Sample & Order Tray Drawer ---------- */
  const tray = (() => {
    let items = store.get('sw-ed-tray', {});
    Object.keys(items).forEach(k => { if (!D.TIPS[k] || !(items[k] > 0)) delete items[k]; });
    const drawer = $('#trayDrawer'), scrim = $('#scrim');
    const total = () => D.ORDER.reduce((a, m) => a + (items[m] || 0), 0);

    function open() {
      if (!drawer || !scrim) return;
      render(); scrim.hidden = false; drawer.hidden = false;
      document.documentElement.style.overflow = 'hidden';
      requestAnimationFrame(() => { scrim.classList.add('on'); drawer.classList.add('on'); });
      scrim.onclick = closeAll;
    }
    function close() {
      if (!drawer || drawer.hidden) return;
      drawer.classList.remove('on');
      if (!$('#modal3d') || $('#modal3d').hidden) { scrim.classList.remove('on'); document.documentElement.style.overflow = ''; }
      setTimeout(() => { drawer.hidden = true; if (!$('#modal3d') || $('#modal3d').hidden) scrim.hidden = true; }, 260);
    }
    function save() { store.set('sw-ed-tray', items); render(); }
    function bump() { const b = $('#trayCount'); if (!b) return; b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }

    function add(m, q = 1) {
      items[m] = clamp((items[m] || 0) + q, 1, 999); save(); bump();
      toast(`Added ${q} × 1 kg box of ${m} to your Sample Tray`, { label: 'Open Tray', fn: open });
    }
    function addKit(id) {
      const k = D.KITS[id]; if (!k) return;
      Object.entries(k.items).forEach(([m, q]) => { items[m] = clamp((items[m] || 0) + q, 1, 999); });
      save(); bump();
      toast(`Added ${k.name} to your Sample Tray`, { label: 'Open Tray', fn: open });
    }
    function setQ(m, q) { if (!(q > 0)) delete items[m]; else items[m] = clamp(q, 1, 999); save(); }
    function lines() { return D.ORDER.filter(m => items[m]).map(m => `- ${m} (${D.sku(m)}): ${items[m]} × 1 kg box`); }

    function render() {
      const n = total(), badge = $('#trayCount');
      if (badge) { badge.textContent = n; badge.hidden = n === 0; }
      const body = $('#trayBody'), ms = D.ORDER.filter(m => items[m]);
      if (body) {
        body.innerHTML = ms.length
          ? ms.map(m => `<div class="tray-row">
              <div><strong>${m} — ${D.TIPS[m].persona}</strong><div style="font-size:12.5px;color:var(--ink-3)"><span class="mono">${D.sku(m)}</span> · 1 kg sealed box</div></div>
              <div class="tray-qty"><button type="button" data-tq="-1" data-m="${m}">−</button><span>${items[m]}</span><button type="button" data-tq="1" data-m="${m}">+</button></div>
              <button type="button" class="icon-pill" style="width:34px;height:34px" data-trm="${m}" aria-label="Remove ${m}"><svg aria-hidden="true"><use href="#i-close"/></svg></button>
            </div>`).join('')
          : `<div style="padding:28px 0;color:var(--ink-2)"><p>Your Sample &amp; Order Tray is empty.</p><button type="button" class="btn btn-primary btn-sm" data-kit="discovery" style="width:100%">+ Add 5 kg Discovery Box (All 5 Profiles)</button></div>`;
      }
      if ($('#trayTotal')) $('#trayTotal').textContent = `${n} box${n === 1 ? '' : 'es'} · ${n} kg net`;
      if ($('#trayClear')) $('#trayClear').hidden = !n;

      const formSum = $('#formTraySummary');
      if (formSum) {
        formSum.innerHTML = ms.length
          ? `<div style="display:grid;gap:6px">${ms.map(m => `<div style="display:flex;justify-content:space-between;font-size:14.5px"><span><strong>${m}</strong> (${D.TIPS[m].persona})</span><span class="mono"><strong>${items[m]} × 1 kg</strong></span></div>`).join('')}
             <div style="border-top:1px solid var(--border);padding-top:8px;margin-top:4px;display:flex;justify-content:space-between;font-size:13.5px;color:var(--ink-2)"><span>Total: <strong>${n} kg</strong></span><button type="button" style="background:none;border:0;color:var(--blue);font-weight:600" data-open-tray>Edit tray</button></div></div>`
          : `<span style="color:var(--ink-3);font-size:14.5px">No boxes selected yet — tell us what you need below, or <button type="button" style="background:none;border:0;color:var(--blue);font-weight:600;padding:0" data-kit="discovery">load the 5 kg Discovery Box</button>.</span>`;
      }
    }

    if ($('#trayBtn')) $('#trayBtn').addEventListener('click', open);
    if ($('#trayClose')) $('#trayClose').addEventListener('click', close);
    if ($('#trayClear')) $('#trayClear').addEventListener('click', () => { items = {}; save(); toast('Tray cleared'); });
    if ($('#trayGo')) $('#trayGo').addEventListener('click', () => { close(); window.location.href = 'contact.html?tab=quote#studio-forms'; });
    if ($('#trayBody')) {
      $('#trayBody').addEventListener('click', e => {
        const d = e.target.closest('[data-tq]'), r = e.target.closest('[data-trm]');
        if (d) setQ(d.dataset.m, (items[d.dataset.m] || 0) + +d.dataset.tq);
        if (r) setQ(r.dataset.trm, 0);
      });
    }
    render();
    return { open, close, add, addKit, lines };
  })();

  /* ---------- Crisp Vector 3D Box Engine (Used on Collection Page & Cinema Modal) ---------- */
  function gaugeSVG() {
    const cx = 948, cy = 415; let t = '';
    for (let k = 1; k < 60; k++) {
      const a = ((k * 6 - 90) * Math.PI) / 180, maj = k % 5 === 0, r1 = maj ? 273 : 280, r2 = maj ? 295 : 292;
      t += `<line x1="${(cx + r1 * Math.cos(a)).toFixed(1)}" y1="${(cy + r1 * Math.sin(a)).toFixed(1)}" x2="${(cx + r2 * Math.cos(a)).toFixed(1)}" y2="${(cy + r2 * Math.sin(a)).toFixed(1)}" stroke="${maj ? '#0D1430' : '#9AA0BC'}" stroke-width="${maj ? 2.6 : 1.6}"/>`;
    }
    const arc = (d0, d1, col) => {
      const A = ((d0 - 90) * Math.PI) / 180, B = ((d1 - 90) * Math.PI) / 180, R = 255;
      return `<path d="M${(cx + R * Math.cos(A)).toFixed(1)} ${(cy + R * Math.sin(A)).toFixed(1)}A${R} ${R} 0 0 1 ${(cx + R * Math.cos(B)).toFixed(1)} ${(cy + R * Math.sin(B)).toFixed(1)}" fill="none" stroke="${col}" stroke-width="30"/>`;
    };
    let ruler = '';
    for (let k = 0; k < 48; k++) { const h = k % 4 === 0 ? 18 : 11, x = 65 + k * 12.1; ruler += `<line x1="${x.toFixed(1)}" y1="${210 - h}" x2="${x.toFixed(1)}" y2="210" stroke="${k === 0 ? '#026CE9' : '#0D1430'}" stroke-width="${k % 4 === 0 ? 2.4 : 1.4}"/>`; }
    return `<svg class="rul" viewBox="0 0 1316 901" aria-hidden="true">${t}<line x1="${cx}" y1="98" x2="${cx}" y2="118" stroke="#026CE9" stroke-width="3"/><polygon points="${cx - 14},67 ${cx + 14},67 ${cx},85" fill="#026CE9"/><line x1="${cx}" y1="712" x2="${cx}" y2="736" stroke="#0D1430" stroke-width="2.6"/>${arc(4, 84, '#026CE9')}${arc(96, 176, '#0D1430')}${arc(184, 264, '#0D1430')}${arc(276, 356, '#0D1430')}<circle cx="${cx}" cy="${cy}" r="230" fill="none" stroke="#DDE2EE" stroke-width="2"/>${ruler}</svg>`;
  }
  const GAUGE = gaugeSVG();
  const logoUse = (w, extra = '') => `<svg viewBox="${LOGO_VB}" style="width:${w}px;height:auto;${extra}" aria-hidden="true"><use href="#sw-logo"/></svg>`;
  function labelFront(m) {
    const code = D.sku(m);
    return `<div class="lbl lf"><div class="bx strip"><div class="row r1"><div class="c lc">${logoUse(262)}</div><div class="c"><div class="lab">Model</div><div class="val">${m}</div></div><div class="c"><div class="lab">Grade</div><div class="val">YG6</div></div><div class="c"><div class="lab">Net weight</div><div class="val">1&#8201;kg</div></div><div class="c bc">${barcodeSVG(code, 70, 0)}<span>${code}</span></div></div><div class="hdr2"><span class="e">Engineered in Europe, Made in China</span><span class="t">CEMENTED CARBIDE TIPS</span></div></div><div class="cut"><svg viewBox="0 0 100 26" style="color:#0D1430"><use href="#knife"/></svg><div class="d"></div><div class="t">CUT HERE</div><div class="d"></div><svg viewBox="0 0 100 26" style="color:#0D1430;transform:scaleX(-1)"><use href="#knife"/></svg></div><div class="bx main"><div class="row r2"><div class="c lc" style="padding:0 28px">${logoUse(640)}</div><div class="c ti" style="padding-left:24px"><b>Cemented Carbide Tips</b><small>CEMENTED CARBIDE TECHNOLOGY - PRECISION - PERFORMANCE - RELIABILITY</small></div></div><div class="row r3"><div class="c gd"><div class="lab">Grade</div><div class="val">YG6</div></div><div class="c"><div class="lab">Model</div><div class="val">${m}</div></div><div class="c"><div class="lab">Net weight</div><div class="val">1&#8201;kg</div></div><div class="c"><div class="lab">Typical use</div><div class="val sm">Cutting &amp; machining</div></div></div><div class="row r4"><div class="c hz"><div class="hzb"><div class="hzt"><svg viewBox="0 0 100 100"><use href="#ghs08"/></svg><div><h5>HAZARDOUS</h5><div class="hh">HEALTH HAZARD</div><div class="co">Contains cobalt (Co) &amp; tungsten carbide (WC)</div></div></div><div class="tx"><p>H317 May cause an allergic skin reaction. H334 May cause allergy or asthma symptoms or breathing difficulties if inhaled. H350i May cause cancer by inhalation.</p><p>Dust is released when grinding, brazing or machining. Use extraction, respirator and gloves. Wash hands after use.</p></div></div></div><div class="c inf"><div><div class="il">Terms of use</div><p>For industrial use by trained personnel only. Read the SDS before use.</p></div><div><div class="il">Storage</div><p>Keep dry in original closed box, away from moisture, acids &amp; food.</p></div><div><div class="il">First aid</div><p>Inhaled: fresh air. Skin: wash with soap. Eyes: rinse 15 min.</p></div><div><div class="il">Disposal</div><p>Return scrap to an authorised carbide recycler. Follow local rules.</p></div></div></div><div class="row r5"><div class="c ft">www.switchor.com</div><div class="c ft">info@switchor.com</div><div class="c ft" style="font-size:17px">Engineered in Europe, Made in China</div></div></div></div>`;
  }
  function labelTop(m) {
    const ring = '<svg viewBox="0 0 24 24" style="width:26px;height:26px;color:#0D1430;--ring-gap:#fff" aria-hidden="true"><use href="#ring"/></svg>';
    return `<div class="lbl lt">${GAUGE}${logoUse(640, 'position:absolute;left:64px;top:62px;color:#0D1430')}<h5>Cemented<br>Carbide<br><span>Tips</span></h5><div class="tag">PRECISION&nbsp;&nbsp;-&nbsp;&nbsp;PERFORMANCE&nbsp;&nbsp;-&nbsp;&nbsp;RELIABILITY</div><div class="mw"><div><div class="l">Model</div><div class="v">${m}</div></div><div class="sep"></div><div><div class="l">Net weight</div><div class="v">1&#8201;kg</div></div></div><div class="g"><div class="l">GRADE</div><div class="v">YG6</div></div><div class="foot"><span>www.switchor.com</span>${ring}<span>info@switchor.com</span>${ring}<span>Engineered in Europe, Made in China</span></div></div>`;
  }
  function mountBox3D(stage, b, model = 'A420') {
    if (!stage || !b) return null;
    const BW = 368, BH = 204, BD = 252;
    const F = {
      front: [BW, BH, `translateZ(${BD / 2}px)`, 'linear-gradient(180deg,rgba(255,255,255,0) 55%,rgba(13,20,48,.08))'],
      back: [BW, BH, `rotateY(180deg) translateZ(${BD / 2}px)`, 'rgba(13,20,48,.22)'],
      right: [BD, BH, `rotateY(90deg) translateZ(${BW / 2}px)`, 'linear-gradient(90deg,rgba(13,20,48,.10),rgba(13,20,48,.22))'],
      left: [BD, BH, `rotateY(-90deg) translateZ(${BW / 2}px)`, 'rgba(13,20,48,.2)'],
      top: [BW, BD, `rotateX(90deg) translateZ(${BH / 2}px)`, 'linear-gradient(180deg,rgba(13,20,48,.05),rgba(255,255,255,0) 60%)'],
      bottom: [BW, BD, `rotateX(-90deg) translateZ(${BH / 2}px)`, 'rgba(13,20,48,.35)']
    };
    const faces = {}; b.innerHTML = '';
    Object.entries(F).forEach(([k, [w, h, t, sh]]) => {
      const d = document.createElement('div'); d.className = `face face-${k}`;
      d.style.cssText = `width:${w}px;height:${h}px;left:${-w / 2}px;top:${-h / 2}px;transform:${t};--shade:${sh}`;
      b.appendChild(d); faces[k] = d;
    });
    const side = `<div class="lside">${logoUse(170)}<span>CEMENTED CARBIDE TIPS</span></div>`;
    faces.right.innerHTML = side; faces.left.innerHTML = side;
    faces.back.innerHTML = `<div class="lside">${logoUse(220)}<span>WWW.SWITCHOR.COM</span></div>`;
    faces.bottom.style.background = '#E3E8F0';
    let rx = -24, ry = -32, sc = 1, drag = null, currentModel = model;
    const apply = () => { b.style.transform = `scale(${sc}) rotateX(${rx}deg) rotateY(${ry}deg)`; };
    const fit = () => { const w = stage.clientWidth || 640; sc = clamp(w / (w < 600 ? 630 : 590), 0.45, 0.98); apply(); };
    const setAngle = (nx, ny) => { rx = nx; ry = ny; b.classList.remove('drag'); apply(); };
    const setModel = m => {
      currentModel = m;
      faces.front.innerHTML = `<div class="face-in" style="transform:scale(${BW / 1464})">${labelFront(m)}</div>`;
      faces.top.innerHTML = `<div class="face-in" style="transform:scale(${BW / 1316})">${labelTop(m)}</div>`;
      $$('[data-m3d]', stage).forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.m3d === m)));
    };
    stage.addEventListener('pointerdown', e => {
      if (e.target.closest('.stage-bar')) return;
      drag = { x: e.clientX, y: e.clientY, rx, ry }; stage.setPointerCapture(e.pointerId); b.classList.add('drag');
    });
    stage.addEventListener('pointermove', e => { if (!drag) return; ry = drag.ry + (e.clientX - drag.x) * 0.4; rx = clamp(drag.rx - (e.clientY - drag.y) * 0.3, -85, 12); apply(); });
    const end = () => { drag = null; b.classList.remove('drag'); };
    stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', end);
    const modelsEl = $('.stage-models', stage);
    if (modelsEl) {
      modelsEl.innerHTML = D.ORDER.map(m => `<button type="button" data-m3d="${m}" aria-pressed="${m === model}">${m}</button>`).join('');
      modelsEl.addEventListener('click', e => { const btn = e.target.closest('[data-m3d]'); if (btn) setModel(btn.dataset.m3d); });
    }
    const rst = $('.stage-reset', stage);
    if (rst) rst.addEventListener('click', () => { setAngle(-24, -32); });
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(stage);
    setModel(model); fit();
    return { setModel, setAngle, fit, getModel: () => currentModel };
  }

  let modal3dCtrl = null;
  let home3dCtrl = null;
  function openModal3D() {
    const m = $('#modal3d'), sc = $('#scrim');
    if (!m || !sc) return;
    const activeModel = home3dCtrl ? home3dCtrl.getModel() : 'A420';
    sc.hidden = false; m.hidden = false; document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(() => { sc.classList.add('on'); m.classList.add('on'); });
    if (!modal3dCtrl) modal3dCtrl = mountBox3D($('#m3dStage'), $('#m3dBox'), activeModel);
    else { modal3dCtrl.setModel(activeModel); setTimeout(() => modal3dCtrl.fit(), 40); }
    sc.onclick = closeAll;
  }
  function closeAll() {
    tray.close();
    const m = $('#modal3d'), sc = $('#scrim');
    if (m && !m.hidden) {
      m.classList.remove('on'); sc.classList.remove('on'); document.documentElement.style.overflow = '';
      setTimeout(() => { m.hidden = true; sc.hidden = true; }, 220);
    }
  }
  if ($('#m3dClose')) $('#m3dClose').addEventListener('click', closeAll);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

  /* ---------- 1. "Choose Your World" Personalizer ---------- */
  (() => {
    const root = $('#worldBox'); if (!root) return;
    const panel = $('#worldPanel');
    function show(key) {
      const w = D.WORLDS[key] || D.WORLDS.shop;
      $$('.world-tab', root).forEach(b => b.setAttribute('aria-selected', String(b.dataset.world === key)));
      const pBtn = w.primaryAction.type === 'kit'
        ? `<button type="button" class="btn btn-primary" data-kit="${w.primaryAction.value}">${w.primaryLabel}</button>`
        : `<a class="btn btn-primary" href="${w.primaryAction.value}">${w.primaryLabel}</a>`;
      const sBtn = w.secondaryAction === 'csv'
        ? `<button type="button" class="btn btn-outline" data-csv-export>${w.secondaryLabel}</button>`
        : `<a class="btn btn-outline" href="${w.secondaryHref}">${w.secondaryLabel}</a>`;
      panel.innerHTML = `<div><span class="kicker"><i></i>${w.eyebrow}</span><h3>${w.title}</h3><p>${w.body}</p><div class="btn-row">${pBtn}${sBtn}</div></div>
        <ul class="world-points">${w.points.map(pt => `<li><svg aria-hidden="true"><use href="#i-check"/></svg><span>${pt}</span></li>`).join('')}</ul>`;
    }
    $$('.world-tab', root).forEach(b => b.addEventListener('click', () => show(b.dataset.world)));
    show('shop');
  })();

  /* ---------- 2. Interactive Crisp 3D Packaging Showcase (Dark Stage + Synced Story Angles) ---------- */
  (() => {
    const stage = $('#home3dStage'), box = $('#home3dBox'), storiesEl = $('#pkgStories');
    if (stage && box) home3dCtrl = mountBox3D(stage, box, 'A420');
    if (!storiesEl) return;
    storiesEl.innerHTML = D.PKG_STORIES.map((s, i) => `<button type="button" class="pkg-story-btn" data-pstory="${i}" aria-pressed="${i === 0}">
      <span class="pnum">${s.num}</span><span><b>${s.title}</b><span>${s.desc}</span></span></button>`).join('');
    function selectStory(idx, rotateBox = true) {
      const s = D.PKG_STORIES[idx] || D.PKG_STORIES[0];
      $$('[data-pstory]', storiesEl).forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.pstory === idx)));
      if (rotateBox && home3dCtrl && s.view) home3dCtrl.setAngle(s.view.rx, s.view.ry);
    }
    storiesEl.addEventListener('click', e => { const b = e.target.closest('[data-pstory]'); if (b) selectStory(+b.dataset.pstory, true); });
    selectStory(0, false);
  })();

  /* ---------- 3. Interactive "Tear & Pin the Reorder Stub" Lab ---------- */
  (() => {
    const lab = $('#stubLab'), btn = $('#stubTearBtn'), slot = $('#pinnedSlot'), bc = $('#stubMiniBc');
    if (!lab || !btn) return;
    const cutTag = $('.stub-cut-tag', lab);
    if (bc) bc.innerHTML = barcodeSVG('SWA420YG61KG', 26, 4);
    let torn = false;
    function render() {
      lab.classList.toggle('torn', torn);
      btn.textContent = torn ? 'Reset Box Strip' : '✂ Tear & Pin Stub to Board';
      if (cutTag) cutTag.textContent = torn ? '✓ STUB DETACHED & PINNED' : '✂ CUT / TEAR ALONG LINE';
      if (slot) {
        slot.innerHTML = torn
          ? `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px"><strong style="font-size:13px">A420 · YG6 · 1 kg</strong><span class="tag-pill tag-live" style="padding:3px 8px;font-size:10px">PINNED</span></div><div style="height:24px;color:#0D1430">${barcodeSVG('SWA420YG61KG', 24, 4)}</div><div class="mono" style="font-size:10.5px;margin-top:4px;font-weight:700">SWA420YG61KG</div>`
          : 'Click “Tear &amp; Pin Stub” to see how workshops lock in effortless reorders.';
      }
    }
    btn.addEventListener('click', () => { torn = !torn; render(); });
    render();
  })();

  /* ---------- 4. Visual Profile Collection Gallery ---------- */
  (() => {
    const gal = $('#tipGallery'); if (!gal) return;
    gal.innerHTML = D.ORDER.map(m => {
      const t = D.TIPS[m];
      return `<article class="tip-card${t.star ? ' star' : ''}">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:6px">
          <span class="mono" style="font-size:11px;font-weight:700;color:var(--ink-3)">${t.series} SERIES</span>
          ${t.star ? '<span class="tag-pill tag-blue" style="padding:3px 9px;font-size:10.5px">BESTSELLER</span>' : `<span class="mono" style="font-size:11px;color:var(--sage);font-weight:600">IN STOCK</span>`}
        </div>
        <div class="tip-pedestal">${tipSVG(m, 6.2)}</div>
        <div class="tip-persona">${t.persona}</div>
        <h3>${m}<span>${t.len} mm</span></h3>
        <p>${t.story}</p>
        <div style="font-size:12px;color:var(--ink-3);padding-top:4px;border-top:1px solid var(--border)"><strong style="color:var(--ink)">Best for:</strong> ${t.use}</div>
        <button type="button" class="btn ${t.star ? 'btn-primary' : 'btn-outline'} btn-sm" data-add="${m}">+ Add 1 kg Box</button>
      </article>`;
    }).join('');
  })();

  /* ---------- 5. Single-Slider Human Profit & Supply Engine (800 AED / 1 kg · Official AED Symbol + USD) ---------- */
  (() => {
    const slider = $('#profitSlider'); if (!slider) return;
    const P = D.PRICING || { AED_PER_KG: 800, AED_PER_USD: 3.6725, TIPS_PER_KG: 28, FAIL_RATE: 0.105, HOURS_PER_FAIL: 0.35, SCRAP_RISK_AED: 180, SHOP_RATE_AED_HR: 260 };
    let curr = 'AED';
    const AED_MARK = '<svg class="aed-sym" viewBox="0 0 24 24" role="img" aria-label="AED"><use href="#i-aed"/></svg>';
    const moneyHTML = (aedVal, decimals = 0) => {
      if (curr === 'AED') return `<span class="aed-amt">${AED_MARK}<span>${fmt(Math.round(aedVal), decimals)}</span></span>`;
      return `$${fmt(Math.round(aedVal / P.AED_PER_USD), decimals)}`;
    };
    function update() {
      const kg = +slider.value;
      const annualKg = kg * 12;
      slider.style.setProperty('--fill', `${((kg - +slider.min) / (+slider.max - +slider.min)) * 100}%`);
      $('#profitKgOut').textContent = `${kg} ${kg === 1 ? 'box' : 'boxes'} / month`;

      const monthlySpendAed = kg * P.AED_PER_KG;
      const annualSpendAed = annualKg * P.AED_PER_KG;
      const avoided = Math.round(annualKg * P.TIPS_PER_KG * P.FAIL_RATE);
      const hours = Math.round(avoided * P.HOURS_PER_FAIL);
      const tipUnitAed = P.AED_PER_KG / P.TIPS_PER_KG;
      const savedAed = avoided * (tipUnitAed + P.SCRAP_RISK_AED + P.SHOP_RATE_AED_HR * P.HOURS_PER_FAIL);

      if ($('#profitUnitRate')) $('#profitUnitRate').innerHTML = `${moneyHTML(P.AED_PER_KG)} / 1 kg`;
      if ($('#profitMonthlyCost')) $('#profitMonthlyCost').innerHTML = `${moneyHTML(monthlySpendAed)} / mo`;
      if ($('#profitAnnualCost')) $('#profitAnnualCost').innerHTML = moneyHTML(annualSpendAed);
      if ($('#profitSavedBig')) $('#profitSavedBig').innerHTML = moneyHTML(savedAed);
      if ($('#profitAvoided')) $('#profitAvoided').textContent = `${fmt(avoided)} tips`;
      if ($('#profitHours')) $('#profitHours').textContent = `${fmt(hours)} hrs`;
      if ($('#profitAnnualKg')) $('#profitAnnualKg').textContent = `${fmt(annualKg)} kg / yr`;
    }
    slider.addEventListener('input', update);
    $$('[data-pcurr]').forEach(b => b.addEventListener('click', () => {
      curr = b.dataset.pcurr;
      $$('[data-pcurr]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      update();
    }));
    update();
  })();

  /* ---------- 6. Co-Create What's Next Interactive Demand Voting ---------- */
  (() => {
    const grid = $('#voteGrid'); if (!grid) return;
    let voted = store.get('sw-ed-votes', {});
    function render() {
      grid.innerHTML = D.HORIZON.map(h => {
        const isV = !!voted[h.id], count = h.baseVotes + (isV ? 1 : 0), pct = Math.min(98, h.pct + (isV ? 2 : 0));
        return `<article class="vote-card${isV ? ' voted' : ''}">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
            <span class="tag-pill tag-copper">${h.stage}</span>
            <span class="mono" style="font-size:12px;font-weight:700;color:var(--ink-2)">${count} partner requests</span>
          </div>
          <h3>${h.title}</h3>
          <p style="margin:0;color:var(--ink-2);font-size:15px">${h.desc}</p>
          <div class="vote-bar"><i style="width:${pct}%"></i></div>
          <div class="vote-foot">
            <button type="button" class="btn ${isV ? 'btn-primary' : 'btn-outline'} btn-xs" data-vote="${h.id}">${isV ? '✓ Prioritized by You' : '+ Prioritize This Launch'}</button>
            <button type="button" style="background:none;border:0;color:var(--blue);font-size:13.5px;font-weight:600" data-reserve="${esc(h.title)}">Reserve early access →</button>
          </div>
        </article>`;
      }).join('');
    }
    grid.addEventListener('click', e => {
      const v = e.target.closest('[data-vote]'), r = e.target.closest('[data-reserve]');
      if (v) {
        const id = v.dataset.vote; voted[id] = !voted[id]; store.set('sw-ed-votes', voted); render();
        toast(voted[id] ? 'Thank you — your demand vote was recorded!' : 'Vote removed');
      }
      if (r) {
        openMail(`Early Access Request: ${r.dataset.reserve}`, `Hello Switchor,\n\nPlease notify us first and reserve launch allocation for: ${r.dataset.reserve}.\n\nCompany:\nName:\nCountry:\n`);
        toast(`Prepared early-access email for ${r.dataset.reserve}`);
      }
    });
    render();
  })();

  /* ---------- 7. Friendly Workshop Advisor & Speed Dial (workshop.html) ---------- */
  (() => {
    const form = $('#shopAdvisor'); if (!form) return;
    const matBox = $('#advMats'), diaEl = $('#advDia'), out = $('#advOut');
    matBox.innerHTML = Object.entries(D.SHOP_MATS).map(([k, m], i) => `<label class="pill-opt"><input type="radio" name="smat" value="${k}" ${i === 0 ? 'checked' : ''}><span>${m.name}</span></label>`).join('');
    function render() {
      const key = (form.querySelector('input[name="smat"]:checked') || {}).value || 'cast-iron';
      const m = D.SHOP_MATS[key], dia = Math.max(5, parseFloat(diaEl.value) || 80);
      if (!m.ok) {
        out.innerHTML = `<span class="tag-pill tag-copper" style="align-self:flex-start">${m.badge}</span>
          <h3>Honest answer: skip YG6 for continuous steel.</h3>
          <p style="color:var(--ink-2);margin:0">${m.advice}</p>
          <div class="btn-row" style="margin-top:auto"><a class="btn btn-primary btn-sm" href="roadmap.html">Reserve Steel P-Series</a><a class="btn btn-outline btn-sm" href="contact.html?tab=oem#studio-forms">Ask Our Team</a></div>`;
        return;
      }
      const nLow = Math.round((1000 * m.vc[0]) / (Math.PI * dia));
      const nHigh = Math.round((1000 * m.vc[1]) / (Math.PI * dia));
      const nMid = Math.round((nLow + nHigh) / 2);
      out.innerHTML = `<span class="tag-pill tag-live" style="align-self:flex-start"><i></i>${m.badge}</span>
        <h3>Start around <span class="mono" style="color:var(--blue)">${fmt(nMid)} rpm</span></h3>
        <p style="color:var(--ink-2);margin:0">${m.advice}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div style="background:var(--stone-50);padding:14px;border-radius:10px;border:1px solid var(--border)"><span style="font-size:12px;color:var(--ink-3);display:block">Comfortable RPM Range</span><strong class="mono" style="font-size:16px">${fmt(nLow)} – ${fmt(nHigh)} rpm</strong></div>
          <div style="background:var(--stone-50);padding:14px;border-radius:10px;border:1px solid var(--border)"><span style="font-size:12px;color:var(--ink-3);display:block">Recommended Tip</span><strong style="font-size:16px">${m.tip}</strong></div>
        </div>
        <div class="btn-row" style="margin-top:auto"><button type="button" class="btn btn-primary btn-sm" data-kit="discovery">+ Order 5 kg Discovery Box</button><a class="btn btn-outline btn-sm" href="collection.html">Inspect All 5 Profiles</a></div>`;
    }
    form.addEventListener('change', render);
    diaEl.addEventListener('input', render);
    render();
  })();

  /* ---------- 8. Page-Mounted 3D Box (collection.html), FAQ & Contact Form ---------- */
  if ($('#col3dStage') && $('#col3dBox')) mountBox3D($('#col3dStage'), $('#col3dBox'), 'A420');
  if ($('#edFaq')) {
    $('#edFaq').innerHTML = D.FAQS.map(f => `<details><summary>${esc(f.q)}</summary><div class="faq-a"><p>${esc(f.a)}</p></div></details>`).join('');
  }
  if ($('#skuTableBody')) {
    $('#skuTableBody').innerHTML = D.ORDER.map(m => {
      const t = D.TIPS[m];
      return `<tr><th>${m}</th><td>${t.persona}</td><td>${t.use}</td><td class="mono">${t.len} mm</td><td class="mono">${D.sku(m)}</td><td><button type="button" class="btn btn-outline btn-xs" data-add="${m}">+ Add Box</button></td></tr>`;
    }).join('');
  }

  /* Contact Studio Tabs & Submit */
  (() => {
    const tabs = $$('[data-ctab]'); if (!tabs.length) return;
    function setTab(k) {
      tabs.forEach(t => {
        const s = t.dataset.ctab === k;
        t.setAttribute('aria-selected', String(s));
        const p = $(`#panel-${t.dataset.ctab}`); if (p) p.hidden = !s;
      });
    }
    tabs.forEach(t => t.addEventListener('click', () => setTab(t.dataset.ctab)));
    const p = new URLSearchParams(window.location.search).get('tab');
    setTab(p && ['quote', 'partner', 'oem'].includes(p) ? p : 'quote');

    $$('#studio-forms form').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const fd = Object.fromEntries(new FormData(form).entries());
        if (!fd.name || !fd.email) { toast('Please enter your name and business email.'); return; }
        const kind = form.dataset.kind;
        const lines = tray.lines();
        const subj = kind === 'partner' ? `Switchor Partner Application — ${fd.company || fd.name}` : kind === 'oem' ? `Switchor Custom / OEM Inquiry — ${fd.company || fd.name}` : `Switchor Commercial Quote — ${fd.company || fd.name}`;
        const body = [`Hello Switchor Team,`, '', ...(kind === 'quote' && lines.length ? ['Sample / Order Tray Items:', ...lines, ''] : []),
          ...Object.entries(fd).filter(([, v]) => String(v).trim()).map(([k, v]) => `${k.toUpperCase()}: ${String(v).trim()}`)].join('\n');
        openMail(subj, body);
        toast('Opening your email app with the structured inquiry ready to send.');
      });
      const cp = $('[data-copy-form]', form);
      if (cp) cp.addEventListener('click', async () => {
        const fd = Object.fromEntries(new FormData(form).entries());
        const text = `To: ${D.EMAIL}\n\n` + [...tray.lines(), '', ...Object.entries(fd).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`)].join('\n');
        if (await copyText(text)) toast('Inquiry copied — paste straight into email to info@switchor.com');
      });
    });
  })();

  /* ---------- Global Delegated Clicks ---------- */
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-add]'); if (a) { tray.add(a.dataset.add, 1); return; }
    const k = e.target.closest('[data-kit]'); if (k) { tray.addKit(k.dataset.kit); return; }
    if (e.target.closest('[data-open-tray]')) { tray.open(); return; }
    if (e.target.closest('[data-open-3d]')) { openModal3D(); return; }
    if (e.target.closest('[data-csv-export]')) { downloadCSV(); return; }
    const doc = e.target.closest('[data-doc]');
    if (doc) { openMail(`Request: ${doc.dataset.doc}`, `Hello Switchor,\n\nPlease send me the ${doc.dataset.doc}.\n\nName:\nCompany:\nCountry:\n`); toast(`Prepared email request for ${doc.dataset.doc}`); }
  });
})();
