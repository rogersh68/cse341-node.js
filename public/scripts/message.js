var message = $('#message_fade');
if (message.html() == "" || message.html() == undefined) {
    message.css("display", "none");
}

setTimeout(function() {
    message.fadeOut();    
}, 10000);

console.log(message.html());
console.log(message.val());
console.log(message.text());
if (message.empty()) {
    console.log(true);
}
else {
    console.log(false);
}

if (message.contents() == "") {
    console.log(true);
}
else {
    console.log(false);
}

if (message.text() == "") {
    console.log(true);
}
else {
    console.log(false)
}

