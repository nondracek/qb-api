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
    this.save();
  },
  participantCancel: function(participantId) {
    this.cancellations.set(participantId, true);
    this.save();
  },
  participantSubmit: function(participantId, outcome) {
    this.submissions.set(participantId, outcome);
    this.save();
  },
  checkCancel: function() {
    const values = Array.from(this.cancellations.values());
    return values[0] && values[0] === values[1];
  },
  checkSubmit: function() {
    const outcomes = Array.from(this.submissions.values());
    return outcomes[0] === outcomes[1];
  },
  complete: function() {
    this.status = "complete";
    this.save();
  }
};

singleBetSchema.statics = {
  getBets: function(betIds) {
    return this.find({ '_id': { '$in': betIds } });
  }
};

module.exports = mongoose.model('singlebets', singleBetSchema);
