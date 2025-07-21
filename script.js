document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault();
  document.getElementById('form-status').innerText = "Sending...";

  // You can integrate Firebase/Zoho/Notion API here
  setTimeout(() => {
    document.getElementById('form-status').innerText = "Thank you! We'll get back to you soon.";
    this.reset();
  }, 1000);
});
