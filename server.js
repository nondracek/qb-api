const cool = require('cool-ascii-faces');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user');

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;
const MLAB_HOST = process.env.MLAB_HOST;
const MLAB_PORT = process.env.MLAB_PORT;
const DB_URL = `mongodb://${ADMIN_USER}:${ADMIN_PASS}@${MLAB_HOST}:${MLAB_PORT}/vision`;

const PORT = process.env.PORT || 3000;

// Initialize http server
const app = express();
app.use(bodyParser.json());

// Use router for all API endpoints
// app.use('/', router);

connect()
  .on('error', console.log)
  .on('disconnected', connect)
  .once('open', listen);

app.get('/', (req, res) => {
  res.send(cool());
});

app.post('/newUser', (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  user.save();
  res.redirect('/');
});

app.post('/removeUser', (req, res) => {
  const { username } = req.body;
  User.deleteOne({ username: username }, (err) => {
    if (err) console.log(err);
  });
  res.redirect('/');
});

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
