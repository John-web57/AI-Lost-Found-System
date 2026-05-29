const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ date: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
