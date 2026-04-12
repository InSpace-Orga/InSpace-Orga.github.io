const IMAGES = [
  'imgGallery/web/home/IMG (1).webp',
  'imgGallery/web/home/IMG (2).webp',
  'imgGallery/web/home/IMG (3).webp',
  'imgGallery/web/home/IMG (4).webp',
  'imgGallery/web/home/IMG (5).webp',
  'imgGallery/web/home/IMG (6).webp',
  'imgGallery/web/home/IMG (7).webp',
  'imgGallery/web/home/IMG (8).webp',
  'imgGallery/web/home/IMG (9).webp',
];

const SLOT_COUNT = 5;
const INTERVAL_MS = 6000;

const grid = document.getElementById('galleryGrid');
const dotsContainer = document.getElementById('galleryDots');

const slots = Array.from({ length: SLOT_COUNT }, (_, slotIndex) => {
  const figure = document.createElement('div');
  figure.className = 'gallery-item';
  figure.dataset.slotIndex = String(slotIndex);

  const img = document.createElement('img');
  img.alt = '';
  figure.appendChild(img);

  if (slotIndex === 0) {
    const counter = document.createElement('div');
    counter.className = 'gallery-counter';
    counter.id = 'galleryCounter';
    figure.appendChild(counter);
  }

  grid.appendChild(figure);
  return { figure, img };
});

const dots = IMAGES.map((_, i) => {
  const btn = document.createElement('button');
  btn.className = 'gallery-dot' + (i === 0 ? ' active' : '');
  btn.type = 'button';
  btn.addEventListener('click', () => goTo(i));
  dotsContainer.appendChild(btn);
  return btn;
});

let current = 0;
let timer = null;
const btnAuto = document.getElementById('btnAuto');

function preload(index) {
  const image = new Image();
  image.src = IMAGES[(index + IMAGES.length) % IMAGES.length];
}

function renderSlots() {
  slots.forEach(({ figure, img }, slotIdx) => {
    const imageIndex = (current + slotIdx) % IMAGES.length;
    const src = IMAGES[imageIndex];
    figure.dataset.galleryIndex = String(imageIndex);
    img.src = src;
    img.alt = `Bild ${imageIndex + 1}`;
    img.classList.add('active');
  });

  const counter = document.getElementById('galleryCounter');
  if (counter) {
    counter.textContent = `${current + 1} / ${IMAGES.length}`;
  }

  dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  preload(current + SLOT_COUNT);
}

function goTo(index) {
  current = (index + IMAGES.length) % IMAGES.length;
  renderSlots();
}

function startAuto() {
  timer = setInterval(() => goTo(current + 1), INTERVAL_MS);
  btnAuto.classList.add('active-toggle');
  btnAuto.textContent = '⏵ Auto';
}

function stopAuto() {
  clearInterval(timer);
  timer = null;
  btnAuto.classList.remove('active-toggle');
  btnAuto.textContent = '⏸ Pause';
}

document.getElementById('btnPrev').addEventListener('click', () => {
  stopAuto();
  goTo(current - 1);
});

document.getElementById('btnNext').addEventListener('click', () => {
  stopAuto();
  goTo(current + 1);
});

btnAuto.addEventListener('click', () => (timer ? stopAuto() : startAuto()));

renderSlots();
startAuto();

if (window.initGalleryViewer) {
  window.initGalleryViewer({
    images: IMAGES,
    selector: '#galleryGrid .gallery-item',
    title: 'InSpace Orga Galerie',
  });
}
