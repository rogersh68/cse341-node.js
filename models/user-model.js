const connection = require("../library/connection.js");

function getUserByEmail(userEmail, callback) {
	// set up sql for query
	let sql = "SELECT * FROM public.user WHERE useremail = $1";

	// set up sql parameters
	let params = [userEmail];

	// run query, send results to callback function
	connection.pool.query(sql, params, (error, result) => {
		if (error) {
			console.log("--> user-model.js > getUserByEmail");
			console.log(error);

			// send back error
			callback(error, null);
		}
		console.log("--> user-model.js > getUserByEmail");
		console.log(result.rows);

		// send back results
		callback(null, result.rows);
	});
}

function getZipCodeByUserId(userId, callback) {
	// set up sql for query
	let sql = "SELECT zipcode FROM public.user WHERE userid = $1";

	// set up sql parameters
	let params = [userId];

	// run query, send results to callback function
	connection.pool.query(sql, params, (error, result) => {
		console.log("--> user-model.js > getZipCodeByUserId");
		console.log("userid --> " + userId);
		console.log("zipcode --> " + result);
		if (error) {
			console.log("--> user-model.js > getZipCodeByUserId");
			console.log(error);

			// send back error
			callback(error, null);
		}
		console.log("--> user-model.js > getZipCodeByUserId");
		console.log(result.rows.zipcode);

		// send back results
		callback(null, result.rows.zipcode);
	});
}

function insertUser(firstName, lastName, zipCode, userEmail, userPassword, callback) {
	// set up sql for query
	let sql = "INSERT INTO public.user (firstname, lastname, zipcode, useremail, userpassword) VALUES ($1, $2, $3, $4, $5)";
	
	// set up sql parameters
	let params = [firstName, lastName, zipCode, userEmail, userPassword];

	// run query, send results to callback function
	connection.pool.query(sql, params, (error, result) => {
		if (error) {
			console.log("--> user-model.js > insertUser");
			console.log(error);

			// send back error and success = false
			callback(error, {success: false});
		}
		console.log("--> user-model.js > insertUser");
		console.log(result);

		// send back success = true
		callback(null, {success: true});
	});
}

module.exports = {
	getUserByEmail: getUserByEmail,
	getZipCodeByUserId: getZipCodeByUserId,
    insertUser: insertUser
}