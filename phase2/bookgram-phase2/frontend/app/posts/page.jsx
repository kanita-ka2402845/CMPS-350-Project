"use client";

import { useEffect, useState } from "react";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [followingUsers, setFollowingUsers] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  async function loadPosts() {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data.posts || data || []);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleCreatePost() {
    if (!newContent.trim()) return;

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: newContent,
        imageUrl: newImageUrl || null,
      }),
    });

    if (!res.ok) return;

    setNewContent("");
    setNewImageUrl("");
    setShowCreate(false);
    await loadPosts();
  }

  async function handleDeletePost(postId) {
    const res = await fetch("/api/post-delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId }),
    });

    if (!res.ok) return;

    await loadPosts();
  }

  async function handleLike(postId) {
const res = await fetch(`/api/posts/${postId}/likes`, {      method: "POST",
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      alert(data.error || "Like failed.");
      return;
    }
  
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;
  
        const likes = post.likes || [];
  
        if (data.liked) {
          return {
            ...post,
            likes: [...likes, { id: Date.now(), userId: 1, postId }],
          };
        }
  
        return {
          ...post,
          likes: likes.slice(0, Math.max(0, likes.length - 1)),
        };
      })
    );
  }

  async function handleAddComment(postId) {
    const text = commentText[postId];

    if (!text || !text.trim()) return;

    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: text }),
    });

    if (!res.ok) return;

    setCommentText((prev) => ({
      ...prev,
      [postId]: "",
    }));

    await loadPosts();
  }

  async function handleDeleteComment(commentId) {
    const res = await fetch(`/api/comments/${commentId}`, {
      method: "DELETE",
    });

    if (!res.ok) return;

    await loadPosts();
  }

  async function handleFollow(userId) {
    const res = await fetch(`/api/users/${userId}/follow`, {
      method: "POST",
    });

    if (!res.ok) return;

    const data = await res.json();

    setFollowingUsers((prev) => ({
      ...prev,
      [userId]: data.following,
    }));
  }

  return (
    <main className="min-h-screen bg-[#3d3528] p-6 text-[#1c1710]">
      <section className="mx-auto max-w-6xl bg-[#f5f0e8] p-6 shadow-2xl">
        <div className="mb-6 border-b border-[#d8cdbd] pb-4">
          <p className="text-xs uppercase tracking-widest text-[#8a7e6e]">
            Bookgram
          </p>

          <div className="flex items-center justify-between">
            <h1 className="text-4xl italic">Posts</h1>

            <button
              type="button"
              onClick={() => setShowCreate(!showCreate)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3d3528] text-3xl text-white shadow"
              title="Create post"
            >
              +
            </button>
          </div>
        </div>

        {showCreate && (
          <div className="mb-6 bg-white p-4 shadow">
            <h2 className="mb-3 text-2xl italic">Create New Post</h2>

            <textarea
              placeholder="What would you like to share?"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="min-h-24 w-full border border-[#d8cdbd] px-3 py-2 text-sm outline-none"
            />

            <input
              type="text"
              placeholder="Image URL or image name, for example post1.jpg"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="mt-3 w-full border border-[#d8cdbd] px-3 py-2 text-sm outline-none"
            />

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleCreatePost}
                className="rounded bg-[#3d3528] px-4 py-2 text-sm text-white"
              >
                Share Post
              </button>

              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded border border-[#3d3528] px-4 py-2 text-sm text-[#3d3528]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="bg-white p-4 shadow">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-sm text-[#8a7e6e]">
                    @{post.user?.username || "user"}
                  </p>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleFollow(post.user?.id)}
                      className="rounded border border-[#3d3528] px-3 py-1 text-xs text-[#3d3528]"
                    >
                      {followingUsers[post.user?.id] ? "Following" : "Follow"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeletePost(post.id)}
                      className="rounded border border-red-700 px-3 py-1 text-xs text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p className="mb-4">{post.content}</p>

                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    className="h-72 w-full object-cover"
                  />
                )}

                <div className="mt-3 flex items-center justify-between text-sm text-[#8a7e6e]">
                  <button
                    type="button"
                    onClick={() => handleLike(post.id)}
                    className="text-xl"
                  >
                    {(post.likes || []).some((like) => like.userId === 1) ? "❤️" : "🤍"}
                  </button>

                  <span>{post.likes?.length || 0} likes</span>
                  <span>{post.comments?.length || 0} comments</span>
                </div>

                <div className="mt-4 space-y-2">
                  {(post.comments || []).map((comment) => (
                    <div
                      key={comment.id}
                      className="flex items-center justify-between border-t border-[#d8cdbd] pt-2 text-sm"
                    >
                      <p>{comment.content}</p>

                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-xs text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText[post.id] || ""}
                    onChange={(e) =>
                      setCommentText((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    className="w-full border border-[#d8cdbd] px-3 py-2 text-sm outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => handleAddComment(post.id)}
                    className="rounded bg-[#3d3528] px-3 py-2 text-sm text-white"
                  >
                    Post
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}