const orderService = require('../services/order.service');

exports.placeOrder = (req, res) => {
  try {
    if (!req.body || !res.secret)
      return res.status(400).send({ error: true, message: 'Dados inválidos' });

    if (res.secret.profile === 'Vendedor')
      return res.status(400).send({ error: true, message: 'Não autorizado' });

    return orderService.create(req.body).then(result => {
      return res.status(201).send(result);
    });
  } catch (e) {
    return res.status(e.status).send({ error: true, message: e.message });
  }
}

exports.listOrders = (req, res) => {
  try {
    return orderService.findByUser(res.secret._id).then(result => {
      return res.status(200).send(result);
    });
  } catch (e) {
    return res.status(e.status).send({ error: true, message: e.message });
  }
}

exports.findOrder = (req, res) => {
  try {
    if (!req.params.orderId)
      return res.status(400).send({ error: true, message: 'Dados inválidos' });
      
    return orderService.findById(req.params.orderId).then(result => {
      return res.status(200).send(result);
    });
  } catch (e) {
    return res.status(e.status).send({ error: true, message: e.message });
  }
}

exports.updateOrder = (req, res) => {
  try {
    if (!req.body.orderId || !req.body.data)
      return res.status(400).send({ error: true, message: 'Dados inválidos' });
    
    return orderService.update(req.body.orderId, req.body.data).then(result => {
      return res.status(200).send(result);
    });
  } catch (e) {
    return res.status(e.status).send({ error: true, message: e.message });
  }
}
