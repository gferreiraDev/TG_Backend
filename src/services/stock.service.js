const Stock = require('../models/stock');

exports.exists = async (sellerId, productId) => {
  try {
    return await Stock.findOne({ sellerId, 'products._id': productId });
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.createStock = async (sellerId) => {
  try {
    return await Stock.create({ sellerId, products: [] });
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.addProduct = async (seller, data) => {
  try {
    console.log('Seller', seller, 'product', data);

    return await Stock.findOneAndUpdate({sellerId: seller}, {$push: {products: data}}, { new: true });
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.listProducts = async (sellerId) => {
  try {
    return await Stock.findOne({sellerId});
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.findProduct = async (stockId, productId) => {
  try {
    return await Stock.findOne({_id: stockId, 'products._id': productId});
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.listBySearch = async (sellerId, search) => {
  try {
    return await Stock.aggregate([
      { $match: { sellerId } },
      { $match: {
          "products.productName": {
            $regex: `.*${search}.*`,
            $options: "i"
          }
        }
      }
    ])

  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.update = async (sellerId, update) => {
  try {
    return await Stock.findOneAndUpdate({sellerId, 'products._id': update._id}, {$set: {'products.$': update}}, {new: true});
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.removeItem = async (stockId, productId) => {
  try {
    return await Stock.findByIdAndUpdate(stockId, {$pull: {'products': {'_id': productId}}}, {new:true});
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.deleteStock = async (stockId) => {
  try {
    return await Stock.findByIdAndDelete(stockId);
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}