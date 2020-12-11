setTimeout(function() {
    if ($('#message_fade').value != "") {
        $('#message_fade').fadeOut();
    }
    else {
        $('#message_fade').css("display", "none");
    }
    
}, 10000);