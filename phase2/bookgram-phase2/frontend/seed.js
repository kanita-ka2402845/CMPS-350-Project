import { PrismaClient } from "@prisma/client"
import "dotenv/config"

const prisma = new PrismaClient()

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
    //clean database
    await prisma.follow.deleteMany();
    await prisma.like.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    //users
      const usersData = [
        { username: "kanita", email: "kanita@gmail.com", fullName: "Kanita Ansari" },
        { username: "maha", email: "maha@gmail.com", fullName: "Maha Khadkhodaei" },
        { username: "humdia", email: "humdia@gmail.com", fullName: "Humdia Ashraf" },
        { username: "fatima", email: "fatima@gmail.com", fullName: "Fatima Alshamaa" },
        { username: "sara", email: "sara@gmail.com", fullName: "Sara Khan" },
        { username: "zainab", email: "zainab@gmail.com", fullName: "Zainab Mahmood" },
        { username: "saad", email: "saad@gmail.com", fullName: "Saad Ansari" },
        { username: "ayisha", email: "ayisha@gmail.com", fullName: "Ayisha Hussein" },
        { username: "hajra", email: "hajra@gmail.com", fullName: "Hajra Ghani" },
        { username: "ali", email: "ali@gmail.com", fullName: "Ali Fazal" }
    ];

     const users = [];
     const usersMap = {};

     for (let u of usersData) {
    const user = await prisma.user.create({
        data: { ...u, password: "Test@123", bio: "just living life ✨" }
    });
    usersMap[u.username] = user;
    users.push(user);
    }


//     const activeUsers = users.slice(0, 3); // top 3 users

// const randomUser = Math.random() < 0.6
//     ? getRandom(activeUsers)
//     : getRandom(users);

    const captions = [
        "golden hour never disappoints 🌅",
        "this felt like a movie scene",
        "caught between chaos and calm",
        "small moments, big feelings",
        "lost in the right direction",
        "a page from today’s story",
        "somewhere between here and nowhere",
        "this view healed something in me",
        "quiet, but not empty",
        "just me and my thoughts",
        "soft skies and softer thoughts",
        "paused time for a second",
        "this deserved a photo",
        "no filter, just vibes",
        "felt like keeping this forever"
    ];

    const commentTexts = [
        "this is actually beautiful",
        "the lighting here?? insane",
        "ok this is a whole aesthetic",
        "you always capture moments so well",
        "this made me pause for a second",
        "where is this??",
        "i love the vibe of this",
        "this feels so peaceful",
        "main character energy",
        "not you posting masterpieces casually",
        "this one hits different",
        "i can feel this photo",
        "this belongs in a gallery",
        "so simple but so good",
        "you ate this"
    ];

    //posts
    const posts = [];

    for (let user of users) {
        for (let i = 0; i < 3; i++) {
            const post = await prisma.post.create({
                data: {
                    content: getRandom(captions),
                    imageUrl: `https://picsum.photos/seed/${user.username}-${i}/500/600`, //random photo generator
                    userId: user.id
                }
            });
            posts.push(post);
        }
    }

    //dummy posts from project phase 1
const kanita = usersMap["kanita"];
const maha   = usersMap["maha"];
const humdia = usersMap["humdia"];
const fatima = usersMap["fatima"];

    const p1 = await prisma.post.create({
        data: {
            content: "A quiet morning with coffee ☕",
            imageUrl: "post1.jpg",
            userId: kanita.id
        }
    });

    const p2 = await prisma.post.create({
        data: {
            content: "Green everywhere 🌿",
            imageUrl: "post2.jpg",
            userId: maha.id
        }
    });

    const p3 = await prisma.post.create({
        data: {
            content: "peace.",
            imageUrl: "post3.jpg",
            userId: humdia.id
        }
    });

    const p4 = await prisma.post.create({
        data: {
            content: "sunset hits different 🌅",
            imageUrl: "post4.jpg",
            userId: fatima.id
        }
    });

    posts.push(p1, p2, p3, p4);

    //comments
    for (let post of posts) {
        const numComments = Math.floor(Math.random() * 5); 

        for (let i = 0; i < numComments; i++) {
            const randomUser = getRandom(users);

            await prisma.comment.create({
                data: {
                    content: getRandom(commentTexts),
                    userId: randomUser.id,
                    postId: post.id
                }
            });
        }
    }

    //likes
    for (let post of posts) {
        const numLikes = Math.floor(Math.random() * (users.length / 2)) + 1;

        const shuffled = [...users].sort(() => 0.5 - Math.random());

        for (let i = 0; i < numLikes; i++) {
            await prisma.like.create({
                data: {
                    userId: shuffled[i].id,
                    postId: post.id
                }
            }).catch(() => {});
        }
    }

  //follows
    for (let user of users) {
        const others = users.filter(u => u.id !== user.id);

        const numFollows = Math.floor(Math.random() * 4);

        const shuffled = [...others].sort(() => 0.5 - Math.random());

        for (let i = 0; i < numFollows; i++) {
            await prisma.follow.create({
                data: {
                    followerId: user.id,
                    followingId: shuffled[i].id
                }
            }).catch(() => {});
        }
    }

    console.log("Database seeded successfully");
}


main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

