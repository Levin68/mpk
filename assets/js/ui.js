// hamburger + drawer
const menuToggle = document.querySelector(".menu-toggle");
const navDrawer = document.querySelector(".nav-drawer");

if (menuToggle && navDrawer) {
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navDrawer.classList.toggle("open");
  });

  navDrawer.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      navDrawer.classList.remove("open");
    });
  });
}
// Parallax scroll untuk background hero
window.addEventListener("scroll", () => {
  const heroBg = document.querySelector(".hero-bg");
  const nav = document.querySelector(".top-nav");

  if (window.scrollY > 10) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");

  heroBg.style.backgroundPositionY = `${window.scrollY * 0.4}px`;
});