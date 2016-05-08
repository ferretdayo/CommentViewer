var express = require('express');
var router = express.Router();

var nicolive = require('../nicolive.js');
var parser = require('xml2js').parseString;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var preSocket = -1;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NicoNicoCommentViewer' });
});
router.post('/', function(req, res, next){
    var broadcastUrl = req.body.url;
    console.log(broadcastUrl);
    var lv = broadcastUrl.split("/");
    lv = lv[lv.length-1].split("?")[0];
    
    var user_session = req.cookies.user_session;
    
    //io.sockets[preSocket].disconnect();
    
    io.on('connection', function(socket){
        preSocket = socket.id;
        console.log(preSocket);
        nicolive.fetchThread(lv,user_session,function(error,thread){
            if(error!=null) throw error;
            nicolive.view(thread,function(error,viewer){
                if(error!=null) throw error;
                viewer.on('data',function(data){
                    console.log(data+"\n");
                    //Socket.ioでクライアント側にコメント来たらemitしたい・・・
                    //まずsocketioとelectron共存できるんかいな・・・
                    parser(data, function(err, result){
                        socket.emit('comment data', result);
                    });
                });
            });
        });
    });
    res.render('index', { title: 'NicoNicoCommentViewer' });
});

//
//io.on('connection', function(socket){
//    console.log("connection");
//    socket.on('comment data', function(msg){
//        console.log('message: ' + msg);
//    });
//});


http.listen(3001, function(){
  console.log('listening on *:3000');
});

module.exports = router;