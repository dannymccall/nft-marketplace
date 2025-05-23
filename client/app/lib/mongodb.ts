import mongoose from "mongoose";

const MONGO_URI = process.env.NEXT_PUBLIC_MONGODB_URI!;

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}
