const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  location: String,
  status: { type: String, enum: ["lost", "found"], default: "lost" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Item", ItemSchema);
