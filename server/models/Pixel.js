const mongoose = require("mongoose");

const pixelSchema = new mongoose.Schema({
  x: {
    type: Number,
    required: true,
    index: true,
  },
  y: {
    type: Number,
    required: true,
    index: true,
  },
  color: {
    r: { type: Number, required: true },
    g: { type: Number, required: true },
    b: { type: Number, required: true },
    a: { type: Number, required: true },
  },
});

const Pixel = mongoose.model("Pixel", pixelSchema, "canvas");

module.exports = Pixel;
