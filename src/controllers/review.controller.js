const reviewService = require('../services/review.service');

exports.postReview = (req, res) => {
  try {
    if (!req.body || !res.secret)
      return res.status(400).send({ error: true, message: 'Dados inválidos' });

    if (res.secret.profile === 'Vendedor')
      return res.status(400).send({ error: true, message: 'Não autorizado' });

    return reviewService.create(req.body).then(result => {
      return res.status(201).send(result);
    });
  } catch (e) {
    return res.status(e.status).send({ error: true, message: e.message });
  }
}

exports.listReviews = (req, res) => {
  try {
    return reviewService.listReviews(req.body.sellerId).then(result => {
      return res.status(200).send(result);
    });
  } catch (e) {
    return res.status(e.status).send({ error: true, message: e.message });
  }
}

exports.updateReview = (req, res) => {
  try {
    if (!res.secret._id || !req.body.data)
      return res.status(400).send({ error: true, message: 'Dados inválidos' });

    if (res.secret.profile === 'Vendedor')
      return res.status(500).send({ error: true, message: 'Não Autorizado' });
      
    return reviewService.updateReview(req.body._id, req.body).then(result => {
      return res.status(200).send(result);
    });
  } catch (e) {
    return res.status(e.status).send({ error: true, message: e.message });
  }
}

exports.deleteReview = (req, res) => {
  try {
    if (!req.body.reviewId)
      return res.status(400).send({ error: true, message: 'Dados inválidos' });
    
    return reviewService.deleteReview(req.body.reviewId).then(result => {
      return res.status(200).send(result);
    });
  } catch (e) {
    return res.status(e.status).send({ error: true, message: e.message });
  }
}