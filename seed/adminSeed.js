import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();

const seedAdmins = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI not set in .env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    let admins = [];
    if (process.env.ADMIN_USERS_JSON) {
      try {
        admins = JSON.parse(process.env.ADMIN_USERS_JSON);
      } catch (err) {
        console.error("ADMIN_USERS_JSON is not valid JSON");
        process.exit(1);
      }
    } else {
      const tmp = [];
      for (let i = 1; i <= 5; i++) {
        const email = process.env[`ADMIN${i}_EMAIL`];
        const pass = process.env[`ADMIN${i}_PASS`];
        const name = process.env[`ADMIN${i}_NAME`] || `admin${i}`;
        if (email && pass) tmp.push({ name, email, password: pass });
      }
      admins = tmp;
    }

    if (!admins || admins.length === 0) {
      console.log("No admin data found in env. Exiting.");
      process.exit(0);
    }

    for (const admin of admins) {
      const existing = await User.findOne({ email: admin.email });
      if (existing) {
        console.log(`Admin already exists: ${admin.email}`);
        continue;
      }
      const hashed = await bcrypt.hash(admin.password, 10);
      const userDoc = {
        name: admin.name || admin.fullName || "Admin",
        email: admin.email,
        password: hashed,
        role: "admin",
        createdAt: admin.createdAt ? new Date(admin.createdAt) : new Date(),
      };
      await User.create(userDoc);
      console.log(`Added admin: ${admin.email}`);
    }

    console.log("Admin seeding completed");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admins:", error);
    process.exit(1);
  }
};

seedAdmins();
