const mongoose = require("../mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("../bcrypt");

const gamehistory = new Schema({
  win: {
    type: Boolean,
    required: true,
  },
  black: {
    type: Number,
    required: true,
  },
  white: {
    type: Number,
    required: true,
  },
});

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
  },
  gamehistory: [gamehistory],
});

// bez poniższej wtyczki nie dostaniemy sensownego sygnału
// błędu przy naruszeniu „unikatowości” nazwy użytkownika
const uniqueValidator = require("mongoose-unique-validator");
// ale z nią – już wszystko będzie jak należy
userSchema.plugin(uniqueValidator);

// generating a hash
userSchema.methods.generateHash = function (password) {
  return bcrypt.hash(password);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

// mały „postprocessing” błędów mongoosowych
User.processErrors = (err) => {
  let msg = {};
  for (let key in err.errors) {
    msg[key] = err.errors[key].message;
  }
  return msg;
};

module.exports = User;
