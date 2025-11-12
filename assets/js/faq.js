// MPK ZONE – FAQ (stable click-to-toggle, smooth height, show-more)
// File: assets/js/faq.js
(function () {
  const list = document.getElementById("faqList");
  const toggleAllBtn = document.getElementById("faqToggleAll");
  if (!list) return;

  const items = Array.from(list.querySelectorAll(".faq-item"));
  const INITIAL = 4; // tampil 4 dulu, sisanya disembunyikan sampai "Lihat semua FAQ" ditekan

  // ========== Helpers ==========
  function getParts(item) {
    return {
      box: item.querySelector(".faq-answer"),      // kontainer jawaban (yang di-animate)
      cb: item.querySelector(".faq-toggle"),       // checkbox opsional (kalau ada)
      question: item.querySelector(".faq-question")// baris pertanyaan (area klik)
    };
  }

  function measureHeight(el) {
    if (!el) return 0;
    // paksa hitung ulang tinggi nyata (mengantisipasi wrapping teks responsif)
    const prev = el.style.maxHeight;
    el.style.maxHeight = "none";
    const h = el.scrollHeight;
    el.style.maxHeight = prev || "";
    return h || 0;
  }

  // Terapkan state open/close + animasi tinggi halus
  function applyState(item, open) {
    const { box, cb, question } = getParts(item);
    if (!box) return;

    if (cb) cb.checked = !!open;
    item.classList.toggle("open", !!open);

    const h = measureHeight(box);
    box.style.maxHeight = open ? h + "px" : "0px";

    if (question) question.setAttribute("aria-expanded", open ? "true" : "false");
  }

  // Set ulang tinggi ketika layout berubah (misal viewport resize)
  function setHeightFor(item) {
    const { box, cb } = getParts(item);
    if (!box) return;
    const h = measureHeight(box);
    if (cb && cb.checked) {
      box.style.maxHeight = h + "px";
    } else if (item.classList.contains("open")) {
      box.style.maxHeight = h + "px";
    }
  }

  function anyHidden() {
    return items.slice(INITIAL).some((it) => it.classList.contains("is-hidden"));
  }

  function setBtnLabel() {
    if (!toggleAllBtn) return;
    toggleAllBtn.textContent = anyHidden() ? "Lihat semua FAQ →" : "Tutup semua FAQ ↑";
  }

  // ========== Init ==========
  items.forEach((it, i) => {
    // hanya 4 item pertama yang langsung kelihatan
    it.classList.toggle("is-hidden", i >= INITIAL);
    // semua mulai tertutup
    applyState(it, false);
  });
  setBtnLabel();

  // ========== Click pada baris pertanyaan ==========
  // bekerja baik untuk HTML tanpa <label for> (pure div.faq-question)
  list.addEventListener("click", (e) => {
    const q = e.target.closest(".faq-question");
    if (!q || !list.contains(q)) return;

    const item = q.closest(".faq-item");
    if (!item || item.classList.contains("is-hidden")) return;

    const { cb } = getParts(item);

    // jika ada checkbox, toggle; kalau tidak ada, pakai class "open"
    const willOpen = cb ? !cb.checked : !item.classList.contains("open");
    applyState(item, willOpen);
  });

  // ========== Change pada checkbox (kalau HTML pakai <label for="...">) ==========
  list.addEventListener("change", (e) => {
    const cb = e.target.closest(".faq-toggle");
    if (!cb) return;
    const item = cb.closest(".faq-item");
    applyState(item, cb.checked);
  });

  // ========== Tombol "Lihat semua FAQ" ==========
  if (toggleAllBtn) {
    toggleAllBtn.addEventListener("click", () => {
      const show = anyHidden(); // kalau masih ada hidden → tampilkan, kalau tidak → sembunyikan lagi

      items.slice(INITIAL).forEach((it) => {
        it.classList.toggle("is-hidden", !show);
        // saat baru ditampilkan, tetap mulai dalam keadaan tertutup
        applyState(it, false);
      });

      setBtnLabel();

      if (show && items[INITIAL]) {
        // sedikit scroll agar user sadar item tambahan muncul
        items[INITIAL].scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

  // ========== Responsive: recalculation saat resize ==========
  let rAF = null;
  window.addEventListener("resize", () => {
    if (rAF) cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(() => {
      items.forEach((it) => {
        if (it.classList.contains("is-hidden")) return;
        setHeightFor(it);
      });
    });
  });

  // Opsional: tambahkan kelas untuk memicu animasi "reveal" ketika masuk viewport
  try {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            list.classList.add("revealed");
            io.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    io.observe(list);
  } catch {
    list.classList.add("revealed");
  }
})();