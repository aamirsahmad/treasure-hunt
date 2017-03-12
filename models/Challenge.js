const crypto = require('crypto');
const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  num: String,
  name: String,
  detail: String,
  points: Number,
  isValid : Number,
  teams: Array
}, { timestamps: true });

const Challenge = mongoose.model('Challenge', ChallengeSchema);

module.exports = Challenge;