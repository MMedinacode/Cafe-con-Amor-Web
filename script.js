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
   CARTA — las 4 categorías son reales (destacados de su propio
   Instagram @cafeconamor.chile), pero el negocio no tiene una
   carta con precios publicada. Productos y precios de referencia,
   marcados abiertamente como placeholder — confirmar con el local.
-------------------------------------------------------------- */
const MENU = [
  { cat: 'Coffee Time', items: [
    { n: 'Espresso', d: 'Café de especialidad en su versión más pura e intensa.', p: 2500 },
    { n: 'Latte', d: 'Café con leche texturizada, suave y equilibrado.', p: 3500 },
    { n: 'Capuccino', d: 'Café con leche texturizada y una capa de espuma cremosa.', p: 3500 },
    { n: 'Mocaccino', d: 'Café, chocolate y leche texturizada en un solo vaso.', p: 3900 },
    { n: 'Café en Grano (250g)', d: 'Café de especialidad en grano, ideal para preparar en casa.', p: 6500, tag: 'Destacado' },
  ]},
  { cat: 'Tea Vibes', items: [
    { n: 'Matcha Latte Helado', d: 'Té matcha con leche texturizada servido bien frío.', p: 4200 },
    { n: 'Chai Latte', d: 'Té chai especiado con leche texturizada.', p: 3900 },
    { n: 'Té Verde', d: 'Infusión de té verde en hebras.', p: 2800 },
    { n: 'Infusión Frutal', d: 'Mezcla de frutos rojos e hibisco, ideal para tomar frío o caliente.', p: 2800 },
  ]},
  { cat: 'Delicias', items: [
    { n: 'Cheesecake Frutos del Bosque', d: 'Cheesecake cremoso cubierto con compota de frutos del bosque frescos.', p: 4500 },
    { n: 'Galleta Café con Amor', d: 'Galleta artesanal de la casa, hecha a mano y empaquetada individualmente.', p: 1800 },
    { n: 'Kuchen de la Casa', d: 'Receta casera de la casa, ideal para acompañar tu café.', p: 3800 },
    { n: 'Brownie', d: 'Brownie de chocolate húmedo y achocolatado.', p: 3200 },
  ]},
  { cat: 'Ice Cream', items: [
    { n: 'Helado Vainilla', d: 'Bocha de helado artesanal sabor vainilla.', p: 1800 },
    { n: 'Helado Chocolate', d: 'Bocha de helado artesanal de chocolate.', p: 1800 },
    { n: 'Helado Frutilla', d: 'Bocha de helado artesanal sabor frutilla.', p: 1800 },
    { n: 'Helado Sin Azúcar', d: 'Alternativa sin azúcar disponible en la vitrina.', p: 1800, tag: 'Sin azúcar' },
  ]},
];

const money = n => '$' + n.toLocaleString('es-CL');

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
  const total = cart.reduce((a, c) => a + c.p, 0);
  document.getElementById('cartTotal').textContent = money(total);
  updateCheckoutLink(total);
}
function updateCheckoutLink(total) {
  let msg = 'Hola Café con Amor! Quisiera hacer el siguiente pedido:%0A';
  if (cart.length === 0) {
    msg += '(Aún sin productos seleccionados)%0A';
  } else {
    cart.forEach(c => { msg += `• ${c.n} (${money(c.p)})%0A`; });
  }
  msg += `%0AMétodo: ${deliveryMode}%0ATotal estimado: ${money(total)}`;
  document.getElementById('checkoutBtn').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
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
