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

}

module.exports = {
    getUserByEmail: getUserByEmail,
    insertUser: insertUser
}