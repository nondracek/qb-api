const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SingleBetSchema = new Schema({
  createdBy: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  participants: {
    type: Array,
    required: true
  },
  completed: {
    type: Boolean,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
  timeCreated: {
    type: Date,
    required: true
  }
});

SingleBetSchema.methods = {
  participantAccept: function(participant) {
  },
  participantDecline: function(participant) {
  },
  completeBet: function() {
  }
};

const SingleBet = mongoose.model('singleBets', SingleBetSchema);

