const stockService = require('../services/stock.service');

exports.addToStock = (req, res) => {
  try {
    if (!req.body || !res.secret)
      return res.status(400).send({ error: true, message: 'Dados inválidos' });

    if (res.secret.profile === 'Consumidor')
      return res.status(400).send({ error: true, message: 'Não autorizado' });

    return stockService.addProduct(res.secret._id, req.body).then(result => {
      return res.status(201).send(result);
    });

  } catch (e) {
    return res.status(e.status).send({ error: true, message: e.message });
  }
}

exports.listProducts = (req, res) => {
  try {
    const {store, query} = req.body;
    console.log('store', store, 'query', query);

    if (!store)
      return res.status(400).send({ error: true, message: 'Vendedor não identificado'});
    
    if (query !== '' && query !== undefined && query !== null) {
      return stockService.listBySearch(store, query)
      .then(result => {
        // console.log('Search result', result);
        return res.status(200).send(result);  
      })
    }

    return stockService.listProducts(store).then(result => {
      // console.log(result)
      return res.status(200).send(result);
    });
  } catch (e) {
    return res.status(e.status).send({ error: true, message: e.message });
  }
}

exports.updateProduct = (req, res) => {
  try {
    return stockService.update(req.body.seller, req.body).then(result => {
      return res.status(200).send(result);
    });
  } catch (e) {
    return res.status(e.status).send({ error: true, message: e.message });
  }
}

exports.removeProduct = (req, res) => {
  try {
    return stockService.removeItem(req.body.stockId, req.params.productId).then(result => {
      return res.status(200).send(result);
    });
  } catch (e) {
    return res.status(e.status).send({ error: true, message: e.message });
  }
}

exports.deleteStock = (req, res) => {
  try {
    return stockService.deleteStock(req.body.stockId).then(result => {
      return res.status(200).send(result);
    });
  } catch (e) {
    return res.status(e.status).send({ error: true, message: e.message });
  }
}

// exports.searchProducts = (req, res) => {
//   try {
//     return stockService.listProducts(req.body).then(result => {
//       console.log(result)
//       return res.status(200).send(result);
//     });
//   } catch (e) {
//     return res.status(e.status).send({ error: true, message: e.message });
//   }
// }