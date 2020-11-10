var express = require('express');
var app = express();

app.use(express.static('public'));

// set the view engine to ejs
app.set("view engine", "ejs");
// use res.render to load up an ejs view file

// setup error handler
app.use(function (err, req, res, next) {
    // log errors
    console.error(err.stack);

    // render error page
    res.status(500).render('pages/error');
});

// handle 404 responses
app.use(function (req, res, next) {
    //render 404 page
    res.status(404).render("pages/404", {url: req.originalUrl});
});

app.listen(8888, function() {
    console.log("The server is listening at port 8888");
});



