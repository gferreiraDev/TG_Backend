const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
require('dotenv').config();

const customerService = require('../services/customer.service');
const sellerService = require('../services/seller.service');
const stockService = require('../services/stock.service');

const generateToken = (params = {}) => {
  return jwt.sign(params, process.env.SECRET, { expiresIn: 84600 });
}

exports.register = (req, res) => {
  try {
    console.log(req.body);
    if (!req.body || !req.body.profile)
      return res.status(400).send({ error: true, message: 'Dados inválidos' });

    if (req.body.profile === 'Consumidor') {
      return customerService.exists(req.body.email, req.body.cpf).then(alreadyExists => {
        if (alreadyExists)
          return res.status(400).send({ error: true, message: 'Usuário já cadastrado' });
        
        return customerService.create(req.body).then(result => {
          return res.status(201).send(result);
        });
      });
    } else {
      return sellerService.exists(req.body.email, req.body.cnpj).then(alreadyExists => {
        if (alreadyExists)
          return res.status(400).send({ error: true, message: 'Usuário já cadastrado' });
        
        return sellerService.create(req.body).then(seller => {
          return stockService.createStock(seller._id).then(result => {
            return res.status(201).send(result);
          });
        });
      });
    }
  } catch (e) {
    return res.status(e.status).send({ error: true, message: e.message });
  }
}

exports.login = async (req, res) => {
  try {
    const {email, password} = req.body;

    if (!email || !password)
      return res.status(400).send({ error: true, message: 'Dados inválidos' });

    const customer = await customerService.findByEmail(email);
    const seller = await sellerService.findByEmail(email);

    if (!customer && !seller) {
      return res.status(400).send({ error: true, message: 'Usuário ou senha inválidos' });
    }

    if (customer) {
      return bcrypt.compare(password, customer.password).then(result => {
        if (result) {
          customer.password = undefined;
          return res.status(200).send({
            user: customer,
            token: generateToken({ profile: customer.profile, _id: customer._id
          })
        })}

        return res.status(400).send({ error: true, message: 'Usuário ou senha inválidos' });
      });
    }

    if (seller) {
      return bcrypt.compare(password, seller.password).then(result => {
        if (result) {
          seller.password = undefined;
          return res.status(200).send({
            user: seller,
            token: generateToken({ profile: seller.profile, _id: seller._id
          })
        })}

        return res.status(400).send({ error: true, message: 'Usuário ou senha inválidos' });
      });
    }
    
  } catch (e) {
    return res.status(500).send({ error: true, message: e.message });
  }
}

exports.authenticate = (req, res) => {
  try {
    const {profile, _id} = res.secret;

    if (!profile || !_id)
      return res.status(401).send({ error: true, message: 'Não Autorizado' });

    if (profile === 'Consumidor') {
      return customerService.findById(_id).then(user => {
        return res.status(200).send(user);
      });
    } else {
      return sellerService.findById(_id).then(user => {
        return res.status(200).send(user);
      });
    }
    
  } catch (e) {
    return res.status(e.status).send({ error: true, message: e.message });
  }
}

exports.userUpdate = (req, res) => {
  try {
    const {profile, _id} = res.secret;
    const update = req.body;

    if (!profile || !_id)
      return res.status(401).send({ error: true, message: 'Não Autorizado' });
    
    if (!update)
      return res.status(400).send({ error: true, message: 'Dados inválidos' });

    if (profile === 'Consumidor') {
      return customerService.update(_id, update).then(result => {
        return res.status(200).send(result);
      });
    } else {
      return sellerService.update(_id, update).then(result => {
        console.log(result)
        return res.status(200).send(result);
      });
    }
    
  } catch (error) {
    return res.status(e.status).send({ error: true, message: e.message });
  }
}

exports.unregister = (req, res) => {
  try {
    const {profile, _id} = res.secret;

    if (!profile || !_id)
      return res.status(401).send({ error: true, message: 'Não autorizado' });

    if (profile === 'Consumidor') {
      return customerService.delete(_id).then(user => {
        return res.status(200).send(user);
      });
    } else {
      return sellerService.delete(_id).then(user => {
        return res.status(200).send(user);
      });
    }
    
  } catch (e) {
    return res.status(e.status).send({ error: true, message: e.message });
  }
}

exports.searchSellers = (req, res) => {
  try {
    const {profile, _id} = res.secret;

    if (!profile || !_id || profile === 'Vendedor')
      return res.status(401).send({ error: true, message: 'Não autorizado' });

    return sellerService.findAll().then(result => {
      return res.status(200).send(result);
    });
    
  } catch (e) {
    return res.status(e.status).send({ error: true, message: e.message });
  }
}

exports.includeAddress = (req, res) => {
  try {
    const {profile, _id} = res.secret;
    const {address} = req.body;

    if (!profile || !_id || profile === 'Vendedor')
      return res.status(401).send({ error: true, message: 'Não autorizado' });

    if (!address)
      return res.status(400).send({ error: true, message: 'Dados inválidos' });

    return customerService.addAddress(_id, address).then(result => {
      return res.status(201).send(result);
    });
    
  } catch (e) {
    return res.status(e.status).send({ error: true, message: e.message });
  }
}

exports.updateAddress = (req, res) => {
  try {
    const {profile, _id} = res.secret;
    const address = req.body;

    console.log(address)

    if (!profile || !_id)
      return res.status(401).send({ error: true, message: 'Não autorizado' });

    if (!address)
      return res.status(400).send({ error: true, message: 'Dados inválidos' });

    if (profile === 'Consumidor') {
      return customerService.updateAddress(_id, address).then(result => {
        return res.status(200).send(result);
      });
    } else {
      return sellerService.updateAddress(_id, address).then(result => {
        return res.status(200).send(result);
      });
    }

    
  } catch (e) {
    return res.status(e.status).send({ error: true, message: e.message });
  }
}

exports.removeAddress = (req, res) => {
  try {
    const {profile, _id} = res.secret;
    const {addressId} = req.params;

    if (!profile || !_id || profile === 'Vendedor')
      return res.status(401).send({ error: true, message: 'Não autorizado' });

    if (!addressId)
      return res.status(400).send({ error: true, message: 'Dados inválidos' });

    return customerService.deleteAddress(_id, addressId).then(result => {
      return res.status(201).send(result);
    });
    
  } catch (e) {
    return res.status(e.status).send({ error: true, message: e.message });
  }
}

exports.updateAvatar = (req, res) => {
  console.log('fileData:', req.file);
  console.log('auth', res.secret);

  fs.readFile(req.file.path, (err, contents) => {
    if (err) {
      console.log('Error:', err);
      return res.status(400).send({ error: true, message: err });
    }
    console.log('File contents', contents);
    return res.status(200).send(contents);
  })
}