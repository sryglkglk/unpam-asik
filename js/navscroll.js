window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash;
  if (!hash) return;

  const tryScroll = () => {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  requestAnimationFrame(() => requestAnimationFrame(tryScroll));
});