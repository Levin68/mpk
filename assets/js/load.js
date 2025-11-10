// assets/js/main.js

// typing hero
const phrases = [
  "MPK SMP",
  "Tunas Harapan",
  "Periode 25–26"
];
const typedEl = document.getElementById("typedText");
const cursorEl = document.querySelector(".hero-cursor");

let pIndex = 0;
let cIndex = 0;
let deleting = false;

function typeLoop(){
  const current = phrases[pIndex];
  if (!deleting){
    typedEl.textContent = current.slice(0, cIndex + 1);
    cIndex++;
    if (cIndex === current.length){
      deleting = true;
      setTimeout(typeLoop, 900);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, cIndex - 1);
    cIndex--;
    if (cIndex === 0){
      deleting = false;
      pIndex = (pIndex + 1) % phrases.length;
    }
  }
  const speed = deleting ? 55 : 85;
  setTimeout(typeLoop, speed);
}
if (typedEl && cursorEl){
  typeLoop();
}

// hamburger menu
const menuBtn = document.querySelector(".menu-toggle");
const navMenu = document.getElementById("navMenu");

if (menuBtn && navMenu){
  menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    navMenu.classList.toggle("show");
  });
  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menuBtn.classList.remove("active");
      navMenu.classList.remove("show");
    });
  });
}

// scroll reveal fade
const fadeSections = document.querySelectorAll(".section-fade");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting){
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {threshold:0.15}
);
fadeSections.forEach(sec => observer.observe(sec));