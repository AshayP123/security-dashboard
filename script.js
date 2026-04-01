document.addEventListener("DOMContentLoaded", () => {

  const passwordInput = document.getElementById("password");
  const result = document.getElementById("result");
  const bar = document.getElementById("strength-bar");

  // =========================
  // PASSWORD CHECK
  // =========================
  window.analyzePassword = async function () {
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
    } 
    else if (strength <= 3) {
      bar.style.width = "60%";
      bar.style.background = "yellow";
      result.innerText = "Moderate password";
    } 
    else {
      bar.style.width = "100%";
      bar.style.background = "#00ff88";
      result.innerText = "Strong password 🔐";
    }
  };

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
// BREACH CHECK (FIXED)
// =========================
async function checkLeakedPassword(password) {
  const hash = await sha1(password);

  const prefix = hash.substring(0, 5).toUpperCase();
  const suffix = hash.substring(5).toUpperCase();

  const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const text = await res.text();

  const lines = text.split("\n");

  for (let line of lines) {
    const [hashSuffix, count] = line.split(":");

    if (hashSuffix === suffix) {
      return parseInt(count); // ✅ REAL breach count
    }
  }

  return 0; // ✅ not found = safe
}

  // =========================
  // NETWORK + IP + LOCATION + SECURITY
  // =========================
  fetch("https://api.ipify.org?format=json")
    .then(res => res.json())
    .then(ipData => {

      const ip = ipData.ip;
      document.getElementById("ip").innerText = ip;

      // 🔥 CALL BACKEND
      return fetch(`http://localhost:3000/check-ip?ip=${ip}`)
        .then(res => res.json())
        .then(data => {

          console.log("Backend response:", data);

          const score = data.data.abuseConfidenceScore;
          const log = document.getElementById("activity-log");

          if (score < 20) {
            log.innerHTML = `<span class="text-green-400">✔ Safe IP (Score: ${score})</span>`;
          } 
          else if (score < 60) {
            log.innerHTML = `<span class="text-yellow-400">⚠️ Suspicious IP (Score: ${score})</span>`;
          } 
          else {
            log.innerHTML = `<span class="text-red-400">🚨 Malicious IP (Score: ${score})</span>`;
          }

          return ip; // pass ip forward
        });

    })
    .then(ip => {

      // 🌍 LOCATION
      return fetch(`https://ipapi.co/${ip}/json/`);
    })
    .then(res => res.json())
    .then(locationData => {

      if (locationData.city && locationData.country_name) {
        document.getElementById("location").innerText =
          `${locationData.city}, ${locationData.country_name}`;
      } else {
        document.getElementById("location").innerText = "Unavailable";
      }

    })
    .catch(err => {
      console.error("ERROR:", err);
      document.getElementById("activity-log").innerText = "IP check failed";
      document.getElementById("location").innerText = "Unavailable";
    });

  // =========================
  // BROWSER + DEVICE
  // =========================
  const ua = navigator.userAgent;

  let browser = "Unknown";
  let device = "Desktop";

  if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg")) browser = "Edge";

  if (/Mobi|Android/i.test(ua)) device = "Mobile";
  else if (/Mac/i.test(ua)) device = "Mac";
  else if (/Windows/i.test(ua)) device = "Windows";

  document.getElementById("browser").innerText = `${browser} (${device})`;

});