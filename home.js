/* Infinity Furniture — the home page: collections, the fabric card, the showroom film. */
(() => {
  const { $, $$, reduce, priceText, sync, reveal } = window.IF;
  const ITEMS = window.IF_ITEMS;
  const GROUPS = window.COLLECTIONS || [];
  const Z = window.ZARA;
  GROUPS.forEach((g) => g.items.forEach((p) => { ITEMS[p.id] = { id: p.id, n: `${p.n} ${g.group === 'Dining' ? 'dining' : 'collection'}`, p: p.p, x: p.x, u: p.u, t: p.t }; }));
  if (Z) Z.colours.forEach((c) => { ITEMS[`${Z.id}-${c.key}`] = { key: `${Z.id}-${c.key}`, id: Z.id, n: `Zara sectional in ${c.label.toLowerCase()}`, p: Z.p, u: Z.u, t: Z.t }; });

  /* ---------- the collections ---------- */
  const listEl = $('#collection-list');
  const plus = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v14M3 10h14" stroke="currentColor" stroke-width="1.8" fill="none"/></svg>';
  if (listEl && GROUPS.length) {
    listEl.innerHTML = GROUPS.map((g) => `
      <div class="group">
        <div class="group-head"><h3 class="head">${g.group}</h3><a class="text-link" href="shop.html#${g.group.toLowerCase()}">All ${g.group.toLowerCase()} pieces</a></div>
        <ul class="items">${g.items.map((p) => `
          <li class="item" data-reveal>
            <a class="item-thumb" href="${p.u}" tabindex="-1" aria-hidden="true"><img src="${p.t}" alt="" width="360" height="360" loading="lazy"></a>
            <div class="item-text">
              <div class="item-line"><h4><a href="${p.u}">${p.n}</a></h4><p class="item-price">${priceText(p)}</p></div>
              <p class="item-what">${p.w}</p>
              <p class="item-desc">${p.q}</p>
              ${p.tr ? '<p class="item-tr">Made in Turkey</p>' : ''}
              <button class="add" type="button" data-add="${p.id}" aria-pressed="false">${plus}<span>Add to my list</span></button>
            </div>
          </li>`).join('')}
        </ul>
      </div>`).join('');
    reveal(listEl);
  }

  /* ---------- the fabric card ---------- */
  const sw = $('[data-swatches]');
  const zImg = $('[data-zara-img]');
  if (sw && Z) {
    sw.innerHTML = Z.colours.map((c, i) => `<button class="swatch" type="button" role="radio" aria-checked="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-colour="${c.key}" aria-label="${c.label}"><span class="swatch-dot" style="--dot:${c.dot}"></span><span class="swatch-name">${c.label}</span></button>`).join('');
    let cur = 0;
    const pick = (i) => {
      const c = Z.colours[i]; if (!c) return; cur = i;
      $$('.swatch', sw).forEach((b, j) => { b.setAttribute('aria-checked', String(j === i)); b.tabIndex = j === i ? 0 : -1; });
      $('[data-zara-name]').textContent = `Zara sectional in ${c.label.toLowerCase()}`;
      $('[data-zara-add]').dataset.add = `${Z.id}-${c.key}`;
      sync();
      const apply = () => { zImg.src = c.img; zImg.alt = `The Zara sectional in ${c.label.toLowerCase()}`; zImg.classList.remove('is-out'); };
      if (reduce) apply(); else { zImg.classList.add('is-out'); setTimeout(apply, 260); }
    };
    sw.addEventListener('click', (e) => { const b = e.target.closest('.swatch'); if (b) pick(Z.colours.findIndex((c) => c.key === b.dataset.colour)); });
    sw.addEventListener('keydown', (e) => {
      const d = ['ArrowRight', 'ArrowDown'].includes(e.key) ? 1 : ['ArrowLeft', 'ArrowUp'].includes(e.key) ? -1 : 0;
      if (!d) return; e.preventDefault();
      const n = (cur + d + Z.colours.length) % Z.colours.length; $$('.swatch', sw)[n].focus(); pick(n);
    });
    Z.colours.forEach((c) => { const im = new Image(); im.src = c.img; });
  }

  /* ---------- the showroom film plays only on screen ---------- */
  const vid = $('.arch video');
  if (vid) {
    if (reduce) { vid.removeAttribute('autoplay'); vid.pause(); }
    else if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => { en.isIntersecting ? vid.play().catch(() => {}) : vid.pause(); }).observe(vid);
  }
  sync();
})();
