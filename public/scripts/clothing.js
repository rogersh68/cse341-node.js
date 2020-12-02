// AJAX function sends request to clothing controller to generate an outfit
    // then adds the outfit to HTML.
    function generateOutfit(userId) {
        console.log("Generating new outfit...");

        $.post("/generate", {userId:userId}, function(outfit) {
            console.log("back from server with:");
            console.log(outfit);
            console.log(outfit.length);
            // append to output div
            $("#outfit_output").empty();
            
            // check if outfit is empty
            if (outfit.length > 0) {
                outfit.forEach(e => {
                    $("#outfit_output").append("<p>" + e.clothingcolor + " " + e.clothingtype + "</p>");
                });
            }
            else {
                $("#outfit_output").append("<p>Could not generate outfit. Add more items to your closet and try again.</p>");
            }
            
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
            //append each clothing item to output div
            clothes.forEach(e => {
                $("#closet_output").append("<p>" + e.clothingcolor + " " + e.clothingtype + 
                    "<form action='/update' method='POST'>" +
                        "<input type='hidden' name='clothingId' value='" + e.clothingid + "'>" +
                        "<input type='submit' value='Update'>" +
                    "</form>" +
                    "<form action='/delete' method='GET'>" +
                        "<input type='hidden' name='clothingId' value='" + e.clothingid + "'>" +
                        "<input type='submit' value='Delete'>" +
                    "</form" +
                    "</p>");
            });
        })
    }

function prepareUpdate() {
    console.log("Getting all info for clothing item...");
    
    let clothingId = document.getElementById('clothingId').value;
    
    $.post("/prepare-update", {clothingId:clothingId}, function(clothing) {
        console.log("back from the server with:");
        console.log(clothing);
        $("#clothingType").val(clothing.clothingtype);
        $("#clothingColor").val(clothing.clothingcolor);
        $("#warmRating").val(clothing.warmrating);
        $("#casualRating").val(clothing.casualrating);
        $("#clothingImage").val(clothing.clothingimage);
    });
}