// assets/js/struktur.js
// Fokus: generate struktur MPK + popup biodata

(() => {
  // --- DATA ---

  const pembinaData = {
    role: "Pembina MPK",
    name: "Lorem Ipsum",
    photo: "img/ips.jpg",
    motto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    ig: ""
  };

  const membersData = [
    { role: "Ketua MPK",         name: "Lorem Ipsum", photo: "img/ips.jpg", motto: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", ig: "" },
    { role: "Wakil Ketua",       name: "Lorem Ipsum", photo: "img/ips.jpg", motto: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.", ig: "" },

    { role: "Sekretaris 1",      name: "Lorem Ipsum", photo: "img/ips.jpg", motto: "Duis aute irure dolor in reprehenderit in voluptate velit esse.", ig: "" },
    { role: "Sekretaris 2",      name: "Lorem Ipsum", photo: "img/ips.jpg", motto: "Cillum dolore eu fugiat nulla pariatur.", ig: "" },

    { role: "Bendahara 1",       name: "Lorem Ipsum", photo: "img/ips.jpg", motto: "Excepteur sint occaecat cupidatat non proident.", ig: "" },
    { role: "Bendahara 2",       name: "Lorem Ipsum", photo: "img/ips.jpg", motto: "Sunt in culpa qui officia deserunt mollit anim id est laborum.", ig: "" },

    { role: "Koord. Humas",      name: "Lorem Ipsum", photo: "img/ips.jpg", motto: "Praesent commodo cursus magna, vel scelerisque nisl consectetur.", ig: "" },
    { role: "Koord. Acara",      name: "Lorem Ipsum", photo: "img/ips.jpg", motto: "Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis.", ig: "" },
    { role: "Koord. Dok.",       name: "Lorem Ipsum", photo: "img/ips.jpg", motto: "Curabitur blandit tempus porttitor.", ig: "" },
    { role: "Koord. IT",         name: "Lorem Ipsum", photo: "img/ips.jpg", motto: "Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor.", ig: "" },
    { role: "Koord. Disiplin",   name: "Lorem Ipsum", photo: "img/ips.jpg", motto: "Integer posuere erat a ante venenatis dapibus.", ig: "" },
    { role: "Koord. Kebersihan", name: "Lorem Ipsum", photo: "img/ips.jpg", motto: "Donec ullamcorper nulla non metus auctor.", ig: "" },
    { role: "Koord. Konsumsi",   name: "Lorem Ipsum", photo: "img/ips.jpg", motto: "Etiam porta sem malesuada magna mollis.", ig: "" },
    { role: "Koord. Keamanan",   name: "Lorem Ipsum", photo: "img/ips.jpg", motto: "Morbi leo risus, porta ac consectetur ac.", ig: "" },
    { role: "Koord. Publikasi",  name: "Lorem Ipsum", photo: "img/ips.jpg", motto: "Nulla vitae elit libero, a pharetra augue.", ig: "" },

    { role: "Anggota",           name: "Lorem Ipsum", photo: "img/ips.jpg", motto: "Cras justo odio, dapibus ac facilisis in.", ig: "" }
  ];

  // --- TARGET ELEMEN ---

  const pembinaWrap = document.querySelector(".pembina-wrap");
  const memberGrid  = document.getElementById("memberGrid");
  if (!pembinaWrap || !memberGrid) return;

  // --- RENDER KARTU ---

  function createCardHTML(m, key) {
    const igLink = (m.ig && m.ig.trim() !== "") ? m.ig : "#";
    return `
      <div class="mpk-card section-fade" data-key="${key}">
        <div class="mpk-photo" style="background-image:url('${m.photo}')"></div>
        <div class="mpk-overlay"></div>
        <div class="mpk-info">
          <div class="mpk-role">${m.role}</div>
          <div class="mpk-name">${m.name}</div>
        </div>
        <a href="${igLink}" target="_blank"
           class="mpk-follow"
           onclick="event.stopPropagation()">
          Follow me
        </a>
      </div>
    `;
  }

  // Pembina 1 kartu di tengah
  pembinaWrap.innerHTML = createCardHTML(pembinaData, "pembina");

  // Anggota grid rapi
  memberGrid.innerHTML = membersData
    .map((m, idx) => createCardHTML(m, "m" + idx))
    .join("");

  // --- POPUP BIODATA ---

  const popup      = document.getElementById("popup");
  const popupPhoto = document.getElementById("popupPhoto");
  const popupMotto = document.getElementById("popupMotto");
  const popupClose = document.getElementById("popupClose");

  if (popup && popupPhoto && popupMotto) {
    const dataMap = { pembina: pembinaData };
    membersData.forEach((m, idx) => { dataMap["m" + idx] = m; });

    function openPopup(key) {
      const data = dataMap[key];
      if (!data) return;
      popupPhoto.style.backgroundImage = `url('${data.photo}')`;
      popupMotto.textContent = `"${data.motto}"`;
      popup.classList.add("active");
      document.body.style.overflow = "hidden";
    }

    function closePopup() {
      popup.classList.remove("active");
      document.body.style.overflow = "";
    }

    document.addEventListener("click", (e) => {
      const card = e.target.closest(".mpk-card");
      if (card && card.dataset.key) {
        openPopup(card.dataset.key);
      }
    });

    popup.addEventListener("click", (e) => {
      if (e.target === popup) closePopup();
    });

    if (popupClose) {
      popupClose.addEventListener("click", closePopup);
    }
  }

  // --- FADE-IN untuk kartu (kalau observer belum nempel) ---
  if ("IntersectionObserver" in window) {
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

    document
      .querySelectorAll(".section-fade, .mpk-card")
      .forEach(el => observer.observe(el));
  }
})();