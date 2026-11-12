/* Infinity Furniture — the shop: every piece in the store, filtered here in the browser. */
(() => {
  const { $, $$, priceText, esc, sync, reveal } = window.IF;
  const ITEMS = window.IF_ITEMS;
  const ALL = (window.SHOP || []).filter((p) => p.n);
  ALL.forEach((p) => { ITEMS[p.id] = { id: p.id, n: p.n, p: p.p, x: p.x, u: p.u, t: p.t }; });
  const DEPTS = ['Living', 'Dining', 'Tables & storage', 'Bedroom', 'Rugs', 'Accessories'];
  const slug = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const PAGE = 24;
  // each department is shown by its first piece with a real photograph, Turkish-made first
  const rank = (p) => (p.tr ? 2 : 0) + (p.ai ? 0 : 1);
  const COVER = { All: 'assets/t/lugano-living.webp' };
  DEPTS.forEach((d) => { const pool = ALL.filter((p) => p.d === d); const best = pool.slice().sort((a, b) => rank(b) - rank(a))[0]; COVER[d] = best ? best.t : ''; });
  COVER.Living = 'assets/t/dolphin-room.webp'; COVER.Dining = 'assets/t/lugano-dining.webp';
  const state = { dept: 'All', sec: 'All', q: '', tr: false, sort: 'featured', shown: PAGE };

  const tabs = $('[data-depts]'), secs = $('[data-secs]'), grid = $('[data-grid]'), count = $('[data-count-line]'), more = $('[data-more]');
  const search = $('[data-search]'), trBox = $('[data-tr]'), sortWrap = $('[data-sort]');

  /* ---------- from the address bar (#living, #dining …) ---------- */
  function fromHash() {
    const h = decodeURIComponent(location.hash.slice(1));
    const d = h ? DEPTS.find((x) => slug(x) === h || slug(x).startsWith(h)) : null;
    state.dept = d || 'All'; state.sec = 'All'; state.shown = PAGE;
  }

  function list() {
    const q = state.q.trim().toLowerCase();
    let r = ALL.filter((p) => (state.dept === 'All' || p.d === state.dept) && (state.sec === 'All' || p.s === state.sec) && (!state.tr || p.tr) && (!q || `${p.n} ${p.s} ${p.d} ${(p.o || []).join(' ')} ${p.q || ''}`.toLowerCase().includes(q)));
    if (state.sort === 'featured') r = r.map((p, i) => [p, i]).sort((a, b) => ((b[0].tr ? 2 : 0) + (b[0].ai ? 0 : 1)) - ((a[0].tr ? 2 : 0) + (a[0].ai ? 0 : 1)) || a[1] - b[1]).map((x) => x[0]);
    if (state.sort === 'low') r = r.slice().sort((a, b) => (a.p || 1e9) - (b.p || 1e9));
    if (state.sort === 'high') r = r.slice().sort((a, b) => (b.p || 0) - (a.p || 0));
    if (state.sort === 'name') r = r.slice().sort((a, b) => a.n.localeCompare(b.n));
    return r;
  }

  function drawTabs() {
    const c = (d) => ALL.filter((p) => d === 'All' || p.d === d).length;
    tabs.innerHTML = ['All', ...DEPTS].map((d) => `<button class="dept" type="button" role="tab" aria-selected="${d === state.dept}" data-dept="${esc(d)}"><img src="${COVER[d]}" alt="" width="420" height="420" loading="lazy"><span class="dept-name">${esc(d === 'All' ? 'Everything' : d)}</span><span class="dept-count">${c(d)}</span></button>`).join('');
    const pool = ALL.filter((p) => state.dept === 'All' || p.d === state.dept);
    const names = [...new Set(pool.map((p) => p.s))].sort();
    secs.innerHTML = state.dept === 'All' || names.length < 2 ? '' : ['All', ...names].map((s) => `<button class="sec" type="button" aria-pressed="${s === state.sec}" data-sec="${esc(s)}">${s === 'All' ? `All ${esc(state.dept.toLowerCase())}` : esc(s)}</button>`).join('');
    $$('.sort', sortWrap).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.sortBy === state.sort)));
  }

  const plus = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v14M3 10h14" stroke="currentColor" stroke-width="1.8" fill="none"/></svg>';
  function card(p) {
    return `<li class="card" data-reveal>
      <div class="card-media">
        <button class="card-photo" type="button" data-open="${p.id}" aria-label="Quick look: ${esc(p.n)}"><img src="${p.t}" alt="" width="420" height="420" loading="lazy"></button>
        <button class="card-add" type="button" data-add="${p.id}" aria-pressed="false" data-off="Add ${esc(p.n)} to my list" data-on="Remove ${esc(p.n)} from my list">${plus}<span class="sr-only">Add to my list</span></button>
      </div>
      <div class="card-text">
        <p class="card-sec">${esc(p.s)}${p.tr ? ' · <span class="card-tr">Made in Turkey</span>' : ''}</p>
        <h3 class="card-name"><button type="button" data-open="${p.id}">${esc(p.n)}</button></h3>
        <p class="card-price">${priceText(p)}</p>
      </div>
    </li>`;
  }

  function draw() {
    drawTabs();
    const r = list();
    grid.innerHTML = r.slice(0, state.shown).map(card).join('');
    count.textContent = r.length ? `Showing ${Math.min(state.shown, r.length)} of ${r.length} ${r.length === 1 ? 'piece' : 'pieces'}` : 'Nothing matches. Try another word or department.';
    more.hidden = state.shown >= r.length;
    reveal(grid); sync();
  }

  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('[data-dept]'); if (!b) return;
    state.dept = b.dataset.dept; state.sec = 'All'; state.shown = PAGE;
    history.replaceState(null, '', state.dept === 'All' ? location.pathname : `#${slug(state.dept)}`);
    draw();
  });
  secs.addEventListener('click', (e) => { const b = e.target.closest('[data-sec]'); if (!b) return; state.sec = b.dataset.sec; state.shown = PAGE; draw(); });
  sortWrap.addEventListener('click', (e) => { const b = e.target.closest('[data-sort-by]'); if (!b) return; state.sort = b.dataset.sortBy; state.shown = PAGE; draw(); });
  let st; search.addEventListener('input', () => { clearTimeout(st); st = setTimeout(() => { state.q = search.value; if (state.q.trim()) { state.dept = 'All'; state.sec = 'All'; } state.shown = PAGE; draw(); }, 140); });
  trBox.addEventListener('change', () => { state.tr = trBox.checked; state.shown = PAGE; draw(); });
  more.addEventListener('click', () => { state.shown += PAGE; draw(); });
  addEventListener('hashchange', () => { fromHash(); draw(); });

  /* ---------- quick look ---------- */
  const qv = $('#quick');
  function openQuick(id) {
    const p = ALL.find((x) => String(x.id) === String(id)); if (!p) return;
    const photos = (p.g && p.g.length ? p.g : [p.t]);
    $('[data-q-main]', qv).src = photos[0]; $('[data-q-main]', qv).alt = p.n;
    $('[data-q-thumbs]', qv).innerHTML = photos.length > 1 ? photos.map((src, i) => `<button type="button" aria-pressed="${i === 0}" data-q-photo="${esc(src)}" aria-label="Photo ${i + 1}"><img src="${esc(src)}" alt="" loading="lazy"></button>`).join('') : '';
    $('[data-q-sec]', qv).innerHTML = `${esc(p.d)} · ${esc(p.s)}${p.tr ? ' · <span class="card-tr">Made in Turkey</span>' : ''}`;
    $('[data-q-name]', qv).textContent = p.n;
    $('[data-q-price]', qv).textContent = priceText(p) + (p.x ? ` to $${Math.round(p.x).toLocaleString('en-CA')}` : '');
    $('[data-q-opts]', qv).textContent = p.o && p.o.length ? `Available as: ${p.o.join(' · ')}` : '';
    const q = p.q || ''; const end = q.lastIndexOf('. ');
    $('[data-q-desc]', qv).textContent = q.length >= 230 && end > 60 ? q.slice(0, end + 1) : q;
    $('[data-q-add]', qv).dataset.add = String(p.id);
    $('[data-q-ask]', qv).dataset.ask = String(p.id);
    $('[data-q-link]', qv).href = p.u;
    sync();
    if (typeof qv.showModal === 'function') qv.showModal(); else location.href = p.u;
  }
  document.addEventListener('click', (e) => {
    const o = e.target.closest('[data-open]'); if (o) { openQuick(o.dataset.open); return; }
    const ph = e.target.closest('[data-q-photo]');
    if (ph) { $('[data-q-main]', qv).src = ph.dataset.qPhoto; $$('[data-q-photo]', qv).forEach((b) => b.setAttribute('aria-pressed', String(b === ph))); }
    if (e.target.closest('[data-q-close]') || e.target === qv) qv.close();
    if (e.target.closest('[data-q-ask]')) qv.close();
  });

  fromHash(); draw();
})();
