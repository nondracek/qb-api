const express = require('express');
const passport = require('passport');
const { sendJSONRes, catcher } = require('./helpers');
const User = require('../models/user');
const UserBets = require('../models/userBets');

const router = express.Router();

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

router.post('/signup', async (req, res) => {
  const user = new User();
  user.username = req.body.username;
  user.name = req.body.name;
  user.setPassword(req.body.password);

  const userInfo = await catcher(res, 400, { "message": "could not create user" }, user.save.bind(user));
  if (!userInfo) return;

  const userBets = new UserBets({ _id: userInfo._id });
  const info = await catcher(res, 400, { "message": "could not create userBets" }, userBets.save.bind(userBets));
  if (!info) return;

  const token = user.generateJwt();
  sendJSONRes(res, 200, { "token": token });
});

router.post('/removeUser', (req, res) => {
  const { username } = req.body;
  User.deleteOne({ username: username }, (err) => {
    if (err) console.log(err);
  });
  res.redirect('/');
});

module.exports = router;
