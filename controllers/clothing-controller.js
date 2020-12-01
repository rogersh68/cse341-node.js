// get model
const clothingModel = require("../models/clothing-model.js");

// outfit array (check if empty then go into db - if db is empty send closet empty message)
const outfit; // if undefined, not enough items in closet

function generateOutfit(req, res) {
	//test values
	let userId = req.body.userId;
	let temp = getTemp();
	let warmRating;
	let date = new Date();
	let month = date.getMonth() + 1;	

	// get required warmRating
	if (temp < 40) {
		warmRating = 5
	}
	else if (temp < 50) {
		warmRating = 4
	}
	else if (temp < 60) {
		warmRating = 3
	}
	else if (temp < 70) {
		warmRating = 2
	}
	else {
		warmRating = 1
	}
	

	clothingModel.getClothesByUserIdAndWarmRating(userId, warmRating, function(err, result) {
		// check for errors
		if(err || result == null) {
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

			// checks season colors for each item and separates
			// clothing types onto different arrays
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
			let int = getRandomInt(2);

			// compares casual ratings and
			// adds pieces to outfit array
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

/* 
*  Uses a weather API to get the high temp for the day 
*  and returns the high temp as an int.
*/
function getTemp() {
	return 60;
}

/*
*  Returns a random integer between 0 and the max argument.
*/
function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

/*
*  Goes through an array and compares ratings of items on 
*  the array with the main rating. Returns the random item
*  with a similar rating of the main rating.
*/
function compareRating(array, mainRating) {
	let item;
	let rating;
	let tries = 0;
	let i = getRandomInt(array.length);
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

module.exports = {
    generateOutfit: generateOutfit
};