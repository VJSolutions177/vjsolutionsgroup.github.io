// Loader
window.addEventListener("load", function () {
  document.getElementById("loader").style.display = "none";
});

// Toggle Menu
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".toggle-btn");
  const navList = document.querySelector(".navbar ul");

  toggleBtn.addEventListener("click", () => {
    navList.classList.toggle("active");
  });
});

// AOS (Animate on Scroll)
AOS.init({
  duration: 1000,
  once: true,
});
