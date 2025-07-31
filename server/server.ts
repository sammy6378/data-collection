import app from "./app";
import { connectDb } from "./utils/db";
import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with environment variables
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// Set the port from environment variable or default to 8000 (matches your .env)
const port = process.env.PORT || 8000;

app.listen(port, async () => {
  console.log(`Server running on PORT:${port}`);
  try {
    // Pass MONGODB_URI explicitly to connectDb (optional, depending on your utils/db.ts)
    await connectDb();
    console.log("Database connection established");
  } catch (error) {
    console.error("Server startup failed due to DB error:", error);
    process.exit(1); // Exit if DB fails
  }
});

