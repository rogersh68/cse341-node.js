const userModel = require("../models/user-model.js");
const vp = require("../library/view-params.js");
const viewParams = vp.viewParams;

function loginUser(req, res) {
	let userEmail = req.body.userEmail;
	let userPassword = req.body.userPassword;

	userModel.getUserByEmail(userEmail, function(err, result) {
		// check for errors
		if(err || result == null || result.length != 1) {
			viewParams.message = "Login error. Please try again.";
			res.render('pages/login', viewParams);
			res.end();
		}
		// compare passwords and log user in if they match
		else {
			let userInfo = result[0];

			// log user in
			if (userInfo.userpassword == userPassword) {
				viewParams.loggedIn = true;
				viewParams.message = "Login Successful!";
				viewParams.userId = userInfo.userid;
				viewParams.userName = userInfo.firstname;
				res.render('pages/home', viewParams);
				res.end();
			}
			// passwords don't match, redirect
			else {
				viewParams.message = "Incorrect password. Please try again.";
				res.render('pages/login', viewParams);
				res.end();
			}
		}
	});
}

function logoutUser(req, res) {
	viewParams.loggedIn = false;
	viewParams.message = "You have been logged out.";
	viewParams.userId = 0;
	viewParams.userName = "";
	res.render('pages/login', viewParams);
	res.end();
}

function createAccount(req, res) {
	let firstName = req.body.firstName;
	let lastName = req.body.lastName;
	let userEmail = req.body.userEmail;
	let userPassword = req.body.userPassword;

	userModel.insertUser(firstName, lastName, userEmail, userPassword, function(err, result) {
		// check for errors
		if (err || !result.success) {
			viewParams.message = "Could not create account. Please try again.";
			res.render('pages/login', viewParams);
		}
		else {
			viewParams.message = "Account successfully created. Please login.";
			res.render('pages/login', viewParams);
		}
	});
	
}

module.exports = {
    loginUser: loginUser,
    logoutUser: logoutUser,
    createAccount: createAccount
}