import mongoose from "mongoose";
import Gig from "./Models/gigschema.js"; // adjust path if needed

// 🔹 Your MongoDB Connection String
const MONGO_URI =
  "mongodb+srv://hamza:xFtIs8fWpYhrt5RM@freelancer.lni7ak9.mongodb.net/?appName=Freelancer"; // change if needed

// 🔹 Existing User IDs (Already in your DB)
const user1 = new mongoose.Types.ObjectId("699b8717a256db990de4fee6"); // Hamza Ahmed
const user2 = new mongoose.Types.ObjectId("699b8921a256db990de4fef7"); // helloHamza

const seedGigs = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");

    // Optional: Clear old gigs
    await Gig.deleteMany({});
    console.log("Old gigs removed");

    const gigs = [
      {
        creator: user1,
        creatorProfilePic:
          "https://res.cloudinary.com/dkr5ewnfu/image/upload/v1771186528/whatsapp",
        creatorName: "Hamza Ahmed",

        title: "I will design a modern responsive website",
        description:
          "Professional responsive website using React and Node.js with clean UI and fast performance.",

        category: "Web Development",
        subcategory: "Frontend Development",

        packages: {
          basic: {
            title: "Basic Website",
            price: 50,
            description: "1 page responsive website",
            deliveryTime: 3,
            revisions: 1,
          },
          standard: {
            title: "Standard Website",
            price: 120,
            description: "Up to 5 pages website",
            deliveryTime: 5,
            revisions: 3,
          },
          premium: {
            title: "Premium Website",
            price: 250,
            description: "Full stack website with backend",
            deliveryTime: 7,
            revisions: 5,
          },
        },

        images: ["https://via.placeholder.com/600x400"],
        tags: ["react", "nodejs", "website"],
        totalOrders: 3,
        rating: 4.5,
        numReviews: 2,
      },

      {
        creator: user2,
        creatorProfilePic:
          "https://res.cloudinary.com/dkr5ewnfu/image/upload/v1771186498/whatsapp",
        creatorName: "helloHamza",

        title: "I will edit professional YouTube videos",
        description:
          "High-quality YouTube video editing with subtitles, transitions, and engaging effects.",

        category: "Video Editing",
        subcategory: "YouTube Editing",

        packages: {
          basic: {
            title: "Basic Edit",
            price: 30,
            description: "5-minute edited video",
            deliveryTime: 2,
            revisions: 1,
          },
          standard: {
            title: "Advanced Edit",
            price: 70,
            description: "10-minute edited video with effects",
            deliveryTime: 4,
            revisions: 2,
          },
          premium: {
            title: "Premium Edit",
            price: 150,
            description: "15-minute cinematic edit",
            deliveryTime: 6,
            revisions: 4,
          },
        },

        images: ["https://via.placeholder.com/600x401"],
        tags: ["video editing", "youtube", "premiere pro"],
        totalOrders: 5,
        rating: 4.8,
        numReviews: 4,
      },

      {
        creator: user1,
        creatorProfilePic:
          "https://res.cloudinary.com/dkr5ewnfu/image/upload/v1771186528/whatsapp",
        creatorName: "Hamza Ahmed",

        title: "I will develop REST API with Node.js and Express",
        description:
          "Secure and scalable REST API development using Express, MongoDB, and JWT authentication.",

        category: "Backend Development",
        subcategory: "API Development",

        packages: {
          basic: {
            title: "Basic API",
            price: 80,
            description: "3 endpoints API",
            deliveryTime: 3,
            revisions: 1,
          },
          standard: {
            title: "Standard API",
            price: 180,
            description: "10 endpoints with auth",
            deliveryTime: 6,
            revisions: 3,
          },
          premium: {
            title: "Enterprise API",
            price: 350,
            description: "Full backend system",
            deliveryTime: 10,
            revisions: 5,
          },
        },

        images: ["https://via.placeholder.com/600x402"],
        tags: ["nodejs", "express", "mongodb"],
        totalOrders: 1,
        rating: 5,
        numReviews: 1,
      },
    ];

    await Gig.insertMany(gigs);
    console.log("Dummy gigs inserted successfully!");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedGigs();
