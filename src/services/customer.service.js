const Customer = require('../models/customer');

exports.exists = async (email, cpf) => {
  try {
    return await Customer.findOne({ $or: [{ email }, { cpf }] });
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.create = async (data) => {
  try {
    const user = await Customer.create(data);
    user.password = undefined;
    return user;
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.findById = async (userId) => {
  try {
    return await Customer.findById(userId);
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.findByEmail = async (email) => {
  try {
    return await Customer.findOne({ email }).select('+password');
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.update = async (userId, update) => {
  try {
    return await Customer.findByIdAndUpdate(userId, update, { new: true });
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.delete = async (userId) => {
  try {
    return await Customer.findByIdAndDelete(userId);
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.addAddress = async (userId, address) => {
  try {
    return await Customer.findByIdAndUpdate(userId, {$push: {address: address}}, { new: true });
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.updateAddress = async (userId, address) => {
  try {
    return await Customer.findOneAndUpdate({ _id: userId, 'address._id': address._id }, {$set: {'address.$': address}}, {new: true});
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.deleteAddress = async(userId, addressId) => {
  try {
    return await Customer.findByIdAndUpdate(userId, {$pull: {'address': {'_id': addressId}}}, {new:true});
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}