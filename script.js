
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

function closeMenu(){
  if(!nav || !menuToggle) return;
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú');
}

menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});

document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

/* Galería / lightbox */
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxTitle = document.getElementById('lightbox-title');
let lastFocused = null;

function openLightbox(item){
  if(!lightbox || !lightboxImage) return;
  lastFocused = document.activeElement;
  lightboxImage.src = item.dataset.full || item.querySelector('img')?.src || '';
  lightboxImage.alt = item.dataset.title || item.querySelector('img')?.alt || '';
  lightboxTitle.textContent = item.dataset.title || '';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.querySelector('.close-lightbox')?.focus();
}

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => openLightbox(item));
});

function closeLightbox(){
  if(!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  if(lightboxImage) lightboxImage.src = '';
  document.body.style.overflow = '';
  lastFocused?.focus?.();
}
document.querySelector('.close-lightbox')?.addEventListener('click', closeLightbox);

lightbox?.addEventListener('click', e => {
  if(e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if(e.key === 'Escape' && lightbox?.classList.contains('open')) closeLightbox();
});

/* Año del pie */
const year = document.getElementById('year');
if(year) year.textContent = new Date().getFullYear();

/* Navegación por páginas: cada apartado muestra únicamente su contenido. */
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
const pageSections = [...document.querySelectorAll('main section[data-page]')];

function viewFromHash(){
  const id = (window.location.hash || '#inicio').slice(1);
  const section = document.getElementById(id);
  return section?.dataset.page || 'inicio';
}

function setActiveLink(view){
  navLinks.forEach(link => {
    const target = link.getAttribute('href').slice(1);
    const section = document.getElementById(target);
    const linkView = section?.dataset.page || target;
    const active = linkView === view;
    link.classList.toggle('active', active);
    if(active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

function showView(){
  const view = viewFromHash();
  document.body.dataset.view = view;
  setActiveLink(view);
  window.scrollTo({top: 0, behavior: 'auto'});
  updateProgress();
}

window.addEventListener('hashchange', showView);
showView();

/* Barra de progreso de lectura */
const progress = document.createElement('div');
progress.className = 'reading-progress';
document.body.prepend(progress);

function updateProgress(){
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
}
window.addEventListener('scroll', updateProgress, {passive:true});
window.addEventListener('resize', updateProgress);
updateProgress();
