// const Twit = require('twit');

// /**
//  * GET /api/twitter
//  * Twitter API example.
//  */
// exports.getTwitter = (req, res, next) => {
//   //const token = req.user.tokens.find(token => token.kind === 'twitter');
//   const T = new Twit({
//     consumer_key: process.env.TWITTER_KEY,
//     consumer_secret: process.env.TWITTER_SECRET,
//     access_token: process.env.TWITTER_ACCESS_TOKEN,
//     access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
//   });
//   T.get('statuses/user_timeline', { screen_name: user, count: 1}, (err, data, reply) => {
//     if (err) { 
//       console.log(err);
//       callback(null, ["Can't fetch tweets at the moment", "No internet connectivity"]);
//     }
//     res.render('api/twitter', {
//       title: 'Twitter API',
//       tweets: reply.statuses
//     });
//   });
// };