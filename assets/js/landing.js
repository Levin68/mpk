// assets/js/landing.js
// Fokus: HERO typing + section fade + navbar scroll state

// ========== HERO TYPING ==========
(() => {
  const typingEl = document.getElementById("typing");
  if (!typingEl) return;

  const texts = ["MPK ZONE", "SMP Tunas Harapan", "Periode 25–26"];
  let i = 0, j = 0, deleting = false;

  function type() {
    const current = texts[i];

    if (!deleting) {
      typingEl.textContent = current.slice(0, j + 1);
      j++;
      if (j === current.length) {
        setTimeout(() => { deleting = true; }, 900);
      }
    } else {
      typingEl.textContent = current.slice(0, j - 1);
      j--;
      if (j === 0) {
        deleting = false;
        i = (i + 1) % texts.length;
      }
    }

    const delay = deleting ? 55 : 80;
    setTimeout(type, delay);
  }

  type();
})();

// ========== SECTION FADE-IN ==========
(() => {
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  document.querySelectorAll(".section-fade").forEach(el => observer.observe(el));
})();

// ========== NAVBAR SCROLL STATE (optional, buat efek glass lebih hidup) ==========
(() => {
  const nav = document.querySelector(".top-nav");
  if (!nav) return;

  function onScroll() {
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }

  onScroll();
  window.addEventListener("scroll", onScroll);
})();