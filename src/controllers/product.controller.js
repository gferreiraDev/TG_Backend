const productService = require('../services/product.service');

exports.registerProduct = (req, res) => {
  try {
    if (!req.body || !res.secret)
      return res.status(400).send({ error: true, message: 'Dados inválidos' });

    if (res.secret.profile === 'Consumidor')
      return res.status(400).send({ error: true, message: 'Não autorizado' });

    return productService.exists(res.secret._id, req.body.eancode).then(exists => {
      if (exists)
        return res.status(400).send({ error: true, message: 'Produto já cadastrado' });

      return productService.add(res.secret._id, req.body).then(result => {
        return res.status(201).send(result);
      });
    })
  } catch (e) {
    return res.status(e.status).send({ error: true, message: e.message });
  }
}

exports.listProducts = (req, res) => {
  try {
    const {seller, search} = req.body;
    console.log('seller', seller, 'search', search);

    if (!seller)
      return res.status(400).send({ error: true, message: 'Vendedor não identificado'});
    
    return productService.find(seller, search)
    .then(result => {
      console.log('Search result', result);
      return res.status(200).send(result);  
    })

  } catch (e) {
    return res.status(e.status).send({ error: true, message: e.message });
  }
}

exports.updateProduct = (req, res) => {
  try {
    return productService.update(req.body._id, req.body).then(result => {
      return res.status(200).send(result);
    });
  } catch (e) {
    return res.status(e.status).send({ error: true, message: e.message });
  }
}

exports.removeProduct = (req, res) => {
  try {
    return productService.delete(req.params.productId).then(result => {
      return res.status(200).send(result);
    });
  } catch (e) {
    return res.status(e.status).send({ error: true, message: e.message });
  }
}