var express = require('express');
const { Pool } = require('pg');
var app = express();

// add a session
const session = require('express-session');
app.use(session({secret: 'secret', resave: true, saveUninitialized: true}));


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

// set constant variables
const currentDate = getDate();


// send home page
app.get('/', (req, res) => res.render('pages/home', {title: "Home", dateString: currentDate}));

// send login page
app.get('/login', (req, res) => res.render('pages/login', {title: "Login", dateString: currentDate}));

// log user in
app.post('/loginUser', loginUser);

// send create account page
app.get('/create', (req, res) => res.render('pages/create-account', {title: "Create Account", dateString: currentDate}));

// create new user account
app.get('/createAccount', createAccount);

// send closet page
app.get('/closet', (req, res) => res.render('pages/closet', {title: "My Closet", dateString: currentDate}));

// send add item page
app.get('/add', (req, res) => res.render('pages/add-item', {title: "Add Item", dateString: currentDate}));

// add new item
app.post('/addItem', addItem);

// setup error handler
app.use(function (err, req, res, next) {
    // log errors
    console.error(err.stack);

    // render error page
    res.status(500).render('pages/error', {title: "Error", dateString: currentDate});
});

// handle 404 responses
app.use(function (req, res, next) {
    //render 404 page
    res.status(404).render("pages/404", {title: "404", dateString: currentDate, url: req.originalUrl});
});

app.listen(8888, function() {
    console.log("The server is listening at port 8888");
});


/***************/
// FUNCTIONS
/***************/


function addItem(req, res) {
	let clothingType = req.body.clothingType;
	let clothingColor = req.body.clothingColor;
	let warmRating = req.body.warmRating;
	let casualRating = req.body.casualRating;
	let clothingImage = req.body.clothingImage;
	let userId = req.body.userId;

	insertClothingItem(clothingType, clothingColor, warmRating, casualRating, clothingImage, userId, function(error, result) {
		if (error || result == null || result.length != 1) {
			res.status(500).json({success: false, data: error});
		} else {
			//const userInfo = result[0];
			res.status(200).json(result[0]);
		}
	});

}

function insertClothingItem(clothingType, clothingColor, warmRating, casualRating, clothingImage, userId, callback) {
	let sql = "INSERT INTO clothing (clothingtype, clothingcolor, warmrating, casualrating, clothingimage, userid) VALUES ($1, $2, $3, $4, $5, $6)";
	let params = [clothingType, clothingColor, warmRating, casualRating, clothingImage, userId];
	pool.query(sql, params, function(err, result) {
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		// Log this to the console for debugging purposes.
		console.log("Found result: " + JSON.stringify(result.rows));

		callback(null, result.rows);
	});
}





function getDate() {
    /* Returns the current date as a string formatted MM/DD/YYYY */
    let today = new Date();
    let dateString = (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear();
    return dateString;
}

function loginUser(req, res) {
    /* Compares user input values with DB values, gives access to site.
    *  Redirects the user to the home page if values match.
    */
    // Get the user's email (username) and password
	const userEmail = req.body.userEmail;
	const userPassword = req.body.userPassword;

	// TODO: check here for a valid email...

	// use a helper function to query the DB, and provide a callback for when it's done
	getUserInfoByEmail(userEmail, function(error, result) {
		// This is the callback function that will be called when the DB is done.
		// The job here is just to send it back.

		// Make sure we got a row with the person, then prepare JSON to send back
		if (error || result == null || result.length != 1) {
			res.status(500).json({success: false, data: error});
		} else {
			const userInfo = result[0];
			//res.status(200).json(userInfo);

			// compare user's provided info with db info
			if (userInfo.userpassword == userPassword) {
				console.log("Passwords Match")
		
				// if info matches add to session
				req.session.logged_in = true;

				// set login message (successful = t)
				let message = "Login Successful";

				// set userName
				let userName = userInfo.firstname;

				// set view params and render homepage
				let params = {title: "Home", dateString: currentDate, userName: userName, message: message};
				res.render('pages/home', params);

			}
			else {
				console.log("Error, not logged in")

				// set login message (successful = f)
				// send back to login page
			}
		}
	});
}

function getUserInfoByEmail(userEmail, callback) {
	// Set up the SQL that we will use for our query
	const sql = "SELECT * FROM public.user WHERE userEmail = $1";

	// Set up an array of all the parameters we will pass to fill the
	// placeholder spots left in the query.
	const params = [userEmail];

	// Run the query, and then call the provided anonymous callback function
	// with the results.
	pool.query(sql, params, function(err, result) {
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		// Log this to the console for debugging purposes.
		console.log("Found result: " + JSON.stringify(result.rows));

		callback(null, result.rows);
	});

}

function createAccount(req, res) {
    /* Validates user input values and adds a new row to the user table.
    *  Redirects the user to the login page.
    */
	// get user inputs
	const firstName = req.query.firstName;
	const lastName = req.query.lastName;
	const userEmail = req.query.userEmail;
	const userPassword = req.query.userPassword;

	// TODO: check here for a valid inputs...

	// use a helper function to query the DB, and provide a callback for when it's done 
	addNewUserToDb(firstName, lastName, userEmail, userPassword, function(error, result) {
		// This is the callback function that will be called when the DB is done.
		// The job here is just to send it back.

		// Make sure we added a new row, then send back success indicator
		if (error || result == null || result.length != 1) {
			res.status(500).json({success: false, data: error});
		} else {
			res.status(200).json({success: true});
		}
	});


    let params = {
        title: "Login", 
        dateString: currentDate, 
        message: "Account successfully created. Please login with your account credentials."
    };
    res.render('pages/login', params);
}

function addNewUserToDb(firstName, lastName, userEmail, userPassword, callback) {
	// Set up the SQL that we will use for our query
	const sql = "INSERT INTO public.user (firstName, lastName, userEmail, userPassword) VALUES ($1, $2, $3, $4)";
	
	// Set up an array of all the parameters we will pass to fill the
	// placeholder spots left in the query.
	const params = [firstName, lastName, userEmail, userPassword];

	// Run the query, and then call the provided anonymous callback function
	// with the results.
	pool.query(sql, params, function(err, result) {
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}
		// Log this to the console for debugging purposes.
		console.log("Found result: " + JSON.stringify(result.rows));

		callback(null, result.rows);
	});
}