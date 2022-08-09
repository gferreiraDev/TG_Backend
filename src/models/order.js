const mongoose = require('../db');

const Order = new mongoose.Schema({
  customer: { type: mongoose.Types.ObjectId, ref: 'Customer', require: true },
  seller: { type: mongoose.Types.ObjectId, ref: 'Seller', require: true },
  orderNumber: { type: String, require: true },
  orderType: { type: String, require: true },
  items: [{
    productId: { type: mongoose.Types.ObjectId, ref: 'Stock.products._id', require: true },
    currentPrice: { type: Number, require: true },
    quantity: { type: Number, default: 1, require: true }
  }],
  origin: {},
  destination: {},
  volume: {},
  status: { type: String, require: true },
  createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('Order', Order);