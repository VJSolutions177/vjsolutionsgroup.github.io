AOS.init({
  duration: 1200,
  once: true
});

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Message sent successfully!");
});
