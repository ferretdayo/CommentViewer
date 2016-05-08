var socket = io.connect('http://localhost:3001');
//var socket = new io.Socket('localhost');
socket.connect();
socket.on('comment data', function(msg){
    if(msg.hasOwnProperty('chat')){
        console.table(msg.chat);
        if(msg.chat.$.hasOwnProperty('premium')){
            $('#comment').append($('<tr><td>' + msg.chat.$.user_id + '</td><td>' + msg.chat._ + '</td><td>' + msg.chat.$.premium + '</td></tr>'));
        }else{
            $('#comment').append($('<tr><td>' + msg.chat.$.user_id + '</td><td>' + msg.chat._ + '</td><td>一般会員</td></tr>'));
        }   
    }
});
socket.on('disconnect', function(){
    console.log("放送終わりました");
})