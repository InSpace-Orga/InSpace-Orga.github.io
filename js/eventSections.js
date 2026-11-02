(() => {
  const header = document.querySelector('.event-page > nav');
  if (!header) return;

  const updateHeaderHeight = () => {
    document.body.style.setProperty('--event-header-height', `${header.offsetHeight}px`);
  };
  updateHeaderHeight();
  if ('ResizeObserver' in window) {
    new ResizeObserver(updateHeaderHeight).observe(header);
  } else {
    window.addEventListener('resize', updateHeaderHeight);
  }

  const manuallyOpened = new Set();
  let automaticallyOpened = null;
  let anchoredSection = null;
  let keepAnchorVisible = false;
  let resizeFrame = null;

  // Preserve an aligned heading on rotation, but leave readers at their scroll position.
  window.addEventListener('scroll', () => {
    if (!anchoredSection || resizeFrame !== null) return;
    const top = anchoredSection.getBoundingClientRect().top;
    keepAnchorVisible = top >= header.offsetHeight - 4 && top <= header.offsetHeight + 48;
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (!anchoredSection || !keepAnchorVisible) return;
    if (resizeFrame !== null) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      updateHeaderHeight();
      anchoredSection.scrollIntoView({ block: 'start' });
      resizeFrame = null;
    });
  });

  document.querySelectorAll('.event-disclosure').forEach((disclosure) => {
    disclosure.querySelector('summary').addEventListener('click', (event) => {
      if (event.defaultPrevented) return;
      // Native summary clicks also cover Enter and Space activation.
      if (disclosure.open) {
        manuallyOpened.delete(disclosure);
      } else {
        manuallyOpened.add(disclosure);
      }
      if (automaticallyOpened === disclosure) automaticallyOpened = null;
    });
  });

  const revealSection = (hash, focus = false) => {
    let id;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      return;
    }
    const section = document.getElementById(id);
    if (!section?.matches('main > section[id]')) return;
    const disclosure = section.querySelector('.event-disclosure');

    if (automaticallyOpened && automaticallyOpened !== disclosure &&
        !manuallyOpened.has(automaticallyOpened)) {
      automaticallyOpened.open = false;
    }
    automaticallyOpened = null;

    if (disclosure) {
      disclosure.open = true;
      if (!manuallyOpened.has(disclosure)) automaticallyOpened = disclosure;
    }
    requestAnimationFrame(() => {
      anchoredSection = section;
      keepAnchorVisible = true;
      section.scrollIntoView({ block: 'start' });
      if (focus) {
        const heading = disclosure?.querySelector('summary') || section.querySelector('h2');
        if (heading) {
          if (!disclosure) heading.tabIndex = -1;
          heading.focus({ preventScroll: true });
        }
      }
    });
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
        link.hasAttribute('download') || (link.target && link.target !== '_self')) return;

    const url = new URL(link.href);
    if (url.origin === location.origin && url.pathname === location.pathname && url.hash) {
      // Open before the browser follows the anchor, including repeated clicks.
      revealSection(url.hash, true);
    }
  });

  window.addEventListener('hashchange', () => revealSection(location.hash));
  window.addEventListener('pageshow', () => revealSection(location.hash));
  revealSection(location.hash);
})();
