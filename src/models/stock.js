const mongoose = require('../db');

const avatar = 'https://cdn1.iconfinder.com/data/icons/unigrid-finance-vol-2/61/014_barcode_price_tag_finance_product_info_details-256.png';

const Product = new mongoose.Schema({
  category: { type: String, require: true },
  productName: { type: String, require: true },
  description: { type: String, require: true },
  trade: { type: String, require: true },
  barcode: { type: String, require: true },
  measureUnit: { type: String, require: true },
  packageDescription: { type: String, require: true },
  image: { type: String, default: avatar },
  volume: {},
  perishable: { type: Boolean, require: true },
  photos: [],
  info: {},
  minStock: { type: Number, require: true },
  currentStock: { type: Number, require: true },
  price: { type: Number, require: true },
  promotion: {
    active: { type: Boolean, default: false },
    price: { type: Number, default: 0.0 }
  },
  createdAt: { type: Date, default: Date.now() }
}, { _id: true });


const Stock = new mongoose.Schema({
  sellerId: { type: mongoose.Types.ObjectId, ref: 'Seller', require: true },
  products: [Product]
});

module.exports = mongoose.model('Stock', Stock);