// assets/js/public.js
(function () {
  // Pastikan Firebase compat + Realtime DB tersedia
  if (typeof firebase === "undefined" || !firebase.apps?.length || !firebase.database) {
    console.warn("[PUBLIC] Firebase belum siap, fitur pesan publik dimatikan.");
    return;
  }

  const db = firebase.database();

  // Path RTDB
  const PATH_PUBLIC   = (window.FBDB && window.FBDB.publicPath)   || "mpk_public_messages";
  const PATH_COMMENTS = (window.FBDB && window.FBDB.commentsPath) || "mpk_public_comments";

  // Elemen utama
  const listEl   = document.getElementById("publicMessagesList");
  const formEl   = document.getElementById("publicForm");
  const statusEl = document.getElementById("publicStatus");

  // Popup detail
  const popupBackdrop      = document.getElementById("publicMsgPopup");
  const popupClose         = document.getElementById("publicMsgClose");
  const popupNameEl        = document.getElementById("popupMsgName");
  const popupTextEl        = document.getElementById("popupMsgText");
  const popupComments      = document.getElementById("popupComments");
  const popupCommentForm   = document.getElementById("popupCommentForm");
  const popupCommentStatus = document.getElementById("popupCommentStatus");

  let activeMsgKey = null;
  let commentsListenerRef = null;

  // ===== Helpers =====
  function setStatus(msg, type) {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.className = "status" + (type ? " " + type : "");
  }

  const escapeHTML = (s) =>
    (s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  function formatTime(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d)) return "";
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // ===== Render list pesan publik (kiri=nama, kanan=pesan) =====
  function renderMessages(items) {
    if (!listEl) return;

    if (!items.length) {
      listEl.innerHTML = '<p class="public-empty">Belum ada pesan publik.</p>';
      return;
    }

    listEl.innerHTML = items
      .map((item) => {
        const namaRaw = (item.nama || "Anonim").trim() || "Anonim";
        const inisial = namaRaw.charAt(0).toUpperCase();
        const text    = escapeHTML(item.pesan || "");
        const time    = formatTime(item.waktu);

        return `
          <div class="public-bubble" data-key="${item._key}">
            <div class="public-bubble-left">
              <div class="public-avatar">${inisial}</div>
              <div class="public-name">${escapeHTML(namaRaw)}</div>
            </div>
            <div class="public-bubble-right">
              <div class="public-text">${text}</div>
              <div class="public-meta">${time}</div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  // ===== Realtime listener =====
  if (listEl) {
    db.ref(PATH_PUBLIC)
      .limitToLast(40)
      .on(
        "value",
        (snap) => {
          const arr = [];
          snap.forEach((child) => {
            const v = child.val() || {};
            v._key = child.key;
            arr.push(v);
          });
          // urut lama -> baru
          arr.sort((a, b) => (a.waktu || "").localeCompare(b.waktu || ""));
          renderMessages(arr);
        },
        (err) => console.error("[PUBLIC] Gagal baca pesan publik:", err)
      );

    // klik bubble -> buka popup detail
    listEl.addEventListener("click", (e) => {
      const bubble = e.target.closest(".public-bubble");
      if (!bubble) return;
      const key = bubble.getAttribute("data-key");
      if (key) openPopupFor(key);
    });
  }

  // ===== Kirim pesan publik =====
  if (formEl) {
    formEl.addEventListener("submit", (e) => {
      e.preventDefault();

      const nama  = (formEl.elements["nama"].value || "").trim() || "Anonim";
      const pesan = (formEl.elements["pesan"].value || "").trim();

      if (!pesan) {
        setStatus("Tulis pesannya dulu 🙂", "error");
        return;
      }

      setStatus("Mengirim...", "loading");

      db.ref(PATH_PUBLIC)
        .push({ nama, pesan, waktu: new Date().toISOString() })
        .then(() => {
          formEl.reset();
          setStatus("Pesan publik terkirim. 👍", "success");
          setTimeout(() => setStatus("", ""), 1500);
        })
        .catch((err) => {
          console.error("[PUBLIC] Gagal kirim:", err);
          setStatus("Gagal mengirim, coba lagi.", "error");
        });
    });
  }

  // ===== Popup detail & komentar =====
  function openPopupFor(key) {
    activeMsgKey = key;

    // matikan listener komentar lama
    if (commentsListenerRef) {
      commentsListenerRef.off();
      commentsListenerRef = null;
    }

    db.ref(PATH_PUBLIC)
      .child(key)
      .once("value")
      .then((snap) => {
        const v = snap.val() || {};
        if (popupNameEl) popupNameEl.textContent = v.nama || "Anonim";
        if (popupTextEl) popupTextEl.textContent = v.pesan || "";

        if (popupComments)
          popupComments.innerHTML = '<p class="public-empty">Memuat komentar...</p>';

        // listen komentar
        const ref = db.ref(PATH_COMMENTS).child(key);
        commentsListenerRef = ref;
        ref.on("value", (ss) => {
          const list = [];
          ss.forEach((c) => list.push(c.val() || {}));

          if (!popupComments) return;

          if (!list.length) {
            popupComments.innerHTML = '<p class="public-empty">Belum ada komentar.</p>';
            return;
          }

          popupComments.innerHTML = list
            .map(
              (c) => `
              <div class="public-comment-item">
                <span class="public-comment-name">${escapeHTML(c.nama || "Anonim")}</span>
                <span class="public-comment-text">${escapeHTML(c.isi || "")}</span>
              </div>`
            )
            .join("");
        });

        if (popupBackdrop) {
          popupBackdrop.classList.add("active");
          document.body.style.overflow = "hidden";
        }
      })
      .catch((err) => console.error("[PUBLIC] Gagal ambil detail pesan:", err));
  }

  function closePopup() {
    if (popupBackdrop) {
      popupBackdrop.classList.remove("active");
      document.body.style.overflow = "";
    }
    activeMsgKey = null;

    if (commentsListenerRef) {
      commentsListenerRef.off();
      commentsListenerRef = null;
    }
  }

  if (popupBackdrop) {
    popupBackdrop.addEventListener("click", (e) => {
      if (e.target === popupBackdrop) closePopup();
    });
  }
  if (popupClose) popupClose.addEventListener("click", closePopup);

  // Kirim komentar
  if (popupCommentForm && popupComments) {
    popupCommentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!activeMsgKey) return;

      const nama = (popupCommentForm.elements["nama"].value || "").trim() || "Anonim";
      const isi  = (popupCommentForm.elements["komentar"].value || "").trim();
      if (!isi) return;

      db.ref(PATH_COMMENTS)
        .child(activeMsgKey)
        .push({ nama, isi, waktu: new Date().toISOString() })
        .then(() => {
          popupCommentForm.reset();
          if (popupCommentStatus) {
            popupCommentStatus.textContent = "Komentar terkirim.";
            setTimeout(() => (popupCommentStatus.textContent = ""), 1200);
          }
        })
        .catch((err) => {
          console.error("[PUBLIC] Gagal simpan komentar:", err);
          if (popupCommentStatus) {
            popupCommentStatus.textContent = "Gagal kirim komentar.";
            setTimeout(() => (popupCommentStatus.textContent = ""), 1200);
          }
        });
    });
  }
})();