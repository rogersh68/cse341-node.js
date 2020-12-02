/*********************** 
 * SETUP 
 ***********************/
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// imports
const clothingController = require("./controllers/clothing-controller");
const userController = require("./controllers/user-controller");
const vp = require("./library/view-params");
const viewParams = vp.viewParams;

// enable post data parsing
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set static directory
app.use(express.static(path.join(__dirname, 'public')));

// set the view engine to ejs
app.set("view engine", "ejs");

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
app.post('/loginUser', userController.loginUser);

// log user out
app.get('/logout', userController.logoutUser);

// send create account page
app.get('/create', function(req, res) {
	viewParams.title = "Create Account";
	viewParams.message = "";
	res.render('pages/create-account', viewParams);
});

// create new user account
app.post('/createAccount', userController.createAccount);

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
app.post('/add-item', clothingController.addClothingItem);





// send update item page
app.post('/update', function(req, res) {
	viewParams.clothingId = req.body.clothingId;
	viewParams.title = "Update Item";
	res.render('pages/update-item', viewParams);
});

// get info for item being updated
app.post('/prepare-update', clothingController.prepareUpdate);

// update clothing item in db
app.post('/update-item', clothingController.updateClothingItem);




// send delete item page
app.get('/delete', function(req, res) {
	viewParams.title = "Delete Item";
	res.render('pages/delete-item', viewParams);
});

// generate outfit
app.post('/generate', clothingController.generateOutfit);

// get user's closet
app.post('/user-clothes', clothingController.getCloset);

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