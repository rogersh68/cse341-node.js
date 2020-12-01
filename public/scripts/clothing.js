// AJAX function sends request to clothing controller to generate an outfit
// then adds the outfit to HTML.
function generateOutfit(userId, warmRating) {
    console.log("Generating new outfit...");

    $.post("/generate", {userId:userId, warmRating:warmRating}, function(outfit) {
        console.log("back from server with:");
        console.log(outfit);
        // append to output div
        $("#outfit_output").empty();
        $("#outfit_output").append("<p>" + outfit.clothes[0].clothingtype + "</p>");
        $("#outfit_output").append("<p>" + outfit.clothes[1].clothingtype + "</p>");
    })
}

// Checks if user's closet is empty, adds empty closet notice to HTML
function checkCloset() {
    let closetDiv = document.getElementById('closet_output');
    console.log(closetDiv.children.length);
    if (closetDiv.children.length < 2) {
        let notice = document.createElement('p');
        notice.textContent = "Your closet is empty."
        closetDiv.appendChild(notice);
    }
}

// AJAX function sends request to clothing controller to get all of the
// user's clothing items, then adds each item to the HTML.
function getCloset(userId) {
    console.log("Getting user's clothes...");

    $.post("/user-clothes", {userId:userId}, function(clothes) {
        console.log("back from server with:");
        console.log(clothes);
        //append to output div
        $("#closet_output").append("<p>" + clothes[0].clothingtype + "</p>");
    })
}