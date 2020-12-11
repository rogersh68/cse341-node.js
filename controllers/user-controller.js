// imports
const userModel = require("../models/user-model.js");
const vp = require("../library/view-params.js");
const viewParams = vp.viewParams;

function loginUser(req, res) {
	/* Gets user info from database and compares credentials. 
	Adds user info to session */
	// TODO: validate user input
	let userEmail = req.body.userEmail;
	let userPassword = req.body.userPassword;

	userModel.getUserByEmail(userEmail, function(error, result) {
		// check for errors
		if(error || result == null || result.length != 1) {
			viewParams.title = "Login";
			viewParams.message = "Login error. Please try again.";
			res.render('pages/login', viewParams);
		}
		// compare passwords and log user in if they match
		else {
			let userInfo = result[0];

			// log user in
			// TODO: compare hashed passwords
			if (userInfo.userpassword == userPassword) {
				// set session variables
				req.session.loggedIn = true;
				req.session.userId = userInfo.userid;

				// set view parameters
				viewParams.title = "Home";
				viewParams.message = "Login Successful!";
				viewParams.userId = userInfo.userid;
				viewParams.userName = userInfo.firstname;
				res.render('pages/home', viewParams);
			}
			// passwords don't match, redirect
			else {
				viewParams.title = "Login";
				viewParams.message = "Incorrect password. Please try again.";
				res.render('pages/login', viewParams);
			}
		}
	});
}

function verifyLogin(req, res, next) {
	if (req.session.loggedIn || req.url == '/create' || req.url == '/createAccount') {
		// user is logged in, logging in, or creating account
		// continue to next function
		next();
	}
	else {
		// user is not logged in, redirect to login page
		viewParams.title = "Login";
		res.render('pages/login', viewParams);
	}
}

function logoutUser(req, res) {
	/* Destroys the session, redirects to login page */
	if (req.session.loggedIn) {
		req.session.destroy();
		viewParams.message = "";
		viewParams.userId = 0;
		viewParams.userName = "";
		// res.render('pages/login', viewParams);
	}
}

function createAccount(req, res) {
	/* Inserts user information into the database. */
	// TODO: validate user input
	let firstName = req.body.firstName;
	let lastName = req.body.lastName;
	let userEmail = req.body.userEmail;
	let userPassword = req.body.userPassword;

	userModel.insertUser(firstName, lastName, userEmail, userPassword, function(error, result) {
		// check for errors
		if (error || !result.success) {
			viewParams.title = "Login";
			viewParams.message = "Could not create account. Please try again.";
			res.render('pages/login', viewParams);
		}
		else {
			viewParams.title = "Login";
			viewParams.message = "Account successfully created. Please login.";
			res.render('pages/login', viewParams);
		}
	});
}

module.exports = {
    loginUser: loginUser,
    logoutUser: logoutUser,
	createAccount: createAccount,
	verifyLogin: verifyLogin
}