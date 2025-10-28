const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes.js");
const certificateRoutes = require("./routes/certificates.js");

dotenv.config();
const app = express();

// Check for required environment variables
if (!process.env.JWT_SECRET) {
  console.error("Error: JWT_SECRET is not set in environment variables.");
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not set in environment variables.");
  process.exit(1);
}

app.use(cors("https://ecertificate-generator-frontend.onrender.com"));
// Increase body size to allow embedded images (data URLs) for logos/signatures/background
// Note: if you still hit 413, consider reducing image sizes or using cloud storage
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/certificates", certificateRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
