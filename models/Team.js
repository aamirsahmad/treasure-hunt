const crypto = require('crypto');
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  teamLeader: String, // user email
  name: String,
  players: [String], // array of emails
  score: Number,
  challenges: [Boolean]  
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;

/**
 * getScores
 * Uses MongoDB Aggregation 
 */
module.exports.getScores = (callback) => {
  Team.aggregate([
    { $group: {
      _id: "$code",
      name: { $first: "$name"},
      total: { $sum: "$score"}
    }}
    ], (err, results) => {
      if (err) {
        callback(err);
        console.error(err);
      } else {
        callback(null, results);
      }
    }
  );
} 