const password = document.getElementById("password");
const result = document.getElementById("result");
const bar = document.getElementById("strength-bar");

password.addEventListener("input", () => {
  let val = password.value;
  let strength = 0;

  if (val.length >= 8) strength++;
  if (/[A-Z]/.test(val)) strength++;
  if (/[0-9]/.test(val)) strength++;
  if (/[^A-Za-z0-9]/.test(val)) strength++;

  if (val.length === 0) {
    bar.style.width = "0%";
    result.innerText = "";
  } else if (strength <= 1) {
    bar.style.width = "25%";
    bar.style.background = "#ff3366";
    result.innerText = "Weak";
  } else if (strength <= 3) {
    bar.style.width = "60%";
    bar.style.background = "yellow";
    result.innerText = "Medium";
  } else {
    bar.style.width = "100%";
    bar.style.background = "#00ff88";
    result.innerText = "Strong";
  }
});

// API for real data
fetch("https://ipapi.co/json/")
  .then(res => res.json())
  .then(data => {
    document.getElementById("ip").innerText = data.ip;
    document.getElementById("location").innerText =
      data.city + ", " + data.country_name;
    document.getElementById("browser").innerText = navigator.userAgent;
  });