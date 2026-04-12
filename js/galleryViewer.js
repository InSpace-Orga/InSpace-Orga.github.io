(() => {
  let state = null;

  function normalizeIndex(index, length) {
    return (index + length) % length;
  }

  function ensureViewer() {
    let viewer = document.getElementById('galleryViewer');
    if (viewer) {
      return viewer;
    }

    viewer = document.createElement('div');
    viewer.id = 'galleryViewer';
    viewer.className = 'gallery-viewer';
    viewer.innerHTML = `
      <div class="gallery-viewer-backdrop" data-viewer-close></div>
      <div class="gallery-viewer-panel" role="dialog" aria-modal="true" aria-label="Bildviewer">
        <div class="gallery-viewer-header">
          <div class="gallery-viewer-title" id="galleryViewerTitle">Bildansicht</div>
          <button class="gallery-viewer-close" type="button" aria-label="Viewer schließen" data-viewer-close>×</button>
        </div>
        <div class="gallery-viewer-stage">
          <button class="gallery-viewer-btn prev" type="button" aria-label="Vorheriges Bild" data-viewer-prev>‹</button>
          <img id="galleryViewerImage" alt="">
          <button class="gallery-viewer-btn next" type="button" aria-label="Nächstes Bild" data-viewer-next>›</button>
        </div>
        <div class="gallery-viewer-counter" id="galleryViewerCounter"></div>
        <div class="gallery-viewer-caption" id="galleryViewerCaption"></div>
      </div>
    `;

    document.body.appendChild(viewer);

    viewer.addEventListener('click', (event) => {
      if (event.target.matches('[data-viewer-close]')) {
        closeViewer();
      }
      if (event.target.matches('[data-viewer-prev]')) {
        stepViewer(-1);
      }
      if (event.target.matches('[data-viewer-next]')) {
        stepViewer(1);
      }
    });

    window.addEventListener('keydown', (event) => {
      if (!state || !viewer.classList.contains('open')) {
        return;
      }
      if (event.key === 'Escape') {
        closeViewer();
      } else if (event.key === 'ArrowLeft') {
        stepViewer(-1);
      } else if (event.key === 'ArrowRight') {
        stepViewer(1);
      }
    });

    return viewer;
  }

  function updateViewer() {
    if (!state) {
      return;
    }

    const viewer = ensureViewer();
    const item = state.items[state.index];
    const image = viewer.querySelector('#galleryViewerImage');
    const caption = viewer.querySelector('#galleryViewerCaption');
    const counter = viewer.querySelector('#galleryViewerCounter');
    const title = viewer.querySelector('#galleryViewerTitle');

    image.src = item.src;
    image.alt = item.alt;
    caption.textContent = item.caption || '';
    counter.textContent = `${state.index + 1} / ${state.items.length}`;
    title.textContent = state.title || 'Bildansicht';
  }

  function openViewer(index) {
    if (!state || !state.items.length) {
      return;
    }

    state.index = normalizeIndex(index, state.items.length);
    updateViewer();
    ensureViewer().classList.add('open');
    document.body.classList.add('viewer-open');
  }

  function closeViewer() {
    const viewer = document.getElementById('galleryViewer');
    if (viewer) {
      viewer.classList.remove('open');
    }
    document.body.classList.remove('viewer-open');
  }

  function stepViewer(delta) {
    if (!state) {
      return;
    }
    openViewer(state.index + delta);
  }

  window.initGalleryViewer = function initGalleryViewer(options) {
    const items = options.images.map((src, index) => ({
      src,
      alt: options.altTexts?.[index] || src,
      caption: options.captions?.[index] || '',
    }));

    state = {
      items,
      index: 0,
      title: options.title || 'Bildansicht',
    };

    const selector = options.selector;
    const elements = document.querySelectorAll(selector);

    elements.forEach((img) => {
      const matchedIndex = items.findIndex((item) => item.src === img.getAttribute('src') || item.src === img.src || item.src.endsWith(img.getAttribute('src')));
      if (matchedIndex === -1) {
        return;
      }

      img.setAttribute('role', 'button');
      img.setAttribute('tabindex', '0');
      img.setAttribute('aria-label', `Bild ${matchedIndex + 1} vergrößern`);

      const openAt = () => openViewer(matchedIndex);
      img.addEventListener('click', openAt);
      img.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openAt();
        }
      });
    });

    ensureViewer();
  };
})();
