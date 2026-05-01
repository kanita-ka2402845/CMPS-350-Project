/* ═══════════════════════════════════════════════════════
   login.js  —  Bookgram  |  Phase 1
   Storage contract (matches signup.html and feed.js):
     "Users"       → { [email]: { email, password } }
     "currentUser" → plain email string
   ═══════════════════════════════════════════════════════ */

"use strict";

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    const msgEl     = document.getElementById("loginMessage");
    const googleBtn = document.getElementById("googleBtn");

    function showMessage(text, isError) {
        msgEl.textContent = text;
        msgEl.style.color = isError ? "var(--accent)" : "green";
    }

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email    = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;

        if (!email || !password) {
            showMessage("Please fill in all fields.", true);
            return;
        }

        const users = JSON.parse(localStorage.getItem("Users") || "{}");

        if (!users[email]) {
            showMessage("No account found with this email.", true);
            return;
        }

        if (users[email].password !== password) {
            showMessage("Incorrect password.", true);
            return;
        }

        localStorage.setItem("currentUser", email);

        showMessage("Login successful! Redirecting…", false);
        setTimeout(function () {
            window.location.href = "feed.html";
        }, 800);
    });

    if (googleBtn) {
        googleBtn.addEventListener("click", function () {
            alert("Google login is not connected yet.");
        });
    }

});