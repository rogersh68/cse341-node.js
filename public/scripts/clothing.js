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