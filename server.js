const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const index = require('./routes/index');
const users = require('./routes/users');

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;
const MLAB_HOST = process.env.MLAB_HOST;
const MLAB_PORT = process.env.MLAB_PORT;
const DB_URL = `mongodb://${ADMIN_USER}:${ADMIN_PASS}@${MLAB_HOST}:${MLAB_PORT}/vision`;

const PORT = process.env.PORT || 3000;

// Initialize http server
const app = express();
app.use(bodyParser.json());

// routes
app.use('/', index);
app.use('/users', users);

connect()
  .on('error', console.log)
  .on('disconnected', connect)
  .once('open', listen);

function listen() {
  app.listen(PORT, function() {
    console.log(`Node app is running on port ${PORT}`);
  });
}

function connect() {
  const options = { useNewUrlParser: true };
  mongoose.connect(DB_URL, options);
  return mongoose.connection;
}
