const connection = require("../library/connection.js");

function getClothesByUserIdAndWarmRating(userId, warmRating, callback) {
	// set up sql for query
	let sql = "SELECT * FROM clothing WHERE userid = $1 AND warmrating = $2";

	// set up sql parameters
	let params = [userId, warmRating];

	// run query, send results to callback function
	connection.pool.query(sql, params, (error, result) => {
		if (error) {
			console.log("--> clothing-model.js > getClothesByUserIdAndWarmRating");
			console.log(error);

			// send back error
			callback(error, null);
		}
		console.log("--> clothing-model.js > getClothesByUserIdAndWarmRating");
		console.log(result.rows);

		// send back results
		callback(null, result.rows);
	});
}

function getClothesByUserId(userId, callback) {
	// set up sql for query
	let sql = "SELECT * FROM clothing WHERE userid = $1";

	// set up sql parameters
	let params = [userId];

	// run query, send results to callback function
	connection.pool.query(sql, params, (error, result) => {
		if(error) {
			console.log("--> clothing-model.js > getClothesByUserId");
			console.log(error);

			// send back error
			callback(error, null);
		}
		console.log("--> clothing-model.js > getClothesByUserId");
		console.log(result.rows);

		// send back results
		callback(null, result.rows);
	});
}

function getClothingByClothingId(clothingId, callback) {
	// set up sql for query
	let sql = "SELECT * FROM clothing WHERE clothingid = $1";

	// set up sql parameters
	let params = [clothingId];

	// run query, send results to callback function
	connection.pool.query(sql, params, (error, result) => {
		if (error) {
			console.log("--> clothing-model.js > getClothingByClothingId");
			console.log(error);

			// send back error
			callback(error, null);
		}
		console.log("--> clothing-model.js > getClothingByClothingId");
		console.log(result.rows[0]);

		// send back results
		callback(null, result.rows[0]);
	})
}

function insertClothingItem(clothingType, clothingColor, warmRating, casualRating, clothingImage, userId, callback) {
	// set up sql for query
	let sql = "INSERT INTO clothing (clothingtype, clothingcolor, warmrating, casualrating, clothingimage, userid) VALUES ($1, $2, $3, $4, $5, $6)";
	
	// set up sql parameters
	let params = [clothingType, clothingColor, warmRating, casualRating, clothingImage, userId];
	
	// run query, send results to callback function
	connection.pool.query(sql, params, (error, result) => {
		if (error) {
			console.log("--> clothing-model.js > insertClothingItem");
			console.log(error);

			// send back error and success = false
			callback(error, {success: false});
		}
		console.log("--> clothing-model.js > insertClothingItem");
		console.log(result);

		// send back success = true
		callback(null, {success: true});
	});
}

function updateClothingItemInDb(clothingId, clothingType, clothingColor, warmRating, casualRating, clothingImage, callback) {
	// set up sql for query
	let sql = "UPDATE clothing SET clothingtype = $1, clothingcolor = $2, warmrating = $3, casualrating = $4, clothingimage = $5 WHERE clothingid = $6";
	
	// set up sql parameters
	let params = [clothingType, clothingColor, warmRating, casualRating, clothingImage, clothingId];
	
	// run query, send results to callback function
	connection.pool.query(sql, params, (error, result) => {
		if (error) {
			console.log("--> clothing-model.js > updateClothingItemInDb");
			console.log(error);

			// send back error and success = false
			callback(error, {success: false});
		}
		console.log("--> clothing-model.js > updateClothingItemInDb");
		console.log(result);

		// send back success = true
		callback(null, {success: true});
	});
}

function deleteClothingItemInDb(clothingId, callback) {
	// set up sql for query
	let sql = "DELETE FROM clothing WHERE clothingid = $1";

	// set up sql parameters
	let params = [clothingId];

	// run query, send results to callback function
	connection.pool.query(sql, params, (error, result) => {
		if (error) {
			console.log("--> clothing-model.js > deleteClothingItemInDb");
			console.log(error);

			// send back error and success = false
			callback(error, {success: false});
		}
		console.log("--> clothing-model.js > deleteClothingItemInDb");
		console.log(result);

		// send back success = true
		callback(null, {success: true});
	});
}

module.exports = {
	getClothesByUserIdAndWarmRating: getClothesByUserIdAndWarmRating,
	getClothesByUserId: getClothesByUserId,
	getClothingByClothingId: getClothingByClothingId,
	insertClothingItem: insertClothingItem,
	updateClothingItemInDb: updateClothingItemInDb,
	deleteClothingItemInDb: deleteClothingItemInDb
}