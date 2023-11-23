import mongoose from "mongoose";

export const connectDB = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(
        process.env.MONGO_URI || "" // Timeout after 5s instead of 30s
      )
      .then(() => {
        console.log("MongoDB connected...");
        resolve(true);
      })
      .catch((err) => {
        console.error(`Error connecting to MongoDB: ${err}`);
        reject(err);
      });
  });
};

