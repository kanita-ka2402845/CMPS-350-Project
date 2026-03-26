document.addEventListener("DOMContentLoaded", function () {


    const email = localStorage.getItem("currentUser") || "";
    if (!email) {
        window.location.href = "login.html";
        return;
    }

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
    if (!user.bio) {
        user.bio = "";
    }


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
            alert("Please enter a name.");
            return;
        }

        user.name = newName;
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
});