import mongoose from "mongoose";

export async function ConnectDB() {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL is not defined in .env");
    }

    await mongoose.connect(process.env.MONGODB_URL);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}