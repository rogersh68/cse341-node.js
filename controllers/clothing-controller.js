// get model
const clothingModel = require("../models/clothing-model.js");
const library = require("../library/functions.js");
const vp = require("../library/view-params.js");
const viewParams = vp.viewParams;

function generateOutfit(req, res) {
	let userId = req.body.userId;

	// get warmRating based on temp
	let warmRating = getWarmRating(temp);

	const outfit = [];

	clothingModel.getClothesByUserIdAndWarmRating(userId, warmRating, function(error, result) {
		// check for errors
		if(error || result == null) {
			viewParams.message = "Error getting outfit. Please try again.";
			res.render('pages/home', viewParams);
			res.end();
		}
		// generate outfit
		else {
			let tops = [];
			let bottoms = [];
			let outerwear = [];
			let onepieces = [];
			let shoes = [];

			// check season colors for each item and separate
			// clothing types onto different arrays
			let date = new Date();
			let month = date.getMonth() + 1;
			console.log(result);
			result.forEach(e => {
				switch(e.clothingtype) {
					case "Top":
						//check if season is fall/winter
						if (month >= 9 && month <= 12 ) {
							// add fall/winter colors to list
							if (e.clothingcolor == "Red" 
							|| e.clothingcolor == "Orange" 
							|| e.clothingcolor == "Purple" 
							|| e.clothingcolor == "Black" 
							|| e.clothingcolor == "Brown") {
								tops.push(e);
							}
						}
						// otherwise season is spring/summer
						else {
							// add spring/summer colors to list
							if (e.clothingcolor == "Yellow" 
							|| e.clothingcolor == "Green" 
							|| e.clothingcolor == "Blue" 
							|| e.clothingcolor == "White" 
							|| e.clothingcolor == "Gray") {
								tops.push(e)
							}
						}
						break;
					case "Bottom":
						//check if season is fall/winter
						if (month >= 9 && month <= 12 ) {
							// add fall/winter colors to list
							if (e.clothingcolor == "Red" 
							|| e.clothingcolor == "Orange" 
							|| e.clothingcolor == "Purple" 
							|| e.clothingcolor == "Black" 
							|| e.clothingcolor == "Brown") {
								bottoms.push(e);
							}
						}
						// otherwise season is spring/summer
						else {
							// add spring/summer colors to list
							if (e.clothingcolor == "Yellow" 
							|| e.clothingcolor == "Green" 
							|| e.clothingcolor == "Blue" 
							|| e.clothingcolor == "White" 
							|| e.clothingcolor == "Gray") {
								bottoms.push(e)
							}
						}
						break;
					case "Outerwear":
						//check if season is fall/winter
						if (month >= 9 && month <= 12 ) {
							// add fall/winter colors to list
							if (e.clothingcolor == "Red" 
							|| e.clothingcolor == "Orange" 
							|| e.clothingcolor == "Purple" 
							|| e.clothingcolor == "Black" 
							|| e.clothingcolor == "Brown") {
								outerwear.push(e);
							}
						}
						// otherwise season is spring/summer
						else {
							// add spring/summer colors to list
							if (e.clothingcolor == "Yellow" 
							|| e.clothingcolor == "Green" 
							|| e.clothingcolor == "Blue" 
							|| e.clothingcolor == "White" 
							|| e.clothingcolor == "Gray") {
								outerwear.push(e)
							}
						}
						break;
					case "Shoes":
						//check if season is fall/winter
						if (month >= 9 && month <= 12 ) {
							// add fall/winter colors to list
							if (e.clothingcolor == "Red" 
							|| e.clothingcolor == "Orange" 
							|| e.clothingcolor == "Purple" 
							|| e.clothingcolor == "Black" 
							|| e.clothingcolor == "Brown") {
								shoes.push(e);
							}
						}
						// otherwise season is spring/summer
						else {
							// add spring/summer colors to list
							if (e.clothingcolor == "Yellow" 
							|| e.clothingcolor == "Green" 
							|| e.clothingcolor == "Blue" 
							|| e.clothingcolor == "White" 
							|| e.clothingcolor == "Gray") {
								shoes.push(e)
							}
						}
						break;
					case "One Piece":
						//check if season is fall/winter
						if (month >= 9 && month <= 12 ) {
							// add fall/winter colors to list
							if (e.clothingcolor == "Red" 
							|| e.clothingcolor == "Orange" 
							|| e.clothingcolor == "Purple" 
							|| e.clothingcolor == "Black" 
							|| e.clothingcolor == "Brown") {
								onepieces.push(e);
							}
						}
						// otherwise season is spring/summer
						else {
							// add spring/summer colors to list
							if (e.clothingcolor == "Yellow" 
							|| e.clothingcolor == "Green" 
							|| e.clothingcolor == "Blue" 
							|| e.clothingcolor == "White" 
							|| e.clothingcolor == "Gray") {
								onepieces.push(e)
							}
						}
						break;
				}
			});
			
			// generate random number
			let int = library.getRandomInt(2);

			// compare casual ratings and
			// add pieces to outfit array
			switch (int) {
				case 0:
					if (tops.length != 0 && bottoms.length != 0) {
						// get random top
						let iTop = getRandomInt(tops.length);
						let top = tops[iTop];

						let tCasual = top.casualrating;
						outfit.push(top);

						// get random bottom
						let bottom = compareRating(bottoms, tCasual);
						outfit.push(bottom);

						// if temp < 60 and items are on array, add outerwear
						if (temp < 60 && outerwear.length != 0) {
							let outer = compareRating(outerwear, tCasual);
							outfit.push(outer);
						}

						// if shoes not empty add shoes with same casual rating
						if (shoes.length != 0) {
							let shoe = compareRating(shoes, tCasual);
							outfit.push(shoe);
						}
					}
					else if (onepieces.length != 0) {
						// get random onepiece
						let iOne = getRandomInt(onepieces.length);
						let onepiece = onepieces[iOne];

						let oCasual = onepiece.casualrating;
						outfit.push(onepiece);

						// if temp < 60 and items are on array, add outerwear
						if (temp < 60 && outerwear.length != 0) {
							let outer = compareRating(outerwear, oCasual);
							outfit.push(outer);
						}

						// if shoes not empty add shoes with same casual rating
						if (shoes.length != 0) {
							let shoe = compareRating(shoes, oCasual);
							outfit.push(shoe);
						}
					}
				break;

				case 1:
					if (onepieces.length != 0) {
						// get random onepiece
						let iOne = getRandomInt(onepieces.length);
						let onepiece = onepieces[iOne];

						let oCasual = onepiece.casualrating;
						outfit.push(onepiece);

						// if temp < 60 and items are on array, add outerwear
						if (temp < 60 && outerwear.length != 0) {
							let outer = compareRating(outerwear, oCasual);
							outfit.push(outer);
						}

						// if shoes not empty add shoes with same casual rating
						if (shoes.length != 0) {
							let shoe = compareRating(shoes, oCasual);
							outfit.push(shoe);
						}
					}
					else if (tops.length != 0 && bottoms.length != 0) {
						// get random top
						let iTop = getRandomInt(tops.length);
						let top = tops[iTop];

						let tCasual = top.casualrating;
						outfit.push(top);

						// get random bottom
						let bottom = compareRating(bottoms, tCasual);
						outfit.push(bottom);

						// if temp < 60 and items are on array, add outerwear
						if (temp < 60 && outerwear.length != 0) {
							let outer = compareRating(outerwear, tCasual);
							outfit.push(outer);
						}

						// if shoes not empty add shoes with same casual rating
						if (shoes.length != 0) {
							let shoe = compareRating(shoes, tCasual);
							outfit.push(shoe);
						}
					}
				break;
			}	
			
			// send outfit
			res.json(outfit);
		}
	});
}

function getWarmRating(temp) {
	/* Returns the warm rating based on the temp */
	if (temp < 40) {
		return 5
	}
	else if (temp < 50) {
		return 4
	}
	else if (temp < 60) {
		return 3
	}
	else if (temp < 70) {
		return 2
	}
	else {
		return 1
	}
}

function compareRating(array, mainRating) {
	/* Compares ratings of items on an array with the main rating.
	*  Returns the random item with a similar rating of the main rating. */
	let item;
	let rating;
	let tries = 0;
	let i = library.getRandomInt(array.length);
	// if index is over the end of the array start at beginning
	if (i > array.length - 1) {
		i = 0;
	}
	// go through items until casual rating is around  the main rating
	// or goes through entire array
	do {
		item = array[i];
		rating = item.casualrating;
		i++;
		tries++;
	} while (rating != mainRating 
		|| (rating + 1) != mainRating 
		|| (rating -1) != mainRating 
		|| tries == array.length);
	return item;
}

function getCloset(req, res) {
	let userId = req.body.userId;

	clothingModel.getClothesByUserId(userId, function(error, result) {
		res.json(result);
	});
}

function addClothingItem(req, res) {
	let clothingType = req.body.clothingType;
	let clothingColor = req.body.clothingColor;
	let warmRating = req.body.warmRating;
	let casualRating = req.body.casualRating;
	let clothingImage = req.body.clothingImage;
	let userId = req.body.userId;

	clothingModel.insertClothingItem(clothingType, clothingColor, warmRating, casualRating, clothingImage, userId, function(error, result) {
		if(result.success) {
			viewParams.message = "Item successfully added.";
			viewParams.title = "My Closet";
			res.render('pages/closet', viewParams);
		}
		else {
			viewParams.message = "Item was not added, please try again.";
			viewParams.title = "My Closet";
			res.render('pages/closet', viewParams);
		}
	});

}

function prepareUpdate(req, res) {
	let clothingId = req.body.clothingId;
	
	clothingModel.getClothingByClothingId(clothingId, function(error, result) {	
		viewParams.clothingId = result.clothingid;
		res.json(result);
	});
	
}

function updateClothingItem(req, res) {
	let clothingId = req.body.clothingId;
	let clothingType = req.body.clothingType;
	let clothingColor = req.body.clothingColor;
	let warmRating = req.body.warmRating;
	let casualRating = req.body.casualRating;
	let clothingImage = req.body.clothingImage;

	clothingModel.updateClothingItemInDb(clothingId, clothingType, clothingColor, warmRating, casualRating, clothingImage, function(error, result) {
		if(result.success) {
			viewParams.message = "Item successfully updated.";
			viewParams.title = "My Closet";
			res.render('pages/closet', viewParams);
		}
		else {
			viewParams.message = "Item was not updated, please try again.";
			viewParams.title = "My Closet";
			res.render('pages/closet', viewParams);
		}
	});
}

function deleteClothingItem(req, res) {
	let clothingId = req.body.clothingId;

	clothingModel.deleteClothingItemInDb(clothingId, function(error, result) {
		if(result.success) {
			viewParams.message = "Item successfully deleted.";
			viewParams.title = "My Closet";
			res.render('pages/closet', viewParams);
		}
		else {
			viewParams.message = "Item was not deleted, please try again.";
			viewParams.title = "My Closet";
			res.render('pages/closet', viewParams);
		}
	});
}

module.exports = {
	generateOutfit: generateOutfit,
	getCloset: getCloset,
	addClothingItem: addClothingItem,
	prepareUpdate: prepareUpdate,
	updateClothingItem: updateClothingItem,
	deleteClothingItem: deleteClothingItem
};