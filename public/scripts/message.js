$(document).ready(function() {
    
    var message = $('#message_fade');
    if (message.html() == "" || message.html() == undefined) {
        message.css("display", "none");
    }

    if (message.html() == "Item successfully added." 
    || message.html() == "Item successfully updated."
    || message.html() == "Item successfully deleted.") {
        // success class
        message.addClass("success");
    }

    if (message.html() == "Item was not added, please try again." 
    || message.html() == "Item was not updated, please try again."
    || message.html() == "Item was not deleted, please try again."
    || message.html() == "Could not get information for item. Please try again.") {
        // warning class
        message.addClass("warning");
    }

    setTimeout(function() {
        message.fadeOut();    
    }, 10000);
});