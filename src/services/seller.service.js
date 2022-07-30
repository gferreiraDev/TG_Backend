const Seller = require('../models/seller');

exports.exists = async (email, cnpj) => {
  try {
    return await Seller.findOne({ $or: [{ email }, { cnpj }] });
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.create = async (data) => {
  try {
    return await Seller.create(data);
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.findById = async (userId) => {
  try {
    return await Seller.findById(userId);
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.findByEmail = async (email) => {
  try {
    return await Seller.findOne({ email }).select('+password');
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.findAll = async () => {
  try {
    return await Seller.find({});
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.update = async (userId, update) => {
  try {
    return await Seller.findByIdAndUpdate(userId, update, { new: true });
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.delete = async (userId) => {
  try {
    return await Seller.findByIdAndDelete(userId);
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.updateAddress = async (userId, update) => {
  try {
    return await Seller.findByIdAndUpdate(userId, { address: update }, {new: true});
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}