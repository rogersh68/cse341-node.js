const connection = require("../library/connection.js");

function getUserByEmail(userEmail, callback) {
	// Set up SQL for query
	let sql = "SELECT * FROM public.user WHERE useremail = $1";

	// set up SQL parameters
	let params = [userEmail]

	// run query, send results to callback function
	connection.pool.query(sql, params, (err, result) => {
		if (err) {
			console.log(err);
			callback(err, null);
		}
		console.log(result.rows[0])
		callback(null, result.rows);
	});
}

function insertUser(firstName, lastName, userEmail, userPassword, callback) {
	let sql = "INSERT INTO public.user (firstname, lastname, useremail, userpassword) VALUES ($1, $2, $3, $4)";
	let params = [firstName, lastName, userEmail, userPassword];
	connection.pool.query(sql, params, (error, result) => {
		if (error) {
			console.log("--> user-model.js > insertUser");
			console.log(error);
			callback(error, {success: false});
		}
		db_result = {
			success: true,
			list: result.rows
		}
		console.log("--> user-model.js > insertUser");
		console.log(db_result);
		callback(null, db_result)
	});
}

module.exports = {
    getUserByEmail: getUserByEmail,
    insertUser: insertUser
}