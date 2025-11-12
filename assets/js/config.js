// assets/js/config.js
// Konfigurasi global MPK

// ===== EmailJS =====
window.MPK_CONFIG = {
  SERVICE_ID: "service_zykm10o",
  TEMPLATE_ID: "template_gysovv9",
  AUTO_REPLY_ID: "template_sji34qh",
  PUBLIC_KEY: "vC2YApolZMaZtK3fi",
  MPK_EMAIL: "orgkagakenal@gmail.com"
};

// ===== Firebase Realtime Database (compat) =====
(function () {
  if (typeof firebase === "undefined") {
    console.error("[MPK] Firebase CDN belum dimuat.");
    return;
  }

  const firebaseConfig = {
    apiKey: "AIzaSyCfK_ZPisLrlhy-73cthGxvC3CkOYD0VGU",
    authDomain: "mpk-zoneth.firebaseapp.com",
    databaseURL: "https://mpk-zoneth-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mpk-zoneth",
    storageBucket: "mpk-zoneth.firebasestorage.app",
    messagingSenderId: "30902048665",
    appId: "1:30902048665:web:4dd57dcf6813631137e508",
    measurementId: "G-NR66V6BE5K"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log("[MPK] Firebase initialized (RTDB).");
  }

  // Path node RTDB
  window.FBDB = {
    aspirasiPath: "mpk_aspirasi",
    publicPath: "mpk_public_messages",
    commentsPath: "mpk_public_comments"
  };
})();