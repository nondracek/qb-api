const express = require('express');
const path = require('path');
const cool = require('cool-ascii-faces');
const jwt = require('express-jwt');
const apn = require('apn');
const userRoutes = require('./users');
const betRoutes = require('./bets');
const settingRoutes = require('./settings');

const router = express.Router();
const auth = jwt({
  secret: "MY_SECRET", // should not store secret in file
  requestProperty: "payload"
});

router.get('/', (req, res) => {
  res.send(cool());
});

router.get('/confirmEmail', (req, res) => {
  res.sendFile(path.join(__dirname + '/confirmEmail.html'));
});

router.get('/passReset', (req, res) => {
  res.sendFile(path.join(__dirname + '/passReset.html'));
});

router.get('/protected', auth, (req, res) => {
  if (!req.payload._id) {
    res.status(401).json({
      "message": "Unauthorized Error: private profile"
    });
  } else {
    res.send(req.payload._id);
  }
});

router.use('/users', userRoutes);
router.use('/bets', auth, betRoutes);
router.use('/settings', auth, settingRoutes);

module.exports = router;
