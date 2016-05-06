var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/viewer', function(req, res, next) {
  res.render('index', { title: 'NicoNicoCommentViewer' });
});

// ネットを利用
var net = require('net');
var readline = require('readline');
// Dependencies
var request= require('request');
var cheerio= require('cheerio');
var net= require('net');
var userdata = require('../public/javascripts/niconico.js');

// Methods
var nicolive= {
    login: function(id,pw,callback){
        request.post({
            url: 'https://secure.nicovideo.jp/secure/login',
            form: {
                mail_tel: id,
                password: pw,
            },
        },function(error,response){
            if(error!=null) return callback(error);
        
            var session= null;
            var cookies= response.headers['set-cookie'] || [];
            for(var i=0; i<cookies.length; i++){
                var cookie= cookies[i];
                if(cookie.match(/^user_session=user_session/)){
                    session= cookie.slice(0,cookie.indexOf(';')+1);
                }
            }
            if(session==null) return callback(new Error('Invalid user'));

            callback(null,session);
        });
    },
    fetchThread: function(live_id,session,callback){
        request({
            url: 'http://live.nicovideo.jp/api/getplayerstatus/'+live_id,
            headers: {
                Cookie: session,
            },
        },function(error,response){
            if(error!=null) return callback(error);

            //XMLのスクレイピング
            var $= cheerio.load(response.body);
            //CallBack先に渡す値
            callback(null,{
                port: $('getplayerstatus ms port').text(),
                addr: $('getplayerstatus ms addr').text(),
                thread: $('getplayerstatus ms thread').text(),
            });
        });
    },
    view: function(thread,callback){
        var viewer= net.connect(thread.port,thread.addr);
        viewer.on('connect', function(){
            viewer.setEncoding('utf-8');
            viewer.write('<thread thread="'+thread.thread+'" res_from="-5" version="20061206" />\0');

            callback(null,viewer);
        });
    },
}

// Demonstration
process.nextTick(function(){
    var udata = userdata.func();
    // Environment
    var id= udata.mail;
    var pw= udata.pass;
    var live_id= 'lv262166749';
    
    // Boot
    /*
    nicolive.login()
    .then(id, pw , function(error, session){
        if(error!=null) throw error;
    }).then(live_id, session, function(error, thread){
        if(error!=null) throw error;
    }).then(thread, function(error, viewer){
        if(error!=null) throw error;
        viewer.on('data', function(data){
            console.log(data);
        })
    });
    */
    
    nicolive.login(id,pw,function(error,session){
        if(error!=null) throw error;
    
        nicolive.fetchThread(live_id,session,function(error,thread){
            if(error!=null) throw error;
            
            nicolive.view(thread,function(error,viewer){
                if(error!=null) throw error;

                viewer.on('data',function(data){
                    console.log(data);
                });
            });
        });
    });
    
});
module.exports = router;
