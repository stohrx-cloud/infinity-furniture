/* Infinity Furniture — shared by the home page and the shop.
   The list lives in this browser only. Enquiries go the way the customer chooses: a call back, an email, or WhatsApp. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const money = (n) => '$' + Math.round(n).toLocaleString('en-CA');
  const priceText = (it) => (it.p ? `${it.x ? 'From ' : ''}${money(it.p)}` : 'Price on request');
  const EMAIL = 'info@infinityfurniture.ca', WA = '19056078575';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- the list ---------- */
  let list = [];
  try { list = JSON.parse(localStorage.getItem('if-list') || '[]').filter((x) => x && x.id && x.n); } catch (e) { list = []; }
  const save = () => { try { localStorage.setItem('if-list', JSON.stringify(list)); } catch (e) {} };
  const key = (it) => String(it.key || it.id);
  const has = (k) => list.some((x) => key(x) === String(k));
  const listeners = [];
  function toggle(item) {
    const k = key(item);
    list = has(k) ? list.filter((x) => key(x) !== k) : [...list, { key: k, id: item.id, n: item.n, p: item.p || 0, x: item.x || null, u: item.u, t: item.t || '' }];
    save(); sync();
  }
  function clear() { list = []; save(); sync(); }

  /* ---------- the list bar, the top-bar count ---------- */
  const bar = document.createElement('aside');
  bar.className = 'listbar'; bar.id = 'listbar'; bar.setAttribute('aria-label', 'Your list'); bar.hidden = true;
  bar.innerHTML = `<div class="listbar-sum"><p><strong data-count></strong> · <span data-total></span></p><p class="listbar-note">Fabric and size can change the price. Ask about financing.</p></div>
    <div class="listbar-actions"><button class="button button-quiet" type="button" data-clear>Clear</button><button class="button" type="button" data-ask-list>Send my list</button></div>`;
  document.body.appendChild(bar);
  $('[data-clear]', bar).addEventListener('click', clear);

  function sync() {
    $$('[data-add]').forEach((b) => {
      const on = has(b.dataset.add);
      b.setAttribute('aria-pressed', String(on));
      const label = on ? (b.dataset.on || 'On my list') : (b.dataset.off || 'Add to my list');
      const span = b.querySelector('span');
      if (span) span.textContent = label; else b.textContent = label;
    });
    const total = list.reduce((s, x) => s + (x.p || 0), 0);
    const from = list.some((x) => x.x || !x.p);
    bar.hidden = list.length === 0;
    document.body.classList.toggle('has-list', list.length > 0);
    $('[data-count]', bar).textContent = `${list.length} ${list.length === 1 ? 'piece' : 'pieces'}`;
    $('[data-total]', bar).textContent = `${from ? 'from ' : ''}${money(total)}`;
    $$('[data-list-count]').forEach((el) => { el.textContent = list.length ? `(${list.length})` : ''; });
    listeners.forEach((fn) => fn(list));
  }

  /* ---------- the enquiry ---------- */
  const dlg = document.createElement('dialog');
  dlg.className = 'ask'; dlg.id = 'ask'; dlg.setAttribute('aria-labelledby', 'ask-title');
  dlg.innerHTML = `
    <form class="ask-form" novalidate>
      <div class="ask-head"><h2 id="ask-title" class="lead-head" data-ask-title>Send us your list</h2><button class="ask-close" type="button" data-ask-close aria-label="Close"><svg viewBox="0 0 20 20" aria-hidden="true" width="16" height="16"><path d="M4 4l12 12M16 4L4 16" stroke="currentColor" stroke-width="1.6" fill="none"/></svg></button></div>
      <ul class="ask-items" data-ask-items></ul>
      <div class="ask-grid">
        <label><span>Your name</span><input name="name" autocomplete="name" required></label>
        <label><span>Phone</span><input name="phone" type="tel" autocomplete="tel"></label>
        <label class="wide"><span>Email</span><input name="email" type="email" autocomplete="email"></label>
        <label class="wide"><span>Anything we should know? (room size, fabric, timing)</span><textarea name="msg" rows="3"></textarea></label>
      </div>
      <fieldset class="ask-how">
        <legend>How should we reach you?</legend>
        <label><input type="radio" name="how" value="call" checked><span>Call me back</span></label>
        <label><input type="radio" name="how" value="email"><span>Email me</span></label>
        <label><input type="radio" name="how" value="whatsapp"><span>WhatsApp</span></label>
      </fieldset>
      <p class="ask-error" data-ask-error role="alert"></p>
      <button class="button button-block" type="submit" data-ask-submit>Send my request</button>
      <p class="ask-note">Or call <a href="tel:+19056078575">(905) 607-8575</a> · <a href="mailto:${EMAIL}">${EMAIL}</a></p>
    </form>`;
  document.body.appendChild(dlg);
  const form = $('form', dlg);
  let single = null;

  function openAsk(item) {
    single = item || null;
    $('[data-ask-title]', dlg).textContent = single ? `Ask about the ${single.n}` : (list.length ? 'Send us your list' : 'Make an enquiry');
    const items = single ? [single] : list;
    $('[data-ask-items]', dlg).innerHTML = items.map((x) => `<li>${x.t ? `<img src="${esc(x.t)}" alt="" width="56" height="56">` : '<span class="ask-blank"></span>'}<span class="ask-name">${esc(x.n)}</span><span class="ask-price">${priceText(x)}</span></li>`).join('');
    $('[data-ask-error]', dlg).textContent = '';
    updateSubmit();
    if (typeof dlg.showModal === 'function') dlg.showModal(); else location.hash = '#visit';
    setTimeout(() => form.name.focus(), 50);
  }
  function updateSubmit() {
    const how = form.how.value;
    $('[data-ask-submit]', dlg).textContent = how === 'whatsapp' ? 'Continue in WhatsApp' : how === 'email' ? 'Send by email' : 'Request a call back';
    form.phone.parentElement.classList.toggle('is-needed', how !== 'email');
    form.email.parentElement.classList.toggle('is-needed', how === 'email');
  }
  form.addEventListener('change', (e) => { if (e.target.name === 'how') updateSubmit(); });
  $('[data-ask-close]', dlg).addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const how = form.how.value, name = form.name.value.trim(), phone = form.phone.value.trim(), email = form.email.value.trim(), msg = form.msg.value.trim();
    const err = !name ? 'Please add your name.' : how === 'call' && !phone ? 'Please add a phone number so we can call you.' : how === 'email' && !email ? 'Please add your email address.' : '';
    if (err) { $('[data-ask-error]', dlg).textContent = err; return; }
    const items = single ? [single] : list;
    const lines = items.map((x) => `- ${x.n}, ${priceText(x).toLowerCase()}\n  ${x.u}`).join('\n');
    const pref = { call: `Please call me back on ${phone}.`, email: `Please reply by email to ${email}.`, whatsapp: 'Messaging on WhatsApp.' }[how];
    const body = `Hello Infinity Furniture,\n\n${items.length ? `I'm interested in:\n${lines}\n\n` : ''}${msg ? msg + '\n\n' : ''}${pref}\n\nName: ${name}${phone ? `\nPhone: ${phone}` : ''}${email ? `\nEmail: ${email}` : ''}`;
    if (how === 'whatsapp') window.open(`https://wa.me/${WA}?text=${encodeURIComponent(body)}`, '_blank', 'noopener');
    else location.href = `mailto:${EMAIL}?subject=${encodeURIComponent((how === 'call' ? 'Call back request: ' : 'Enquiry: ') + name)}&body=${encodeURIComponent(body)}`;
    $('[data-ask-error]', dlg).textContent = '';
    dlg.close();
  });

  document.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if (add && window.IF_ITEMS && window.IF_ITEMS[add.dataset.add]) { toggle(window.IF_ITEMS[add.dataset.add]); return; }
    const ask = e.target.closest('[data-ask]');
    if (ask) { e.preventDefault(); const it = ask.dataset.ask && window.IF_ITEMS ? window.IF_ITEMS[ask.dataset.ask] : null; openAsk(it || null); return; }
    if (e.target.closest('[data-ask-list]')) openAsk(null);
  });

  /* ---------- top bar + phone dock ---------- */
  const topBar = $('#top-bar');
  const dock = $('#dock');
  const first = $('main > section');
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    topBar?.classList.toggle('is-solid', y > 24);
    const past = first ? first.getBoundingClientRect().bottom < 80 : y > 400;
    const nearEnd = y + innerHeight > document.documentElement.scrollHeight - 40;
    if (!past || list.length) dock?.classList.remove('is-on');
    else if (y < lastY - 4 || nearEnd) dock?.classList.add('is-on');
    else if (y > lastY + 4) dock?.classList.remove('is-on');
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- reveals ---------- */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px 12% 0px', threshold: 0 }) : null;
  function reveal(root = document) {
    $$('[data-reveal]:not(.is-in)', root).forEach((el) => (io ? io.observe(el) : el.classList.add('is-in')));
  }
  reveal();
  addEventListener('load', () => setTimeout(() => $$('[data-reveal]').forEach((el) => {
    const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in');
  }), 2500));

  window.IF = { $, $$, reduce, money, priceText, esc, toggle, has, sync, reveal, openAsk, onList: (fn) => listeners.push(fn), get list() { return list; } };
  window.IF_ITEMS = window.IF_ITEMS || {};
  addEventListener('DOMContentLoaded', sync);
  sync();
})();
