const express = require('express');
const {sendJSONRes, catcher } = require('./helpers');
const User = require('../models/user');
const SingleBet = require('../models/singleBet');

const router = express.Router();

router.post('/createSingle', async (req, res) => {
  // verify user for the participant username (and get their ID)
  const creatorId = req.body.creator;
  const participant = await catcher(User.getId.bind(User), res, 400, { "message": "invalid participant username" }, req.body.participant);
  if (!participant) {
    return;
  }
  //const participant = await User.getId(req.body.participant);
  //if (!participant) {
    //sendJSONRes(res, 400, {
      //"message": "invalid participant username"
    //});
    //return;
  //}
  const participantId = participant._id

  // make bet object using the two user ids
  const bet = new SingleBet({
    creator: creatorId,
    title: req.body.title,
    amount: req.body.amount,
    creationTime: req.body.creationTime,
    status: "pending",
    participants: [creatorId, participantId],
    accepted: { [creatorId]: true, [participantId]: false },
    //accepted: "test",
    submissions: { [creatorId]: null, [participantId]: null },
    cancellations: { [creatorId]: false, [participantId]: false }
  });

  // save bet to the db
  const betInfo = await catcher(bet.save.bind(bet), res, 400, { "message": "invalid request made" });
  if (!betInfo) {
    return;
  }
  //let error;
  //const betInfo = await bet.save().catch(err => {
    //error = err;
  //});
  //if (!betInfo || error) {
    //sendJSONRes(res, 400, {
      //"message": "invalid request made"
    //});
    //return;
  //}
  const betId = betInfo._id;
  sendJSONRes(res, 200, betInfo);
});

router.get('/allSingles', (req, res) => {
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

module.exports = router;
