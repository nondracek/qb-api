const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();

const sendJSONRes = (res, status, content) => {
  res.status(status);
  res.json(content);
};

router.post('/login', (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      sendJSONRes(res, 404, err);
      return;
    }
    if (user) {
      const token = user.generateJwt();
      sendJSONRes(res, 200, { "token": token });
    } else {
      sendJSONRes(res, 401, info);
    }
  })(req, res);
});

router.post('/signup', (req, res) => {
  const user = new User();
  user.username = req.body.username;
  user.name = req.body.name;
  user.setPassword(req.body.password);
  user.save(err => {
    if (err) {
      sendJSONRes(res, 400, {
        "message": "could not create user"
      });
      return;
    }
    const token = user.generateJwt();
    sendJSONRes(res, 200, { "token": token });
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
