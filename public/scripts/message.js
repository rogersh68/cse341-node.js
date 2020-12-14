$(document).ready(function() {
    
    var message = $('#message_fade');
    if (message.html() == "" || message.html() == undefined) {
        message.css("display", "none");
    }
    console.log(message.html());
    setTimeout(function() {
        message.fadeOut();    
    }, 10000);
});