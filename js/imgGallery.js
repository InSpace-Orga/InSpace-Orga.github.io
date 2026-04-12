const IMAGES = [
  'imgGallery/IMG (1).jpg',
  'imgGallery/IMG (2).jpg',
  'imgGallery/IMG (3).jpg',
  'imgGallery/IMG (4).jpg',
  'imgGallery/IMG (5).jpg',
  'imgGallery/IMG (6).jpg',
  'imgGallery/IMG (7).jpg',
  'imgGallery/IMG (8).jpg',
  'imgGallery/IMG (9).jpg',
];
const SLOT_COUNT = 5;
const INTERVAL_MS = 6000;

const grid = document.getElementById('galleryGrid');
const dotsContainer = document.getElementById('galleryDots');

const slots = Array.from({ length: SLOT_COUNT }, (_, i) => {
  const div = document.createElement('div');
  div.className = 'gallery-item';

  const imgs = IMAGES.map((src) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = src;
    return img;
  });

  imgs.forEach((img) => div.appendChild(img));

  if (i === 0) {
    const counter = document.createElement('div');
    counter.className = 'gallery-counter';
    counter.id = 'galleryCounter';
    div.appendChild(counter);
  }

  grid.appendChild(div);
  return { div, imgs };
});

const dots = IMAGES.map((_, i) => {
  const btn = document.createElement('button');
  btn.className = 'gallery-dot' + (i === 0 ? ' active' : '');
  btn.addEventListener('click', () => goTo(i));
  dotsContainer.appendChild(btn);
  return btn;
});

let current = 0;

function goTo(index) {
  current = (index + IMAGES.length) % IMAGES.length;
  slots.forEach(({ imgs }, slotIdx) => {
    imgs.forEach((img, imgIdx) => {
      const target = (current + slotIdx) % IMAGES.length;
      img.classList.toggle('active', imgIdx === target);
    });
  });

  dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  const counter = document.getElementById('galleryCounter');
  if (counter) {
    counter.textContent = `${current + 1} / ${IMAGES.length}`;
  }
}

let timer = null;
const btnAuto = document.getElementById('btnAuto');

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

goTo(0);
startAuto();

if (window.initGalleryViewer) {
  window.initGalleryViewer({
    images: IMAGES,
    selector: '#galleryGrid img',
    title: 'InSpace Orga Galerie',
  });
}
