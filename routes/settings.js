const express = require('express');
const { sendJSONRes, catcher } = require('./helpers');
const User = require('../models/user');

const router = express.Router();

router.post('/setNotifID', async (req, res) => {
  const userInfo = await catcher(res, 500, { "message": "could not set notification id" },
    User.findOneAndUpdate.bind(User), { 'username': req.body.username }, { 'deviceToken': req.body.notifID });
  if (!userInfo) return;

  sendJSONRes(res, 200, { "message": "successfully updated notification ID" });
});

module.exports = router;
