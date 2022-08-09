const mongoose = require('../db');

const Review = new mongoose.Schema({
  rater: { type: mongoose.Types.ObjectId, ref: 'Customer', required: true },
  rated: { type: mongoose.Types.ObjectId, ref: 'Seller', required: true },
  rate: { type: String, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('Review', Review);