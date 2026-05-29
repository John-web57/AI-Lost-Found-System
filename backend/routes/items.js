const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const multer = require("multer");

// 🔹 Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// 🔹 CREATE ITEM WITH IMAGE
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, location, status } = req.body;

    const newItem = new Item({
      title,
      description,
      location,
      status: status === "found" ? "found" : "lost",
      image: req.file ? req.file.filename : null,
    });

    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 GET ITEMS
router.get("/", async (req, res) => {
  const items = await Item.find().sort({ date: -1 });
  res.json(items);
});

module.exports = router;
