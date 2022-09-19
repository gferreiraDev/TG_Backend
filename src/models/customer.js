const mongoose = require('../db');
const bcrypt = require('bcryptjs');
const avatar = 'https://media.istockphoto.com/photos/deep-learning-artificial-intelligence-background-picture-id1310293181?s=612x612';


const Address = new mongoose.Schema({
  title: { type: String, default: 'Novo Endereço' },
  streetName: { type: String, require: true },
  number: { type: String, require: true },
  complement: { type: String, default: '-' },
  district: { type: String, require: true },
  city: { type: String, require: true },
  state: { type: String, require: true },
  zipcode: { type: String, require: true },
  position: {}
}, { _id: true });

const Customer = new mongoose.Schema({
  profile: { type: String, require: true },
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  cpf: { type: String, require: true, unique: true },
  avatar: { type: String, default: avatar },
  phone: { type: String, require: true },
  address: [Address],
  password: { type: String, require: true, select: false },
  createdAt: { type: Date, default: Date.now() }
});

Customer.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

Customer.pre('updateOne', async function(next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('Customer', Customer);