function getClothesByUserIdAndWarmRating(userId, warmRating, callback) {
	//test values
	var result = {
		clothes: [
			{clothingid:1, clothingtype:"Top", clothingcolor:"Blue", warmrating:5, casualrating:5, clothingimage:"path", userid:1},
			{clothingid:2, clothingtype:"Bottom", clothingcolor:"Black", warmrating:5, casualrating:5, clothingimage:"path", userid:1}
		]
	};

	callback(null, result);	



	/*// Set up SQL for query
	let sql = "SELECT * FROM clothes WHERE userid = $1 AND warmrating = $2";

	// set up SQL parameters
	let params = [userId, warmRating]

	// run query, send results to callback function
	pool.query(sql, params, (err, result) => {
		if (err) {
			console.log(err);
			callback(err, null);
		}
		console.log(result.rows)
		callback(null, result.rows);
	});
	*/
}

module.exports = {
    getClothesByUserIdAndWarmRating: getClothesByUserIdAndWarmRating
}