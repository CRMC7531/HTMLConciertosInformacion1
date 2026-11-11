const $ = s => document.querySelector(s), $$ = s => document.querySelectorAll(s);
const money = n => '$' + Math.round(n).toLocaleString('es-CO');
const px = (b, k) => Math.round(b * k / 1000) * 1000;
const add = (iso, n) => { const [y, m, d] = iso.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10); };
const fmt = iso => new Date(iso + 'T00:00:00Z').toLocaleDateString('es-CO', { day: 'numeric', month: 'long', timeZone: 'UTC' });


const B = [['General', 180000], ['Preferencial', 320000], ['VIP', 550000]];

const E = {
  regueton: { n:'Maluma Fest - Reggaeton', f:'12 de marzo de 2027', d:'2027-03-12', l:'Estadio Olímpico Jaime Morón León, Cartagena', c:'Cartagena', ap:'CTG', kh:'Cartagena,Bolivar,Colombia', k:1.1,
    v:[['Preventa','1 dic 2026 · 10:00 a. m.'],['Venta general','15 dic 2026 · 10:00 a. m.']],
    s:[['3:00 p. m.','Apertura de puertas'],['4:30 p. m.','Dawer x Damper, Verito Asprilla, Junior Zamora'],['7:30 p. m.','Maluma'],['10:30 p. m.','Final y Salida']] },
  electronica: { n:'Noche de EDM - Trance', f:'3 de abril de 2027', d:'2027-04-03', l:'Estadio Atanasio Girardot, Medellín', c:'Medellín', ap:'MDE', kh:'Medellin,Antioquia,Colombia-c30430', k:.9,
    v:[['Preventa','10 ene 2027 · 9:00 a. m.'],['Venta general','24 ene 2027 · 9:00 a. m.']],
    s:[['5:00 p. m.','Apertura de puertas'],['6:30 p. m.','DJ Carlos Durango Pelaez Santos de la Cruz'],['8:30 p. m.','Vicente Hernando Hernández de los Santos'],['11:00 p. m.','Cierre del Show']] },
  rock: { n:'Conciertos de Rock', f:'15 de mayo de 2027', d:'2027-05-15', l:'Teatro Municipal Enrique Buenaventura, Cali', c:'Cali', ap:'CLO', kh:'Cali,Valle-del-Cauca,Colombia', k:1,
    v:[['Preventa','1 feb 2027 · 10:00 a. m.'],['Venta general','15 feb 2027 · 10:00 a. m.']],
    s:[['1:00 p. m.','Apertura de puertas'],['2:30 p. m.','Bandas Nacionales de Colombia'],['6:00 p. m.','Moto Moto'],['8:30 p. m.','Los Kawasakis'],['11:30 p. m.','Cierre del Show']]}
};
let cur = 'regueton';

function links() {
  const e = E[cur], p = Math.min(8, Math.max(1, parseInt($('#v-p').value) || 1)), a = add(e.d, -1), b = add(e.d, 1);
  $('#l-v').href = `https://www.kayak.com.co/flights/BOG-${e.ap}/${a}/${b}/${p}adults`;
  $('#l-h').href = `https://www.kayak.com.co/hotels/${e.kh}/${a}/${b}/${p}adults`;
  $('#v-ft').textContent = `Bogotá (BOG) → ${e.c} (${e.ap}). Ida el ${fmt(a)} y regreso el ${fmt(b)}, para ${p} viajero${p === 1 ? '' : 's'}.`;
  $('#v-ht').textContent = `Hoteles y apartamentos en ${e.c}, del ${fmt(a)} al ${fmt(b)} (2 noches).`;
}

function show(id) {
  cur = id; const e = E[id], bi = $('#f-b').value || 1;
  $('#e-n').textContent = e.n;
  $('#e-l').textContent = e.f + ' · ' + e.l;
  $('#m-l').textContent = e.l;
  $('#e-v').innerHTML = e.v.map(([a, b]) => `<li><span>${a}</span><strong>${b}</strong></li>`).join('');
  $('#e-s').innerHTML = e.s.map(([h, t]) => `<li><time>${h}</time><span>${t}</span></li>`).join('');
  $('#f-b').innerHTML = B.map(([n, p], j) => `<option value="${j}">${n} – ${money(px(p, e.k))}</option>`).join('');
  $('#f-b').value = bi; $('#f-e').value = id;
  $$('.tb[data-e]').forEach(b => b.setAttribute('aria-pressed', b.dataset.e === id));
  $('#res').hidden = true; links();
}
$$('.tb[data-e]').forEach(b => b.addEventListener('click', () => show(b.dataset.e)));
$('#f-e').addEventListener('change', e => show(e.target.value));

[['#v-p', '#f-q'], ['#f-q', '#v-p']].forEach(([a, b]) => $(a).addEventListener('input', () => { $(b).value = $(a).value; links(); }));
show(cur);


const bg = $('#bg'), nav = $('#nav');
bg.addEventListener('click', () => bg.setAttribute('aria-expanded', nav.classList.toggle('open')));
$$('#nav a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); bg.setAttribute('aria-expanded', 'false'); }));

$$('.lg').forEach(b => b.addEventListener('click', () => {
  $$('.lg').forEach(x => x.setAttribute('aria-pressed', x === b));
  $$('#mp .z').forEach(g => g.style.opacity = (b.dataset.z === 'todo' || g.dataset.z === b.dataset.z) ? 1 : .15);
}));


const dlg = $('#dlg');
$$('.gal button').forEach(b => b.addEventListener('click', () => {
  $('#di').src = b.dataset.src; $('#di').alt = b.dataset.cap; $('#dc').textContent = b.dataset.cap; dlg.showModal();
}));
$('#dx').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });


$('#calc').addEventListener('submit', ev => {
  ev.preventDefault(); const r = $('#res'); r.hidden = false;
  if (!ev.target.checkValidity()) { r.textContent = 'Revisa los datos: completa los campos y confirma que eres mayor de 18 años.'; ev.target.reportValidity(); return; }
  const e = E[cur], q = +$('#f-q').value, n = +$('#f-n').value || 0, [bn, bp] = B[$('#f-b').value];
  const tk = px(bp, e.k) * q, fee = tk * .12, vu = (+$('#f-v').value || 0) * q, hab = Math.ceil(q / 2), al = (+$('#f-h').value || 0) * n * hab;
  r.innerHTML = `<strong>Total estimado: ${money(tk + fee + vu + al)}</strong><br>` +
    `Boletas (${q} × ${bn}): ${money(tk)} · Cargo por servicio (12 %): ${money(fee)}` +
    (vu ? ` · Vuelos: ${money(vu)}` : '') + (al ? ` · Alojamiento (${hab} hab. × ${n} noche${n === 1 ? '' : 's'}): ${money(al)}` : '') +
    `. Valores de ejemplo.`;
});


$('#al').addEventListener('submit', ev => {
  ev.preventDefault(); const m = $('#al-m'); m.hidden = false;
  if (!$('#al-e').checkValidity()) { m.textContent = 'Escribe un correo válido.'; return; }
  m.textContent = '¡Listo! Te avisaremos cuando abra la preventa.'; ev.target.reset();
});
