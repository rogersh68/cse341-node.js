let message = document.getElementById('message_fade');

setTimeout(function() {
    $('#message_fade').fadeOut();

}, 10000);

if (message.value == "") {
    message.style.display = 'none';
}