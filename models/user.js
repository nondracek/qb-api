const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  hash: String,
  salt: String,
  bets: Array,
  deviceToken: String
});

UserSchema.methods = {
  setPassword: function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  },
  validPassword: function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
  },
  generateJwt: function() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
      _id: this._id,
      username: this.username,
      name: this.name,
      exp: parseInt(expiry.getTime() / 1000),
    }, "MY_SECRET"); // should not get secret in the code
  },
};

UserSchema.statics = {
  getId: function(username) {
    return this.findOne({ username: username }, '_id');
  },
  addBet: function(userId, betId) {
    return this.findByIdAndUpdate(userId, { "$push": { "bets": betId } });
  }
};

module.exports = mongoose.model('users', UserSchema);
