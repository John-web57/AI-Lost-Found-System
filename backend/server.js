const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 👉 Serve uploaded images
app.use("/uploads", express.static("uploads"));

// MongoDB connection (use MONGO_URI env var if provided)
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lostfound";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const itemRoutes = require("./routes/items");
app.use("/api/items", itemRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
