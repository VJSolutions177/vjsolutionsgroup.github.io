const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzYmUsHNBrlMFGNDw2Aj0WGTDTKsXi9MZ3ebplfU8QxAmPfeUvNesf4p_YpdC_g5jLrwg/exec";

function toggleMenu(){
  document.getElementById("navMenu").classList.toggle("active");
}

function toggleTheme(){
  document.body.classList.toggle("light");
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if(loader){ loader.style.display = "none"; }
  }, 900);

  setupResumeForm();
});

const words = ["Talent With Vision", "Companies With Talent", "Careers With Confidence"];
let i = 0, j = 0, del = false;

function type(){
  const t = document.getElementById("typing");
  if(!t) return;

  let word = words[i];
  t.innerHTML = word.substring(0, j);

  if(!del && j++ === word.length) del = true;
  if(del && j-- === 0){
    del = false;
    i = (i + 1) % words.length;
  }

  setTimeout(type, del ? 70 : 120);
}
type();

function revealSections(){
  document.querySelectorAll(".reveal").forEach(el => {
    if(el.getBoundingClientRect().top < window.innerHeight - 100){
      el.classList.add("active");
    }
  });
}
window.addEventListener("scroll", revealSections);
revealSections();

window.addEventListener("scroll", () => {
  const progress = document.getElementById("scrollProgress");
  if(!progress) return;
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  progress.style.width = scrollHeight ? (scrollTop / scrollHeight) * 100 + "%" : "0%";
});

document.addEventListener("mousemove", (e) => {
  const glow = document.getElementById("cursorGlow");
  if(glow){
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  }
});

document.querySelectorAll("[data-count]").forEach(counter => {
  let target = +counter.dataset.count;
  let count = 0;

  let run = setInterval(() => {
    count += Math.ceil(target / 80);
    if(count >= target){
      count = target;
      clearInterval(run);
    }
    counter.innerText = count + "+";
  }, 25);
});

function filterJobs(category){
  const cards = document.querySelectorAll(".filter-job-card");
  const buttons = document.querySelectorAll(".filter-buttons button");

  buttons.forEach(btn => btn.classList.remove("active-filter"));

  const clickedButton = Array.from(buttons).find(btn => {
    const text = btn.textContent.toLowerCase().replace("-", "").replace(" ", "");
    return category === "all" ? text === "all" : text.includes(category);
  });

  if(clickedButton){ clickedButton.classList.add("active-filter"); }

  cards.forEach(card => {
    card.style.display = (category === "all" || card.classList.contains(category)) ? "block" : "none";
  });
}

function setupResumeForm(){
  const form = document.getElementById("applyForm");
  const resumeInput = document.getElementById("resumeFile");
  const fileName = document.getElementById("fileName");
  const status = document.getElementById("formStatus");

  if(resumeInput && fileName){
    resumeInput.addEventListener("change", function(){
      fileName.textContent = this.files.length ? this.files[0].name : "No file selected";
    });
  }

  if(!form) return;

  form.addEventListener("submit", function(e){
    e.preventDefault();

    const file = form.resume.files[0];
    if(!file){
      status.textContent = "Please upload your resume.";
      status.className = "form-status error";
      return;
    }

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if(!allowed.includes(file.type) && !/\.(pdf|doc|docx)$/i.test(file.name)){
      status.textContent = "Only PDF, DOC, or DOCX resumes are allowed.";
      status.className = "form-status error";
      return;
    }

    const reader = new FileReader();
    status.textContent = "Submitting your application...";
    status.className = "form-status loading";

    reader.onload = function(){
      const data = {
        name: form.name.value.trim(),
        phone: form.phone.value.trim(),
        email: form.email.value.trim(),
        qualification: form.qualification.value.trim(),
        jobRole: form.jobRole.value,
        message: form.message.value.trim(),
        resumeName: file.name,
        resumeType: file.type || "application/octet-stream",
        resumeBase64: reader.result
      };

      fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(data)
      })
      .then(() => {
        status.textContent = "Thank you for applying with VJ SOLUTIONS. Our HR team will contact you shortly.";
        status.className = "form-status success";
        form.reset();
        if(fileName) fileName.textContent = "No file selected";
      })
      .catch(() => {
        status.textContent = "Submission failed. Please contact us on WhatsApp: 7729950118.";
        status.className = "form-status error";
      });
    };

    reader.readAsDataURL(file);
  });
}

document.querySelectorAll(".premium-faq-item .faq-question").forEach(button => {
  button.addEventListener("click", () => {
    const item = button.closest(".premium-faq-item");
    const answer = item.querySelector(".faq-answer");
    const plus = item.querySelector("b");

    document.querySelectorAll(".premium-faq-item").forEach(otherItem => {
      if(otherItem !== item){
        otherItem.classList.remove("active");
        otherItem.querySelector(".faq-answer").style.maxHeight = "0px";
        otherItem.querySelector("b").textContent = "+";
      }
    });

    if(item.classList.contains("active")){
      item.classList.remove("active");
      answer.style.maxHeight = "0px";
      plus.textContent = "+";
    } else {
      item.classList.add("active");
      answer.style.maxHeight = answer.scrollHeight + "px";
      plus.textContent = "−";
    }
  });
});

function sendRecruiterWhatsApp(e){
  e.preventDefault();

  let text =
    `New Recruiter Partnership Request%0A` +
    `Company: ${document.getElementById("companyName").value}%0A` +
    `HR Name: ${document.getElementById("hrName").value}%0A` +
    `Phone: ${document.getElementById("hrPhone").value}%0A` +
    `Email: ${document.getElementById("hrEmail").value}%0A` +
    `Role: ${document.getElementById("hiringRole").value}%0A` +
    `Category: ${document.getElementById("hiringCategory").value}%0A` +
    `Details: ${document.getElementById("hiringDetails").value}`;

  window.open(`https://wa.me/917729950118?text=${text}`, "_blank");
}

function toggleChat(){
  document.getElementById("chatbox").classList.toggle("active");
}

function sendChat(){
  let input = document.getElementById("chatInput");
  let body = document.getElementById("chatBody");
  let msg = input.value.trim();

  if(!msg) return;

  body.innerHTML += `<p><b>You:</b> ${msg}</p>`;

  let lower = msg.toLowerCase();
  let reply = "Please contact VJ Solutions on WhatsApp: +91 7729950118 for quick support.";

  if(lower.includes("job") || lower.includes("opening")){
    reply = "We provide verified IT, Non-IT, BPO, Pharma and Healthcare job updates. Please fill the application form or contact us on WhatsApp.";
  } else if(lower.includes("resume")){
    reply = "Please upload your updated resume through the application form. Make sure your phone number and email are correct.";
  } else if(lower.includes("interview")){
    reply = "We support HR screening, virtual interviews and face-to-face interview coordination.";
  } else if(lower.includes("status")){
    reply = "To check your application status, please WhatsApp your registered phone number to VJ Solutions.";
  } else if(lower.includes("company") || lower.includes("tie")){
    reply = "For company tie-ups or bulk hiring, contact vjsolution.info@gmail.com or WhatsApp +91 7729950118.";
  }

  body.innerHTML += `<p><b>AI:</b> ${reply}</p>`;
  input.value = "";
  body.scrollTop = body.scrollHeight;
}
