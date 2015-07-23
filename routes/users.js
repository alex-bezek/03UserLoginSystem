var express = require('express');
var router = express.Router();
var multer = require('multer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

//This was the way I got the multer to work, as opposed to how the tutorial said to do it
var upload = multer({dest:'uploads/'});
var cpUpload = upload.single('profileimage');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {'title': 'Register'});
});

router.get('/login', function(req, res, next) {
  res.render('login', {'title': 'Login'});
});

router.post('/register', function(req, res, next){

  //First Get the form values
	var name = req.body.name,
		email = req.body.email, 
		username = req.body.username, 
		password = req.body.password, 
		password2 = req.body.password2;

	//Check for image field
	console.log(req.body, req.file);
	if(req.file){
		console.log('Uploading File...');
		var profileImageOriginalName = req.file.originalname,
			profileImageName = req.file.filename,
			profileImageMime = req.file.mimetype,
			profileImagePath = req.file.path,
			profileImageExt = req.file.extension,
			profileImageSize = req.file.size;
	} else {
		var profileImageName = 'noimage.png';
	}

	//console.log('ProfileImageName: ' + profileImageName);

	//form Validation
	req.checkBody('name', 'Name field is required').notEmpty();
	req.checkBody('email', 'Email field is required').notEmpty();
	req.checkBody('email', 'Email not valid').isEmail();
	req.checkBody('username', 'Username field is required').notEmpty();
	req.checkBody('password', 'Password field is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(password);

	// Check for errors
	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors: errors,
			name: name,
			email: email,
			username: username,
			password: password,
			password2: password2
		});
	} else {
		
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password,
			profileimage: profileImageName
		});


		// Create User
		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		// Success Message
		req.flash('success','You are now registered and may log in');


		console.log(req.file);
  		res.redirect('/');
  	}
});

passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	User.getUserbyId(id, function(err, user){
		done(err, user);
	});
});


passport.use(new LocalStrategy(
	function(username, password, done){
		User.getUserByUsername(username, function(err, user){
			if(err) throw err;
			if(!user){
				console.log('Unknown User');
				return done(null, false, {message: 'Unknown User'});
			}

			User.comparePassword(password, user.password, function(err, isMatch){
				if(err) throw err;
				if(isMatch){
					return done(null, user);
				} else {
					console.log('Invalid Password');
					return done(null, false, {message: 'Invalid Password'});
				}
			});
		});
	}
));

router.post('/login', passport.authenticate('local', 
	{
		failureRedirect: '/users/login', 
		failureFlash: 'Invalid username or password'
	}), function(req, res){
		console.log('Authentication Successful!!');
		req.flash('success', 'You are logged in');
		res.redirect('/');
});

router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'You have logged out');
	res.redirect('/users/login');
})


module.exports = router;
