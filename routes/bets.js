const express = require('express');
const {sendJSONRes, catcher } = require('./helpers');
const User = require('../models/user');
const SingleBet = require('../models/singleBet');
const UserBets = require('../models/userBets');

const router = express.Router();

router.post('/createSingle', async (req, res) => {
  // verify user for the participant username (and get their ID)
  const creatorId = req.body.creator;
  const participant = await catcher(res, 400, { "message": "invalid participant username" }, User.getId.bind(User), req.body.participant);
  if (!participant) return;
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
    submissions: { [creatorId]: null, [participantId]: null },
    cancellations: { [creatorId]: false, [participantId]: false }
  });

  // save bet to the db
  const betInfo = await catcher(res, 400, { "message": "invalid request made" }, bet.save.bind(bet));
  if (!betInfo) return;
  const betId = betInfo._id;

  // save bet to userbets for both users
  const addBetFunc = UserBets.addBet.bind(UserBets);
  const creatorUpdate = await catcher(res, 400, { "message": "update failed" },
    addBetFunc, creatorId, betId);
  if (!creatorUpdate) return;

  const participantUpdate = await catcher(res, 400, { "message": "update failed" },
    addBetFunc, participantId, betId);
  if (!participantUpdate) return;

  sendJSONRes(res, 200, betInfo);
});

router.get('/allSingles', async (req, res) => {
  const betIds = await catcher(res, 400, { "message": "could not find bet ids for user" }, UserBets.findById.bind(UserBets), req.body.user);
  if (!betIds) return;

  const bets = await catcher(res, 400, { "message": "could not find bets for user" },
    SingleBet.getBets.bind(SingleBet), betIds.bets);
  if (!bets) return;

  sendJSONRes(res, 200, bets);
});

module.exports = router;
