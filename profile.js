document.addEventListener("DOMContentLoaded", function () {
<<<<<<< HEAD


    const email = localStorage.getItem("currentUser") || "";
    if (!email) {
=======
    const currentUser = JSON.parse(localStorage.getItem("folioCurrentUser"));
    const users = JSON.parse(localStorage.getItem("folioUsers")) || {};
    const posts = JSON.parse(localStorage.getItem("folioPosts")) || [];

    if (!currentUser || !currentUser.isLoggedIn) {
>>>>>>> 7cc398a4e999bfb3e8eecdadc80bd31789b89748
        window.location.href = "login.html";
        return;
    }

<<<<<<< HEAD
    const users = JSON.parse(localStorage.getItem("Users") || "{}");
    const posts = JSON.parse(localStorage.getItem("Posts") || "[]");

    let user = users[email];
    if (!user) {
        user = { email: email, password: "" };
        users[email] = user;
    }

    if (!user.name || !user.name.trim()) {
        user.name = email.split("@")[0];
    }
=======
    const user = users[currentUser.email];

    if (!user) {
        alert("User not found.");
        window.location.href = "login.html";
        return;
    }

    const profileAvatar = document.getElementById("profileAvatar");
    const profileName = document.getElementById("profileName");
    const profileHandle = document.getElementById("profileHandle");
    const profileEmail = document.getElementById("profileEmail");
    const profileBio = document.getElementById("profileBio");

    const nameInput = document.getElementById("nameInput");
    const bioInput = document.getElementById("bioInput");
    const saveBtn = document.getElementById("saveBtn");

    const userPosts = document.getElementById("userPosts");

    if (!user.name) {
        user.name = currentUser.email.split("@")[0];
    }

>>>>>>> 7cc398a4e999bfb3e8eecdadc80bd31789b89748
    if (!user.bio) {
        user.bio = "";
    }

<<<<<<< HEAD

    const profileAvatar = document.getElementById("profileAvatar");
    const profileName   = document.getElementById("profileName");
    const profileHandle = document.getElementById("profileHandle");
    const profileEmail  = document.getElementById("profileEmail");
    const profileBio    = document.getElementById("profileBio");
    const nameInput     = document.getElementById("nameInput");
    const bioInput      = document.getElementById("bioInput");
    const saveBtn       = document.getElementById("saveBtn");
    const userPostsEl   = document.getElementById("userPosts");

    function populateProfile() {
        profileAvatar.textContent  = user.name.charAt(0).toUpperCase();
        profileName.textContent    = user.name;
        profileHandle.textContent  = "@" + user.name.toLowerCase().replace(/\s+/g, "");
        profileEmail.textContent   = email;
        profileBio.textContent     = user.bio || "No bio yet.";
        nameInput.value            = user.name;
        bioInput.value             = user.bio;
    }

    populateProfile();

    saveBtn.addEventListener("click", function () {
        const newName = nameInput.value.trim();
        const newBio  = bioInput.value.trim();

        if (!newName) {
=======
    profileName.textContent = user.name;
    profileHandle.textContent = "@" + user.name.toLowerCase().replace(/\s/g, "");
    profileEmail.textContent = user.email;
    profileBio.textContent = user.bio || "No bio yet.";
    profileAvatar.textContent = user.name.charAt(0).toUpperCase();

    nameInput.value = user.name;
    bioInput.value = user.bio;

    saveBtn.addEventListener("click", function () {
        const newName = nameInput.value.trim();
        const newBio = bioInput.value.trim();

        if (newName === "") {
>>>>>>> 7cc398a4e999bfb3e8eecdadc80bd31789b89748
            alert("Please enter a name.");
            return;
        }

        user.name = newName;
<<<<<<< HEAD
        user.bio  = newBio;

        users[email] = user;
        localStorage.setItem("Users", JSON.stringify(users));

        populateProfile();
        alert("Profile saved.");
    });

    const myPosts = posts.filter(function (post) {
        return post.email === email;
    });

    if (!userPostsEl) return;

    if (myPosts.length === 0) {
        userPostsEl.innerHTML = '<div class="empty-posts">No posts yet.</div>';
    } else {
        userPostsEl.innerHTML = "";
        myPosts.forEach(function (post) {
            const card = document.createElement("div");
            card.className = "profile-post-card";

            const bodyText = post.text || post.content || "";
            const dateText = post.date || "Recent";

            card.innerHTML =
                '<div class="profile-post-body">' + escapeHtml(bodyText) + '</div>'
              + '<div class="profile-post-footer">' + escapeHtml(dateText) + '</div>';

            userPostsEl.appendChild(card);
        });
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }
=======
        user.bio = newBio;

        users[currentUser.email] = user;
        localStorage.setItem("folioUsers", JSON.stringify(users));

        profileName.textContent = user.name;
        profileHandle.textContent = "@" + user.name.toLowerCase().replace(/\s/g, "");
        profileBio.textContent = user.bio || "No bio yet.";
        profileAvatar.textContent = user.name.charAt(0).toUpperCase();

        alert("Profile saved successfully.");
    });

    const myPosts = posts.filter(function (post) {
        return post.email === currentUser.email;
    });

    if (myPosts.length === 0) {
        userPosts.innerHTML = '<div class="empty-posts">No posts yet.</div>';
    } else {
        userPosts.innerHTML = "";

        myPosts.forEach(function (post) {
            userPosts.innerHTML += `
                <div class="profile-post-card">
                    <div class="profile-post-body">${post.content}</div>
                    <div class="profile-post-footer">${post.date || "Recent post"}</div>
                </div>
            `;
        });
    }
>>>>>>> 7cc398a4e999bfb3e8eecdadc80bd31789b89748
});