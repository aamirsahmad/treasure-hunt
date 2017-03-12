const Challenge = require('../models/Challenge');
const Team = require('../models/Team');
const _ = require('lodash');

/**
 * GET /
 * Challenge page.
 */
 exports.getChallengePage = (req, res) => {
  var num = req.params.cnum;
  var nnum = parseInt(num);
  if(nnum < 0 || nnum > 10) {
    req.flash('errors', { msg: 'Error 404 - Not Found' });
    return res.redirect('/');
  }
  Challenge.findOne({ 'num': num }, function (err, c) {
  	if (err) {
      console.log(err);
      req.flash('errors', { msg: 'Unexpected Error Occurred. Contact Webmaster ASAP.' });
      return res.redirect('/');
    }
    if(!c){
      req.flash('errors', { msg: 'Challenge does not exists' });
      return res.redirect('/');
    }
    else{
      // Locked Challenge
      if(nnum > 8){
        Team.findOne({code: req.user.team}, (err, team) => {
          if (err) {
            console.log(err);
            req.flash('errors', { msg: 'Unexpected Error Occurred. Contact Webmaster ASAP.' });
            return res.redirect('/');
          }
          var isCompleted = team.challenges[nnum - 1];
          if(isCompleted){
            res.render('challenges', {
              title: 'Challenge ' + num,
              num: c.num,
              name: c.name,
              detail: c.detail,
              points: c.points
            });       
          }
          else {
            req.flash('errors', { msg: 'Challenge Locked' });
            return res.redirect('/');
          } 
        });
      }
      else{
        res.render('challenges', {
          title: 'Challenge ' + num,
          num: c.num,
          name: c.name,
          detail: c.detail,
          points: c.points
        }); 
      }
    }
  })
};

/**
 * POST /challenge/:num
 * Challenge page.
 */
 exports.postChallengePage = (req, res, next) => {
  let num = req.path.charAt(req.path.length - 1);
  console.log(req.body);
  Challenge.findOne({ 'num': num }, function (err, challenge) {
    if (err) {
      console.log(err);
      req.flash('errors', { msg: 'Unexpected Error Occurred. Contact Webmaster ASAP.' });
      return res.redirect('/');
    }
    var providedCode = req.body.code;
    var expectedCode = challenge.code;
    var isCompleted = challenge.teams.indexOf(req.user.team) === -1;
    if(providedCode === expectedCode && isCompleted) {
      Team.findOne({code: req.user.team}, (err, team) => {
        if (err) {
          console.log(err);
          req.flash('errors', { msg: 'Unexpected Error Occurred. Contact Webmaster ASAP.' });
          return res.redirect('/');
        }
        team.score += challenge.points;
        var nnum = parseInt(num);
        var buffArr = _.concat(team.challenges);
        buffArr[nnum] = true;
        team.challenges = buffArr;
        team.save((err) => {
          if (err) {
            console.log(err);
            req.flash('errors', { msg: 'Unexpected Error Occurred. Contact Webmaster ASAP.' });
            return res.redirect('/');
          }
          challenge.teams.push(req.user.team);
          challenge.save((err) => {
            if (err) {
              console.log(err);
              req.flash('errors', { msg: 'Unexpected Error Occurred. Contact Webmaster ASAP.' });
              return res.redirect('/');
            }
            req.flash('success', { msg: 'Correct code!' });
            return res.redirect('/');
          });
        });
      });
    }
    else if(providedCode === expectedCode && !isCompleted){
      req.flash('errors', { msg: 'Code already applied' });
      return res.redirect('/');
    }
    else{
      req.flash('errors', { msg: 'Incorrect code' });
      return res.redirect('back');
    }
  });
};