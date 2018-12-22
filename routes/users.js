const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        next(err);
      } else {
        res.redirect('/');
      }
    });
  }
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  User.authenticate(username, password, (err, user) => {
    if (err || !user) {
      let e = new Error("Wrong email or password");
      e.status = 401;
      next(e);
    } else {
      req.session.userId = user._id;
      res.redirect('/');
    }
  });
});

router.post('/signup', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) {
      next(err);
    } else {
      req.session.userId = user._id;
      res.redirect('/');
    }
  });
});

router.post('/removeUser', (req, res) => {
  const { username } = req.body;
  User.deleteOne({ username: username }, (err) => {
    if (err) console.log(err);
  });
  res.redirect('/');
});

module.exports = router;
