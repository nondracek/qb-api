const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const apn = require('apn');
const apiRoutes = require('./routes');

// get passport strategy
require('./passport');

// get env vars
require('dotenv').config();
const DB_USER = process.env.DB_USER;
const DB_PW = process.env.DB_PW;
const DB_HOST = process.env.DB_HOST;
const DB_SRV_HOST = process.env.DB_SRV_HOST;
//const DB_URL = `mongodb+srv://${DB_USER}:${DB_PW}@${DB_SRV_HOST}/vision?retryWrites=true`;
const DB_URL = `mongodb://${DB_USER}:${DB_PW}@${DB_HOST}/vision?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`;

const PORT = process.env.PORT || 3000;

// Initialize http server
const app = express();

// connect to apn
const apnProvider = new apn.Provider({
  token: {
    key: process.env.APNS_KEY,
    keyId: process.env.KEY_ID,
    teamId: process.env.TEAM_ID
  },
  production: false
});

// connect to mongodb
const db = connect();
db.on('error', console.log)
  .on('disconnected', connect)
  .once('open', listen);

// parse incoming requests
app.use(bodyParser.json());

app.use(passport.initialize());

// routes
app.use('/', apiRoutes);

// catch unauthorized errors
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401);
    res.json({ "message": err.name + ": " + err.message });
  }
});

function listen() {
  app.listen(PORT, () => {
    console.log(`Node app is running on port ${PORT}`);
  });
}

function connect() {
  const options = {
    useNewUrlParser: true,
    useCreateIndex: true
  };
  mongoose.connect(DB_URL, options);
  return mongoose.connection;
}

const gracefulShutdown = (msg, callback) => {
  apnProvider.shutdown();
  db.close(function() {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};

// For nodemon restarts
process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

// For app termination
process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});

// For Heroku app termination
process.on('SIGTERM', () => {
  gracefulShutdown('Heroku app termination', () => {
    process.exit(0);
  });
});

const bundleId = process.env.BUNDLE_ID;
module.exports = { apnProvider, bundleId };
