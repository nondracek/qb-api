const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const singleBetSchema = new Schema({
  creator: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  creationTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  participants: {
    type: Array,
    required: true
  },
  accepted: {
    type: Map,
    of: Boolean,
    required: true
  },
  submissions: {
    type: Map,
    of: String,
    required: true
  },
  cancellations: {
    type: Map,
    of: Boolean,
    required: true
  }
});

singleBetSchema.methods = {
  participantAccept: function(participantId) {
    this.accepted.set(participantId, true);
    this.status = "active";
  },
  participantCancel: function(participantId) {
    this.cancellations.set(participantId, true);
  },
  participantSubmit: function(participantId, outcome) {
    this.submissions.set(participantId, outcome);
  }
};

singleBetSchema.statics = {
  decline: function(betId) {
    this.deleteOne({ _id: betId }, err => {
      if (err) console.log(err);
    });
  }
};

module.exports = mongoose.model('singleBets', singleBetSchema);
