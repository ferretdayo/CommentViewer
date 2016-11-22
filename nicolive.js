// ネットを利用
var net = require('net');
var readline = require('readline');
// Dependencies
var request= require('request');
var cheerio= require('cheerio');

//xss
var validator = require('validator');

var user_session = "";
var broadcastDetail = {};
// Methods
module.exports = {
    //ログイン処理
    login: function(email, pass, res){
        request.post({
            url: 'https://secure.nicovideo.jp/secure/login',
            form: {
                mail_tel: email,
                password: pass,
            },
        },function(error,response){
            //Rejectされた時
            if(error!=null){
                res.redirect(302, "/");
            }
            //Cookieからuser_sessionのデータを取得
            var session= null;
            var cookies= response.headers['set-cookie'] || [];
            for(var i=0; i<cookies.length; i++){
                var cookie= cookies[i];
                if(cookie.match(/^user_session=user_session/)){
                    session= cookie.slice(0,cookie.indexOf(';')+1);
                }
            }
            //sessionがなかった場合
            if(session==null){
                res.redirect(302, "/");
            }
            //Cookieにユーザのセッション情報を保存
            res.cookie('user_session', session);
            res.redirect(302, "/viewer");
        });
    },
    //XMLのスクレイピングからコメントサーバ接続用データ取得
    fetchThread: function(live_id,session,callback){
        broadcastDetail.session = session;
        request({
            url: 'http://live.nicovideo.jp/api/getplayerstatus/'+live_id,
            headers: {
                Cookie: session,
            },
        },function(error,response){
            if(error!=null) return callback(error);

            //XMLのスクレイピング
            var $= cheerio.load(response.body);
            //各情報をローカルに保存
            broadcastDetail.thread = $('getplayerstatus ms thread').text();
            broadcastDetail.port = $('getplayerstatus ms port').text();
            broadcastDetail.addr = $('getplayerstatus ms addr').text();
            broadcastDetail.user_id = $('getplayerstatus user user_id').text();
            broadcastDetail.premium = $('getplayerstatus user is_premium').text();
            broadcastDetail.open_time = $('getplayerstatus stream open_time').text();
            broadcastDetail.start_time = $('getplayerstatus stream start_time').text();

            //CallBack先に渡す値
            callback(null,{
                port: broadcastDetail.port,
                addr: broadcastDetail.addr,
                thread: broadcastDetail.thread,
                broadcast_data : {
                    title: $('getplayerstatus stream title').text(),
                    owner_name: $('getplayerstatus stream owner_name').text(),
                    owner_img: $('getplayerstatus stream thumb_url').text(),
                    comment_count: parseInt($('getplayerstatus stream comment_count').text())+1,
                },
            });
        });
    },
    //コメントサーバに接続
    view: function(thread,callback){
        var viewer= net.connect(thread.port,thread.addr);
        viewer.on('connect', function(){
            viewer.setEncoding('utf-8');
            viewer.write('<thread thread="'+thread.thread+'" res_from="-5" version="20061206" />\0');

            callback(null,viewer);
        });
    },
    //コメントの投稿
    postComment: function(commentdata){
        console.log("comment_no: " + commentdata.no + "\n");
        //postkey取得
        request({
            url: encodeURI('http://live.nicovideo.jp/api/getpostkey?thread=' + broadcastDetail.thread.replace(/(^\s+)|(\s+$)/g, "") + '\&block_no=' + (parseInt(commentdata.no) + 1)/100.0),
            headers: {
                Cookie: broadcastDetail.session,
            }
        },function(error,response, body){
            if(error!=null) return;

            //postkey=ごにょにょ　を取得
            var postkey = response.body;
            //postkeyの値取得
            postkey = postkey.split("=")[1];
            console.log(postkey);

            //vpos計算
            var offsettime = parseInt(broadcastDetail.open_time) - parseInt(broadcastDetail.start_time);
            var nowtime = new Date()/1000;
            var vpos = parseInt(((nowtime - parseInt(broadcastDetail.start_time) + offsettime) * 100));

            //コメントサーバに接続
            var viewer= net.connect(broadcastDetail.port,broadcastDetail.addr);
            //接続後はコメントを投稿する
            viewer.on('connect', function(){
                viewer.setEncoding('utf-8');
                //コメントの投稿
                viewer.write("<chat thread='" + broadcastDetail.thread + "' vpos='" + vpos + "' mail='" + commentdata.comment + "' ticket='" + commentdata.ticket + "' user_id='" + broadcastDetail.user_id + "' postkey='" + postkey + "' premium='" + broadcastDetail.premium + "'>" + validator.escape(commentdata.comment) + "</chat>\0");
            });
        });
    },
}
