var express = require('express');
var nicolive = require('../nicolive.js');
var router = express.Router();
// ネットを利用
var net = require('net');
var readline = require('readline');
// Dependencies
var request= require('request');
var cheerio= require('cheerio');
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'NicoNicoCommentViewer' });
});
router.post('/', function(req, res, next){
    console.log("post");
    var email = req.body.email;
    var pass = req.body.password;
    console.log(email);
    console.log(pass);
    //Login処理
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
})

module.exports = router;
