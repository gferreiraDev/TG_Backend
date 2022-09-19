const mongoose = require('../db');
const bcrypt = require('bcryptjs');

const avatar = 'https://media.istockphoto.com/photos/grocery-shopping-picture-id1194709125?s=612x612';

const Seller = new mongoose.Schema({
  profile: { type: String, require: true },
  corporateName: { type: String, require: true },
  tradingName: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  avatar: { type: String, default: avatar },
  cnpj: { type: String, require: true, unique: true },
  phone: { type: String, require: true },
  website: { type: String, default: ''},
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
  openingHours: {
    mon: { label: { type: String, default: 'Seg' }, from: { type: String, default: '00h00' }, to: { type: String, default: '00h00' } },
    tue: { label: { type: String, default: 'Ter' }, from: { type: String, default: '00h00' }, to: { type: String, default: '00h00' } },
    wed: { label: { type: String, default: 'Qua' }, from: { type: String, default: '00h00' }, to: { type: String, default: '00h00' } },
    thu: { label: { type: String, default: 'Qui' }, from: { type: String, default: '00h00' }, to: { type: String, default: '00h00' } },
    fri: { label: { type: String, default: 'Sex' }, from: { type: String, default: '00h00' }, to: { type: String, default: '00h00' } },
    sat: { label: { type: String, default: 'Sáb' }, from: { type: String, default: '00h00' }, to: { type: String, default: '00h00' } },
    sun: { label: { type: String, default: 'Dom' }, from: { type: String, default: '00h00' }, to: { type: String, default: '00h00' } },
  },
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