const library = require("./functions");

const viewParams = {
	title: "", 
	dateString: library.getDate(), 
	message: "", 
	userName: "",
	userId: 0,
	temp: 0,
};

module.exports = {
    viewParams: viewParams
}