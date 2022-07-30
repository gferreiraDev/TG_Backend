const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})
// .then(() => console.log('DB is UP'));

module.exports = mongoose;