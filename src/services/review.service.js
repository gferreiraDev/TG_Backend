const Review = require('../models/review');

exports.create = async (data) => {
  try {
    return await Review.create(data);
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.listReviews = async(sellerId) => {
  try {
    return await Review.find({ rated: sellerId });
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.updateReview = async (reviewId, update) => {
  try {
    return await Review.findByIdAndUpdate(reviewId, update, {new: true});
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}

exports.deleteReview = async (reviewId) => {
  try {
    return await Review.findByIdAndDelete(reviewId);
  } catch (error) {
    // console.log(error);
    return new Error(error);
  }
}