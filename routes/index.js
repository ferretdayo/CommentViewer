var express = require('express');
var router = express.Router();

var net = require('net');
var nicolive = require('../nicolive.js');
var parser = require('xml2js').parseString;

const fs = require('fs');

// 証明書のファイルを指定します
var options = {
    key: fs.readFileSync('./key/server_key.pem'),
    cert: fs.readFileSync('./key/cert.pem')
};

//Socket.io用
var app = require('express')();
var https = require('https').createServer(options, app);
var io = require('socket.io')(https);

var preViewer;
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
    if(preViewer != undefined){
        //preViewer.end();
    }
    //io.sockets[preSocket].disconnect();
    //Socket.ioに接続した時の処理
    io.on('connection', function(socket){

        //ニコニコのthreadとportとhost情報を取得
        nicolive.fetchThread(lv,user_session,function(error,thread){
            if(error!=null) throw error;
            socket.emit('broadcast data', thread.broadcast_data);
            //threadとportとhostでTCPでコメントサーバに接続
            nicolive.view(thread,function(error,viewer){
                if(error!=null) throw error;
                //コメントサーバからデータを取得
                viewer.on('data',function(data){
                    preViewer = viewer;
                    console.log(data+"\n");
                    //xmlをjsonに変換し，Viewにデータを送信
                    parser(data, function(err, result){
                        //comment dataにJsonデータを送信(emit)
                        socket.emit('comment data', result);
                        //viewer.end();
                    });
                    //socket.on('disconnect broadcast', function(){
                    //    console.log('disconnect');

                    //})
                });
            });
        });

        //コメントを放送に投稿
        socket.on('post comment', function(postCommentDetail){
            nicolive.postComment(postCommentDetail);
        });
    });
    res.render('index', { title: 'NicoNicoCommentViewer' });
});

//
//io.on('connection', function(socket){
//    console.log("connection");
//    preSocket = socket.id;
//    console.log(preSocket);
//    socket.on('comment data', function(msg){
//        console.log('message: ' + msg);
//    });
//});

//Socket.io用サーバ
https.listen(3001, function(){
  console.log('listening on *:3000');
});

module.exports = router;
