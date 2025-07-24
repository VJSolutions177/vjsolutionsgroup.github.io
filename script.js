// Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

// Slider Logic
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");

function showSlide(index) {
  slides.forEach(slide => slide.style.display = "none");
  slides[index].style.display = "block";
}
setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}, 3000);

window.onload = () => showSlide(currentSlide);
AOS.init({
  duration: 1200,
  once: true
});

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Message sent successfully!");
});
