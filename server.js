/*** SETUP ***/

var express = require('express');
const { Pool } = require('pg');
var app = express();

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
const viewParams = {title: "Title", dateString: "11/18/2020"};

// set up server
app.listen(process.env.PORT, function() {
    console.log("The server is listening");
});

/*** ROUTES ***/

// send home page
app.get('/', (req, res) => res.render('pages/home', viewParams));

// send login page
app.get('/login', (req, res) => res.render('pages/login', viewParams));

// log user in
app.post('/loginUser', loginUser);

/*** FUNCTIONS ***/

function loginUser(req, res) {
	const userEmail = req.body.userEmail;
	const userPassword = req.body.userPassword;

	console.log(userEmail);
	console.log(userPassword);

	let sql = "SELECT * FROM public.user WHERE useremail = $1";
	pool.query(sql, ['email@email.com'], (err, result) => {
		if (err) {
			throw err;
		}

		console.log('user: ', result.rows[0])
	})

	res.render('pages/login', viewParams);
}