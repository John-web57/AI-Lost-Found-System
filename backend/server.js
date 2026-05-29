const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const chatRoutes = require("./routes/chat");
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);

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
app.use("/api/chat", chatRoutes);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("sendMessage", async ({ username, text }) => {
    try {
      const message = await Message.create({
        username: username?.trim() || "Anonymous",
        text: text?.trim(),
      });
      io.emit("newMessage", message);
    } catch (err) {
      console.error("Error saving chat message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
