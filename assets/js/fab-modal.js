// assets/js/fab-modal.js
(function () {
  const body = document.body;
  const fabToggle = document.getElementById('fab-toggle');

  function closeFabMenu() {
    if (fabToggle) fabToggle.checked = false;
  }

  function openModal(el) {
    if (!el) return;
    el.classList.add('active');
    body.style.overflow = 'hidden';
    closeFabMenu();
  }

  function closeModal(el) {
    if (!el) return;
    el.classList.remove('active');
    body.style.overflow = '';
  }

  // ===== ASPIRASI MODAL =====
  const aspModal = document.getElementById('aspirasiModal');
  const fabAsp = document.getElementById('fabAspirasiMain');
  const aspClose = document.getElementById('aspirasiClose');

  // FAB bulat
  if (fabAsp && aspModal) {
    fabAsp.addEventListener('click', () => openModal(aspModal));
  }

  // Tombol close & klik area gelap
  if (aspClose && aspModal) {
    aspClose.addEventListener('click', () => closeModal(aspModal));
  }
  if (aspModal) {
    aspModal.addEventListener('click', (e) => {
      if (e.target === aspModal) closeModal(aspModal);
    });
  }

  // Link "aspirasi.html" diarahkan ke modal (kalau modal ada)
  const aspLinks = document.querySelectorAll('a[href="aspirasi.html"]');
  aspLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (!aspModal) return;        // kalau nggak ada modal, biar normal
      e.preventDefault();
      openModal(aspModal);
    });
  });

  // ===== PESAN PUBLIK MODAL =====
  const pubModal = document.getElementById('publicModal');
  const fabPublic = document.getElementById('fabPublic');
  const pubClose = document.getElementById('publicClose');

  if (fabPublic && pubModal) {
    fabPublic.addEventListener('click', () => openModal(pubModal));
  }

  if (pubClose && pubModal) {
    pubClose.addEventListener('click', () => closeModal(pubModal));
  }

  if (pubModal) {
    pubModal.addEventListener('click', (e) => {
      if (e.target === pubModal) closeModal(pubModal);
    });
  }

  // NOTE:
  // Submit Pesan Publik & Aspirasi ditangani di assets/js/form.js
  // Jangan handle submit di sini supaya nggak bentrok.
})();