const Product = require('../models/product');

exports.exists = async (sellerId, eancode) => {
  try {
    return await Product.findOne({ sellerId, eancode });
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.add = async (sellerId, data) => {
  try {
    return await Product.create({ sellerId, ...data });
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.find = async (sellerId, search) => {
  try {
    if (!!search)
      return await Product.find({ sellerId, $or: [{ name: { $regex: `.*${search}.*`, $options: 'i' } }] });

    return await Product.find({ sellerId });
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.update = async (_id, update) => {
  try {
    return await Product.findByIdAndUpdate(_id, update, {new: true});
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.delete = async (_id) => {
  try {
    return await Product.findByIdAndDelete(_id);
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}