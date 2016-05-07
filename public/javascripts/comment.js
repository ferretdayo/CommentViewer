var socket = io();
socket.on('comment data', function(msg){
    $('#comment').append($('<tr>'+ msg+'</tr>'));
});