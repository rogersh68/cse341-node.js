var message = $('#message_fade');
if (message.html() == "") {
    message.css("display", "none");
}

setTimeout(function() {
    message.fadeOut();    
}, 10000);

console.log(message.html());