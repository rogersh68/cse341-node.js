// imports
const clothingModel = require("../models/clothing-model.js");
const library = require("../library/functions.js");
const vp = require("../library/view-params.js");
const userModel = require("../models/user-model.js");
const viewParams = vp.viewParams;
const fetch = require("node-fetch");
const cloudinary = require('cloudinary').v2;
cloudinary.config({
	cloud_name: 'dv3f6je01',
	api_key: '588532794221652',
	api_secret: 'D2vGC6R8sfBoy56Eg2AzhmKxiZ8'
});
const formidable = require('formidable');


function generateOutfit(req, res) {
	/* Takes into account warmth of clothing for temp, colors for the season, 
	and casualness between items and returns a randomly generated outfit */
	// TODO: validate user id
	let userId = req.body.userId;

	// get warmRating based on temp
	getTemp(userId, function(error, temp) {
		if (error) {
			console.log(error);
		}
		else {
			let warmRating = getWarmRating(temp);

			const outfit = [];

			clothingModel.getClothesByUserIdAndWarmRating(userId, warmRating, function(error, result) {
				// check for errors
				if(error || result == null) {
					viewParams.title = "Home";
					viewParams.message = "Error getting outfit. Please try again.";
					res.render('pages/home', viewParams);
					viewParams.message = "";
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
					result.forEach(e => {
						switch(e.clothingtype) {
							case "Top":
								// check if season is fall/winter
								if (month >= 9 && month <= 12 ) {
									// add fall/winter colors to list
									if (checkFallWinterColors(e.clothingcolor)) {
										tops.push(e);
									}
								}
								// otherwise season is spring/summer
								else {
									// add spring/summer colors to list
									if (checkSpringSummerColors(e.clothingcolor)) {
										tops.push(e);
									}
								}
								break;
							case "Bottom":
								// check if season is fall/winter
								if (month >= 9 && month <= 12 ) {
									// add fall/winter colors to list
									if (checkFallWinterColors(e.clothingcolor)) {
										bottoms.push(e);
									}
								}
								// otherwise season is spring/summer
								else {
									// add spring/summer colors to list
									if (checkSpringSummerColors(e.clothingcolor)) {
										bottoms.push(e);
									}
								}
								break;
							case "Outerwear":
								// check if season is fall/winter
								if (month >= 9 && month <= 12 ) {
									// add fall/winter colors to list
									if (checkFallWinterColors(e.clothingcolor)) {
										outerwear.push(e);
									}
								}
								// otherwise season is spring/summer
								else {
									// add spring/summer colors to list
									if (checkSpringSummerColors(e.clothingcolor)) {
										outerwear.push(e);
									}
								}
								break;
							case "Shoes":
								// check if season is fall/winter
								if (month >= 9 && month <= 12 ) {
									// add fall/winter colors to list
									if (checkFallWinterColors(e.clothingcolor)) {
										shoes.push(e);
									}
								}
								// otherwise season is spring/summer
								else {
									// add spring/summer colors to list
									if (checkSpringSummerColors(e.clothingcolor)) {
										shoes.push(e);
									}
								}
								break;
							case "One Piece":
								// check if season is fall/winter
								if (month >= 9 && month <= 12 ) {
									// add fall/winter colors to list
									if (checkFallWinterColors(e.clothingcolor)) {
										onepieces.push(e);
									}
								}
								// otherwise season is spring/summer
								else {
									// add spring/summer colors to list
									if (checkSpringSummerColors(e.clothingcolor)) {
										onepieces.push(e);
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
								let iTop = library.getRandomInt(tops.length);
								let top = tops[iTop];

								let tCasual = top.casualrating;
								outfit.push(top);

								// get random bottom
								let bottom = compareRating(bottoms, tCasual);
								if(bottom != undefined) {
									outfit.push(bottom);
								}

								// if temp < 60 and items are on array, add outerwear
								if (temp < 60 && outerwear.length != 0) {
									let outer = compareRating(outerwear, tCasual);
									if(outer != undefined) {
										outfit.push(outer);
									}
								}

								// if shoes not empty add shoes with same casual rating
								if (shoes.length != 0) {
									let shoe = compareRating(shoes, tCasual);
									if(shoe != undefined) {
										outfit.push(shoe);
									}
								}
							}
							else if (onepieces.length != 0) {
								// get random onepiece
								let iOne = library.getRandomInt(onepieces.length);
								let onepiece = onepieces[iOne];

								let oCasual = onepiece.casualrating;
								outfit.push(onepiece);

								// if temp < 60 and items are on array, add outerwear
								if (temp < 60 && outerwear.length != 0) {
									let outer = compareRating(outerwear, oCasual);
									if(outer != undefined) {
										outfit.push(outer);
									}
								}

								// if shoes not empty add shoes with same casual rating
								if (shoes.length != 0) {
									let shoe = compareRating(shoes, oCasual);
									if(shoe != undefined) {
										outfit.push(shoe);
									}
								}
							}
						break;

						case 1:
							if (onepieces.length != 0) {
								// get random onepiece
								let iOne = library.getRandomInt(onepieces.length);
								let onepiece = onepieces[iOne];

								let oCasual = onepiece.casualrating;
								outfit.push(onepiece);

								// if temp < 60 and items are on array, add outerwear
								if (temp < 60 && outerwear.length != 0) {
									let outer = compareRating(outerwear, oCasual);
									if(outer != undefined) {
										outfit.push(outer);
									}
								}

								// if shoes not empty add shoes with same casual rating
								if (shoes.length != 0) {
									let shoe = compareRating(shoes, oCasual);
									if(shoe != undefined) {
										outfit.push(shoe);
									}
								}
							}
							else if (tops.length != 0 && bottoms.length != 0) {
								// get random top
								let iTop = library.getRandomInt(tops.length);
								let top = tops[iTop];

								let tCasual = top.casualrating;
								outfit.push(top);

								// get random bottom
								let bottom = compareRating(bottoms, tCasual);
								if(bottom != undefined) {
									outfit.push(bottom);
								}

								// if temp < 60 and items are on array, add outerwear
								if (temp < 60 && outerwear.length != 0) {
									let outer = compareRating(outerwear, tCasual);
									if(outer != undefined) {
										outfit.push(outer);
									}
								}

								// if shoes not empty add shoes with same casual rating
								if (shoes.length != 0) {
									let shoe = compareRating(shoes, tCasual);
									if(shoe != undefined) {
										outfit.push(shoe);
									}
								}
							}
						break;
					}	
					
					// send outfit and temp
					res.json({"outfit" : outfit, "temp" : temp});
				}
			});
		}
	});
}

function getTemp(userId, callback) {
	/* Uses OpenWeather API to return high temp as an int */
	userModel.getZipCodeByUserId(userId, function(error, result) {
		if (error || result == undefined) {
			console.error('There was a problem getting the zip code: ', error);
			callback(error, 60);
		}
		console.log(result);
		let url = "https://api.openweathermap.org/data/2.5/weather?zip=" + result + ",us&units=imperial&" + "APPID=29532d73c747db9a9cb1be86effaaac6";
		console.log(url);
		fetch(url)
        .then((response) => response.json())
        .then((jsObject) => {
			if (jsObject != undefined) {
				callback(null, Math.round(jsObject.main.temp_max));
			}
			else {
				callback("response undefined", 60);
			}
        })
        .catch(error => {
            console.error('There was a problem getting the temp: ', error);
            callback(error, 60);
        });
	});
}

function getWarmRating(temp) {
	/* Returns the warm rating based on the temp */
	if (temp < 40) {
		return 5;
	}
	else if (temp < 50) {
		return 4;
	}
	else if (temp < 60) {
		return 3;
	}
	else if (temp < 70) {
		return 2;
	}
	else if (temp < 80) {
		return 1;
	}
	else {
		return 0;
	}
}

function checkFallWinterColors(color) {
	/* Verifies colors match Fall/Winter season */
	if (color == "Red" 
	|| color == "Orange" 
	|| color == "Purple" 
	|| color == "Black" 
	|| color == "Brown") {
		return true;
	}
	else {
		return false;
	}
}

function checkSpringSummerColors(color) {
	/* Verifies colors match Spring/Summer season */
	if (color == "Yellow" 
	|| color == "Green" 
	|| color == "Blue" 
	|| color == "White" 
	|| color == "Gray") {
		return true;
	}
	else {
		return false;
	}
}

function compareRating(array, mainRating) {
	/* Compares ratings of items on an array with the main rating.
	Returns the random item with a similar rating of the main rating. */
	let item;
	let rating;
	let tries = 0;
	let i = library.getRandomInt(array.length);

	// go through items until casual rating is around  the main rating
	// or goes through entire array
	while(tries < array.length) {
		rating = array[i].casualrating;
		if(rating == mainRating || (rating + 1) == mainRating || (rating - 1) == mainRating) {
			item = array[i];
		}
		i++;
		// if index is over the end of the array start at beginning
		if (i > array.length - 1) {
			i = 0;
		}
		tries++;
	}
	return item;
}

function getCloset(req, res) {
	/* Returns all the items of clothing assosiated with the current user. */
	// TODO: validate user id
	let userId = req.body.userId;

	clothingModel.getClothesByUserId(userId, function(error, result) {
		res.json(result);
	});
}

function addClothingItem(req, res) {
	/* Adds the clothing item specified by the user into the database. */
	// TODO: Validate user input
	let form = new formidable.IncomingForm();
	form.parse(req, (err, fields, files)=> {
		console.log('error:', err);
		console.log('fields:', fields);
		console.log('files:', files);
	});
	let clothingType = req.body.clothingType;
	let clothingColor = req.body.clothingColor;
	let warmRating = req.body.warmRating;
	let casualRating = req.body.casualRating;
	let userId = req.body.userId;
	let clothingImage = req.body.clothingImage;

	// console.log("REQ BODY --> " + req.body);

	// // get image file
	// let clothingImage = req.file.clothingImage;
	
	// console.log("CLOTHING IMAGE --> " + clothingImage);
	// console.log("REQ FILE --> " + req.file);
	// console.log("REQ POST --> " + req.post);

	// // store in cloudinary and get image url string to store in db
	// cloudinary.uploader.upload(clothingImage, {"width":200, "height":"auto"}, function(result) {
	// 	console.log(result);
	// 	//var clothingUrl = result.url;
	// });

	clothingModel.insertClothingItem(clothingType, clothingColor, warmRating, casualRating, clothingImage, userId, function(error, result) {
		if(result.success) {
			viewParams.message = "Item successfully added.";
			viewParams.title = "My Closet";
			res.render('pages/closet', viewParams);
			viewParams.message = "";
			res.end();
		}
		else {
			viewParams.message = "Item was not added, please try again.";
			viewParams.title = "My Closet";
			res.render('pages/closet', viewParams);
			viewParams.message = "";
			res.end();
		}
	});
}

function getClothingInfo(req, res) {
	/* Returns all information in the database associated with a specified clothing item. */
	// TODO: validate clothing id
	let clothingId = req.body.clothingId;
	
	clothingModel.getClothingByClothingId(clothingId, function(error, result) {	
		if (error || result == null || result.length != 1) {
			viewParams.title = "My Closet";
			viewParams.message = "Could not get information for item. Please try again.";
			res.render('pages/closet', viewParams);
			viewParams.message = "";
			res.end();
		}
		else {
			viewParams.clothingId = result[0].clothingid;
			res.json(result[0]);
		}
	});
}

function updateClothingItem(req, res) {
	/* Updates a specified clothing item in the database */
	// TODO: validate user input
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
			viewParams.message = "";
			res.end();
		}
		else {
			viewParams.message = "Item was not updated, please try again.";
			viewParams.title = "My Closet";
			res.render('pages/closet', viewParams);
			viewParams.message = "";
			res.end();
		}
	});
}

function deleteClothingItem(req, res) {
	/* Removes a specified item from the database. */
	// TODO: validate clothing id
	let clothingId = req.body.clothingId;

	clothingModel.deleteClothingItemInDb(clothingId, function(error, result) {
		if(result.success) {
			viewParams.message = "Item successfully deleted.";
			viewParams.title = "My Closet";
			res.render('pages/closet', viewParams);
			viewParams.message = "";
			res.end();
		}
		else {
			viewParams.message = "Item was not deleted, please try again.";
			viewParams.title = "My Closet";
			res.render('pages/closet', viewParams);
			viewParams.message = "";
			res.end();
		}
	});
}

module.exports = {
	generateOutfit: generateOutfit,
	getCloset: getCloset,
	addClothingItem: addClothingItem,
	getClothingInfo: getClothingInfo,
	updateClothingItem: updateClothingItem,
	deleteClothingItem: deleteClothingItem
};