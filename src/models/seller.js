const mongoose = require('../db');
const bcrypt = require('bcryptjs');

const avatar = 'https://media.istockphoto.com/photos/grocery-shopping-picture-id1194709125?s=612x612';

const OpeningHours = new mongoose.Schema({
  mon: { from: { type: String, default: '00h00' }, to: { type: String, default: '00h00' } },
  tue: { from: { type: String, default: '00h00' }, to: { type: String, default: '00h00' } },
  wed: { from: { type: String, default: '00h00' }, to: { type: String, default: '00h00' } },
  thu: { from: { type: String, default: '00h00' }, to: { type: String, default: '00h00' } },
  fri: { from: { type: String, default: '00h00' }, to: { type: String, default: '00h00' } },
  sat: { from: { type: String, default: '00h00' }, to: { type: String, default: '00h00' } },
  sun: { from: { type: String, default: '00h00' }, to: { type: String, default: '00h00' } },
})

const Seller = new mongoose.Schema({
  profile: { type: String, require: true },
  corporateName: { type: String, require: true },
  tradingName: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  avatar: { type: String, default: avatar },
  cnpj: { type: String, require: true, unique: true },
  phone: { type: String, require: true },
  address: {
    title: { type: String, require: true },
    streetName: { type: String, require: true },
    number: { type: String, require: true },
    complement: { type: String, default: '-' },
    district: { type: String, require: true },
    city: { type: String, require: true },
    state: { type: String, require: true },
    zipcode: { type: String, require: true },
    position: {}
  },
  openingHours: OpeningHours,
  score: { type: Number, default: 0.0 },
  password: { type: String, require: true, select: false },
  createdAt: { type: Date, default: Date.now() }
});

Seller.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

Seller.pre('updateOne', async function(next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('Seller', Seller);