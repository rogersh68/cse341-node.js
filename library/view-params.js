const library = require("./functions");

const viewParams = {
	title: "", 
	dateString: library.getDate(),
	loggedIn: false, 
	message: "", 
	userId: 1,
	userName: "",
	temp: library.getTemp(),
};

module.exports = {
    viewParams: viewParams
}