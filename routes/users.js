var express = require('express');
var router = express.Router();
var multer = require('multer');

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

	console.log('ProfileImageName: ' + profileImageName);

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
		/*
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password,
			profileimage: profileImageName
		});
*/

		// Create User
		//User.createUser(newUser, function(err, user){
			//if(err) throw err;
			//console.log(user);
		//});

		// Success Message
		req.flash('success','You are now registered and may log in');


		console.log(req.file);
  		res.redirect('/');
  	}
});




module.exports = router;
