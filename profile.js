document.addEventListener("DOMContentLoaded", function () {
    const currentUser = JSON.parse(localStorage.getItem("folioCurrentUser"));
    const users = JSON.parse(localStorage.getItem("folioUsers")) || {};
    const posts = JSON.parse(localStorage.getItem("folioPosts")) || [];

    if (!currentUser || !currentUser.isLoggedIn) {
        window.location.href = "login.html";
        return;
    }

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

    if (!user.bio) {
        user.bio = "";
    }

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
            alert("Please enter a name.");
            return;
        }

        user.name = newName;
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
});