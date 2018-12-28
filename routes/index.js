const express = require('express');
const cool = require('cool-ascii-faces');
const jwt = require('express-jwt');
const userRoutes = require('./users');
const betRoutes = require('./bets');

const router = express.Router();
const auth = jwt({
  secret: "MY_SECRET", // should not store secret in file
  requestProperty: "payload"
});

router.get('/', (req, res) => {
  res.send(cool());
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

module.exports = router;
