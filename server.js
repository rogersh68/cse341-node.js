/*********************** 
 * SETUP 
 ***********************/

const express = require('express');
const path = require('path');
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
app.use(express.static(path.join(__dirname, 'public')));

// set the view engine to ejs
app.set("view engine", "ejs");

// set user's temp
const temp = getTemp();

// set view parameters
const viewParams = {
	title: "", 
	dateString: getDate(),
	loggedIn: false, 
	message: "", 
	userId: 1,
	userName: "",
	temp: temp
};

// import controllers
//const clothingController = require("./controllers/clothing-controller");
//const userController = require("./controllers/user-controller");

// set up server
app.listen(PORT, function() {
    console.log("The server is listening");
});

/***********************
 * ROUTES 
 ***********************/

// send home page
app.get('/', function(req, res) { //TODO: reset if/else
	// //testing
	// viewParams.title = "Home";
	// res.render('pages/home', viewParams);

	if (viewParams.loggedIn == false) {
		viewParams.title = "Login";
		res.render('pages/login', viewParams);
	}
	else {
		viewParams.title = "Home";
		res.render('pages/home', viewParams);
	}
});

// send login page
app.get('/login', function(req, res) {
	viewParams.title = "Login";
	viewParams.message = "";
	res.render('pages/login', viewParams)
});

// log user in
app.post('/loginUser', loginUser);

// log user out
app.get('/logout', logoutUser);

// send create account page
app.get('/create', function(req, res) {
	viewParams.title = "Create Account";
	viewParams.message = "";
	res.render('pages/create-account', viewParams);
});

// create new user account
app.post('/createAccount', createAccount);

// send account page
app.get('/account', function(req, res) {
	if (viewParams.loggedIn == false) {
		viewParams.title = "Login";
		res.render('pages/login', viewParams);
	}
	else {
		viewParams.title = "My Account";
		res.render('pages/account', viewParams);
	}
});

// send closet page
app.get('/closet', function(req, res) {
	viewParams.title = "My Closet";
	res.render('pages/closet', viewParams);
});

// send add item page
app.get('/add', function(req, res) {
	viewParams.title = "Add Item";
	res.render('pages/add-item', viewParams);
});

// insert clothing item
app.post('/add-item', addClothingItem);

// send update item page
app.get('/update', function(req, res) {
	viewParams.title = "Update Item";
	res.render('pages/update-item', viewParams);
});

// send delete item page
app.get('/delete', function(req, res) {
	viewParams.title = "Delete Item";
	res.render('pages/delete-item', viewParams);
});

// generate outfit
app.post('/generate', generateOutfit);

// get user's closet
app.post('/user-clothes', getCloset);

// send error page
app.use(function (err, req, res, next) {
    // log errors
    console.error(err.stack);

	// render error page
	viewParams.title = "Error";
    res.status(500).render('pages/error', viewParams);
});

// send 404 page
app.use(function (req, res, next) {
	//render 404 page
	viewParams.title = "404"
	viewParams.url = req.originalUrl;
    res.status(404).render("pages/404", viewParams);
});

/*********************** 
 * FUNCTIONS 
 ***********************/

function getDate() {
    /* Returns the current date as a string formatted MM/DD/YYYY */
    let today = new Date();
    let dateString = (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear();
    return dateString;
}

function getTemp() {
	/* Uses OpenWeather API to return high temp as an int */
	return 60;
}

function getRandomInt(max) {
	/* Returns a random int between 0 and the max argument */
	return Math.floor(Math.random() * Math.floor(max));
}

/*********************** 
 * USER CONTROLLER
 ***********************/

function loginUser(req, res) {
	let userEmail = req.body.userEmail;
	let userPassword = req.body.userPassword;

	getUserByEmail(userEmail, function(err, result) {
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

function updateAccount(req, res) {

}

/*********************** 
 * USER MODEL
 ***********************/

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

function insertUser(firstName, lastName, userEmail, userPassword, callback) {

}

function updateUser(userId, firstName, lastName, userEmail, userPassword, callback) {
	
}

/*********************** 
 * CLOTHING CONTROLLER
 ***********************/

function generateOutfit(req, res) {
	let userId = req.body.userId;

	// get warmRating based on temp
	let warmRating = getWarmRating(temp);

	const outfit = [];

	getClothesByUserIdAndWarmRating(userId, warmRating, function(error, result) {
		// check for errors
		if(error || result == null) {
			viewParams.message = "Error getting outfit. Please try again.";
			res.render('pages/home', viewParams);
			res.end();
		}
		// generate outfit
		else {
			let tops = [];
			let bottoms = [];
			let outerwear = [];
			let onepieces = [];
			let shoes = [];

			// check season colors for each item and separate
			// clothing types onto different arrays
			let date = new Date();
			let month = date.getMonth() + 1;
			console.log(result);
			result.forEach(e => {
				switch(e.clothingtype) {
					case "Top":
						//check if season is fall/winter
						if (month >= 9 && month <= 12 ) {
							// add fall/winter colors to list
							if (e.clothingcolor == "Red" 
							|| e.clothingcolor == "Orange" 
							|| e.clothingcolor == "Purple" 
							|| e.clothingcolor == "Black" 
							|| e.clothingcolor == "Brown") {
								tops.push(e);
							}
						}
						// otherwise season is spring/summer
						else {
							// add spring/summer colors to list
							if (e.clothingcolor == "Yellow" 
							|| e.clothingcolor == "Green" 
							|| e.clothingcolor == "Blue" 
							|| e.clothingcolor == "White" 
							|| e.clothingcolor == "Gray") {
								tops.push(e)
							}
						}
						break;
					case "Bottom":
						//check if season is fall/winter
						if (month >= 9 && month <= 12 ) {
							// add fall/winter colors to list
							if (e.clothingcolor == "Red" 
							|| e.clothingcolor == "Orange" 
							|| e.clothingcolor == "Purple" 
							|| e.clothingcolor == "Black" 
							|| e.clothingcolor == "Brown") {
								bottoms.push(e);
							}
						}
						// otherwise season is spring/summer
						else {
							// add spring/summer colors to list
							if (e.clothingcolor == "Yellow" 
							|| e.clothingcolor == "Green" 
							|| e.clothingcolor == "Blue" 
							|| e.clothingcolor == "White" 
							|| e.clothingcolor == "Gray") {
								bottoms.push(e)
							}
						}
						break;
					case "Outerwear":
						//check if season is fall/winter
						if (month >= 9 && month <= 12 ) {
							// add fall/winter colors to list
							if (e.clothingcolor == "Red" 
							|| e.clothingcolor == "Orange" 
							|| e.clothingcolor == "Purple" 
							|| e.clothingcolor == "Black" 
							|| e.clothingcolor == "Brown") {
								outerwear.push(e);
							}
						}
						// otherwise season is spring/summer
						else {
							// add spring/summer colors to list
							if (e.clothingcolor == "Yellow" 
							|| e.clothingcolor == "Green" 
							|| e.clothingcolor == "Blue" 
							|| e.clothingcolor == "White" 
							|| e.clothingcolor == "Gray") {
								outerwear.push(e)
							}
						}
						break;
					case "Shoes":
						//check if season is fall/winter
						if (month >= 9 && month <= 12 ) {
							// add fall/winter colors to list
							if (e.clothingcolor == "Red" 
							|| e.clothingcolor == "Orange" 
							|| e.clothingcolor == "Purple" 
							|| e.clothingcolor == "Black" 
							|| e.clothingcolor == "Brown") {
								shoes.push(e);
							}
						}
						// otherwise season is spring/summer
						else {
							// add spring/summer colors to list
							if (e.clothingcolor == "Yellow" 
							|| e.clothingcolor == "Green" 
							|| e.clothingcolor == "Blue" 
							|| e.clothingcolor == "White" 
							|| e.clothingcolor == "Gray") {
								shoes.push(e)
							}
						}
						break;
					case "One Piece":
						//check if season is fall/winter
						if (month >= 9 && month <= 12 ) {
							// add fall/winter colors to list
							if (e.clothingcolor == "Red" 
							|| e.clothingcolor == "Orange" 
							|| e.clothingcolor == "Purple" 
							|| e.clothingcolor == "Black" 
							|| e.clothingcolor == "Brown") {
								onepieces.push(e);
							}
						}
						// otherwise season is spring/summer
						else {
							// add spring/summer colors to list
							if (e.clothingcolor == "Yellow" 
							|| e.clothingcolor == "Green" 
							|| e.clothingcolor == "Blue" 
							|| e.clothingcolor == "White" 
							|| e.clothingcolor == "Gray") {
								onepieces.push(e)
							}
						}
						break;
				}
			});
			// generate random number
			let int = getRandomInt(2);

			// compare casual ratings and
			// add pieces to outfit array
			switch (int) {
				case 0:
					if (tops.length != 0 && bottoms.length != 0) {
						// get random top
						let iTop = getRandomInt(tops.length);
						let top = tops[iTop];

						let tCasual = top.casualrating;
						outfit.push(top);

						// get random bottom
						let bottom = compareRating(bottoms, tCasual);
						outfit.push(bottom);

						// if temp < 60 and items are on array, add outerwear
						if (temp < 60 && outerwear.length != 0) {
							let outer = compareRating(outerwear, tCasual);
							outfit.push(outer);
						}

						// if shoes not empty add shoes with same casual rating
						if (shoes.length != 0) {
							let shoe = compareRating(shoes, tCasual);
							outfit.push(shoe);
						}
					}
					else if (onepieces.length != 0) {
						// get random onepiece
						let iOne = getRandomInt(onepieces.length);
						let onepiece = onepieces[iOne];

						let oCasual = onepiece.casualrating;
						outfit.push(onepiece);

						// if temp < 60 and items are on array, add outerwear
						if (temp < 60 && outerwear.length != 0) {
							let outer = compareRating(outerwear, oCasual);
							outfit.push(outer);
						}

						// if shoes not empty add shoes with same casual rating
						if (shoes.length != 0) {
							let shoe = compareRating(shoes, oCasual);
							outfit.push(shoe);
						}
					}
				break;

				case 1:
					if (onepieces.length != 0) {
						// get random onepiece
						let iOne = getRandomInt(onepieces.length);
						let onepiece = onepieces[iOne];

						let oCasual = onepiece.casualrating;
						outfit.push(onepiece);

						// if temp < 60 and items are on array, add outerwear
						if (temp < 60 && outerwear.length != 0) {
							let outer = compareRating(outerwear, oCasual);
							outfit.push(outer);
						}

						// if shoes not empty add shoes with same casual rating
						if (shoes.length != 0) {
							let shoe = compareRating(shoes, oCasual);
							outfit.push(shoe);
						}
					}
					else if (tops.length != 0 && bottoms.length != 0) {
						// get random top
						let iTop = getRandomInt(tops.length);
						let top = tops[iTop];

						let tCasual = top.casualrating;
						outfit.push(top);

						// get random bottom
						let bottom = compareRating(bottoms, tCasual);
						outfit.push(bottom);

						// if temp < 60 and items are on array, add outerwear
						if (temp < 60 && outerwear.length != 0) {
							let outer = compareRating(outerwear, tCasual);
							outfit.push(outer);
						}

						// if shoes not empty add shoes with same casual rating
						if (shoes.length != 0) {
							let shoe = compareRating(shoes, tCasual);
							outfit.push(shoe);
						}
					}
				break;
			}	
			
			// send outfit
			res.json(outfit);
		}
	});
}

function getWarmRating(temp) {
	/* Returns the warm rating based on the temp */
	if (temp < 40) {
		return 5
	}
	else if (temp < 50) {
		return 4
	}
	else if (temp < 60) {
		return 3
	}
	else if (temp < 70) {
		return 2
	}
	else {
		return 1
	}
}

function compareRating(array, mainRating) {
	/* Compares ratings of items on an array with the main rating.
	*  Returns the random item with a similar rating of the main rating. */
	let item;
	let rating;
	let tries = 0;
	let i = getRandomInt(array.length);
	// if index is over the end of the array start at beginning
	if (i > array.length - 1) {
		i = 0;
	}
	// go through items until casual rating is around  the main rating
	// or goes through entire array
	do {
		item = array[i];
		rating = item.casualrating;
		i++;
		tries++;
	} while (rating != mainRating 
		|| (rating + 1) != mainRating 
		|| (rating -1) != mainRating 
		|| tries == array.length);
	return item;
}

function getCloset(req, res) {
	let userId = req.body.userId;

	getClothesByUserId(userId, function(error, result) {
		res.json(result);
	});
}

function addClothingItem(req, res) {
	let clothingType = req.body.clothingType;
	let clothingColor = req.body.clothingColor;
	let warmRating = req.body.warmRating;
	let casualRating = req.body.casualRating;
	let clothingImage = req.body.clothingImage;
	let userId = req.body.userId;

	insertClothingItem(clothingType, clothingColor, warmRating, casualRating, clothingImage, userId, function(error, result) {
		if(result.success) {
			res.render('pages/closet', viewParams);
		}
		else {
			res.json(result);
		}
	});

}

function updateClothingItem(req, res) {

}

function deleteClothingItem(req, res) {

}

/*********************** 
 * CLOTHING MODEL
 ***********************/

function getClothesByUserIdAndWarmRating(userId, warmRating, callback) {
	// Set up SQL for query
	let sql = "SELECT * FROM clothes WHERE userid = $1 AND warmrating = $2";

	// set up SQL params
	let params = [userId, warmRating];

	// run query, send results to callback function
	pool.query(sql, params, (error, result) => {
		if (error) {
			console.log(error);
			callback(error, null);
		}
		console.log(result);
		callback(null, result);
	})
}

function getClothesByUserId(userId, callback) {
	// //test values
	// var result = {
	// 	clothes: [
	// 		{clothingid:1, clothingtype:"Top", clothingcolor:"Blue", warmrating:5, casualrating:5, clothingimage:"path", userid:1},
	// 		{clothingid:2, clothingtype:"Bottom", clothingcolor:"Black", warmrating:5, casualrating:5, clothingimage:"path", userid:1}
	// 	]
	// };

	// callback(null, result);	

	console.log("Accessing the database...");

	let sql = "SELECT * FROM clothing WHERE userid = $1";
	let params = [userId];
	
	pool.query(sql, params, (error, result) => {
		if(error) {
			console.log(error);
			callback(error, null);
		}
		console.log(result.rows);
		callback(null, result.rows);
	});
}

function insertClothingItem(clothingType, clothingColor, warmRating, casualRating, clothingImage, userId, callback) {
	let sql = "INSERT INTO clothing (clothingtype, clothingcolor, warmrating, casualrating, clothingimage, userid) VALUES ($1, $2, $3, $4, $5, $6)"
	let params = [clothingType, clothingColor, warmRating, casualRating, clothingImage, userId];

	pool.query(sql, params, (error, result) => {
		if (error) {
			console.log(error);
			callback(error, null);
		}
		db_result = {
			success:true,
			list: result.rows
		}
		console.log(db_result)
		callback(null, db_result)
	})
}




