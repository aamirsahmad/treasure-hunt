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
      if(nnum > 0){ // change num to start locked challenges from that num
        Team.findOne({code: req.user.team}, (err, team) => {
          if (err) {
            console.log(err);
            req.flash('errors', { msg: 'Unexpected Error Occurred. Contact Webmaster ASAP.' });
            return res.redirect('/');
          }
          //var isCompleted = team.challenges[nnum - 1]; for locked challenges
          var isCompleted = team.challenges[0];
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
  let num = req.body.challengenum.match(/[0-9]*$/)[0];
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

/**
 * GET /
 * Challenge Code.
 */
 exports.getChallengeCode = (req, res) => {
  var uri = req.path.split('/')[2];
  var c;
  if (uri === 'mS955sz7Xef642x1') c = 1;
  else if (uri === '5O3GJ4A2kkvREKB2') c = 2;
  else if (uri === '1yfz5kJZ4e8X37r3') c = 3;
  else if (uri === 't1lC74N7kX21K3c4') c = 4;
  else if (uri === 'j745v8fV66OHrIh5') c = 5;
  else if (uri === 'BFYjSr2yVjCSWdJ6') c = 6;
  else if (uri === 'KhEexAL4159lTcy7') c = 7;
  else if (uri === '63cU6cf8x13h8pf8') c = 8;
  else if (uri === 'p5HQz3vP98Rd1yD9') c = 9;
  else if (uri === 'W261a4dK6i159yj10') c = 10;
  Challenge.findOne({ 'num': c }, function (err, challenge) {
    if (err) {
      console.log(err);
      req.flash('errors', { msg: 'Unexpected Error Occurred. Contact Webmaster ASAP.' });
      return res.redirect('/');
    }
    if(!c){
      req.flash('errors', { msg: 'Challenge does not exists' });
      return res.redirect('/');
    }
    return res.json(challenge.code);
  });
 };