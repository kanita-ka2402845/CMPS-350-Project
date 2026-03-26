//since different people worked on different files, there were errors and discrepancies in choice of storage. several changes were made across files, thus errors are inevitable.
//for stricter parsing and error handling
"use strict";

document.addEventListener("DOMContentLoaded", function () {

    let currentUser = localStorage.getItem("currentUser") || "";

    if (currentUser.startsWith("{")) {
        try {
            currentUser = JSON.parse(currentUser).email || "";
            localStorage.setItem("currentUser", currentUser);
        } catch (_) { currentUser = ""; }
    }

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    /*
       Derive a short username from email
    */
    const users = JSON.parse(localStorage.getItem("Users") || "{}");

    function getDisplayName(email) {
        if (!email) return "user";
        const u = users[email];
        if (u && u.name && u.name.trim()) return u.name.trim();
        return email.split("@")[0];   
    }

    const myName = getDisplayName(currentUser);

    let followData = JSON.parse(localStorage.getItem("Follows") || "{}");

    // load from local Storage or put dummy posts
    let posts = [];

    try {
        const raw = localStorage.getItem("Posts");
        posts = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(posts)) posts = [];
    } catch (_) { posts = []; }

    if (posts.length === 0) {
        posts = [
            {
                id: "seed-1", email: "", user: "kanita",
                text: "A quiet morning with coffee ☕",
                image: "post1.jpg", date: "Mar 23",
                likes: 12, likedBy: [],
                comments: [
                    { id: "c1", email: "", user: "maha",   text: "so peaceful" },
                    { id: "c2", email: "", user: "humdia", text: "love this"   }
                ]
            },
            {
                id: "seed-2", email: "", user: "maha",
                text: "Green everywhere 🌿",
                image: "post2.jpg", date: "Mar 22",
                likes: 5, likedBy: [], comments: []
            },
            {
                id: "seed-3", email: "", user: "humdia",
                text: "peace.",
                image: "post3.jpg", date: "Mar 21",
                likes: 8, likedBy: [],
                comments: [
                    { id: "c3", email: "", user: "fatima", text: "needed this" }
                ]
            },
            {
                id: "seed-4", email: "", user: "fatima",
                text: "sunset hits different 🌅",
                image: "post4.jpg", date: "Mar 20",
                likes: 20, likedBy: [], comments: []
            }
        ];
        localStorage.setItem("Posts", JSON.stringify(posts));
    }

    // determine how many posts will be per page depending on screen size
    let currentSpread = 0;

    function postsPerSpread() {
        if (window.innerWidth >= 1024) return 4;
        if (window.innerWidth >= 768)  return 2;
        return 1;
    }

    function renderPosts() {
        const leftFeed  = document.getElementById("leftFeed");
        const rightFeed = document.getElementById("rightFeed");

        // verification check since prev version of code was referencing different html IDs for page content
        if (!leftFeed)  { console.error("MISSING #leftFeed in HTML");  return; }
        if (!rightFeed) { console.error("MISSING #rightFeed in HTML"); return; }

        const perSpread   = postsPerSpread();
        const start       = currentSpread * perSpread;
        const visible     = posts.slice(start, start + perSpread);

        const wide       = window.innerWidth >= 768;
        const half       = Math.ceil(visible.length / 2);
        const leftPosts  = wide ? visible.slice(0, half) : visible;
        const rightPosts = wide ? visible.slice(half)    : [];

        leftFeed.innerHTML  = "";
        rightFeed.innerHTML = "";

        if (leftPosts.length === 0) {
            leftFeed.innerHTML = '<p class="empty-msg">No posts here yet.</p>';
        } else {
            leftPosts.forEach(function (p) {
                leftFeed.appendChild(makeCard(p));
            });
        }

        rightPosts.forEach(function (p) {
            rightFeed.appendChild(makeCard(p));
        });

        // page numbers
        var ln = document.querySelector(".page.left .page-num");
        var rn = document.querySelector(".page.right .page-num");
        if (ln) ln.textContent = String(currentSpread * 2 + 1).padStart(2, "0");
        if (rn) rn.textContent = String(currentSpread * 2 + 2).padStart(2, "0");

        // nav buttons
        document.querySelectorAll(".prev-btn").forEach(function (b) {
            b.disabled = currentSpread === 0;
        });
        document.querySelectorAll(".next-btn").forEach(function (b) {
            b.disabled = start + perSpread >= posts.length;
        });
    }

    function makeCard(post) {
        var liked   = Array.isArray(post.likedBy) && post.likedBy.includes(currentUser);
        var isOwner = post.email ? post.email === currentUser
                                 : post.user  === myName;

        var card = document.createElement("article");
        card.className = "post-card";
        card.setAttribute("tabindex", "0");
        card.setAttribute("data-post-id", String(post.id));
        card.setAttribute("data-author-email", post.email || "");

        var imgBlock = post.image
            ? '<img src="' + esc(post.image) + '" alt="" loading="lazy">'
              + (post.text ? '<div class="img-caption">' + esc(post.text) + '</div>' : '')
            : '<div class="post-text-only">' + esc(post.text) + '</div>';

        var deleteBtnHtml = isOwner
            ? '<button class="action-btn delete-btn" type="button" title="Delete">'
              + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
              + '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>'
              + '<path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg></button>'
            : '';

        card.innerHTML =
            '<div class="post-img">' + imgBlock + '</div>'
          + '<footer class="post-footer">'
          +   '<div class="post-meta">'
          +     '<span class="post-username">@' + esc(post.user) + '</span>'
          +     '<span class="post-date">'     + esc(post.date)  + '</span>'
          +   '</div>'
          +   '<div class="post-actions">'
          +     '<button class="action-btn like-btn ' + (liked ? 'is-liked' : '') + '" type="button" title="Like">'
          +       '<svg width="12" height="12" viewBox="0 0 24 24"'
          +           ' fill="' + (liked ? 'currentColor' : 'none') + '"'
          +           ' stroke="currentColor" stroke-width="2">'
          +         '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06'
          +              'a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23'
          +              'l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>'
          +       '</svg>'
          +       '<span class="like-count">' + post.likes + '</span>'
          +     '</button>'
          +     '<button class="action-btn comment-btn" type="button" title="Comments">'
          +       '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
          +         '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'
          +       '</svg>'
          +       '<span class="comment-count">' + (post.comments ? post.comments.length : 0) + '</span>'
          +     '</button>'
          +     deleteBtnHtml
          +   '</div>'
          + '</footer>';

        // events
        card.querySelector(".like-btn").addEventListener("click", function (e) {
            e.stopPropagation();
            toggleLike(post, card);
        });

        card.querySelector(".comment-btn").addEventListener("click", function (e) {
            e.stopPropagation();
            openModal(post);
        });

        var delBtn = card.querySelector(".delete-btn");
        if (delBtn) {
            delBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                deletePost(post.id);
            });
        }

        card.addEventListener("click",   function () { openModal(post); });
        card.addEventListener("keydown", function (e) { if (e.key === "Enter") openModal(post); });

        var authorEl = card.querySelector(".post-username");
        setupFollowButton(authorEl, post.user, post.email || "");


        return card;
    }
//functionalities
    function toggleLike(post, card) {
        if (!Array.isArray(post.likedBy)) post.likedBy = [];
        var btn    = card.querySelector(".like-btn");
        var svg    = btn.querySelector("svg");
        var count  = btn.querySelector(".like-count");
        var idx    = post.likedBy.indexOf(currentUser);

        if (idx === -1) {
            post.likedBy.push(currentUser);
            post.likes++;
            btn.classList.add("is-liked");
            if (svg) svg.setAttribute("fill", "currentColor");
        } else {
            post.likedBy.splice(idx, 1);
            post.likes = Math.max(0, post.likes - 1);
            btn.classList.remove("is-liked");
            if (svg) svg.setAttribute("fill", "none");
        }
        if (count) count.textContent = String(post.likes);
        save();
    }

    function deletePost(id) {
        if (!confirm("Delete this post?")) return;
        posts = posts.filter(function (p) { return String(p.id) !== String(id); });
        var per = postsPerSpread();
        while (currentSpread > 0 && currentSpread * per >= posts.length) currentSpread--;
        save();
        renderPosts();
    }

    function setupFollowButton(authorEl, authorName, authorEmail) {
        if (!authorEl) return;

        // don't show follow button on own posts
        var authorDisplay = "@" + authorName.replace(/^@/, "");
        var myDisplay     = "@" + myName.replace(/^@/, "");
        if (authorDisplay === myDisplay) return;
        if (authorEmail && authorEmail === currentUser) return;

        // don't inject twice (in case card is re-rendered)
        if (authorEl.parentElement.querySelector(".follow-injected-btn")) return;

        var followKey = authorEmail || authorName;
        if (!followData[followKey]) {
            followData[followKey] = { followers: [] };
        }

        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "follow-injected-btn";

        function updateLabel() {
            var isFollowing = followData[followKey].followers.includes(currentUser);
            btn.textContent = isFollowing ? "Following" : "Follow";
            btn.classList.toggle("is-following", isFollowing);
        }

        updateLabel();

        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            var followers      = followData[followKey].followers;
            var alreadyFollowing = followers.includes(currentUser);

            if (alreadyFollowing) {
                followData[followKey].followers = followers.filter(function (f) {
                    return f !== currentUser;
                });
            } else {
                followers.push(currentUser);
            }

            localStorage.setItem("Follows", JSON.stringify(followData));
            updateLabel();
        });

        authorEl.insertAdjacentElement("afterend", btn);
    }

  // creating a post including text and optional image
const floatingBtn   = document.getElementById("floatingPostBtn");
const overlay       = document.getElementById("createPostOverlay");
const postText      = document.getElementById("postText");
const cancelBtn     = document.getElementById("cancelPostBtn");
const submitBtn     = document.getElementById("submitPostBtn");
const postImageFile = document.getElementById("postImageFile");
const postPreview   = document.getElementById("postPreview");

if (floatingBtn && overlay) {
    floatingBtn.addEventListener("click", function () {
        overlay.classList.add("open");
        if (postText) postText.focus();
    });
}

if (cancelBtn && overlay) {
    cancelBtn.addEventListener("click", function () {
        closeCreateModal();
    });
}

if (overlay) {
    overlay.addEventListener("click", function (e) {
        if (e.target === overlay) closeCreateModal();
    });
}

// image preview
if (postImageFile && postPreview) {
    postImageFile.addEventListener("change", function () {
        const file = postImageFile.files && postImageFile.files[0];
        if (!file) {
            postPreview.src = "";
            postPreview.classList.add("hidden");
            return;
        }
        const reader = new FileReader();
        reader.onload = function (evt) {
            postPreview.src = evt.target.result;
            postPreview.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
    });
}

if (submitBtn) {
    submitBtn.addEventListener("click", function () {
        const text = postText ? postText.value.trim() : "";
        const hasImage = postImageFile && postImageFile.files && postImageFile.files.length > 0;

        if (!text && !hasImage) {
            alert("Write something or upload an image.");
            return;
        }

        function publishPost(imageData) {
            const newPost = {
                id:      "p-" + Date.now(),
                email:   currentUser,
                user:    myName,
                text:    text,
                image:   imageData || "",
                date:    new Date().toLocaleDateString(),
                likes:   0,
                likedBy: [],
                comments: []
            };
            posts.unshift(newPost);
            currentSpread = 0;
            save();
            renderPosts();
            closeCreateModal();
        }

        if (hasImage) {
            const reader = new FileReader();
            reader.onload = function (evt) {
                try {
                    publishPost(evt.target.result);
                } catch (err) {
                    alert("Image too large. Please try a smaller one.");
                }
            };
            reader.readAsDataURL(postImageFile.files[0]);
        } else {
            publishPost("");
        }
    });
}

function closeCreateModal() {
    if (overlay)      overlay.classList.remove("open");
    if (postText)     postText.value = "";
    if (postImageFile) postImageFile.value = "";
    if (postPreview) {
        postPreview.src = "";
        postPreview.classList.add("hidden");
    }
}

//navgiation
    document.querySelectorAll(".prev-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            if (currentSpread > 0) { currentSpread--; renderPosts(); }
        });
    });
    document.querySelectorAll(".next-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            if ((currentSpread + 1) * postsPerSpread() < posts.length) {
                currentSpread++;
                renderPosts();
            }
        });
    });
    window.addEventListener("resize", renderPosts);


    function save() {
        localStorage.setItem("Posts", JSON.stringify(posts));
    }

//opening a post in detail
    var activePost = null;

    function openModal(post) {
        activePost = post;
        document.getElementById("modalPostText").textContent = post.text || "";
        document.getElementById("modalMeta").textContent =
            "@" + post.user + "  ·  " + post.date + "  ·  ♥ " + post.likes;
        renderComments(post);
        document.getElementById("modalOverlay").classList.add("open");
        document.getElementById("modalInput").focus();
    }

    function renderComments(post) {
        var box = document.getElementById("modalComments");
        if (!box) return;
        box.innerHTML = "";
        var comments = post.comments || [];
        if (comments.length === 0) {
            box.innerHTML = '<p class="no-comments">No comments yet. Be the first!</p>';
            return;
        }
        comments.forEach(function (c) {
            var div = document.createElement("div");
            div.className = "modal-comment";
            div.innerHTML = "<strong>@" + esc(c.user) + ":</strong> " + esc(c.text);
            box.appendChild(div);
        });
        box.scrollTop = box.scrollHeight;
    }

    function closeModal() {
        document.getElementById("modalOverlay").classList.remove("open");
        document.getElementById("modalInput").value = "";
        activePost = null;
    }

    document.getElementById("modalClose").addEventListener("click", closeModal);
    document.getElementById("modalOverlay").addEventListener("click", function (e) {
        if (e.target.id === "modalOverlay") closeModal();
    });
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeModal();
    });

    function submitComment() {
        var input = document.getElementById("modalInput");
        var text  = input.value.trim();
        if (!text || !activePost) return;
        if (!Array.isArray(activePost.comments)) activePost.comments = [];
        activePost.comments.push({
            id:    "c-" + Date.now(),
            email: currentUser,
            user:  myName,
            text:  text
        });
        input.value = "";
        // update count on card
        var card = document.querySelector('[data-post-id="' + activePost.id + '"]');
        if (card) {
            var el = card.querySelector(".comment-count");
            if (el) el.textContent = String(activePost.comments.length);
        }
        save();
        renderComments(activePost);
    }

    document.getElementById("modalSubmit").addEventListener("click", submitComment);
    document.getElementById("modalInput").addEventListener("keydown", function (e) {
        if (e.key === "Enter") submitComment();
    });

    const profileBtn = document.getElementById("profileBtn");
    if (profileBtn) {
        profileBtn.addEventListener("click", () => {
            window.location.href = "profile.html";
        });
    }
//utilities to prevent xss errors
    function esc(str) {
        return String(str || "")
            .replace(/&/g, "&amp;").replace(/</g, "&lt;")
            .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

//initialzing posts
    renderPosts();

}); // end of DOM loading