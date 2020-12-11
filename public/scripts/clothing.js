// AJAX function sends request to clothing controller to generate an outfit
// then adds the outfit to HTML.
function generateOutfit(userId) {
    console.log("Generating new outfit...");

    $.post("/generate", {userId: userId}, function(result) {
        console.log("back from server with:");
        console.log(result);

        // set temp
        document.getElementById('temp').innerHTML = result.temp;

        // append to output div
        $("#outfit_output").empty();
        
        // check if outfit is empty
        if (result.outfit.length > 0) {
            result.outfit.forEach(e => {
                $("#outfit_output").append("<p>" + e.clothingcolor + " " + e.clothingtype + "</p>");
            });
        }
        else {
            $("#outfit_output").append("<p>Could not generate outfit. Add more items to your closet and try again.</p>");
        }
    });
}

// AJAX function sends request to clothing controller to get all of the
// user's clothing items, then adds each item to the HTML.
function getCloset(userId) {
    console.log("Getting user's clothes...");

    $.post("/user-clothes", {userId:userId}, function(clothes) {
        console.log("back from server with:");
        console.log(clothes);
        //append each clothing item to output div
        if (clothes.length > 0) {
            clothes.forEach(e => {
                $("#closet_output").append("<div class='output_line'>" + 
                    "<p>" + e.clothingcolor + " " + e.clothingtype + "</p>" +
                    "<form action='/update' method='POST'>" +
                        "<input type='hidden' name='clothingId' value='" + e.clothingid + "'>" +
                        "<input type='submit' value='Update'>" +
                    "</form> | " +
                    "<form action='/delete' method='POST'>" +
                        "<input type='hidden' name='clothingId' value='" + e.clothingid + "'>" +
                        "<input type='submit' value='Delete'>" +
                    "</form>" +
                    "</div>");
            });
        }
        else {
            $("#closet_output").append("<p>Your closet is empty. Add new items to get started.</p>");
        }
    });
}

// AJAX function sends request to clothing controller to get all of the
// info for a specified clothing item, then populates HTML form with the info.
function getClothingInfo() {
    console.log("Getting all info for clothing item...");
    
    let clothingId = document.getElementById('clothingId').value;
    console.log("clothingId: " + clothingId);
    
    $.post("/getInfo", {clothingId:clothingId}, function(clothing) {
        console.log("back from the server with:");
        console.log(clothing);
        $("#clothingType").val(clothing.clothingtype);
        $("#clothingColor").val(clothing.clothingcolor);
        $("#warmRating").val(clothing.warmrating);
        $("#casualRating").val(clothing.casualrating);
        $("#clothingImage").val(clothing.clothingimage);
    });
}