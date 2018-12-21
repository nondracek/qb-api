const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.post('/newUser', (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  user.save();
  res.redirect('/');
});

router.post('/removeUser', (req, res) => {
  const { username } = req.body;
  User.deleteOne({ username: username }, (err) => {
    if (err) console.log(err);
  });
  res.redirect('/');
});

module.exports = router;
