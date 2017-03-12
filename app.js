/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
const multer = require('multer');

const upload = multer({ dest: path.join(__dirname, 'uploads') });

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.primary' });

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const userController = require('./controllers/user');
//const apiController = require('./controllers/api');
const teamController = require('./controllers/team');
const challengeController = require('./controllers/challenge');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', () => {
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(expressStatusMonitor());
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  if (req.path === '/api/upload') {
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
      req.path == '/account') {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/faqs', homeController.getFaqs);
app.get('/scoreboard', homeController.getScoreboard);
app.get('/challenge/:cnum', passportConfig.isAuthenticated, passportConfig.isJoined, challengeController.getChallengePage);
app.post('/challenge/0', passportConfig.isAuthenticated, passportConfig.isJoined, challengeController.postChallengePage);
app.post('/challenge/1', passportConfig.isAuthenticated, passportConfig.isJoined, challengeController.postChallengePage);
app.post('/challenge/2', passportConfig.isAuthenticated, passportConfig.isJoined, challengeController.postChallengePage);
app.post('/challenge/3', passportConfig.isAuthenticated, passportConfig.isJoined, challengeController.postChallengePage);
app.post('/challenge/4', passportConfig.isAuthenticated, passportConfig.isJoined, challengeController.postChallengePage);
app.post('/challenge/5', passportConfig.isAuthenticated, passportConfig.isJoined, challengeController.postChallengePage);
app.post('/challenge/6', passportConfig.isAuthenticated, passportConfig.isJoined, challengeController.postChallengePage);
app.post('/challenge/7', passportConfig.isAuthenticated, passportConfig.isJoined, challengeController.postChallengePage);
app.post('/challenge/8', passportConfig.isAuthenticated, passportConfig.isJoined, challengeController.postChallengePage);
app.post('/challenge/9', passportConfig.isAuthenticated, passportConfig.isJoined, challengeController.postChallengePage);
app.post('/challenge/10', passportConfig.isAuthenticated, passportConfig.isJoined, challengeController.postChallengePage);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);
app.get('/join', passportConfig.isAuthenticated, teamController.getJoin);
app.post('/join', passportConfig.isAuthenticated, teamController.postJoin);
app.get('/create', passportConfig.isAuthenticated, teamController.getCreate);
app.post('/create', passportConfig.isAuthenticated, teamController.postCreate);

/**
 * API examples routes.
 */
// app.get('/api', apiController.getApi);
// app.get('/api/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTwitter);
// app.post('/api/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postTwitter);
// app.get('/api/lob', apiController.getLob);
// app.get('/api/upload', apiController.getFileUpload);
// app.post('/api/upload', upload.single('myFile'), apiController.postFileUpload);
// app.get('/api/google-maps', apiController.getGoogleMaps);

/**
 * OAuth authentication routes. (Sign in) Uses YorkU PPY i.e. GOOGLE
 */
//app.get('/auth/google', passport.authenticate('google', { scope: 'profile email'}));
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email', hostedDomain: 'yorku.ca' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});

/**
 * Error Handler.
 */
//app.use(errorHandler());

app.get('*', function(req, res){
    req.flash('errors', { msg: 'Error 404 - Not Found' });
    return res.redirect('/');
});

// development error handler
// will print stacktrace
if (process.env.DEV === 'development') {
  app.use(function(err, req, res, next) {
    req.flash('errors', { msg: 'Error' });
    return res.redirect('/');
  });
}

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env')); 
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
