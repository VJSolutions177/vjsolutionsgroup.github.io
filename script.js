// ✅ Mobile Menu Toggle
document.querySelector(".menu-toggle").addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("show");
});

// ✅ Reveal Animation on Scroll
function revealElements() {
  let reveals = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

  for (let i = 0; i < reveals.length; i++) {
    let windowHeight = window.innerHeight;
    let elementTop = reveals[i].getBoundingClientRect().top;
    let elementVisible = 100;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    }
  }
}

// ✅ Counter Animation
function startCounters() {
  const counters = document.querySelectorAll(".counter");
  counters.forEach(counter => {
    counter.innerText = "0";
    const updateCounter = () => {
      const target = +counter.getAttribute("data-target");
      const count = +counter.innerText;
      const increment = target / 100;

      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(updateCounter, 30);
      } else {
        counter.innerText = target;
      }
    };
    updateCounter();
  });
}

// ✅ Start counters when stats section is visible
window.addEventListener("scroll", () => {
  revealElements();

  let statsSection = document.querySelector(".stats");
  let top = statsSection.getBoundingClientRect().top;

  if (top < window.innerHeight - 100) {
    if (!statsSection.classList.contains("counted")) {
      statsSection.classList.add("counted");
      startCounters();
    }
  }
});

