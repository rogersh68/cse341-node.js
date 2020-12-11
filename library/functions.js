function getDate() {
    /* Returns the current date as a string formatted MM/DD/YYYY */
    let today = new Date();
    let dateString = (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear();
    return dateString;
}

function getRandomInt(max) {
	/* Returns a random int between 0 and the max argument */
	return Math.floor(Math.random() * Math.floor(max));
}

module.exports = {
    getDate: getDate,
    getRandomInt: getRandomInt
}