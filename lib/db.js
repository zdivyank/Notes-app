import mongoose from "mongoose";

export async function ConnectDB() {
   try {
      // await mongoose.connect("mongodb://127.0.0.1:27017/note-app");
      await mongoose.connect(process.env.MONGODB_URL);
      console.log("MongoDB connected successfully");
   } catch (error) {
      throw new Error(error)
   }
}