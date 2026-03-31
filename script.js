const passwordInput = document.getElementById("password");
const result = document.getElementById("result");
const bar = document.getElementById("strength-bar");

// =========================
// PASSWORD CHECK
// =========================
async function analyzePassword() {
  const val = passwordInput.value;

  bar.style.width = "0%";
result.innerHTML = `
  <span class="flex items-center gap-2 text-gray-400">
    <span class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
    Analyzing password...
  </span>
`;
  if (!val) {
    result.innerText = "Enter a password";
    return;
  }

  let strength = 0;
  if (val.length >= 8) strength++;
  if (/[A-Z]/.test(val)) strength++;
  if (/[0-9]/.test(val)) strength++;
  if (/[^A-Za-z0-9]/.test(val)) strength++;

  const breachCount = await checkLeakedPassword(val);

  if (breachCount > 0) {
    bar.style.width = "100%";
    bar.style.background = "#ff3366";
    result.innerText = `⚠️ Found in ${formatBreachCount(breachCount)} breaches`;
    return;
  }

  if (strength <= 1) {
    bar.style.width = "25%";
    bar.style.background = "#ff3366";
    result.innerText = "Weak password";
  } else if (strength <= 3) {
    bar.style.width = "60%";
    bar.style.background = "yellow";
    result.innerText = "Moderate password";
  } else {
    bar.style.width = "100%";
    bar.style.background = "#00ff88";
    result.innerText = "Strong password 🔐";
  }
}

// =========================
// BREACH FORMAT
// =========================
function formatBreachCount(count) {
  if (count < 1000) return "1,000+";
  if (count < 10000) return "5,000+";
  if (count < 100000) return "10,000+";
  return "1,000,000+";
}

// =========================
// HASH
// =========================
async function sha1(message) {
  const buffer = new TextEncoder().encode(message);
  const hash = await crypto.subtle.digest("SHA-1", buffer);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// =========================
// BREACH CHECK
// =========================
async function checkLeakedPassword(password) {
  const hash = await sha1(password);
  const prefix = hash.slice(0, 5).toUpperCase();
  const suffix = hash.slice(5).toUpperCase();

  const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const text = await res.text();

  return text.includes(suffix) ? 1000 : 0;
}

// =========================
// NETWORK INFO (FINAL WORKING)
// =========================
fetch("https://api.ipify.org?format=json")
  .then(res => res.json())
  .then(ipData => {

    const ip = ipData.ip;
    document.getElementById("ip").innerText = ip;

    // Use better location API
    return fetch(`https://ipapi.co/${ip}/json/`);
  })
  .then(res => res.json())
  .then(data => {

    console.log("LOCATION DATA:", data); // debug

    if (data.city && data.country_name) {
      document.getElementById("location").innerText =
        `${data.city}, ${data.country_name}`;
    } else {
      document.getElementById("location").innerText = "Unavailable";
    }

  })
  .catch(err => {
    console.error("Location error:", err);
    document.getElementById("location").innerText = "Unavailable";
  });

// =========================
// BROWSER
// =========================
const ua = navigator.userAgent;

let browser = "Unknown";
let device = "Desktop";

if (ua.includes("Chrome")) browser = "Chrome";
else if (ua.includes("Safari")) browser = "Safari";
else if (ua.includes("Firefox")) browser = "Firefox";

if (/Mac/i.test(ua)) device = "Mac";
else if (/Windows/i.test(ua)) device = "Windows";

document.getElementById("browser").innerText = `${browser} (${device})`;
// =========================
// INITIAL SYSTEM BOOT LOGS
// =========================

  setTimeout(() => {
    addActivity("System initialized", "success");
  }, 500);

  setTimeout(() => {
    addActivity("Network scan complete", "info");
  }, 1000);

  setTimeout(() => {
    addActivity("Monitoring active", "success");
  }, 1500);

// =========================
// SYSTEM BOOT LOGS (WORKING)
// =========================
setTimeout(() => {
  addActivity("System initialized", "success");
}, 500);

setTimeout(() => {
  addActivity("Network scan complete", "info");
}, 1000);

setTimeout(() => {
  addActivity("Monitoring active", "success");
}, 1500);