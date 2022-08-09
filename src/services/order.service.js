const Order = require('../models/order');


exports.create = async (data) => {
  try {
    return await Order.create(data);
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.findById = async (orderId) => {
  try {
    return await Order.findById(orderId);
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.findByUser = async (user) => {
  try {
    return await Order.find({$or: [{customer: user}, {seller: user}]});
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.update = async (orderId, update) => {
  try {
    return await Order.findByIdAndUpdate(orderId, update, { new: true });
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}