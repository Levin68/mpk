// MPK ZONE – FAQ MINI (final, stable, smooth)
// File: assets/js/faq-mini.js
(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  ready(function () {
    const list = document.getElementById("faqList");
    const toggleAllBtn = document.getElementById("faqToggleAll");
    if (!list) return;

    // Ambil semua item (support <details.faq-item> maupun <div.faq-item>)
    const items = Array.from(list.querySelectorAll(".faq-item"));
    if (!items.length) return;

    const INITIAL = 4; // tampil 4 item dulu
    const USE_DETAILS = items[0].tagName.toLowerCase() === "details";

    // ---------- Utils ----------
    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    function qSelect(item) {
      // Untuk <details>, pertanyaan = <summary>, jawaban = .answer-wrap (opsional) / .answer
      if (USE_DETAILS) {
        const summary = item.querySelector("summary");
        let wrap =
          item.querySelector(".answer-wrap") ||
          item.querySelector(".answer") ||
          // fallback: buat pembungkus agar bisa animasi
          (function () {
            const contentNodes = Array.from(item.childNodes).filter(
              (n) => n.nodeType === 1 && n.tagName.toLowerCase() !== "summary"
            );
            const w = document.createElement("div");
            w.className = "answer-wrap";
            // pindahkan nodes ke wrap
            contentNodes.forEach((n) => w.appendChild(n));
            item.appendChild(w);
            return w;
          })();

        return { question: summary, wrap: wrap };
      }

      // Untuk struktur <div>: pertanyaan & jawaban jelas
      return {
        question: item.querySelector(".faq-question"),
        wrap:
          item.querySelector(".faq-answer") ||
          item.querySelector(".answer-wrap") ||
          item.querySelector(".answer"),
      };
    }

    function measureHeight(el) {
      if (!el) return 0;
      const prevMax = el.style.maxHeight;
      const prevPos = el.style.position;
      const prevVis = el.style.visibility;
      const prevDisp = el.style.display;

      // pastikan dapat tinggi aktual
      el.style.position = "absolute";
      el.style.visibility = "hidden";
      el.style.display = "block";
      el.style.maxHeight = "none";
      const h = el.scrollHeight;

      // restore
      el.style.maxHeight = prevMax || "";
      el.style.position = prevPos || "";
      el.style.visibility = prevVis || "";
      el.style.display = prevDisp || "";

      return clamp(h, 0, 99999);
    }

    function isOpen(item) {
      if (USE_DETAILS) return item.open;
      return item.classList.contains("open");
    }

    function setOpen(item, open) {
      const { wrap, question } = qSelect(item);
      if (!wrap) return;

      if (USE_DETAILS) {
        // Sinkronisasi attribute open & animasi halus
        if (open) {
          // buka → ukur lalu set
          wrap.style.maxHeight = "none";
          const h = measureHeight(wrap);
          wrap.style.maxHeight = h + "px";
          item.open = true;
        } else {
          // tutup → set 0, baru hapus open
          wrap.style.maxHeight = "0px";
          setTimeout(() => {
            item.open = false;
          }, 240);
        }
      } else {
        // Struktur <div>
        item.classList.toggle("open", !!open);
        const h = open ? measureHeight(wrap) : 0;
        wrap.style.maxHeight = h + "px";
      }

      if (question) {
        question.setAttribute("aria-expanded", open ? "true" : "false");
        question.style.pointerEvents = "auto";   // guard kalau ada CSS yang mematikannya
        question.style.zIndex = "3";
      }
    }

    function setHeightsForOpen() {
      items.forEach((it) => {
        if (!isHidden(it) && isOpen(it)) {
          const { wrap } = qSelect(it);
          if (wrap) {
            wrap.style.maxHeight = measureHeight(wrap) + "px";
          }
        }
      });
    }

    function isHidden(item) {
      return item.classList.contains("is-hidden");
    }

    function anyHiddenAfterInitial() {
      return items.slice(INITIAL).some((it) => it.classList.contains("is-hidden"));
    }

    function setToggleAllLabel() {
      if (!toggleAllBtn) return;
      toggleAllBtn.textContent = anyHiddenAfterInitial()
        ? "Lihat semua FAQ →"
        : "Tutup semua FAQ ↑";
    }

    // ---------- Init ----------
    items.forEach((it, i) => {
      // tampil 4 dulu
      if (i >= INITIAL) it.classList.add("is-hidden");

      // pastikan elemen klik bisa di-klik
      const { question, wrap } = qSelect(it);
      if (question) {
        question.setAttribute("role", "button");
        question.setAttribute("tabindex", "0");
        question.setAttribute("aria-expanded", "false");
        question.style.cursor = "pointer";
        // guard style jika ada CSS lain menutup klik
        question.style.pointerEvents = "auto";
        question.style.position = question.style.position || "relative";
        question.style.zIndex = "3";
      }
      if (wrap) {
        wrap.style.overflow = "hidden";
        wrap.style.maxHeight = "0px";
        wrap.style.transition = "max-height 280ms cubic-bezier(.22,1,.36,1)";
        wrap.style.willChange = "max-height";
      }

      // start tertutup
      setOpen(it, false);
    });
    setToggleAllLabel();

    // ---------- Event: toggle per item ----------
    // a) Struktur <details> → pakai event 'toggle' per item
    if (USE_DETAILS) {
      items.forEach((it) => {
        it.addEventListener("toggle", () => {
          const open = it.open;
          setOpen(it, open);
          setToggleAllLabel();
        });
      });
    }

    // b) Klik pada pertanyaan (support kedua struktur)
    list.addEventListener("click", (e) => {
      const q = e.target.closest(".faq-question, summary");
      if (!q || !list.contains(q)) return;

      const item = q.closest(".faq-item");
      if (!item || isHidden(item)) return;

      // cegah default <summary> agar animasi kita yang atur
      if (q.tagName.toLowerCase() === "summary") {
        e.preventDefault();
      }

      setOpen(item, !isOpen(item));
      setToggleAllLabel();
    });

    // c) Akses keyboard (Enter/Space)
    list.addEventListener("keydown", (e) => {
      const q = e.target.closest(".faq-question, summary");
      if (!q) return;
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      const item = q.closest(".faq-item");
      if (!item || isHidden(item)) return;
      setOpen(item, !isOpen(item));
      setToggleAllLabel();
    });

    // ---------- Tombol "Lihat semua FAQ" ----------
    if (toggleAllBtn) {
      toggleAllBtn.addEventListener("click", () => {
        const willShow = anyHiddenAfterInitial();

        items.slice(INITIAL).forEach((it) => {
          it.classList.toggle("is-hidden", !willShow);
          // tampil tapi tetap tertutup
          setOpen(it, false);
        });

        setToggleAllLabel();

        if (willShow && items[INITIAL]) {
          items[INITIAL].scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      });
    }

    // ---------- Smoothness guard saat resize ----------
    let rAF = null;
    window.addEventListener("resize", () => {
      if (rAF) cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(setHeightsForOpen);
    });

    // ---------- Reveal-in viewport (optional) ----------
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
  });
})();