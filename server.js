/*** SETUP ***/

const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 5000;

// enable post data parsing
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to the database
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
require('dotenv').config();
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

// set static directory
app.use(express.static('public'));

// set the view engine to ejs
app.set("view engine", "ejs");

// set view parameters
const viewParams = {
	title: "", 
	dateString: getDate(),
	loggedIn: false, 
	message: "", 
	userName: ""
};

// set up server
app.listen(PORT, function() {
    console.log("The server is listening");
});

/*** ROUTES ***/

// send home page
app.get('/', (req, res) => res.render('pages/home', viewParams));

// send login page
app.get('/login', (req, res) => res.render('pages/login', viewParams));

// log user in
app.post('/loginUser', loginUser);

/*** CONTROLLER FUNCTIONS ***/

function getDate() {
    /* Returns the current date as a string formatted MM/DD/YYYY */
    let today = new Date();
    let dateString = (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear();
    return dateString;
}

function loginUser(req, res) {
	const userEmail = req.body.userEmail;
	const userPassword = req.body.userPassword;

	getUserByEmail(userEmail, function(err, result) {
		// check for errors
		if(err || result == null || result.length != 1) {
			viewParams.message = "Login error. Please try again.";
			res.render('pages/login', viewParams);
			res.end();
		}
		// compare passwords and log user in if they match
		else {
			const userInfo = result[0];

			// log user in
			if (userInfo.userpassword == userPassword) {
				viewParams.loggedIn = true;
				viewParams.message = "Login Successful!";
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


/*** MODEL FUNCTIONS ***/

function getUserByEmail(userEmail, callback) {
	// Set up SQL for query
	let sql = "SELECT * FROM public.user WHERE useremail = $1";

	// set up SQL parameters
	let params = [userEmail]

	// run query, send results to callback function
	pool.query(sql, params, (err, result) => {
		if (err) {
			console.log(err);
			callback(err, null);
		}
		console.log(result.rows[0])
		callback(null, result.rows);
	});
}