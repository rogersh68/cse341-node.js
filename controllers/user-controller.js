const userModel = require("../models/user-model.js");

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
	
}

module.exports = {
    loginUser: loginUser,
    logoutUser: logoutUser,
    createAccount: createAccount
}