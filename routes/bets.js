const express = require('express');
const { sendJSONRes, catcher } = require('./helpers');
const sendNotification = require('./notificationService');
const User = require('../models/user');
const SingleBet = require('../models/singleBet');

const router = express.Router();

router.post('/submitSingle', async (req, res) => {
  // req should contain username, user ID, bet ID, and outcome in req.body
  const submitId = req.body.userId;
  const submitUser = req.body.username;
  const betId = req.body.bet;
  const outcome = req.body.outcome;

  const bet = await catcher(res, 400, { "message": "invalid bet ID" }, SingleBet.findById.bind(SingleBet), betId);
  if (!bet) return;
  bet.participantSubmit(submitId, outcome);

  const creator = await catcher(res, 400, { "message": "invalid bet creator" }, User.findById.bind(User), bet.creator);
  if (!creator) return;

  console.log(bet.checkSubmit());
  sendJSONRes(res, 200, { "message": "this endpoint has not been completed" });
});

router.post('/cancelSingle', async (req, res) => {
  // req should contain username, user ID, bet ID in req.body
  const cancelId = req.body.userId;
  const cancelUser = req.body.username;
  const betId = req.body.bet;

  const bet = await catcher(res, 400, { "message": "invalid bet ID" }, SingleBet.findById.bind(SingleBet), betId);
  if (!bet) return;
  bet.participantCancel(cancelId);

  const creator = await catcher(res, 400, { "message": "invalid bet creator" }, User.findById.bind(User), bet.creator);
  if (!creator) return;

  let finalCancel = false;
  if (bet.checkCancel()) {
    SingleBet.findByIdAndDelete(betId);
    finalCancel = true;
  }

  if (creator.deviceToken) {
    let msg;
    if (finalCancel) {
      msg = `Your bet cancellation has been affirmed by ${cancelUser}.`;
    } else {
      msg = `${cancelUser} has requested to cancel your bet "${bet.title}".`;
    }
    sendNotification(msg, 1, 'ping.aiff', creator.deviceToken);
  }

  sendJSONRes(res, 200, bet);
});

router.post('/declineSingle', async (req, res) => {
  // req should contain username, bet ID in req.body
  const declinedUser = req.body.username;
  const betId = req.body.bet;

  const bet = await catcher(res, 400, { "message": "invalid bet ID" }, SingleBet.findByIdAndDelete.bind(SingleBet), betId);
  if (!bet) return;

  const creator = await catcher(res, 400, { "message": "invalid bet creator" }, User.findById.bind(User), bet.creator);
  if (!creator) return;
  if (creator.deviceToken) {
    sendNotification(`Your bet has been declined by ${declinedUser}.`, 1, 'ping.aiff', creator.deviceToken);
  }

  sendJSONRes(res, 200, bet);
});

router.post('/acceptSingle', async (req, res) => {
  // req should contain user ID, username, and bet ID in req.body
  const acceptedId = req.body.userId;
  const acceptedUser = req.body.username;
  const betId = req.body.bet;

  // find the bet object and update the user who accepted to true, also change bet status to active
  const bet = await catcher(res, 400, { "message": "invalid bet ID" }, SingleBet.findById.bind(SingleBet), betId);
  if (!bet) return;
  bet.participantAccept(acceptedId);

  // send notification to other participant (if they signed up for notifications) to let them know that bet has been accepted
  // other participant is always creator (creator never needs to accept single since they accept upon creation)
  const creator = await catcher(res, 400, { "message": "invalid bet creator" }, User.findById.bind(User), bet.creator);
  if (!creator) return;
  if (creator.deviceToken) {
    sendNotification(`Your bet has been accepted by ${acceptedUser}!`, 1, 'ping.aiff', creator.deviceToken);
  }

  sendJSONRes(res, 200, bet);
});

router.post('/createSingle', async (req, res) => {
  const creatorId = req.body.creatorId;
  const creatorName = req.body.creatorName;

  // verify user for the participant username (and get their ID)
  const participant = await catcher(res, 400, { "message": "invalid participant username" }, User.getUser.bind(User), req.body.participant);
  if (!participant) return;
  const participantId = participant._id;
  const participantDeviceToken = participant.deviceToken;

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
  const addBetFunc = User.addBet.bind(User);
  const creatorUpdate = await catcher(res, 400, { "message": "update failed" },
    addBetFunc, creatorId, betId);
  if (!creatorUpdate) return;

  const participantUpdate = await catcher(res, 400, { "message": "update failed" },
    addBetFunc, participantId, betId);
  if (!participantUpdate) return;

  // finally, notify participant if they have signed up for notifications
  if (participantDeviceToken) {
    sendNotification(`You have a new 1v1 bet request from ${creatorName}!`, 1, 'ping.aiff', participantDeviceToken);
  }

  sendJSONRes(res, 200, betInfo);
});

router.get('/allSingles', async (req, res) => {
  const betIds = await catcher(res, 400, { "message": "could not find bet ids for user" }, User.findById.bind(User), req.header('userID'), 'bets');
  if (!betIds) return;

  const bets = await catcher(res, 400, { "message": "could not find bets for user" },
    SingleBet.getBets.bind(SingleBet), betIds.bets);
  if (!bets) return;

  sendJSONRes(res, 200, bets);
});

module.exports = router;
