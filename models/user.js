const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.statics = {
  authenticate: function(username, password, callback) {
    this.findOne({username: username})
      .exec((err, user) => {
        if (err) {
          return callback(err);
        } else if (!user) {
          let e = new Error('User not found.');
          e.status = 401;
          return callback(e);
        }
        if (password === user.password) {
          return callback(null, user);
        }
        return callback();
      });
  },
};

const User = mongoose.model('users', UserSchema);
module.exports = User;
