const mongoose = require('../db');

const avatar = 'https://cdn1.iconfinder.com/data/icons/unigrid-finance-vol-2/61/014_barcode_price_tag_finance_product_info_details-256.png';

const Product = new mongoose.Schema({
  category: { type: String, require: true },
  name: { type: String, require: true },
  brand: { type: String, require: true },
  eancode: { type: String, require: true },
  measureUnit: { type: String, require: true },
  image: { type: String, default: avatar },
  volume: {},
  perishable: { type: Boolean, require: true },
  photos: [],
  info: {},
  minStock: { type: Number || String, require: true },
  currentStock: { type: Number || String, require: true },
  price: { type: Number || String, require: true },
  sellerId: { type: mongoose.Types.ObjectId, ref: 'Seller', require: true },
  createdAt: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Product', Product);