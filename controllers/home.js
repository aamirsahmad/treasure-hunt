const Challenge = require('../models/Challenge');
const Team = require('../models/Team');

/**
* GET /
* Home page.
*/
exports.index = (req, res) => {
	var fullScore = 600;
	var challengesObj = {
		'0': false,
		'1': false,
		'2': false,
		'3': false,
		'4': false,
		'5': false,
		'6': false,
		'7': false,
		'8': false,
		'9': false,
		'10': false
	};

	if(req.user) {
		Team.findOne({code: req.user.team}, (err, team) => {
		  	if (err) {
		      console.log(err);
		      req.flash('errors', { msg: 'Unexpected Error Occurred. Contact Webmaster ASAP.' });
		      return res.redirect('/');
		    }
			if(team){
				teamScorePer = Math.round((team.score/fullScore) * 100);
				var teamChallenges = team.challenges;
				res.render('dashboard', {
					title: 'Dashboard',
					teamName: team.name,
					teamScore: team.score,
					teamCode: team.code,
					teamScorePer: teamScorePer+'%',
					teamPlayers: team.players,
					teamChallenges: teamChallenges
				});	
			}else{
				res.render('dashboard', {
					title: 'Dashboard',
					teamName: 'No team',
					teamScore: 0,
					teamCode: '0',
					teamScorePer: 0+'%',
					teamPlayers: ['0'],
					teamChallenges: challengesObj
				});	
			}	
		});
	}else {
		res.render('home', {
			title: 'Home'
		});
	}
};

/**
* GET /
* Scoreboard page.
*/
exports.getScoreboard = (req, res) => {
	Team.getScores((err, records) => {
	  	if (err) {
	      console.log(err);
	      req.flash('errors', { msg: 'Unexpected Error Occurred. Contact Webmaster ASAP.' });
	      return res.redirect('/');
	    }	
		var teamsObj = records;
		teamsObj.sort((a, b) => { return b.total - a.total; });
		res.render('scoreboard', {
			title: 'Scoreboard',
			teamsObj: teamsObj
		});
	})
};

/**
* GET /
* FAQs page.
*/
exports.getFaqs = (req, res) => {
	res.render('faqs', {
		title: 'FAQs',
	});
};

/**
* GET /
* Finish page.
*/
exports.getFinish = (req, res) => {
	req.logout();
	req.flash('errors', { msg: 'Treasure Hunt has come to an end. Thank you for participating.' });
  	res.redirect('/');
};