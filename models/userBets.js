const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userBetsSchema = new Schema({
  _id: Schema.ObjectId,
  bets: Array,
});

userBetsSchema.statics = {
  addBet: function(userId, betId) {
    return this.findByIdAndUpdate(userId, { "$push": { "bets": betId } });
  }
};

module.exports = mongoose.model('userbets', userBetsSchema);
