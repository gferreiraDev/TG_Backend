const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authenticate = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization)
    return res.status(401).send({ error: true, message: 'Token não informado' });

  const [scheme, token] = authorization.split(' ');
  if (!/^Bearer/i.test(scheme) || !token)
    return res.status(401).send({ error: true, message: 'Token inválido' });

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err)
      return res.status(401).send({ error: true, message: 'Token inválido' });
    
    res.secret = decoded;
    next();
  });
}