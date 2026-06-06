require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const shortenRouter = require("./routes/shorten");
const redirectRouter = require("./routes/redirect");

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

// Routes
app.use("/api/shorten", shortenRouter);
app.use("/", redirectRouter); // Must be last — catches /:code

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
