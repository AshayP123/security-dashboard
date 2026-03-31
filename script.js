function checkPassword() {
    let password = document.getElementById("password").value;
    let result = document.getElementById("result");

    if (password.length < 6) {
        result.innerText = "Weak ❌";
    } else if (password.length < 10) {
        result.innerText = "Medium ⚠️";
    } else {
        result.innerText = "Strong ✅";
    }
}

document.getElementById("info").innerText =
    "Browser: " + navigator.userAgent;