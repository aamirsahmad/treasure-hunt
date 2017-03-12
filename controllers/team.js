const Team = require('../models/Team');
const User = require('../models/User');
const crypto = require('crypto');
/**
 * GET /join
 * Join page.
 */
exports.getJoin = (req, res) => {
  res.render('join', {
    title: 'Join'
  });
};

exports.postJoin = (req, res) => {
  if(req.user.team.length > 0) {
    req.flash('info', { msg: 'You are already in a team [ code: ' + req.user.team + ' ]'});
    return res.redirect('/');
  }
  Team.findOne({code: req.body.code}, (err, existingTeam) => {
    if (err) {
      console.log(err);
      req.flash('errors', { msg: 'Unexpected Error Occurred. Contact Webmaster ASAP.' });
      return res.redirect('/');
    }
    if(!existingTeam) {
      req.flash('errors', { msg: 'Invalid code' });
      return res.redirect('/join');
    }
    if(existingTeam.players.length < 4 && existingTeam.players.indexOf(req.user.email) == -1) {
      existingTeam.players.push(req.user.email);
      existingTeam.save((err) => {
        if (err) throw err;
        User.findOne({email: req.user.email}, (err, user) => {
          if (err) {
            console.log(err);
            req.flash('errors', { msg: 'Unexpected Error Occurred. Contact Webmaster ASAP.' });
            return res.redirect('/');
          }
          user.team = existingTeam.code;
          user.teamID = existingTeam._id;
          user.save((err) => {
            if (err) {
              console.log(err);
              req.flash('errors', { msg: 'Unexpected Error Occurred. Contact Webmaster ASAP.' });
              return res.redirect('/');
            }
            req.flash('info', { msg: 'You have successfully joined ' + existingTeam.name });
            return res.redirect('/');
          })
        });
      });
    }
    else {
      req.flash('errors', { msg: 'Team full or you are already in the team' });
      return res.redirect('/');
    }
  });
}

/**
 * GET /create
 * Join page.
 */
exports.getCreate = (req, res) => {
  res.render('create', {
    title: 'Create'
  });
};

/**
 * POST /create
 * New team page.
 */
exports.postCreate = (req, res) => {
  crypto.randomBytes(8, (err, buf) => {
    if (err) {
      console.log(err);
      req.flash('errors', { msg: 'Unexpected Error Occurred. Contact Webmaster ASAP.' });
      return res.redirect('/');
    }
    var token = buf.toString('hex');
    Team.findOne({ teamLeader: req.user.email }, (err, existingTeam) => {
      if (err) {
        console.log(err);
        req.flash('errors', { msg: 'Unexpected Error Occurred. Contact Webmaster ASAP.' });
        return res.redirect('/');
      }
      if (existingTeam) {
        req.user.team = existingTeam.code;
        req.flash('errors', { msg: 'You already have a team. [ code: ' + existingTeam.code + ' ]'});
        return res.redirect('/');
      } else {
        var newTeam = new Team({
          code: token,
          teamLeader: req.user.email,
          name: req.body.name,
          players: [req.user.email],
          score: 0,
          challenges: [false, false, false, false, false, false, false, false, false, false, false]
        });
        newTeam.save((err, existingTeam) => {
          if (err) {
            console.log(err);
            req.flash('errors', { msg: 'Unexpected Error Occurred. Contact Webmaster ASAP.' });
            return res.redirect('/');
          }
          User.findOne({email: req.user.email}, (err, user) => {
            if (err) throw err;
            user.team = existingTeam.code;
            user.teamID = existingTeam._id;
            user.teamLeader = 1;
            user.save((err) => { 
              if (err) {
                console.log(err);
                req.flash('errors', { msg: 'Unexpected Error Occurred. Contact Webmaster ASAP.' });
                return res.redirect('/');
              }
              req.flash('info', { msg: 'Your team code is ' + newTeam.code });
              return res.redirect('/');
            });
          });
        });
      }
    });
  });
};