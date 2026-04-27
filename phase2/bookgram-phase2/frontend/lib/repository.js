import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export class Repository {

   //users

    // used in login 
    async getUserByEmail(email) {
        return await prisma.user.findUnique({
            where: { email }
        });
    }

    // used in profile page without password bcz password is not sent to frontend
    async getUserById(id) {
        return await prisma.user.findUnique({
            where: { id },
            select: {
                id:           true,
                username:     true,   
                fullName:     true,   
                email:        true,
                bio:          true,
                profileImage: true,  
                createdAt:    true,
                _count: {
                    select: {
                        posts:     true,
                        followers: true,
                        following: true
                    }
                }
            }
        });
    }

    
    async createUser(email, username, password, fullName) {
        return await prisma.user.create({
            data: { email, username, password, fullName }
        });
    }

    // used in edit profile
    async updateUser(id, data) {
        return await prisma.user.update({
            where: { id },
            data: {
                fullName:     data.fullName,
                bio:          data.bio,
                profileImage: data.profileImage
            }
        });
    }

   //posts

    // used in feed with newest posts first
    async getAllPosts() {
        return await prisma.post.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: {                          
                    select: {
                        id:           true,
                        username:     true,
                        profileImage: true
                    }
                },
                likes:    true,
                comments: true
            }
        });
    }

    // used in detailed post modal, includes comments with commenter's name
    async getPostById(id) {
        return await prisma.post.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id:           true,
                        username:     true,
                        profileImage: true
                    }
                },
                likes: true,
                comments: {
                    orderBy: { createdAt: "asc" },
                    include: {
                        user: { select: { id: true, username: true } }  
                    }
                }
            }
        });
    }

    // used in profile page displays only loggedin user's posts
    async getPostsByUser(userId) {
        return await prisma.post.findMany({
            where:   { userId },                
            orderBy: { createdAt: "desc" },
            include: {
                likes:    true,
                comments: true
            }
        });
    }

    async createPost(userId, content, imageUrl) {
        return await prisma.post.create({
            data: { userId, content, imageUrl }  
        });
    }

    // used when deleting a post — only owner can do this
    async deletePost(id) {
        return await prisma.post.delete({
            where: { id }
        });
    }

  //likes

    async likePost(userId, postId) {
        return await prisma.like.create({
            data: { userId, postId }
        });
    }

    async unlikePost(userId, postId) {
        return await prisma.like.deleteMany({
            where: { userId, postId }
        });
    }

    
    async getLikeCount(postId) {
        return await prisma.like.count({
            where: { postId }
        });
    }

    // returns true/false, used to show filled/empty heart button
    async hasUserLiked(userId, postId) {
        const like = await prisma.like.findFirst({
            where: { userId, postId }
        });
        return like !== null;
    }

//comments

    async getCommentsByPost(postId) {
        return await prisma.comment.findMany({
            where:   { postId },
            orderBy: { createdAt: "asc" },
            include: {
                user: { select: { id: true, username: true } } 
            }
        });
    }

   
    async addComment(userId, postId, content) {
        return await prisma.comment.create({
            data: { userId, postId, content }
        });
    }

    async deleteComment(id) {
        return await prisma.comment.delete({
            where: { id }
        });
    }

   //follows

    async followUser(followerId, followingId) {
        return await prisma.follow.create({
            data: { followerId, followingId }
        });
    }

    async unfollowUser(followerId, followingId) {
        return await prisma.follow.deleteMany({
            where: { followerId, followingId }  
        });
    }

  
    async isFollowing(followerId, followingId) {
        const follow = await prisma.follow.findFirst({
            where: { followerId, followingId }
        });
        return follow !== null;
    }

    async getFollowers(userId) {
        return await prisma.follow.findMany({
            where:   { followingId: userId },
            include: {
                follower: {
                    select: { id: true, username: true, profileImage: true }
                }
            }
        });
    }

    async getFollowing(userId) {
        return await prisma.follow.findMany({
            where:   { followerId: userId },
            include: {
                following: {
                    select: { id: true, username: true, profileImage: true }
                }
            }
        });
    }


    async getFollowerCount(userId) {
        return await prisma.follow.count({
            where: { followingId: userId }
        });
    }

    
    async getFollowingCount(userId) {
        return await prisma.follow.count({
            where: { followerId: userId }
        });
    }



    // statistics

    async mostLikedPost() {
        return await prisma.post.findFirst({
            orderBy: {likes: {_count: 'desc'}}, include: {
                user : { select: { username: true } },
                _count: {select: {likes: true}}
            }
        })
    }

    async mostFollowers(){
        return await prisma.user.findFirst({
            orderBy: { followers: { _count: 'desc' } },
        select: {
            username: true,
            fullName: true,
            _count:   { select: { followers: true } }
        }
        })
    }

    async mostComments(){
        return await prisma.post.findFirst({
        orderBy: { comments: { _count: 'desc' } },
         include: {
            user:   { select: { username: true } },
            _count: { select: { comments: true } }
        }
        })
    }

    async mostActiveUser() { //based on most number of recent posts
    return await prisma.user.findFirst({
        orderBy: { posts: { _count: 'desc' } },
        select: {
            username: true,
            fullName: true,
            _count:   { select: { posts: true } }
        }
    })
}

    async getTotals(){
         const [users, posts, likes, comments] = await Promise.all([
        prisma.user.count(),
        prisma.post.count(),
        prisma.like.count(),
        prisma.comment.count()
    ])
    return { users, posts, likes, comments }
    }

    async avgLikesPerPost() {
    const result = await prisma.like.groupBy({
        by:     ['postId'],
        _count: { postId: true }
    })
    if (result.length === 0) return 0
    const total = result.reduce((sum, r) => sum + r._count.postId, 0)
    return (total / result.length).toFixed(1)
}

}

