// assets/js/form.js
(function () {
  const form    = document.getElementById("aspirasiForm");
  const btn     = document.getElementById("sendBtn");
  const status  = document.getElementById("status");
  const loaderEl = document.getElementById("aspirasiLoading");

  if (!form || !btn || !status) {
    console.warn("[ASPIRASI] Elemen form/status tidak ditemukan di halaman.");
    return;
  }

  const cfg = window.MPK_CONFIG || {};
  let emailjsReady = false;

  // ===== Helper Status =====
  function setStatus(msg, type) {
    status.textContent = msg || "";
    status.className = "status" + (type ? " " + type : "");
  }

  function toggleLoader(show) {
    if (!loaderEl) return;
    if (show) {
      loaderEl.classList.add("active");
      document.body.style.overflow = "hidden";
    } else {
      loaderEl.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  function setLoading(on) {
    const txt  = btn.querySelector(".btn-text") || btn;
    const icon = btn.querySelector(".btn-icon");

    btn.disabled = on;

    if (on) {
      if (icon) icon.textContent = "⏳";
      txt.textContent = "Mengirim...";
      toggleLoader(true);
    } else {
      if (icon) icon.textContent = "📨";
      txt.textContent = "Kirim Aspirasi ke MPK";
      toggleLoader(false);
    }
  }

  // ===== ID Generator (00001, 00002, ...) =====
  function getNextAspirasiID() {
    let current = parseInt(localStorage.getItem("mpk_last_id") || "0", 10);
    current++;
    localStorage.setItem("mpk_last_id", current.toString());
    return current.toString().padStart(5, "0");
  }

  // ===== Init EmailJS =====
  function initEmailJS() {
    if (emailjsReady) return true;
    if (typeof emailjs === "undefined") {
      console.error("[ASPIRASI] emailjs CDN belum termuat.");
      return false;
    }
    if (!cfg.PUBLIC_KEY || !cfg.SERVICE_ID || !cfg.TEMPLATE_ID) {
      console.error("[ASPIRASI] MPK_CONFIG tidak lengkap:", cfg);
      return false;
    }

    try {
      emailjs.init({ publicKey: cfg.PUBLIC_KEY });
      emailjsReady = true;
      console.log("[ASPIRASI] EmailJS ready.");
      return true;
    } catch (err) {
      console.error("[ASPIRASI] Gagal init EmailJS:", err);
      return false;
    }
  }

  // ===== Submit Handler =====
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nama   = (form.elements["name"]   ?.value || "").trim();
    const kelas  = (form.elements["kelas"]  ?.value || "").trim();
    const email  = (form.elements["email"]  ?.value || "").trim();
    const pesan  = (form.elements["message"]?.value || "").trim();

    if (!pesan) {
      setStatus("Tulis aspirasinya dulu ya 🙂", "error");
      return;
    }

    const aspirasiID = getNextAspirasiID();

    const payload = {
      id: aspirasiID,
      aspirasi_id: aspirasiID,
      nama, name: nama, from_name: nama, user_name: nama,
      kelas,
      email, from_email: email, reply_to: email,
      pesan, message: pesan, aspirasi: pesan,
      waktu: new Date().toISOString(),
      to_email: cfg.MPK_EMAIL || "orgkagakenal@gmail.com"
    };

    if (!initEmailJS()) {
      console.log("[ASPIRASI] Payload (tidak terkirim):", payload);
      setStatus("Konfigurasi pengiriman belum benar. Cek console dev.", "error");
      return;
    }

    setLoading(true);
    setStatus("Mengirim aspirasi...", "loading");

    try {
      await emailjs.send(cfg.SERVICE_ID, cfg.TEMPLATE_ID, payload);

      // optional auto-reply
      if (cfg.AUTO_REPLY_ID && email) {
        emailjs
          .send(cfg.SERVICE_ID, cfg.AUTO_REPLY_ID, {
            to_email: email,
            nama: nama || "Sahabat MPK",
            id: aspirasiID,
            pesan,
            message: pesan
          })
          .catch(err => console.warn("[ASPIRASI] Auto-reply gagal:", err));
      }

      form.reset();
      setStatus(`Aspirasi #${aspirasiID} terkirim. Terima kasih! 💛`, "success");
      console.log("[ASPIRASI] Terkirim ke EmailJS:", payload);
    } catch (err) {
      console.error("[ASPIRASI] Gagal kirim via EmailJS:", err);
      setStatus("Gagal mengirim. Coba lagi sebentar lagi.", "error");
    } finally {
      setLoading(false);
      setTimeout(() => setStatus("", ""), 3000);
    }
  });
})();