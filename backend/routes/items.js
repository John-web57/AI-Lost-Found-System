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

const tokenizeText = (text = "") => {
  return text
    .toLowerCase()
    .match(/\b[a-z0-9]+\b/g)
    ?.filter((word) => word.length > 1) || [];
};

const similarityScore = (left, right) => {
  const leftWords = new Set(tokenizeText(left));
  const rightWords = new Set(tokenizeText(right));
  const intersection = [...leftWords].filter((word) => rightWords.has(word));
  const union = new Set([...leftWords, ...rightWords]);
  if (!union.size) return 0;
  return intersection.length / union.size;
};

const buildMatchSuggestions = (items) => {
  const allItems = items.map((item) => item.toObject());
  const lostItems = allItems.filter((item) => item.status === "lost");
  const foundItems = allItems.filter((item) => item.status === "found");

  const textForItem = (item) => `${item.title} ${item.description} ${item.location}`;

  const buildMatches = (sourceItems, targetItems) => {
    return sourceItems.map((item) => {
      const suggestions = targetItems
        .map((other) => ({
          ...other,
          score: similarityScore(textForItem(item), textForItem(other)),
        }))
        .filter((match) => match.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((match) => ({
          _id: match._id,
          title: match.title,
          location: match.location,
          status: match.status,
          score: Number(match.score.toFixed(2)),
        }));

      return { ...item, matchSuggestions: suggestions };
    });
  };

  const matchedLost = buildMatches(lostItems, foundItems);
  const matchedFound = buildMatches(foundItems, lostItems);

  return [...matchedLost, ...matchedFound].sort((a, b) => new Date(b.date) - new Date(a.date));
};

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
  if (req.query.matches === "true") {
    return res.json(buildMatchSuggestions(items));
  }
  res.json(items);
});

module.exports = router;
