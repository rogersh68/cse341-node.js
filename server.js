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

app.listen(process.env.PORT, function() {
    console.log("The server is listening at port 8888");
});

// set view parameters
const viewParams = {title: "Title", dateString: "11/18/2020"};

// send home page
app.get('/', (req, res) => res.render('pages/home', {title: "Home", dateString: currentDate}));