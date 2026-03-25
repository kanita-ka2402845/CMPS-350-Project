document.addEventListener("DOMContentLoaded", function () {
    const currentUser = JSON.parse(localStorage.getItem("folioCurrentUser") || "null");
    const users = JSON.parse(localStorage.getItem("folioUsers") || "{}");

    if (!currentUser || !currentUser.isLoggedIn) {
        alert("Please log in first.");
        window.location.href = "login.html";
        return;
    }

    const currentEmail = currentUser.email;

    let userPosts = JSON.parse(localStorage.getItem("folioPosts") || "[]");
    if (!Array.isArray(userPosts)) {
        userPosts = [];
        localStorage.setItem("folioPosts", JSON.stringify(userPosts));
    }

    let feedInteractions = JSON.parse(localStorage.getItem("folioFeedInteractions") || "{}");
    let followData = JSON.parse(localStorage.getItem("folioFollows") || "{}");

    const profileBtn = document.querySelector(".profile-btn");
    const addPostBtn = document.getElementById("feedAddPostBtn");
    const overlay = document.getElementById("createPostOverlay");
    const postText = document.getElementById("postText");
    const postImage = document.getElementById("postImage");
    const postPreview = document.getElementById("postPreview");
    const cancelPostBtn = document.getElementById("cancelPostBtn");
    const submitPostBtn = document.getElementById("submitPostBtn");
    const leftFeed = document.getElementById("leftFeed");
    const rightFeed = document.getElementById("rightFeed");

    let selectedImageData = "";

    setupProfileButton();
    setupCreatePostModal();
    renderCreatedPosts();
    initializeAllPosts();

    function setupProfileButton() {
        if (!profileBtn) return;

        profileBtn.textContent = currentEmail.charAt(0).toUpperCase();
        profileBtn.addEventListener("click", function (e) {
            e.preventDefault();
            window.location.href = "profile.html";
        });
    }

    function setupCreatePostModal() {
        if (!addPostBtn || !overlay || !postText || !postImage || !postPreview || !cancelPostBtn || !submitPostBtn) {
            return;
        }

        addPostBtn.addEventListener("click", function () {
            openModal();
        });

        cancelPostBtn.addEventListener("click", function () {
            closeModal();
        });

        overlay.addEventListener("click", function (e) {
            if (e.target === overlay) {
                closeModal();
            }
        });

        postImage.addEventListener("change", function () {
            const file = postImage.files && postImage.files[0];

            if (!file) {
                selectedImageData = "";
                postPreview.src = "";
                postPreview.classList.add("hidden");
                return;
            }

            if (!file.type.startsWith("image/")) {
                alert("Please choose an image file.");
                postImage.value = "";
                selectedImageData = "";
                postPreview.src = "";
                postPreview.classList.add("hidden");
                return;
            }

            const reader = new FileReader();
            reader.onload = function (event) {
                selectedImageData = event.target.result;
                postPreview.src = selectedImageData;
                postPreview.classList.remove("hidden");
            };
            reader.readAsDataURL(file);
        });

        submitPostBtn.addEventListener("click", function () {
            const content = postText.value.trim();

            if (!content && !selectedImageData) {
                alert("Write something or add a picture.");
                return;
            }

            const newPost = {
                id: "user-post-" + Date.now(),
                email: currentEmail,
                user: getDisplayName(currentEmail),
                content: content,
                image: selectedImageData,
                date: new Date().toLocaleString()
            };

            try {
                userPosts.unshift(newPost);
                localStorage.setItem("folioPosts", JSON.stringify(userPosts));
                closeModal();
                location.reload();
            } catch (error) {
                alert("The selected image is too large. Try a smaller one.");
            }
        });
    }

    function openModal() {
        overlay.classList.remove("hidden");
    }

    function closeModal() {
        overlay.classList.add("hidden");
        postText.value = "";
        postImage.value = "";
        postPreview.src = "";
        postPreview.classList.add("hidden");
        selectedImageData = "";
    }

    function renderCreatedPosts() {
        if (!leftFeed && !rightFeed) return;

        const created = userPosts.slice().reverse();

        created.forEach(function (post, reverseIndex) {
            const card = document.createElement("div");
            card.className = "post-card user-post-card";
            card.setAttribute("data-post-id", post.id);
            card.setAttribute("data-created-post", "true");
            card.setAttribute("data-author-email", post.email || "");

            const captionText = post.content ? escapeHtml(post.content) : "";
            const dateText = post.date ? escapeHtml(post.date) : "Recent";
            const imageHtml = post.image
                ? `<img src="${post.image}" alt="User post image" class="user-post-image">`
                : "";

            card.innerHTML = `
                <div class="post-img">
                    ${imageHtml}
                    ${captionText ? `<div class="img-caption">${captionText}</div>` : ""}
                </div>
                <div class="post-footer">
                    <div class="post-meta">
                        <span class="post-username">${escapeHtml("@" + (post.user || getDisplayName(post.email)).replace(/^@/, ""))}</span>
                        <span class="post-date">${dateText}</span>
                    </div>
                    <div class="post-actions">
                        <button class="action-btn like-btn" type="button">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            <span class="count">0</span>
                        </button>
                        <button class="action-btn comment-btn" type="button">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            <span class="count">0</span>
                        </button>
                    </div>
                </div>
                <div class="comments-box"></div>
            `;

            const targetColumn = reverseIndex % 2 === 0 ? leftFeed : rightFeed;
            if (targetColumn) {
                targetColumn.prepend(card);
            } else if (leftFeed) {
                leftFeed.prepend(card);
            }
        });
    }

    function initializeAllPosts() {
        const postCards = document.querySelectorAll(".post-card");

        postCards.forEach(function (card, index) {
            let postId = card.getAttribute("data-post-id");
            const createdPost = card.getAttribute("data-created-post") === "true";
            const authorEmail = card.getAttribute("data-author-email") || "";
            const authorEl = card.querySelector(".post-username");
            const actionBtns = card.querySelectorAll(".action-btn");
            const commentsBox = card.querySelector(".comments-box");

            if (!postId) {
                postId = "static-post-" + index;
                card.setAttribute("data-post-id", postId);
            }

            if (actionBtns.length < 2 || !authorEl) return;

            const likeBtn = actionBtns[0];
            const commentBtn = actionBtns[1];
            const likeCountEl = likeBtn.querySelector(".count");
            const commentCountEl = commentBtn.querySelector(".count");
            const authorName = authorEl.textContent.trim();

            if (!feedInteractions[postId]) {
                feedInteractions[postId] = {
                    likes: likeCountEl ? parseInt(likeCountEl.textContent, 10) || 0 : extractCountFromButton(likeBtn),
                    comments: commentCountEl ? parseInt(commentCountEl.textContent, 10) || 0 : extractCountFromButton(commentBtn),
                    likedBy: [],
                    commentList: [],
                    authorName: authorName,
                    authorEmail: authorEmail,
                    createdPost: createdPost
                };
            }

            if (!Array.isArray(feedInteractions[postId].likedBy)) {
                feedInteractions[postId].likedBy = [];
            }

            if (!Array.isArray(feedInteractions[postId].commentList)) {
                feedInteractions[postId].commentList = [];
            }

            updateButtonCount(likeBtn, feedInteractions[postId].likes);
            updateButtonCount(commentBtn, feedInteractions[postId].comments);

            setupLikeButton(postId, likeBtn);
            setupCommentButton(postId, commentBtn, commentsBox);
            setupFollowButton(authorEl, authorName, authorEmail);

            if (feedInteractions[postId].likedBy.includes(currentEmail)) {
                likeBtn.classList.add("is-liked");
            }

            renderComments(postId, commentsBox, commentBtn);
        });

        localStorage.setItem("folioFeedInteractions", JSON.stringify(feedInteractions));
    }

    function setupLikeButton(postId, likeBtn) {
        likeBtn.addEventListener("click", function () {
            const post = feedInteractions[postId];
            const alreadyLiked = post.likedBy.includes(currentEmail);

            if (alreadyLiked) {
                post.likes -= 1;
                post.likedBy = post.likedBy.filter(function (email) {
                    return email !== currentEmail;
                });
                likeBtn.classList.remove("is-liked");
            } else {
                post.likes += 1;
                post.likedBy.push(currentEmail);
                likeBtn.classList.add("is-liked");
            }

            updateButtonCount(likeBtn, post.likes);
            localStorage.setItem("folioFeedInteractions", JSON.stringify(feedInteractions));
        });
    }

    function setupCommentButton(postId, commentBtn, commentsBox) {
        commentBtn.addEventListener("click", function () {
            const text = prompt("Write your comment:");
            if (!text || !text.trim()) return;

            feedInteractions[postId].commentList.push({
                id: Date.now(),
                user: currentEmail,
                text: text.trim()
            });

            feedInteractions[postId].comments = feedInteractions[postId].commentList.length;
            updateButtonCount(commentBtn, feedInteractions[postId].comments);
            localStorage.setItem("folioFeedInteractions", JSON.stringify(feedInteractions));
            renderComments(postId, commentsBox, commentBtn);
        });
    }

    function renderComments(postId, commentsBox, commentBtn) {
        if (!commentsBox) return;

        commentsBox.innerHTML = "";
        const comments = feedInteractions[postId].commentList || [];

        comments.forEach(function (comment) {
            const row = document.createElement("div");
            row.className = "comment-row";

            const text = document.createElement("div");
            text.className = "comment-text";
            text.innerHTML = "<strong>" + escapeHtml(comment.user) + ":</strong> " + escapeHtml(comment.text);

            row.appendChild(text);

            if (comment.user === currentEmail) {
                const del = document.createElement("button");
                del.className = "delete-comment-btn";
                del.type = "button";
                del.textContent = "Delete";

                del.addEventListener("click", function () {
                    feedInteractions[postId].commentList = feedInteractions[postId].commentList.filter(function (item) {
                        return item.id !== comment.id;
                    });

                    feedInteractions[postId].comments = feedInteractions[postId].commentList.length;
                    updateButtonCount(commentBtn, feedInteractions[postId].comments);
                    localStorage.setItem("folioFeedInteractions", JSON.stringify(feedInteractions));
                    renderComments(postId, commentsBox, commentBtn);
                });

                row.appendChild(del);
            }

            commentsBox.appendChild(row);
        });
    }

    function setupFollowButton(authorEl, authorName, authorEmail) {
        if (!authorEl) return;
        if (authorEl.parentElement.querySelector(".follow-injected-btn")) return;

        const currentDisplay = "@" + getDisplayName(currentEmail).replace(/^@/, "");
        if (authorName === currentDisplay) return;
        if (authorEmail && authorEmail === currentEmail) return;

        const followKey = authorEmail || authorName;

        if (!followData[followKey]) {
            followData[followKey] = { followers: [] };
        }

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "follow-injected-btn";

        updateFollowButton();

        btn.addEventListener("click", function (e) {
            e.stopPropagation();

            const followers = followData[followKey].followers;
            const alreadyFollowing = followers.includes(currentEmail);

            if (alreadyFollowing) {
                followData[followKey].followers = followers.filter(function (email) {
                    return email !== currentEmail;
                });
            } else {
                followers.push(currentEmail);
            }

            localStorage.setItem("folioFollows", JSON.stringify(followData));
            updateFollowButton();
        });

        authorEl.insertAdjacentElement("afterend", btn);

        function updateFollowButton() {
            const following = followData[followKey].followers.includes(currentEmail);
            btn.textContent = following ? "Following" : "Follow";
            btn.classList.toggle("is-following", following);
        }
    }

    function updateButtonCount(button, count) {
        const countEl = button.querySelector(".count");
        if (countEl) {
            countEl.textContent = String(count);
        }
    }

    function extractCountFromButton(button) {
        const number = button.textContent.replace(/[^\d]/g, "");
        return parseInt(number, 10) || 0;
    }

    function getDisplayName(email) {
        const user = users[email];
        if (user && user.name && user.name.trim()) {
            return user.name.trim();
        }
        return email.split("@")[0];
    }

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});