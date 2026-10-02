/* ============================================================
   PANTALLA DE CARGA
   ============================================================ */
(function(){
  const el = document.getElementById('loadScreen');
  function hide(){ el.classList.add('hidden'); }
  window.addEventListener('load', () => setTimeout(hide, 200));
  setTimeout(hide, 700);
})();

/* ============================================================
   HEADER SÓLIDO AL HACER SCROLL
   ============================================================ */
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  const onInicio = document.querySelector('.tab-panel.active')?.dataset.tabPanel === 'inicio';
  if (onInicio) header.classList.toggle('solid', window.scrollY > 60);
});

/* ============================================================
   NAVEGACIÓN SPA POR PESTAÑAS
   ============================================================ */
const panels = document.querySelectorAll('.tab-panel');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.15 });

function goToTab(tabId) {
  panels.forEach(p => p.classList.toggle('active', p.dataset.tabPanel === tabId));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.tab === tabId));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById('main-nav').classList.remove('open');
  header.classList.toggle('solid', tabId !== 'inicio');
  const activePanel = document.querySelector('.tab-panel.active');
  if (activePanel) activePanel.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}
document.querySelectorAll('[data-tab]').forEach(el => {
  el.addEventListener('click', (e) => { e.preventDefault(); goToTab(el.dataset.tab); });
});
document.querySelectorAll('.tab-panel.active .reveal').forEach(el => revealObserver.observe(el));

document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('main-nav').classList.toggle('open');
});

/* --------------------------------------------------------------
   CARTA — CORREGIDA 02-10-2026. Antes llevaba productos y precios
   INVENTADOS (espresso $2.500, brownie $3.200…): se borraron todos.
   Queda sólo lo comprobable:
   - Las 4 categorías: son los destacados de su propio Instagram.
   - Cheesecake de frutos del bosque y matcha: salen en una foto real
     del local (fotos/bebidas-cheesecake).
   - Sin precios: el local no publica carta en ningún canal. Todo va
     en «Consultar» hasta que nos pasen la suya.
-------------------------------------------------------------- */
const MENU = [
  { cat: 'Coffee Time', items: [
    { n: 'Cafés', d: 'Pregúntanos qué preparaciones tenemos hoy.', p: null },
  ]},
  { cat: 'Tea Vibes', items: [
    { n: 'Matcha', d: 'Pregúntanos cómo lo preparamos hoy.', p: null },
    { n: 'Tés e infusiones', d: 'Pregúntanos por las variedades disponibles.', p: null },
  ]},
  { cat: 'Delicias', items: [
    { n: 'Cheesecake de frutos del bosque', d: 'Cheesecake cubierto con frutos del bosque.', p: null },
    { n: 'Dulces de la vitrina', d: 'Lo que haya hoy en vitrina: pregúntanos.', p: null },
  ]},
  { cat: 'Ice Cream', items: [
    { n: 'Helados', d: 'Pregúntanos por los sabores del día.', p: null },
  ]},
];

const money = n => n ? '$' + n.toLocaleString('es-CL') : 'Consultar';

const tabsEl = document.getElementById('menuTabs');
const panelsEl = document.getElementById('menuPanels');

MENU.forEach((group, i) => {
  const tab = document.createElement('button');
  tab.className = 'menu-tab' + (i === 0 ? ' active' : '');
  tab.textContent = group.cat;
  tab.dataset.key = group.cat;
  tab.addEventListener('click', () => showMenuTab(group.cat));
  tabsEl.appendChild(tab);

  const panel = document.createElement('div');
  panel.className = 'menu-panel' + (i === 0 ? ' active' : '');
  panel.id = 'panel-' + i;
  panel.dataset.key = group.cat;
  const grid = document.createElement('div');
  grid.className = 'menu-grid';
  const catBlock = document.createElement('div');
  catBlock.className = 'menu-cat';
  const h = document.createElement('h3');
  h.textContent = group.cat;
  catBlock.appendChild(h);
  group.items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'menu-item';
    const tagHtml = item.tag ? `<span class="tag">${item.tag}</span>` : '';
    row.innerHTML = `<span class="name">${item.n}${tagHtml}</span><span class="price">${money(item.p)}</span>`;
    row.addEventListener('click', () => openModal(group.cat, item));
    catBlock.appendChild(row);
  });
  grid.appendChild(catBlock);
  panel.appendChild(grid);
  panelsEl.appendChild(panel);
});

function showMenuTab(key) {
  document.querySelectorAll('.menu-tab').forEach(t => t.classList.toggle('active', t.dataset.key === key));
  document.querySelectorAll('.menu-panel').forEach(p => p.classList.toggle('active', p.dataset.key === key));
}

/* --------------------------------------------------------------
   MODAL PRODUCTO
-------------------------------------------------------------- */
const modalOverlay = document.getElementById('modalOverlay');
const modalBox = document.getElementById('modalBox');
let currentItem = null;
function openModal(cat, item) {
  currentItem = { ...item, cat };
  document.getElementById('modalCategory').textContent = cat;
  document.getElementById('modalName').textContent = item.n;
  document.getElementById('modalDesc').textContent = item.d;
  document.getElementById('modalPrice').textContent = money(item.p);
  toggleModal(true);
}
function toggleModal(open) { modalOverlay.classList.toggle('open', open); modalBox.classList.toggle('open', open); }
document.getElementById('modalCloseBtn').addEventListener('click', () => toggleModal(false));
modalOverlay.addEventListener('click', () => toggleModal(false));
document.getElementById('modalAddBtn').addEventListener('click', () => {
  if (currentItem) { addToCart(currentItem); toggleModal(false); toggleCart(true); }
});

/* --------------------------------------------------------------
   CARRITO — número de WhatsApp confirmado directamente por el
   cliente: +56 9 9882 3403.
-------------------------------------------------------------- */
let cart = [];
let deliveryMode = 'Retiro en local';
const WHATSAPP_NUMBER = '56998823403';

document.querySelectorAll('.delivery-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.delivery-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    deliveryMode = btn.dataset.mode;
    renderCart();
  });
});

function addToCart(item) { cart.push({ ...item }); renderCart(); }
function removeFromCart(idx) { cart.splice(idx, 1); renderCart(); }

function renderCart() {
  const linesEl = document.getElementById('cartLines');
  document.getElementById('cartCount').textContent = cart.length;
  if (cart.length === 0) {
    linesEl.innerHTML = '<p class="cart-empty">Aún no agregas productos. Explora la carta y súmalos aquí.</p>';
  } else {
    linesEl.innerHTML = cart.map((c, i) => `
      <div class="cart-line">
        <div><div class="name">${c.n}</div><div class="price">${money(c.p)}</div></div>
        <button class="cart-remove" onclick="removeFromCart(${i})">✕</button>
      </div>`).join('');
  }
  // Sin precios publicados: el total sólo se muestra si todo tiene precio.
  const total = cart.every(c => c.p) ? cart.reduce((a, c) => a + c.p, 0) : null;
  document.getElementById('cartTotal').textContent = cart.length ? (total ? money(total) : 'A consultar') : '$0';
  updateCheckoutLink(total);
}
function updateCheckoutLink(total) {
  let msg = '¡Hola, Café con Amor! Quisiera hacer el siguiente pedido:\n';
  if (cart.length === 0) {
    msg += '(Aún sin productos seleccionados)\n';
  } else {
    cart.forEach(c => { msg += `• ${c.n} (${money(c.p)})\n`; });
  }
  msg += `\nMétodo: ${deliveryMode}` + (total ? `\nTotal estimado: ${money(total)}` : '\n¿Me cuentan los precios?');
  document.getElementById('checkoutBtn').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
function toggleCart(open) { document.getElementById('cartOverlay').classList.toggle('open', open); document.getElementById('cartPanel').classList.toggle('open', open); }
document.getElementById('cartFab').addEventListener('click', () => toggleCart(true));
document.getElementById('cartBtn').addEventListener('click', () => toggleCart(true));
document.getElementById('cartCloseBtn').addEventListener('click', () => toggleCart(false));
document.getElementById('cartOverlay').addEventListener('click', () => toggleCart(false));
renderCart();

/* --------------------------------------------------------------
   ESTADO ABIERTO / CERRADO — horario real confirmado en Google
   Maps el 05-09-2026: Martes a domingo 16:00–21:00, Lunes cerrado.
-------------------------------------------------------------- */
const HOURS = [
  { day: 'Lunes', open: null, close: null },
  { day: 'Martes', open: 16, close: 21 },
  { day: 'Miércoles', open: 16, close: 21 },
  { day: 'Jueves', open: 16, close: 21 },
  { day: 'Viernes', open: 16, close: 21 },
  { day: 'Sábado', open: 16, close: 21 },
  { day: 'Domingo', open: 16, close: 21 },
];

function getSantiagoNow() {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Santiago', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
    }).formatToParts(new Date());
    const map = {}; parts.forEach(p => map[p.type] = p.value);
    const weekdayMap = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
    return { dayIndex: weekdayMap[map.weekday], hour: parseInt(map.hour) + parseInt(map.minute) / 60 };
  } catch (e) {
    const now = new Date();
    return { dayIndex: now.getDay() === 0 ? 6 : now.getDay() - 1, hour: now.getHours() + now.getMinutes() / 60 };
  }
}

const { dayIndex, hour } = getSantiagoNow();
const hoursTable = document.getElementById('hoursTable');
hoursTable.innerHTML = HOURS.map((h, i) => `
  <tr class="${i === dayIndex ? 'today' : ''}">
    <td style="padding-right:24px;">${h.day}</td>
    <td>${h.open === null ? 'Cerrado' : h.open + ':00 – ' + h.close + ':00'}</td>
  </tr>`).join('');

const today = HOURS[dayIndex];
const isOpen = today.open !== null && hour >= today.open && hour < today.close;
document.getElementById('statusDot').classList.toggle('closed', !isOpen);
document.getElementById('statusText').textContent = isOpen ? 'Abierto ahora' : 'Cerrado ahora';
