function getClothesByUserIdAndWarmRating(userId, warmRating, callback) {
	// Set up SQL for query
	let sql = "SELECT * FROM clothing WHERE userid = $1 AND warmrating = $2";

	// set up SQL params
	let params = [userId, warmRating];

	// run query, send results to callback function
	pool.query(sql, params, (error, result) => {
		if (error) {
			console.log(error);
			callback(error, null);
		}
		console.log(result.rows);
		callback(null, result.rows);
	})
}

function getClothesByUserId(userId, callback) {
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

function getClothingByClothingId(clothingId, callback) {
	let sql = "SELECT * FROM clothing WHERE clothingid = $1";
	let params = [clothingId];
	pool.query(sql, params, (error, result) => {
		if (error) {
			console.log(error);
			callback(error, null);
		}
		console.log(result.rows);
		callback(null, result.rows);
	})
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

module.exports = {
	getClothesByUserIdAndWarmRating: getClothesByUserIdAndWarmRating,
	getClothesByUserId: getClothesByUserId,
	getClothingByClothingId: getClothingByClothingId,
	insertClothingItem: insertClothingItem
}