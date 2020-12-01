const connection = require("../library/connection.js");

function getClothesByUserIdAndWarmRating(userId, warmRating, callback) {
	let sql = "SELECT * FROM clothing WHERE userid = $1 AND warmrating = $2";
	let params = [userId, warmRating];
	connection.pool.query(sql, params, (error, result) => {
		if (error) {
			console.log("--> clothing-model.js > getClothesByUserIdAndWarmRating");
			console.log(error);
			callback(error, null);
		}
		console.log("--> clothing-model.js > getClothesByUserIdAndWarmRating");
		console.log(result.rows);
		callback(null, result.rows);
	})
}

function getClothesByUserId(userId, callback) {
	let sql = "SELECT * FROM clothing WHERE userid = $1";
	let params = [userId];
	connection.pool.query(sql, params, (error, result) => {
		if(error) {
			console.log("--> clothing-model.js > getClothesByUserId");
			console.log(error);
			callback(error, null);
		}
		console.log("--> clothing-model.js > getClothesByUserId");
		console.log(result.rows);
		callback(null, result.rows);
	});
}

function getClothingByClothingId(clothingId, callback) {
	let sql = "SELECT * FROM clothing WHERE clothingid = $1";
	let params = [clothingId];
	connection.pool.query(sql, params, (error, result) => {
		if (error) {
			console.log("--> clothing-model.js > getClothingByClothingId");
			console.log(error);
			callback(error, null);
		}
		console.log("--> clothing-model.js > getClothingByClothingId");
		console.log(result.rows[0]);
		callback(null, result.rows[0]);
	})
}

function insertClothingItem(clothingType, clothingColor, warmRating, casualRating, clothingImage, userId, callback) {
	let sql = "INSERT INTO clothing (clothingtype, clothingcolor, warmrating, casualrating, clothingimage, userid) VALUES ($1, $2, $3, $4, $5, $6)"
	let params = [clothingType, clothingColor, warmRating, casualRating, clothingImage, userId];
	connection.pool.query(sql, params, (error, result) => {
		if (error) {
			console.log("--> clothing-model.js > insertClothingItem");
			console.log(error);
			callback(error, null);
		}
		db_result = {
			success:true,
			list: result.rows
		}
		console.log("--> clothing-model.js > insertClothingItem");
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