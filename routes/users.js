const express = require('express');
const passport = require('passport');
const { sendJSONRes, catcher } = require('./helpers');
const User = require('../models/user');

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

router.post('/setNotifID', async (req, res) => {
    console.log('we here');
    query = {'username': req.body.username};
    notifID = {'deviceToken': req.body.notifID};
    User.findOneAndUpdate(query, notifID, {upsert:true}, function(err, doc){
            if (err) return res.send(500, { error: err });
            return res.send("succesfully updated Notification ID");
    });
    console.log('at end');
});


router.post('/signup', async (req, res) => {
  const user = new User();
  user.username = req.body.username;
  user.name = req.body.name;
  user.deviceToken = req.body.deviceToken;
  user.setPassword(req.body.password);

  const userInfo = await catcher(res, 400, { "message": "could not create user" }, user.save.bind(user));
  if (!userInfo) return;

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
