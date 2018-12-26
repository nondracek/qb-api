const express = require('express');
const SingleBet = require('../models/singleBet');

const router = express.Router();

const sendJSONRes = (res, status, content) => {
  res.status(status);
  res.json(content);
};

router.post('/createBet', (req, res) => {
  const bet = new SingleBet();
  bet.createdBy = req.body.username;
  bet.title = req.body.title;
  bet.participants = req.body.participants;
  bet.amount = req.body.amount;
  bet.completed = false;
  bet.timeCreated = getTime();

  bet.save(err => {
    if (err) {
      sendJSONRes(res, 400, {
        "message": "could not create bet"
      });
      return;
    }
    sendJSONRes(res, 200);
  });
  
});

router.get('/allBets', (req, res) => {
    SingleBet.find({createdBy: req.user}, function(err, res) {
      if (err) {
        sendJSONRes(res, 400, {
        "message": "could not find bets"
        });
        return;
      }
      sendJSONRes(res, 200, res);
    })
});
